import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
      ]
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
});