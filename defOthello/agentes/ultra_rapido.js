class CustomPlayer extends Agent{
    constructor(){
        super()
        this.board = new Board();
        this.turns = (this.player === 'W'?1:0);
        this.fase1 = 0;
        this.fase2 = 0;
        this.fase3 = 0;
        this.fase4 = 0;
        this.fase5 = 0;
        this.fase6 = 0;

    }

    compute(board, time){
        this.turns += 2;
        this.fase1 = Math.floor((Math.pow(this.size,2)-4)/6);
        this.fase2 = Math.floor(((Math.pow(this.size,2)-4)/6)*2);
        this.fase3 = Math.floor(((Math.pow(this.size,2)-4)/6)*3);
        this.fase4 = Math.floor(((Math.pow(this.size,2)-4)/6)*4);
        this.fase5 = Math.floor(((Math.pow(this.size,2)-4)/6)*5);
        this.fase6 = Math.floor((Math.pow(this.size,2)-4));

        const matrix = this.convert(board);
        return this.alphaBetaMove(matrix,(this.color==='W'?1:-1),1);

    }

    copyAndExecute(board,row,col,player){
        let newBoard = []
        for(let i=0;i<this.size;i++){
            newBoard = [...newBoard,board[i].slice()];
        }


        let j,i,k,l,acumulado = 0;
        //to left
        for(j = col-1;j>=0;j--){
            if(col - 1 >= 0) {
                if (newBoard[row][col - 1] === player || newBoard[row][col - 1] === 0) break;
            }
            if (newBoard[row][j]===player && j!==col-1) {
                for(k = col-1;k>j;k--)newBoard[row][k]=player;
                break;
            }
            if (newBoard[row][j]===0 && j!==col-1){
                break;
            }
        }
        //to right
        for(j = col+1;j<this.size;j++){
            if (col +1 < this.size) {
                if (newBoard[row][col + 1] === player || newBoard[row][col + 1] === 0) break;
            }
            if (newBoard[row][j]===player && j!==col+1) {
                for(k = col+1;k<j;k++)newBoard[row][k]=player;
                break;
            }
            if (newBoard[row][j]===0 && j!==col+1)break;
        }
        //to up
        for(i = row-1;i>=0;i--){
            if (row-1>=0) {
                if (newBoard[row - 1][col] === player || newBoard[row - 1][col] === 0) break;
            }
            if (newBoard[i][col]===player && i!==row-1){
                for(l = row-1;l>i;l--)newBoard[l][col]=player;
                break;
            }
            if (newBoard[i][col]===0 && i!==row-1)break;
        }
        //to down
        for(i = row+1;i<this.size;i++){
            if(row+1<this.size) {
                if (newBoard[row + 1][col] === player || newBoard[row + 1][col] === 0) break;
            }
            if (newBoard[i][col]===player && i!==row+1) {
                for(l = row+1;l<i;l++)newBoard[l][col]=player;
                break;
            }
            if (newBoard[i][col]===0 && i!==row+1)break;

        }

        //left-up
        j=col-2;
        i=row-2;

        while(j>=0 && i>=0){

            if(row-1>=0 && col-1>=0) {
                if (newBoard[row - 1][col - 1] === player || newBoard[row - 1][col - 1] === 0) break;
            }
            if(newBoard[i][j]===player){
                l = row -1
                k = col -1
                while(l>i && k>j){
                    newBoard[l][k] = player
                    l--;
                    k--;
                }
            };
            if(newBoard[i][j]===0)break;
            j--;
            i--;
        }

        //left-down
        j=col-2;
        i=row+2;

        while(j>=0 && i<this.size){

            if(row-1<this.size && col-1>=0) {
                if (newBoard[row + 1][col - 1] === player || newBoard[row + 1][col - 1] === 0) break;
            }
            if(newBoard[i][j]===player){
                l = row +1
                k = col -1
                while(l<i && k>j){
                    newBoard[l][k] = player
                    l++;
                    k--;
                }
            }
            if(newBoard[i][j]===0)break;
            j--;
            i++;
        }
        //right-down
        j=col+2;
        i=row+2;

        while(j<this.size && i<this.size){

            if(row+1<this.size && col+1<this.size) {
                if (newBoard[row + 1][col + 1] === player || newBoard[row + 1][col + 1] === 0) break;
            }
            if(newBoard[i][j]===player){
                l = row +1
                k = col +1
                while(l<i && k<j){
                    newBoard[l][k] = player
                    l++;
                    k++;
                }
            }
            if(newBoard[i][j]===0)break;
            j++;
            i++;
        }

        //right-up
        j=col+2;
        i=row-2;

        while(j<this.size && i>0){

            if(row-1>=0 && col+1<this.size) {
                if (newBoard[row - 1][col + 1] === player || newBoard[row - 1][col + 1] === 0) break;
            }
            if(newBoard[i][j]===player){
                l = row -1
                k = col +1
                while(l>i && k<j){
                    newBoard[l][k] = player;
                    l--;
                    k++;
                }
            }
            if(newBoard[i][j]===0)break;
            j++;
            i--;
        }

        newBoard[row][col] = player;

        return newBoard;
    }
    alphaBetaMove(board, player,level) {
        if (this.terminal(board) === true) return []
        if (player === 1) {
            let bestMove, temp;
            let value = -Infinity;
            let moves = this.mobility_moves(board,1);
            if (moves.length === 0) {
                this.alphaBetaSearch(board, -1,-Infinity,Infinity,level+1)
            } else {
                for (var i = 0; i < moves.length; i++) {
                    let temp = value;
                    const [fil,col] = moves[i];
                    const newBoard = this.copyAndExecute(board,fil,col,1);
                    value = Math.max(value, this.alphaBetaSearch(newBoard, -1,-Infinity,Infinity,level+1))
                    if (value > temp) bestMove = moves[i]
                }
                return bestMove
            }
        } else {
            let bestMove, temp
            let value = Infinity
            let moves = this.mobility_moves(board,-1)
            if (moves.length === 0) {
                this.alphaBetaSearch(board, 1,-Infinity,Infinity,level+1)
            } else {

                for (var i = 0; i < moves.length; i++) {
                    let temp = value
                    const [fil,col] = moves[i];
                    const newBoard = this.copyAndExecute(board,fil,col,-1);
                    value = Math.min(value, this.alphaBetaSearch(newBoard, 1,-Infinity,Infinity,level+1))
                    if (value < temp) bestMove = moves[i]
                }
                return bestMove
            }

        }
    }

    alphaBetaSearch(board, player,alpha,beta,level) {
        let i;
        if(this.turns >= 0 && this.turns < this.fase1 && level === 2)return this.heuristicValue1(board,player)
        if(this.turns >= this.fase1 && this.turns < this.fase2 && level === 2)return this.heuristicValue2(board,player)
        if(this.turns >= this.fase2 && this.turns < this.fase3 && level === 2)return this.heuristicValue2(board,player)
        if(this.turns >= this.fase3 && this.turns < this.fase4 && level === 2)return this.heuristicValue2(board,player)
        if(this.turns >= this.fase4 && this.turns < this.fase5 && level === 2)return this.heuristicValue2(board,player)
        if(this.turns >= this.fase5 && level === 3 || this.terminal(board))return this.heuristicValue3(board,player)
        //if((this.turns >= 0  && level === 5) || this.terminal(board))return this.heuristicValue4(board,player)
        //if((this.turns >=this.fase2 && level === 4) || this.terminal(board))return this.heuristicValue4(board,player)



        if (player === 1) {
            let value = -Infinity
            let moves = this.mobility_moves(board,1)
            if (moves.length === 0) {
                return this.alphaBetaSearch(board, -1,alpha,beta,level+1)
            } else {
                for (i = 0; i < moves.length; i++) {
                    const [fil,col] = moves[i];
                    const newBoard = this.copyAndExecute(board,fil,col,player);
                    value = Math.max(value, this.alphaBetaSearch(newBoard, -1,alpha,beta,level+1))
                    if (value >= beta) return value
                    alpha = Math.max(alpha,value)
                }
                return value
            }
        } else {
            let value = Infinity
            let moves = this.mobility_moves(board,-1)
            if (moves.length === 0) {
                return this.alphaBetaSearch(board, 1,alpha,beta,level+1)
            } else {
                for (i = 0; i < moves.length; i++) {
                    const [fil,col] = moves[i];
                    const newBoard = this.copyAndExecute(board,fil,col,player);
                    value = Math.min(value, this.alphaBetaSearch(newBoard, 1,alpha,beta,level+1))
                    if (value <= alpha) return value
                    beta = Math.min(beta,value)
                }
                return value
            }

        }
    }

    // Determines if the state is terminal or not
    terminal(board) {

        var check_one = this.mobility(board,1);
        var check_two = this.mobility(board,-1);
        return ((check_one === 0) && (check_two === 0));

    }
    mobility(board,player){
        let moves = 0;
        for(let i = 0;i<this.size;i++){
            for(let j = 0;j<this.size;j++)
                if(this.isMove(board,player,i,j)){
                    moves++;
                }
        }
        return moves;
    }

    mobility_moves(board,player){
        let moves = [];
        for(let i = 0;i<this.size;i++){
            for(let j = 0;j<this.size;j++)
                if(this.isMove(board,player,i,j)){
                    moves = [...moves,[i,j]];
                }
        }
        return moves;
    }

    isMove(board,player,row,col){
        let j,i;
        if (board[row][col] !== 0) return false;

        //to left
        for(j = col-1;j>=0;j--){
            if(col - 1 >= 0) {
                if (board[row][col - 1] === player || board[row][col - 1] === 0) break;
            }
            if (board[row][j]===player && j!==col-1) return true;
            if (board[row][j]===0 && j!==col-1)break;
        }
        //to right
        for(j = col+1;j<this.size;j++){
            if (col +1 < this.size) {
                if (board[row][col + 1] === player || board[row][col + 1] === 0) break;
            }
            if (board[row][j]===player && j!==col+1) return true;
            if (board[row][j]===0 && j!==col+1)break;
        }
        //to up
        for(i = row-1;i>=0;i--){
            if (row-1>=0) {
                if (board[row - 1][col] === player || board[row - 1][col] === 0) break;
            }
            if (board[i][col]===player && i!==row-1) return true;
            if (board[i][col]===0 && i!==row-1)break;
        }
        //to down
        for(i = row+1;i<this.size;i++){
            if(row+1<this.size) {
                if (board[row + 1][col] === player || board[row + 1][col] === 0) break;
            }
            if (board[i][col]===player && i!==row+1) return true;
            if (board[i][col]===0 && i!==row+1)break;

        }

        //left-up
        j=col-2;
        i=row-2;

        while(j>=0 && i>=0){

            if(row-1>=0 && col-1>=0) {
                if (board[row - 1][col - 1] === player || board[row - 1][col - 1] === 0) break;
            }
            if(board[i][j]===player){ return true}
            if(board[i][j]===0)break;
            j--;
            i--;
        }

        //left-down
        j=col-2;
        i=row+2;

        while(j>=0 && i<this.size){

            if(row-1<this.size && col-1>=0) {
                if (board[row + 1][col - 1] === player || board[row + 1][col - 1] === 0) break;
            }
            if(board[i][j]===player){ return true};
            if(board[i][j]===0)break;
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
            if(board[i][j]===player){ return true};
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
            if(board[i][j]===player){ return true};
            if(board[i][j]===0)break;
            j++;
            i--;
        }



        return false;
    }

    inner_coin(board,i,j){
        if(i-1>0) {
            if(j-1>0)if (board[i - 1][j - 1] === 0) return false;
            if (board[i - 1][j] === 0) return false;
            if(j+1<this.size)if (board[i - 1][j + 1] === 0) return false;
        }
        if(j-1>0)if(board[i][j-1]===0)return false;
        if(j+1<this.size)if(board[i][j+1]===0)return false;
        if(i+1<this.size) {
            if(j-1>0)if (board[i + 1][j - 1] === 0) return false;
            if (board[i + 1][j] === 0) return false;
            if(j+1<this.size)if (board[i + 1][j + 1] === 0) return false;
        }
        return true

    }

    // In case of terminal state returns the value for terminal state


    convert(board){
        let matrix = [];
        for(let i = 0;i<this.size;i++){
            matrix = [...matrix,Array(this.size).fill(0)]
        }
        for(let i = 0;i<board.length;i++){
            for(let j = 0;j < board.length;j++){
                if(board[i][j]==='')matrix[i][j] = 0;
                if(board[i][j]==='W')matrix[i][j] = 1;
                if(board[i][j]==='B')matrix[i][j] = -1;
            }
        }
        return matrix;
    }

    heuristicValue1(board,player){
        return (this.mobility(board,player))*player
    }

    heuristicValue2(board,player){
        let value = 0;
        for(let i = 0;i<this.size;i++){
            for(let j = 0;j<this.size;j++){
                if(board[i][j]*player==1 && this.inner_coin(board,i,j)){
                    value++;
                }else if(board[i][j]!=0){
                    value--;
                }
            }
        }
        return value*player;
    }

    heuristicValue3(board,player){
        let count = 0
        for(let i = 0;i < this.size;i++){
            for(let j = 0; j<this.size;j++){
                if(board[i][j]==player){
                    count += board[i][j]
                }
            }
        }
        return count*player;
    }



}