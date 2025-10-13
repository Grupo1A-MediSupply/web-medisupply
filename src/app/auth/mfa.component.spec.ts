import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MfaComponent } from './mfa.component';

describe('MfaComponent', () => {
  let component: MfaComponent;
  let fixture: ComponentFixture<MfaComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [MfaComponent],
      imports: [ReactiveFormsModule, MatIconModule],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MfaComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
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

  it('should navigate to vendor dashboard when role is vendor', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('vendor');
    component._form.patchValue({ code: '123456' });

    component.verify();

    expect(router.navigate).toHaveBeenCalledWith(['/vendor']);
  });

  it('should navigate to client dashboard when role is client', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('client');
    component._form.patchValue({ code: '123456' });

    component.verify();

    expect(router.navigate).toHaveBeenCalledWith(['/client']);
  });

  it('should default to client role when no role is stored', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue(null);
    component._form.patchValue({ code: '123456' });

    component.verify();

    expect(router.navigate).toHaveBeenCalledWith(['/client']);
  });

  it('should not navigate when form is invalid', () => {
    component._form.patchValue({ code: '123' }); // Invalid code
    spyOn(component._form, 'markAllAsTouched');

    component.verify();

    expect(router.navigate).not.toHaveBeenCalled();
    expect(component._form.markAllAsTouched).toHaveBeenCalled();
  });

  it('should accept valid 6-digit numeric code', () => {
    const codeControl = component._form.get('code');
    codeControl?.setValue('123456');
    
    expect(codeControl?.valid).toBeTruthy();
    expect(codeControl?.hasError('required')).toBeFalsy();
    expect(codeControl?.hasError('minlength')).toBeFalsy();
    expect(codeControl?.hasError('maxlength')).toBeFalsy();
    expect(codeControl?.hasError('pattern')).toBeFalsy();
  });

  it('should reject non-numeric characters', () => {
    const codeControl = component._form.get('code');
    codeControl?.setValue('12a456');
    
    expect(codeControl?.hasError('pattern')).toBeTruthy();
  });

  it('should reject codes with less than 6 digits', () => {
    const codeControl = component._form.get('code');
    codeControl?.setValue('12345');
    
    expect(codeControl?.hasError('minlength')).toBeTruthy();
  });

  it('should reject codes with more than 6 digits', () => {
    const codeControl = component._form.get('code');
    codeControl?.setValue('1234567');
    
    expect(codeControl?.hasError('maxlength')).toBeTruthy();
  });
});
