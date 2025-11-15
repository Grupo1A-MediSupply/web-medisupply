import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-client-mfa',
  templateUrl: './client-mfa.component.html'
})
export class ClientMfaComponent {
  _form = new FormGroup({ 
    code: new FormControl('', [
      Validators.required, 
      Validators.minLength(6), 
      Validators.maxLength(6),
      Validators.pattern(/^[0-9]+$/)
    ])
  });

  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  verify() {
    if (this._form.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const userId = sessionStorage.getItem('mfaUserId');
      const code = this._form.value.code || '';

      if (!userId) {
        this.errorMessage = 'Error: No se encontró información de usuario';
        this.isLoading = false;
        this.router.navigate(['/client/login']);
        return;
      }

      this.authService.verifyMFA(userId, code).subscribe({
        next: (response) => {
          this.isLoading = false;
          
          if (response.token && response.user) {
            // Limpiar userId temporal
            sessionStorage.removeItem('mfaUserId');
            // Navegar al dashboard
            this.router.navigate(['/client']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Código MFA inválido';
          console.error('MFA verification error:', error);
        }
      });
    } else {
      this._form.markAllAsTouched();
    }
  }
}

