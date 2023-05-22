/*own class*/
class CustomPlayer extends Agent {
    constructor() {
        super()
        this.board = new Board()
        this.n = this.board.length;
        this.turns = (this.player === 'W' ? 1 : 0);
        this.POSITION_SCORES =
            [[25, 0, 6, 5, 5, 6, 0, 25],
            [0, 0, 1, 1, 1, 1, 0, 0],
            [6, 1, 4, 3, 3, 4, 1, 6],
            [5, 1, 3, 2, 2, 3, 1, 5],
            [5, 1, 3, 2, 2, 3, 1, 5],
            [6, 1, 4, 3, 3, 4, 1, 6],
            [0, 0, 1, 1, 1, 1, 0, 0],
            [25, 0, 6, 5, 5, 6, 0, 25]]
        this.POSITION_SCORES_2 =
            [[0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 2, 2, 2, 2, 0, 0],
            [0, 2, 12, 4, 4, 12, 2, 0],
            [0, 2, 4, 8, 8, 4, 2, 0],
            [0, 2, 4, 8, 8, 4, 2, 0],
            [0, 2, 12, 4, 4, 12, 2, 0],
            [0, 0, 2, 2, 2, 2, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]]
        this.levelDepth = 0
        this.numberMatrix = [[0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]]
    }

    compute(board, time) {
        this.turns += 2;
        return this.alphaBetaMove(board, this.color, this.turns)
    }
    alphaBetaMove(board, player, level) {
        if (this.terminal(board) == true) return []
        if (player == 'W') {
            let bestMove, temp
            let value = -Infinity
            let moves = this.board.valid_moves(board, 'W')
            if (moves.length == 0) {
                this.alphaBetaSearch(board, 'B', -Infinity, Infinity, level + 1)
            } else {
                for (var i = 0; i < moves.length; i++) {
                    temp = value
                    board[moves[i][0]][moves[i][1]] = 'W'
                    value = Math.max(value, this.alphaBetaSearch(board, 'B', -Infinity, Infinity, level + 1))
                    board[moves[i][0]][moves[i][1]] = ''
                    if (value > temp) bestMove = moves[i]
                }
                return bestMove
            }
        } else {
            let bestMove, temp
            let value = Infinity
            let moves = this.board.valid_moves(board, 'B')
            if (moves.length == 0) {
                this.alphaBetaSearch(board, 'W', -Infinity, Infinity, level + 1)
            } else {

                for (var i = 0; i < moves.length; i++) {
                    temp = value
                    board[moves[i][0]][moves[i][1]] = 'B'
                    value = Math.min(value, this.alphaBetaSearch(board, 'W', -Infinity, Infinity, level + 1))
                    board[moves[i][0]][moves[i][1]] = ''
                    if (value < temp) bestMove = moves[i]
                }
                return bestMove
            }

        }
    }

    alphaBetaSearch(board, player, alpha, beta, level) {
        let i;
        if (this.turns < 5) return this.heuristicValue2(board, player)
        if (this.turns < 12 && level === this.turns + 2) return this.heuristicValue2(board, player)
        if (this.turns < 13 && level === this.turns + 4) return this.heuristicValue4(board, player)
        if (this.turns > 50 && this.terminal(board)) return this.heuristicValue4(board, player)
        if (this.terminal(board) === true) return this.heuristicValue(board, player)


        if (player === 'W') {
            let value = -Infinity
            let moves = this.board.valid_moves(board, 'W')
            if (moves.length == 0) {
                return this.alphaBetaSearch(board, 'B', alpha, beta)
            } else {
                for (i = 0; i < moves.length; i++) {
                    board[moves[i][0]][moves[i][1]] = 'W'
                    value = Math.max(value, this.alphaBetaSearch(board, 'B', alpha, beta))
                    board[moves[i][0]][moves[i][1]] = ''
                    if (value >= beta) return value
                    alpha = Math.max(alpha, value)
                }
                return value
            }
        } else {
            let value = Infinity
            let moves = this.board.valid_moves(board, 'B')
            if (moves.length === 0) {
                return this.alphaBetaSearch(board, 'W', alpha, beta)
            } else {
                for (i = 0; i < moves.length; i++) {
                    board[moves[i][0]][moves[i][1]] = 'B'
                    value = Math.min(value, this.alphaBetaSearch(board, 'W', alpha, beta))
                    board[moves[i][0]][moves[i][1]] = ''
                    if (value <= alpha) return value
                    beta = Math.min(beta, value)
                }
                return value
            }

        }
    }

