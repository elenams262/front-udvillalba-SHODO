import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProximoPartidoComponent } from './components/proximo-partido/proximo-partido.component';
import { LoginComponent } from './auth/login.component';

import { ClasificacionComponent } from './components/clasificacion/clasificacion.component';

export const routes: Routes = [
  // CAMBIO AQUÍ: Ahora redirige a 'login' en vez de a 'inicio'
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: HomeComponent },
  { path: 'jornada', component: ProximoPartidoComponent },

  // ... resto de rutas (clasificacion, etc.) ...
  { path: 'clasificacion', component: ClasificacionComponent },
  { path: 'menu', component: HomeComponent },
  { path: 'entrenamientos', component: HomeComponent },
  { path: 'extra', component: HomeComponent },
  { path: 'noticias', component: HomeComponent },
];
