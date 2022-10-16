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
  public config: GameConfig;

  public currentPlayer = null;

  public get debug() {
    return isDevMode();
  }

  constructor(
    private gameInfoService: GameInfoService,
    private playerCustomizationService: PlayerCustomizationService
  ) {}

  ngOnInit(): void {
    const game = new GameBuilder(11).build();

    this.config = {
      game,
      board: BoardComponent,
      multiplayer: Local({ persist: true, storageKey: GameInfoService.StorageKey }),
    };

    this.gameInfoService.change$.subscribe(() => {
      this.update();
    });

    this.update();
  }

  color(player: Player) {
    return this.playerCustomizationService.getScheme(player).primary;
  }

  identity(x): any {
    return x;
  }

  private update() {
    this.currentPlayer = this.gameInfoService.currentPlayer;
  }
}
