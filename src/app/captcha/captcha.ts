import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Pour les directives de base
import { FormsModule } from '@angular/forms';   // <--- INDISPENSABLE pour [(ngModel)]
import { GameService, Challenge, GameImage } from '../game';

@Component({
  selector: 'app-captcha',
  standalone: true,
  // C'est ici qu'on active les super-pouvoirs du formulaire
  imports: [CommonModule, FormsModule], 
  templateUrl: './captcha.html',
  styleUrl: './captcha.css'
})
export class CaptchaComponent implements OnInit {
  
  currentChallenge!: Challenge; // Le défi en cours
  errorMessage: string = '';    // Le message d'erreur affiché

  constructor(public game: GameService, private router: Router) {}

  // Au démarrage de la page
  ngOnInit() {
    // Si le jeu est déjà fini, on éjecte le joueur vers les résultats
    if (this.game.isGameFinished()) {
      this.router.navigate(['/result']);
      return;
    }
    // Sinon, on charge le défi
    this.loadChallenge();
  }

  // Récupérer les infos du défi actuel depuis le Service
  loadChallenge() {
    this.currentChallenge = this.game.getCurrentChallenge();
    this.errorMessage = ''; // On nettoie les anciennes erreurs
  }

  // Gérer le clic sur une image (pour les défis de type GRID)
  toggleSelection(img: GameImage) {
    img.selected = !img.selected; // On inverse la sélection
  }

  // Gérer le clic sur le bouton VALIDER
  validate() {
    // 1. On demande au Service d'analyser la réponse (Images ou Texte)
    const status = this.game.getValidationStatus();

    // 2. On réagit selon le diagnostic du Service
    if (status === 'OK') {
      // C'est gagné ! On sauvegarde et on avance
      this.game.validateStep();
      
      // Si le jeu continue, on charge le prochain niveau
      if (!this.game.isGameFinished()) {
        this.loadChallenge();
      }
      // (Si le jeu est fini, le Service a déjà géré la redirection dans validateStep)
    } 
    else if (status === 'WRONG_SELECTION') {
      this.errorMessage = "ALERTE : Cible incorrecte identifiée !";
    } 
    else if (status === 'MISSING_TARGET') {
      this.errorMessage = "INCOMPLET : Il reste des cibles à valider.";
    }
    else if (status === 'WRONG_ANSWER') {
      // Le nouveau message pour les défis texte/maths
      this.errorMessage = "ERREUR SYSTÈME : Code d'accès invalide.";
    }
  }
}