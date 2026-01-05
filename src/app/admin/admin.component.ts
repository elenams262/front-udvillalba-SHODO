import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule], // Añadir FormsModule
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  codigos: any[] = [];
  partidos: any[] = [];
  equipos: any[] = [];

  // Estado para formularios
  seccionActiva: 'invitaciones' | 'partidos' | 'clasificacion' = 'invitaciones';
  partidoEditando: any = null;
  equipoEditando: any = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    if (this.esAdmin()) {
      this.cargarCodigos();
      this.cargarPartidos();
      this.cargarEquipos();
    }
  }

  esAdmin(): boolean {
    return localStorage.getItem('rol') === 'admin';
  }

  // --- INVITACIONES ---
  cargarCodigos() {
    this.apiService.getInviteCodes().subscribe({
      next: (data: any) => (this.codigos = data),
      error: (err: any) => console.error('Error al cargar códigos', err),
    });
  }

  generarNuevoCodigo() {
    this.apiService.generateCode().subscribe({
      next: (nuevo: any) => this.codigos.unshift(nuevo),
      error: (err: any) => alert('Error al generar código: ' + err.message),
    });
  }

  // --- PARTIDOS (JORNADA) ---
  cargarPartidos() {
    this.apiService.getAllMatches().subscribe({
      next: (data: any[]) => (this.partidos = data),
      error: (err: any) => console.error('Error al cargar partidos', err),
    });
  }

  nuevoPartido() {
    this.partidoEditando = {
      jornada: '',
      equipoLocal: '',
      escudoLocal: '',
      equipoVisitante: '',
      escudoVisitante: '',
      ubicacion: '',
      fecha: '',
      hora: '',
      isPlayed: false,
      golesLocal: null,
      golesVisitante: null,
    };
  }

  editarPartido(partido: any) {
    // Clonamos para no editar directamente en la tabla hasta guardar
    this.partidoEditando = { ...partido };
  }

  guardarPartido() {
    if (this.partidoEditando._id) {
      // ACTUALIZAR
      this.apiService.actualizarPartido(this.partidoEditando._id, this.partidoEditando).subscribe({
        next: () => {
          this.cargarPartidos();
          this.partidoEditando = null;
        },
        error: (err) => alert('Error al actualizar partido: ' + err.message),
      });
    } else {
      // CREAR
      this.apiService.crearPartido(this.partidoEditando).subscribe({
        next: () => {
          this.cargarPartidos();
          this.partidoEditando = null;
        },
        error: (err) => alert('Error al crear partido: ' + err.message),
      });
    }
  }

  eliminarPartido(id: string) {
    if (confirm('¿Seguro que quieres eliminar este partido?')) {
      this.apiService.eliminarPartido(id).subscribe({
        next: () => this.cargarPartidos(),
        error: (err) => alert('Error al eliminar: ' + err.message),
      });
    }
  }

  // --- CLASIFICACIÓN (EQUIPOS) ---
  cargarEquipos() {
    this.apiService.getClasificacion().subscribe({
      next: (data: any[]) => (this.equipos = data),
      error: (err: any) => console.error('Error al cargar clasificación', err),
    });
  }

  nuevoEquipo() {
    this.equipoEditando = {
      equipo: '',
      escudo: '',
      partidosJugados: 0,
      partidosGanados: 0,
      partidosEmpatados: 0,
      partidosPerdidos: 0,
      GF: 0,
      GC: 0,
    };
  }

  editarEquipo(equipo: any) {
    this.equipoEditando = { ...equipo };
  }

  // Restauramos este método para usarlo SOLO al CREAR un equipo nuevo desde el formulario inferior
  guardarEquipo() {
    if (!this.equipoEditando._id) {
      // CREAR
      this.apiService.crearEquipo(this.equipoEditando).subscribe({
        next: () => {
          this.cargarEquipos();
          this.equipoEditando = null;
        },
        error: (err) => alert('Error al crear equipo: ' + err.message),
      });
    }
  }

  guardarTodosLosEquipos() {
    // Usamos Promise.all para esperar a que todos se guarden
    const updates = this.equipos.map((equipo) => {
      // Solo actualizamos si tiene ID (por si añadieron uno nuevo sin guardar, aunque aquí asumimos que ya existen o se crean aparte)
      if (equipo._id) {
        return this.apiService.actualizarEquipo(equipo._id, equipo).toPromise();
      }
      return Promise.resolve();
    });

    Promise.all(updates)
      .then(() => {
        alert('Clasificación guardada correctamente');
        this.cargarEquipos();
      })
      .catch((err) => alert('Error al guardar algunos equipos: ' + err.message));
  }

  eliminarEquipo(id: string) {
    if (confirm('¿Seguro que quieres eliminar este equipo?')) {
      this.apiService.eliminarEquipo(id).subscribe({
        next: () => this.cargarEquipos(),
        error: (err) => alert('Error al eliminar: ' + err.message),
      });
    }
  }
}
