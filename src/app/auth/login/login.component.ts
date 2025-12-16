import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // 1. Importar Router
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  esModoLogin: boolean = true;

  // 2. Inyectar el Router en el constructor
  constructor(private router: Router) {}

  cambiarModo() {
    this.esModoLogin = !this.esModoLogin;
  }

  // 3. Crear función para el botón de entrar
  onEnviar() {
    // Aquí iría tu lógica real de autenticación (conectar con base de datos)
    console.log('Iniciando sesión o registrando...');

    // Simulamos que todo salió bien y redirigimos al INICIO
    this.router.navigate(['/inicio']);
  }
}
