import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


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
import { UploadComponent } from './features/vendor/pages/upload/upload.component';
import { ClientDashboardComponent } from './features/client/pages/dashboard/client-dashboard.component';
import { OrderCreateComponent } from './features/client/pages/order-create/order-create.component';
import { OrdersComponent } from './features/vendor/pages/orders/orders.component';
import { InventoryComponent } from './features/vendor/pages/inventory/inventory.component';
import { RoutesComponent } from './features/vendor/pages/routes/routes.component';

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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
