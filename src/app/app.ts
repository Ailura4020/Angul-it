import { Component } from '@angular/core';
// 1. On ajoute RouterLinkActive dans l'import
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  // 2. On l'ajoute ici pour pouvoir l'utiliser dans le HTML
  imports: [RouterOutlet, RouterLink, RouterLinkActive], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'angul-it';
}