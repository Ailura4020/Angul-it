import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router'; // 1. On ajoute Router ici
import { GameService } from './game';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  // 2. On injecte 'public router: Router' pour l'utiliser dans le HTML
  constructor(public game: GameService, public router: Router) {}
}