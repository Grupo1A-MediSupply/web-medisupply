import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
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
          <div class="brand-subtitle">Portal de Clientes</div>
        </div>
      </div>
    </div>

    <!-- Right Section - MFA Form -->
    <div class="mfa-right-section">
      <div class="mfa-form-container">
        <h1 class="mfa-title">Verificación MFA - Cliente</h1>
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

          <div class="mfa-actions">
            <div class="resend-link-container">
              <a href="#" class="resend-link">Enviar código de nuevo</a>
            </div>
            <button type="submit" class="btn-primary" [disabled]="!_form.valid">
              Verificar y continuar
            </button>
        </div>
      </form>
      </div>
    </div>
  </div>
  `
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
  
  constructor(private router: Router){}
  
  verify(){
    if (this._form.valid) {
      // Verify MFA code and navigate to client dashboard
      this.router.navigate(['/client/create-order']);
    } else {
      // Mark all fields as touched to show validation errors
      this._form.markAllAsTouched();
    }
  }
}

