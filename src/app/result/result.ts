import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import du Router
import { GameService } from '../game';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [],
  templateUrl: './result.html',
  styleUrl: './result.css'
})
// On implémente OnInit pour vérifier dès l'ouverture
export class ResultComponent implements OnInit {
  
  constructor(
    public game: GameService, 
    private router: Router // Injection du Router
  ) {}

  ngOnInit() {
    // SI le jeu N'EST PAS fini (le ! veut dire "NOT")
    if (!this.game.isGameFinished()) {
      // On redirige de force vers le captcha
      this.router.navigate(['/captcha']);
    }
  }
}