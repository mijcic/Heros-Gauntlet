import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GameConfig } from '../models/game-config';
import { Move } from '../models/move';
import { Monster } from '../models/monster';
import { Hero } from '../models/hero';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private httpClient = inject(HttpClient)

  constructor() { }

  getRunConfig() {
    return this.httpClient.get<GameConfig>("http://localhost:4000/run/config");
  }

  getMonsterMove(monster: Monster) {
    const data = {
      monster: monster
    }
    return this.httpClient.post<Move>("http://localhost:4000/battle/next-move", data);
  }

  getHero() {
    return this.httpClient.get<Hero>("http://localhost:4000/hero");
  }
}
