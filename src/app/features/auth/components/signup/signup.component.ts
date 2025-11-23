import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {
  signupForm = new FormGroup({
    fullName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100),
      Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.maxLength(255)
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9+\-\s()]+$/),
      Validators.minLength(7),
      Validators.maxLength(20)
    ]),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
      Validators.pattern(/^[a-zA-Z0-9_]+$/)
    ]),
    password: new FormControl('', [
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
    private authService: AuthService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    // Agregar validación de coincidencia de contraseñas cuando cambie cualquiera de las dos
    this.signupForm.get('password')?.valueChanges.subscribe(() => {
      this.signupForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  // Validador personalizado para fuerza de contraseña
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

  // Validador personalizado para coincidencia de contraseñas
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value && confirmPassword.value && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (confirmPassword.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }

    return null;
  }

  // Getters para facilitar el acceso a los controles en el template
  get fullName() { return this.signupForm.get('fullName'); }
  get email() { return this.signupForm.get('email'); }
  get phone() { return this.signupForm.get('phone'); }
  get username() { return this.signupForm.get('username'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }

  // Métodos para obtener mensajes de error
  getFullNameErrorMessage(): string {
    if (this.fullName?.hasError('required')) {
      return this.translate.instant('auth.fullNameRequired');
    }
    if (this.fullName?.hasError('minlength')) {
      return this.translate.instant('auth.fullNameMinLength');
    }
    if (this.fullName?.hasError('maxlength')) {
      return this.translate.instant('auth.fullNameMaxLength');
    }
    if (this.fullName?.hasError('pattern')) {
      return this.translate.instant('auth.fullNamePattern');
    }
    return '';
  }

  getEmailErrorMessage(): string {
    if (this.email?.hasError('required')) {
      return this.translate.instant('auth.emailRequired');
    }
    if (this.email?.hasError('email')) {
      return this.translate.instant('auth.emailInvalid');
    }
    if (this.email?.hasError('maxlength')) {
      return this.translate.instant('auth.emailMaxLength');
    }
    return '';
  }

  getPhoneErrorMessage(): string {
    if (this.phone?.hasError('required')) {
      return this.translate.instant('auth.phoneRequired');
    }
    if (this.phone?.hasError('pattern')) {
      return this.translate.instant('auth.phoneInvalid');
    }
    if (this.phone?.hasError('minlength')) {
      return this.translate.instant('auth.phoneMinLength');
    }
    if (this.phone?.hasError('maxlength')) {
      return this.translate.instant('auth.phoneMaxLength');
    }
    return '';
  }

  getUsernameErrorMessage(): string {
    if (this.username?.hasError('required')) {
      return this.translate.instant('auth.usernameRequired');
    }
    if (this.username?.hasError('minlength')) {
      return this.translate.instant('auth.usernameMinLength');
    }
    if (this.username?.hasError('maxlength')) {
      return this.translate.instant('auth.usernameMaxLength');
    }
    if (this.username?.hasError('pattern')) {
      return this.translate.instant('auth.usernamePattern');
    }
    return '';
  }

  getPasswordErrorMessage(): string {
    if (this.password?.hasError('required')) {
      return this.translate.instant('auth.passwordRequired');
    }
    if (this.password?.hasError('minlength')) {
      return this.translate.instant('auth.passwordMinLength');
    }
    if (this.password?.hasError('maxlength')) {
      return this.translate.instant('auth.passwordMaxLength');
    }
    if (this.password?.hasError('passwordStrength')) {
      return this.translate.instant('auth.passwordStrength');
    }
    return '';
  }

  getConfirmPasswordErrorMessage(): string {
    if (this.confirmPassword?.hasError('required')) {
      return this.translate.instant('auth.confirmPasswordRequired');
    }
    if (this.confirmPassword?.hasError('passwordMismatch') || this.signupForm.hasError('passwordMismatch')) {
      return this.translate.instant('auth.passwordMismatch');
    }
    return '';
  }

  createAccount() {
    // Limpiar mensajes previos
    this.errorMessage = '';
    this.successMessage = '';

    // Marcar todos los campos como touched para mostrar errores
    if (this.signupForm.invalid) {
      Object.keys(this.signupForm.controls).forEach(key => {
        this.signupForm.get(key)?.markAsTouched();
      });
      this.errorMessage = this.translate.instant('auth.completeFields');
      return;
    }

    const formValue = this.signupForm.value;
    const { password, confirmPassword, username, fullName, email, phone } = formValue;

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      this.errorMessage = this.translate.instant('auth.passwordMismatch');
      this.confirmPassword?.setErrors({ passwordMismatch: true });
      return;
    }

    // Determinar rol basado en el username
    const userRole = username?.toLowerCase().trim();
    let role: 'vendor' | 'client' = 'vendor';
    
    if (userRole === 'vendedor' || userRole === 'vendor') {
      role = 'vendor';
    } else if (userRole === 'cliente' || userRole === 'client') {
      role = 'client';
    } else {
      this.errorMessage = this.translate.instant('auth.usernameInvalidRole');
      this.username?.setErrors({ invalidRole: true });
      return;
    }

    this.isLoading = true;

    // Llamar al servicio de autenticación
    this.authService.signup({
      email: email || '',
      username: username || '',
      password: password || '',
      confirm_password: confirmPassword || '',
      role: role,
      name: fullName || '',
      phone: phone || ''
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message || this.translate.instant('auth.accountCreated');
        
        // Redirigir después de un breve delay
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        
        // Manejar diferentes tipos de errores
        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.error?.error) {
          this.errorMessage = error.error.error;
        } else if (error.status === 409) {
          this.errorMessage = this.translate.instant('auth.emailOrUserExists');
        } else if (error.status === 400) {
          this.errorMessage = this.translate.instant('auth.invalidData');
        } else if (error.status === 0 || error.status === 500) {
          this.errorMessage = this.translate.instant('auth.serverError');
        } else {
          this.errorMessage = this.translate.instant('auth.signupError');
        }
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/']);
  }
}
