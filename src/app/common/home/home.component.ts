import { Component, OnInit } from '@angular/core';
import { resetState } from '../../front/common/utils';
import { rockIcon } from '@app/svg/rock';
import { scissorsIcon } from '@app/svg/scissors';
import { paperIcon } from '@app/svg/paper';
import { GameInfoService } from '../../front/common/game-info/game-info.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public readonly rockIcon = rockIcon;
  public readonly paperIcon = paperIcon;
  public readonly scissorsIcon = scissorsIcon;

  public get hasSave(): boolean {
    const stateKey = GameInfoService.StorageKey + '-state';
    return !!localStorage.getItem(stateKey);
  }

  constructor() {}

  ngOnInit(): void {}

  newGame() {
    resetState();
  }
}
