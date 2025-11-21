import { TestBed } from '@angular/core/testing';
import { GameService } from './game';
import { Router } from '@angular/router';

// 1. On crée nous-mêmes un "Faux Routeur" simple (Mock)
// Plus besoin de jasmine ou de vi.fn()
class MockRouter {
  // Cette variable va retenir la dernière page visitée
  lastNavigation: any[] | null = null;

  navigate(commands: any[]) {
    this.lastNavigation = commands; // On note l'URL demandée
    return Promise.resolve(true);
  }
}

describe('GameService', () => {
  let service: GameService;
  let routerSpy: MockRouter; // On utilise notre propre type

  beforeEach(() => {
    // On instancie notre faux routeur
    routerSpy = new MockRouter();

    TestBed.configureTestingModule({
      providers: [
        GameService,
        // On dit à Angular : "Quand tu as besoin du Router, prends mon MockRouter"
        { provide: Router, useValue: routerSpy }
      ]
    });

    localStorage.clear();
    service = TestBed.inject(GameService);
    // On force le niveau 1 au début de chaque test
    service.currentStep = 1;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start at level 1', () => {
    expect(service.currentStep).toBe(1);
    expect(service.isGameFinished()).toBe(false);
  });

  it('should save state to localStorage when progressing', () => {
    const challenge = service.getCurrentChallenge();
    
    // On sélectionne les bonnes réponses pour réussir
    challenge.images!.forEach(img => {
        img.selected = img.valide; 
    });

    service.validateStep();

    // Vérifications
    expect(service.currentStep).toBe(2);
    expect(localStorage.getItem('angulIt_level')).toBe('2');
  });

  it('should reset level and clear storage on resetGame', () => {
    // On simule qu'on est avancé
    service.currentStep = 2;
    
    service.resetGame();

    // On vérifie le retour à 1
    expect(service.currentStep).toBe(1);
    // On vérifie que le localStorage est vide
    expect(localStorage.getItem('angulIt_level')).toBeNull();
    
    // On vérifie que notre faux routeur a bien reçu l'ordre d'aller sur '/captcha'
    // Note : on compare le contenu du tableau avec toEqual
    expect(routerSpy.lastNavigation).toEqual(['/captcha']);
  });
});