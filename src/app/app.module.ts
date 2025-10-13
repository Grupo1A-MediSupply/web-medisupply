import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';


import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login.component';
import { MfaComponent } from './auth/mfa.component';
import { ChangePasswordComponent } from './auth/change-password.component';
import { SignupComponent } from './auth/signup.component';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MfaComponent,
    ChangePasswordComponent,
    SignupComponent
  ],
         imports: [
           BrowserModule,
           BrowserAnimationsModule,
           ReactiveFormsModule,
           FormsModule,
           RouterModule,
           AppRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
