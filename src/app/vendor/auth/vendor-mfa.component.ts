import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-vendor-mfa',
  template: `
  <div class="mfa-page">
    <!-- Left Section - Logo and Branding -->
    <div class="mfa-left-section">
      <div class="logo-container">
        <div class="logo-icon">
          <mat-icon>local_hospital</mat-icon>
        </div>
        <div class="logo-text">
          <div class="brand-name">MediSupply</div>
          <div class="brand-subtitle">Portal de Vendedores</div>
        </div>
      </div>
    </div>

    <!-- Right Section - MFA Form -->
    <div class="mfa-right-section">
      <div class="mfa-form-container">
        <h1 class="mfa-title">Verificación MFA - Vendedor</h1>
        <p class="mfa-subtitle">Te hemos enviado un código de verificación a tu correo electrónico o celular</p>

        <form [formGroup]="_form" (ngSubmit)="verify()" class="mfa-form">
          <div class="form-group">
            <label class="form-label">Código de verificación</label>
            <input
              type="text"
              class="form-input"
              [class.error]="_form.get('code')?.invalid && _form.get('code')?.touched"
              placeholder="Digita tu código de 6 dígitos"
              formControlName="code"
              required
              maxlength="6"
              pattern="[0-9]*"
              inputmode="numeric">
            <div class="error-message" *ngIf="_form.get('code')?.invalid && _form.get('code')?.touched">
              <span *ngIf="_form.get('code')?.errors?.['required']">El código es requerido</span>
              <span *ngIf="_form.get('code')?.errors?.['minlength']">El código debe tener exactamente 6 números</span>
              <span *ngIf="_form.get('code')?.errors?.['maxlength']">El código debe tener exactamente 6 números</span>
              <span *ngIf="_form.get('code')?.errors?.['pattern']">Solo se permiten números</span>
            </div>
          </div>

          <div class="error-message" *ngIf="errorMessage" style="color: red; margin-bottom: 1rem;">
            {{ errorMessage }}
          </div>

          <div class="mfa-actions">
            <div class="resend-link-container">
              <a href="#" class="resend-link" (click)="resendCode(); $event.preventDefault()" [class.disabled]="loading">
                Enviar código de nuevo
              </a>
            </div>
            <button type="submit" class="btn-primary" [disabled]="!_form.valid || loading">
              <span *ngIf="loading">Verificando...</span>
              <span *ngIf="!loading">Verificar y continuar</span>
            </button>
        </div>
      </form>
      </div>
    </div>
  </div>
  `
})
export class VendorMfaComponent implements OnInit {
  _form = new FormGroup({ 
    code: new FormControl('', [
      Validators.required, 
      Validators.minLength(6), 
      Validators.maxLength(6),
      Validators.pattern(/^[0-9]+$/)
    ])
  });
  
  loading = false;
  errorMessage = '';
  userId: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Obtener user_id del sessionStorage (guardado en login)
    this.userId = sessionStorage.getItem('pending_user_id');
    console.log('✅ VendorMfaComponent.ngOnInit - userId:', this.userId);
    if (!this.userId) {
      // Si no hay user_id, redirigir a login
      console.warn('⚠️ No se encontró user_id en sessionStorage, redirigiendo a login');
      this.router.navigate(['/vendor/login']);
    } else {
      console.log('✅ VendorMfaComponent.ngOnInit - user_id encontrado, continuando con MFA');
    }
  }
  
  verify(){
    if (this._form.valid && this.userId) {
      const code = this._form.value.code;
      
      this.loading = true;
      this.errorMessage = '';

      // Verificar código MFA
      this.authService.verifyCode(this.userId, code || '').subscribe({
        next: (response) => {
          this.loading = false;
          // El backend retorna { access_token, refresh_token, user } cuando el código es correcto
          // Verificar si la respuesta tiene access_token (indica éxito)
          if (response && response.access_token) {
            // El token se guarda automáticamente en localStorage por AuthService
            // Store vendor role
            sessionStorage.setItem('role', 'vendor');
            sessionStorage.setItem('userType', 'vendor');
            // Navigate to vendor dashboard
            this.router.navigate(['/vendor/orders']);
          } else {
            // Si no tiene access_token, mostrar error
            this.errorMessage = response?.message || 'Código de verificación inválido';
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.message || 'Código de verificación inválido. Por favor, intenta de nuevo.';
          console.error('Error al verificar código:', error);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      this._form.markAllAsTouched();
    }
  }

  resendCode() {
    if (this.userId) {
      this.loading = true;
      this.errorMessage = '';
      
      this.authService.resendCode(this.userId).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            alert('Código de verificación reenviado. Revisa tu correo electrónico.');
          } else {
            this.errorMessage = response.message || 'Error al reenviar el código';
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.message || 'Error al reenviar el código. Por favor, intenta de nuevo.';
          console.error('Error al reenviar código:', error);
        }
      });
    }
  }
}

