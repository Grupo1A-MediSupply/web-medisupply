import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-client-mfa',
  templateUrl: './client-mfa.component.html'
})
export class ClientMfaComponent {
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
      // Verify MFA code and navigate to client dashboard
      this.router.navigate(['/client']);
    } else {
      // Mark all fields as touched to show validation errors
      this._form.markAllAsTouched();
    }
  }
}

