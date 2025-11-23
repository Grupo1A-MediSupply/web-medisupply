import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

// Translation
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

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
import { MatTooltipModule } from '@angular/material/tooltip';


import { AppComponent } from './app.component';
import { LoginComponent } from './features/auth/components/login/login.component';
import { SignupComponent } from './features/auth/components/signup/signup.component';
import { MfaComponent } from './features/auth/components/mfa/mfa.component';
import { ChangePasswordComponent } from './features/auth/components/change-password/change-password.component';

// Vendor Auth Components
import { VendorLoginComponent } from './features/vendor/auth/components/login/vendor-login.component';
import { VendorSignupComponent } from './features/vendor/auth/components/signup/vendor-signup.component';
import { VendorMfaComponent } from './features/vendor/auth/components/mfa/vendor-mfa.component';
import { VendorChangePasswordComponent } from './features/vendor/auth/components/change-password/vendor-change-password.component';

// Client Auth Components
import { ClientLoginComponent } from './features/client/auth/components/login/client-login.component';
import { ClientSignupComponent } from './features/client/auth/components/signup/client-signup.component';
import { ClientMfaComponent } from './features/client/auth/components/mfa/client-mfa.component';
import { ClientChangePasswordComponent } from './features/client/auth/components/change-password/client-change-password.component';

// Dashboard Components
import { VendorDashboardComponent } from './features/vendor/pages/dashboard/vendor-dashboard.component';
import { ClientDashboardComponent } from './features/client/pages/dashboard/client-dashboard.component';
import { OrdersComponent } from './features/vendor/pages/orders/orders.component';
import { UploadComponent } from './features/vendor/pages/upload/upload.component';
import { OrderCreateComponent } from './features/client/pages/order-create/order-create.component';
import { InventoryComponent } from './features/vendor/pages/inventory/inventory.component';
import { RoutesComponent } from './features/vendor/pages/routes/routes.component';

import { LanguageSelectorComponent } from './core/components/language-selector/language-selector.component';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    
    // Core Auth Components
    LoginComponent,
    SignupComponent,
    MfaComponent,
    ChangePasswordComponent,
    
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
    ClientDashboardComponent,
    OrdersComponent,
    UploadComponent,
    OrderCreateComponent,
    InventoryComponent,
    RoutesComponent,
    
    // Core Components
    LanguageSelectorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'es'
    }),
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
    MatOptionModule,
    MatTooltipModule
  ],
  exports: [
    TranslateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
