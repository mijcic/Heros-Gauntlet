import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-button',
  imports: [CommonModule],
  templateUrl: './back-button.html',
  styleUrl: './back-button.css',
})
export class BackButton {
  private router = inject(Router);

  @Input() to: string = '/';        
  @Input() confirm: boolean = false; 
  @Input() confirmMessage: string = 'Are you sure you want to go back?';

  showConfirm = false;

  onClick() {
    if (this.confirm) {
      this.showConfirm = true;
    } 
    else {
      this.router.navigate([this.to]);
    }
  }

  confirmYes() {
    this.showConfirm = false;
    this.router.navigate([this.to]);
  }

  confirmNo() {
    this.showConfirm = false;
  }
}
