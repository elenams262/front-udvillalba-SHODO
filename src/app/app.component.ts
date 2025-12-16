import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 1. IMPORTAR ESTO
import { CommonModule } from '@angular/common'; 
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'frontend-futbol';
  partido: any = null;

  // 2. INYECTARLO EN EL CONSTRUCTOR (private cd: ChangeDetectorRef)
  constructor(private api: ApiService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.api.getProximoPartido().subscribe({
      next: (data) => {
        console.log('Datos recibidos y asignando a variable:', data);
        this.partido = data;
        
        // 3. FORZAR LA ACTUALIZACIÓN DE LA PANTALLA
        this.cd.detectChanges(); 
      },
      error: (err) => {
        console.error('Error conectando al backend:', err);
      },
    });
  }
}