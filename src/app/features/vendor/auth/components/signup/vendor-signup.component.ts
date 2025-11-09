import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  constructor(private router: Router) {}

  createAccount() {
    if (this.signupForm.valid) {
      const { password, confirmPassword } = this.signupForm.value;
      
      if (password === confirmPassword) {
        // Store vendor role in sessionStorage
        sessionStorage.setItem('role', 'vendor');
        sessionStorage.setItem('userType', 'vendor');
        
        // Simulate successful account creation
        alert('Cuenta de vendedor creada exitosamente');
        this.router.navigate(['/vendor/login']);
      } else {
        alert('Las contraseñas no coinciden');
      }
    }
  }

  goToLogin() {
    this.router.navigate(['/vendor/login']);
  }
}

