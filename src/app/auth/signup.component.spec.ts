import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SignupComponent } from './signup.component';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [ReactiveFormsModule, MatIconModule],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.signupForm.get('fullName')?.value).toBe('');
    expect(component.signupForm.get('email')?.value).toBe('');
    expect(component.signupForm.get('phone')?.value).toBe('');
    expect(component.signupForm.get('username')?.value).toBe('');
    expect(component.signupForm.get('password')?.value).toBe('');
    expect(component.signupForm.get('confirmPassword')?.value).toBe('');
  });

  it('should validate required fields', () => {
    expect(component.signupForm.get('fullName')?.hasError('required')).toBeTruthy();
    expect(component.signupForm.get('email')?.hasError('required')).toBeTruthy();
    expect(component.signupForm.get('phone')?.hasError('required')).toBeTruthy();
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

    phoneControl?.setValue('+1-234-567-8900');
    expect(phoneControl?.hasError('pattern')).toBeFalsy();
  });

  it('should validate minimum length for full name', () => {
    const fullNameControl = component.signupForm.get('fullName');
    fullNameControl?.setValue('a');
    expect(fullNameControl?.hasError('minlength')).toBeTruthy();

    fullNameControl?.setValue('ab');
    expect(fullNameControl?.hasError('minlength')).toBeFalsy();
  });

  it('should validate minimum length for username', () => {
    const usernameControl = component.signupForm.get('username');
    usernameControl?.setValue('ab');
    expect(usernameControl?.hasError('minlength')).toBeTruthy();

    usernameControl?.setValue('abc');
    expect(usernameControl?.hasError('minlength')).toBeFalsy();
  });

  it('should validate minimum length for password', () => {
    const passwordControl = component.signupForm.get('password');
    passwordControl?.setValue('1234567');
    expect(passwordControl?.hasError('minlength')).toBeTruthy();

    passwordControl?.setValue('12345678');
    expect(passwordControl?.hasError('minlength')).toBeFalsy();
  });

  it('should create account successfully with matching passwords', () => {
    spyOn(sessionStorage, 'setItem');
    spyOn(window, 'alert');
    component.signupForm.patchValue({
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      username: 'vendedor',
      password: 'password123',
      confirmPassword: 'password123'
    });

    component.createAccount();

    expect(sessionStorage.setItem).toHaveBeenCalledWith('role', 'vendor');
    expect(window.alert).toHaveBeenCalledWith('Cuenta creada exitosamente');
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should set vendor role for vendedor username', () => {
    spyOn(sessionStorage, 'setItem');
    spyOn(window, 'alert');
    component.signupForm.patchValue({
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      username: 'vendedor',
      password: 'password123',
      confirmPassword: 'password123'
    });

    component.createAccount();

    expect(sessionStorage.setItem).toHaveBeenCalledWith('role', 'vendor');
  });

  it('should set client role for cliente username', () => {
    spyOn(sessionStorage, 'setItem');
    spyOn(window, 'alert');
    component.signupForm.patchValue({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      phone: '1234567890',
      username: 'cliente',
      password: 'password123',
      confirmPassword: 'password123'
    });

    component.createAccount();

    expect(sessionStorage.setItem).toHaveBeenCalledWith('role', 'client');
  });

  it('should show error when passwords do not match', () => {
    spyOn(window, 'alert');
    component.signupForm.patchValue({
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      username: 'vendedor',
      password: 'password123',
      confirmPassword: 'differentpassword'
    });

    component.createAccount();

    expect(window.alert).toHaveBeenCalledWith('Las contraseñas no coinciden');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to login when goToLogin is called', () => {
    component.goToLogin();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle case insensitive username', () => {
    spyOn(sessionStorage, 'setItem');
    spyOn(window, 'alert');
    component.signupForm.patchValue({
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      username: 'VENDEDOR',
      password: 'password123',
      confirmPassword: 'password123'
    });

    component.createAccount();

    expect(sessionStorage.setItem).toHaveBeenCalledWith('role', 'vendor');
  });
});
