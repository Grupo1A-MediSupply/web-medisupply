import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map, tap } from 'rxjs/operators';
import { ApiConfigService } from './api-config.service';

/**
 * Servicio base para todas las llamadas a la API
 * Proporciona métodos comunes para GET, POST, PUT, DELETE
 */
@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  
  constructor(
    protected http: HttpClient,
    protected apiConfig: ApiConfigService
  ) {}

  /**
   * Construye los headers HTTP con autenticación si es necesario
   */
  protected getHeaders(requireAuth: boolean = false): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (requireAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }
    
    return headers;
  }

  /**
   * Obtiene el token de autenticación (debe ser implementado por las clases hijas)
   */
  protected getAuthToken(): string | null {
    return null;
  }

  /**
   * Realiza una petición GET
   * @param endpoint - Endpoint relativo (ej: '/auth/register')
   * @param baseUrl - URL base a usar (authApiUrl, orderApiUrl, etc.). Por defecto usa authApiUrl
   * @param params - Parámetros de consulta
   * @param requireAuth - Si es true, incluye el token de autenticación en los headers
   */
  protected get<T>(endpoint: string, baseUrl?: string, params?: any, requireAuth: boolean = false): Observable<T> {
    const url = this.buildUrl(endpoint, baseUrl);
    const httpParams = this.buildParams(params);
    const headers = this.getHeaders(requireAuth);
    
    return this.http.get<T>(url, { params: httpParams, headers })
      .pipe(
        retry(2),
        catchError((error) => this.handleError(error))
      );
  }

  /**
   * Realiza una petición POST
   * @param endpoint - Endpoint relativo (ej: '/auth/register')
   * @param data - Datos a enviar
   * @param baseUrl - URL base a usar (authApiUrl, orderApiUrl, etc.). Por defecto usa authApiUrl
   * @param includeStatus - Si es true, retorna la respuesta completa con status code
   * @param requireAuth - Si es true, incluye el token de autenticación en los headers
   */
  protected post<T>(endpoint: string, data: any, baseUrl?: string, includeStatus: boolean = false, requireAuth: boolean = false): Observable<T | HttpResponse<T>> {
    const url = this.buildUrl(endpoint, baseUrl);
    const headers = this.getHeaders(requireAuth);
    console.log('BaseApiService.post - URL:', url);
    console.log('BaseApiService.post - Data:', data);
    console.log('BaseApiService.post - RequireAuth:', requireAuth);
    
    if (includeStatus) {
      return this.http.post<T>(url, data, { observe: 'response', headers })
        .pipe(
          catchError((error) => {
            console.error('BaseApiService.post - Error (con status):', error);
            return this.handleError(error);
          })
        ) as Observable<HttpResponse<T>>;
    }
    
    return this.http.post<T>(url, data, { headers })
      .pipe(
        tap(response => {
          console.log('BaseApiService.post - Respuesta HTTP recibida:', response);
        }),
        catchError((error) => {
          console.error('BaseApiService.post - Error:', error);
          return this.handleError(error);
        })
      );
  }

  /**
   * Realiza una petición PUT
   * @param endpoint - Endpoint relativo (ej: '/orders/123')
   * @param data - Datos a enviar
   * @param baseUrl - URL base a usar (authApiUrl, orderApiUrl, etc.). Por defecto usa authApiUrl
   * @param requireAuth - Si es true, incluye el token de autenticación en los headers
   */
  protected put<T>(endpoint: string, data: any, baseUrl?: string, requireAuth: boolean = false): Observable<T> {
    const url = this.buildUrl(endpoint, baseUrl);
    const headers = this.getHeaders(requireAuth);
    
    return this.http.put<T>(url, data, { headers })
      .pipe(
        catchError((error) => this.handleError(error))
      );
  }

  /**
   * Realiza una petición DELETE
   * @param endpoint - Endpoint relativo (ej: '/orders/123')
   * @param baseUrl - URL base a usar (authApiUrl, orderApiUrl, etc.). Por defecto usa authApiUrl
   * @param requireAuth - Si es true, incluye el token de autenticación en los headers
   */
  protected delete<T>(endpoint: string, baseUrl?: string, requireAuth: boolean = false): Observable<T> {
    const url = this.buildUrl(endpoint, baseUrl);
    const headers = this.getHeaders(requireAuth);
    
    return this.http.delete<T>(url, { headers })
      .pipe(
        catchError((error) => this.handleError(error))
      );
  }

  /**
   * Construye la URL completa
   * @param endpoint - Endpoint relativo
   * @param baseUrl - URL base opcional
   */
  private buildUrl(endpoint: string, baseUrl?: string): string {
    // Usar la URL base proporcionada o authApiUrl por defecto
    const base = baseUrl || this.apiConfig.authApiUrl;
    
    // Si la base es una ruta relativa (empieza con /), construir la URL relativa
    if (base.startsWith('/')) {
      // Remover barra inicial del endpoint si existe
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
      return `${base}/${cleanEndpoint}`;
    }
    
    // Si la base es una URL absoluta, construir la URL completa
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    return `${base}/${cleanEndpoint}`;
  }

  /**
   * Construye HttpParams desde un objeto
   */
  private buildParams(params: any): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return httpParams;
  }

  /**
   * Maneja errores HTTP
   */
  protected handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

