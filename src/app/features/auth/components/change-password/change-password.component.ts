import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent {
  changePasswordForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  changePassword() {
    if (this.changePasswordForm.valid) {
      const { currentPassword, newPassword, confirmPassword } = this.changePasswordForm.value;
      
      if (newPassword !== confirmPassword) {
        this.errorMessage = 'Las contraseñas no coinciden';
        return;
      }

      if (!currentPassword) {
        this.errorMessage = 'La contraseña actual es requerida';
        return;
      }

      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.authService.changePassword(currentPassword, newPassword || '').subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Contraseña cambiada exitosamente';
          
          setTimeout(() => {
            this.goToLogin();
          }, 1500);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Error al cambiar la contraseña';
          console.error('Change password error:', error);
        }
      });
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }

  goToLogin() {
    const role = sessionStorage.getItem('role');
    if (role === 'vendor') {
      this.router.navigate(['/vendor/login']);
    } else if (role === 'client') {
      this.router.navigate(['/client/login']);
    } else {
      this.router.navigate(['/']);
    }
  }
}

