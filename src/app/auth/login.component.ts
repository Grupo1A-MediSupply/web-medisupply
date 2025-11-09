import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
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
          <div class="brand-subtitle">Distribución de Insumos Médicos</div>
        </div>
      </div>
    </div>

    <!-- Right Section - Login Form -->
    <div class="login-right-section">
      <div class="login-form-container">
        <h1 class="login-title">Inicia sesión</h1>
        
        <form [formGroup]="_form" (ngSubmit)="login()" class="login-form">
          <div class="form-group">
            <label class="form-label">Usuario</label>
            <input 
              type="text" 
              class="form-input" 
              [class.error]="_form.get('user')?.invalid && _form.get('user')?.touched"
              placeholder="Usuario" 
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
            <a routerLink="/change-password" class="forgot-link">Cambiar contraseña</a>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn-primary" [disabled]="!_form.valid">
              Iniciar sesión
            </button>
            <button type="button" class="btn-secondary" (click)="goToSignup()">
              Crear cuenta
            </button>
          </div>
        </form>
        
        <div class="login-info">
          <p>Este prototipo simula autenticación y MFA. Después de ingresar, se solicita un código MFA mock.</p>
          <p><strong>Usuarios de prueba:</strong></p>
          <p>• <strong>vendedor</strong> - Acceso como vendedor</p>
          <p>• <strong>cliente</strong> - Acceso como cliente institucional</p>
        </div>
      </div>
    </div>
  </div>
  `
})
export class LoginComponent {
  _form = new FormGroup({
    user: new FormControl('', [Validators.required, Validators.minLength(2)]),
    pass: new FormControl('', [Validators.required, Validators.minLength(2)])
  });
  
  constructor(private router: Router){}
  
  login(){
    if (this._form.valid) {
      const username = this._form.value.user?.toLowerCase();
      let role = '';
      
      // Determine role based on username
      if (username === 'vendedor') {
        role = 'vendor';
      } else if (username === 'cliente') {
        role = 'client';
      } else {
        // Default to vendor for any other username
        role = 'vendor';
      }
      
      // store role in sessionStorage (simple mock)
      sessionStorage.setItem('role', role);
      // go to MFA step
      this.router.navigate(['/mfa']);
    } else {
      // Mark all fields as touched to show validation errors
      this._form.markAllAsTouched();
    }
  }
  
  goToSignup(){
    this.router.navigate(['/signup']);
  }
}
