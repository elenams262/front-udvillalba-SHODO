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


        if (respuesta.token) {
          localStorage.setItem('token', respuesta.token);
        }




        if (respuesta.rol) {
          const usuarioParaGuardar = {
            _id: respuesta._id,
            nombre: respuesta.nombre,
            email: respuesta.correo,
            rol: respuesta.rol,
          };


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


  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }


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


  estaAutenticado(): boolean {
    return !!localStorage.getItem('token');
  }
}
