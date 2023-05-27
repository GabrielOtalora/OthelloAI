class CustomPlayerMutant extends Agent {
    constructor() {
        super()
        this.board = new Board();
        this.turns = (this.player === 'W' ? 1 : 0);
        this.fase1 = 0;
        this.fase2 = 0;
        this.fase3 = 0;
        this.POSITION_SCORES = [];
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
        this.turns += 2;
        this.fase1 = Math.floor((Math.pow(this.size, 2) - 4) / 3);
        this.fase2 = Math.floor(((Math.pow(this.size, 2) - 4) / 3) * 2);
        this.fase3 = Math.floor((Math.pow(this.size, 2)));
        const matrix = this.convert(board);
        return this.alphaBetaMove(matrix, (this.color === 'W' ? 1 : -1), 1);

    }

    copyAndExecute(board, row, col, player) {
        let newBoard = []
        for (let i = 0; i < this.size; i++) {
            newBoard = [...newBoard, board[i].slice()];
        }


        let j, i, k, l, acumulado = 0;
        //to left
        for (j = col - 1; j >= 0; j--) {
            if (col - 1 >= 0) {
                if (newBoard[row][col - 1] === player || newBoard[row][col - 1] === 0) break;
            }
            if (newBoard[row][j] === player && j !== col - 1) {
                for (k = col - 1; k > j; k--)newBoard[row][k] = player;
                break;
            }
            if (newBoard[row][j] === 0 && j !== col - 1) {
                break;
            }
        }
        //to right
        for (j = col + 1; j < this.size; j++) {
            if (col + 1 < this.size) {
                if (newBoard[row][col + 1] === player || newBoard[row][col + 1] === 0) break;
            }
            if (newBoard[row][j] === player && j !== col + 1) {
                for (k = col + 1; k < j; k++)newBoard[row][k] = player;
                break;
            }
            if (newBoard[row][j] === 0 && j !== col + 1) break;
        }
        //to up
        for (i = row - 1; i >= 0; i--) {
            if (row - 1 >= 0) {
                if (newBoard[row - 1][col] === player || newBoard[row - 1][col] === 0) break;
            }
            if (newBoard[i][col] === player && i !== row - 1) {
                for (l = row - 1; l > i; l--)newBoard[l][col] = player;
                break;
            }
            if (newBoard[i][col] === 0 && i !== row - 1) break;
        }
        //to down
        for (i = row + 1; i < this.size; i++) {
            if (row + 1 < this.size) {
                if (newBoard[row + 1][col] === player || newBoard[row + 1][col] === 0) break;
            }
            if (newBoard[i][col] === player && i !== row + 1) {
                for (l = row + 1; l < i; l++)newBoard[l][col] = player;
                break;
            }
            if (newBoard[i][col] === 0 && i !== row + 1) break;

        }

        //left-up
        j = col - 2;
        i = row - 2;

        while (j >= 0 && i >= 0) {

            if (row - 1 >= 0 && col - 1 >= 0) {
                if (newBoard[row - 1][col - 1] === player || newBoard[row - 1][col - 1] === 0) break;
            }
            if (newBoard[i][j] === player) {
                l = row - 1
                k = col - 1
                while (l > i && k > j) {
                    newBoard[l][k] = player
                    l--;
                    k--;
                }
            };
            if (newBoard[i][j] === 0) break;
            j--;
            i--;
        }

        //left-down
        j = col - 2;
        i = row + 2;

        while (j >= 0 && i < this.size) {

            if (row - 1 < this.size && col - 1 >= 0) {
                if (newBoard[row + 1][col - 1] === player || newBoard[row + 1][col - 1] === 0) break;
            }
            if (newBoard[i][j] === player) {
                l = row + 1
                k = col - 1
                while (l < i && k > j) {
                    newBoard[l][k] = player
                    l++;
                    k--;
                }
            }
            if (newBoard[i][j] === 0) break;
            j--;
            i++;
        }
        //right-down
        j = col + 2;
        i = row + 2;

        while (j < this.size && i < this.size) {

            if (row + 1 < this.size && col + 1 < this.size) {
                if (newBoard[row + 1][col + 1] === player || newBoard[row + 1][col + 1] === 0) break;
            }
            if (newBoard[i][j] === player) {
                l = row + 1
                k = col + 1
                while (l < i && k < j) {
                    newBoard[l][k] = player
                    l++;
                    k++;
                }
            }
            if (newBoard[i][j] === 0) break;
            j++;
            i++;
        }

        //right-up
        j = col + 2;
        i = row - 2;

        while (j < this.size && i > 0) {

            if (row - 1 >= 0 && col + 1 < this.size) {
                if (newBoard[row - 1][col + 1] === player || newBoard[row - 1][col + 1] === 0) break;
            }
            if (newBoard[i][j] === player) {
                l = row - 1
                k = col + 1
                while (l > i && k < j) {
                    newBoard[l][k] = player;
                    l--;
                    k++;
                }
            }
            if (newBoard[i][j] === 0) break;
            j++;
            i--;
        }

        newBoard[row][col] = player;

        return newBoard;
    }
    alphaBetaMove(board, player, level) {
        if (this.terminal(board) === true) return []
        if (player === 1) {
            let bestMove, temp;
            let value = -Infinity;
            let moves = this.mobility_moves(board, 1);
            if (moves.length === 0) {
                this.alphaBetaSearch(board, -1, -Infinity, Infinity, level + 1)
            } else {
                for (var i = 0; i < moves.length; i++) {
                    let temp = value;
                    const [fil, col] = moves[i];
                    const newBoard = this.copyAndExecute(board, fil, col, 1);
                    console.log('En alpha beta + : ' + player)
                    console.log(newBoard)
                    value = Math.max(value, this.alphaBetaSearch(newBoard, -1, -Infinity, Infinity, level + 1))
                    if (value > temp) bestMove = moves[i]
                }
                return bestMove
            }
        } else {
            let bestMove, temp
            let value = Infinity
            let moves = this.mobility_moves(board, -1)
            if (moves.length === 0) {
                this.alphaBetaSearch(board, 1, -Infinity, Infinity, level + 1)
            } else {

                for (var i = 0; i < moves.length; i++) {
                    let temp = value
                    const [fil, col] = moves[i];
                    const newBoard = this.copyAndExecute(board, fil, col, -1);
                    value = Math.min(value, this.alphaBetaSearch(newBoard, 1, -Infinity, Infinity, level + 1))
                    if (value < temp) bestMove = moves[i]
                }
                return bestMove
            }

        }
    }

    alphaBetaSearch(board, player, alpha, beta, level) {
        let i;
        //if (this.turns < this.fase1 && level === 3 || this.size <= 4)return this.heuristicValue2(board,player)
        //if(this.turns >=this.fase1 && this.turns < this.fase2 && level === 3)return this.heuristicValue5(board,player)
        //if((this.turns >=this.fase2 && level === 4) || this.terminal(board))return this.heuristicValue4(board,player)
        if ((this.turns >= 0  && level === 4)) return this.evaluate(board, player)



        if (player === 1) {
            let value = -Infinity
            let moves = this.mobility_moves(board, 1)
            if (moves.length === 0) {
                return this.alphaBetaSearch(board, -1, alpha, beta, level + 1)
            } else {
                for (i = 0; i < moves.length; i++) {
                    const [fil, col] = moves[i];
                    const newBoard = this.copyAndExecute(board, fil, col, player);
                    value = Math.max(value, this.alphaBetaSearch(newBoard, -1, alpha, beta, level + 1))
                    if (value >= beta) return value
                    alpha = Math.max(alpha, value)
                }
                return value
            }
        } else {
            let value = Infinity
            let moves = this.mobility_moves(board, -1)
            if (moves.length === 0) {
                return this.alphaBetaSearch(board, 1, alpha, beta, level + 1)
            } else {
                for (i = 0; i < moves.length; i++) {
                    const [fil, col] = moves[i];
                    const newBoard = this.copyAndExecute(board, fil, col, player);
                    value = Math.min(value, this.alphaBetaSearch(newBoard, 1, alpha, beta, level + 1))
                    if (value <= alpha) return value
                    beta = Math.min(beta, value)
                }
                return value
            }

        }
    }

    // Determines if the state is terminal or not
    terminal(board) {

        var check_one = this.mobility(board, 1);
        var check_two = this.mobility(board, -1);
        return ((check_one === 0) && (check_two === 0));

    }
    mobility(board, player) {
        let moves = 0;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++)
                if (this.isMove(board, player, i, j)) {
                    moves++;
                }
        }
        return moves;
    }

    mobility_moves(board, player) {
        let moves = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++)
                if (this.isMove(board, player, i, j)) {
                    moves = [...moves, [i, j]];
                }
        }
        return moves;
    }

    isMove(board, player, row, col) {
        let j, i;
        if (board[row][col] !== 0) return false;

        //to left
        for (j = col - 1; j >= 0; j--) {
            if (col - 1 >= 0) {
                if (board[row][col - 1] === player || board[row][col - 1] === 0) break;
            }
            if (board[row][j] === player && j !== col - 1) return true;
            if (board[row][j] === 0 && j !== col - 1) break;
        }
        //to right
        for (j = col + 1; j < this.size; j++) {
            if (col + 1 < this.size) {
                if (board[row][col + 1] === player || board[row][col + 1] === 0) break;
            }
            if (board[row][j] === player && j !== col + 1) return true;
            if (board[row][j] === 0 && j !== col + 1) break;
        }
        //to up
        for (i = row - 1; i >= 0; i--) {
            if (row - 1 >= 0) {
                if (board[row - 1][col] === player || board[row - 1][col] === 0) break;
            }
            if (board[i][col] === player && i !== row - 1) return true;
            if (board[i][col] === 0 && i !== row - 1) break;
        }
        //to down
        for (i = row + 1; i < this.size; i++) {
            if (row + 1 < this.size) {
                if (board[row + 1][col] === player || board[row + 1][col] === 0) break;
            }
            if (board[i][col] === player && i !== row + 1) return true;
            if (board[i][col] === 0 && i !== row + 1) break;

        }

        //left-up
        j = col - 2;
        i = row - 2;

        while (j >= 0 && i >= 0) {

            if (row - 1 >= 0 && col - 1 >= 0) {
                if (board[row - 1][col - 1] === player || board[row - 1][col - 1] === 0) break;
            }
            if (board[i][j] === player) { return true }
            if (board[i][j] === 0) break;
            j--;
            i--;
        }

        //left-down
        j = col - 2;
        i = row + 2;

        while (j >= 0 && i < this.size) {

            if (row - 1 < this.size && col - 1 >= 0) {
                if (board[row + 1][col - 1] === player || board[row + 1][col - 1] === 0) break;
            }
            if (board[i][j] === player) { return true };
            if (board[i][j] === 0) break;
            j--;
            i++;
        }
        //right-down
        j = col + 2;
        i = row + 2;

        while (j < this.size && i < this.size) {

            if (row + 1 < this.size && col + 1 < this.size) {
                if (board[row + 1][col + 1] === player || board[row + 1][col + 1] === 0) break;
            }
            if (board[i][j] === player) { return true };
            if (board[i][j] === 0) break;
            j++;
            i++;
        }

        //right-up
        j = col + 2;
        i = row - 2;

        while (j < this.size && i > 0) {

            if (row - 1 >= 0 && col + 1 < this.size) {
                if (board[row - 1][col + 1] === player || board[row - 1][col + 1] === 0) break;
            }
            if (board[i][j] === player) { return true };
            if (board[i][j] === 0) break;
            j++;
            i--;
        }



        return false;
    }

    inner_coin(board, i, j) {
        if (i - 1 > 0) {
            if (j - 1 > 0) if (board[i - 1][j - 1] === 0) return false;
            if (board[i - 1][j] === 0) return false;
            if (j + 1 < this.size) if (board[i - 1][j + 1] === 0) return false;
        }
        if (j - 1 > 0) if (board[i][j - 1] === 0) return false;
        if (j + 1 < this.size) if (board[i][j + 1] === 0) return false;
        if (i + 1 < this.size) {
            if (j - 1 > 0) if (board[i + 1][j - 1] === 0) return false;
            if (board[i + 1][j] === 0) return false;
            if (j + 1 < this.size) if (board[i + 1][j + 1] === 0) return false;
        }
        return true

    }

    // In case of terminal state returns the value for terminal state


    convert(board) {
        let matrix = [];
        for (let i = 0; i < this.size; i++) {
            matrix = [...matrix, Array(this.size).fill(0)]
        }
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                if (board[i][j] === '') matrix[i][j] = 0;
                if (board[i][j] === 'W') matrix[i][j] = 1;
                if (board[i][j] === 'B') matrix[i][j] = -1;
            }
        }
        console.log(matrix);
        return matrix;
    }

    heuristicValue2(board, player) {
        return (this.mobility(board, player) - this.mobility(board, player * -1)) * player
    }
    heuristicValue3(player) {
        let score = 0

        for (let i = 0; i < 8; i++) {
            for (let j = 1; j < 8; j++) {
                score += (this.numberMatrix[i][j] * this.POSITION_SCORES_2[i][j])
            }
        }
        let mobility_1 = this.mobility(1)
        let mobility_2 = this.mobility(-1)

        if (player === 1) {
            return (score) + 2 * (mobility_1 - mobility_2)
        } else {
            return ((score * -1)) + 2 * (mobility_1 - mobility_2)
        }
    }

    heuristicValue4(board, player) {
        let count = 0
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (board[i][j] == player) {
                    count++;
                }
            }
        }
        return count * player;
    }

    heuristicValue5(board, player) {
        let value = 0;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (board[i][j] === player && this.inner_coin(board, i, j)) {
                    value++;
                }
            }
        }
        return value * player;
    }
    evaluate(board, player) {
        //console.log(1);
        let color = "";
        let rcolor = "";
        if (player === 1) {
            color = "W";
            rcolor = "B";
        } else {
            color = "B";
            rcolor = "W";
        }

        const pieceValue = 1; // Weight for each piece on the board
        const mobilityValue = 5; // Weight for each possible move
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
                } else if (board[i][j] !== " ") {
                    opponentScore += this.POSITION_SCORES[i][j];

                }
            }
        }
        playerMoves = this.board.valid_moves(board, color).length;
        playerMoves = this.board.valid_moves(board, rcolor).length;
        const playerScoreTotal =
            playerScore +
            playerMoves * mobilityValue

        const opponentScoreTotal =
            opponentScore + opponentMoves * mobilityValue
        return playerScoreTotal - opponentScoreTotal;
    }
}