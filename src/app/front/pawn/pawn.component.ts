import { Component, Input } from '@angular/core';
import { Pawn } from '../../game/game-types';

@Component({
  selector: 'app-pawn',
  templateUrl: './pawn.component.html',
  styleUrls: ['./pawn.component.scss'],
})
export class PawnComponent {
  @Input()
  public pawn: Pawn;

  constructor() {}
}
