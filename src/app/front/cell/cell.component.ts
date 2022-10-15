import { Component, Input } from '@angular/core';
import { Cell } from 'src/app/game/game-types';
import { getPlayerColor } from '../common/utils';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss'],
})
export class CellComponent {
  @Input()
  public cell: Cell;

  getColor(): string {
    return getPlayerColor(this.cell.player);
  }
}
