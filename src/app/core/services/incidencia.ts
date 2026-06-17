import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {
  private apiUrl = `${environment.apiUrl}/incidencia`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search/${id}`);
  }

  updateEstado(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, payload);
  }

  crear(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, formData); 
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}