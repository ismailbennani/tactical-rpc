import { Player } from '../../game/game-types';

export const getPlayerColor = (player: Player) => {
  switch (player) {
    case '0':
      return 'rgb(239 68 68)';
    case '1':
      return 'rgb(59 130 246)';
    default:
      return 'rgb(107 114 128)';
  }
};
