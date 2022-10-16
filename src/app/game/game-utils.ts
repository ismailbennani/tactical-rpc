import { Board, Cell, GameState, Pawn, Player } from './game-types';

export const at = (G: GameState, position: number): Cell => {
  for (const [player, pawns] of G.playersPawns) {
    for (const p of pawns) {
      if (p.position === position) {
        return { player, pawn: p.pawn };
      }
    }
  }

  return undefined;
};

export const positionOf = (G: GameState, player: Player, pawn: Pawn) => {
  const playerEntry = G.playersPawns.find(([p, _]) => p === player);
  if (!playerEntry) {
    return null;
  }

  const [_, playerPawns] = playerEntry;
  const playerPawn = playerPawns.find(p => p.pawn === pawn);
  if (!playerPawn) {
    return null;
  }

  return playerPawn.position;
};

export const hasPawn = (G: GameState, player: Player, pawn: Pawn) => !!positionOf(G, player, pawn);

export const index = (board: Board, i: number, j: number): number => i * board.size + j;

export const position = (board: Board, index: number): [number, number] => [
  Math.floor(index / board.size),
  index % board.size,
];

export const getStartingArea = (G: GameState, player: Player): number[] => {
  const entry = G.startingAreas.find(([p, _]) => p === player);
  if (!entry) {
    return [];
  }
  const [_, area] = entry;

  return area;
};
