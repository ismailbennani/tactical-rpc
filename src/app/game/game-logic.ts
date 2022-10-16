import { Board, GameState, Pawn, PAWNS, Player } from './game-types';
import { INVALID_MOVE } from 'boardgame.io/core';
import { at, getStartingArea, index } from './game-utils';

export const startingArea = (board: Board, player: Player): number[] => {
  const noMansLandSize = Math.max(1, Math.floor(board.size / 4));
  const startingAreaSize = Math.floor((board.size - noMansLandSize) / 2);

  const result = [];

  switch (player) {
    case '0':
      for (let i = 0; i < startingAreaSize; i++) {
        for (let j = 0; j < board.size; j++) {
          result.push(index(board, i, j));
        }
      }
      break;
    case '1':
      for (let i = board.size - startingAreaSize; i < board.size; i++) {
        for (let j = 0; j < board.size; j++) {
          result.push(index(board, i, j));
        }
      }
      break;
    default:
      break;
  }

  return result;
};

export const placePawn = (
  { G, playerID: player }: { G: GameState; playerID: Player },
  position: number,
  pawn: Pawn
): typeof INVALID_MOVE | GameState => {
  if (
    isNaN(position) ||
    position < 0 ||
    position >= G.board.size * G.board.size ||
    !getStartingArea(G, player).includes(position) ||
    !!at(G, position)
  ) {
    return INVALID_MOVE;
  }

  let playerEntry = G.playersPawns.find(([p, _]) => p === player);
  if (!playerEntry) {
    playerEntry = [player, []];
    G.playersPawns.push(playerEntry);
  }

  const [_, playerPawns] = playerEntry;

  if (playerPawns.find(p => p.pawn === pawn)) {
    return INVALID_MOVE;
  }

  playerPawns.push({ pawn, position });

  return void 0;
};

export const endPlacePhase = ({ G }: { G: GameState }): boolean => {
  for (const [_, pawns] of G.playersPawns) {
    if (pawns.length < PAWNS.length) {
      return false;
    }
  }

  return true;
};

export const endGame = ({ G, ctx }) => {
  if (ctx.phase !== 'play') {
    return false;
  }

  const alive = G.playersPawns.filter(([_, pawns]) => pawns.length > 0);

  if (alive.length === 1) {
    return { winner: alive[0][0] };
  } else if (alive.length === 0) {
    return { draw: true };
  }

  return false;
};
