import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router'; // 1. IMPORTAR RouterLink AQUÍ
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  // 2. AÑADIR RouterLink A ESTA LISTA DE IMPORTS
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'frontend-futbol';
  partido: any = null;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getProximoPartido().subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data);
        this.partido = data;
      },
      error: (err) => {
        console.error('Error:', err);
      },
    });
  }
}
