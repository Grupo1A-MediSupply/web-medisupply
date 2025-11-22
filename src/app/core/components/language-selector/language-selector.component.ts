import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-selector',
  template: `
    <div class="language-selector">
      <mat-icon class="language-icon">language</mat-icon>
      <select 
        [value]="currentLanguage" 
        (change)="changeLanguage($event)"
        class="language-dropdown"
        [matTooltip]="tooltipText">
        <option *ngFor="let lang of languages" [value]="lang">
          {{ getLanguageName(lang) }}
        </option>
      </select>
    </div>
  `,
  styles: [`
    .language-selector {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-right: 12px;
      position: relative;
    }

    .language-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: var(--text-primary);
    }

    .language-dropdown {
      padding: 8px 32px 8px 12px;
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
      background: transparent;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 8px center;
      background-size: 12px;
      transition: all 0.3s ease;
      min-width: 120px;
    }

    .language-dropdown:hover {
      border-color: var(--primary-color);
      background-color: rgba(25, 118, 210, 0.05);
    }

    .language-dropdown:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
    }

    .language-dropdown option {
      padding: 8px 12px;
      background: white;
      color: var(--text-primary);
    }

    /* Estilos para cliente */
    .client-dashboard .language-dropdown:hover {
      border-color: var(--client-primary);
      background-color: rgba(76, 175, 80, 0.05);
    }

    .client-dashboard .language-dropdown:focus {
      border-color: var(--client-primary);
      box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
    }

    @media (max-width: 768px) {
      .language-selector {
        gap: 4px;
      }

      .language-dropdown {
        min-width: 100px;
        padding: 6px 28px 6px 8px;
        font-size: 12px;
      }

      .language-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }
  `]
})
export class LanguageSelectorComponent implements OnInit {
  languages: string[] = [];
  currentLanguage: string = 'es';
  tooltipText: string = 'Idioma';

  constructor(
    private languageService: LanguageService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.languages = this.languageService.getSupportedLanguages();
    this.currentLanguage = this.languageService.getCurrentLanguage();
    
    // Update tooltip text
    this.translate.get('common.language').subscribe(text => {
      this.tooltipText = text;
      this.cdr.detectChanges();
    });
    
    // Subscribe to language changes
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
      this.cdr.detectChanges();
    });
  }

  changeLanguage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const lang = target.value;
    
    if (lang && lang !== this.currentLanguage) {
      console.log('Changing language to:', lang);
      this.languageService.setLanguage(lang);
      this.currentLanguage = lang;
      this.cdr.detectChanges();
      
      // Update tooltip after language change
      this.translate.get('common.language').subscribe(text => {
        this.tooltipText = text;
        this.cdr.detectChanges();
      });
    }
  }

  getLanguageName(lang: string): string {
    return this.languageService.getLanguageName(lang);
  }
}
