class EEAPlayerG extends Agent {
    constructor() {
        super();
        this.board = new Board();
        this.valuePlayer = 0;
        this.valueRival = 0;
    }

    compute(board, time){
        this.coins_enemy = 0;
        const startTime = performance.now();
        const depth = 4;

        this.valuePlayer = this.evaluate(board,this.color);
        this.valueRival = (this.evaluate(board,((this.color =='W'?'W':'B'))));

        // Use the Minimax algorithm with alpha-beta pruning to find the best move
        const bestMove = this.minimax(
            board,
            this.color,
            depth,
            -Infinity,
            Infinity,
            this.valuePlayer,
            this.valueRival
        ).move;

        const endTime = performance.now();
        const elapsedTime = endTime - startTime;
        // testing
        console.log("Elapsed Time:", elapsedTime);

        return bestMove;
    }

    minimax(board, color, depth, alpha, beta,valuePlayer,valueRival) {
        const moves = this.board.valid_moves(board, color);

        // Maximum depth or no left moves
        if (depth === 0 || moves.length === 0) {
            return {
                //score: this.evaluate(board, this.color),
                //score: (this.color==='W'?valuePlayer - valueRival:(valuePlayer - valueRival)*-1);
                score: valuePlayer,
                move: null,
            };
        }

        let bestScore = color === this.color ? -Infinity : Infinity;
        let bestMove = null;

        for (let i = 0; i < moves.length; i++) {
            const [row, col] = moves[i];
            const newBoard = this.board.clone(board);
            const [vp,vr] = this.evaluate3(newBoard,color,row,col,valuePlayer,valueRival)
            this.board.move(newBoard, row, col, color);

            const nextColor = color === "W" ? "B" : "W";
            const result = this.minimax(
                newBoard,
                nextColor,
                depth - 1,
                alpha,
                beta,
                vr,
                vp
            );

            if (color === this.color && result.score > bestScore) {
                bestScore = result.score;
                bestMove = moves[i];
                alpha = Math.max(alpha, bestScore);
            } else if (color !== this.color && result.score < bestScore) {
                bestScore = result.score;
                bestMove = moves[i];
                beta = Math.min(beta, bestScore);
            }

            if (beta <= alpha) {
                // Beta cutoff (pruning)
                break;
            }
        }

        return {
            score: bestScore,
            move: bestMove,
        };
    }

