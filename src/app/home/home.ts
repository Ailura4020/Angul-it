import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // <--- 1. L'import doit être là

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink], // <--- 2. Et il doit être déclaré ICI
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  // Pas besoin de logique complexe pour l'instant
}