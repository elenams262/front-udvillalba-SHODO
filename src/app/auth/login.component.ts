import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../app/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  // CAMBIO: Ahora usamos username
  credenciales = {
    username: '',
    password: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    // Mapeamos password a contraseña antes de enviar si tu backend lo requiere así
    const datosParaEnviar = {
      username: this.credenciales.username,
      contraseña: this.credenciales.password,
    };

    this.authService.login(datosParaEnviar).subscribe({
      next: (res) => {
        // Almacenamos el token y redirigimos
        localStorage.setItem('token', res.token);
        localStorage.setItem('rol', res.rol);
        localStorage.setItem('nombre', res.nombre);

        this.router.navigate(['/']);
      },
      error: (err) => {
        alert(err.error?.mensaje || 'Error al iniciar sesión');
      },
    });
  }
}
