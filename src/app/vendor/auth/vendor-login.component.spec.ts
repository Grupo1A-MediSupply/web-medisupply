import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { VendorLoginComponent } from './vendor-login.component';

describe('VendorLoginComponent', () => {
  let component: VendorLoginComponent;
  let fixture: ComponentFixture<VendorLoginComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
          declarations: [VendorLoginComponent],
          imports: [ReactiveFormsModule],
          providers: [
            { provide: Router, useValue: mockRouter }
          ],
          schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();

    fixture = TestBed.createComponent(VendorLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component._form.get('user')?.value).toBe('');
    expect(component._form.get('pass')?.value).toBe('');
  });

  it('should validate required fields', () => {
    expect(component._form.get('user')?.hasError('required')).toBeTruthy();
    expect(component._form.get('pass')?.hasError('required')).toBeTruthy();
  });

  it('should validate minimum length for user field', () => {
    const userControl = component._form.get('user');
    userControl?.setValue('a');
    expect(userControl?.hasError('minlength')).toBeTruthy();

    userControl?.setValue('ab');
    expect(userControl?.hasError('minlength')).toBeFalsy();
  });

  it('should validate minimum length for password field', () => {
    const passControl = component._form.get('pass');
    passControl?.setValue('a');
    expect(passControl?.hasError('minlength')).toBeTruthy();

    passControl?.setValue('ab');
    expect(passControl?.hasError('minlength')).toBeFalsy();
  });

  it('should set vendor role and navigate to vendor MFA on valid login', () => {
    spyOn(sessionStorage, 'setItem');
    component._form.patchValue({ user: 'vendedor', pass: 'password123' });
    
    component.login();
    
    expect(sessionStorage.setItem).toHaveBeenCalledWith('role', 'vendor');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('userType', 'vendor');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/vendor/mfa']);
  });

  it('should not navigate when form is invalid', () => {
    component._form.patchValue({ user: '', pass: '' });
    spyOn(component._form, 'markAllAsTouched');
    
    component.login();
    
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(component._form.markAllAsTouched).toHaveBeenCalled();
  });

  it('should navigate to vendor signup when goToSignup is called', () => {
    component.goToSignup();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/vendor/signup']);
  });

  it('should handle login with different vendor credentials', () => {
    spyOn(sessionStorage, 'setItem');
    component._form.patchValue({ user: 'vendoruser', pass: 'vendorpass123' });
    
    component.login();
    
    expect(sessionStorage.setItem).toHaveBeenCalledWith('role', 'vendor');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('userType', 'vendor');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/vendor/mfa']);
  });

  it('should show validation errors for empty form', () => {
    component._form.patchValue({ user: '', pass: '' });
    component._form.markAllAsTouched();
    fixture.detectChanges();
    
    expect(component._form.invalid).toBeTruthy();
    expect(component._form.get('user')?.hasError('required')).toBeTruthy();
    expect(component._form.get('pass')?.hasError('required')).toBeTruthy();
  });

  it('should show validation errors for short inputs', () => {
    component._form.patchValue({ user: 'a', pass: 'a' });
    component._form.markAllAsTouched();
    fixture.detectChanges();
    
    expect(component._form.get('user')?.hasError('minlength')).toBeTruthy();
    expect(component._form.get('pass')?.hasError('minlength')).toBeTruthy();
  });

  it('should be valid with proper inputs', () => {
    component._form.patchValue({ user: 'validvendor', pass: 'validpass123' });
    fixture.detectChanges();
    
    expect(component._form.valid).toBeTruthy();
  });

  it('should handle form submission with valid data', () => {
    spyOn(sessionStorage, 'setItem');
    component._form.patchValue({ user: 'vendoruser', pass: 'vendorpass123' });
    
    component.login();
    
    expect(sessionStorage.setItem).toHaveBeenCalledTimes(2);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/vendor/mfa']);
  });

  it('should handle form submission with invalid data', () => {
    spyOn(component._form, 'markAllAsTouched');
    component._form.patchValue({ user: 'a', pass: 'a' });
    
    component.login();
    
    expect(component._form.markAllAsTouched).toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should reset form when needed', () => {
    component._form.patchValue({ user: 'test', pass: 'test' });
    component._form.reset();
    
    expect(component._form.get('user')?.value).toBeNull();
    expect(component._form.get('pass')?.value).toBeNull();
  });

  it('should handle edge case with special characters in username', () => {
    component._form.patchValue({ user: 'vendor@company.com', pass: 'password123' });
    fixture.detectChanges();
    
    expect(component._form.valid).toBeTruthy();
  });

  it('should handle edge case with very long password', () => {
    const longPassword = 'a'.repeat(100);
    component._form.patchValue({ user: 'vendor', pass: longPassword });
    fixture.detectChanges();
    
    expect(component._form.valid).toBeTruthy();
  });

  it('should handle form state changes', () => {
    expect(component._form.pristine).toBeTruthy();
    expect(component._form.untouched).toBeTruthy();
    
    // Simulate user input by setting value and marking as touched
    component._form.get('user')?.setValue('test');
    component._form.get('user')?.markAsTouched();
    component._form.get('user')?.markAsDirty();
    fixture.detectChanges();
    
    expect(component._form.dirty).toBeTruthy();
  });

  it('should handle multiple login attempts', () => {
    spyOn(sessionStorage, 'setItem');
    
    // First login attempt
    component._form.patchValue({ user: 'vendor1', pass: 'pass123' });
    component.login();
    
    // Second login attempt
    component._form.patchValue({ user: 'vendor2', pass: 'pass456' });
    component.login();
    
    expect(sessionStorage.setItem).toHaveBeenCalledTimes(4);
    expect(mockRouter.navigate).toHaveBeenCalledTimes(2);
  });

  it('should handle form validation edge cases', () => {
    // Test with empty inputs
    component._form.patchValue({ user: '', pass: '' });
    expect(component._form.invalid).toBeTruthy();
    
    // Test with valid inputs
    component._form.patchValue({ user: 'vendor', pass: 'password' });
    expect(component._form.valid).toBeTruthy();
  });

  it('should handle form validation errors', () => {
    // Test with empty form
    expect(component._form.invalid).toBeTruthy();
    
    // Test with only username
    component._form.patchValue({ user: 'testvendor' });
    expect(component._form.invalid).toBeTruthy();
    
    // Test with only password
    component._form.patchValue({ user: '', pass: 'testpass' });
    expect(component._form.invalid).toBeTruthy();
    
    // Test with both fields
    component._form.patchValue({ user: 'testvendor', pass: 'testpass' });
    expect(component._form.valid).toBeTruthy();
  });

  it('should handle login with different user types', () => {
    spyOn(sessionStorage, 'setItem');
    
    // Test vendor login
    component._form.patchValue({ user: 'proveedor', pass: 'password' });
    component.login();
    
    expect(sessionStorage.setItem).toHaveBeenCalledWith('role', 'vendor');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('userType', 'vendor');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/vendor/mfa']);
  });

  it('should handle invalid login credentials', () => {
    component._form.patchValue({ user: 'invalid', pass: 'wrong' });
    component.login();
    
    // The component navigates to MFA regardless of credentials when form is valid
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/vendor/mfa']);
  });

  it('should handle form reset', () => {
    component._form.patchValue({ user: 'test', pass: 'test' });
    component._form.reset();
    
    expect(component._form.pristine).toBeTruthy();
    expect(component._form.untouched).toBeTruthy();
  });

  it('should handle navigation to signup', () => {
    component.goToSignup();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/vendor/signup']);
  });

});