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

// Vendor Auth Components
import { VendorLoginComponent } from './vendor/auth/vendor-login.component';
import { VendorSignupComponent } from './vendor/auth/vendor-signup.component';
import { VendorMfaComponent } from './vendor/auth/vendor-mfa.component';
import { VendorChangePasswordComponent } from './vendor/auth/vendor-change-password.component';

// Client Auth Components
import { ClientLoginComponent } from './client/auth/client-login.component';
import { ClientSignupComponent } from './client/auth/client-signup.component';
import { ClientMfaComponent } from './client/auth/client-mfa.component';
import { ClientChangePasswordComponent } from './client/auth/client-change-password.component';

// Dashboard Components
import { VendorDashboardComponent } from './vendor/vendor-dashboard.component';
import { ClientDashboardComponent } from './client/client-dashboard.component';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    
    // Vendor Auth Components
    VendorLoginComponent,
    VendorSignupComponent,
    VendorMfaComponent,
    VendorChangePasswordComponent,
    
    // Client Auth Components
    ClientLoginComponent,
    ClientSignupComponent,
    ClientMfaComponent,
    ClientChangePasswordComponent,
    
    // Dashboard Components
    VendorDashboardComponent,
    ClientDashboardComponent
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
