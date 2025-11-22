import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  templateUrl: './client-signup.component.html'
})
export class ClientSignupComponent {
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
    institution: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100)
    ]),
    position: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100)
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
    private authService: AuthService
  ) {}

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

  get fullName() { return this.signupForm.get('fullName'); }
  get email() { return this.signupForm.get('email'); }
  get phone() { return this.signupForm.get('phone'); }
  get institution() { return this.signupForm.get('institution'); }
  get position() { return this.signupForm.get('position'); }
  get username() { return this.signupForm.get('username'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }

  getFullNameErrorMessage(): string {
    if (this.fullName?.hasError('required')) {
      return 'El nombre completo es requerido';
    }
    if (this.fullName?.hasError('minlength')) {
      return 'El nombre debe tener al menos 2 caracteres';
    }
    if (this.fullName?.hasError('maxlength')) {
      return 'El nombre no puede exceder 100 caracteres';
    }
    if (this.fullName?.hasError('pattern')) {
      return 'El nombre solo puede contener letras y espacios';
    }
    return '';
  }

  getEmailErrorMessage(): string {
    if (this.email?.hasError('required')) {
      return 'El correo electrónico es requerido';
    }
    if (this.email?.hasError('email')) {
      return 'Ingrese un correo electrónico válido';
    }
    if (this.email?.hasError('maxlength')) {
      return 'El correo no puede exceder 255 caracteres';
    }
    return '';
  }

  getPhoneErrorMessage(): string {
    if (this.phone?.hasError('required')) {
      return 'El número de teléfono es requerido';
    }
    if (this.phone?.hasError('pattern')) {
      return 'Ingrese un número de teléfono válido';
    }
    if (this.phone?.hasError('minlength')) {
      return 'El teléfono debe tener al menos 7 dígitos';
    }
    if (this.phone?.hasError('maxlength')) {
      return 'El teléfono no puede exceder 20 caracteres';
    }
    return '';
  }

  getInstitutionErrorMessage(): string {
    if (this.institution?.hasError('required')) {
      return 'El nombre de la institución es requerido';
    }
    if (this.institution?.hasError('minlength')) {
      return 'El nombre de la institución debe tener al menos 2 caracteres';
    }
    if (this.institution?.hasError('maxlength')) {
      return 'El nombre de la institución no puede exceder 100 caracteres';
    }
    return '';
  }

  getPositionErrorMessage(): string {
    if (this.position?.hasError('required')) {
      return 'El cargo es requerido';
    }
    if (this.position?.hasError('minlength')) {
      return 'El cargo debe tener al menos 2 caracteres';
    }
    if (this.position?.hasError('maxlength')) {
      return 'El cargo no puede exceder 100 caracteres';
    }
    return '';
  }

  getUsernameErrorMessage(): string {
    if (this.username?.hasError('required')) {
      return 'El usuario es requerido';
    }
    if (this.username?.hasError('minlength')) {
      return 'El usuario debe tener al menos 3 caracteres';
    }
    if (this.username?.hasError('maxlength')) {
      return 'El usuario no puede exceder 50 caracteres';
    }
    if (this.username?.hasError('pattern')) {
      return 'El usuario solo puede contener letras, números y guiones bajos';
    }
    return '';
  }

  getPasswordErrorMessage(): string {
    if (this.password?.hasError('required')) {
      return 'La contraseña es requerida';
    }
    if (this.password?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    if (this.password?.hasError('maxlength')) {
      return 'La contraseña no puede exceder 100 caracteres';
    }
    if (this.password?.hasError('passwordStrength')) {
      return 'La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales';
    }
    return '';
  }

  getConfirmPasswordErrorMessage(): string {
    if (this.confirmPassword?.hasError('required')) {
      return 'Confirme su contraseña';
    }
    if (this.confirmPassword?.hasError('passwordMismatch') || this.signupForm.hasError('passwordMismatch')) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  }

  createAccount() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      this.errorMessage = 'Por favor, complete todos los campos correctamente';
      return;
    }

    const { password, confirmPassword, email, fullName, phone, institution, username } = this.signupForm.value;
    
    if (password !== confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      this.confirmPassword?.setErrors({ passwordMismatch: true });
      return;
    }
    
    this.isLoading = true;
    
    const signupData = {
      email: email?.toLowerCase() || '',
      username: username || '',
      password: password || '',
      confirm_password: confirmPassword || '',
      role: 'client' as const,
      name: fullName || '',
      phone: phone || '',
      institutionName: institution || ''
    };
    
    this.authService.signup(signupData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message || 'Cuenta de cliente creada exitosamente';
        
        setTimeout(() => {
          this.router.navigate(['/client/login']);
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        
        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.status === 409) {
          this.errorMessage = 'El correo electrónico o usuario ya está registrado';
        } else if (error.status === 400) {
          this.errorMessage = 'Datos inválidos. Por favor, verifique la información';
        } else if (error.status === 0 || error.status === 500) {
          this.errorMessage = 'Error del servidor. Por favor, intente más tarde';
        } else {
          this.errorMessage = 'Error al crear la cuenta. Por favor, intente nuevamente';
        }
        console.error('Signup error:', error);
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/client/login']);
  }
}

