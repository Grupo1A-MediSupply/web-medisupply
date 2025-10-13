import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, MatIconModule],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
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
    const userControl = component._form.get('user');
    const passControl = component._form.get('pass');

    expect(userControl?.hasError('required')).toBeTruthy();
    expect(passControl?.hasError('required')).toBeTruthy();
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

  it('should set vendor role for vendedor username', () => {
    spyOn(sessionStorage, 'setItem');
    component._form.patchValue({ user: 'vendedor', pass: 'password123' });
    
    component.login();
    
    expect(sessionStorage.setItem).toHaveBeenCalledWith('role', 'vendor');
    expect(router.navigate).toHaveBeenCalledWith(['/mfa']);
  });

  it('should set client role for cliente username', () => {
    spyOn(sessionStorage, 'setItem');
    component._form.patchValue({ user: 'cliente', pass: 'password123' });
    
    component.login();
    
    expect(sessionStorage.setItem).toHaveBeenCalledWith('role', 'client');
    expect(router.navigate).toHaveBeenCalledWith(['/mfa']);
  });

  it('should set vendor role as default for other usernames', () => {
    spyOn(sessionStorage, 'setItem');
    component._form.patchValue({ user: 'otheruser', pass: 'password123' });
    
    component.login();
    
    expect(sessionStorage.setItem).toHaveBeenCalledWith('role', 'vendor');
    expect(router.navigate).toHaveBeenCalledWith(['/mfa']);
  });

  it('should not navigate when form is invalid', () => {
    component._form.patchValue({ user: '', pass: '' });
    spyOn(component._form, 'markAllAsTouched');
    
    component.login();
    
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component._form.markAllAsTouched).toHaveBeenCalled();
  });

  it('should navigate to signup when goToSignup is called', () => {
    component.goToSignup();
    expect(router.navigate).toHaveBeenCalledWith(['/signup']);
  });

  it('should handle case insensitive username', () => {
    spyOn(sessionStorage, 'setItem');
    component._form.patchValue({ user: 'VENDEDOR', pass: 'password123' });
    
    component.login();
    
    expect(sessionStorage.setItem).toHaveBeenCalledWith('role', 'vendor');
  });
});
