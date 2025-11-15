import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  templateUrl: './vendor-login.component.html'
})
export class VendorLoginComponent {
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

  login() {
    if (this._form.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const email = this._form.value.user?.toLowerCase() || '';
      const password = this._form.value.pass || '';

      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          this.isLoading = false;
          
          if (response.mfaRequired) {
            // Guardar userId temporalmente para MFA
            sessionStorage.setItem('mfaUserId', response.userId || '');
            sessionStorage.setItem('role', 'vendor');
            this.router.navigate(['/vendor/mfa']);
          } else if (response.token && response.user) {
            // Si no requiere MFA, ir directamente al dashboard
            this.router.navigate(['/vendor/orders']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Error al iniciar sesión';
          console.error('Login error:', error);
        }
      });
    } else {
      this._form.markAllAsTouched();
    }
  }

  goToSignup() {
    this.router.navigate(['/vendor/signup']);
  }
}

