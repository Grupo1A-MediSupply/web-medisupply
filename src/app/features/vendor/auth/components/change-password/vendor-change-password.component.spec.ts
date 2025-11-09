import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { VendorChangePasswordComponent } from './vendor-change-password.component';

describe('VendorChangePasswordComponent', () => {
  let component: VendorChangePasswordComponent;
  let fixture: ComponentFixture<VendorChangePasswordComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [VendorChangePasswordComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(VendorChangePasswordComponent);
    component = fixture.componentInstance;
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

  it('should validate minimum length for passwords', () => {
    const newPasswordControl = component.changePasswordForm.get('newPassword');
    newPasswordControl?.setValue('123');
    expect(newPasswordControl?.hasError('minlength')).toBeTruthy();

    newPasswordControl?.setValue('12345678');
    expect(newPasswordControl?.hasError('minlength')).toBeFalsy();
  });

  it('should change password successfully with matching passwords', () => {
    spyOn(window, 'alert');
    component.changePasswordForm.patchValue({
      newPassword: 'newpassword123',
      confirmPassword: 'newpassword123'
    });

    component.changePassword();

    expect(window.alert).toHaveBeenCalledWith('Contraseña cambiada exitosamente');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/vendor/login']);
  });

  it('should show error when new passwords do not match', () => {
    spyOn(window, 'alert');
    component.changePasswordForm.patchValue({
      newPassword: 'newpassword123',
      confirmPassword: 'differentpassword'
    });

    component.changePassword();

    expect(window.alert).toHaveBeenCalledWith('Las contraseñas no coinciden');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to vendor login when goToLogin is called', () => {
    component.goToLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/vendor/login']);
  });

  it('should handle form field updates', () => {
    // Test updating individual fields
    component.changePasswordForm.get('newPassword')?.setValue('newpass123');
    expect(component.changePasswordForm.get('newPassword')?.value).toBe('newpass123');

    component.changePasswordForm.get('confirmPassword')?.setValue('newpass123');
    expect(component.changePasswordForm.get('confirmPassword')?.value).toBe('newpass123');
  });

  it('should handle form validation for different password lengths', () => {
    const newPasswordControl = component.changePasswordForm.get('newPassword');

    // Test various password lengths
    const testCases = [
      { password: '1', expected: true }, // Too short
      { password: '12', expected: true }, // Too short
      { password: '123', expected: true }, // Too short
      { password: '1234', expected: true }, // Too short
      { password: '12345', expected: true }, // Too short
      { password: '123456', expected: true }, // Too short
      { password: '1234567', expected: true }, // Too short
      { password: '12345678', expected: false }, // Valid
      { password: '123456789', expected: false }, // Valid
    ];

    testCases.forEach(({ password, expected }) => {
      newPasswordControl?.setValue(password);
      expect(newPasswordControl?.hasError('minlength')).toBe(expected);
    });
  });

  it('should handle form state changes', () => {
    expect(component.changePasswordForm.pristine).toBeTruthy();
    expect(component.changePasswordForm.untouched).toBeTruthy();

    // Simulate user input by setting value and marking as touched
    component.changePasswordForm.get('newPassword')?.setValue('newpass123');
    component.changePasswordForm.get('newPassword')?.markAsTouched();
    component.changePasswordForm.get('newPassword')?.markAsDirty();
    fixture.detectChanges();

    expect(component.changePasswordForm.dirty).toBeTruthy();
  });

  it('should handle multiple password change attempts', () => {
    spyOn(window, 'alert');

    // First attempt with matching passwords
    component.changePasswordForm.patchValue({
      newPassword: 'newpass123',
      confirmPassword: 'newpass123'
    });
    component.changePassword();
    expect(window.alert).toHaveBeenCalledWith('Contraseña cambiada exitosamente');

    // Second attempt with non-matching passwords
    (window.alert as jasmine.Spy).calls.reset();
    component.changePasswordForm.patchValue({
      newPassword: 'password123',
      confirmPassword: 'different123'
    });
    component.changePassword();
    expect(window.alert).toHaveBeenCalledWith('Las contraseñas no coinciden');
  });

  it('should handle form validation edge cases', () => {
    // Test with empty passwords
    component.changePasswordForm.patchValue({
      newPassword: '',
      confirmPassword: ''
    });
    expect(component.changePasswordForm.invalid).toBeTruthy();

    // Test with only one password field filled
    component.changePasswordForm.patchValue({
      newPassword: 'password123',
      confirmPassword: ''
    });
    expect(component.changePasswordForm.invalid).toBeTruthy();

    // Test with whitespace only
    component.changePasswordForm.patchValue({
      newPassword: '   ',
      confirmPassword: '   '
    });
    expect(component.changePasswordForm.invalid).toBeTruthy();
  });
});