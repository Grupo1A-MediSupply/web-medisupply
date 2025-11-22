import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../../../core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: './vendor-signup.component.html'
})
export class VendorSignupComponent {
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
    company: new FormControl('', [
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
    private authService: AuthService,
    private translate: TranslateService
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
  get company() { return this.signupForm.get('company'); }
  get username() { return this.signupForm.get('username'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }

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

  getCompanyErrorMessage(): string {
    if (this.company?.hasError('required')) {
      return this.translate.instant('auth.companyRequired');
    }
    if (this.company?.hasError('minlength')) {
      return this.translate.instant('auth.companyMinLength');
    }
    if (this.company?.hasError('maxlength')) {
      return this.translate.instant('auth.companyMaxLength');
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
    this.errorMessage = '';
    this.successMessage = '';

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      this.errorMessage = this.translate.instant('auth.completeFields');
      return;
    }

    const { password, confirmPassword, email, fullName, phone, company, username } = this.signupForm.value;
    
    if (password !== confirmPassword) {
      this.errorMessage = this.translate.instant('auth.passwordMismatch');
      this.confirmPassword?.setErrors({ passwordMismatch: true });
      return;
    }
    
    this.isLoading = true;
    
    const signupData = {
      email: email?.toLowerCase() || '',
      username: username || '',
      password: password || '',
      confirm_password: confirmPassword || '',
      role: 'vendor' as const,
      name: fullName || '',
      phone: phone || '',
      address: company || ''
    };
    
    this.authService.signup(signupData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message || this.translate.instant('auth.accountCreatedVendor');
        
        setTimeout(() => {
          this.router.navigate(['/vendor/login']);
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        
        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.status === 409) {
          this.errorMessage = this.translate.instant('auth.emailOrUserExists');
        } else if (error.status === 400) {
          this.errorMessage = this.translate.instant('auth.invalidData');
        } else if (error.status === 0 || error.status === 500) {
          this.errorMessage = this.translate.instant('auth.serverError');
        } else {
          this.errorMessage = this.translate.instant('auth.signupError');
        }
        console.error('Signup error:', error);
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/vendor/login']);
  }
}

