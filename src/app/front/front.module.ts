import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontRoutingModule } from './front-routing.module';
import { GamePageComponent } from './game-page/game-page.component';
import { BoardComponent } from './board/board.component';
import { BoardgameIoModule } from '../boardgame-io-angular/boardgame-io.module';

@NgModule({
  declarations: [GamePageComponent, BoardComponent],
  imports: [CommonModule, FrontRoutingModule, BoardgameIoModule],
})
export class FrontModule {}
