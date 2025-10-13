import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ChangePasswordComponent } from './change-password.component';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ChangePasswordComponent],
      imports: [ReactiveFormsModule, MatIconModule],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.changePasswordForm.get('newPassword')?.value).toBe('');
    expect(component.changePasswordForm.get('confirmPassword')?.value).toBe('');
  });

  it('should validate required fields', () => {
    expect(component.changePasswordForm.get('newPassword')?.hasError('required')).toBeTruthy();
    expect(component.changePasswordForm.get('confirmPassword')?.hasError('required')).toBeTruthy();
  });

  it('should validate minimum length for new password', () => {
    const newPasswordControl = component.changePasswordForm.get('newPassword');
    newPasswordControl?.setValue('1234567');
    expect(newPasswordControl?.hasError('minlength')).toBeTruthy();

    newPasswordControl?.setValue('12345678');
    expect(newPasswordControl?.hasError('minlength')).toBeFalsy();
  });

  it('should change password successfully when passwords match', () => {
    spyOn(window, 'alert');
    component.changePasswordForm.patchValue({
      newPassword: 'newpassword123',
      confirmPassword: 'newpassword123'
    });

    component.changePassword();

    expect(window.alert).toHaveBeenCalledWith('Contraseña cambiada exitosamente');
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should show error when passwords do not match', () => {
    spyOn(window, 'alert');
    component.changePasswordForm.patchValue({
      newPassword: 'newpassword123',
      confirmPassword: 'differentpassword'
    });

    component.changePassword();

    expect(window.alert).toHaveBeenCalledWith('Las contraseñas no coinciden');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should not proceed when form is invalid', () => {
    spyOn(window, 'alert');
    component.changePasswordForm.patchValue({
      newPassword: '123', // Too short
      confirmPassword: '123'
    });

    component.changePassword();

    expect(window.alert).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to login when goToLogin is called', () => {
    component.goToLogin();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should accept valid password with 8 or more characters', () => {
    const newPasswordControl = component.changePasswordForm.get('newPassword');
    newPasswordControl?.setValue('password123');
    
    expect(newPasswordControl?.valid).toBeTruthy();
    expect(newPasswordControl?.hasError('required')).toBeFalsy();
    expect(newPasswordControl?.hasError('minlength')).toBeFalsy();
  });

  it('should handle empty confirm password', () => {
    const confirmPasswordControl = component.changePasswordForm.get('confirmPassword');
    confirmPasswordControl?.setValue('');
    
    expect(confirmPasswordControl?.hasError('required')).toBeTruthy();
  });

  it('should validate form as invalid when new password is too short', () => {
    component.changePasswordForm.patchValue({
      newPassword: '1234567', // 7 characters, less than required 8
      confirmPassword: '1234567'
    });

    expect(component.changePasswordForm.valid).toBeFalsy();
  });

  it('should validate form as valid when both passwords meet requirements', () => {
    component.changePasswordForm.patchValue({
      newPassword: 'password123',
      confirmPassword: 'password123'
    });

    expect(component.changePasswordForm.valid).toBeTruthy();
  });
});
