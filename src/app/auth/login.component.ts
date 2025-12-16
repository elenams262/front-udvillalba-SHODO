import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// CORRECCIÓN 1: Usamos '../' en lugar de '../../' porque estamos en 'app/auth'
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  esModoLogin: boolean = true;

  credenciales = {
    correo: '',
    password: '',
  };

  mensajeError: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  cambiarModo() {
    this.esModoLogin = !this.esModoLogin;
  }

  onEnviar() {
    console.log('Intentando login...');

    const datosParaEnviar = {
      correo: this.credenciales.correo,
      contraseña: this.credenciales.password,
    };

    this.authService.login(datosParaEnviar).subscribe({
      // CORRECCIÓN 2: Añadimos ': any' para evitar el error TS7006
      next: (res: any) => {
        console.log('Login exitoso. Usuario guardado.');
        this.router.navigate(['/inicio']);
      },
      // CORRECCIÓN 2: Añadimos ': any' aquí también
      error: (err: any) => {
        console.error('Error en login:', err);
        this.mensajeError = 'Correo o contraseña incorrectos';
      },
    });
  }
}
