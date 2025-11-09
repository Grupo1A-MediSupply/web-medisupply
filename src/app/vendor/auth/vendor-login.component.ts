import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-vendor-login',
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
          
          <div class="error-message" *ngIf="errorMessage" style="color: red; margin-bottom: 1rem;">
            {{ errorMessage }}
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn-primary" [disabled]="!_form.valid || loading">
              <span *ngIf="loading">Iniciando sesión...</span>
              <span *ngIf="!loading">Iniciar sesión</span>
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
  
  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}
  
  login(){
    if (this._form.valid) {
      const username = this._form.value.user;
      const password = this._form.value.pass;
      
      this.loading = true;
      this.errorMessage = '';

      // Login - envía código de verificación por email
      this.authService.login(username || '', password || '').subscribe({
        next: (response) => {
          this.loading = false;
          
          try {
            // Si llegamos aquí, la petición fue exitosa (status 200)
            // El backend retorna un mensaje cuando el código se envía exitosamente
            console.log('✅ Respuesta del login recibida:', response);
            console.log('✅ Tipo de respuesta:', typeof response);
            console.log('✅ Respuesta completa (JSON):', JSON.stringify(response, null, 2));
            
            // Si llegamos aquí, la petición fue exitosa (status 200)
            // Solo verificar si hay un error explícito en la respuesta
            const hasExplicitError = response && (
              response.error || 
              (response.message && typeof response.message === 'string' && response.message.toLowerCase().includes('error')) ||
              (response.status && response.status !== 200 && response.status !== '200')
            );
            
            console.log('✅ Validación - hasExplicitError:', hasExplicitError);
            
            // Si no hay error explícito, redirigir a MFA (porque llegamos aquí significa que fue exitosa)
            if (!hasExplicitError) {
              // Store vendor role in sessionStorage
              sessionStorage.setItem('role', 'vendor');
              sessionStorage.setItem('userType', 'vendor');
              // user_id ya está guardado en sessionStorage por AuthService
              console.log('✅ Login exitoso, redirigiendo a MFA');
              console.log('✅ Router disponible:', !!this.router);
              console.log('✅ Intentando navegar a /vendor/mfa');
              
              // Usar solo el router de Angular (sin fallbacks que recargan la página)
              console.log('✅ Navegando usando router.navigateByUrl');
              console.log('✅ URL actual antes de navegar:', window.location.href);
              console.log('✅ Router URL actual:', this.router.url);
              
              // Usar navigate con replaceUrl para forzar la navegación
              this.router.navigate(['/vendor/mfa'], { replaceUrl: false }).then(
                (success) => {
                  console.log('✅ Navegación exitosa:', success);
                  console.log('✅ URL después de navegar:', window.location.href);
                  console.log('✅ Router URL después:', this.router.url);
                  
                  if (!success) {
                    console.warn('⚠️ Navegación retornó false, intentando con navigateByUrl');
                    this.router.navigateByUrl('/vendor/mfa', { replaceUrl: false }).catch((err) => {
                      console.error('❌ Error en navigateByUrl:', err);
                    });
                  }
                },
                (error) => {
                  console.error('❌ Error en navigate:', error);
                  // Intentar con navigateByUrl como fallback
                  console.warn('⚠️ Intentando con router.navigateByUrl');
                  this.router.navigateByUrl('/vendor/mfa', { replaceUrl: false }).catch((err) => {
                    console.error('❌ Error en navigateByUrl:', err);
                  });
                }
              );
            } else {
              // Hay un mensaje de error explícito
              this.errorMessage = response?.message || response?.error || 'Error al iniciar sesión';
              console.error('❌ Error en la respuesta:', this.errorMessage);
            }
          } catch (error) {
            // Si hay un error al procesar la respuesta, pero llegamos aquí significa que fue exitosa
            console.warn('⚠️ Error al procesar respuesta, pero petición fue exitosa:', error);
            sessionStorage.setItem('role', 'vendor');
            sessionStorage.setItem('userType', 'vendor');
            console.log('✅ Intentando navegar a /vendor/mfa desde catch');
            this.router.navigateByUrl('/vendor/mfa').catch((navError) => {
              console.error('❌ Error en navegación desde catch:', navError);
              // Intentar con navigate como fallback
              this.router.navigate(['/vendor/mfa']).catch((err) => {
                console.error('❌ Error en navigate desde catch:', err);
              });
            });
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.message || 'Error al iniciar sesión. Verifica tus credenciales.';
          console.error('Error en login:', error);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      this._form.markAllAsTouched();
    }
  }
  
  goToSignup(){
    this.router.navigate(['/vendor/signup']);
  }
}

