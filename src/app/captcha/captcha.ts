import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService, Challenge, GameImage } from '../game';
import { CommonModule } from '@angular/common'; // Nécessaire pour les boucles

@Component({
  selector: 'app-captcha',
  standalone: true,
  // IMPORTANT : Ajoute CommonModule ici pour que le HTML comprenne les boucles
  imports: [CommonModule], 
  templateUrl: './captcha.html',
  styleUrl: './captcha.css'
})
export class CaptchaComponent implements OnInit {
  
  currentChallenge!: Challenge; // Le défi en cours
  errorMessage: string = '';

  constructor(public game: GameService, private router: Router) {}

  ngOnInit() {
    // Redirection si fini
    if (this.game.isGameFinished()) {
      this.router.navigate(['/result']);
      return;
    }
    // Charge le défi du niveau actuel
    this.loadChallenge();
  }

  loadChallenge() {
    this.currentChallenge = this.game.getCurrentChallenge();
    this.errorMessage = ''; // On efface les erreurs
  }

  // Quand on clique sur une image
  toggleSelection(img: GameImage) {
    img.selected = !img.selected; // On inverse (Vrai -> Faux ou Faux -> Vrai)
  }

  // Quand on clique sur Valider
  validate() {
    // 1. On demande au service le statut précis
    const status = this.game.getValidationStatus();

    // 2. On agit selon le statut
    if (status === 'OK') {
      // C'est tout bon, on passe à la suite
      this.game.validateStep();
      
      if (!this.game.isGameFinished()) {
        this.loadChallenge();
      }
    } 
    else if (status === 'WRONG_SELECTION') {
      // Erreur grave : on a cliqué un intrus
      this.errorMessage = "ALERTE : Cible incorrecte identifiée !";
    } 
    else if (status === 'MISSING_TARGET') {
      // Erreur légère : il en manque
      this.errorMessage = "INCOMPLET : Il reste des cibles à valider.";
    }
  }
}