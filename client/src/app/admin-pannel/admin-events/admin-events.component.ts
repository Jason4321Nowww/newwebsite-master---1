import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdmineventService } from '../admin-services/adminevent.service';
import { Event } from 'src/app/_models/event';

@Component({
  selector: 'app-admin-events',
  templateUrl: './admin-events.component.html',
  styleUrls: ['./admin-events.component.scss'],
})
export class AdminEventsComponent implements OnInit, AfterViewInit {
  @ViewChild('descriptionTextarea') descriptionTextareaRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  eventForm!: FormGroup;
  events: Event[] = [];
  filteredEvents: Event[] = [];
  loading = false;
  selectedFile: File | null = null;
  editingEventId: string | null = null;
  formError: string = '';
  selectedEventTypeFilter: string = 'all';
  selectedLocationFilter: string = '';
  activeLang: string = 'de';
  readonly langMeta: Record<string, { label: string; flag: string }> = {
    de: { label: 'Deutsch (DE)', flag: 'assets/images/flags/de.svg' },
    it: { label: 'Italiano (IT)', flag: 'assets/images/flags/it.svg' },
    fr: { label: 'Français (FR)', flag: 'assets/images/flags/fr.svg' },
    en: { label: 'English (EN)', flag: 'assets/images/flags/gb.svg' },
  };
  selectedLangs: string[] = ['de'];

  showLangDropdown = false;

  get availableLangs(): string[] {
    return ['de', 'it', 'fr', 'en'].filter(l => !this.selectedLangs.includes(l));
  }

  @HostListener('document:click')
  closeLangDropdown(): void {
    this.showLangDropdown = false;
  }


  eventTypeOptions = [
    { label: 'Öffentlich', value: 'oeffentlich' },
    { label: 'Nationalversammlung', value: 'nationalversammlung' },
    { label: 'Lokalversammlung', value: 'lokalversammlung' },
    { label: 'Regionalversammlung', value: 'regionalversammlung' },
    { label: 'RV-Zusammenkunft', value: 'rv_zusammenkunft' },
    { label: 'LV-Zusammenkunft', value: 'lv_zusammenkunft' },
    { label: 'Vorstand', value: 'vorstand' },
    { label: 'Vorsitzende', value: 'vorsitzende' },
    { label: 'Admin', value: 'admin' },
  ];

  locationOptions = [
    { value: '', label: '— Alle Kantone (kein Filter) —' },
    { value: 'AG', label: 'Aargau' },
    { value: 'AI', label: 'Appenzell Innerrhoden' },
    { value: 'AR', label: 'Appenzell Ausserrhoden' },
    { value: 'BE', label: 'Bern' },
    { value: 'BL', label: 'Basel-Landschaft' },
    { value: 'BS', label: 'Basel-Stadt' },
    { value: 'FR', label: 'Fribourg' },
    { value: 'GE', label: 'Genf' },
    { value: 'GL', label: 'Glarus' },
    { value: 'GR', label: 'Graubünden' },
    { value: 'JU', label: 'Jura' },
    { value: 'LU', label: 'Luzern' },
    { value: 'NE', label: 'Neuenburg' },
    { value: 'NW', label: 'Nidwalden' },
    { value: 'OW', label: 'Obwalden' },
    { value: 'SG', label: 'St. Gallen' },
    { value: 'SH', label: 'Schaffhausen' },
    { value: 'SO', label: 'Solothurn' },
    { value: 'SZ', label: 'Schwyz' },
    { value: 'TG', label: 'Thurgau' },
    { value: 'TI', label: 'Tessin' },
    { value: 'UR', label: 'Uri' },
    { value: 'VD', label: 'Waadt' },
    { value: 'VS', label: 'Wallis' },
    { value: 'ZG', label: 'Zug' },
    { value: 'ZH', label: 'Zürich' },
  ];

  repeatOptions = ['none', 'weekly', 'biweekly', 'monthly', 'annually'];

