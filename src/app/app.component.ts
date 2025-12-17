import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router'; // Import Router
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

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    // 1. Listen for route changes to toggle background blur
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects || event.url;

        // If we are in login or register, add class to body
        if (url.includes('/login') || url.includes('/registro')) {
          document.body.classList.add('auth-mode');
        } else {
          document.body.classList.remove('auth-mode');
        }
      });

    // 2. Fetch data (existing logic)
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
