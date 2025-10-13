import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { MfaComponent } from './auth/mfa.component';
import { ChangePasswordComponent } from './auth/change-password.component';
import { SignupComponent } from './auth/signup.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'mfa', component: MfaComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'signup', component: SignupComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