  constructor(
    private fb: FormBuilder,
    private adminevent: AdmineventService
  ) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      title_it: [''],
      title_fr: [''],
      title_en: [''],
      description: [''],
      description_it: [''],
      description_fr: [''],
      description_en: [''],
      isMandatory: [false],
      eventDate: ['', Validators.required],
      repeat: ['none'],
      repeatEndDate: [''],
      eventType: ['oeffentlich', Validators.required],
      eventLocation: [''],
    });

    this.getEvents();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.autoGrowTextarea(), 100);
  }

  getEvents() {
    this.loading = true;
    this.adminevent.getAllEventsForAdmin().subscribe({
      next: (data) => {
        this.events = data;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  applyFilter() {
    if (this.selectedEventTypeFilter === 'all') {
      this.filteredEvents = [...this.events];
    } else {
      this.filteredEvents = this.events.filter(
        (e) => e.eventType === this.selectedEventTypeFilter
      );
    }
  }

  applyFilterByLocation() {
    const selected = this.selectedLocationFilter;
    if (!selected) {
      this.filteredEvents = [...this.events];
    } else {
      this.filteredEvents = this.events.filter((e) => e.eventLocation === selected);
    }
  }

  onLangChange(lang: string): void {
    this.activeLang = lang;
    if (!this.selectedLangs.includes(lang)) {
      this.selectedLangs.push(lang);
    }
  }

  removeLang(lang: string): void {
    if (lang === 'de') return;
    this.selectedLangs = this.selectedLangs.filter(l => l !== lang);
    const patch: any = {};
    patch[`title_${lang}`] = '';
    patch[`description_${lang}`] = '';
    this.eventForm.patchValue(patch);
    if (this.activeLang === lang) this.activeLang = 'de';
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  createEvent() {
    this.formError = '';
    if (this.eventForm.invalid || !this.selectedFile) {
      this.formError = 'Please fill in all required fields and select an image.';
      return;
    }

    const formData = new FormData();
    const formValues = this.eventForm.value;

    formData.append('title', formValues.title);
    formData.append('title_it', formValues.title_it || '');
    formData.append('title_fr', formValues.title_fr || '');
    formData.append('title_en', formValues.title_en || '');
    formData.append('description', this.convertToParagraphs(formValues.description || ''));
    formData.append('description_it', this.convertToParagraphs(formValues.description_it || ''));
    formData.append('description_fr', this.convertToParagraphs(formValues.description_fr || ''));
    formData.append('description_en', this.convertToParagraphs(formValues.description_en || ''));
    formData.append('isMandatory', formValues.isMandatory.toString());
    formData.append('eventDate', formValues.eventDate);
    formData.append('repeat', formValues.repeat);
    if (formValues.repeatEndDate) formData.append('repeatEndDate', formValues.repeatEndDate);
    formData.append('eventType', formValues.eventType);
    formData.append('eventLocation', formValues.eventLocation || '');
    formData.append('date', formValues.eventDate);
    formData.append('image', this.selectedFile);

    this.adminevent.createEvent(formData).subscribe({
      next: () => {
        this.eventForm.reset({ repeat: 'none', repeatEndDate: '', eventType: 'oeffentlich', isMandatory: false });
        this.selectedFile = null;
        if (this.fileInputRef) this.fileInputRef.nativeElement.value = '';
        this.formError = '';
        this.activeLang = 'de';
        this.selectedLangs = ['de'];
        this.getEvents();
      },
      error: (err) => {
        this.formError = err?.error?.message || 'Failed to create event. Please try again.';
      }
    });
  }

  editEvent(event: Event) {
    this.editingEventId = event.id!;
    this.eventForm.patchValue({
      title: event.title,
      title_it: event.title_it || '',
      title_fr: event.title_fr || '',
      title_en: event.title_en || '',
      description: this.convertHtmlToPlainText(event.description || ''),
      description_it: this.convertHtmlToPlainText(event.description_it || ''),
      description_fr: this.convertHtmlToPlainText(event.description_fr || ''),
      description_en: this.convertHtmlToPlainText(event.description_en || ''),
      isMandatory: event.isMandatory,
      eventDate: event.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : '',
      repeat: event.repeat,
      repeatEndDate: event.repeatEndDate ? new Date(event.repeatEndDate).toISOString().split('T')[0] : '',
      eventType: event.eventType || 'oeffentlich',
      eventLocation: event.eventLocation || '',
    });

    this.activeLang = 'de';
    this.selectedLangs = ['de'];
    ['it', 'fr', 'en'].forEach(lang => {
      if (event[`title_${lang}` as keyof Event] || event[`description_${lang}` as keyof Event]) {
        this.selectedLangs.push(lang);
      }
    });

    setTimeout(() => this.autoGrowTextarea(), 50);
  }

  updateEventSubmit() {
    if (!this.editingEventId || this.eventForm.invalid) return;

    const formData = new FormData();
    const formValues = this.eventForm.value;

    formData.append('title', formValues.title);
    formData.append('title_it', formValues.title_it || '');
    formData.append('title_fr', formValues.title_fr || '');
    formData.append('title_en', formValues.title_en || '');
    formData.append('description', this.convertToParagraphs(formValues.description || ''));
    formData.append('description_it', this.convertToParagraphs(formValues.description_it || ''));
    formData.append('description_fr', this.convertToParagraphs(formValues.description_fr || ''));
    formData.append('description_en', this.convertToParagraphs(formValues.description_en || ''));
    formData.append('isMandatory', formValues.isMandatory.toString());
    formData.append('eventDate', formValues.eventDate);
    formData.append('repeat', formValues.repeat);
    if (formValues.repeatEndDate) formData.append('repeatEndDate', formValues.repeatEndDate);
    formData.append('eventType', formValues.eventType);
    formData.append('eventLocation', formValues.eventLocation || '');
    formData.append('date', formValues.eventDate);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.adminevent.updatEvent(this.editingEventId, formData).subscribe({
      next: () => {
        this.eventForm.reset({ repeat: 'none', repeatEndDate: '', eventType: 'oeffentlich', isMandatory: false });
        this.selectedFile = null;
        this.editingEventId = null;
        this.formError = '';
        this.activeLang = 'de';
        this.selectedLangs = ['de'];
        this.getEvents();
      },
      error: (err) => {
        this.formError = err?.error?.message || 'Failed to update event. Please try again.';
      }
    });
  }

  cancelEdit() {
    this.eventForm.reset({ repeat: 'none', repeatEndDate: '', eventType: 'oeffentlich', isMandatory: false });
    this.selectedFile = null;
    if (this.fileInputRef) this.fileInputRef.nativeElement.value = '';
    this.editingEventId = null;
    this.formError = '';
    this.activeLang = 'de';
    this.selectedLangs = ['de'];
  }

  deleteEvent(id: string) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    this.adminevent.deleteEvent(id).subscribe(() => {
      this.events = this.events.filter((e) => e.id !== id);
      this.applyFilter();
    });
  }

  getEventTypeLabel(eventType: string): string {
    const match = this.eventTypeOptions.find((o) => o.value === eventType);
    return match ? match.label : (eventType || '—');
  }

  autoGrow(event: any): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  autoGrowTextarea(): void {
    if (this.descriptionTextareaRef?.nativeElement) {
      const textarea = this.descriptionTextareaRef.nativeElement;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }

  convertToParagraphs(text: string): string {
    if (!text) return '';
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const paragraphs = escaped.split(/\n{2,}/g);
    return paragraphs.map((p) => `<p>${p.trim().replace(/\n/g, '<br>')}</p>`).join('');
  }

  convertHtmlToPlainText(html: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    tempDiv.querySelectorAll('br').forEach((br) => br.replaceWith('\n'));
    let text = '';
    tempDiv.querySelectorAll('p').forEach((p, index, array) => {
      text += p.textContent?.trim() || '';
      if (index < array.length - 1) text += '\n\n';
    });
    return text.trim();
  }
}
