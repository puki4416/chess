import Board from "./board";
import PieceFactory from "./pieceFactory";
import input from "./input";
import InputError from "./error";
import { Piece } from "./piece";

class GameManager {
  board: Board;
  turn: string;
  error;

  constructor() {
    const factory = new PieceFactory();
    const pieces = factory.makePieces();
    this.board = new Board(pieces);
    this.turn = "black";
    this.error = new InputError();
  }

  changeTurn() {
    if (this.turn === "black") this.turn = "white";
    this.turn = "black";
  }

  async getPickPiecePosition(board: (Piece | null)[][]) {
    while (true) {
      const inputValue = await input.possibleMoveQuery();
      const errorCheckResult =
        this.error.checkInputIsTwoNumberWithSpace(inputValue);

      if (typeof errorCheckResult === "string") {
        console.log(errorCheckResult);
        continue;
      }

      if (
        board[errorCheckResult[0]][errorCheckResult[1]]?.isSameColor(
          this.turn
        ) === false
      ) {
        console.log(
          `내 체스말만 선택할수 있습니다. 현재는 ${this.turn}의 차례입니다`
        );
        continue;
      }

      const possibleMove = board[errorCheckResult[0]][
        errorCheckResult[1]
      ]?.getPossibleMove(this.board);

      if (possibleMove?.length === 0) {
        console.log("이동가능한 경로가 없습니다. 다른말을 선택해주세요");
        continue;
      }

      console.log(
        "가능한 이동경로는 다음과같습니다",
        board[errorCheckResult[0]][errorCheckResult[1]]?.getPossibleMove(
          this.board
        )
      );

      return errorCheckResult;
    }
  }

  async getPickPieceMovePosition(
    board: (Piece | null)[][],
    x: number,
    y: number
  ) {
    while (true) {
      const inputValue = await input.realMoveQuery();
      const errorCheckResult =
        this.error.checkInputIsTwoNumberWithSpace(inputValue);

      if (typeof errorCheckResult === "string") {
        console.log(errorCheckResult);
        continue;
      }

      return board[x][y]?.move(
        errorCheckResult[0],
        errorCheckResult[1],
        this.board
      );
    }
  }

  async viewBoard(board: (Piece | null)[][]) {
    const viewBoard = board
      .map((row) =>
        row
          .map((piece) => {
            if (piece === null) return "-";
            return piece.makeName();
          })
          .join("")
      )
      .join("\n");
    console.log(viewBoard);
  }

  async play() {
    while (true) {
      console.log(`${this.turn}의 차례입니다.`);
      const board = this.board.makeBoardArray();
      this.viewBoard(board);

      const [x, y] = await this.getPickPiecePosition(board);
      await this.getPickPieceMovePosition(board, x, y);

      this.changeTurn();
    }
  }
}

export default GameManager;
