import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  templateUrl: './vendor-signup.component.html'
})
export class VendorSignupComponent {
  signupForm = new FormGroup({
    fullName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]),
    company: new FormControl('', [Validators.required, Validators.minLength(2)]),
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  createAccount() {
    if (this.signupForm.valid) {
      const { password, confirmPassword, email, fullName, phone, company } = this.signupForm.value;
      
      if (password !== confirmPassword) {
        this.errorMessage = 'Las contraseñas no coinciden';
        return;
      }
      
      this.isLoading = true;
      this.errorMessage = '';
      
      const signupData = {
        email: email?.toLowerCase() || '',
        password: password || '',
        role: 'vendor' as const,
        name: fullName || '',
        phone: phone || '',
        address: company || ''
      };
      
      this.authService.signup(signupData).subscribe({
        next: (response) => {
          this.isLoading = false;
          alert('Cuenta de vendedor creada exitosamente');
          this.router.navigate(['/vendor/login']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Error al crear la cuenta';
          console.error('Signup error:', error);
        }
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

  goToLogin() {
    this.router.navigate(['/vendor/login']);
  }
}

