import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ClientMfaComponent } from './client-mfa.component';

describe('ClientMfaComponent', () => {
  let component: ClientMfaComponent;
  let fixture: ComponentFixture<ClientMfaComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ClientMfaComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientMfaComponent);
    component = fixture.componentInstance;
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

  it('should navigate to client create-order when code is valid', () => {
    component._form.patchValue({ code: '123456' });

    component.verify();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/client/create-order']);
  });

  it('should not navigate when form is invalid', () => {
    component._form.patchValue({ code: '123' }); // Invalid code
    spyOn(component._form, 'markAllAsTouched');

    component.verify();

    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(component._form.markAllAsTouched).toHaveBeenCalled();
  });

  it('should handle different valid MFA codes', () => {
    const validCodes = ['123456', '654321', '111111', '999999'];
    
    validCodes.forEach(code => {
      component._form.patchValue({ code });
      component.verify();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/client/create-order']);
    });
  });

  it('should handle invalid MFA code formats', () => {
    const invalidCodes = ['12345', '1234567', 'abc123', '12345a', '123-456'];
    
    invalidCodes.forEach(code => {
      component._form.patchValue({ code });
      component.verify();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  it('should handle empty code submission', () => {
    component._form.patchValue({ code: '' });
    spyOn(component._form, 'markAllAsTouched');
    
    component.verify();
    
    expect(component._form.markAllAsTouched).toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should handle whitespace in code', () => {
    component._form.patchValue({ code: ' 123456 ' });
    spyOn(component._form, 'markAllAsTouched');
    
    component.verify();
    
    expect(component._form.markAllAsTouched).toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
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

  it('should handle form reset', () => {
    component._form.patchValue({ code: '123456' });
    component._form.reset();
    
    expect(component._form.get('code')?.value).toBeNull();
  });

  it('should handle edge cases with special characters', () => {
    const specialCodes = ['!@#$%^', '123-456', '123.456', '123/456'];
    
    specialCodes.forEach(code => {
      component._form.patchValue({ code });
      component.verify();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  it('should handle very long code inputs', () => {
    const longCode = '1'.repeat(100);
    component._form.patchValue({ code: longCode });
    spyOn(component._form, 'markAllAsTouched');
    
    component.verify();
    
    expect(component._form.markAllAsTouched).toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should handle multiple verification attempts', () => {
    // First attempt with invalid code
    component._form.patchValue({ code: '123' });
    component.verify();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    
    // Second attempt with valid code
    component._form.patchValue({ code: '123456' });
    component.verify();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/client/create-order']);
  });

  it('should handle form validation for all code lengths', () => {
    const codeControl = component._form.get('code');
    
    // Test minimum length
    codeControl?.setValue('12345');
    expect(codeControl?.hasError('minlength')).toBeTruthy();
    
    // Test exact minimum length
    codeControl?.setValue('123456');
    expect(codeControl?.hasError('minlength')).toBeFalsy();
    
    // Test maximum length
    codeControl?.setValue('1234567');
    expect(codeControl?.hasError('maxlength')).toBeTruthy();
    
    // Test exact maximum length
    codeControl?.setValue('123456');
    expect(codeControl?.hasError('maxlength')).toBeFalsy();
  });

  it('should handle numeric pattern validation thoroughly', () => {
    const codeControl = component._form.get('code');
    
    // Test with letters
    codeControl?.setValue('abc123');
    expect(codeControl?.hasError('pattern')).toBeTruthy();
    
    // Test with mixed characters
    codeControl?.setValue('123a456');
    expect(codeControl?.hasError('pattern')).toBeTruthy();
    
    // Test with symbols
    codeControl?.setValue('123-456');
    expect(codeControl?.hasError('pattern')).toBeTruthy();
    
    // Test with valid numeric code
    codeControl?.setValue('123456');
    expect(codeControl?.hasError('pattern')).toBeFalsy();
  });

  it('should handle component lifecycle events', () => {
    // Test component creation
    expect(component).toBeTruthy();
    
    // Test component initialization
    fixture.detectChanges();
    expect(component._form).toBeDefined();
    
    // Test component state after changes
    component._form.patchValue({ code: '123456' });
    fixture.detectChanges();
    expect(component._form.get('code')?.value).toBe('123456');
  });

  it('should handle form submission with valid data', () => {
    component._form.patchValue({ code: '123456' });
    
    component.verify();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/client/create-order']);
  });

  it('should handle form submission with invalid data', () => {
    spyOn(component._form, 'markAllAsTouched');
    component._form.patchValue({ code: '123' });
    
    component.verify();
    
    expect(component._form.markAllAsTouched).toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});