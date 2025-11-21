import { Component } from '@angular/core';
import { GameService } from '../game'; // On importe le moteur

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [],
  templateUrl: './result.html',
  styleUrl: './result.css'
})
export class ResultComponent {
  // On injecte le service pour pouvoir l'utiliser dans le HTML
  constructor(public game: GameService) {}
}