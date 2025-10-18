import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VendorSignupComponent } from './vendor-signup.component';

describe('VendorSignupComponent', () => {
  let component: VendorSignupComponent;
  let fixture: ComponentFixture<VendorSignupComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [VendorSignupComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
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
    spyOn(sessionStorage, 'setItem');
    spyOn(window, 'alert');
    component.signupForm.patchValue({
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      company: 'Test Company',
      username: 'vendedor',
      password: 'password123',
      confirmPassword: 'password123'
    });

    component.createAccount();

    expect(sessionStorage.setItem).toHaveBeenCalledWith('role', 'vendor');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('userType', 'vendor');
    expect(window.alert).toHaveBeenCalledWith('Cuenta de vendedor creada exitosamente');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/vendor/login']);
  });

  it('should show error when passwords do not match', () => {
    spyOn(window, 'alert');
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

    expect(window.alert).toHaveBeenCalledWith('Las contraseñas no coinciden');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to vendor login when goToLogin is called', () => {
    component.goToLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/vendor/login']);
  });
});