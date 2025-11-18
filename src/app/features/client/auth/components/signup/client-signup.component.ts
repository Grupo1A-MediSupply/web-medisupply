import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  templateUrl: './client-signup.component.html'
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

  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  createAccount() {
    if (this.signupForm.valid) {
      const { password, confirmPassword, email, fullName, phone, institution } = this.signupForm.value;
      
      if (password !== confirmPassword) {
        this.errorMessage = 'Las contraseñas no coinciden';
        return;
      }
      
      this.isLoading = true;
      this.errorMessage = '';
      
      const signupData = {
        email: email?.toLowerCase() || '',
        password: password || '',
        role: 'client' as const,
        name: fullName || '',
        phone: phone || '',
        institutionName: institution || ''
      };
      
      this.authService.signup(signupData).subscribe({
        next: (response) => {
          this.isLoading = false;
          alert('Cuenta de cliente creada exitosamente');
          this.router.navigate(['/client/login']);
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
    this.router.navigate(['/client/login']);
  }
}

