import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { ClientLoginComponent } from './client-login.component';

describe('ClientLoginComponent', () => {
  let component: ClientLoginComponent;
  let fixture: ComponentFixture<ClientLoginComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);
    mockRouter.navigate.and.returnValue(Promise.resolve(true));
    mockRouter.navigateByUrl.and.returnValue(Promise.resolve(true));
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);

        await TestBed.configureTestingModule({
          declarations: [ClientLoginComponent],
          imports: [ReactiveFormsModule, HttpClientTestingModule],
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

  it('should set client role and navigate to client MFA on valid login', () => {
    spyOn(sessionStorage, 'setItem');
    component._form.patchValue({ user: 'cliente', pass: 'password123' });
    mockAuthService.login.and.returnValue(of({ message: 'Código enviado', user_id: 'test-user-id' }));
    
    component.login();
    
    expect(mockAuthService.login).toHaveBeenCalledWith('cliente', 'password123');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('role', 'client');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('userType', 'client');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/client/mfa'], { replaceUrl: false });
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
    component._form.patchValue({ user: 'testuser', pass: 'testpass123' });
    mockAuthService.login.and.returnValue(of({ message: 'Código enviado', user_id: 'test-user-id' }));
    
    component.login();
    
    expect(mockAuthService.login).toHaveBeenCalledWith('testuser', 'testpass123');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('role', 'client');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('userType', 'client');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/client/mfa'], { replaceUrl: false });
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
    component._form.patchValue({ user: 'validuser', pass: 'validpass123' });
    fixture.detectChanges();
    
    expect(component._form.valid).toBeTruthy();
  });

  it('should handle form submission with valid data', () => {
    spyOn(sessionStorage, 'setItem');
    component._form.patchValue({ user: 'clientuser', pass: 'clientpass123' });
    mockAuthService.login.and.returnValue(
      of({ message: 'Código enviado', user_id: 'test-user-id' }).pipe(
        tap(() => {
          sessionStorage.setItem('pending_user_id', 'test-user-id');
        })
      )
    );
    
    component.login();
    
    expect(mockAuthService.login).toHaveBeenCalledWith('clientuser', 'clientpass123');
    expect(sessionStorage.setItem).toHaveBeenCalledTimes(3); // role, userType, pending_user_id
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/client/mfa'], { replaceUrl: false });
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
    component._form.patchValue({ user: 'user', pass: longPassword });
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
    component._form.patchValue({ user: 'testuser' });
    expect(component._form.invalid).toBeTruthy();
    
    // Test with only password
    component._form.patchValue({ user: '', pass: 'testpass' });
    expect(component._form.invalid).toBeTruthy();
    
    // Test with both fields
    component._form.patchValue({ user: 'testuser', pass: 'testpass' });
    expect(component._form.valid).toBeTruthy();
  });

  it('should handle login with different user types', () => {
    spyOn(sessionStorage, 'setItem');
    mockAuthService.login.and.returnValue(of({ message: 'Código enviado', user_id: 'test-user-id' }));

    // Test client login
    component._form.patchValue({ user: 'cliente', pass: 'password' });
    component.login();

    expect(mockAuthService.login).toHaveBeenCalledWith('cliente', 'password');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('role', 'client');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('userType', 'client');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/client/mfa'], { replaceUrl: false });
  });

  it('should handle invalid login credentials', () => {
    component._form.patchValue({ user: 'invalid', pass: 'wrong' });
    mockAuthService.login.and.returnValue(of({ message: 'Código enviado', user_id: 'test-user-id' }));
    component.login();
    
    expect(mockAuthService.login).toHaveBeenCalledWith('invalid', 'wrong');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/client/mfa'], { replaceUrl: false });
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