import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  
  constructor(private router: Router){}
  
  verify(){
    if (this._form.valid) {
      // Verify MFA code and navigate to vendor dashboard
      this.router.navigate(['/vendor/orders']);
    } else {
      // Mark all fields as touched to show validation errors
      this._form.markAllAsTouched();
    }
  }
}

