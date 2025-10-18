import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  template: `
  <div class="signup-page">
    <!-- Left Section - Logo and Branding -->
    <div class="signup-left-section">
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

    <!-- Right Section - Signup Form -->
    <div class="signup-right-section">
      <div class="signup-form-container">
        <h1 class="signup-title">Registro de Cliente</h1>
        
        <form [formGroup]="signupForm" (ngSubmit)="createAccount()" class="signup-form">
          <div class="form-group">
            <label class="form-label">Nombre completo</label>
            <input 
              type="text" 
              class="form-input" 
              placeholder="Nombre completo" 
              formControlName="fullName" 
              required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Correo electrónico</label>
            <input 
              type="email" 
              class="form-input" 
              placeholder="correo@institucion.com" 
              formControlName="email" 
              required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Número de teléfono</label>
            <input 
              type="tel" 
              class="form-input" 
              placeholder="Número de contacto" 
              formControlName="phone" 
              required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Institución</label>
            <input 
              type="text" 
              class="form-input" 
              placeholder="Nombre de la institución" 
              formControlName="institution" 
              required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Cargo</label>
            <input 
              type="text" 
              class="form-input" 
              placeholder="Tu cargo en la institución" 
              formControlName="position" 
              required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Usuario</label>
            <input 
              type="text" 
              class="form-input" 
              placeholder="Usuario cliente" 
              formControlName="username" 
              required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Contraseña</label>
            <input 
              type="password" 
              class="form-input" 
              placeholder="Contraseña segura" 
              formControlName="password" 
              required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Confirmar contraseña</label>
            <input 
              type="password" 
              class="form-input" 
              placeholder="Confirma tu contraseña" 
              formControlName="confirmPassword" 
              required>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn-primary" [disabled]="!signupForm.valid">
              Crear cuenta cliente
            </button>
            <button type="button" class="btn-secondary" (click)="goToLogin()">
              Iniciar sesión
            </button>
          </div>
        </form>
        
        <div class="signup-info">
          <p>Al crear una cuenta de cliente, aceptas nuestros términos y condiciones.</p>
          <div class="role-switch">
            <a routerLink="/vendor/signup" class="role-link">¿Eres vendedor? Regístrate aquí</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
})
export class ClientSignupComponent {
  signupForm = new FormGroup({
    fullName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]),
    institution: new FormControl('', [Validators.required, Validators.minLength(2)]),
    position: new FormControl('', [Validators.required, Validators.minLength(2)]),
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  constructor(private router: Router) {}

  createAccount() {
    if (this.signupForm.valid) {
      const { password, confirmPassword } = this.signupForm.value;
      
      if (password === confirmPassword) {
        // Store client role in sessionStorage
        sessionStorage.setItem('role', 'client');
        sessionStorage.setItem('userType', 'client');
        
        // Simulate successful account creation
        alert('Cuenta de cliente creada exitosamente');
        this.router.navigate(['/client/login']);
      } else {
        alert('Las contraseñas no coinciden');
      }
    }
  }

  goToLogin() {
    this.router.navigate(['/client/login']);
  }
}

