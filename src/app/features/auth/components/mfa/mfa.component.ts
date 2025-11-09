import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './mfa.component.html'
})
export class MfaComponent {
  _form = new FormGroup({ 
    code: new FormControl('', [
      Validators.required, 
      Validators.minLength(6), 
      Validators.maxLength(6),
      Validators.pattern(/^[0-9]+$/)
    ])
  });
  
  constructor(private router: Router){}
  
  verify(){
    if (this._form.valid) {
    const role = sessionStorage.getItem('role') || 'client';
    // In a real app validate the code. Here we mock success.
    if(role === 'vendor') this.router.navigate(['/vendor']);
    else this.router.navigate(['/client']);
    } else {
      // Mark all fields as touched to show validation errors
      this._form.markAllAsTouched();
    }
  }
}
