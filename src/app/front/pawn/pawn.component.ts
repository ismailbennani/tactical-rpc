import { Component, Input } from '@angular/core';
import { Pawn } from '../../game/game-types';
import { SvgIconType } from '@ngneat/svg-icon/lib/types';
import { rockIcon } from '@app/svg/rock';
import { scissorsIcon } from '@app/svg/scissors';
import { paperIcon } from '@app/svg/paper';

@Component({
  selector: 'app-pawn',
  templateUrl: './pawn.component.html',
  styleUrls: ['./pawn.component.scss'],
})
export class PawnComponent {
  @Input()
  set pawn(pawn: Pawn) {
    switch (pawn) {
      case Pawn.Rock:
        this.icon = rockIcon;
        break;
      case Pawn.Paper:
        this.icon = paperIcon;
        break;
      case Pawn.Scissor:
        this.icon = scissorsIcon;
        break;
    }
  }

  @Input()
  public size: string;

  public icon: SvgIconType;

  constructor() {}
}
