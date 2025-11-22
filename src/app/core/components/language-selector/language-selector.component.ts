import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-selector',
  template: `
    <div class="language-selector">
      <button mat-stroked-button 
              [matMenuTriggerFor]="languageMenu" 
              class="language-btn" 
              [matTooltip]="tooltipText">
        <mat-icon>language</mat-icon>
        <span class="language-text">{{ getLanguageName(currentLanguage) }}</span>
        <mat-icon class="arrow-icon">arrow_drop_down</mat-icon>
      </button>
      <mat-menu #languageMenu="matMenu" class="language-menu" xPosition="before">
        <button mat-menu-item 
                *ngFor="let lang of languages" 
                (click)="changeLanguage(lang)"
                [class.active]="currentLanguage === lang">
          <mat-icon *ngIf="currentLanguage === lang" class="check-icon">check</mat-icon>
          <span>{{ getLanguageName(lang) }}</span>
          <span *ngIf="currentLanguage !== lang" class="spacer"></span>
        </button>
      </mat-menu>
    </div>
  `,
  styles: [`
    .language-selector {
      display: flex;
      align-items: center;
      margin-right: 12px;
    }

    .language-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text-primary);
      border-color: rgba(0, 0, 0, 0.2);
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
      min-width: 120px;
      justify-content: space-between;
    }

    .language-btn:hover {
      background: rgba(25, 118, 210, 0.08);
      border-color: var(--primary-color);
      color: var(--primary-color);
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.2);
    }

    .language-btn mat-icon:first-child {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .language-text {
      flex: 1;
      text-align: left;
      font-weight: 500;
    }

    .arrow-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      margin-left: 4px;
    }

    .language-menu {
      min-width: 180px;
      margin-top: 8px;
    }

    .language-menu button {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      font-size: 14px;
    }

    .language-menu button.active {
      background: linear-gradient(90deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%);
      color: var(--primary-color);
      font-weight: 600;
    }

    .language-menu button:not(.active):hover {
      background: rgba(0, 0, 0, 0.04);
    }

    .check-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: var(--primary-color);
    }

    .spacer {
      width: 20px;
    }

    /* Estilos para cliente */
    .client-dashboard .language-btn:hover {
      background: rgba(76, 175, 80, 0.08);
      border-color: var(--client-primary);
      color: var(--client-primary);
    }

    .client-dashboard .language-menu button.active {
      background: linear-gradient(90deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%);
      color: var(--client-primary);
    }

    .client-dashboard .check-icon {
      color: var(--client-primary);
    }

    @media (max-width: 768px) {
      .language-btn {
        min-width: 100px;
        padding: 6px 12px;
        font-size: 12px;
      }

      .language-text {
        display: none;
      }

      .language-btn mat-icon:first-child {
        margin: 0;
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
    });
    
    // Subscribe to language changes
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
      this.cdr.detectChanges();
    });
  }

  changeLanguage(lang: string): void {
    if (lang !== this.currentLanguage) {
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

