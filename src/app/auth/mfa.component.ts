import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-mfa',
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
          <div class="brand-subtitle">Distribución de Insumos Médicos</div>
        </div>
      </div>
    </div>

    <!-- Right Section - MFA Form -->
    <div class="mfa-right-section">
      <div class="mfa-form-container">
        <h1 class="mfa-title">Digita tu código</h1>
        <p class="mfa-subtitle">Te hemos enviado a tu correo electrónico o celular un numero de autenticación, por favor digítalo a continuación</p>

        <form [formGroup]="_form" (ngSubmit)="verify()" class="mfa-form">
          <div class="form-group">
            <label class="form-label">Digita tu número</label>
            <input
              type="text"
              class="form-input"
              [class.error]="_form.get('code')?.invalid && _form.get('code')?.touched"
              placeholder="Digita tu número"
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
              <a href="#" class="resend-link">Enviar de nuevo</a>
            </div>
            <button type="submit" class="btn-primary" [disabled]="!_form.valid">
              Continuar
            </button>
        </div>
      </form>
      </div>
    </div>
  </div>
  `
})
export class MfaComponent {
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
    const role = sessionStorage.getItem('role') || 'client';
    // In a real app validate the code. Here we mock success.
    if(role === 'vendor') this.router.navigate(['/vendor']);
    else this.router.navigate(['/client']);
    } else {
      // Mark all fields as touched to show validation errors
      this._form.markAllAsTouched();
    }
  }
}
