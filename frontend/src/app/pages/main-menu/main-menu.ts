import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game';

@Component({
  selector: 'app-main-menu',
  imports: [],
  templateUrl: './main-menu.html',
  styleUrl: './main-menu.css',
})
export class MainMenu {
  private router = inject(Router)
  private gameService = inject(GameService)

  startGame() {
    this.gameService.getRunConfig().subscribe(data => {
      localStorage.setItem('monsters', JSON.stringify(data.monsters));
      localStorage.setItem('totalMonsters', data.monsters.length.toString());
      localStorage.setItem('unlockedIndex', '0');
      
      this.gameService.getHero().subscribe(hero => {
        localStorage.setItem('equippedMoves', JSON.stringify(hero.moves));
        localStorage.setItem('learnedMoves', JSON.stringify(hero.moves));

        localStorage.setItem('heroBase', JSON.stringify(hero));

        this.router.navigate(['/run-overview']);
      });
    });
  }

  exitGame() {
    this.router.navigate(['/']);
  }
}
