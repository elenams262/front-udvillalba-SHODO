import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para directivas como *ngIf
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api.service'; // Importamos nuestro servicio

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'frontend-futbol';
  partido: any = null; // Aquí guardaremos los datos del partido

  constructor(private api: ApiService) {}

  ngOnInit() {
    // Al cargar la página, pedimos el partido al backend
    this.api.getProximoPartido().subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data);
        this.partido = data;
      },
      error: (err) => {
        console.error('Error conectando al backend:', err);
      },
    });
  }
}
