import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-admin-lang-picker',
  templateUrl: './admin-lang-picker.component.html',
  styleUrls: ['./admin-lang-picker.component.scss']
})
export class AdminLangPickerComponent {
  @Input() activeLang: string = 'de';
  @Input() showLabel: boolean = true;
  @Output() langChange = new EventEmitter<string>();

  isOpen = false;

  langs = [
    { code: 'de', label: 'Deutsch (DE)', flagFile: 'de.svg' },
    { code: 'it', label: 'Italiano (IT)', flagFile: 'it.svg' },
    { code: 'fr', label: 'Français (FR)', flagFile: 'fr.svg' },
    { code: 'en', label: 'English (EN)', flagFile: 'gb.svg' },
  ];

  constructor(private elRef: ElementRef) {}

  get current() {
    return this.langs.find(l => l.code === this.activeLang) || this.langs[0];
  }

  select(code: string, event: MouseEvent): void {
    event.stopPropagation();
    this.langChange.emit(code);
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
