import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {

  usuario = {
    username: '',
    nombre: '',
    apellidos: '',
    telefono: '',
    fechanacimiento: '',
    password: '',
    codigoInvitacion: '',
  };

  constructor(private api: ApiService, private router: Router) {}

  registrar() {

    if (!this.usuario.username || !this.usuario.codigoInvitacion || !this.usuario.password) {
      alert('Por favor, rellena el nombre de usuario, la contraseña y el código de invitación.');
      return;
    }


    const datosParaEnviar = {
      username: this.usuario.username,
      nombre: this.usuario.nombre,
      apellidos: this.usuario.apellidos,
      telefono: this.usuario.telefono,
      fechanacimiento: this.usuario.fechanacimiento,
      contraseña: this.usuario.password,
      codigoInvitacion: this.usuario.codigoInvitacion,
    };

    this.api.registro(datosParaEnviar).subscribe({
      next: (res) => {
        alert('¡Usuario registrado con éxito! Ya puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);

        const mensajeError = err.error?.mensaje || 'Error al registrar el usuario.';
        alert(mensajeError);
      },
    });
  }
}
