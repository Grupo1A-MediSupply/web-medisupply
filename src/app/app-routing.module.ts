import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


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
import { UploadComponent } from './vendor/upload.component';
import { ClientDashboardComponent } from './client/client-dashboard.component';
import { OrderCreateComponent } from './client/order-create.component';
import { OrdersComponent } from './vendor/orders.component';
import { InventoryComponent } from './vendor/inventory.component';
import { RoutesComponent } from './vendor/routes.component';

const routes: Routes = [
  // Default redirect to vendor login
  { path: '', redirectTo: '/vendor/login', pathMatch: 'full' },
  
  // Vendor routes
  { path: 'vendor/login', component: VendorLoginComponent },
  { path: 'vendor/signup', component: VendorSignupComponent },
  { path: 'vendor/mfa', component: VendorMfaComponent },
  { path: 'vendor/change-password', component: VendorChangePasswordComponent },
  { path: 'vendor', component: VendorDashboardComponent },
  { path: 'vendor/orders', component: VendorDashboardComponent },
  { path: 'vendor/upload', component: VendorDashboardComponent },
  { path: 'vendor/inventory', component: VendorDashboardComponent },
  { path: 'vendor/routes', component: VendorDashboardComponent },
  { path: 'vendor/reports', component: VendorDashboardComponent },
  
  // Client routes
  { path: 'client/login', component: ClientLoginComponent },
  { path: 'client/signup', component: ClientSignupComponent },
  { path: 'client/mfa', component: ClientMfaComponent },
  { path: 'client/change-password', component: ClientChangePasswordComponent },
  { 
    path: 'client', 
    component: ClientDashboardComponent,
    children: [
      { path: '', redirectTo: 'create-order', pathMatch: 'full' },
      { path: 'create-order', component: OrderCreateComponent },
      { path: 'history', component: ClientDashboardComponent },
      { path: 'track', component: ClientDashboardComponent }
    ]
  },
  
  // Redirect any unknown routes to vendor login
  { path: '**', redirectTo: '/vendor/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: true, // Enable tracing to debug navigation issues
    useHash: false, // Use HTML5 history API
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
