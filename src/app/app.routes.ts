import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
// Si tienes un componente de Inicio (donde se ve el partido), impórtalo también.
// Si el partido está en AppComponent, dejaremos la ruta vacía apuntando allí (o crearemos un HomeComponent luego).

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  // Redirigir al login por defecto si no hay ruta (opcional)
  // { path: '', redirectTo: '/login', pathMatch: 'full' }
];
