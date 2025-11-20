import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  templateUrl: './client-login.component.html'
})
export class ClientLoginComponent {
  _form = new FormGroup({
    user: new FormControl('', [Validators.required, Validators.email]),
    pass: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  get user() { return this._form.get('user'); }
  get pass() { return this._form.get('pass'); }

  getUserErrorMessage(): string {
    if (this.user?.hasError('required')) {
      return 'El correo electrónico es requerido';
    }
    if (this.user?.hasError('email')) {
      return 'Ingrese un correo electrónico válido';
    }
    return '';
  }

  getPassErrorMessage(): string {
    if (this.pass?.hasError('required')) {
      return 'La contraseña es requerida';
    }
    if (this.pass?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  }

  login() {
    this.errorMessage = '';

    if (this._form.invalid) {
      this._form.markAllAsTouched();
      this.errorMessage = 'Por favor, complete todos los campos correctamente';
      return;
    }

    this.isLoading = true;

    const email = this._form.value.user?.toLowerCase() || '';
    const password = this._form.value.pass || '';

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.mfaRequired) {
          sessionStorage.setItem('mfaUserId', response.userId || '');
          sessionStorage.setItem('role', 'client');
          this.router.navigate(['/client/mfa']);
        } else if (response.token && response.user) {
          this.router.navigate(['/client']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        
        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.status === 401) {
          this.errorMessage = 'Credenciales inválidas. Verifique su correo y contraseña';
        } else if (error.status === 0 || error.status === 500) {
          this.errorMessage = 'Error del servidor. Por favor, intente más tarde';
        } else {
          this.errorMessage = 'Error al iniciar sesión. Por favor, intente nuevamente';
        }
        console.error('Login error:', error);
      }
    });
  }

  goToSignup() {
    this.router.navigate(['/client/signup']);
  }
}

