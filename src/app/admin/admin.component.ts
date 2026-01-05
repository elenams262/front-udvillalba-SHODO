import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  codigos: any[] = [];

  // ✅ CORRECCIÓN 1: Inyectar el servicio en el constructor
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    if (this.esAdmin()) {
      this.cargarCodigos();
    }
  }

  esAdmin(): boolean {
    return localStorage.getItem('rol') === 'admin';
  }

  cargarCodigos() {
    this.apiService.getInviteCodes().subscribe({
      next: (data: any) => {
        this.codigos = data;
        console.log('Códigos cargados:', data);
      },
      error: (err: any) => console.error('Error al cargar códigos', err),
    });
  }

  // ✅ CORRECCIÓN 2: Eliminar la función duplicada y usar una sola
  generarNuevoCodigo() {
    this.apiService.generateCode().subscribe({
      next: (nuevo: any) => {
        // .unshift lo pone al principio de la lista
        this.codigos.unshift(nuevo);
      },
      error: (err: any) => {
        console.error('Error al generar:', err);
        alert('No se pudo generar el código');
      },
    });
  }
}
