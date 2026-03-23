import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { de } from '../i18n/de';
import { it } from '../i18n/it';
import { fr } from '../i18n/fr';
import { en } from '../i18n/en';

export type Lang = 'de' | 'it' | 'fr' | 'en';

// Build a unified lookup: key → { de, it, fr, en }
const allKeys = new Set([
  ...Object.keys(de),
  ...Object.keys(it),
  ...Object.keys(fr),
  ...Object.keys(en),
]);

const TRANSLATIONS: Record<string, Record<Lang, string>> = {};
for (const key of allKeys) {
  TRANSLATIONS[key] = {
    de: de[key] ?? key,
    it: it[key] ?? key,
    fr: fr[key] ?? key,
    en: en[key] ?? key,
  };
}

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private langSubject = new BehaviorSubject<Lang>('de');
  lang$ = this.langSubject.asObservable();

  constructor() {
    const saved = localStorage.getItem('bkp_lang') as Lang;
    if (['de', 'it', 'fr', 'en'].includes(saved)) {
      this.langSubject.next(saved);
    }
  }

  setLang(lang: Lang): void {
    this.langSubject.next(lang);
    localStorage.setItem('bkp_lang', lang);
  }

  get current(): Lang {
    return this.langSubject.value;
  }

  /**
   * Returns the localized value for `field` on `obj`.
   * DE uses the original field name (e.g. `title`).
   * IT/FR/EN use `title_it`, `title_fr`, `title_en`.
   */
  getField(obj: any, field: string): string {
    if (!obj) return '';
    const lang = this.current;
    if (lang === 'de') return obj[field] ?? '';
    return obj[`${field}_${lang}`] || obj[field] || '';
  }

  /**
   * Returns a translated static UI string by key.
   * Falls back to the key itself if not found.
   */
  t(key: string): string {
    return TRANSLATIONS[key]?.[this.current] ?? key;
  }
}
