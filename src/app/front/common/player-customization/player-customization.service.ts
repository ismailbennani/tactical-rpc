import { Injectable } from '@angular/core';
import { Player } from '../../../game/game-types';

@Injectable({
  providedIn: 'root',
})
export class PlayerCustomizationService {
  private readonly predefinedSchemes: ReadonlyArray<ColorScheme> = [
    {
      bgSelected: 'rgb(239 68 68)',
      bgLight: 'rgb(254 226 226)',
    },
    {
      bgSelected: 'rgb(59 130 246)',
      bgLight: 'rgb(219 234 254)',
    },
  ];

  private readonly defaultScheme: ColorScheme = {
    bgSelected: 'rgb(107 114 128)',
    bgLight: 'rgb(243 244 246)',
  };

  private playerSchemeMapping: Map<Player, ColorScheme> = new Map<Player, ColorScheme>();
  private nextPredefinedSchemeToUse: number = 0;

  constructor() {}

  getScheme(player: Player) {
    if (!this.playerSchemeMapping.has(player)) {
      const scheme = this.predefinedSchemes[this.nextPredefinedSchemeToUse];
      this.nextPredefinedSchemeToUse = (this.nextPredefinedSchemeToUse + 1) % this.predefinedSchemes.length;

      this.playerSchemeMapping.set(player, scheme);
    }

    return this.playerSchemeMapping.get(player);
  }
}

interface ColorScheme {
  readonly bgSelected: string;
  readonly bgLight: string;
}
