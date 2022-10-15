import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  get game() {
    return this._game;
  }

  private _game = {
    setup: () => ({ cells: Array(9).fill(null) }),

    moves: {
      clickCell: ({ G, playerID }, id) => {
        G.cells[id] = playerID;
      },
    },
  };

  constructor() {}
}
