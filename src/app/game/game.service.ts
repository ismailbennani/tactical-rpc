import { Injectable } from '@angular/core';
import { GameStateService } from './game-state.service';
import { Client } from 'boardgame.io/client';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private gameStateService: GameStateService) {}

  createClient() {
    return Client({ game: this.gameStateService.game });
  }
}
