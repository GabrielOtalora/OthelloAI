class EEAPlayerG extends Agent {
    constructor() {
        super();
        this.board = new Board();
    }

    compute(board, time) {
        const startTime = performance.now();
        const depth = 4;

        // Use the Minimax algorithm with alpha-beta pruning to find the best move
        const bestMove = this.minimax(
            board,
            this.color,
            depth,
            -Infinity,
            Infinity
        ).move;

        const endTime = performance.now();
        const elapsedTime = endTime - startTime;
        // testing
        console.log("Elapsed Time:", elapsedTime);

        return bestMove;
    }

    minimax(board, color, depth, alpha, beta) {
        const moves = this.board.valid_moves(board, color);

        // Maximum depth or no left moves
        if (depth === 0 || moves.length === 0) {
            return {
                score: this.evaluate(board, this.color),
                move: null,
            };
        }

        let bestScore = color === this.color ? -Infinity : Infinity;
        let bestMove = null;

        for (let i = 0; i < moves.length; i++) {
            const [row, col] = moves[i];
            const newBoard = this.board.clone(board);
            this.board.move(newBoard, row, col, color);

            const nextColor = color === "W" ? "B" : "W";
            const result = this.minimax(
                newBoard,
                nextColor,
                depth - 1,
                alpha,
                beta
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
}