import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './vendor-login.component.html'
})
export class VendorLoginComponent {
  _form = new FormGroup({
    user: new FormControl('', [Validators.required, Validators.minLength(2)]),
    pass: new FormControl('', [Validators.required, Validators.minLength(2)])
  });
  
  constructor(private router: Router){}
  
  login(){
    if (this._form.valid) {
      const username = this._form.value.user?.toLowerCase();
      
      // Store vendor role in sessionStorage
      sessionStorage.setItem('role', 'vendor');
      sessionStorage.setItem('userType', 'vendor');
      
      // Navigate to vendor MFA
      this.router.navigate(['/vendor/mfa']);
    } else {
      // Mark all fields as touched to show validation errors
      this._form.markAllAsTouched();
    }
  }
  
  goToSignup(){
    this.router.navigate(['/vendor/signup']);
  }
}

