import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BoardBase } from '../../boardgame-io-angular/board-base';
import { BoardConfig, OBSERVABLE_BOARD_CONFIG } from '../../boardgame-io-angular/config';
import { Cell, GameState, Pawn, PAWNS, Player } from '../../game/game-types';
import { hasPawn } from '../../game/game-utils';
import { PlayerCustomizationService } from '../common/player-customization/player-customization.service';
import { Ctx } from 'boardgame.io';
import { GameInfoService } from '../common/game-info/game-info.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent extends BoardBase {
  public get state(): GameState {
    return this.G;
  }

  public get context(): Ctx {
    return this.ctx;
  }

  public board: Cell[][];
  public targetable: boolean[][];

  public pawnToPlace: Pawn[];
  public selectedPawn: Pawn;

  public instruction: string;
  public players: Player[] = [];

  private config: BoardConfig;

  constructor(
    @Inject(OBSERVABLE_BOARD_CONFIG) boardConfig$: Observable<BoardConfig>,
    private playerCustomizationService: PlayerCustomizationService,
    private gameInfoService: GameInfoService
  ) {
    super(boardConfig$);

    boardConfig$.subscribe(c => {
      this.config = c;
      this.update();
    });
  }

  select(pawn: Pawn) {
    this.selectedPawn = pawn;

    this.instruction = 'Select cell in which to place ' + pawn;

    for (const position of this.getStartingArea(this.playerID)) {
      const [x, y] = this.position(position);
      this.targetable[x][y] = true;
    }
  }

  onClick(position: number) {
    if (this.ctx.phase === 'place') {
      this.placeSelectedPawnAt(position);
    }
  }

  index(i: number, j: number): number {
    return i * this.state.board.size + j;
  }

  position(index: number): [number, number] {
    return [Math.floor(index / this.state.board.size), index % this.state.board.size];
  }

  color(): string {
    return this.playerCustomizationService.getScheme(this.playerID).bgSelected;
  }

  colorAt(i: number, j: number) {
    const player = this.board[i][j]?.player;

    switch (this.ctx.phase) {
      case 'place':
        if (player) {
          return this.playerCustomizationService.getScheme(player).bgSelected;
        }

        if (this.selectedPawn != null && this.targetable && this.targetable[i][j]) {
          return this.playerCustomizationService.getScheme(this.playerID).bgLight;
        }
        break;
      case 'play':
        if (player) {
          if (player === this.playerID) {
            return this.playerCustomizationService.getScheme(player).bgSelected;
          } else {
            return this.playerCustomizationService.getScheme(player).bgLight;
          }
        }
        break;
    }

    return null;
  }

  private update() {
    this.gameInfoService.update({ G: this.state, ctx: this.context });

    this.players = this.gameInfoService.players;

    this.updateBoard();

    switch (this.ctx.phase) {
      case 'place':
        this.updateInPlacePhase();
        break;
      case 'play':
        this.updateInPlayPhase();
        break;
      default:
        this.instruction = null;
    }
  }

  private updateBoard() {
    if (!this.board) {
      this.board = Array(this.state.board.size).fill(null);
      for (let i = 0; i < this.state.board.size; i++) {
        this.board[i] = Array(this.state.board.size).fill(null);
      }
    } else {
      for (let i = 0; i < this.state.board.size; i++) {
        for (let j = 0; j < this.state.board.size; j++) {
          this.board[i][j] = null;
        }
      }
    }

    if (!this.targetable) {
      this.targetable = Array(this.state.board.size).fill(null);
      for (let i = 0; i < this.state.board.size; i++) {
        this.targetable[i] = Array(this.state.board.size).fill(false);
      }
    } else {
      for (let i = 0; i < this.state.board.size; i++) {
        for (let j = 0; j < this.state.board.size; j++) {
          this.targetable[i][j] = false;
        }
      }
    }

    for (const [player, pawns] of this.state.playersPawns) {
      for (const pawn of pawns) {
        const [x, y] = this.position(pawn.position);
        this.board[x][y] = { player, pawn: pawn.pawn };
      }
    }
  }

  private updateInPlacePhase() {
    this.pawnToPlace = PAWNS.filter(p => !hasPawn(this.state, this.playerID, p));
    this.selectedPawn = null;

    this.instruction = 'Select pawn';

    for (let i = 0; i < this.state.board.size; i++) {
      for (let j = 0; j < this.state.board.size; j++) {
        this.targetable[i][j] = false;
      }
    }

    if (this.pawnToPlace.length === 1) {
      this.select(this.pawnToPlace[0]);
    }
  }

  private updateInPlayPhase() {
    this.instruction = null;
  }

  private placeSelectedPawnAt(position: number) {
    if (!this.selectedPawn) {
      return;
    }

    this.moves.placePawn(position, this.selectedPawn);
  }

  private getStartingArea(player: Player): number[] {
    const entry = this.state.startingAreas.find(([p, _]) => p === player);
    if (!entry) {
      return [];
    }
    const [_, area] = entry;

    return area;
  }
}
