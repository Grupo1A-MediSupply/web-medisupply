import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
      ]
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
});