import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { BoardBase } from '../../boardgame-io-angular/board-base';
import { BoardConfig, OBSERVABLE_BOARD_CONFIG } from '../../boardgame-io-angular/config';
import { Cell, GameState, Pawn, PAWNS, Player } from '../../game/game-types';
import { hasPawn } from '../../game/game-utils';
import { getPlayerColor } from '../common/utils';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent extends BoardBase implements OnInit, OnChanges {
  public get state(): GameState {
    return this.G;
  }

  public get player(): any {
    return this.ctx.currentPlayer;
  }

  public board: Cell[][];

  public pawnToPlace: Pawn[];
  public selectedPawn: Pawn;

  public instruction: string;

  private knownPositions: Map<Player, Map<Pawn, number>> = new Map<Player, Map<Pawn, number>>();

  constructor(@Inject(OBSERVABLE_BOARD_CONFIG) boardConfig$: Observable<BoardConfig>) {
    super(boardConfig$);
  }

  ngOnInit(): void {
    this.update();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['playerID'] && changes['playerID'].currentValue != changes['playerID'].previousValue) {
      this.update();
    }
  }

  select(pawn: Pawn) {
    this.selectedPawn = pawn;

    this.instruction = 'Select cell in which to place ' + pawn;
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
    return getPlayerColor(this.player);
  }

  colorAt(i: number, j: number) {
    const player = this.board[i][j]?.player;
    if (!player) {
      return null;
    }

    return getPlayerColor(player);
  }

  private update() {
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
    }

    for (const [player, pawns] of this.state.playersPawns) {
      const seen = [];
      let knownPositions = this.knownPositions.get(player);
      if (!knownPositions) {
        knownPositions = new Map<Pawn, number>();
        this.knownPositions.set(player, knownPositions);
      }

      for (const pawn of pawns) {
        const [newX, newY] = this.position(pawn.position);

        const knownPosition = knownPositions.get(pawn.pawn);
        if (knownPosition === 0 || !!knownPosition) {
          const [oldX, oldY] = this.position(knownPosition);
          this.board[oldX][oldY] = null;

          console.log(
            `moved pawn ${pawn.pawn} of player ${player} from position ${oldX}, ${oldY} to position ${newX}, ${newY}`
          );
        } else {
          console.log(`created pawn ${pawn.pawn} of player ${player} at position ${newX}, ${newY}`);
        }

        this.board[newX][newY] = { player, pawn: pawn.pawn };

        seen.push(pawn.pawn);
      }

      if (seen.length < knownPositions.size) {
        for (const [pawn, position] of knownPositions.entries()) {
          if (seen.includes(pawn)) {
            continue;
          }

          const [x, y] = this.position(position);

          this.board[x][y] = null;

          console.log(`removed pawn ${pawn} of player ${player} at position ${x}, ${y}`);
        }
      }
    }
  }

  private updateInPlacePhase() {
    this.pawnToPlace = PAWNS.filter(p => !hasPawn(this.state, this.player, p));
    this.selectedPawn = null;

    this.instruction = 'Select pawn below';
  }

  private updateInPlayPhase() {}

  private placeSelectedPawnAt(position: number) {
    if (!this.selectedPawn) {
      return;
    }

    this.moves.placePawn(position, this.selectedPawn);
    this.update();
  }
}
