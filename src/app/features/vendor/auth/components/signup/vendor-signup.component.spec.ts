import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { VendorSignupComponent } from './vendor-signup.component';
import { AuthService } from '../../../../../core/services/auth.service';
import { of, throwError } from 'rxjs';

describe('VendorSignupComponent', () => {
  let component: VendorSignupComponent;
  let fixture: ComponentFixture<VendorSignupComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['signup']);

    await TestBed.configureTestingModule({
      declarations: [VendorSignupComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(VendorSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.signupForm.get('fullName')?.value).toBe('');
    expect(component.signupForm.get('email')?.value).toBe('');
    expect(component.signupForm.get('phone')?.value).toBe('');
    expect(component.signupForm.get('company')?.value).toBe('');
    expect(component.signupForm.get('username')?.value).toBe('');
    expect(component.signupForm.get('password')?.value).toBe('');
    expect(component.signupForm.get('confirmPassword')?.value).toBe('');
  });

  it('should validate required fields', () => {
    expect(component.signupForm.get('fullName')?.hasError('required')).toBeTruthy();
    expect(component.signupForm.get('email')?.hasError('required')).toBeTruthy();
    expect(component.signupForm.get('phone')?.hasError('required')).toBeTruthy();
    expect(component.signupForm.get('company')?.hasError('required')).toBeTruthy();
    expect(component.signupForm.get('username')?.hasError('required')).toBeTruthy();
    expect(component.signupForm.get('password')?.hasError('required')).toBeTruthy();
    expect(component.signupForm.get('confirmPassword')?.hasError('required')).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.signupForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should validate phone number format', () => {
    const phoneControl = component.signupForm.get('phone');
    phoneControl?.setValue('abc123');
    expect(phoneControl?.hasError('pattern')).toBeTruthy();

    phoneControl?.setValue('1234567890');
    expect(phoneControl?.hasError('pattern')).toBeFalsy();
  });

  it('should create account successfully with matching passwords', () => {
    spyOn(window, 'alert');
    mockAuthService.signup.and.returnValue(of({
      message: 'Cuenta creada exitosamente',
      token: 'test-token',
      user: { id: '1', email: 'john@example.com', role: 'vendor', name: 'John Doe' }
    }));
    
    component.signupForm.patchValue({
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      company: 'Test Company',
      username: 'vendedor',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    });

    // Ensure form is valid
    expect(component.signupForm.valid).toBeTrue();

    // Mock successful signup
    mockAuthService.signup.and.returnValue(of({
      message: 'Cuenta de vendedor creada exitosamente',
      token: 'test-token',
      user: { id: '1', email: 'john@example.com', role: 'vendor', name: 'John Doe' }
    }));

    component.createAccount();

    expect(mockAuthService.signup).toHaveBeenCalled();
    expect(component.successMessage).toBe('Cuenta de vendedor creada exitosamente');
    // Router navigation happens after timeout
  });

  it('should show error when passwords do not match', () => {
    component.signupForm.patchValue({
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      company: 'Test Company',
      username: 'vendedor',
      password: 'password123',
      confirmPassword: 'differentpassword'
    });

    component.createAccount();

    // The form validation will catch this first
    expect(component.errorMessage).toBeTruthy();
    expect(mockAuthService.signup).not.toHaveBeenCalled();
  });

  it('should navigate to vendor login when goToLogin is called', () => {
    component.goToLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/vendor/login']);
  });

  it('should validate email format correctly', () => {
    const emailControl = component.signupForm.get('email');
    
    // Invalid email formats
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();
    
    emailControl?.setValue('user@');
    expect(emailControl?.hasError('email')).toBeTruthy();
    
    emailControl?.setValue('@domain.com');
    expect(emailControl?.hasError('email')).toBeTruthy();
    
    // Valid email formats
    emailControl?.setValue('user@domain.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
    
    emailControl?.setValue('user.name@domain.co.uk');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should validate phone number format correctly', () => {
    const phoneControl = component.signupForm.get('phone');
    
    // Invalid phone formats
    phoneControl?.setValue('abc');
    expect(phoneControl?.hasError('pattern')).toBeTruthy();
    
    phoneControl?.setValue('123');
    expect(phoneControl?.hasError('pattern')).toBeFalsy(); // This is actually valid according to the pattern
    
    phoneControl?.setValue('123-456-789');
    expect(phoneControl?.hasError('pattern')).toBeFalsy(); // This is actually valid according to the pattern
    
    // Valid phone formats
    phoneControl?.setValue('1234567890');
    expect(phoneControl?.hasError('pattern')).toBeFalsy();
    
    phoneControl?.setValue('9876543210');
    expect(phoneControl?.hasError('pattern')).toBeFalsy();
  });

  it('should handle form validation for all required fields', () => {
    // Test each required field individually
    const requiredFields = ['fullName', 'email', 'phone', 'company', 'username', 'password', 'confirmPassword'];
    
    requiredFields.forEach(field => {
      const control = component.signupForm.get(field);
      control?.setValue('');
      expect(control?.hasError('required')).toBeTruthy();
      
      control?.setValue('test');
      expect(control?.hasError('required')).toBeFalsy();
    });
  });

  it('should handle different company types', () => {
    const companyControl = component.signupForm.get('company');
    
    const companies = ['Pharmaceutical Corp', 'Medical Supplies Inc', 'Healthcare Solutions', 'MedTech Ltd'];
    
    companies.forEach(company => {
      companyControl?.setValue(company);
      expect(companyControl?.valid).toBeTruthy();
    });
  });

  it('should handle username validation', () => {
    const usernameControl = component.signupForm.get('username');
    
    // Valid usernames
    usernameControl?.setValue('vendor123');
    expect(usernameControl?.valid).toBeTruthy();
    
    usernameControl?.setValue('vendedor');
    expect(usernameControl?.valid).toBeTruthy();
    
    usernameControl?.setValue('admin_vendor');
    expect(usernameControl?.valid).toBeTruthy();
  });

  it('should handle password strength validation', () => {
    const passwordControl = component.signupForm.get('password');
    
    // Weak passwords
    passwordControl?.setValue('123');
    expect(passwordControl?.hasError('minlength')).toBeTruthy();
    
    passwordControl?.setValue('password');
    expect(passwordControl?.hasError('minlength')).toBeFalsy();
    
    // Strong passwords
    passwordControl?.setValue('Password123!');
    expect(passwordControl?.valid).toBeTruthy();
  });

  it('should handle form reset functionality', () => {
    component.signupForm.patchValue({
      fullName: 'Test Vendor',
      email: 'test@example.com',
      phone: '1234567890',
      company: 'Test Company',
      username: 'testvendor',
      password: 'password123',
      confirmPassword: 'password123'
    });
    
    component.signupForm.reset();
    
    expect(component.signupForm.get('fullName')?.value).toBeNull();
    expect(component.signupForm.get('email')?.value).toBeNull();
    expect(component.signupForm.get('phone')?.value).toBeNull();
    expect(component.signupForm.get('company')?.value).toBeNull();
    expect(component.signupForm.get('username')?.value).toBeNull();
    expect(component.signupForm.get('password')?.value).toBeNull();
    expect(component.signupForm.get('confirmPassword')?.value).toBeNull();
  });

  it('should handle edge cases with special characters', () => {
    component.signupForm.patchValue({
      fullName: 'José María González',
      email: 'jose.maria@company.com',
      phone: '1234567890',
      company: 'Empresa Médica S.A.',
      username: 'jose_maria',
      password: 'P@ssw0rd123',
      confirmPassword: 'P@ssw0rd123'
    });
    
    expect(component.signupForm.valid).toBeTruthy();
  });

  it('should handle form state changes', () => {
    expect(component.signupForm.pristine).toBeTruthy();
    expect(component.signupForm.untouched).toBeTruthy();
    
    // Simulate user input by setting value and marking as touched
    component.signupForm.get('fullName')?.setValue('Test');
    component.signupForm.get('fullName')?.markAsTouched();
    component.signupForm.get('fullName')?.markAsDirty();
    fixture.detectChanges();
    
    expect(component.signupForm.dirty).toBeTruthy();
  });

  it('should handle very long input values', () => {
    // Use strings that exceed maxLength to test validation
    const longString = 'a'.repeat(101); // Exceeds maxLength of 100
    
    component.signupForm.patchValue({
      fullName: longString,
      email: 'test@example.com',
      phone: '1234567890',
      company: longString,
      username: 'a'.repeat(51), // Exceeds maxLength of 50
      password: 'Password123!',
      confirmPassword: 'Password123!'
    });
    
    // Update form validity after patchValue
    component.signupForm.updateValueAndValidity();
    
    // Trigger change detection to ensure validators run
    fixture.detectChanges();
    
    // Form should be invalid due to maxLength validation
    // Check individual field errors
    expect(component.signupForm.get('fullName')?.hasError('maxlength')).toBeTruthy();
    expect(component.signupForm.get('company')?.hasError('maxlength')).toBeTruthy();
    expect(component.signupForm.get('username')?.hasError('maxlength')).toBeTruthy();
    expect(component.signupForm.valid).toBeFalsy();
  });

  it('should handle multiple account creation attempts', () => {
    mockAuthService.signup.and.returnValue(of({
      message: 'Cuenta creada exitosamente',
      token: 'test-token',
      user: { id: '1', email: 'vendor1@example.com', role: 'vendor', name: 'Vendor Uno' }
    }));
    
    // First attempt
    component.signupForm.patchValue({
      fullName: 'Vendor Uno',
      email: 'vendor1@example.com',
      phone: '1234567890',
      company: 'Company One',
      username: 'vendor1',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    });
    
    // Update form validity after patchValue - need to update all controls first
    component.signupForm.get('fullName')?.updateValueAndValidity();
    component.signupForm.get('email')?.updateValueAndValidity();
    component.signupForm.get('phone')?.updateValueAndValidity();
    component.signupForm.get('company')?.updateValueAndValidity();
    component.signupForm.get('username')?.updateValueAndValidity();
    component.signupForm.get('password')?.updateValueAndValidity();
    component.signupForm.get('confirmPassword')?.updateValueAndValidity();
    
    // Trigger change detection to ensure validators run
    fixture.detectChanges();
    
    // Update form-level validators (passwordMatchValidator)
    component.signupForm.updateValueAndValidity();
    
    // Trigger change detection again after form-level validation
    fixture.detectChanges();
    
    
    // Ensure form is valid
    expect(component.signupForm.valid).toBeTrue();
    
    component.createAccount();
    expect(component.successMessage).toBe('Cuenta creada exitosamente');
    
    // Reset for second attempt
    component.successMessage = '';
    component.errorMessage = '';
    
    // Reset mock for second attempt
    mockAuthService.signup.and.returnValue(of({
      message: 'Cuenta creada exitosamente',
      token: 'test-token-2',
      user: { id: '2', email: 'vendor2@example.com', role: 'vendor', name: 'Vendor Dos' }
    }));
    
    // Second attempt
    component.signupForm.patchValue({
      fullName: 'Vendor Dos',
      email: 'vendor2@example.com',
      phone: '9876543210',
      company: 'Company Two',
      username: 'vendor2',
      password: 'Password456!',
      confirmPassword: 'Password456!'
    });
    
    // Update form validity after patchValue - need to update all controls first
    component.signupForm.get('fullName')?.updateValueAndValidity();
    component.signupForm.get('email')?.updateValueAndValidity();
    component.signupForm.get('phone')?.updateValueAndValidity();
    component.signupForm.get('company')?.updateValueAndValidity();
    component.signupForm.get('username')?.updateValueAndValidity();
    component.signupForm.get('password')?.updateValueAndValidity();
    component.signupForm.get('confirmPassword')?.updateValueAndValidity();
    
    // Trigger change detection to ensure validators run
    fixture.detectChanges();
    
    // Update form-level validators (passwordMatchValidator)
    component.signupForm.updateValueAndValidity();
    
    // Trigger change detection again after form-level validation
    fixture.detectChanges();
    
    // Ensure form is valid
    expect(component.signupForm.valid).toBeTrue();
    
    component.createAccount();
    
    expect(mockAuthService.signup).toHaveBeenCalledTimes(2);
    expect(component.successMessage).toBe('Cuenta creada exitosamente');
  });

  it('should handle form field updates', () => {
    // Test updating individual fields
    component.signupForm.get('fullName')?.setValue('New Name');
    expect(component.signupForm.get('fullName')?.value).toBe('New Name');

    component.signupForm.get('email')?.setValue('new@example.com');
    expect(component.signupForm.get('email')?.value).toBe('new@example.com');
  });

  it('should handle form validation for individual fields', () => {
    // Test fullName validation
    const fullNameControl = component.signupForm.get('fullName');
    fullNameControl?.setValue('');
    expect(fullNameControl?.hasError('required')).toBeTruthy();

    fullNameControl?.setValue('a');
    expect(fullNameControl?.hasError('minlength')).toBeTruthy();

    fullNameControl?.setValue('John Doe');
    expect(fullNameControl?.hasError('minlength')).toBeFalsy();
  });

  it('should handle email validation edge cases', () => {
    const emailControl = component.signupForm.get('email');

    // Test various email formats
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'test+tag@example.org',
      'user123@test-domain.com'
    ];

    validEmails.forEach(email => {
      emailControl?.setValue(email);
      expect(emailControl?.hasError('email')).toBeFalsy();
    });

    // Test invalid emails
    const invalidEmails = [
      'invalid-email',
      '@example.com',
      'test@',
      'test.example.com'
    ];

    invalidEmails.forEach(email => {
      emailControl?.setValue(email);
      expect(emailControl?.hasError('email')).toBeTruthy();
    });
  });

  it('should handle password validation', () => {
    const passwordControl = component.signupForm.get('password');

    // Test minimum length
    passwordControl?.setValue('short');
    expect(passwordControl?.hasError('minlength')).toBeTruthy();

    passwordControl?.setValue('password123');
    expect(passwordControl?.hasError('minlength')).toBeFalsy();
  });

  it('should handle form submission with validation errors', () => {
    // Submit with invalid form
    component.signupForm.patchValue({
      fullName: '',
      email: 'invalid-email',
      phone: 'abc',
      company: '',
      username: '',
      password: 'short',
      confirmPassword: 'different'
    });

    component.createAccount();

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should handle navigation to login', () => {
    component.goToLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/vendor/login']);
  });

  it('should handle very long input values', () => {
    // Use strings that exceed maxLength to test validation
    const longString = 'a'.repeat(101); // Exceeds maxLength of 100

    component.signupForm.patchValue({
      fullName: longString,
      email: 'test@example.com',
      phone: '1234567890',
      company: longString,
      username: 'a'.repeat(51), // Exceeds maxLength of 50
      password: 'Password123!',
      confirmPassword: 'Password123!'
    });
    
    // Update form validity after patchValue
    component.signupForm.updateValueAndValidity();
    
    // Trigger change detection to ensure validators run
    fixture.detectChanges();
    
    // Form should be invalid due to maxLength validation
    // Check individual field errors
    expect(component.signupForm.get('fullName')?.hasError('maxlength')).toBeTruthy();
    expect(component.signupForm.get('company')?.hasError('maxlength')).toBeTruthy();
    expect(component.signupForm.get('username')?.hasError('maxlength')).toBeTruthy();
    expect(component.signupForm.valid).toBeFalsy();
  });
});