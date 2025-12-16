import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// Importamos el componente hijo

@Component({
  selector: 'app-home',
  standalone: true,
  // AÑADIMOS EL COMPONENTE HIJO AQUÍ
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('token'); // Borramos la llave
    this.router.navigate(['/login']); // Lo mandamos fuera
  }
}
