import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  template: `
  <div class="login-page">
    <!-- Left Section - Logo and Branding -->
    <div class="login-left-section">
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

    <!-- Right Section - Login Form -->
    <div class="login-right-section">
      <div class="login-form-container">
        <h1 class="login-title">Inicia sesión - Vendedor</h1>
        
        <form [formGroup]="_form" (ngSubmit)="login()" class="login-form">
          <div class="form-group">
            <label class="form-label">Usuario</label>
            <input 
              type="text" 
              class="form-input" 
              [class.error]="_form.get('user')?.invalid && _form.get('user')?.touched"
              placeholder="Usuario vendedor" 
              formControlName="user" 
              required>
            <div class="error-message" *ngIf="_form.get('user')?.invalid && _form.get('user')?.touched">
              <span *ngIf="_form.get('user')?.errors?.['required']">El usuario es requerido</span>
              <span *ngIf="_form.get('user')?.errors?.['minlength']">El usuario debe tener mínimo 2 caracteres</span>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Contraseña</label>
            <input 
              type="password" 
              class="form-input" 
              [class.error]="_form.get('pass')?.invalid && _form.get('pass')?.touched"
              placeholder="Digita tu contraseña" 
              formControlName="pass" 
              required>
            <div class="error-message" *ngIf="_form.get('pass')?.invalid && _form.get('pass')?.touched">
              <span *ngIf="_form.get('pass')?.errors?.['required']">La contraseña es requerida</span>
              <span *ngIf="_form.get('pass')?.errors?.['minlength']">La contraseña debe tener mínimo 2 caracteres</span>
            </div>
          </div>
          
          <div class="forgot-password">
            <a routerLink="/vendor/change-password" class="forgot-link">Cambiar contraseña</a>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn-primary" [disabled]="!_form.valid">
              Iniciar sesión
            </button>
            <button type="button" class="btn-secondary" (click)="goToSignup()">
              Crear cuenta vendedor
            </button>
          </div>
        </form>
        
        <div class="login-info">
          <p>Portal exclusivo para vendedores de MediSupply.</p>
          <p><strong>Usuario de prueba:</strong> vendedor</p>
          <div class="role-switch">
            <a routerLink="/client/login" class="role-link">¿Eres cliente? Accede aquí</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
})
export class VendorLoginComponent {
  _form = new FormGroup({
    user: new FormControl('', [Validators.required, Validators.minLength(2)]),
    pass: new FormControl('', [Validators.required, Validators.minLength(2)])
  });
  
  constructor(private router: Router){}
  
  login(){
    if (this._form.valid) {
      const username = this._form.value.user?.toLowerCase();
      
      // Store vendor role in sessionStorage
      sessionStorage.setItem('role', 'vendor');
      sessionStorage.setItem('userType', 'vendor');
      
      // Navigate to vendor MFA
      this.router.navigate(['/vendor/mfa']);
    } else {
      // Mark all fields as touched to show validation errors
      this._form.markAllAsTouched();
    }
  }
  
  goToSignup(){
    this.router.navigate(['/vendor/signup']);
  }
}

