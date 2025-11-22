import { TestBed } from '@angular/core/testing';
import { LanguageService } from './language.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

describe('LanguageService', () => {
  let service: LanguageService;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;
  let languageSubject: BehaviorSubject<string>;

  beforeEach(() => {
    languageSubject = new BehaviorSubject<string>('es');
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['use']);
    mockTranslateService.use.and.returnValue(languageSubject.asObservable());

    // Clear localStorage
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        LanguageService,
        { provide: TranslateService, useValue: mockTranslateService }
      ]
    });
    service = TestBed.inject(LanguageService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default language (Spanish)', () => {
    expect(service.getCurrentLanguage()).toBe('es');
  });

  it('should initialize with saved language from localStorage', () => {
    localStorage.setItem('medisupply_language', 'en');
    const newService = new LanguageService(mockTranslateService);
    expect(newService.getCurrentLanguage()).toBe('en');
  });

  it('should set language correctly', () => {
    service.setLanguage('en');
    expect(mockTranslateService.use).toHaveBeenCalledWith('en');
    expect(service.getCurrentLanguage()).toBe('en');
    expect(localStorage.getItem('medisupply_language')).toBe('en');
  });

  it('should not set unsupported language', () => {
    const initialLang = service.getCurrentLanguage();
    service.setLanguage('fr');
    expect(service.getCurrentLanguage()).toBe(initialLang);
    expect(mockTranslateService.use).not.toHaveBeenCalledWith('fr');
  });

  it('should get supported languages', () => {
    const languages = service.getSupportedLanguages();
    expect(languages).toEqual(['es', 'en']);
    expect(languages.length).toBe(2);
  });

  it('should get language name for Spanish', () => {
    expect(service.getLanguageName('es')).toBe('Español');
  });

  it('should get language name for English', () => {
    expect(service.getLanguageName('en')).toBe('English');
  });

  it('should return language code if name not found', () => {
    expect(service.getLanguageName('fr')).toBe('fr');
  });

  it('should emit language changes through observable', (done) => {
    service.currentLanguage$.subscribe(lang => {
      if (lang === 'en') {
        expect(lang).toBe('en');
        done();
      }
    });
    service.setLanguage('en');
  });

  it('should persist language in localStorage', () => {
    service.setLanguage('en');
    expect(localStorage.getItem('medisupply_language')).toBe('en');
    
    service.setLanguage('es');
    expect(localStorage.getItem('medisupply_language')).toBe('es');
  });

  it('should handle multiple language changes', () => {
    service.setLanguage('en');
    expect(service.getCurrentLanguage()).toBe('en');
    
    service.setLanguage('es');
    expect(service.getCurrentLanguage()).toBe('es');
    
    service.setLanguage('en');
    expect(service.getCurrentLanguage()).toBe('en');
  });
});

