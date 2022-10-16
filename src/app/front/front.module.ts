import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontRoutingModule } from './front-routing.module';
import { GamePageComponent } from './game-page/game-page.component';
import { BoardComponent } from './board/board.component';
import { BoardgameIoModule } from '../boardgame-io-angular/boardgame-io.module';
import { PawnComponent } from './pawn/pawn.component';
import { MatButtonModule } from '@angular/material/button';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@NgModule({
  declarations: [GamePageComponent, BoardComponent, PawnComponent],
  imports: [
    CommonModule,
    FrontRoutingModule,
    BoardgameIoModule,
    MatButtonModule,
    SvgIconsModule,
    MatDividerModule,
    MatIconModule,
    RouterLink,
  ],
})
export class FrontModule {}
