import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

export interface Equipo {
  _id?: string;
  posicion: number;
  escudo: string;
  nombre: string;
  puntos: number;
  partidosJugados: number;
  partidosGanados: number;
  partidosEmpatados: number;
  partidosPerdidos: number;
  golesFavor: number;
  golesContra: number;
}

@Component({
  selector: 'app-clasificacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clasificacion.component.html',
  styleUrls: ['./clasificacion.component.css'],
})
export class ClasificacionComponent implements OnInit {
  clasificacion: Equipo[] = [];
  esAdmin: boolean = false;
  modoEdicion: boolean = false;


  nuevoEquipo: Equipo = {
    posicion: 0,
    escudo: '',
    nombre: '',
    puntos: 0,
    partidosJugados: 0,
    partidosGanados: 0,
    partidosEmpatados: 0,
    partidosPerdidos: 0,
    golesFavor: 0,
    golesContra: 0,
  };

  constructor(
    public api: ApiService,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.esAdmin = this.authService.isAdmin();
    this.cargarDatos();
  }

  cargarDatos() {
    this.api.getClasificacion().subscribe({
      next: (data: any[]) => {


        this.clasificacion = data.map((item, index) => ({
          _id: item._id,
          posicion: index + 1,
          escudo: item.escudo || '',
          nombre: item.equipo,
          puntos: item.puntos,
          partidosJugados: item.partidosJugados,
          partidosGanados: item.partidosGanados,
          partidosEmpatados: item.partidosEmpatados,
          partidosPerdidos: item.partidosPerdidos,
          golesFavor: item.GF,
          golesContra: item.GC,
        }));
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error cargando clasificación:', err),
    });
  }

  toggleEdicion() {
    this.modoEdicion = !this.modoEdicion;

    if (!this.modoEdicion) {
      this.cargarDatos();
    }
  }


  guardarCambios(equipo: Equipo) {
    if (!equipo._id) return;


    const datosBackend = {
      equipo: equipo.nombre,
      escudo: equipo.escudo,
      partidosJugados: equipo.partidosJugados,
      partidosGanados: equipo.partidosGanados,
      partidosEmpatados: equipo.partidosEmpatados,
      partidosPerdidos: equipo.partidosPerdidos,
      GF: equipo.golesFavor,
      GC: equipo.golesContra,
    };

    this.api.actualizarEquipo(equipo._id, datosBackend).subscribe({
      next: () => {
        alert('✅ Equipo "' + equipo.nombre + '" actualizado');
        this.cargarDatos();
      },
      error: (err) => {
        console.error(err);
        alert('❌ Error al guardar cambios');
      },
    });
  }


  crearEquipo() {
    if (!this.nuevoEquipo.nombre) {
      alert('Debes indicar el nombre del equipo');
      return;
    }

    const datosBackend = {
      equipo: this.nuevoEquipo.nombre,
      escudo: this.nuevoEquipo.escudo,
      partidosJugados: this.nuevoEquipo.partidosJugados,
      partidosGanados: this.nuevoEquipo.partidosGanados,
      partidosEmpatados: this.nuevoEquipo.partidosEmpatados,
      partidosPerdidos: this.nuevoEquipo.partidosPerdidos,
      GF: this.nuevoEquipo.golesFavor,
      GC: this.nuevoEquipo.golesContra,
    };

    this.api.crearEquipo(datosBackend).subscribe({
      next: () => {
        alert('✅ Equipo creado con éxito');
        this.resetNuevoEquipo();
        this.cargarDatos();
      },
      error: (err) => {
        console.error(err);
        alert('❌ Error al crear el equipo');
      },
    });
  }


  eliminarEquipo(id: string) {
    if (confirm('⚠️ ¿Estás seguro de que quieres eliminar este equipo?')) {
      this.api.eliminarEquipo(id).subscribe({
        next: () => {
          alert('🗑️ Equipo eliminado');
          this.cargarDatos();
        },
        error: (err) => console.error('Error al eliminar:', err),
      });
    }
  }


  onFileSelected(event: any, equipo: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.api.subirImagen(file).subscribe({
        next: (response: any) => {
          if (response.filename) {
            equipo.escudo = response.filename;
            alert('✅ Escudo cargado: ' + response.filename);
          }
        },
        error: (err) => {
          console.error('Error al subir imagen:', err);
          alert('❌ Error al subir el escudo');
        },
      });
    }
  }

  private resetNuevoEquipo() {
    this.nuevoEquipo = {
      posicion: 0,
      escudo: '',
      nombre: '',
      puntos: 0,
      partidosJugados: 0,
      partidosGanados: 0,
      partidosEmpatados: 0,
      partidosPerdidos: 0,
      golesFavor: 0,
      golesContra: 0,
    };
  }

  getClassForPosition(posicion: number): string {
    if (posicion <= 2) return 'ascenso-directo';
    if (posicion <= 5) return 'playoff';
    if (posicion >= 14) return 'descenso';
    return '';
  }
}
