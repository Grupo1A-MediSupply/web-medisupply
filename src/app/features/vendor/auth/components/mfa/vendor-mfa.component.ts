import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../../core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-vendor-mfa',
  templateUrl: './vendor-mfa.component.html'
})
export class VendorMfaComponent {
  _form = new FormGroup({ 
    code: new FormControl('', [
      Validators.required, 
      Validators.minLength(6), 
      Validators.maxLength(6),
      Validators.pattern(/^[0-9]+$/)
    ])
  });

  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private translate: TranslateService
  ) {}

  get code() { return this._form.get('code'); }

  getCodeErrorMessage(): string {
    if (this.code?.hasError('required')) {
      return this.translate.instant('auth.codeRequired');
    }
    if (this.code?.hasError('minlength') || this.code?.hasError('maxlength')) {
      return this.translate.instant('auth.codeInvalid');
    }
    if (this.code?.hasError('pattern')) {
      return this.translate.instant('auth.codeInvalid');
    }
    return '';
  }

  verify() {
    this.errorMessage = '';

    if (this._form.invalid) {
      this._form.markAllAsTouched();
      this.errorMessage = this.translate.instant('auth.codeInvalid');
      return;
    }

    this.isLoading = true;

    const userId = sessionStorage.getItem('mfaUserId');
    const code = this._form.value.code || '';

    if (!userId) {
      this.errorMessage = this.translate.instant('auth.loginError');
      this.isLoading = false;
      this.router.navigate(['/vendor/login']);
      return;
    }

    this.authService.verifyMFA(userId, code).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.token && response.user) {
          sessionStorage.removeItem('mfaUserId');
          this.router.navigate(['/vendor/orders']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        
        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.status === 400 || error.status === 401) {
          this.errorMessage = this.translate.instant('auth.codeInvalid');
        } else if (error.status === 0 || error.status === 500) {
          this.errorMessage = this.translate.instant('auth.serverError');
        } else {
          this.errorMessage = this.translate.instant('auth.loginError');
        }
        console.error('MFA verification error:', error);
      }
    });
  }
}

