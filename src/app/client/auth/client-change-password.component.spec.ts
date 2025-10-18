import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientChangePasswordComponent } from './client-change-password.component';

describe('ClientChangePasswordComponent', () => {
  let component: ClientChangePasswordComponent;
  let fixture: ComponentFixture<ClientChangePasswordComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ClientChangePasswordComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientChangePasswordComponent);
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
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/client/login']);
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

  it('should navigate to client login when goToLogin is called', () => {
    component.goToLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/client/login']);
  });
});