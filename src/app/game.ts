import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// On définit à quoi ressemble une image de jeu
export interface GameImage {
  id: number;
  url: string;      // L'image à afficher
  valide: boolean;  // Est-ce que c'est une bonne réponse ?
  selected: boolean; // Est-ce que l'utilisateur a cliqué dessus ?
}

// On définit à quoi ressemble un niveau
export interface Challenge {
  instruction: string;
  images: GameImage[];
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  
  currentStep: number = 1;
  readonly totalSteps: number = 2;

  // --- NOS DONNÉES DE JEU (Hardcodées pour l'instant) ---
  challenges: Challenge[] = [
    // NIVEAU 1 (Index 0 dans le tableau)
    {
      instruction: "Sélectionnez tous les ROBOTS",
      images: [
        { id: 1, url: 'https://placehold.co/150/1a0b2e/00ffff?text=ROBOT', valide: true, selected: false },
        { id: 2, url: 'https://placehold.co/150/1a0b2e/ffffff?text=HUMAIN', valide: false, selected: false },
        { id: 3, url: 'https://placehold.co/150/1a0b2e/00ffff?text=ROBOT', valide: true, selected: false },
        { id: 4, url: 'https://placehold.co/150/1a0b2e/ffffff?text=CHAT', valide: false, selected: false }
      ]
    },
    // NIVEAU 2 (Index 1 dans le tableau)
    {
      instruction: "Sélectionnez toutes les ARMES",
      images: [
        { id: 1, url: 'https://placehold.co/150/000000/ff0055?text=EPEE', valide: true, selected: false },
        { id: 2, url: 'https://placehold.co/150/000000/ffffff?text=FLEUR', valide: false, selected: false },
        { id: 3, url: 'https://placehold.co/150/000000/ffffff?text=LIVRE', valide: false, selected: false },
        { id: 4, url: 'https://placehold.co/150/000000/ff0055?text=HACHE', valide: true, selected: false }
      ]
    }
  ];

  constructor(private router: Router) { 
    this.loadState();
  }

  // --- RÉCUPÉRER LE CHALLENGE ACTUEL ---
  getCurrentChallenge(): Challenge {
    // Les tableaux commencent à 0, donc on fait step - 1
    return this.challenges[this.currentStep - 1];
  }

  // --- LOGIQUE DE VALIDATION ---
  // Cette fonction vérifie si l'utilisateur a bon
  checkAnswers(): boolean {
    const currentChallenge = this.getCurrentChallenge();
    
    // On vérifie chaque image
    for (let img of currentChallenge.images) {
      // Si (C'est valide ET pas sélectionné) OU (Pas valide ET sélectionné) => ERREUR
      if (img.valide !== img.selected) {
        return false; // Perdu
      }
    }
    return true; // Tout est bon !
  }
// Nouvelle méthode pour avoir le détail de l'erreur
  getValidationStatus(): 'OK' | 'WRONG_SELECTION' | 'MISSING_TARGET' {
    const currentChallenge = this.getCurrentChallenge();
    let missedCorrect = false;

    for (let img of currentChallenge.images) {
      // Cas 1 : J'ai sélectionné un truc qu'il ne fallait pas (GRAVE)
      if (img.selected && !img.valide) {
        return 'WRONG_SELECTION'; 
      }
      
      // Cas 2 : Je n'ai pas sélectionné un truc qu'il fallait (MOINS GRAVE)
      if (!img.selected && img.valide) {
        missedCorrect = true;
      }
    }

    // Si j'ai manqué des trucs valides (mais sans cliquer de faux)
    if (missedCorrect) {
      return 'MISSING_TARGET';
    }

    // Sinon, tout est parfait
    return 'OK';
  }
  // --- PROGRESSION ---
  validateStep() {
    // On vérifie d'abord si les réponses sont bonnes
    if (this.checkAnswers()) {
      // Si c'est bon, on passe à la suite
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        this.saveState();
        // Petite astuce : on reset les sélections pour le prochain niveau
        this.resetSelections(); 
      } else {
        this.currentStep = this.totalSteps + 1;
        this.saveState();
        this.router.navigate(['/result']);
      }
    } else {
      alert("Mauvaise réponse ! Essayez encore."); // Simple alerte pour l'instant
    }
  }

  private resetSelections() {
    this.challenges.forEach(c => c.images.forEach(i => i.selected = false));
  }

  // ... (Garde les méthodes saveState, loadState, finishGame, resetGame comme avant) ...
  private saveState() {
    localStorage.setItem('angulIt_level', this.currentStep.toString());
  }

  private loadState() {
    const savedLevel = localStorage.getItem('angulIt_level');
    if (savedLevel) {
      this.currentStep = parseInt(savedLevel, 10);
    }
  }

  resetGame() {
    this.currentStep = 1;
    this.resetSelections(); // Important de remettre à zéro
    localStorage.removeItem('angulIt_level');
    this.router.navigate(['/captcha']);
  }
  
  isGameFinished(): boolean {
    return this.currentStep > this.totalSteps;
  }
}