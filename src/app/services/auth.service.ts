import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import { ApiConfigService } from './api-config.service';

/**
 * Servicio de autenticación
 * Maneja registro, login, verificación de código MFA, etc.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseApiService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    http: HttpClient,
    apiConfig: ApiConfigService
  ) {
    super(http, apiConfig);
    this.loadUserFromStorage();
  }

  /**
   * Obtiene el token de autenticación (implementa el método abstracto de BaseApiService)
   */
  protected getAuthToken(): string | null {
    return this.getAccessToken();
  }

  /**
   * Registrar un nuevo usuario
   * POST PROD_AUTH_URL/api/v1/auth/register
   */
  register(userData: {
    email: string;
    username: string;
    password: string;
    confirm_password: string;
    full_name: string;
    phone_number: string;
    is_active?: boolean;
    is_superuser: boolean; // false = cliente, true = vendedor
  }): Observable<any> {
    console.log('🔵 AuthService.register - Iniciando registro con:', userData);
    console.log('🔵 AuthService.register - authApiUrl:', this.apiConfig.authApiUrl);
    
    // El backend retorna directamente el objeto del usuario con status 201
    // No necesitamos observe: 'response', solo el body
    const observable = this.post('/register', userData, this.apiConfig.authApiUrl);
    
    console.log('🔵 AuthService.register - Observable creado');
    
    return observable.pipe(
      tap({
        next: (response) => {
          console.log('🟢 AuthService.register - Respuesta recibida en tap:', response);
          // El backend retorna directamente el objeto del usuario: { id, email, username, ... }
          if (response && (response.id || response.email || response.username)) {
            console.log('🟢 AuthService.register - Actualizando currentUserSubject');
            this.currentUserSubject.next(response);
          } else {
            console.warn('⚠️ AuthService.register - Respuesta sin campos esperados:', response);
          }
        },
        error: (error) => {
          console.error('❌ AuthService.register - Error en tap:', error);
        }
      })
    );
  }

  /**
   * Iniciar sesión (envía código de verificación por email)
   * POST PROD_AUTH_URL/api/v1/auth/login
   */
  login(username: string, password: string): Observable<any> {
    return this.post('/login', { username, password }, this.apiConfig.authApiUrl)
      .pipe(
        tap(response => {
          // Guardar user_id para verificación
          // El backend puede retornar user_id vacío, pero el login fue exitoso
          // Si no hay user_id, intentar obtenerlo de otros campos o usar el username
          const userId = response.user_id || response.userId || response.id || null;
          if (userId) {
            sessionStorage.setItem('pending_user_id', userId);
          } else {
            // Si no hay user_id en la respuesta, guardar el username como fallback
            // El backend debería retornar el user_id, pero si no lo hace, usamos el username
            console.warn('⚠️ No se encontró user_id en la respuesta del login, usando username como fallback');
            sessionStorage.setItem('pending_user_id', username);
          }
        })
      );
  }

  /**
   * Verificar código MFA
   * POST PROD_AUTH_URL/api/v1/auth/verify-code
   */
  verifyCode(userId: string, code: string): Observable<any> {
    return this.post('/verify-code', { user_id: userId, code }, this.apiConfig.authApiUrl)
      .pipe(
        tap(response => {
          if (response.access_token) {
            this.setTokens(response.access_token, response.refresh_token);
            this.currentUserSubject.next(response.user);
            sessionStorage.removeItem('pending_user_id');
          }
        })
      );
  }

  /**
   * Reenviar código de verificación
   * POST PROD_AUTH_URL/api/v1/auth/resend-code
   */
  resendCode(userId: string): Observable<any> {
    return this.post('/resend-code', { user_id: userId }, this.apiConfig.authApiUrl);
  }

  /**
   * Cambiar contraseña
   * POST PROD_AUTH_URL/api/v1/auth/change-password
   */
  changePassword(data: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }): Observable<any> {
    return this.post('/change-password', data, this.apiConfig.authApiUrl);
  }

  /**
   * Cerrar sesión
   * POST PROD_AUTH_URL/api/v1/auth/logout
   * Requiere autenticación (token de acceso)
   */
  logout(): Observable<any> {
    // Llamar al endpoint de logout del backend con autenticación
    return this.post('/logout', {}, this.apiConfig.authApiUrl, false, true)
      .pipe(
        tap({
          next: (response) => {
            // Después de que el backend confirme el logout, limpiar tokens localmente
            this.clearTokens();
            this.currentUserSubject.next(null);
          },
          error: (error) => {
            // Aunque falle el logout en el backend, limpiar tokens localmente
            // para asegurar que el usuario pueda cerrar sesión
            this.clearTokens();
            this.currentUserSubject.next(null);
            console.error('Error al cerrar sesión en el backend:', error);
          }
        })
      );
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Obtener token de acceso
   */
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Obtener token de refresh
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Guardar tokens
   */
  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  /**
   * Limpiar tokens
   */
  private clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('pending_user_id');
  }

  /**
   * Cargar usuario desde localStorage
   */
  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('current_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('Error al cargar usuario desde storage:', e);
      }
    }
  }
}

