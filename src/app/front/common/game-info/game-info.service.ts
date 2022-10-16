import { Injectable } from '@angular/core';
import { GameState, Player } from '../../../game/game-types';
import { Ctx } from 'boardgame.io';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameInfoService {
  public static readonly StorageKey = 'tactical-rpc';

  private G: GameState;
  private ctx: Ctx;

  public get change$(): Observable<void> {
    return this.changeSubject.asObservable();
  }

  private changeSubject: Subject<void> = new Subject<void>();

  constructor() {}

  update({ G, ctx }: { G: GameState; ctx: Ctx }) {
    this.G = G;
    this.ctx = ctx;

    this.changeSubject.next();
  }

  get currentPlayer(): Player {
    return this.ctx?.currentPlayer;
  }

  get players(): Player[] {
    return this.ctx?.playOrder ?? [];
  }

  get gameover() {
    return this.ctx?.gameover;
  }
}
