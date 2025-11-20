import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-vendor-mfa',
  templateUrl: './vendor-mfa.component.html'
})
export class VendorMfaComponent {
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

  get code() { return this._form.get('code'); }

  getCodeErrorMessage(): string {
    if (this.code?.hasError('required')) {
      return 'El código es requerido';
    }
    if (this.code?.hasError('minlength') || this.code?.hasError('maxlength')) {
      return 'El código debe tener exactamente 6 dígitos';
    }
    if (this.code?.hasError('pattern')) {
      return 'Solo se permiten números';
    }
    return '';
  }

  verify() {
    this.errorMessage = '';

    if (this._form.invalid) {
      this._form.markAllAsTouched();
      this.errorMessage = 'Por favor, ingrese un código válido de 6 dígitos';
      return;
    }

    this.isLoading = true;

    const userId = sessionStorage.getItem('mfaUserId');
    const code = this._form.value.code || '';

    if (!userId) {
      this.errorMessage = 'Error: No se encontró información de usuario. Por favor, inicie sesión nuevamente';
      this.isLoading = false;
      this.router.navigate(['/vendor/login']);
      return;
    }

    this.authService.verifyMFA(userId, code).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.token && response.user) {
          sessionStorage.removeItem('mfaUserId');
          this.router.navigate(['/vendor/orders']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        
        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.status === 400 || error.status === 401) {
          this.errorMessage = 'Código MFA inválido. Por favor, verifique e intente nuevamente';
        } else if (error.status === 0 || error.status === 500) {
          this.errorMessage = 'Error del servidor. Por favor, intente más tarde';
        } else {
          this.errorMessage = 'Error al verificar el código. Por favor, intente nuevamente';
        }
        console.error('MFA verification error:', error);
      }
    });
  }
}

