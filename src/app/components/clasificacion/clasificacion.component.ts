import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

export interface Equipo {
  _id?: string;
  posicion: number;
  escudo: string; // Nombre del archivo (ej: villalba.png)
  nombre: string; // (En la BBDD se llama 'equipo')
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

  // Objeto para crear nuevos equipos
  nuevoEquipo = {
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
    public api: ApiService, // public para poder usarlo en el HTML
    public authService: AuthService,
    public cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.esAdmin = this.authService.isAdmin();
    this.cargarDatos();
  }

  cargarDatos() {
    this.api.getClasificacion().subscribe({
      next: (data: any[]) => {
        // Mapeamos los datos del backend (que usa 'equipo') a nuestro interface (que usa 'nombre')
        this.clasificacion = data.map((item, index) => ({
          _id: item._id,
          posicion: index + 1,
          escudo: item.escudo || '', // Si no hay escudo, string vacío
          nombre: item.equipo, // El backend manda 'equipo', nosotros usamos 'nombre'
          puntos: item.puntos,
          partidosJugados: item.partidosJugados,
          partidosGanados: item.partidosGanados,
          partidosEmpatados: item.partidosEmpatados,
          partidosPerdidos: item.partidosPerdidos,
          golesFavor: item.GF,
          golesContra: item.GC,
        }));
        this.cd.detectChanges(); // Forzar actualización de la vista
      },
      error: (err) => console.error('Error cargando clasificación:', err),
    });
  }

  toggleEdicion() {
    this.modoEdicion = !this.modoEdicion;
  }

  // --- ACTUALIZAR UN EQUIPO EXISTENTE ---
  guardarCambios(equipo: Equipo) {
    if (!equipo._id) return;

    // Preparamos el objeto tal cual lo espera el Backend
    const datosBackend = {
      equipo: equipo.nombre,
      escudo: equipo.escudo, // <--- ENVIAMOS EL ESCUDO
      partidosJugados: equipo.partidosJugados,
      partidosGanados: equipo.partidosGanados,
      partidosEmpatados: equipo.partidosEmpatados,
      partidosPerdidos: equipo.partidosPerdidos,
      GF: equipo.golesFavor,
      GC: equipo.golesContra,
    };

    this.api.actualizarEquipo(equipo._id, datosBackend).subscribe({
      next: () => {
        alert('✅ Datos guardados correctamente');
        // No hace falta recargar toda la tabla, ya lo vemos editado
      },
      error: (err) => {
        console.error(err);
        alert('❌ Error al guardar');
      },
    });
  }

  // --- CREAR UN EQUIPO NUEVO ---
  crearEquipo() {
    const datosBackend = {
      equipo: this.nuevoEquipo.nombre,
      escudo: this.nuevoEquipo.escudo, // <--- ENVIAMOS EL ESCUDO
      partidosJugados: this.nuevoEquipo.partidosJugados,
      partidosGanados: this.nuevoEquipo.partidosGanados,
      partidosEmpatados: this.nuevoEquipo.partidosEmpatados,
      partidosPerdidos: this.nuevoEquipo.partidosPerdidos,
      GF: this.nuevoEquipo.golesFavor,
      GC: this.nuevoEquipo.golesContra,
    };

    this.api.crearEquipo(datosBackend).subscribe({
      next: () => {
        alert('✅ Equipo creado');
        this.cargarDatos(); // Recargamos para que aparezca ordenado
        // Limpiamos el formulario
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
      },
      error: (err) => {
        console.error(err);
        alert('❌ Error al crear equipo');
      },
    });
  }

  getClassForPosition(posicion: number): string {
    if (posicion <= 2) return 'ascenso-directo';
    else if (posicion <= 5) return 'playoff';
    else if (posicion >= 15) return 'descenso';
    return '';
  }
}
