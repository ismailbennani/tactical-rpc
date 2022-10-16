import { Component, isDevMode, OnInit } from '@angular/core';
import { BoardComponent } from '../board/board.component';
import { GameBuilder } from '../../game/game-builder';
import { GameConfig } from '../../boardgame-io-angular/config';
import { Local } from 'boardgame.io/multiplayer';
import { GameInfoService } from '../common/game-info/game-info.service';
import { PlayerCustomizationService } from '../common/player-customization/player-customization.service';
import { Player } from '../../game/game-types';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnInit {
  private readonly storageKey = 'tactical-rpc';

  public config: GameConfig;

  public players = [];
  public currentPlayer = null;

  public get debug() {
    return isDevMode();
  }

  constructor(
    private gameInfoService: GameInfoService,
    private playerCustomizationService: PlayerCustomizationService
  ) {}

  ngOnInit(): void {
    const game = new GameBuilder(10).build();

    this.config = { game, board: BoardComponent, multiplayer: Local({ persist: true, storageKey: this.storageKey }) };

    this.gameInfoService.change$.subscribe(() => {
      this.players = this.gameInfoService.players;
      this.currentPlayer = this.gameInfoService.currentPlayer;
    });
  }

  color(player: Player) {
    return this.playerCustomizationService.getScheme(player).primary;
  }

  resetState() {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(this.storageKey)) {
        localStorage.removeItem(key);
      }
    }

    location.reload();
  }

  identity(x): any {
    return x;
  }
}
