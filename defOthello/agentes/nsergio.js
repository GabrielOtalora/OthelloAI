class EEAPlayerPRO extends Agent {
    constructor() {
      super();
      this.board = new Board();
    }

    compute(board, time) {
      const startTime = performance.now();
      const depth = 5;

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
      const pieceValue = 1; // Weight for each piece on the board
      const mobilityValue = 0.1; // Weight for each possible move
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
            playerScore += pieceValue;
            if (
              (i === 0 && j === 0) ||
              (i === 0 && j === board[i].length - 1) ||
              (i === board.length - 1 && j === 0) ||
              (i === board.length - 1 && j === board[i].length - 1)
            ) {
              playerCorners += cornerValue;
            } else if (
              i === 0 ||
              j === 0 ||
              i === board.length - 1 ||
              j === board[i].length - 1
            ) {
              playerEdges += edgeValue;
            }
          } else if (board[i][j] !== " ") {
            opponentScore += pieceValue;
            

            if (
              (i === 0 && j === 0) ||
              (i === 0 && j === board[i].length - 1) ||
              (i === board.length - 1 && j === 0) ||
              (i === board.length - 1 && j === board[i].length - 1)
            ) {
              opponentCorners += cornerValue;
            } else if (
              i === 0 ||
              j === 0 ||
              i === board.length - 1 ||
              j === board[i].length - 1
            ) {
              opponentEdges += edgeValue;
            }
          }
        }
      }
      playerMoves = this.board.valid_moves(board, color).length;
      opponentMoves = this.board.valid_moves(board, color).length;

      const playerScoreTotal =
        playerScore +
        playerMoves * mobilityValue +
        playerCorners +
        playerEdges;
      const opponentScoreTotal =
        opponentScore +
        opponentMoves * mobilityValue +
        opponentCorners +
        opponentEdges;

      return playerScoreTotal - opponentScoreTotal;
       }
      }