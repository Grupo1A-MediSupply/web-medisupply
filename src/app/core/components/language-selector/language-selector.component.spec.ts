import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { LanguageSelectorComponent } from './language-selector.component';
import { LanguageService } from '../../services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LanguageSelectorComponent', () => {
  let component: LanguageSelectorComponent;
  let fixture: ComponentFixture<LanguageSelectorComponent>;
  let mockLanguageService: jasmine.SpyObj<LanguageService>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;
  let languageSubject: BehaviorSubject<string>;

  beforeEach(async () => {
    languageSubject = new BehaviorSubject<string>('es');
    mockLanguageService = jasmine.createSpyObj('LanguageService', ['getSupportedLanguages', 'getCurrentLanguage', 'setLanguage', 'getLanguageName']);
    mockLanguageService.getSupportedLanguages.and.returnValue(['es', 'en']);
    mockLanguageService.getCurrentLanguage.and.returnValue('es');
    mockLanguageService.currentLanguage$ = languageSubject.asObservable();
    mockLanguageService.getLanguageName.and.callFake((lang: string) => {
      return lang === 'es' ? 'Español' : 'English';
    });

    mockTranslateService = jasmine.createSpyObj('TranslateService', ['get']);
    mockTranslateService.get.and.returnValue(of('Idioma'));

    await TestBed.configureTestingModule({
      declarations: [LanguageSelectorComponent],
      imports: [
        MatTooltipModule,
        MatIconModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: LanguageService, useValue: mockLanguageService },
        { provide: TranslateService, useValue: mockTranslateService },
        ChangeDetectorRef
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSelectorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize with current language', () => {
    fixture.detectChanges();
    expect(component.currentLanguage).toBe('es');
    expect(component.languages).toEqual(['es', 'en']);
  });

  it('should change language when select changes', () => {
    fixture.detectChanges();
    const selectElement = fixture.nativeElement.querySelector('select');
    
    selectElement.value = 'en';
    selectElement.dispatchEvent(new Event('change'));

    expect(mockLanguageService.setLanguage).toHaveBeenCalledWith('en');
    expect(component.currentLanguage).toBe('en');
  });

  it('should not change language if same language selected', () => {
    fixture.detectChanges();
    const selectElement = fixture.nativeElement.querySelector('select');
    
    selectElement.value = 'es';
    selectElement.dispatchEvent(new Event('change'));

    expect(mockLanguageService.setLanguage).not.toHaveBeenCalled();
  });

  it('should get language name', () => {
    fixture.detectChanges();
    expect(component.getLanguageName('es')).toBe('Español');
    expect(component.getLanguageName('en')).toBe('English');
  });

  it('should update tooltip text on language change', () => {
    fixture.detectChanges();
    mockTranslateService.get.and.returnValue(of('Language'));
    
    const selectElement = fixture.nativeElement.querySelector('select');
    selectElement.value = 'en';
    selectElement.dispatchEvent(new Event('change'));

    expect(mockTranslateService.get).toHaveBeenCalledWith('common.language');
  });

  it('should update current language when language service emits', () => {
    fixture.detectChanges();
    languageSubject.next('en');
    fixture.detectChanges();
    
    expect(component.currentLanguage).toBe('en');
  });
});

