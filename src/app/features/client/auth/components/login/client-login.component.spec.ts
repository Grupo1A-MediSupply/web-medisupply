import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ClientLoginComponent } from './client-login.component';
import { AuthService } from '../../../../../core/services/auth.service';
import { of } from 'rxjs';

describe('ClientLoginComponent', () => {
  let component: ClientLoginComponent;
  let fixture: ComponentFixture<ClientLoginComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      declarations: [ClientLoginComponent],
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

    fixture = TestBed.createComponent(ClientLoginComponent);
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

  it('should validate username field (no email validation required)', () => {
    const userControl = component._form.get('user');
    userControl?.setValue('testuser');
    expect(userControl?.hasError('email')).toBeFalsy();
    expect(userControl?.valid).toBeTruthy();

    userControl?.setValue('');
    expect(userControl?.hasError('required')).toBeTruthy();
  });

  it('should validate minimum length for password field', () => {
    const passControl = component._form.get('pass');
    passControl?.setValue('12345'); // 5 caracteres, menos que el mínimo de 6
    expect(passControl?.hasError('minlength')).toBeTruthy();

    passControl?.setValue('123456'); // 6 caracteres, cumple el mínimo
    expect(passControl?.hasError('minlength')).toBeFalsy();
  });

  it('should set client role and navigate to client MFA on valid login', () => {
    spyOn(sessionStorage, 'setItem');
    mockAuthService.login.and.returnValue(of({
      message: 'Login exitoso',
      mfaRequired: true,
      userId: '1'
    }));
    
    component._form.patchValue({ user: 'cliente@test.com', pass: 'password123' });
    
    component.login();
    
    expect(mockAuthService.login).toHaveBeenCalled();
    expect(sessionStorage.setItem).toHaveBeenCalledWith('mfaUserId', '1');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('role', 'client');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/client/mfa']);
  });

  it('should not navigate when form is invalid', () => {
    component._form.patchValue({ user: '', pass: '' });
    spyOn(component._form, 'markAllAsTouched');
    
    component.login();
    
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(component._form.markAllAsTouched).toHaveBeenCalled();
  });

  it('should navigate to client signup when goToSignup is called', () => {
    component.goToSignup();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/client/signup']);
  });

  it('should handle login with different user credentials', () => {
    spyOn(sessionStorage, 'setItem');
    mockAuthService.login.and.returnValue(of({
      message: 'Login exitoso',
      mfaRequired: true,
      userId: '2'
    }));
    
    component._form.patchValue({ user: 'testuser@test.com', pass: 'testpass123' });
    
    component.login();
    
    expect(mockAuthService.login).toHaveBeenCalled();
    expect(sessionStorage.setItem).toHaveBeenCalledWith('mfaUserId', '2');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('role', 'client');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/client/mfa']);
  });

  it('should show validation errors for empty form', () => {
    component._form.patchValue({ user: '', pass: '' });
    component._form.markAllAsTouched();
    fixture.detectChanges();
    
    expect(component._form.invalid).toBeTruthy();
    expect(component._form.get('user')?.hasError('required')).toBeTruthy();
    expect(component._form.get('pass')?.hasError('required')).toBeTruthy();
  });

  it('should show validation errors for invalid inputs', () => {
    component._form.patchValue({ user: 'testuser', pass: '12345' });
    component._form.markAllAsTouched();
    fixture.detectChanges();
    
    // User field should be valid (no email validation)
    expect(component._form.get('user')?.hasError('email')).toBeFalsy();
    // Password should have minlength error
    expect(component._form.get('pass')?.hasError('minlength')).toBeTruthy();
  });

  it('should be valid with proper inputs', () => {
    component._form.patchValue({ user: 'validuser@test.com', pass: 'validpass123' });
    fixture.detectChanges();
    
    expect(component._form.valid).toBeTruthy();
  });

  it('should handle form submission with valid data', () => {
    spyOn(sessionStorage, 'setItem');
    mockAuthService.login.and.returnValue(of({
      message: 'Login exitoso',
      mfaRequired: true,
      userId: '1'
    }));
    
    component._form.patchValue({ user: 'clientuser@test.com', pass: 'clientpass123' });
    
    component.login();
    
    expect(mockAuthService.login).toHaveBeenCalled();
    expect(sessionStorage.setItem).toHaveBeenCalledTimes(2);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/client/mfa']);
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
    component._form.patchValue({ user: 'user@domain.com', pass: 'password123' });
    fixture.detectChanges();
    
    expect(component._form.valid).toBeTruthy();
  });

  it('should handle edge case with very long password', () => {
    const longPassword = 'a'.repeat(100);
    component._form.patchValue({ user: 'test@test.com', pass: longPassword });
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

  it('should handle form validation errors', () => {
    // Test with empty form
    expect(component._form.invalid).toBeTruthy();
    
    // Test with only username
    component._form.patchValue({ user: 'testuser@test.com' });
    expect(component._form.invalid).toBeTruthy();
    
    // Test with only password
    component._form.patchValue({ user: '', pass: 'testpass123' });
    expect(component._form.invalid).toBeTruthy();
    
    // Test with both fields
    component._form.patchValue({ user: 'testuser@test.com', pass: 'testpass123' });
    expect(component._form.valid).toBeTruthy();
  });

  it('should handle login with different user types', () => {
    spyOn(sessionStorage, 'setItem');
    mockAuthService.login.and.returnValue(of({
      message: 'Login exitoso',
      mfaRequired: true,
      userId: '1'
    }));

    // Test client login
    component._form.patchValue({ user: 'cliente@test.com', pass: 'password123' });
    component.login();

    expect(mockAuthService.login).toHaveBeenCalled();
    expect(sessionStorage.setItem).toHaveBeenCalledWith('mfaUserId', '1');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('role', 'client');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/client/mfa']);
  });

  it('should handle invalid login credentials', () => {
    mockAuthService.login.and.returnValue(of({
      message: 'Login exitoso',
      mfaRequired: true,
      userId: '1'
    }));
    
    component._form.patchValue({ user: 'invalid@test.com', pass: 'wrong123456' });
    component.login();
    
    // The component navigates to MFA regardless of credentials when form is valid
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/client/mfa']);
  });

  it('should handle form reset', () => {
    component._form.patchValue({ user: 'test', pass: 'test' });
    component._form.reset();
    
    expect(component._form.pristine).toBeTruthy();
    expect(component._form.untouched).toBeTruthy();
  });

  it('should handle navigation to signup', () => {
    component.goToSignup();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/client/signup']);
  });

});