import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface GameImage {
  id: number;
  url: string;
  valide: boolean;
  selected: boolean;
}

export interface Challenge {
  type: 'GRID' | 'INPUT';
  instruction: string;
  images?: GameImage[];
  answer?: string;
  userAnswer?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  
  currentStep: number = 1;
  readonly totalSteps: number = 4; 

  // --- 1. LES BANQUES DE DONNÉES (Pour l'aléatoire) ---
  
  private mathBank = [
    { q: '12 + 15', a: '27' },
    { q: '100 - 45', a: '55' },
    { q: '8 x 7', a: '56' },
    { q: '50 / 2', a: '25' },
    { q: '10 + 10 + 10', a: '30' },
    { q: '3 x 3 + 1', a: '10' }
  ];

  private passwordBank = [
    'FURY', 'CYBER', 'NEON', 'MATRIX', 'ANGULAR', 
    'PIXEL', 'GLITCH', 'SYNTAX', 'PROXY', 'VECTOR'
  ];

  // --- 2. LES CHALLENGES (Initialisés vides, remplis dynamiquement) ---
  challenges: Challenge[] = [
    // NIVEAU 1 : IMAGES (Robots) - Statique pour l'instant (ou mélangeable)
    {
      type: 'GRID',
      instruction: "SÉLECTIONNEZ TOUS LES ROBOTS",
      images: [
        { id: 1, url: 'https://placehold.co/150/1a0b2e/00ffff?text=ROBOT', valide: true, selected: false },
        { id: 2, url: 'https://placehold.co/150/1a0b2e/ffffff?text=HUMAIN', valide: false, selected: false },
        { id: 3, url: 'https://placehold.co/150/1a0b2e/00ffff?text=ROBOT', valide: true, selected: false },
        { id: 4, url: 'https://placehold.co/150/1a0b2e/ffffff?text=CHAT', valide: false, selected: false }
      ]
    },
    // NIVEAU 2 : IMAGES (Armes)
    {
      type: 'GRID',
      instruction: "SÉLECTIONNEZ TOUTES LES ARMES",
      images: [
        { id: 1, url: 'https://placehold.co/150/000000/ff0055?text=EPEE', valide: true, selected: false },
        { id: 2, url: 'https://placehold.co/150/000000/ffffff?text=FLEUR', valide: false, selected: false },
        { id: 3, url: 'https://placehold.co/150/000000/ffffff?text=LIVRE', valide: false, selected: false },
        { id: 4, url: 'https://placehold.co/150/000000/ff0055?text=HACHE', valide: true, selected: false }
      ]
    },
    // NIVEAU 3 : Sera remplacé par le random
    { type: 'INPUT', instruction: '', answer: '', userAnswer: '' },
    // NIVEAU 4 : Sera remplacé par le random
    { type: 'INPUT', instruction: '', answer: '', userAnswer: '' }
  ];

  constructor(private router: Router) { 
    // Important : On prépare les questions AVANT de charger la sauvegarde
    this.prepareRandomChallenges();
    this.loadState();
  }

  // --- 3. LA MAGIE DE L'ALÉATOIRE ---
  
  private prepareRandomChallenges() {
    // A. Mélange des images (Niveaux 1 et 2)
    this.shuffleImages();

    // B. Choix du calcul (Niveau 3)
    // On prend un index au hasard dans la mathBank
    const randomMath = this.mathBank[Math.floor(Math.random() * this.mathBank.length)];
    this.challenges[2] = {
      type: 'INPUT',
      instruction: `DÉCRYPTEZ LE CODE : ${randomMath.q} = ?`,
      answer: randomMath.a,
      userAnswer: ''
    };

    // C. Choix du mot de passe (Niveau 4)
    const randomWord = this.passwordBank[Math.floor(Math.random() * this.passwordBank.length)];
    this.challenges[3] = {
      type: 'INPUT',
      instruction: `TAPEZ LE MOT DE PASSE : '${randomWord}'`,
      answer: randomWord,
      userAnswer: ''
    };
  }

  private shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  private shuffleImages() {
    this.challenges.forEach(c => {
      if (c.type === 'GRID' && c.images) {
        this.shuffleArray(c.images);
      }
    });
  }

  // --- LE RESTE DE LA LOGIQUE (Inchangé) ---

  getCurrentChallenge(): Challenge {
    return this.challenges[this.currentStep - 1];
  }

  getValidationStatus(): 'OK' | 'WRONG_SELECTION' | 'MISSING_TARGET' | 'WRONG_ANSWER' {
    const current = this.getCurrentChallenge();

    if (current.type === 'GRID' && current.images) {
      let missedCorrect = false;
      for (let img of current.images) {
        if (img.selected && !img.valide) return 'WRONG_SELECTION';
        if (!img.selected && img.valide) missedCorrect = true;
      }
      if (missedCorrect) return 'MISSING_TARGET';
      return 'OK';
    }

    if (current.type === 'INPUT') {
      const cleanUser = current.userAnswer?.trim().toUpperCase();
      const cleanAnswer = current.answer?.toUpperCase();
      if (cleanUser === cleanAnswer) return 'OK';
      return 'WRONG_ANSWER';
    }
    return 'OK';
  }

  validateStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.saveState();
      this.resetSelections();
    } else {
      this.currentStep = this.totalSteps + 1;
      this.saveState();
      this.router.navigate(['/result']);
    }
  }

  checkAnswers(): boolean {
    return this.getValidationStatus() === 'OK';
  }

  private resetSelections() {
    this.challenges.forEach(c => {
      if (c.images) c.images.forEach(i => i.selected = false);
      if (c.type === 'INPUT') c.userAnswer = '';
    });
  }

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
    this.resetSelections();
    
    // CRUCIAL : On re-génère de nouvelles questions pour la nouvelle partie !
    this.prepareRandomChallenges(); 
    
    localStorage.removeItem('angulIt_level');
    this.router.navigate(['/captcha']);
  }
  
  isGameFinished(): boolean {
    return this.currentStep > this.totalSteps;
  }
}