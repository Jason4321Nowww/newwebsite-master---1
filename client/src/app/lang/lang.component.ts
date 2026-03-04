import { Component, ElementRef, HostListener } from '@angular/core';
import { LanguageService, Lang } from '../services/language.service';

@Component({
  selector: 'app-lang',
  templateUrl: './lang.component.html',
  styleUrls: ['./lang.component.scss']
})
export class LangComponent {
  langs: { code: Lang; label: string; flagFile: string }[] = [
    { code: 'de', label: 'Deutsch', flagFile: 'de.svg' },
    { code: 'it', label: 'Italiano', flagFile: 'it.svg' },
    { code: 'fr', label: 'Français', flagFile: 'fr.svg' },
    { code: 'en', label: 'English', flagFile: 'gb.svg' },
  ];

  isOpen = false;

  constructor(public langService: LanguageService, private elRef: ElementRef) {}

  get current() {
    return this.langs.find(l => l.code === this.langService.current)!;
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  select(lang: Lang): void {
    this.langService.setLang(lang);
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
