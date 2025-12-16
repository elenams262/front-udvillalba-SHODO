import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  // CAMBIO: Usamos 'password' en lugar de 'contraseña' para evitar el error de la Ñ
  credenciales = {
    correo: '',
    password: '',
  };

  mensajeError: string = '';

  constructor(private api: ApiService, private router: Router) {}

  login() {
    // TRUCO: Creamos un objeto temporal para enviar al backend
    // El backend espera "contraseña" (con ñ), así que se lo traducimos aquí
    const datosParaEnviar = {
      correo: this.credenciales.correo,
      contraseña: this.credenciales.password,
    };

    this.api.login(datosParaEnviar).subscribe({
      next: (res) => {
        console.log('Login correcto:', res);
        localStorage.setItem('token', res.token);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error login:', err);
        this.mensajeError = 'Correo o contraseña incorrectos';
      },
    });
  }
}
