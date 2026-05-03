import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameService } from '../../services/game';
import { HeroClass } from '../../models/hero-class';
import { BackButton } from '../../components/back-button/back-button';

@Component({
  selector: 'app-hero-selection',
  imports: [CommonModule, BackButton],
  templateUrl: './hero-selection.html',
  styleUrl: './hero-selection.css',
})
export class HeroSelection {
  private router = inject(Router);
  private gameService = inject(GameService);

  classes: HeroClass[] = [];
  selectedClass: HeroClass | null = null;
  isLoading = false;

  ngOnInit() {
    this.gameService.getHeroClasses().subscribe(data => {
      this.classes = data.classes;
    });
  }

  selectClass(heroClass: HeroClass) {
    this.selectedClass = heroClass;
  }

  confirmSelection() {
    if (!this.selectedClass) return;
    this.isLoading = true;

    this.gameService.selectHeroClass(this.selectedClass.id).subscribe({
      next: () => {
        localStorage.setItem('heroClass', this.selectedClass!.id);
        
        localStorage.removeItem('learnedMoves');
        localStorage.removeItem('hasNewMoves');
        localStorage.removeItem('battlesFought');
        localStorage.removeItem('runsCompleted');
        localStorage.setItem('unlockedIndex', '0');
        localStorage.setItem('currentMonsterIndex', '0');
        localStorage.setItem('equippedMoves', JSON.stringify(this.selectedClass!.defaultMoves));

        this.gameService.getHero().subscribe(hero => {
          this.gameService.setHero(hero);
          this.isLoading = false;
          this.router.navigate(['/run-overview']);
        });
      },
      error: (err) => {
        console.error('Error selecting class:', err);
        this.isLoading = false;
      }
    });
  }
}
