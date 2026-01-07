import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-proximo-partido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proximo-partido.component.html',
  styleUrls: ['./proximo-partido.component.css'],
})
export class ProximoPartidoComponent implements OnInit {
  partido: any = {
    jornada: '',
    rival: '',
    ubicacion: '',
    fecha: '',
    hora: '',
    partidoCasa: true,
  };

  esAdmin: boolean = false;
  modoEdicion: boolean = false;
  esNuevo: boolean = false;

  constructor(
    private api: ApiService,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.esAdmin = this.authService.isAdmin();
    this.cargarDatos();
  }

  cargarDatos() {
    this.api.getProximoPartido().subscribe({
      next: (data: any) => {

        const datos = Array.isArray(data) ? data[0] : data;

        if (datos && Object.keys(datos).length > 0) {
          console.log('✅ Datos recibidos:', datos);
          this.partido = datos;
          this.esNuevo = false;
        } else {
          console.log('⚠️ No hay partidos próximos.');
          this.esNuevo = true;
          this.partido = null;
        }
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.error('❌ Error cargando partido:', err);

        this.esNuevo = true;
        this.partido = null;
        this.cd.detectChanges();
      },
    });
  }

  toggleEdicion() {
    this.modoEdicion = !this.modoEdicion;
  }



  guardarCambios() {
    if (!this.esNuevo && this.partido._id) {

      const datosUpdate = {
        jornada: this.partido.jornada,
        equipoLocal: this.partido.equipoLocal,
        equipoVisitante: this.partido.equipoVisitante,
        ubicacion: this.partido.ubicacion,
        fecha: this.partido.fecha,
        hora: this.partido.hora,
        isPlayed: this.partido.isPlayed || false,
      };

      this.api.actualizarPartido(this.partido._id, datosUpdate).subscribe({
        next: () => {
          alert('✅ Partido actualizado correctamente');
          this.modoEdicion = false;
          this.cargarDatos();
        },
        error: (err) => alert('❌ Error al actualizar: ' + (err.error.msg || err.message)),
      });
    } else {

      const nuevoPartido = {
        jornada: this.partido.jornada,
        equipoLocal: this.partido.partidoCasa ? 'UD Villalba' : this.partido.rival,
        equipoVisitante: this.partido.partidoCasa ? this.partido.rival : 'UD Villalba',
        ubicacion: this.partido.ubicacion,
        fecha: this.partido.fecha,
        hora: this.partido.hora,
        isPlayed: false,
      };

      this.api.crearPartido(nuevoPartido).subscribe({
        next: () => {
          alert('✅ Nuevo partido creado');
          this.modoEdicion = false;
          this.cargarDatos();
        },
        error: (err) => alert('❌ Error al crear partido'),
      });
    }
  }
  eliminarPartido() {
    if (!this.partido._id) return;

    if (confirm('⚠️ ¿Seguro que quieres borrar este partido? Esta acción no se puede deshacer.')) {
      this.api.eliminarPartido(this.partido._id).subscribe({
        next: () => {
          alert('🗑️ Partido eliminado.');
          this.partido = null;
          this.cargarDatos();
        },
        error: (err: any) => {
          console.error(err);
          alert('Error al eliminar');
        },
      });
    }
  }
}
