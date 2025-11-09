import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  signupForm = new FormGroup({
    fullName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]),
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  constructor(private router: Router) {}

  createAccount() {
    if (this.signupForm.valid) {
      const { password, confirmPassword, username } = this.signupForm.value;
      
      if (password === confirmPassword) {
        // Determine role based on username (similar to login)
        const userRole = username?.toLowerCase();
        let role = '';
        
        if (userRole === 'vendedor') {
          role = 'vendor';
        } else if (userRole === 'cliente') {
          role = 'client';
        } else {
          // Default to vendor for any other username
          role = 'vendor';
        }
        
        // Store role in sessionStorage for demo purposes
        sessionStorage.setItem('role', role);
        
        // Simular creación de cuenta exitosa
        alert('Cuenta creada exitosamente');
        this.router.navigate(['/']);
      } else {
        alert('Las contraseñas no coinciden');
      }
    }
  }

  goToLogin() {
    this.router.navigate(['/']);
  }
}
