import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://backend-udvillalba.onrender.com/api';

  public readonly URL_IMAGENES = 'https://backend-udvillalba.onrender.com/uploads/';

  constructor(private http: HttpClient) {}

  // Método auxiliar para obtener el token guardado
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  // --- AUTENTICACIÓN ---
  registro(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, usuario);
  }

  login(credenciales: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credenciales);
  }

  getPerfil(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/profile`, this.getHeaders());
  }

  // --- CLASIFICACIÓN ---
  getClasificacion(): Observable<any> {
    return this.http.get(`${this.apiUrl}/clasificacion`);
  }

  crearEquipo(equipo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/clasificacion`, equipo, this.getHeaders());
  }

  actualizarEquipo(id: string, equipo: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/clasificacion/${id}`, equipo, this.getHeaders());
  }

  eliminarEquipo(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clasificacion/${id}`, this.getHeaders());
  }

  // --- PARTIDOS (JORNADA) ---

  getProximoPartido(): Observable<any> {
    return this.http.get(`${this.apiUrl}/jornada`);
  }

  // ✅ ESTAS SON LAS QUE FALTABAN:
  crearPartido(partido: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/jornada`, partido, this.getHeaders());
  }

  actualizarPartido(id: string, partido: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/jornada/${id}`, partido, this.getHeaders());
  }
  // ... (después de actualizarPartido)

  eliminarPartido(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/jornada/${id}`, this.getHeaders());
  }

  // --- TIENDA ---
  getProductos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/productos`);
  }
}
