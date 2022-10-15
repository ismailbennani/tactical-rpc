import { Component, OnInit } from '@angular/core';
import { GameService } from '../../game/game.service';
import { BoardComponent } from '../board/board.component';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnInit {
  public config;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.config = { game: this.gameService.game, board: BoardComponent };
  }
}
