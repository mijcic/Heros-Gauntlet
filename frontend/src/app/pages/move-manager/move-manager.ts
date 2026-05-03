import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BackButton } from '../../components/back-button/back-button';

@Component({
  selector: 'app-move-manager',
  imports: [CommonModule, BackButton],
  templateUrl: './move-manager.html',
  styleUrl: './move-manager.css',
})
export class MoveManager {
  private router = inject(Router)
  
  learnedMoves: any[] = [];
  equippedMoves: any[] = [];

  hoveredMove: any = null;

  ngOnInit() {
    const learned = JSON.parse(localStorage.getItem('learnedMoves') || '[]');
    const equipped = JSON.parse(localStorage.getItem('equippedMoves') || '[]');

    const all = [...learned];
    for (const move of equipped) {
      if (!all.some((m: any) => m.name === move.name)) {
        all.push(move);
      }
    }

    this.learnedMoves = all;
    this.equippedMoves = equipped;
  }

  toggleMove(move: any) {
    let index = this.equippedMoves.findIndex(m => m.name === move.name);

    if (index >= 0) {
      this.equippedMoves.splice(index, 1);
    } 
    else {
      if (this.equippedMoves.length < 4) {
        this.equippedMoves.push(move);
      }
    }

    localStorage.setItem('equippedMoves', JSON.stringify(this.equippedMoves));
  }

  isEquipped(move: any) {
    return this.equippedMoves.some(m => m.name === move.name);
  }

  canContinue(): boolean {
    return this.equippedMoves.length === 4;
  }

  goToMap() {
    localStorage.setItem('equippedMoves', JSON.stringify(this.equippedMoves));
    this.router.navigate(['/run-overview']);
  }
}
