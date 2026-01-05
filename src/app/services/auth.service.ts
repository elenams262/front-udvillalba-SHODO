import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userKey = 'usuario_actual';

  constructor(private api: ApiService, private router: Router) {}

  login(credenciales: any) {
    return this.api.login(credenciales).pipe(
      tap((respuesta: any) => {
        console.log('📡 Respuesta del Backend:', respuesta);

        // 1. Guardar el TOKEN
        if (respuesta.token) {
          localStorage.setItem('token', respuesta.token);
        }

        // 2. Guardar el USUARIO
        // IMPORTANTE: Tu backend envía los datos "planos" (sin estar dentro de un objeto 'usuario')
        // Por eso leemos directamente respuesta.rol, respuesta.nombre, etc.
        if (respuesta.rol) {
          const usuarioParaGuardar = {
            _id: respuesta._id,
            nombre: respuesta.nombre,
            email: respuesta.correo, // Mapeamos correo a email
            rol: respuesta.rol, // <--- AQUÍ CAPTURAMOS SI ES ADMIN
          };

          // Guardamos el objeto completo en el navegador
          localStorage.setItem(this.userKey, JSON.stringify(usuarioParaGuardar));
          console.log('✅ Usuario guardado correctamente:', usuarioParaGuardar);
        } else {
          console.warn(
            "⚠️ ALERTA: El backend no ha devuelto el campo 'rol'. Revisa authController.js"
          );
        }
      })
    );
  }

  // En auth.service.ts
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // Esta función es la que usa el componente Clasificacion para mostrar/ocultar botones
  isAdmin(): boolean {
    const usuarioString = localStorage.getItem(this.userKey);
    if (!usuarioString) return false;

    try {
      const usuario = JSON.parse(usuarioString);
      return usuario.rol === 'admin';
    } catch (e) {
      console.error('Error al leer usuario del storage', e);
      return false;
    }
  }

  // Extra: Para saber si está logueado (útil para proteger rutas)
  estaAutenticado(): boolean {
    return !!localStorage.getItem('token');
  }
}
