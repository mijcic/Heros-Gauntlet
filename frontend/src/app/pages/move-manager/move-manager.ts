import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-move-manager',
  imports: [CommonModule],
  templateUrl: './move-manager.html',
  styleUrl: './move-manager.css',
})
export class MoveManager {
  private router = inject(Router)
  
  learnedMoves: any[] = [];
  equippedMoves: any[] = [];

  ngOnInit() {
    this.learnedMoves = JSON.parse(localStorage.getItem('learnedMoves') || '[]');
    this.equippedMoves = JSON.parse(localStorage.getItem('equippedMoves') || '[]');
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
