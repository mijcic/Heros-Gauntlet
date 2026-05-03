import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { GameService } from '../../services/game';
import { Hero } from '../../models/hero';

@Component({
  selector: 'app-level-ring',
  imports: [CommonModule],
  templateUrl: './level-ring.html',
  styleUrl: './level-ring.css',
})
export class LevelRing {
  private gameService = inject(GameService);
  private router = inject(Router);

  hero: Hero | null = null;
  isOnBattle = false;
  isOnMainMenu = false;

  ngOnInit() {
    this.gameService.hero$.subscribe(hero => {
      this.hero = hero;
    });

    this.isOnBattle = this.router.url.includes('/battle');
    this.isOnMainMenu = this.router.url === '/' || this.router.url === '';

    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: any) => {
      this.isOnBattle = event.url.includes('/battle');
      this.isOnMainMenu = event.url === '/' || event.url === '';
    });
  }

  getXpForNextLevel(level: number): number {
    return 50 + level * 25;
  }

  getCircumference(): number {
    return 2 * Math.PI * 45;
  }

  getDashOffset(): number {
    if (!this.hero) return this.getCircumference();
    const percent = this.hero.xp / this.getXpForNextLevel(this.hero.level);
    return this.getCircumference() * (1 - percent);
  }
}
