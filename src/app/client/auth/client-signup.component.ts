import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-client-signup',
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
          
          <div class="error-message" *ngIf="errorMessage" style="color: red; margin-bottom: 1rem;">
            {{ errorMessage }}
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn-primary" [disabled]="!signupForm.valid || loading">
              <span *ngIf="loading">Creando cuenta...</span>
              <span *ngIf="!loading">Crear cuenta cliente</span>
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

  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  createAccount() {
    if (this.signupForm.valid) {
      const { password, confirmPassword, fullName, email, phone, institution, position, username } = this.signupForm.value;
      
      if (password !== confirmPassword) {
        this.errorMessage = 'Las contraseñas no coinciden';
        return;
      }

      this.loading = true;
      this.errorMessage = '';

      // Registrar como cliente (is_superuser: false)
      this.authService.register({
        email: email || '',
        username: username || '',
        password: password || '',
        confirm_password: confirmPassword || '',
        full_name: fullName || '',
        phone_number: phone || '',
        is_active: true,
        is_superuser: false // false = cliente
      }).subscribe({
        next: (response) => {
          this.loading = false;
          
          try {
            // El backend retorna directamente el objeto del usuario con status 201
            // La respuesta es el body: { id, email, username, full_name, ... }
            console.log('✅ Respuesta del registro recibida:', response);
            console.log('✅ Tipo de respuesta:', typeof response);
            
            // Si llegamos aquí, la petición fue exitosa (status 201)
            // El backend siempre retorna el objeto del usuario directamente
            // Validar de forma más flexible para producción
            const isSuccess = response && (
              (typeof response === 'object' && ('id' in response || 'email' in response || 'username' in response)) ||
              (response && response.id) ||
              (response && response.email) ||
              (response && response.username)
            );
            
            // Si no tiene formato esperado pero tampoco tiene error, asumir éxito
            const hasError = response && (response.message || response.error);
            
            if (isSuccess || !hasError) {
              // Registro exitoso - redirigir a login
              console.log('✅ Registro exitoso, redirigiendo a login');
              alert('Cuenta de cliente creada exitosamente');
              this.router.navigate(['/client/login']);
            } else {
              // Hay un mensaje de error explícito
              this.errorMessage = response?.message || response?.error || 'Error al crear la cuenta';
              console.error('❌ Error en la respuesta:', this.errorMessage);
            }
          } catch (error) {
            // Si hay un error al procesar la respuesta, pero llegamos aquí significa que fue exitosa
            console.warn('⚠️ Error al procesar respuesta, pero petición fue exitosa:', error);
            alert('Cuenta de cliente creada exitosamente');
            this.router.navigate(['/client/login']);
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error?.error?.message || error?.message || 'Error al crear la cuenta. Por favor, intenta de nuevo.';
          console.error('Error al registrar cliente:', error);
        }
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

  goToLogin() {
    this.router.navigate(['/client/login']);
  }
}

