import { Component, inject } from '@angular/core';
import { Monster } from '../../models/monster';
import { CommonModule } from '@angular/common';
import { Hero } from '../../models/hero';
import { Router } from '@angular/router';
import { GameService } from '../../services/game';

@Component({
  selector: 'app-battle',
  imports: [CommonModule],
  templateUrl: './battle.html',
  styleUrl: './battle.css',
})
export class Battle {
  private router = inject(Router)
  private gameService = inject(GameService)
  monster: Monster | null = null;
  hero: Hero | null = null;
  damageNumbers: { value: number, x: 'hero' | 'monster' }[] = [];
  currentTurn: 'hero' | 'monster' = 'hero';
  enemyMoveName: string = '';
  shakeHero = false;
  shakeMonster = false;
  rewardMove: any = null;
  showReward = false;

  ngOnInit() {
    this.gameService.getHero().subscribe(hero => {
      let equippedMoves = JSON.parse(localStorage.getItem('equippedMoves') || '[]');

      this.hero = {
        ...hero,
        moves: equippedMoves.length ? equippedMoves : hero.moves // 🔥 KLJUČ
      };
    });

    let data = localStorage.getItem('currentMonster');
    if (data) {
      let parsedData = JSON.parse(data);

      this.monster = {
        ...parsedData,
        maxHp: parsedData.hp ?? 100
      };
    }
  }

  playMove(move: any) {
    if (!this.hero || !this.monster) return;
    if (this.currentTurn !== 'hero') return; 

    this.currentTurn = 'monster';

    this.monster.hp -= move.value;

    this.shakeMonster = true;
    setTimeout(() => this.shakeMonster = false, 300);

    this.damageNumbers.push({
      value: -move.value,
      x: 'monster'
    });

    setTimeout(() => this.damageNumbers.shift(), 800);

    if (this.monster.hp <= 0) {
      let learnedMove = this.getRandomMonsterMove();

      let learnedMoves = JSON.parse(localStorage.getItem('learnedMoves') || '[]');
      learnedMoves.push(learnedMove);
      localStorage.setItem('learnedMoves', JSON.stringify(learnedMoves));
      
      this.rewardMove = learnedMove;
      
      let unlockedIndex = Number(localStorage.getItem('unlockedIndex') || 0);
      let total = Number(localStorage.getItem('totalMonsters') || 5);
      if (unlockedIndex < total - 1) {
        unlockedIndex++;
      }
      localStorage.setItem('unlockedIndex', unlockedIndex.toString());

      this.showReward = true;

      return;
    }

    setTimeout(() => {

      this.gameService.getMonsterMove(this.monster!).subscribe((res: any) => {

        let monsterMove = res.move;

        this.enemyMoveName = monsterMove.name;

        this.hero!.hp -= monsterMove.value;

        this.shakeHero = true;
        setTimeout(() => this.shakeHero = false, 300);

        this.damageNumbers.push({
          value: -monsterMove.value,
          x: 'hero'
        });

        setTimeout(() => this.damageNumbers.shift(), 800);

        if (this.hero!.hp <= 0) {
          setTimeout(() => {
            alert("You lost!");
            this.router.navigate(['/run-overview']);
          }, 500);
          return;
        }

        setTimeout(() => {
          this.currentTurn = 'hero';
          this.enemyMoveName = ''; 
        }, 500);

      });

    }, 1000);
  }

  getHpClass(entity: any) {
    let percent = (entity.hp / entity.maxHp) * 100;

    if (percent <= 33) return 'low-hp';
    if (percent <= 66) return 'mid-hp';
    return 'high-hp';
  }

  getRandomMonsterMove() {
    if (!this.monster?.moves?.length) return null;

    const index = Math.floor(Math.random() * this.monster.moves.length);
    return this.monster.moves[index];
  }

  closeReward() {
    this.showReward = false;
    this.router.navigate(['/run-overview']);
  }
}
