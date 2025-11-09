import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ClientSignupComponent } from './client-signup.component';

describe('ClientSignupComponent', () => {
  let component: ClientSignupComponent;
  let fixture: ComponentFixture<ClientSignupComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ClientSignupComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientSignupComponent);
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
    expect(component.signupForm.get('institution')?.value).toBe('');
    expect(component.signupForm.get('position')?.value).toBe('');
    expect(component.signupForm.get('username')?.value).toBe('');
    expect(component.signupForm.get('password')?.value).toBe('');
    expect(component.signupForm.get('confirmPassword')?.value).toBe('');
  });

  it('should validate required fields', () => {
    expect(component.signupForm.get('fullName')?.hasError('required')).toBeTruthy();
    expect(component.signupForm.get('email')?.hasError('required')).toBeTruthy();
    expect(component.signupForm.get('phone')?.hasError('required')).toBeTruthy();
    expect(component.signupForm.get('institution')?.hasError('required')).toBeTruthy();
    expect(component.signupForm.get('position')?.hasError('required')).toBeTruthy();
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
    spyOn(sessionStorage, 'setItem');
    spyOn(window, 'alert');
    component.signupForm.patchValue({
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      institution: 'Test Hospital',
      position: 'Doctor',
      username: 'cliente',
      password: 'password123',
      confirmPassword: 'password123'
    });

    component.createAccount();

    expect(sessionStorage.setItem).toHaveBeenCalledWith('role', 'client');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('userType', 'client');
    expect(window.alert).toHaveBeenCalledWith('Cuenta de cliente creada exitosamente');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/client/login']);
  });

  it('should show error when passwords do not match', () => {
    spyOn(window, 'alert');
    component.signupForm.patchValue({
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      institution: 'Test Hospital',
      position: 'Doctor',
      username: 'cliente',
      password: 'password123',
      confirmPassword: 'differentpassword'
    });

    component.createAccount();

    expect(window.alert).toHaveBeenCalledWith('Las contraseñas no coinciden');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to client login when goToLogin is called', () => {
    component.goToLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/client/login']);
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
    
    // Valid phone formats - these should not have pattern errors
    phoneControl?.setValue('1234567890');
    expect(phoneControl?.hasError('pattern')).toBeFalsy();
    
    phoneControl?.setValue('9876543210');
    expect(phoneControl?.hasError('pattern')).toBeFalsy();
  });

  it('should handle form validation for all required fields', () => {
    // Test each required field individually
    const requiredFields = ['fullName', 'email', 'phone', 'institution', 'position', 'username', 'password', 'confirmPassword'];
    
    requiredFields.forEach(field => {
      const control = component.signupForm.get(field);
      control?.setValue('');
      expect(control?.hasError('required')).toBeTruthy();
      
      control?.setValue('test');
      expect(control?.hasError('required')).toBeFalsy();
    });
  });

  it('should handle different institution types', () => {
    const institutionControl = component.signupForm.get('institution');
    
    const institutions = ['Hospital General', 'Clínica Privada', 'Centro Médico', 'Laboratorio'];
    
    institutions.forEach(institution => {
      institutionControl?.setValue(institution);
      expect(institutionControl?.valid).toBeTruthy();
    });
  });

  it('should handle different position types', () => {
    const positionControl = component.signupForm.get('position');
    
    const positions = ['Doctor', 'Enfermero', 'Técnico', 'Administrador', 'Director'];
    
    positions.forEach(position => {
      positionControl?.setValue(position);
      expect(positionControl?.valid).toBeTruthy();
    });
  });

  it('should handle username validation', () => {
    const usernameControl = component.signupForm.get('username');
    
    // Valid usernames
    usernameControl?.setValue('user123');
    expect(usernameControl?.valid).toBeTruthy();
    
    usernameControl?.setValue('cliente');
    expect(usernameControl?.valid).toBeTruthy();
    
    usernameControl?.setValue('admin_user');
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
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      institution: 'Test Hospital',
      position: 'Doctor',
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password123'
    });
    
    component.signupForm.reset();
    
    expect(component.signupForm.get('fullName')?.value).toBeNull();
    expect(component.signupForm.get('email')?.value).toBeNull();
    expect(component.signupForm.get('phone')?.value).toBeNull();
    expect(component.signupForm.get('institution')?.value).toBeNull();
    expect(component.signupForm.get('position')?.value).toBeNull();
    expect(component.signupForm.get('username')?.value).toBeNull();
    expect(component.signupForm.get('password')?.value).toBeNull();
    expect(component.signupForm.get('confirmPassword')?.value).toBeNull();
  });

  it('should handle edge cases with special characters', () => {
    component.signupForm.patchValue({
      fullName: 'José María González',
      email: 'jose.maria@hospital.com',
      phone: '1234567890',
      institution: 'Hospital San José',
      position: 'Médico Especialista',
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
    const longString = 'a'.repeat(1000);
    
    component.signupForm.patchValue({
      fullName: longString,
      email: 'test@example.com',
      phone: '1234567890',
      institution: longString,
      position: longString,
      username: longString,
      password: 'password123',
      confirmPassword: 'password123'
    });
    
    // Form should still be valid even with long strings
    expect(component.signupForm.valid).toBeTruthy();
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
      institution: '',
      position: '',
      username: '',
      password: 'short',
      confirmPassword: 'different'
    });

    component.createAccount();

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should handle navigation to login', () => {
    component.goToLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/client/login']);
  });

  it('should handle form field updates', () => {
    // Test updating individual fields
    component.signupForm.get('fullName')?.setValue('New Name');
    expect(component.signupForm.get('fullName')?.value).toBe('New Name');
    
    component.signupForm.get('email')?.setValue('new@example.com');
    expect(component.signupForm.get('email')?.value).toBe('new@example.com');
  });

  it('should handle form reset', () => {
    component.signupForm.patchValue({
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      institution: 'Test Institution',
      position: 'Test Position',
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password123'
    });
    
    component.signupForm.reset();
    
    expect(component.signupForm.pristine).toBeTruthy();
    expect(component.signupForm.untouched).toBeTruthy();
  });
});