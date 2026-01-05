import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { ApiService } from './services/api.service';
import { filter } from 'rxjs/operators';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'frontend-futbol';
  partido: any = null;
  menuVisible: boolean = false;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    // Escuchar cambios de ruta para el modo auth (clase en el body)
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects || event.url;
        if (url.includes('/login') || url.includes('/registro')) {
          document.body.classList.add('auth-mode');
        } else {
          document.body.classList.remove('auth-mode');
        }
      });

    // Cargar datos del próximo partido
    this.api.getProximoPartido().subscribe({
      next: (data: any) => {
        this.partido = data;
      },
      error: (err: any) => {
        console.error('Error cargando partido:', err);
      },
    });
  }

  // --- FUNCIONES DE AUTENTICACIÓN ---
  esAdmin(): boolean {
    // Buscamos 'rol' (del login) o 'role' (por si acaso)
    const role = localStorage.getItem('rol') || localStorage.getItem('role');
    return role === 'admin';
  }

  estaLogueado(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.clear();
    this.cerrarMenu();
    this.router.navigate(['/login']);
  }

  // --- FUNCIONES DEL MENÚ ---
  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  cerrarMenu() {
    this.menuVisible = false;
  }
}
