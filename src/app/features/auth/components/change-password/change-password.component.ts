import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(100),
      this.passwordStrengthValidator
    ]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: this.passwordMatchValidator });

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.changePasswordForm.get('newPassword')?.valueChanges.subscribe(() => {
      this.changePasswordForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const value = control.value as string;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const valid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

    return valid ? null : { passwordStrength: true };
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (!newPassword || !confirmPassword) {
      return null;
    }

    if (newPassword.value && confirmPassword.value && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (confirmPassword.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }

    return null;
  }

  get currentPassword() { return this.changePasswordForm.get('currentPassword'); }
  get newPassword() { return this.changePasswordForm.get('newPassword'); }
  get confirmPassword() { return this.changePasswordForm.get('confirmPassword'); }

  getCurrentPasswordErrorMessage(): string {
    if (this.currentPassword?.hasError('required')) {
      return 'La contraseña actual es requerida';
    }
    return '';
  }

  getNewPasswordErrorMessage(): string {
    if (this.newPassword?.hasError('required')) {
      return 'La nueva contraseña es requerida';
    }
    if (this.newPassword?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    if (this.newPassword?.hasError('maxlength')) {
      return 'La contraseña no puede exceder 100 caracteres';
    }
    if (this.newPassword?.hasError('passwordStrength')) {
      return 'La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales';
    }
    return '';
  }

  getConfirmPasswordErrorMessage(): string {
    if (this.confirmPassword?.hasError('required')) {
      return 'Confirme su contraseña';
    }
    if (this.confirmPassword?.hasError('passwordMismatch') || this.changePasswordForm.hasError('passwordMismatch')) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  }

  changePassword() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      this.errorMessage = 'Por favor, complete todos los campos correctamente';
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = this.changePasswordForm.value;

    if (newPassword !== confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      this.confirmPassword?.setErrors({ passwordMismatch: true });
      return;
    }

    if (currentPassword === newPassword) {
      this.errorMessage = 'La nueva contraseña debe ser diferente a la actual';
      return;
    }

    this.isLoading = true;

    this.authService.changePassword(currentPassword || '', newPassword || '').subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Contraseña cambiada exitosamente';
        
        setTimeout(() => {
          this.goToLogin();
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        
        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.status === 401) {
          this.errorMessage = 'La contraseña actual es incorrecta';
        } else if (error.status === 400) {
          this.errorMessage = 'Datos inválidos. Por favor, verifique la información';
        } else if (error.status === 0 || error.status === 500) {
          this.errorMessage = 'Error del servidor. Por favor, intente más tarde';
        } else {
          this.errorMessage = 'Error al cambiar la contraseña. Por favor, intente nuevamente';
        }
        console.error('Change password error:', error);
      }
    });
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

