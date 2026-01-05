import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para usar *ngFor y *ngIf
import { ApiService } from '../../app/services/api.service';
import { AuthService } from '../../app/services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  // 1. DECLARACIÓN DE VARIABLES
  codigos: any[] = [];
  esAdmin: boolean = false;

  // 2. CONSTRUCTOR (Inyectamos los servicios)
  constructor(private api: ApiService, private authService: AuthService) {}

  // 3. INICIO DEL COMPONENTE
  ngOnInit() {
    this.esAdmin = this.authService.isAdmin();

    // Solo cargamos los códigos si es admin, para evitar errores 403 en consola
    if (this.esAdmin) {
      this.cargarCodigos();
    }
  }

  // 4. MÉTODOS DE LÓGICA
  cargarCodigos() {
    this.api.getInviteCodes().subscribe({
      next: (res: any) => {
        this.codigos = res;
      },
      error: (err) => {
        console.error('Error al cargar códigos:', err);
      },
    });
  }

  generarNuevoCodigo() {
    this.api.generateCode().subscribe({
      next: (nuevo) => {
        // .unshift lo pone al principio de la lista para que lo veas el primero
        this.codigos.unshift(nuevo);
        alert(`✅ Código generado con éxito: ${nuevo.code}`);
      },
      error: (err) => {
        console.error(err);
        alert('❌ Error al generar el código. Revisa los permisos.');
      },
    });
  }
}
