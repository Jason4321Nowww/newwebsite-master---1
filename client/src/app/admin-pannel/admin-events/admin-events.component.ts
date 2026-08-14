import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdmineventService} from '../admin-services/adminevent.service';
import {Event} from 'src/app/_models/event';
import {Canton, LocationService} from 'src/app/services/location.service';

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
  selectedTimeFilter: string = 'all';
  activeLang: string = 'de';
  readonly langMeta: Record<string, { label: string; flag: string }> = {
    de: {label: 'Deutsch (DE)', flag: 'assets/images/flags/de.svg'},
    it: {label: 'Italiano (IT)', flag: 'assets/images/flags/it.svg'},
    fr: {label: 'Français (FR)', flag: 'assets/images/flags/fr.svg'},
    en: {label: 'English (EN)', flag: 'assets/images/flags/gb.svg'},
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
    {label: 'Admin', value: 'admin'},
    {label: 'Vorsitzende', value: 'vorsitzende'},
    {label: 'Vorstand', value: 'vorstand'},
    {label: 'Nationalversammlung', value: 'nationalversammlung'},
    {label: 'Regionalversammlung', value: 'regionalversammlung'},
    {label: 'Lokalversammlung', value: 'lokalversammlung'},
    {label: 'RV-Zusammenkunft', value: 'rv_zusammenkunft'},
    {label: 'LV-Zusammenkunft', value: 'lv_zusammenkunft'},
    {label: 'Intern', value: 'intern'},
    {label: 'Öffentlich', value: 'oeffentlich'},
  ];

  repeatOptions = ['none', 'weekly', 'biweekly', 'monthly', 'annually'];

  // ── Cascading location for form ──────────────────────────────
  cantons: Canton[] = [];
  bezirke: string[] = [];
  gemeinden: string[] = [];
  evtKantonCode = '';
  evtKantonName = '';
  evtBezirk = '';
  evtGemeinde = '';

  // ── Filter: kanton-level only (simple dropdown from loaded cantons) ──
  get filterCantons(): Canton[] {
    return this.cantons;
  }

  constructor(
    private fb: FormBuilder,
    private adminevent: AdmineventService,
    private locationSvc: LocationService,
  ) {
  }

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
    });

    this.locationSvc.getCantons().subscribe({
      next: (data) => {
        this.cantons = data;
      },
      error: () => {
      },
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

  // ── Location cascade ─────────────────────────────────────────
  onEvtKantonChange(kantonCode: string): void {
    const c = this.cantons.find(x => x.kantonCode === kantonCode);
    this.evtKantonCode = kantonCode;
    this.evtKantonName = c?.kantonName || '';
    this.evtBezirk = '';
    this.evtGemeinde = '';
    this.bezirke = [];
    this.gemeinden = [];
    if (kantonCode) {
      this.locationSvc.getBezirke(kantonCode).subscribe({
        next: (d) => {
          this.bezirke = d;
        },
        error: () => {
        },
      });
    }
  }

  onEvtBezirkChange(bezirk: string): void {
    this.evtBezirk = bezirk;
    this.evtGemeinde = '';
    this.gemeinden = [];
    if (bezirk && this.evtKantonCode) {
      this.locationSvc.getGemeinden(this.evtKantonCode, bezirk).subscribe({
        next: (d) => {
          this.gemeinden = d;
        },
        error: () => {
        },
      });
    }
  }

  private resetLocationState(): void {
    this.evtKantonCode = '';
    this.evtKantonName = '';
    this.evtBezirk = '';
    this.evtGemeinde = '';
    this.bezirke = [];
    this.gemeinden = [];
  }

  getEventLocationLabel(loc: any): string {
    if (!loc) return '—';
    const parts = [loc.kantonCode, loc.bezirk, loc.gemeinde].filter(Boolean);
    return parts.length ? parts.join(' / ') : '—';
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
    formData.append('eventLocation', JSON.stringify({
      kantonCode: this.evtKantonCode,
      bezirk: this.evtBezirk,
      gemeinde: this.evtGemeinde,
    }));
    formData.append('date', formValues.eventDate);
    formData.append('image', this.selectedFile);

    this.adminevent.createEvent(formData).subscribe({
      next: () => {
        this.eventForm.reset({repeat: 'none', repeatEndDate: '', eventType: 'oeffentlich', isMandatory: false});
        this.selectedFile = null;
        if (this.fileInputRef) this.fileInputRef.nativeElement.value = '';
        this.formError = '';
        this.activeLang = 'de';
        this.selectedLangs = ['de'];
        this.resetLocationState();
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
    });

    // Restore location state from saved event
    const loc = event.eventLocation;
    this.evtKantonCode = loc?.kantonCode || '';
    this.evtBezirk = loc?.bezirk || '';
    this.evtGemeinde = loc?.gemeinde || '';
    this.bezirke = [];
    this.gemeinden = [];
    if (this.evtKantonCode) {
      this.locationSvc.getBezirke(this.evtKantonCode).subscribe({
        next: (d) => {
          this.bezirke = d;
          if (this.evtBezirk) {
            this.locationSvc.getGemeinden(this.evtKantonCode, this.evtBezirk).subscribe({
              next: (g) => {
                this.gemeinden = g;
              },
              error: () => {
              },
            });
          }
        },
        error: () => {
        },
      });
    }

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
    formData.append('eventLocation', JSON.stringify({
      kantonCode: this.evtKantonCode,
      bezirk: this.evtBezirk,
      gemeinde: this.evtGemeinde,
    }));
    formData.append('date', formValues.eventDate);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.adminevent.updatEvent(this.editingEventId, formData).subscribe({
      next: () => {
        this.eventForm.reset({repeat: 'none', repeatEndDate: '', eventType: 'oeffentlich', isMandatory: false});
        this.selectedFile = null;
        this.editingEventId = null;
        this.formError = '';
        this.activeLang = 'de';
        this.selectedLangs = ['de'];
        this.resetLocationState();
        this.getEvents();
      },
      error: (err) => {
        this.formError = err?.error?.message || 'Failed to update event. Please try again.';
      }
    });
  }

  cancelEdit() {
    this.eventForm.reset({repeat: 'none', repeatEndDate: '', eventType: 'oeffentlich', isMandatory: false});
    this.selectedFile = null;
    this.resetLocationState();
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

  // ── Attendees modal ───────────────────────────────────────────
  attendeesModalEvent: Event | null = null;

  openAttendeesModal(event: Event): void {
    this.attendeesModalEvent = event;
  }

  closeAttendeesModal(): void {
    this.attendeesModalEvent = null;
  }

  get memberAttendees() {
    return this.attendeesModalEvent?.attendees.filter(a => !a.isAnonymous) ?? [];
  }

  get guestAttendees() {
    return this.attendeesModalEvent?.attendees.filter(a => a.isAnonymous) ?? [];
  }

  getAttendeeName(a: { user?: any; isAnonymous: boolean }): string {
    if (a.isAnonymous || !a.user) return 'Guest';
    if (typeof a.user === 'object' && a.user?.username) return a.user.username;
    return 'Member';
  }

  getAttendeeRole(a: { user?: any; isAnonymous: boolean }): string {
    if (a.isAnonymous || !a.user || typeof a.user !== 'object') return '';
    const level = a.user?.roleLevel;
    const opt = this.allRoleOptions.find((r: any) => r.value === level);
    return opt ? opt.label : '';
  }

  private readonly allRoleOptions = [
    {label: 'Superadmin', value: 0},
    {label: 'Vorsitzende', value: 1},
    {label: 'Vorstand', value: 2},
    {label: 'Admin', value: 3},
    {label: 'Regionalverwaltung', value: 4},
    {label: 'Lokalverwaltung', value: 5},
    {label: 'Vollmitglied', value: 6},
    {label: 'Regulaermitglied', value: 7},
    {label: 'Oeffentlich', value: 8},
  ];

  applyFilterByTime() {
    this.applyCombinedFilters();
  }

  applyFilter() {
    this.applyCombinedFilters();
  }

  applyFilterByLocation() {
    this.applyCombinedFilters();
  }

  private applyCombinedFilters() {
    const now = new Date();

    this.filteredEvents = this.events.filter(e => {
      const typeMatch = this.selectedEventTypeFilter === 'all' || e.eventType === this.selectedEventTypeFilter;
      const locationMatch = !this.selectedLocationFilter || e.eventLocation?.kantonCode === this.selectedLocationFilter;

      let timeMatch = true;
      if (this.selectedTimeFilter === 'upcoming') {
        timeMatch = new Date(e.eventDate) >= now;
      } else if (this.selectedTimeFilter === 'past') {
        timeMatch = new Date(e.eventDate) < now;
      }

      return typeMatch && locationMatch && timeMatch;
    });
  }
}
