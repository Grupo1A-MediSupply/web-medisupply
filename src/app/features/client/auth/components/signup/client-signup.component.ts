import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  constructor(private router: Router) {}

  createAccount() {
    if (this.signupForm.valid) {
      const { password, confirmPassword } = this.signupForm.value;
      
      if (password === confirmPassword) {
        // Store client role in sessionStorage
        sessionStorage.setItem('role', 'client');
        sessionStorage.setItem('userType', 'client');
        
        // Simulate successful account creation
        alert('Cuenta de cliente creada exitosamente');
        this.router.navigate(['/client/login']);
      } else {
        alert('Las contraseñas no coinciden');
      }
    }
  }

  goToLogin() {
    this.router.navigate(['/client/login']);
  }
}

