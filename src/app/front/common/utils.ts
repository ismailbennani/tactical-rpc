import { GameInfoService } from './game-info/game-info.service';

export const resetState = () => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(GameInfoService.StorageKey)) {
      localStorage.removeItem(key);
    }
  }
};
