import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  templateUrl: './vendor-login.component.html'
})
export class VendorLoginComponent {
  _form = new FormGroup({
    user: new FormControl('', [Validators.required]),
    pass: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private translate: TranslateService
  ) {}

  get user() { return this._form.get('user'); }
  get pass() { return this._form.get('pass'); }

  getUserErrorMessage(): string {
    if (this.user?.hasError('required')) {
      return this.translate.instant('auth.usernameRequired');
    }
    return '';
  }

  getPassErrorMessage(): string {
    if (this.pass?.hasError('required')) {
      return this.translate.instant('auth.passwordRequired');
    }
    if (this.pass?.hasError('minlength')) {
      return this.translate.instant('auth.passwordMinLength');
    }
    return '';
  }

  login() {
    this.errorMessage = '';

    if (this._form.invalid) {
      this._form.markAllAsTouched();
      this.errorMessage = this.translate.instant('auth.completeFields');
      return;
    }

    this.isLoading = true;

    const username = this._form.value.user?.toLowerCase() || '';
    const password = this._form.value.pass || '';

    this.authService.login({ username, password }).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.mfaRequired) {
          sessionStorage.setItem('mfaUserId', response.userId || '');
          sessionStorage.setItem('role', 'vendor');
          this.router.navigate(['/vendor/mfa']);
        } else if (response.token && response.user) {
          this.router.navigate(['/vendor/orders']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        
        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.status === 401) {
          this.errorMessage = this.translate.instant('auth.invalidCredentials');
        } else if (error.status === 0 || error.status === 500) {
          this.errorMessage = this.translate.instant('auth.serverError');
        } else {
          this.errorMessage = this.translate.instant('auth.loginError');
        }
        console.error('Login error:', error);
      }
    });
  }

  goToSignup() {
    this.router.navigate(['/vendor/signup']);
  }
}

