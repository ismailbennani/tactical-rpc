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

export const resolveFight = (pawn1: Pawn, pawn2: Pawn): 'victory' | 'defeat' | 'tie' => {
  if (pawn1 === Pawn.Rock && pawn2 === Pawn.Rock) {
    return 'tie';
  } else if (pawn1 === Pawn.Rock && pawn2 === Pawn.Paper) {
    return 'defeat';
  } else if (pawn1 === Pawn.Rock && pawn2 === Pawn.Scissor) {
    return 'victory';
  } else if (pawn1 === Pawn.Paper && pawn2 === Pawn.Paper) {
    return 'tie';
  } else if (pawn1 === Pawn.Paper && pawn2 === Pawn.Scissor) {
    return 'defeat';
  } else if (pawn1 === Pawn.Paper && pawn2 === Pawn.Rock) {
    return 'victory';
  } else if (pawn1 === Pawn.Scissor && pawn2 === Pawn.Scissor) {
    return 'tie';
  } else if (pawn1 === Pawn.Scissor && pawn2 === Pawn.Rock) {
    return 'defeat';
  } else if (pawn1 === Pawn.Scissor && pawn2 === Pawn.Paper) {
    return 'victory';
  } else {
    return null;
  }
};

export const removePawn = (G: GameState, player: Player, pawn: Pawn): void => {
  const otherPlayerEntry = G.playersPawns.find(([p, _]) => p === player);
  if (!otherPlayerEntry) {
    throw new Error(`Unknown player ${player}`);
  }

  const [_, otherPlayerPawns] = otherPlayerEntry;
  const pawnAtNewPosIndex = otherPlayerPawns.findIndex(p => p.pawn === pawn);

  otherPlayerPawns.splice(pawnAtNewPosIndex, 1);
};

export const accessibleCells = (G: GameState, player: Player, pawn: Pawn): number[] => {
  const pawnPosition = positionOf(G, player, pawn);

  let size;
  switch (pawn) {
    case Pawn.Rock:
      size = 1;
      break;
    case Pawn.Paper:
      size = 3;
      break;
    case Pawn.Scissor:
      size = 2;
      break;
  }

  const accessibleCells = square(G, pawnPosition, size).filter(pos => hasLos(G, pawnPosition, pos, [player]));

  const [pi, pj] = position(G.board, pawnPosition);

  switch (pawn) {
    case Pawn.Rock:
      return accessibleCells.filter(pos => {
        const [i, j] = position(G.board, pos);
        return Math.max(Math.abs(i - pi), Math.abs(j - pj)) < 2;
      });
    case Pawn.Paper:
      return accessibleCells.filter(pos => {
        const [i, j] = position(G.board, pos);
        return i !== pi && j !== pj && Math.abs(i - pi) !== Math.abs(j - pj);
      });
    case Pawn.Scissor:
      return accessibleCells.filter(pos => {
        const [i, j] = position(G.board, pos);
        return i === pi || j === pj || Math.abs(i - pi) === Math.abs(j - pj);
      });
  }

  return [];
};

const square = (G: GameState, from: number, size: number): number[] => {
  const result = [];
  const [pi, pj] = position(G.board, from);

  for (let i = pi - size; i < pi + size + 1; i++) {
    for (let j = pj - size; j < pj + size + 1; j++) {
      if (i >= 0 && i < G.board.size && j >= 0 && j < G.board.size) {
        result.push(index(G.board, i, j));
      }
    }
  }

  return result;
};

const hasLos = (G: GameState, from: number, to: number, nonBlockingPlayers: Player[]): boolean => {
  // check no obstacles along Bresenham line

  let [i1, j1] = position(G.board, from);
  let [i2, j2] = position(G.board, to);

  let line: [number, number][];
  if (Math.abs(i2 - i1) < Math.abs(j2 - j1)) {
    if (j1 > j2) {
      line = bresenham_low([j2, i2], [j1, i1]);
    } else {
      line = bresenham_low([j1, i1], [j2, i2]);
    }
  } else {
    if (i1 > i2) {
      line = bresenham_high([j2, i2], [j1, i1]);
    } else {
      line = bresenham_high([j1, i1], [j2, i2]);
    }
  }

  for (const [j, i] of line) {
    const pos = index(G.board, i, j);

    if (pos !== from && pos !== to) {
      const cell = at(G, pos);
      if (!!cell && !nonBlockingPlayers.includes(cell.player)) {
        return false;
      }
    }
  }

  return true;
};

const bresenham_low = ([x1, y1]: [number, number], [x2, y2]: [number, number]): [number, number][] => {
  const result = [];

  const dx = x2 - x1;
  let dy = y2 - y1;
  let yi = 1;

  if (dy < 0) {
    yi = -1;
    dy = -dy;
  }

  let D = 2 * dy - dx;
  let y = y1;

  for (let x = x1; x <= x2; x++) {
    result.push([x, y]);

    if (D > 0) {
      y += yi;
      D += 2 * (dy - dx);
    } else {
      D += 2 * dy;
    }
  }

  return result;
};

const bresenham_high = ([x1, y1]: [number, number], [x2, y2]: [number, number]): [number, number][] => {
  const result = [];

  let dx = x2 - x1;
  const dy = y2 - y1;
  let xi = 1;

  if (dx < 0) {
    xi = -1;
    dx = -dx;
  }

  let D = 2 * dx - dy;
  let x = x1;

  for (let y = y1; y <= y2; y++) {
    result.push([x, y]);

    if (D > 0) {
      x += xi;
      D += 2 * (dx - dy);
    } else {
      D += 2 * dx;
    }
  }

  return result;
};