    evaluate(board, color) {
        const POSITION_SCORES =
            [[25, 0, 6, 5, 5, 6, 0, 25],
            [0, 0, 1, 1, 1, 1, 0, 0],
            [6, 1, 4, 3, 3, 4, 1, 6],
            [5, 1, 3, 2, 2, 3, 1, 5],
            [5, 1, 3, 2, 2, 3, 1, 5],
            [6, 1, 4, 3, 3, 4, 1, 6],
            [0, 0, 1, 1, 1, 1, 0, 0],
            [25, 0, 6, 5, 5, 6, 0, 25]]


        const mobilityValue = 2; // Weight for each possible move

        let playerScore = 0;
        let opponentScore = 0;
        let playerMoves = 0; 
        let opponentMoves = 0;


        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === color) {
                    playerScore += POSITION_SCORES[i][j];
                    playerMoves += this.board.valid_moves(board, color).length;
                } else if (board[i][j] !== " ") {
                    opponentScore += POSITION_SCORES[i][j];
                    playerMoves += this.board.valid_moves(board, color).length;
                }
            }
        }

        const playerScoreTotal =
            playerScore +
            playerMoves * mobilityValue

        const opponentScoreTotal =
            opponentScore +
            opponentMoves * mobilityValue

        return playerScoreTotal - opponentScoreTotal;
    }
    evaluate2(board, color) {
        const POSITION_SCORES =
            [[25, 0, 6, 5, 5, 6, 0, 25],
                [0, 0, 1, 1, 1, 1, 0, 0],
                [6, 1, 4, 3, 3, 4, 1, 6],
                [5, 1, 3, 2, 2, 3, 1, 5],
                [5, 1, 3, 2, 2, 3, 1, 5],
                [6, 1, 4, 3, 3, 4, 1, 6],
                [0, 0, 1, 1, 1, 1, 0, 0],
                [25, 0, 6, 5, 5, 6, 0, 25]]


        const mobilityValue = 2; // Weight for each possible move

        let playerScore = 0;
        let opponentScore = 0;
        let playerMoves = 0;
        let opponentMoves = 0;


        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === color) {
                    playerScore += POSITION_SCORES[i][j];
                    //playerMoves += this.board.valid_moves(board, color).length;
                } else if (board[i][j] !== " ") {
                    opponentScore += POSITION_SCORES[i][j];
                    //playerMoves += this.board.valid_moves(board, color).length;
                }
            }
        }

        const playerScoreTotal =
            playerScore +
            playerMoves * mobilityValue

        const opponentScoreTotal =
            opponentScore +
            opponentMoves * mobilityValue

        return playerScoreTotal - opponentScoreTotal;
    }


    evaluate3(board,player,row,col,valueP,valueR){
        let j,i;
        valueP++;
        valueR--;
        //to left
        for(j = col-1;j>=0;j--){
            if(col - 1 >= 0) {
                if (board[row][col - 1] === player || board[row][col - 1] === ' ') break;
            }
            if (board[row][j]===player && j!==col-1) {
                let coins = (col-j) - 1;
                valueP += coins;
                valueR -= coins;
                break;
            };
            if (board[row][j]===" " && j!==col-1)break;
        }
        //to right
        for(j = col+1;j<this.size;j++){
            if (col +1 < this.size) {
                if (board[row][col + 1] === player || board[row][col + 1] === 0) break;
            }
            if (board[row][j]===player && j!==col+1) {
                let coins = (j-col) - 1;
                valueP += coins;
                valueR -= coins;
                break;
            };
            if (board[row][j]===" " && j!==col+1)break;
        }
        //to up
        for(i = row-1;i>=0;i--){
            if (row-1>=0) {
                if (board[row - 1][col] === player || board[row - 1][col] === 0) break;
            }
            if (board[i][col]===player && i!==row-1) {
                let coins = (row-i) - 1;
                valueP += coins;
                valueR -= coins;
                break;
            };
            if (board[i][col]===" " && i!==row-1)break;
        }
        //to down
        for(i = row+1;i<this.size;i++){
            if(row+1<this.size) {
                if (board[row + 1][col] === player || board[row + 1][col] === 0) break;
            }

            if (board[i][col]===player && i!==row+1) {
                let coins = (i-row) - 1;
                valueP += coins;
                valueR -= coins;
                break;
            };
            if (board[i][col]===" " && i!==row+1)break;

        }

        //left-up
        j=col-2;
        i=row-2;

        while(j>=0 && i>=0){

            if(row-1>=0 && col-1>=0) {
                if (board[row - 1][col - 1] === player || board[row - 1][col - 1] === ' ') break;
            }
            if(board[i][j]===player){
                let coins = (col - j) - 1;
                valueP += coins;
                valueR -= coins;
                break;
            };
            if(board[i][j]===0)break;
            j--;
            i--;
        }

        //left-down
        j=col-2;
        i=row+2;

        while(j>=0 && i<this.size){

            if(row-1<this.size && col-1>=0) {
                if (board[row + 1][col - 1] === player || board[row + 1][col - 1] === ' ') break;
            }
            if(board[i][j]===player){
                let coins = (col - j) - 1;
                valueP += coins;
                valueR -= coins;
                break;
            };
            if(board[i][j]===" ")break;
            j--;
            i++;
        }
        //right-down
        j=col+2;
        i=row+2;

        while(j<this.size && i<this.size){

            if(row+1<this.size && col+1<this.size) {
                if (board[row + 1][col + 1] === player || board[row + 1][col + 1] === 0) break;
            }
            if(board[i][j]===player){
                let coins = (j-col) - 1;
                valueP += coins;
                valueR -= coins;
                break;
            };
            if(board[i][j]===0)break;
            j++;
            i++;
        }

        //right-up
        j=col+2;
        i=row-2;

        while(j<this.size && i>0){

            if(row-1>=0 && col+1<this.size) {
                if (board[row - 1][col + 1] === player || board[row - 1][col + 1] === 0) break;
            }
            if(board[i][j]===player){
                let coins = (j-col) - 1;
                valueP += coins;
                valueR -= coins;
                break;
            };
            if(board[i][j]===0)break;
            j++;
            i--;
        }



        return [valueP,valueR]

        };
    }




}