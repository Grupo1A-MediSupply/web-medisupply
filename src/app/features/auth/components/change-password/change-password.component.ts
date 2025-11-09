import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent {
  changePasswordForm = new FormGroup({
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  constructor(private router: Router) {}

  changePassword() {
    if (this.changePasswordForm.valid) {
      const { newPassword, confirmPassword } = this.changePasswordForm.value;
      
      if (newPassword === confirmPassword) {
        // Simular cambio de contraseña exitoso
        alert('Contraseña cambiada exitosamente');
        this.goToLogin();
      } else {
        alert('Las contraseñas no coinciden');
      }
    }
  }

  goToLogin() {
    this.router.navigate(['/']);
  }
}

