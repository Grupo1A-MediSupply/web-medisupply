import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  username: string;
  password: string;
  confirm_password?: string;
  role: 'vendor' | 'client';
  name: string;
  phone?: string;
  address?: string;
  institutionName?: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    role: 'vendor' | 'client';
    name: string;
  };
  userId?: string;
  mfaRequired?: boolean;
  mfaCode?: string; // Solo en desarrollo
}

export interface UserProfile {
  id: string;
  email: string;
  role: 'vendor' | 'client';
  name: string;
  phone?: string;
  address?: string;
  institutionName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authServiceUrl = environment.useProxy && !environment.production 
    ? environment.proxyServices?.auth || environment.services.auth
    : environment.services.auth;

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  signup(data: SignupRequest): Observable<AuthResponse> {
    return this.api.post<any>('/api/v1/auth/register', data, this.authServiceUrl).pipe(
      tap(response => {
        // El backend devuelve directamente el UserResponse, no un AuthResponse
        // Convertimos la respuesta al formato esperado
        if (response && response.id) {
          // Si hay token, lo guardamos (aunque normalmente no viene en el registro)
          if (response.token) {
            this.setAuthData(response.token, {
              id: response.id,
              email: response.email,
              role: response.role,
              name: response.name || response.full_name || ''
            });
          }
        }
      }),
      // Mapear la respuesta del backend al formato AuthResponse esperado
      map((response: any) => {
        if (response && response.id) {
          return {
            message: 'Usuario registrado exitosamente',
            token: response.token,
            user: {
              id: response.id,
              email: response.email,
              role: response.role as 'vendor' | 'client',
              name: response.name || response.full_name || ''
            }
          } as AuthResponse;
        }
        return {
          message: 'Usuario registrado exitosamente'
        } as AuthResponse;
      })
    );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/api/v1/auth/login', data, this.authServiceUrl);
  }

  verifyMFA(userId: string, code: string): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/api/v1/auth/mfa/verify', { userId, code }, this.authServiceUrl).pipe(
      tap(response => {
        if (response.token && response.user) {
          this.setAuthData(response.token, response.user);
        }
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.api.post('/api/v1/auth/change-password', {
      currentPassword,
      newPassword
    }, this.authServiceUrl);
  }

  getProfile(): Observable<{ user: UserProfile }> {
    return this.api.get<{ user: UserProfile }>('/api/v1/auth/me', this.authServiceUrl);
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('token');
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  getUser(): UserProfile | null {
    const userStr = sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getRole(): 'vendor' | 'client' | null {
    const role = sessionStorage.getItem('role');
    return role as 'vendor' | 'client' | null;
  }

  private setAuthData(token: string, user: any): void {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('role', user.role);
  }
}

