import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  codigos: any[] = [];
  partidos: any[] = [];
  equipos: any[] = [];
  nuevoRol: string = 'usuario';

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

  cargarCodigos() {
    this.apiService.getInviteCodes().subscribe({
      next: (data: any) => (this.codigos = data),
      error: (err: any) => console.error('Error al cargar códigos', err),
    });
  }

  generarNuevoCodigo() {
    this.apiService.generateCode(this.nuevoRol).subscribe({
      next: (nuevo: any) => this.codigos.unshift(nuevo),
      error: (err: any) => alert('Error al generar código: ' + err.message),
    });
  }

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
    this.partidoEditando = { ...partido };
  }

  guardarPartido() {
    if (this.partidoEditando._id) {
      this.apiService.actualizarPartido(this.partidoEditando._id, this.partidoEditando).subscribe({
        next: () => {
          this.cargarPartidos();
          this.partidoEditando = null;
        },
        error: (err) => alert('Error al actualizar partido: ' + err.message),
      });
    } else {
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

  selectedFile: File | null = null;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  guardarEquipo() {
    if (!this.equipoEditando._id) {
      if (this.selectedFile) {
        this.apiService.subirImagen(this.selectedFile).subscribe({
          next: (response: any) => {
            this.equipoEditando.escudo = this.apiService.URL_IMAGENES + response.filename;
            this.crearEquipoFinal();
          },
          error: (err) => alert('Error al subir imagen: ' + err.message),
        });
      } else {
        this.crearEquipoFinal();
      }
    }
  }

  crearEquipoFinal() {
    this.apiService.crearEquipo(this.equipoEditando).subscribe({
      next: () => {
        this.cargarEquipos();
        this.equipoEditando = null;
        this.selectedFile = null;
      },
      error: (err) => alert('Error al crear equipo: ' + err.message),
    });
  }

  guardarTodosLosEquipos() {
    const updates = this.equipos.map((equipo) => {
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
