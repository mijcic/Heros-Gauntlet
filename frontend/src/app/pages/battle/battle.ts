import { Component, inject } from '@angular/core';
import { Monster } from '../../models/monster';
import { CommonModule } from '@angular/common';
import { Hero } from '../../models/hero';
import { Router } from '@angular/router';
import { GameService } from '../../services/game';
import { BackButton } from '../../components/back-button/back-button';

@Component({
  selector: 'app-battle',
  imports: [CommonModule, BackButton],
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
  projectile: {
    iconPath: string;
    direction: 'hero-to-monster' | 'monster-to-hero' | 'self-hero' | 'self-monster';
  } | null = null;

  showReward = false;
  showLevelUp = false;
  showDefeat = false;
  showStatChoice = false;
  showRunComplete = false;

  battlesFought = 0;
  movesLearnedCount = 0;
  runsCompleted = 0;

  rewardMove: any = null;
  hoveredMove: any = null;
  
  pendingReward = false;
  pendingRunComplete = false;

  battleLog: string[] = [];
  currentEnvironment: any = null;

  ngOnInit() {
    this.battleLog = [];

    const savedBattle = sessionStorage.getItem('resumeBattle');
    if (savedBattle) {
      const parsed = JSON.parse(savedBattle);
      this.hero = parsed.hero;
      this.monster = parsed.monster;
      this.battleLog = parsed.battleLog || [];
      this.currentEnvironment = parsed.environment || null;
      sessionStorage.removeItem('resumeBattle');
      this.incrementBattleCount();
      return;
    }

    this.gameService.getHero().subscribe(hero => {
      this.hero = {
        ...hero,
        maxHp: hero.maxHp ?? 100,
        moves: JSON.parse(localStorage.getItem('equippedMoves') || '[]')
      };
    });

    let data = localStorage.getItem('currentMonster');
    if (data) {
      let parsedData = JSON.parse(data);
      this.monster = {
        ...parsedData,
        maxHp: parsedData.maxHp ?? parsedData.hp ?? 100
      };
    }

    const envData = localStorage.getItem('currentEnvironment');
    if (envData) {
      this.currentEnvironment = JSON.parse(envData);
    }

    this.incrementBattleCount();
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

  closeDefeat() {
    this.showDefeat = false;
    this.router.navigate(['/run-overview']);
  }

  getXpForNextLevel(level: number): number {
    return 50 + level * 25;
  }

  getXpPercent(): number {
    if (!this.hero) return 0;
    return (this.hero.xp / this.getXpForNextLevel(this.hero.level)) * 100;
  }

  addLog(message: string) {
    this.battleLog.push(message);
    
    setTimeout(() => {
      const logEl = document.querySelector('.battle-log-messages');
      if (logEl) logEl.scrollTop = logEl.scrollHeight;
    }, 50);
  }

  getMoveIconPath(move: any): string {   
    if (move.effect === 'damage') {
      return move.type === 'physical' ? '/assets/pictures/moves/physical.png' : '/assets/pictures/moves/magic.png';
    }
    if (move.effect === 'heal')   return '/assets/pictures/moves/heal.png';
    if (move.effect === 'buff')   return '/assets/pictures/moves/buff.png';
    if (move.effect === 'debuff') return '/assets/pictures/moves/debuff.png';
    
    return '/assets/pictures/moves/physical.png';
  }

  getProjectileDirection(move: any, attackerSide: 'hero' | 'monster'): 'hero-to-monster' | 'monster-to-hero' | 'self-hero' | 'self-monster' {
    if (move.effect === 'buff' || move.effect === 'heal') {
      return attackerSide === 'hero' ? 'self-hero' : 'self-monster';
    }
  
    return attackerSide === 'hero' ? 'hero-to-monster' : 'monster-to-hero';
  }

  getCircumference(): number {
    return 2 * Math.PI * 45; 
  }

  getDashOffset(): number {
    if (!this.hero) return this.getCircumference();
    const percent = this.hero.xp / this.getXpForNextLevel(this.hero.level);
    return this.getCircumference() * (1 - percent);
  }

  incrementBattleCount() {
    const count = Number(localStorage.getItem('battlesFought') || 0) + 1;
    localStorage.setItem('battlesFought', count.toString());
  }

  returnToMainMenu() {
    this.showRunComplete = false;
    this.router.navigate(['/']);
  }

  playMove(move: any) {
    if (!this.hero || !this.monster) return;
    if (this.currentTurn !== 'hero') return;

    this.currentTurn = 'monster';

    this.projectile = {
      iconPath: this.getMoveIconPath(move),
      direction: this.getProjectileDirection(move, 'hero')
    };

    setTimeout(() => {
      this.projectile = null;

      this.gameService.playerAttack(move).subscribe((res: any) => {
        const monsterHpBefore = this.monster!.hp;
        const heroHpBefore = this.hero!.hp;

        this.hero = { ...res.hero, moves: this.hero!.moves };
        this.monster = { ...res.monster };
        this.gameService.setHero(this.hero);

        this.shakeMonster = true;
        setTimeout(() => this.shakeMonster = false, 300);

        const monsterDamage = monsterHpBefore - res.monster.hp;
        if (monsterDamage > 0) {
          this.damageNumbers.push({ value: -monsterDamage, x: 'monster' });
          setTimeout(() => this.damageNumbers.shift(), 800);
        }

        const heroHeal = res.hero.hp - heroHpBefore;
        if (heroHeal > 0) {
          this.damageNumbers.push({ value: heroHeal, x: 'hero' });
          setTimeout(() => this.damageNumbers.shift(), 800);
        }

        const heroName = this.hero?.name || 'Hero';
        const monsterName = this.monster?.name || 'Monster';

        if (move.effect === 'damage') {
          this.addLog(`${heroName} used ${move.name}. ${monsterName} took ${res.damage} damage.`);
        } 
        else if (move.effect === 'heal') {
          this.addLog(`${heroName} used ${move.name}. Healed ${res.healAmount} HP.`);
        } 
        else if (move.effect === 'buff') {
          this.addLog(`${heroName} used ${move.name}. ${move.stat} raised.`);
        } 
        else if (move.effect === 'debuff') {
          this.addLog(`${heroName} used ${move.name}. ${monsterName}'s ${move.stat} lowered.`);
        }
        if (move.secondaryDamage && move.effect !== 'damage') {
          this.addLog(`${monsterName} also took ${res.damage} damage.`);
        }

        if (this.monster!.hp <= 0) {
          this.handleVictory(res.leveledUp);
          return;
        }

        if (res.leveledUp) {
          this.showStatChoice = true;
          return;
        }

        this.handleMonsterTurn();
      });
    }, 900);
  }

  handleMonsterTurn() {
    setTimeout(() => {
      this.gameService.getMonsterMove(this.monster!).subscribe((res: any) => {
        this.projectile = {
          iconPath: this.getMoveIconPath(res.move),
          direction: this.getProjectileDirection(res.move, 'monster')
        };

        this.enemyMoveName = res.move.name;

        setTimeout(() => {
          this.projectile = null;

          const heroBefore = this.hero!.hp;
          const monsterHpBefore = this.monster!.hp;

          this.hero = { ...res.hero, moves: this.hero!.moves };
          this.monster = { ...res.monster };
          this.gameService.setHero(this.hero);

          this.shakeHero = true;
          setTimeout(() => this.shakeHero = false, 300);

          const actualDamage = heroBefore - res.hero.hp;
          if (actualDamage > 0) {
            this.damageNumbers.push({ value: -actualDamage, x: 'hero' });
            setTimeout(() => this.damageNumbers.shift(), 800);
          }

          const monsterHeal = res.monster.hp - monsterHpBefore;
          if (monsterHeal > 0) {
            this.damageNumbers.push({ value: monsterHeal, x: 'monster' });
            setTimeout(() => this.damageNumbers.shift(), 800);
          }

          const heroName = this.hero?.name || 'Hero';
          const monsterName = this.monster?.name || 'Monster';
          const move = res.move;

          if (move.effect === 'damage') {
            this.addLog(`${monsterName} used ${move.name}. ${heroName} took ${res.damageDealt} damage.`);
          } 
          else if (move.effect === 'heal') {
            this.addLog(`${monsterName} used ${move.name}. Healed ${res.healAmount} HP.`);
          } 
          else if (move.effect === 'buff') {
            let msg = `${monsterName} used ${move.name}. ${move.stat} raised.`;
            if (res.selfHpCost) msg += ` (cost ${res.selfHpCost} HP)`;
            this.addLog(msg);
          } 
          else if (move.effect === 'debuff') {
            this.addLog(`${monsterName} used ${move.name}. ${heroName}'s ${move.stat} lowered.`);
          }
          if (move.secondaryDamage && move.effect !== 'damage') {
            this.addLog(`${heroName} also took ${res.damageDealt} damage.`);
          }

          if (this.hero!.hp <= 0) {
            setTimeout(() => {
              this.showDefeat = true;
            }, 500);
            return;
          }

          setTimeout(() => {
            this.currentTurn = 'hero';
            this.enemyMoveName = '';
          }, 500);

        }, 900);
      });
    }, 1000);
  } 

  handleVictory(leveledUp: boolean) {
    const learnedMove = this.getRandomMonsterMove();

    if (learnedMove) {
      this.gameService.saveLearnedMove(learnedMove).subscribe();
    }

    const learnedMoves = JSON.parse(localStorage.getItem('learnedMoves') || '[]');
    learnedMoves.push(learnedMove);
    localStorage.setItem('learnedMoves', JSON.stringify(learnedMoves));
    localStorage.setItem('hasNewMoves', 'true');

    this.rewardMove = learnedMove;

    const currentMonsterIndex = Number(localStorage.getItem('currentMonsterIndex') || 0);
    const unlockedIndex = Number(localStorage.getItem('unlockedIndex') || 0);
    const total = Number(localStorage.getItem('totalMonsters') || 5);

    if (currentMonsterIndex === unlockedIndex) {
      if (unlockedIndex < total - 1) {
        localStorage.setItem('unlockedIndex', (unlockedIndex + 1).toString());
      }
    }

    const isLastMonster = currentMonsterIndex >= total - 1;

    if (isLastMonster) {
      this.movesLearnedCount = learnedMoves.length;
      this.battlesFought = Number(localStorage.getItem('battlesFought') || 0);

      const isGuest = !localStorage.getItem('token');
      if (isGuest) {
        localStorage.removeItem('savedRun');
      } 
      else {
        this.gameService.deleteRun().subscribe();
      }

      if (leveledUp) {
        this.showStatChoice = true;
        this.pendingRunComplete = true;
      } 
      else {
        this.runsCompleted = Number(localStorage.getItem('runsCompleted') || 0);
        this.showRunComplete = true;
      }
      return;
    }

    if (leveledUp) {
      this.showStatChoice = true;
      this.pendingReward = true;
    } 
    else {
      this.showReward = true;
    }
  }

  chooseStat(stat: string) {
    this.gameService.chooseStat(stat).subscribe((res: any) => {
      this.hero = { ...res.hero, moves: this.hero!.moves };
      this.gameService.setHero(this.hero);
      this.showStatChoice = false;

      if (this.pendingRunComplete) {
        this.pendingRunComplete = false;
        this.showRunComplete = true;
      } 
      else if (this.pendingReward) {
        this.pendingReward = false;
        this.showReward = true;
      } 
      else {
        this.handleMonsterTurn();
      }
    });
  }

  saveAndExit() {
    const state = {
      inBattle: true,
      currentMonsterIndex: Number(localStorage.getItem('currentMonsterIndex') || 0),
      unlockedIndex: Number(localStorage.getItem('unlockedIndex') || 0),
      hero: this.hero,
      monster: this.monster,
      equippedMoves: this.hero?.moves,
      learnedMoves: JSON.parse(localStorage.getItem('learnedMoves') || '[]'),
      battleLog: this.battleLog,
      environment: this.currentEnvironment    
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

  startOver() {
    this.gameService.resetHero().subscribe(() => {
      localStorage.removeItem('learnedMoves');
      localStorage.removeItem('hasNewMoves');
      localStorage.removeItem('battlesFought');
      localStorage.removeItem('equippedMoves');
      localStorage.removeItem('runsCompleted');
      localStorage.removeItem('heroClass');     
      localStorage.setItem('unlockedIndex', '0');
      localStorage.setItem('currentMonsterIndex', '0');

      const isGuest = !localStorage.getItem('token');

      const proceed = () => {
        this.gameService.getRunConfig(1).subscribe(data => {
          localStorage.setItem('monsters', JSON.stringify(data.monsters));
          localStorage.setItem('totalMonsters', data.monsters.length.toString());

          this.gameService.getHero().subscribe(hero => {
            this.gameService.setHero(hero);
            this.showRunComplete = false;
            this.router.navigate(['/hero-selection']);
          });
        });
      };

      if (isGuest) {
        localStorage.removeItem('savedRun');
        proceed();
      } 
      else {
        this.gameService.deleteRun().subscribe(() => proceed());
      }
    });
  }

  continueFighting() {
    const isGuest = !localStorage.getItem('token');
    
    if (isGuest) {
      const runs = Number(localStorage.getItem('runsCompleted') || 0) + 1;
      localStorage.setItem('runsCompleted', runs.toString());
      localStorage.setItem('unlockedIndex', '0');
      localStorage.setItem('currentMonsterIndex', '0');
      
      const multiplier = 1 + runs * 0.3;
      this.gameService.getRunConfig(multiplier).subscribe(data => {
        localStorage.setItem('monsters', JSON.stringify(data.monsters));
        
        if (this.hero) {
          this.hero.hp = this.hero.maxHp;
          this.gameService.setHero(this.hero);
        }
        
        this.showRunComplete = false;
        this.router.navigate(['/run-overview']);
      });
    } 
    else {
      this.gameService.continueFighting().subscribe((res: any) => {
        const runs = res.runsCompleted || 1;
        localStorage.setItem('runsCompleted', runs.toString());
        localStorage.setItem('unlockedIndex', '0');
        localStorage.setItem('currentMonsterIndex', '0');
        
        const multiplier = 1 + runs * 0.3;
        this.gameService.getRunConfig(multiplier).subscribe(data => {
          localStorage.setItem('monsters', JSON.stringify(data.monsters));
          
          if (this.hero) {
            this.hero.hp = this.hero.maxHp;
            this.gameService.setHero(this.hero);
          }
          
          this.showRunComplete = false;
          this.router.navigate(['/run-overview']);
        });
      });
    }
  }
}