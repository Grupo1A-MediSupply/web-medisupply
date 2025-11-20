import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render router-outlet', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should handle component lifecycle', () => {
    expect(() => {
      fixture.detectChanges();
    }).not.toThrow();
  });

  it('should be stable after initialization', () => {
    expect(component).toBeTruthy();
    expect(fixture.isStable()).toBeTruthy();
  });
});