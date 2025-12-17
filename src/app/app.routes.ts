import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProximoPartidoComponent } from './components/proximo-partido/proximo-partido.component';
import { LoginComponent } from './auth/login.component';

import { MenuComponent } from './components/menu/menu.component';
import { ClasificacionComponent } from './components/clasificacion/clasificacion.component';
import { RegistroComponent } from './components/registro/registro.component';
import { EntrenamientosComponent } from './entrenamientos/entrenamientos.component';
import { TiendaComponent } from './tienda/tienda.component';
import { CarritoComponent } from './components/carrito/carrito.component';

export const routes: Routes = [
  // CAMBIO AQUÍ: Ahora redirige a 'login' en vez de a 'inicio'
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: HomeComponent },
  { path: 'jornada', component: ProximoPartidoComponent },

  // ... resto de rutas (clasificacion, etc.) ...
  { path: 'clasificacion', component: ClasificacionComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'entrenamientos', component: EntrenamientosComponent },
  { path: 'registro', component: RegistroComponent },
  {
    path: 'tienda',
    children: [
      { path: '', component: TiendaComponent },
      { path: 'carrito', component: CarritoComponent },
    ],
  },
];
