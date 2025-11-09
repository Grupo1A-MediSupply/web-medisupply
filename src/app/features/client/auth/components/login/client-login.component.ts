import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './client-login.component.html'
})
export class ClientLoginComponent {
  _form = new FormGroup({
    user: new FormControl('', [Validators.required, Validators.minLength(2)]),
    pass: new FormControl('', [Validators.required, Validators.minLength(2)])
  });
  
  constructor(private router: Router){}
  
  login(){
    if (this._form.valid) {
      const username = this._form.value.user?.toLowerCase();
      
      // Store client role in sessionStorage
      sessionStorage.setItem('role', 'client');
      sessionStorage.setItem('userType', 'client');
      
      // Navigate to client MFA
      this.router.navigate(['/client/mfa']);
    } else {
      // Mark all fields as touched to show validation errors
      this._form.markAllAsTouched();
    }
  }
  
  goToSignup(){
    this.router.navigate(['/client/signup']);
  }
}

