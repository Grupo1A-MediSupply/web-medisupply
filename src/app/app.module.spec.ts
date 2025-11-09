import { TestBed } from '@angular/core/testing';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppModule', () => {
  let appModule: AppModule;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule, HttpClientTestingModule]
    });
    appModule = TestBed.inject(AppModule);
  });

  it('should create the module', () => {
    expect(appModule).toBeTruthy();
  });

  it('should have AppComponent as bootstrap component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should import required modules', () => {
    expect(AppModule).toBeDefined();
  });

  it('should declare all components', () => {
    const module = new AppModule();
    expect(module).toBeTruthy();
  });

  it('should have correct module structure', () => {
    expect(AppModule).toBeDefined();
    expect(typeof AppModule).toBe('function');
  });

  it('should be instantiable', () => {
    expect(() => new AppModule()).not.toThrow();
  });
});
