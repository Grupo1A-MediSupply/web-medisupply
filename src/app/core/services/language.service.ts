import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<string>('es');
  public currentLanguage$: Observable<string> = this.currentLanguageSubject.asObservable();

  private readonly STORAGE_KEY = 'medisupply_language';
  private readonly SUPPORTED_LANGUAGES = ['es', 'en'];

  constructor(private translate: TranslateService) {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    // Get saved language from localStorage or use browser language
    const savedLanguage = localStorage.getItem(this.STORAGE_KEY);
    const browserLanguage = navigator.language.split('-')[0];
    
    let languageToUse = 'es'; // Default to Spanish
    
    if (savedLanguage && this.SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      languageToUse = savedLanguage;
    } else if (this.SUPPORTED_LANGUAGES.includes(browserLanguage)) {
      languageToUse = browserLanguage;
    }

    this.setLanguage(languageToUse);
  }

  setLanguage(lang: string): void {
    if (this.SUPPORTED_LANGUAGES.includes(lang)) {
      this.translate.use(lang);
      this.currentLanguageSubject.next(lang);
      localStorage.setItem(this.STORAGE_KEY, lang);
    }
  }

  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  getSupportedLanguages(): string[] {
    return this.SUPPORTED_LANGUAGES;
  }

  getLanguageName(lang: string): string {
    const names: { [key: string]: string } = {
      'es': 'Español',
      'en': 'English'
    };
    return names[lang] || lang;
  }
}

