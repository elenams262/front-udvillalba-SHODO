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
  forma: string[];
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

  constructor(
    private api: ApiService,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.esAdmin = this.authService.isAdmin();
    console.log('¿Es admin?', this.esAdmin); // Debug
    this.cargarDatos();
  }

  cargarDatos() {
    console.log('🔄 Cargando datos de clasificación...');
    this.api.getClasificacion().subscribe({
      next: (datos: any[]) => {
        console.log('✅ Datos recibidos del backend:', datos);
        if (!datos || datos.length === 0) {
          console.warn('⚠️ La lista de equipos está vacía');
        }

        // CORREGIDO: Eliminado paréntesis extra y ajustado mapeo con tu Backend
        this.clasificacion = datos.map((d) => ({
          _id: d._id,
          posicion: 0, // Se recalcula en reordenarTabla
          escudo: d.escudo || '', // Añade lógica de escudo si la tienes
          nombre: d.equipo || d.nombre, // Tu backend usa 'equipo' en el modelo
          puntos: d.puntos,

          // Mapeo Backend (GF/GC) -> Frontend (golesFavor/golesContra)
          partidosJugados: d.partidosJugados || 0,
          partidosGanados: d.partidosGanados || 0,
          partidosEmpatados: d.partidosEmpatados || 0,
          partidosPerdidos: d.partidosPerdidos || 0,
          golesFavor: d.GF || 0, // Backend manda GF
          golesContra: d.GC || 0, // Backend manda GC

          forma: d.forma || [],
        }));

        this.reordenarTabla();
      },
      error: (err) => {
        console.error('❌ Error cargando clasificación:', err);
        alert('Error al cargar la clasificación. Revisa la consola.');
      },
    });
  }

  toggleEdicion() {
    this.modoEdicion = !this.modoEdicion;
  }

  private reordenarTabla() {
    this.clasificacion.sort((a, b) => {
      if (b.puntos !== a.puntos) return b.puntos - a.puntos;
      const diffA = a.golesFavor - a.golesContra;
      const diffB = b.golesFavor - b.golesContra;
      if (diffB !== diffA) return diffB - diffA;
      return b.golesFavor - a.golesFavor;
    });

    this.clasificacion.forEach((equipo, index) => {
      equipo.posicion = index + 1;
    });

    this.cd.detectChanges();
  }

  guardarCambios(equipo: Equipo) {
    if (!confirm(`¿Guardar cambios de ${equipo.nombre}?`)) return;

    const id = equipo._id;

    if (!id) {
      alert('Error: No se encuentra el ID del equipo');
      return;
    }

    // CORREGIDO: Preparamos los datos como los espera el Backend (GF y GC)
    const datosParaBackend = {
      ...equipo,
      GF: equipo.golesFavor, // Traducimos al nombre del modelo
      GC: equipo.golesContra,
    };

    this.api.actualizarEquipo(id, datosParaBackend).subscribe({
      next: () => {
        this.reordenarTabla();
        alert('✅ Clasificación actualizada');
      },
      error: (err) => {
        console.error(err);
        alert('❌ Error al guardar en el servidor');
      },
    });
  }

  // --- Estilos Visuales ---
  getClassForPosition(posicion: number): string {
    if (posicion <= 2) return 'ascenso-directo';
    else if (posicion <= 5) return 'playoff';
    else if (posicion >= 16) return 'descenso';
    return '';
  }

  getFormaClass(resultado: string): string {
    switch (resultado) {
      case 'G':
        return 'bg-success';
      case 'E':
        return 'bg-warning text-dark';
      case 'P':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}
