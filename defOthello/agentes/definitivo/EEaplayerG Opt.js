class EEAPlayerNo extends Agent {
    constructor() {
        super();
        this.board = new Board();
        this.POSITION_SCORES = [];
        this.c = 0;
    }

    compute(board, time) {
        function crearMCompleta() {
            let TAMANO = board.length;
            let impar = false;
            if (TAMANO % 2 != 0) {
                impar = true;
                TAMANO += 1;
            }
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
                        anillos[i][0] = (NUMANILLOS + 1) * 2;
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

                if (impar) {
                    fila.splice(NUMANILLOS - 1, 1);
                }
                completa[i] = fila//ncuarto[i].reverse().concat(ncuarto[i]);        
                completa[TAMANO - i - 1] = fila
            }
            if (impar) {
                completa.splice(NUMANILLOS - 1, 1)
            }
            return completa;
        }

        this.POSITION_SCORES = crearMCompleta();

        const startTime = performance.now();
        const depth = 4;
        const moves = this.board.valid_moves(board, this.color);

        // Use the Minimax algorithm with alpha-beta pruning to find the best move
        let bestMove = this.minimax(
            board,
            this.color,
            depth,
            -Infinity,
            Infinity,
            2
        ).move;
        if (bestMove === null) {
            bestMove = moves[0];
        }
        return bestMove;
    }

    minimax(board, color, depth, alpha, beta, nscore) {
        const moves = this.board.valid_moves(board, color);
        console.log(1);

        // Maximum depth or no left moves
        if (depth === 0 || moves.length === 0) {
            //console.log(nscore);
            return {
                nscore,
                move: null,
            };
        }

        let bestScore = color === this.color ? -Infinity : Infinity;
        let bestMove = null;

        for (let i = 0; i < moves.length; i++) {
            const [row, col] = moves[i];
            const newBoard = this.board.clone(board);

            //this.board.move(newBoard, row, col, color);
            nscore += this.makeMove(newBoard, row, col, color);

            const nextColor = color === "W" ? "B" : "W";
            const result = this.minimax(
                newBoard,
                nextColor,
                depth - 1,
                alpha,
                beta,
                nscore
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
    makeMove(board, row, col, color) {
        this.c += 1;
        let fliped = [];
        let score = 0;
        const TAMANO = board.length;
        const directions = [
            [0, 1], // right
            [0, -1], // left
            [1, 0], // down
            [-1, 0], // up
            [1, 1], // diagonal down-right
            [1, -1], // diagonal down-left
            [-1, 1], // diagonal up-right
            [-1, -1], // diagonal up-left
        ];
        board[row][col] = color
        var rcolor = color == 'W' ? 'B' : 'W'
        for (let i = 0; i < directions.length; i++) {
            let temp = [];
            const [deltaRow, deltaCol] = directions[i];
            let currentRow = row + deltaRow;
            let currentCol = col + deltaCol;
            if (currentRow < TAMANO && currentRow >= 0 && currentCol < TAMANO && currentCol >= 0) {
                while (board[currentRow][currentCol] == rcolor) {
                    temp.push([currentRow, currentCol]);
                    if (currentRow + deltaRow < TAMANO && currentRow + deltaRow >= 0 && currentCol + deltaCol < TAMANO && currentCol + deltaCol >= 0) {
                        currentRow = currentRow + deltaRow;
                        currentCol = currentCol + deltaCol;
                    } else {
                        break;
                    }
                    if (currentRow < TAMANO && currentRow >= 0 && currentCol < TAMANO && currentCol >= 0) {
                        if (board[currentRow][currentCol] == color) {
                            fliped.push(temp);
                            //Voltear las piezas
                            for (let k = 0; k < temp.length; k++) {
                                const [x, y] = temp[k];
                                board[x][y] = color;
                                score += 1;// this.POSITION_SCORES[x][y];
                            }
                        }
                    }
                }
            }
        }
        return score;
    }

    evaluate(board, color) {
        //console.log(1);

        const pieceValue = 1; // Weight for each piece on the board
        const mobilityValue = 2; // Weight for each possible move
        const cornerValue = 3; // Weight for each piece in a corner
        const edgeValue = 1.5; // Weight for each piece on an edge

        let playerScore = 0;
        let opponentScore = 0;
        let playerMoves = 0;
        let opponentMoves = 0;


        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === color) {
                    playerScore += this.POSITION_SCORES[i][j];
                    playerMoves += this.board.valid_moves(board, color).length;
                } else if (board[i][j] !== " ") {
                    opponentScore += 1//this.POSITION_SCORES[i][j];
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

