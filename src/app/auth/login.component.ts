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

  credenciales = {
    username: '',
    password: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  login() {

    const datosParaEnviar = {
      username: this.credenciales.username,
      contraseña: this.credenciales.password,
    };

    this.authService.login(datosParaEnviar).subscribe({
      next: (res: any) => {
        localStorage.clear();

        localStorage.setItem('token', res.token);
        localStorage.setItem('rol', res.rol);
        localStorage.setItem('nombre', res.nombre);

        this.router.navigate(['/inicio']);
      },
      error: (err: any) => {
        console.log('Error en login', err);
        alert(err.error?.mensaje || 'Error al iniciar sesión');
      },
    });
  }
}
