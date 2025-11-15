import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl || 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Realizar petición GET a un servicio específico
   * @param baseUrl URL base del servicio
   * @param endpoint Endpoint relativo
   */
  get<T>(endpoint: string, baseUrl?: string): Observable<T> {
    const url = baseUrl ? `${baseUrl}${endpoint}` : `${this.apiUrl}${endpoint}`;
    return this.http.get<T>(url, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Realizar petición POST a un servicio específico
   * @param baseUrl URL base del servicio
   * @param endpoint Endpoint relativo
   * @param data Datos a enviar
   */
  post<T>(endpoint: string, data: any, baseUrl?: string): Observable<T> {
    const url = baseUrl ? `${baseUrl}${endpoint}` : `${this.apiUrl}${endpoint}`;
    return this.http.post<T>(url, data, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Realizar petición PUT a un servicio específico
   * @param baseUrl URL base del servicio
   * @param endpoint Endpoint relativo
   * @param data Datos a enviar
   */
  put<T>(endpoint: string, data: any, baseUrl?: string): Observable<T> {
    const url = baseUrl ? `${baseUrl}${endpoint}` : `${this.apiUrl}${endpoint}`;
    return this.http.put<T>(url, data, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Realizar petición DELETE a un servicio específico
   * @param baseUrl URL base del servicio
   * @param endpoint Endpoint relativo
   */
  delete<T>(endpoint: string, baseUrl?: string): Observable<T> {
    const url = baseUrl ? `${baseUrl}${endpoint}` : `${this.apiUrl}${endpoint}`;
    return this.http.delete<T>(url, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || error.message || 'Error en el servidor';
    }

    console.error('Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

