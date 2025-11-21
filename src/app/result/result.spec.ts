import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultComponent } from './result';
import { RouterTestingModule } from '@angular/router/testing';
import { GameService } from '../game';

describe('ResultComponent', () => {
  let component: ResultComponent;
  let fixture: ComponentFixture<ResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // 1. On importe le routeur de test AVEC une route 'captcha' configurée
      imports: [
        ResultComponent, 
        RouterTestingModule.withRoutes([
           // On crée une route factice pour éviter l'erreur "Cannot match route"
           { path: 'captcha', redirectTo: '' } 
        ])
      ],
      providers: [GameService]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});