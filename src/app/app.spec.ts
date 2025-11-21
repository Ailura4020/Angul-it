import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app'; // On importe bien AppComponent
import { RouterTestingModule } from '@angular/router/testing'; // Pour gérer les routes

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});