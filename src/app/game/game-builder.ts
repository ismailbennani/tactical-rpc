import { BoardShape, GameState } from './game-types';
import { Ctx, Game } from 'boardgame.io';
import { endGame, endPlacePhase, placePawn, startingArea } from './game-logic';

export class GameBuilder {
  constructor(private size: number) {}

  build(): Game<GameState> {
    return {
      setup: ({ ctx }: { ctx: Ctx }) => {
        const board = { shape: BoardShape.Square, size: this.size };

        return {
          board,
          playersPawns: ctx.playOrder.map(p => [p, []]),
          startingAreas: ctx.playOrder.map(p => [p, startingArea(board, p)]),
        };
      },

      phases: {
        place: {
          start: true,

          turn: {
            minMoves: 1,
            maxMoves: 1,
          },

          moves: { placePawn },

          endIf: endPlacePhase,
          next: 'play',
        },
        play: {},
      },

      endIf: endGame,
    };
  }
}
