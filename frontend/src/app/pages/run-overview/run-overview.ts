import { Component, inject } from '@angular/core';
import { Monster } from '../../models/monster';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-run-overview',
  imports: [CommonModule],
  templateUrl: './run-overview.html',
  styleUrl: './run-overview.css',
})
export class RunOverview {
  private router = inject(Router)
  unlockedIndex = 0;
  monsters: Monster[] = [];
  equippedMoves: any[] = [];

  ngOnInit() {
    let data = localStorage.getItem('monsters');
    if (data) {
      this.monsters = data ? JSON.parse(data) : [];
    }

    this.unlockedIndex = Number(localStorage.getItem('unlockedIndex') || 0);

    this.equippedMoves = JSON.parse(localStorage.getItem('equippedMoves') || '[]');
  }

  selectMonster(index: number) {
    if (index > this.unlockedIndex) return;
    let monster = this.monsters[index];
    localStorage.setItem('currentMonster', JSON.stringify(monster));
    this.router.navigate(['/battle']);
  }

  openMoveManager() {
    this.router.navigate(['/move-manager']);
  }
}
