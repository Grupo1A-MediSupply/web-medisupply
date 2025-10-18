import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  template: `
  <div class="change-password-page">
    <!-- Left Section - Logo and Branding -->
    <div class="change-password-left-section">
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

    <!-- Right Section - Change Password Form -->
    <div class="change-password-right-section">
      <div class="change-password-form-container">
        <h1 class="change-password-title">Cambiar contraseña</h1>
        <p class="change-password-subtitle">Por favor digita tu nueva contraseña.</p>
        
        <form [formGroup]="changePasswordForm" (ngSubmit)="changePassword()" class="change-password-form">
          <div class="form-group">
            <label class="form-label">Nueva contraseña</label>
            <input 
              type="password" 
              class="form-input" 
              placeholder="Contraseña" 
              formControlName="newPassword" 
              required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Confirma tu contraseña</label>
            <input 
              type="password" 
              class="form-input" 
              placeholder="Contraseña" 
              formControlName="confirmPassword" 
              required>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn-primary" [disabled]="!changePasswordForm.valid">
              Cambiar contraseña
            </button>
            <button type="button" class="btn-secondary" (click)="goToLogin()">
              Inicia sesión
            </button>
          </div>
        </form>
        
        <div class="change-password-info">
          <p>La contraseña debe tener al menos 8 caracteres y contener letras y números.</p>
        </div>
      </div>
    </div>
  </div>
  `
})
export class ChangePasswordComponent {
  changePasswordForm = new FormGroup({
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  constructor(private router: Router) {}

  changePassword() {
    if (this.changePasswordForm.valid) {
      const { newPassword, confirmPassword } = this.changePasswordForm.value;
      
      if (newPassword === confirmPassword) {
        // Simular cambio de contraseña exitoso
        alert('Contraseña cambiada exitosamente');
        this.goToLogin();
      } else {
        alert('Las contraseñas no coinciden');
      }
    }
  }

  goToLogin() {
    this.router.navigate(['/']);
  }
}

