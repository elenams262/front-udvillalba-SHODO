import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment.prod';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = `${environment.apiUrl}/api`;

  public readonly URL_IMAGENES = `${environment.apiUrl}/uploads/`;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  registro(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, usuario);
  }

  login(credenciales: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credenciales);
  }

  getPerfil(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/profile`, this.getHeaders());
  }

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

  getProximoPartido(): Observable<any> {
    return this.http.get(`${this.apiUrl}/jornada`);
  }

  getAllMatches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/jornada/all`);
  }

  crearPartido(partido: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/jornada`, partido, this.getHeaders());
  }

  actualizarPartido(id: string, partido: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/jornada/${id}`, partido, this.getHeaders());
  }

  eliminarPartido(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/jornada/${id}`, this.getHeaders());
  }

  getProductos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/productos`);
  }

  subirImagen(archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('imagen', archivo);
    return this.http.post(`${this.apiUrl}/upload`, formData, this.getHeaders());
  }

  getInviteCodes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/auth/invite-codes`, this.getHeaders());
  }

  generateCode(role: string = 'usuario'): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/invite-code`, { role }, this.getHeaders());
  }
}
