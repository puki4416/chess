import { Piece } from "./piece";

class Board {
  pieces: Piece[];

  constructor(pieces: Piece[]) {
    this.pieces = pieces;
  }

  findTargetPiece(x: number, y: number, color: string) {
    return this.pieces.find((piece) => piece.isMyPiece(x, y, color));
  }

  makeBoardArray() {
    const board = new Array(8).fill(0).map(() => new Array<Piece>(8));
    this.pieces
      .filter((piece) => !piece.isDead())
      .forEach((piece) => piece.markPositionToBoard(board));

    return board;
  }
}

export default Board;