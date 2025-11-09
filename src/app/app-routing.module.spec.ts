import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppRoutingModule } from './app-routing.module';

describe('AppRoutingModule', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
        { path: '', redirectTo: '/vendor/login', pathMatch: 'full' },
        { path: 'vendor/login', component: {} as any },
        { path: 'vendor/signup', component: {} as any },
        { path: 'vendor/mfa', component: {} as any },
        { path: 'vendor/change-password', component: {} as any },
        { path: 'vendor/orders', component: {} as any },
        { path: 'client/login', component: {} as any },
        { path: 'client/signup', component: {} as any },
        { path: 'client/mfa', component: {} as any },
        { path: 'client/change-password', component: {} as any },
        { path: 'client/create-order', component: {} as any },
        { path: '**', redirectTo: '/vendor/login' }
      ]),
      HttpClientTestingModule
      ]
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should be created', () => {
    expect(AppRoutingModule).toBeTruthy();
  });

  it('should redirect empty path to vendor login', async () => {
    await router.navigate(['']);
    expect(location.path()).toBe('/vendor/login');
  });

  it('should handle vendor login route', async () => {
    await router.navigate(['/vendor/login']);
    expect(location.path()).toBe('/vendor/login');
  });

  it('should handle vendor signup route', async () => {
    await router.navigate(['/vendor/signup']);
    expect(location.path()).toBe('/vendor/signup');
  });

  it('should handle vendor MFA route', async () => {
    await router.navigate(['/vendor/mfa']);
    expect(location.path()).toBe('/vendor/mfa');
  });

  it('should handle vendor change password route', async () => {
    await router.navigate(['/vendor/change-password']);
    expect(location.path()).toBe('/vendor/change-password');
  });

  it('should handle vendor orders route', async () => {
    await router.navigate(['/vendor/orders']);
    expect(location.path()).toBe('/vendor/orders');
  });

  it('should handle client login route', async () => {
    await router.navigate(['/client/login']);
    expect(location.path()).toBe('/client/login');
  });

  it('should handle client signup route', async () => {
    await router.navigate(['/client/signup']);
    expect(location.path()).toBe('/client/signup');
  });

  it('should handle client MFA route', async () => {
    await router.navigate(['/client/mfa']);
    expect(location.path()).toBe('/client/mfa');
  });

  it('should handle client change password route', async () => {
    await router.navigate(['/client/change-password']);
    expect(location.path()).toBe('/client/change-password');
  });

  it('should handle client create order route', async () => {
    await router.navigate(['/client/create-order']);
    expect(location.path()).toBe('/client/create-order');
  });

  it('should redirect unknown routes to vendor login', async () => {
    await router.navigate(['/unknown-route']);
    expect(location.path()).toBe('/vendor/login');
  });

  it('should handle wildcard route', async () => {
    await router.navigate(['/any-unknown-path']);
    expect(location.path()).toBe('/vendor/login');
  });

  it('should have correct route configuration', () => {
    const config = router.config;
    expect(config.length).toBeGreaterThan(0);
    
    const defaultRoute = config.find(route => route.path === '');
    expect(defaultRoute).toBeTruthy();
    expect(defaultRoute?.redirectTo).toBe('/vendor/login');
    
    const wildcardRoute = config.find(route => route.path === '**');
    expect(wildcardRoute).toBeTruthy();
    expect(wildcardRoute?.redirectTo).toBe('/vendor/login');
  });
});