    // Determines if the state is terminal or not
    terminal(board) {
        var check_one = this.board.valid_moves(board, 'W')
        var check_two = this.board.valid_moves(board, 'B')
        return ((check_one.length === 0) && (check_two.length === 0))
    }

    // In case of terminal state returns the value for terminal state
    heuristicValue(board, player) {
        this.convert(board)
        let score = 0

        for (let i = 0; i < 8; i++) {
            for (let j = 1; j < 8; j++) {
                score += (this.numberMatrix[i][j] * this.POSITION_SCORES[i][j])
            }
        }
        for (let i = 0; i < 8; i++) {
            let row_pieces = [(this.numberMatrix[i][0])];
            let col_pieces = [(this.numberMatrix[0][i])];
            for (let j = 1; j < 8; j++) {
                if (row_pieces[row_pieces.length - 1] * this.numberMatrix[i][j] > 0) {
                    row_pieces[row_pieces.length - 1] += this.numberMatrix[i][j]
                } else {
                    row_pieces.push(this.numberMatrix[i][j])
                }
                if (col_pieces[col_pieces.length - 1] * this.numberMatrix[i][j] > 0) {
                    col_pieces[col_pieces.length - 1] += this.numberMatrix[i][j]
                } else {
                    col_pieces.push(this.numberMatrix[i][j])
                }
                if (row_pieces.length >= 3) {
                    for (let j = 1; j < row_pieces.length - 1; j++) {
                        if (row_pieces[j] != 0) {
                            if (row_pieces[j - 1] * row_pieces[j + 1] == 0 && row_pieces[j - 1] + row_pieces[j + 1] != 0) {
                                score -= row_pieces[j] * 1;
                            }
                        }
                    }
                }
                if (col_pieces.length >= 3) {
                    for (let j = 1; j < col_pieces.length - 1; j++) {
                        if (col_pieces[j] !== 0) {
                            if (col_pieces[j - 1] * col_pieces[j + 1] === 0 && col_pieces[j - 1] + col_pieces[j + 1] != 0) {
                                score -= col_pieces[j] * 1
                            }
                        }
                    }
                }
            }

        }
        /*

        if (this.numberMatrix[0][0] === 0)score -= ((this.numberMatrix[1][0] + this.numberMatrix[0][1] + this.numberMatrix[1][1])*3)
        if (this.numberMatrix[0][7] === 0)score -= ((this.numberMatrix[1][7] + this.numberMatrix[0][6] + this.numberMatrix[1][6])*3)
        if (this.numberMatrix[7][0] === 0)score -= ((this.numberMatrix[7][1] + this.numberMatrix[6][0] + this.numberMatrix[6][1])*3)
        if (this.numberMatrix[7][7] === 0)score -= ((this.numberMatrix[6][7] + this.numberMatrix[7][6] + this.numberMatrix[6][6])*3)
        
         */



        if (player == 'W') {
            var check_one = this.board.valid_moves(board, 'W')
            var check_two = this.board.valid_moves(board, 'B')
            //return (score + 2*(check_one.length - check_two.length))
            return score * -1
        } else {
            var check_one = this.board.valid_moves(board, 'W')
            var check_two = this.board.valid_moves(board, 'B')
            //return ((score*-1) + 2*(check_one.length - check_two.length))
            return score
        }
    }

    convert(board) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                if (board[i][j] == '') this.numberMatrix[i][j] = 0;
                if (board[i][j] == 'W') this.numberMatrix[i][j] = 1;
                if (board[i][j] == 'B') this.numberMatrix[i][j] = -1;
            }
        }
    }
    heuristicValue2(board, player) {
        if (player == 'W') {
            return (this.board.valid_moves(board, 'W').length)
        } else {
            return (this.board.valid_moves(board, 'B').length * -1)
        }

    }
    heuristicValue3(board, player) {
        this.convert(board)
        let score = 0

        for (let i = 0; i < 8; i++) {
            for (let j = 1; j < 8; j++) {
                score += (this.numberMatrix[i][j] * this.POSITION_SCORES_2[i][j])
            }
        }
        let mobility_1 = this.board.valid_moves(board, 'W').length
        let mobility_2 = this.board.valid_moves(board, 'B').length

        if (player == 'W') {
            return (score) + 2 * (mobility_1 - mobility_2)
        } else {
            return ((score * -1)) + 2 * (mobility_1 - mobility_2)
        }
    }
    heuristicValue4(board, player) {
        var minormax = player == 'W' ? 1 : -1
        var size = board.length
        var W = 0
        var B = 0
        for (var i = 0; i < size; i++)
            for (var j = 0; j < size; j++)
                if (board[i][j] == 'W') W++
                else if (board[i][j] == 'B') B++

        return (W - B)
    }
}
