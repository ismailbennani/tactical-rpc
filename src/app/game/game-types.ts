export type Player = string;

export enum BoardShape {
  Square = 'square',
}

export type Board = {
  shape: BoardShape;
  size: number;
};

export interface GameState {
  board: Board;
  playersPawns: [Player, PositionedPawn[]][];

  startingAreas: [Player, number[]][];
}

export enum Pawn {
  Rock = 'rock',
  Paper = 'paper',
  Scissor = 'scissor',
}

export const PAWNS = [Pawn.Rock, Pawn.Paper, Pawn.Scissor];

export type Cell = undefined | { player: string; pawn: Pawn };
export type PositionedPawn = { pawn: Pawn; position: number };

export type GamePhase = 'place' | 'play';
