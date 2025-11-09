import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent {
  _form = new FormGroup({
    user: new FormControl('', [Validators.required, Validators.minLength(2)]),
    pass: new FormControl('', [Validators.required, Validators.minLength(2)])
  });
  
  constructor(private router: Router){}
  
  login(){
    if (this._form.valid) {
      const username = this._form.value.user?.toLowerCase();
      let role = '';
      
      // Determine role based on username
      if (username === 'vendedor') {
        role = 'vendor';
      } else if (username === 'cliente') {
        role = 'client';
      } else {
        // Default to vendor for any other username
        role = 'vendor';
      }
      
      // store role in sessionStorage (simple mock)
      sessionStorage.setItem('role', role);
      // go to MFA step
      this.router.navigate(['/mfa']);
    } else {
      // Mark all fields as touched to show validation errors
      this._form.markAllAsTouched();
    }
  }
  
  goToSignup(){
    this.router.navigate(['/signup']);
  }
}
