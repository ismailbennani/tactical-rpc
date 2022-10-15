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

export const getPlayerColorLight = (player: Player) => {
  switch (player) {
    case '0':
      return 'rgb(254 226 226)';
    case '1':
      return 'rgb(219 234 254)';
    default:
      return 'rgb(243 244 246)';
  }
};
