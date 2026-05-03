import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LevelRing } from './components/level-ring/level-ring';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LevelRing],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title="New app"
}
