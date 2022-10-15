import { GameState, Pawn, PAWNS, Player } from './game-types';
import { INVALID_MOVE } from 'boardgame.io/core';
import { at } from './game-utils';

export const placePawn = (
  { G, playerID }: { G: GameState; playerID: Player },
  position: number,
  pawn: Pawn
): typeof INVALID_MOVE | GameState => {
  if (isNaN(position) || position < 0 || position >= G.board.size * G.board.size || !!at(G, position)) {
    return INVALID_MOVE;
  }

  let playerEntry = G.playersPawns.find(([p, _]) => p === playerID);
  if (!playerEntry) {
    playerEntry = [playerID, []];
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
