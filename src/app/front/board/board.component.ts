import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BoardBase } from '../../boardgame-io-angular/board-base';
import { BoardConfig, OBSERVABLE_BOARD_CONFIG } from '../../boardgame-io-angular/config';
import { Cell, GameState, Pawn, PAWNS, Player, PositionedPawn } from '../../game/game-types';
import { accessibleCells, hasPawn } from '../../game/game-utils';
import { PlayerCustomizationService } from '../common/player-customization/player-customization.service';
import { Ctx } from 'boardgame.io';
import { GameInfoService } from '../common/game-info/game-info.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent extends BoardBase implements OnInit {
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

  private config: BoardConfig;

  constructor(
    @Inject(OBSERVABLE_BOARD_CONFIG) private boardConfig$: Observable<BoardConfig>,
    private playerCustomizationService: PlayerCustomizationService,
    private gameInfoService: GameInfoService
  ) {
    super(boardConfig$);
  }

  ngOnInit() {
    this.boardConfig$.subscribe(c => {
      this.config = c;
      this.update();
    });

    this.update();
  }

  select(pawn: Pawn) {
    this.selectedPawn = pawn;

    switch (this.ctx.phase) {
      case 'place':
        this.instruction = 'Select cell in which to place ' + pawn;

        for (const position of this.getStartingArea(this.playerID)) {
          const [x, y] = this.position(position);
          this.targetable[x][y] = true;
        }
        break;
      case 'play':
        this.instruction = 'Select cell in which to place ' + pawn;

        this.fillTargetable(false);
        this.fillTargetableAt(this.getAccessibleCells(this.playerID, pawn), true);

        break;
    }
  }

  onClick(position: number) {
    switch (this.ctx.phase) {
      case 'place':
        if (!this.selectedPawn) {
          return;
        }

        this.moves.placePawn(position, this.selectedPawn);

        const playerPawns = this.getPlayerPawns(this.playerID);
        if (playerPawns.length === 1) {
          this.select(playerPawns[0].pawn);
        }

        break;
      case 'play':
        const [x, y] = this.position(position);
        const cell = this.board[x][y];

        if (cell && cell.player === this.playerID) {
          this.select(cell.pawn);
          return;
        }

        if (this.selectedPawn) {
          this.moves.movePawn(this.selectedPawn, position);
        }

        break;
    }
  }

  onEnter(position: number) {
    switch (this.ctx.phase) {
      case 'place':
        break;
      case 'play':
        if (this.selectedPawn) {
          return;
        }

        const [x, y] = this.position(position);
        const cell = this.board[x][y];

        if (!!cell && cell.player === this.playerID) {
          const accessibleCells = this.getAccessibleCells(this.playerID, cell.pawn);
          this.fillTargetableAt(accessibleCells, true);
        }

        break;
    }
  }

  onLeave(_: number) {
    switch (this.ctx.phase) {
      case 'place':
        break;
      case 'play':
        if (this.selectedPawn) {
          return;
        }

        this.fillTargetable(false);
        break;
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

  borderColorAt(i: number, j: number) {
    const cell = this.board[i][j];

    switch (this.ctx.phase) {
      case 'place':
        if (cell) {
          return this.playerCustomizationService.getScheme(cell.player).bgSelected;
        }
        break;
      case 'play':
        if (cell) {
          if (cell.player === this.playerID) {
            if (!this.selectedPawn || cell.pawn === this.selectedPawn) {
              return this.playerCustomizationService.getScheme(cell.player).bgSelected;
            } else {
              return this.playerCustomizationService.getScheme(cell.player).bgLight;
            }
          } else {
            if (this.targetable[i][j]) {
              return this.playerCustomizationService.getScheme(cell.player).bgSelected;
            } else {
              return this.playerCustomizationService.getScheme(cell.player).bgLight;
            }
          }
        }
        break;
    }

    return 'inherit';
  }

  backgroundColorAt(i: number, j: number) {
    switch (this.ctx.phase) {
      case 'place':
        if (this.selectedPawn != null && this.targetable && this.targetable[i][j]) {
          return this.playerCustomizationService.getScheme(this.playerID).bgLight;
        }

        break;
      case 'play':
        if (this.targetable && this.targetable[i][j]) {
          return this.playerCustomizationService.getScheme(this.playerID).bgLight;
        }
        break;
    }

    return 'inherit';
  }

  private update() {
    this.gameInfoService.update({ G: this.state, ctx: this.context });

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
      this.fillBoard(null);
    }

    if (!this.targetable) {
      this.targetable = Array(this.state.board.size).fill(null);
      for (let i = 0; i < this.state.board.size; i++) {
        this.targetable[i] = Array(this.state.board.size).fill(false);
      }
    } else {
      this.fillTargetable(false);
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

    this.fillTargetable(false);

    if (this.pawnToPlace.length === 1) {
      this.select(this.pawnToPlace[0]);
    }
  }
  private updateInPlayPhase() {
    this.instruction = 'Select a pawn to move';
    this.selectedPawn = null;

    this.fillTargetable(false);
  }

  private getStartingArea(player: Player): number[] {
    const entry = this.state.startingAreas.find(([p, _]) => p === player);
    if (!entry) {
      return [];
    }
    const [_, area] = entry;

    return area;
  }

  private getAccessibleCells(player: Player, pawn: Pawn): number[] {
    return accessibleCells(this.state, player, pawn);
  }

  private getPlayerPawns(player: Player): PositionedPawn[] {
    const playerEntry = this.state.playersPawns.find(([p, _]) => p === player);
    if (!playerEntry || !playerEntry[1]) {
      throw new Error(`Unknown player ${player}`);
    }

    return playerEntry[1];
  }

  private fillBoard(c: Cell) {
    for (let i = 0; i < this.state.board.size; i++) {
      for (let j = 0; j < this.state.board.size; j++) {
        this.board[i][j] = c;
      }
    }
  }

  private fillTargetable(b: boolean) {
    for (let i = 0; i < this.state.board.size; i++) {
      for (let j = 0; j < this.state.board.size; j++) {
        this.targetable[i][j] = b;
      }
    }
  }

  private fillTargetableAt(positions: number[], b: boolean) {
    for (const position of positions) {
      const [i, j] = this.position(position);
      this.targetable[i][j] = b;
    }
  }
}
