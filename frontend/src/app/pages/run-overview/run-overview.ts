import { Component, inject } from '@angular/core';
import { Monster } from '../../models/monster';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game';
import { BackButton } from '../../components/back-button/back-button';
import { Environment } from '../../models/environment';

@Component({
  selector: 'app-run-overview',
  imports: [CommonModule, BackButton],
  templateUrl: './run-overview.html',
  styleUrl: './run-overview.css',
})
export class RunOverview {
  private router = inject(Router)
  private gameService = inject(GameService)
  
  unlockedIndex = 0;
  monsters: Monster[] = [];
  equippedMoves: any[] = [];
  hasNewMoves = false;

  showEnvironmentChoice = false;
  environments: Environment[] = [];

  selectedMonsterIndex: number = -1;

  heroClassName = '';

  ngOnInit() {
    if (!this.gameService.getCurrentHero()) {
      this.gameService.getHero().subscribe(hero => {
        this.gameService.setHero(hero);
      });
    }

    const data = localStorage.getItem('monsters');
    if (data) {
      this.monsters = data ? JSON.parse(data) : [];
    }

    this.unlockedIndex = Number(localStorage.getItem('unlockedIndex') || 0);
    const equipped = localStorage.getItem('equippedMoves');
    this.equippedMoves = equipped ? JSON.parse(equipped) : [];
    this.hasNewMoves = localStorage.getItem('hasNewMoves') === 'true';

    this.gameService.getEnvironments().subscribe(data => {
      this.environments = data.environments;
    });

    const classId = localStorage.getItem('heroClass');
    if (classId) {
      this.heroClassName = classId.charAt(0).toUpperCase() + classId.slice(1);
    }
  }

  selectMonster(index: number) {
    if (index > this.unlockedIndex) return;
    this.selectedMonsterIndex = index;
    this.showEnvironmentChoice = true;
  }

  confirmEnvironment(env: Environment) {
    const monster = this.monsters[this.selectedMonsterIndex];
    localStorage.setItem('currentMonster', JSON.stringify(monster));
    localStorage.setItem('currentMonsterIndex', this.selectedMonsterIndex.toString());
    localStorage.setItem('currentEnvironment', JSON.stringify(env));

    this.gameService.setEnvironment(env.id).subscribe(() => {
      this.gameService.setCurrentMonster(monster).subscribe(() => {
        this.router.navigate(['/battle']);
      });
    });
  }

  cancelEnvironmentChoice() {
    this.showEnvironmentChoice = false;
    this.selectedMonsterIndex = -1;
  }

  openMoveManager() {
    localStorage.removeItem('hasNewMoves');
    this.hasNewMoves = false;
    this.router.navigate(['/move-manager']);
  }

  saveAndExit() {
    const state = {
      inBattle: false,
      currentMonsterIndex: Number(localStorage.getItem('currentMonsterIndex') || 0),
      unlockedIndex: this.unlockedIndex,
      equippedMoves: this.equippedMoves,
      learnedMoves: JSON.parse(localStorage.getItem('learnedMoves') || '[]')
    };

    const isGuest = !localStorage.getItem('token');

    if (isGuest) {
      localStorage.setItem('savedRun', JSON.stringify({ 
        state, 
        savedAt: new Date().toISOString() 
      }));
      this.router.navigate(['/']);
    } 
    else {
      this.gameService.saveRun(state).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }
}