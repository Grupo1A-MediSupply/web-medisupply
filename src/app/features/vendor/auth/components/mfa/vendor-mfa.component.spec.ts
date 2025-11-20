import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { VendorMfaComponent } from './vendor-mfa.component';
import { AuthService } from '../../../../../core/services/auth.service';
import { of } from 'rxjs';

describe('VendorMfaComponent', () => {
  let component: VendorMfaComponent;
  let fixture: ComponentFixture<VendorMfaComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['verifyMFA']);

    await TestBed.configureTestingModule({
      declarations: [VendorMfaComponent],
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

    fixture = TestBed.createComponent(VendorMfaComponent);
    component = fixture.componentInstance;
    
    // Configurar sessionStorage para los tests
    spyOn(sessionStorage, 'getItem').and.returnValue('1');
    spyOn(sessionStorage, 'removeItem');
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty code value', () => {
    expect(component._form.get('code')?.value).toBe('');
  });

  it('should validate required code field', () => {
    const codeControl = component._form.get('code');
    expect(codeControl?.hasError('required')).toBeTruthy();
  });

  it('should validate minimum length for code', () => {
    const codeControl = component._form.get('code');
    codeControl?.setValue('12345');
    expect(codeControl?.hasError('minlength')).toBeTruthy();

    codeControl?.setValue('123456');
    expect(codeControl?.hasError('minlength')).toBeFalsy();
  });

  it('should validate maximum length for code', () => {
    const codeControl = component._form.get('code');
    codeControl?.setValue('1234567');
    expect(codeControl?.hasError('maxlength')).toBeTruthy();

    codeControl?.setValue('123456');
    expect(codeControl?.hasError('maxlength')).toBeFalsy();
  });

  it('should validate numeric pattern for code', () => {
    const codeControl = component._form.get('code');
    codeControl?.setValue('abc123');
    expect(codeControl?.hasError('pattern')).toBeTruthy();

    codeControl?.setValue('123456');
    expect(codeControl?.hasError('pattern')).toBeFalsy();
  });

  it('should navigate to vendor orders when code is valid', () => {
    mockAuthService.verifyMFA.and.returnValue(of({
      message: 'MFA verificado exitosamente',
      token: 'test-token',
      user: { id: '1', email: 'test@test.com', role: 'vendor', name: 'Test Vendor' }
    }));
    
    component._form.patchValue({ code: '123456' });

    component.verify();

    expect(mockAuthService.verifyMFA).toHaveBeenCalledWith('1', '123456');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/vendor/orders']);
  });

  it('should not navigate when form is invalid', () => {
    component._form.patchValue({ code: '123' }); // Invalid code
    spyOn(component._form, 'markAllAsTouched');

    component.verify();

    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(component._form.markAllAsTouched).toHaveBeenCalled();
  });

  it('should handle form field updates', () => {
    // Test updating the code field
    component._form.get('code')?.setValue('123456');
    expect(component._form.get('code')?.value).toBe('123456');
  });

  it('should handle form validation for different code lengths', () => {
    const codeControl = component._form.get('code');

    // Test various code lengths
    const testCases = [
      { code: '1', expected: true }, // Too short
      { code: '12', expected: true }, // Too short
      { code: '123', expected: true }, // Too short
      { code: '1234', expected: true }, // Too short
      { code: '12345', expected: true }, // Too short
      { code: '123456', expected: false }, // Valid
      { code: '1234567', expected: true }, // Too long
      { code: '12345678', expected: true }, // Too long
    ];

    testCases.forEach(({ code, expected }) => {
      codeControl?.setValue(code);
      expect(codeControl?.hasError('minlength') || codeControl?.hasError('maxlength')).toBe(expected);
    });
  });

  it('should handle form state changes', () => {
    expect(component._form.pristine).toBeTruthy();
    expect(component._form.untouched).toBeTruthy();

    // Simulate user input by setting value and marking as touched
    component._form.get('code')?.setValue('123456');
    component._form.get('code')?.markAsTouched();
    component._form.get('code')?.markAsDirty();
    fixture.detectChanges();

    // Form should be dirty after patching value
    expect(component._form.dirty).toBeTruthy();
  });

  it('should handle form reset functionality', () => {
    component._form.patchValue({ code: '123456' });
    component._form.reset();

    expect(component._form.pristine).toBeTruthy();
    expect(component._form.untouched).toBeTruthy();
  });

  it('should handle multiple MFA attempts', () => {
    mockAuthService.verifyMFA.and.returnValue(of({
      message: 'MFA verificado exitosamente',
      token: 'test-token',
      user: { id: '1', email: 'test@test.com', role: 'vendor', name: 'Test Vendor' }
    }));
    
    // First attempt with valid code
    component._form.patchValue({ code: '000000' });
    component.verify();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/vendor/orders']);

    // Second attempt with valid code
    (mockRouter.navigate as jasmine.Spy).calls.reset();
    component._form.patchValue({ code: '123456' });
    component.verify();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/vendor/orders']);
  });

  it('should handle form validation edge cases', () => {
    // Test with empty code
    component._form.patchValue({ code: '' });
    expect(component._form.invalid).toBeTruthy();

    // Test with whitespace only
    component._form.patchValue({ code: '   ' });
    expect(component._form.invalid).toBeTruthy();

    // Test with valid code
    component._form.patchValue({ code: '123456' });
    expect(component._form.valid).toBeTruthy();
  });
});