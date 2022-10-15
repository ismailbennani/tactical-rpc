import { Component, isDevMode, OnInit } from '@angular/core';
import { BoardComponent } from '../board/board.component';
import { GameBuilder } from '../../game/game-builder';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnInit {
  public config;

  public get debug() {
    return isDevMode();
  }

  constructor() {}

  ngOnInit(): void {
    const game = new GameBuilder(10).build();

    this.config = { game, board: BoardComponent };
  }
}
