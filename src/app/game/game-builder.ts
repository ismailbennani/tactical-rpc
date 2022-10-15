import { BoardShape, GameState } from './game-types';
import { Ctx, Game } from 'boardgame.io';
import { endGame, endPlacePhase, placePawn } from './game-logic';

export class GameBuilder {
  constructor(private size: number) {}

  build(): Game<GameState> {
    return {
      setup: ({ ctx }: { ctx: Ctx }) => ({
        board: { shape: BoardShape.Square, size: this.size },
        playersPawns: ctx.playOrder.map(p => [p, []]),
      }),

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
