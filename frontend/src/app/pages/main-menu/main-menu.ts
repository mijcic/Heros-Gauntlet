import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main-menu',
  imports: [ CommonModule, FormsModule ],
  templateUrl: './main-menu.html',
  styleUrl: './main-menu.css',
})
export class MainMenu {
  private router = inject(Router);
  private gameService = inject(GameService);

  showLogin = false;
  showRegister = false;
  showResumePrompt = false;
  isLoggingIn = false;
  loginSuccess = false;
  isRegistering = false;
  
  username = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  savedRunInfo: any = null;
  pendingAction: 'guest' | 'login' | null = null;

  startAsGuest() {
    localStorage.removeItem('token');
    this.gameService.setHero(null);

    this.pendingAction = 'guest';
    this.checkForSavedRun(() => {
      localStorage.clear();
      localStorage.setItem('unlockedIndex', '0');
      this.initGame();
    });
  }

  login() {
    this.errorMessage = '';
    this.isLoggingIn = true;
    
    this.gameService.login(this.username, this.password).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.pendingAction = 'login';
        
        this.checkForSavedRun(() => {
          this.isLoggingIn = false;
          this.loginSuccess = true;
          setTimeout(() => this.initGame(), 800);
        });
      },
      error: (err) => {
        this.isLoggingIn = false;
        this.errorMessage = err.error?.error || 'Wrong username or password';
      }
    });
  }

  register() {
    this.errorMessage = '';
    this.isRegistering = true;
    
    this.gameService.register(this.username, this.password).subscribe({
      next: () => {
        this.isRegistering = false;
        this.successMessage = 'Account created! You can now log in.';
        this.showRegister = false;
        this.showLogin = true;
      },
      error: (err) => {
        this.isRegistering = false;
        this.errorMessage = err.error?.error || 'Registration failed';
      }
    });
  }

  initGame() {
    const isGuest = !localStorage.getItem('token');
    const guestRuns = Number(localStorage.getItem('runsCompleted') || 0);
    const initialMultiplier = isGuest ? (1 + guestRuns * 0.3) : 1;

    this.gameService.getRunConfig(initialMultiplier).subscribe(data => {
      localStorage.setItem('monsters', JSON.stringify(data.monsters));
      localStorage.setItem('totalMonsters', data.monsters.length.toString());

      this.gameService.getHero().subscribe(hero => {
        const heroRuns = hero.runsCompleted || 0;
        const realMultiplier = 1 + heroRuns * 0.3;

        if (!isGuest && realMultiplier !== initialMultiplier) {
          this.gameService.getRunConfig(realMultiplier).subscribe(newData => {
            localStorage.setItem('monsters', JSON.stringify(newData.monsters));
            this.finalizeInitGame(hero);
          });
        } 
        else {
          this.finalizeInitGame(hero);
        }
      });
    });
  }

  private finalizeInitGame(hero: any) {
    localStorage.setItem('equippedMoves', JSON.stringify(hero.moves));
    localStorage.setItem('learnedMoves', JSON.stringify(hero.learnedMoves || hero.moves));
    localStorage.setItem('heroBase', JSON.stringify(hero));
    localStorage.setItem('runsCompleted', (hero.runsCompleted || 0).toString());
    if (hero.heroClass) {
      localStorage.setItem('heroClass', hero.heroClass);
    }
    this.gameService.setHero(hero);

    const unlockedIndex = hero.unlockedIndex ?? 0;
    localStorage.setItem('unlockedIndex', unlockedIndex.toString());

    const isNewHero = hero.level === 1 && (!hero.learnedMoves || hero.learnedMoves.length === 0);
    
    if (isNewHero) {
      this.router.navigate(['/hero-selection']);
    } 
    else {
      this.router.navigate(['/run-overview']);
    }
  }

  openLogin() {
    this.showLogin = true;
    this.showRegister = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  openRegister() {
    this.showRegister = true;
    this.showLogin = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeModal() {
    this.showLogin = false;
    this.showRegister = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  checkForSavedRun(onNoSave: () => void) {
    const isGuest = !localStorage.getItem('token');

    if (isGuest) {
      const data = localStorage.getItem('savedRun');
      if (data) {
        this.savedRunInfo = JSON.parse(data);
        this.isLoggingIn = false;       
        this.showResumePrompt = true;   
      } 
      else {
        onNoSave();
      }
    } 
    else {
      this.gameService.loadRun().subscribe((res: any) => {
        if (res.save) {
          this.savedRunInfo = res.save;
          this.isLoggingIn = false;     
          this.showResumePrompt = true;
        } 
        else {
          onNoSave();
        }
      });
    }
  }

  resumeRun() {
    const state = this.savedRunInfo.state;

    localStorage.setItem('currentMonsterIndex', state.currentMonsterIndex.toString());
    localStorage.setItem('unlockedIndex', state.unlockedIndex.toString());
    localStorage.setItem('equippedMoves', JSON.stringify(state.equippedMoves || []));
    localStorage.setItem('learnedMoves', JSON.stringify(state.learnedMoves || []));

    this.gameService.getRunConfig().subscribe(data => {
      localStorage.setItem('monsters', JSON.stringify(data.monsters));
      localStorage.setItem('totalMonsters', data.monsters.length.toString());

      if (state.inBattle && state.monster && state.hero) {
        this.gameService.setHero(state.hero);
        localStorage.setItem('currentMonster', JSON.stringify(state.monster));
        
        if (state.environment) {
          localStorage.setItem('currentEnvironment', JSON.stringify(state.environment));
        }

        this.gameService.setCurrentMonster(state.monster, true, state.hero).subscribe(() => {
          const setEnvObservable = state.environment ? this.gameService.setEnvironment(state.environment.id) : null;
          
          const proceedToBattle = () => {
            sessionStorage.setItem('resumeBattle', JSON.stringify({
              hero: state.hero,
              monster: state.monster,
              battleLog: state.battleLog || [],
              environment: state.environment || null  
            }));
            this.showResumePrompt = false;
            this.router.navigate(['/battle']);
          };

          if (setEnvObservable) {
            setEnvObservable.subscribe(() => proceedToBattle());
          } 
          else {
            proceedToBattle();
          }
        });
      } 
      else {
        this.gameService.getHero().subscribe(hero => {
          this.gameService.setHero(hero);
          this.showResumePrompt = false;
          this.router.navigate(['/run-overview']);
        });
      }
    });
  }

  discardSaveAndStartNew() {
    const isGuest = !localStorage.getItem('token');

    const proceed = () => {
      this.showResumePrompt = false;
      if (this.pendingAction === 'guest') {
        localStorage.clear();
        localStorage.setItem('unlockedIndex', '0');
      }
      localStorage.removeItem('hasNewMoves');
      this.initGame();
    };

    this.gameService.resetHero().subscribe(() => {
      if (isGuest) {
        localStorage.removeItem('savedRun');
        proceed();
      } 
      else {
        this.gameService.deleteRun().subscribe(() => proceed());
      }
    });
  }
}