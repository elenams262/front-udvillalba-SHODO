import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {
  // CAMBIO: Usamos 'password' para evitar la ñ
  usuario = {
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    fechanacimiento: '',
    password: '',
  };

  constructor(private api: ApiService, private router: Router) {}

  registrar() {
    // TRUCO: Preparamos los datos para el backend cambiando 'password' por 'contraseña'
    const datosParaEnviar = {
      ...this.usuario, // Copia todos los campos (nombre, correo, etc.)
      contraseña: this.usuario.password, // Añade la contraseña con la ñ que quiere el backend
    };

    // (Opcional) Quitamos el campo 'password' sobrante, aunque no molesta
    // delete datosParaEnviar.password;

    this.api.registro(datosParaEnviar).subscribe({
      next: (res) => {
        alert('¡Usuario creado con éxito!');
        if (res.token) {
          localStorage.setItem('token', res.token);
        }
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        alert('Error al registrar.');
      },
    });
  }
}
