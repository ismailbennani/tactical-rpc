import { Board, GameState, Pawn, PAWNS, Player, PositionedPawn } from './game-types';
import { INVALID_MOVE } from 'boardgame.io/core';
import { accessibleCells, at, getStartingArea, index, removePawn, resolveFight } from './game-utils';

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
): typeof INVALID_MOVE | void => {
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

export const movePawn = (
  { G, playerID: player }: { G: GameState; playerID: Player },
  pawn: Pawn,
  newPos: number
): typeof INVALID_MOVE | void => {
  if (isNaN(newPos) || newPos < 0 || newPos >= G.board.size * G.board.size) {
    return INVALID_MOVE;
  }

  const playerEntry = G.playersPawns.find(([p, _]) => p === player);
  if (!playerEntry) {
    throw new Error(`Unknown player ${player}`);
  }

  const playerPawn = playerEntry[1]?.find(p => p.pawn === pawn);
  const currentPosition = playerEntry[1]?.find(p => p.pawn === pawn)?.position;
  if (currentPosition === null || currentPosition === undefined) {
    return INVALID_MOVE;
  }

  if (!accessibleCells(G, player, playerPawn.pawn).includes(newPos)) {
    return INVALID_MOVE;
  }

  const pawnAtNewPos = at(G, newPos);

  if (pawnAtNewPos) {
    if (pawnAtNewPos.player === player) {
      return INVALID_MOVE;
    }

    switch (resolveFight(pawn, pawnAtNewPos.pawn)) {
      case 'victory':
        removePawn(G, pawnAtNewPos.player, pawnAtNewPos.pawn);
        playerPawn.position = newPos;
        break;
      case 'defeat':
        removePawn(G, player, pawn);
        break;
      case 'tie':
        return INVALID_MOVE;
      default:
        throw new Error(`Could not determine result of fight between ${pawn} and ${pawnAtNewPos.pawn}`);
    }
  } else {
    playerPawn.position = newPos;
  }

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

  const alive: [Player, PositionedPawn[]][] = G.playersPawns.filter(([_, pawns]) => pawns.length > 0);

  if (alive.length === 1) {
    return { winner: alive[0][0] };
  } else if (alive.length === 0) {
    return { draw: true };
  }

  const hasUnbeatablePawns = [];
  for (let i = 0; i < alive.length; i++) {
    const [player, playerPawns] = alive[i];

    for (const playerPawn of playerPawns) {
      let anyOtherPlayerHasPawnThatCanBeatPlayerPawn = false;

      for (let j = 0; j < alive.length; j++) {
        if (i === j) {
          continue;
        }

        const [_, otherPlayerPawns] = alive[j];

        for (const otherPlayerPawn of otherPlayerPawns) {
          anyOtherPlayerHasPawnThatCanBeatPlayerPawn =
            anyOtherPlayerHasPawnThatCanBeatPlayerPawn ||
            resolveFight(otherPlayerPawn.pawn, playerPawn.pawn) === 'victory';

          if (anyOtherPlayerHasPawnThatCanBeatPlayerPawn) {
            break;
          }
        }

        if (anyOtherPlayerHasPawnThatCanBeatPlayerPawn) {
          break;
        }
      }

      if (!anyOtherPlayerHasPawnThatCanBeatPlayerPawn) {
        hasUnbeatablePawns.push(player);
        break;
      }
    }
  }

  if (hasUnbeatablePawns.length == G.playersPawns.length) {
    return { draw: true };
  }

  return false;
};
