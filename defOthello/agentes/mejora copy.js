class EEAPlayerG extends Agent {
    constructor() {
        super();
        this.board = new Board();
        this.POSITION_SCORES = [];
    }

    compute(board, time) {
        function crearMCompleta() {
            const TAMANO = board.length;
            const NUMANILLOS = TAMANO / 2;
            
            const anillos = new Array(NUMANILLOS).fill().map(_ => new Array(NUMANILLOS).fill(0));
            let caso1 = false;
            if (TAMANO % 4 == 0) {
                caso1 = true;
            }
            for (let i = 0; i < NUMANILLOS; i++) {
                let numPartesAnillo = (i + 1);
                for (let j = 0; j < numPartesAnillo; j++) {
                    //El tamaño del tablero es divisible por 4? 
                    if (caso1) {
                        if (i % 2 != 0) {
                            anillos[i][0] = numPartesAnillo + 2;
                            anillos[i][j] = numPartesAnillo + 1;
                        } else if (i % 2 == 0) {
                            anillos[i][0] = 0;
                            anillos[i][j] = 1;
                        }
                    }
                    //El tamaño del tablero no es divisible por 4?
                    if (!caso1) {
                        if (i % 2 == 0) {
                            anillos[i][0] = numPartesAnillo + 2;
                            anillos[i][j] = numPartesAnillo + 1;
                        } else if (i % 2 != 0) {
                            anillos[i][0] = 0;
                            anillos[i][j] = 1;
                        }
                    } else if (i == 0) {
                        anillos[0][j] = 2;
                    } if (i == NUMANILLOS - 1) {
                        anillos[i][0] = (NUMANILLOS + 1) * 5;
                        anillos[i][1] = 0;
                        anillos[i][2] = numPartesAnillo + 2;
                    }
                }
            }
            //Formar una cuarta parte de la matriz
            const cuarto = new Array(NUMANILLOS).fill().map(_ => new Array(NUMANILLOS).fill(0));
            for (let i = 0; i < NUMANILLOS; i++) {
                for (let j = NUMANILLOS - 1; j >= 0; j--) {
                    cuarto[i][j] = anillos[NUMANILLOS - j - 1][i - j];
                    cuarto[j][i] = anillos[NUMANILLOS - j - 1][i - j];
                }
            }
            const completa = new Array(TAMANO).fill().map(_ => new Array(TAMANO).fill(0));
            for (let i = 0; i < NUMANILLOS; i++) {
                let reves = cuarto[i].slice().reverse()
                let fila = (cuarto[i]).concat(reves);
                completa[i] = fila//ncuarto[i].reverse().concat(ncuarto[i]);
                completa[TAMANO - i - 1] = fila
            }
            console.log(completa);
            return completa;
        }                
        
        this.POSITION_SCORES = crearMCompleta();
        
        
        
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
        //console.log("Elapsed Time:", elapsedTime);

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
        
        const pieceValue = 1; // Weight for each piece on the board
        const mobilityValue = 2; // Weight for each possible move
        const cornerValue = 3; // Weight for each piece in a corner
        const edgeValue = 1.5; // Weight for each piece on an edge

        let playerScore = 0;
        let opponentScore = 0;
        let playerMoves = 0;
        let opponentMoves = 0;
        let playerCorners = 0;
        let opponentCorners = 0;
        let playerEdges = 0;
        let opponentEdges = 0;

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === color) {
                    playerScore += this.POSITION_SCORES[i][j];
                    playerMoves += this.board.valid_moves(board, color).length;
                } else if (board[i][j] !== " ") {
                    opponentScore += this.POSITION_SCORES[i][j];
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