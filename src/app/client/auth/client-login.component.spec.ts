import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientLoginComponent } from './client-login.component';

describe('ClientLoginComponent', () => {
  let component: ClientLoginComponent;
  let fixture: ComponentFixture<ClientLoginComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ClientLoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
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
    
    component.login();
    
    expect(sessionStorage.setItem).toHaveBeenCalledWith('role', 'client');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('userType', 'client');
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
});