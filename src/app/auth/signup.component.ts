import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
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
          <div class="brand-subtitle">Distribución de Insumos Médicos</div>
        </div>
      </div>
    </div>

    <!-- Right Section - Signup Form -->
    <div class="signup-right-section">
      <div class="signup-form-container">
        <h1 class="signup-title">Crear cuenta</h1>
        
        <form [formGroup]="signupForm" (ngSubmit)="createAccount()" class="signup-form">
          <div class="form-group">
            <label class="form-label">Nombre completo</label>
            <input 
              type="text" 
              class="form-input" 
              placeholder="Nombre" 
              formControlName="fullName" 
              required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Correo electronico</label>
            <input 
              type="email" 
              class="form-input" 
              placeholder="Correo" 
              formControlName="email" 
              required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Número de telefono</label>
            <input 
              type="tel" 
              class="form-input" 
              placeholder="Número" 
              formControlName="phone" 
              required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Usuario</label>
            <input 
              type="text" 
              class="form-input" 
              placeholder="vendedor o cliente" 
              formControlName="username" 
              required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Contraseña</label>
            <input 
              type="password" 
              class="form-input" 
              placeholder="Contraseña" 
              formControlName="password" 
              required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Confirmar contraseña</label>
            <input 
              type="password" 
              class="form-input" 
              placeholder="Contraseña" 
              formControlName="confirmPassword" 
              required>
          </div>
         

          
          <div class="form-actions">
            <button type="submit" class="btn-primary" [disabled]="!signupForm.valid">
              Crear cuenta
            </button>
            <button type="button" class="btn-secondary" (click)="goToLogin()">
              Inicia sesión
            </button>
          </div>
        </form>
        
        <div class="signup-info">
          <p>Al crear una cuenta, aceptas nuestros términos y condiciones de uso.</p>
          <p><strong>Usuarios disponibles:</strong></p>
          <p>• <strong>vendedor</strong> - Acceso como vendedor</p>
          <p>• <strong>cliente</strong> - Acceso como cliente institucional</p>
        </div>
      </div>
    </div>
  </div>
  `
})
export class SignupComponent {
  signupForm = new FormGroup({
    fullName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]),
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  constructor(private router: Router) {}

  createAccount() {
    if (this.signupForm.valid) {
      const { password, confirmPassword, username } = this.signupForm.value;
      
      if (password === confirmPassword) {
        // Determine role based on username (similar to login)
        const userRole = username?.toLowerCase();
        let role = '';
        
        if (userRole === 'vendedor') {
          role = 'vendor';
        } else if (userRole === 'cliente') {
          role = 'client';
        } else {
          // Default to vendor for any other username
          role = 'vendor';
        }
        
        // Store role in sessionStorage for demo purposes
        sessionStorage.setItem('role', role);
        
        // Simular creación de cuenta exitosa
        alert('Cuenta creada exitosamente');
        this.router.navigate(['/']);
      } else {
        alert('Las contraseñas no coinciden');
      }
    }
  }

  goToLogin() {
    this.router.navigate(['/']);
  }
}
