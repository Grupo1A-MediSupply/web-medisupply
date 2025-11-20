import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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
    return this.api.post<AuthResponse>('/api/auth/register', data, this.authServiceUrl).pipe(
      tap(response => {
        if (response.token && response.user) {
          this.setAuthData(response.token, response.user);
        }
      })
    );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/api/auth/login', data, this.authServiceUrl);
  }

  verifyMFA(userId: string, code: string): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/api/auth/mfa/verify', { userId, code }, this.authServiceUrl).pipe(
      tap(response => {
        if (response.token && response.user) {
          this.setAuthData(response.token, response.user);
        }
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.api.post('/api/auth/change-password', {
      currentPassword,
      newPassword
    }, this.authServiceUrl);
  }

  getProfile(): Observable<{ user: UserProfile }> {
    return this.api.get<{ user: UserProfile }>('/api/auth/me', this.authServiceUrl);
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

