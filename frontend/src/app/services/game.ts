import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Move } from '../models/move';
import { Monster } from '../models/monster';
import { BehaviorSubject } from 'rxjs';
import { Hero } from '../models/hero';
import { Environment } from '../models/environment';
import { HeroClass } from '../models/hero-class';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private httpClient = inject(HttpClient)
  private heroSubject = new BehaviorSubject<Hero | null>(null);
  hero$ = this.heroSubject.asObservable();

  setHero(hero: Hero | null) {
    this.heroSubject.next(hero);
  }

  getCurrentHero(): Hero | null {
    return this.heroSubject.value;
  }

  constructor() { }

  getRunConfig(multiplier: number = 1) {
    return this.httpClient.get<{ monsters: Monster[] }>(`http://localhost:4000/run/config?multiplier=${multiplier}`);
  }

  getHero() {
    return this.httpClient.get<Hero>("http://localhost:4000/hero");
  }

  playerAttack(move: any) {
    const data = {
      move: move
    }
    return this.httpClient.post('http://localhost:4000/battle/attack', data);
  }

  getMonsterMove(monster: Monster) {
    const data = {
      monster: monster
    }
    return this.httpClient.post<Move>("http://localhost:4000/battle/next-move", data);
  }

  setCurrentMonster(monster: any, resume: boolean = false, hero: any = null) {
    return this.httpClient.post('http://localhost:4000/battle/set-monster', { monster, resume, hero });
  }

  chooseStat(stat: string) {
    return this.httpClient.post('http://localhost:4000/hero/choose-stat', { stat });
  }

  saveLearnedMove(move: any) {
    return this.httpClient.post('http://localhost:4000/hero/learned-move', { move });
  }

  login(username: string, password: string) {
    return this.httpClient.post('http://localhost:4000/auth/login', { username, password });
  }

  register(username: string, password: string) {
    return this.httpClient.post('http://localhost:4000/auth/register', { username, password });
  }

  saveRun(state: any) {
    return this.httpClient.post('http://localhost:4000/run/save', { state });
  }

  loadRun() {
    return this.httpClient.get<{ save: any }>('http://localhost:4000/run/load');
  }

  deleteRun() {
    return this.httpClient.delete('http://localhost:4000/run/save');
  }

  resetHero() {
    return this.httpClient.post('http://localhost:4000/hero/reset', {});
  }

  continueFighting() {
    return this.httpClient.post<{ ok: boolean, runsCompleted?: number }>('http://localhost:4000/hero/continue-fighting', {});
  }

  getEnvironments() {
    return this.httpClient.get<{ environments: Environment[] }>('http://localhost:4000/environments');
  }

  setEnvironment(environmentId: string) {
    return this.httpClient.post('http://localhost:4000/battle/set-environment', { environmentId });
  }

  getHeroClasses() {
    return this.httpClient.get<{ classes: HeroClass[] }>('http://localhost:4000/hero-classes');
  }

  selectHeroClass(classId: string) {
    return this.httpClient.post<{ ok: boolean, hero: any, heroClass: HeroClass }>('http://localhost:4000/hero/select-class', { classId });
  }
}
