import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontRoutingModule } from './front-routing.module';
import { GamePageComponent } from './game-page/game-page.component';
import { BoardComponent } from './board/board.component';
import { BoardgameIoModule } from '../boardgame-io-angular/boardgame-io.module';
import { PawnComponent } from './pawn/pawn.component';
import { CellComponent } from './cell/cell.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [GamePageComponent, BoardComponent, PawnComponent, CellComponent],
  imports: [CommonModule, FrontRoutingModule, BoardgameIoModule, MatButtonModule],
})
export class FrontModule {}
