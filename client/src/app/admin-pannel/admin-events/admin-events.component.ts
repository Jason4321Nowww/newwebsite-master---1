import {
  AfterViewInit,
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdmineventService } from '../admin-services/adminevent.service';
import { Event } from 'src/app/_models/event';

@Component({
  selector: 'app-admin-events',
  templateUrl: './admin-events.component.html',
  styleUrls: ['./admin-events.component.scss'],
})
export class AdminEventsComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('descriptionTextarea') descriptionTextareaRef!: ElementRef<HTMLTextAreaElement>;

  eventForm!: FormGroup;
  events: Event[] = [];
  filteredEvents: Event[] = [];
  loading = false;
  selectedFile: File | null = null;
  editingEventId: string | null = null;
  selectedVisibilityFilter: string = '0';
  selectedLocationFilter : string = 'BE';


  visibilityOptions = [
      { label: 'Admin', value: 0 },            // sees all events
  { label: 'Vorsitzende', value: 1 },             // party leader: sees Vorsitzende + Vorstand events
  { label: 'Vorstand', value: 2 },                // national leadership: sees only Vorstand events
  { label: 'Regionalverwaltung', value: 3 },      // regional leadership events
  { label: 'Lokalverwaltung', value: 4 },         // communal leadership
  { label: 'Vollmitglied', value: 5 },            // trustworthy members
  { label: 'Regulaermitglied', value: 6 },        // internal: seen by everyone with account
  { label: 'Oeffentlich', value: 7 }              // public

  ]
  locationOptions = [
  { value: 'ZH', label: 'Zürich' },
  { value: 'SH', label: 'Schaffhausen' },
  { value: 'BE', label: 'Bern' },
  { value: 'LU', label: 'Lucerne' },
  // add all other branch codes here
];

  repeatOptions = ['none', 'weekly', 'bi-weekly', 'monthly', 'annually'];

  constructor(
    private fb: FormBuilder,
    private adminevent: AdmineventService
  ) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      isMandatory: [false],
      eventDate: ['', Validators.required],
      repeat: ['none'],
      visibilityLevel: [0, Validators.required],
      eventLocation: [this.locationOptions[0].value, Validators.required]

    });

    this.getEvents();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.autoGrowTextarea(), 100);
  }

  ngAfterViewChecked(): void {
    this.autoGrowTextarea();
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
  const selected = Number(this.selectedVisibilityFilter);

  if (selected === 0) {
    // Admin sees ALL
    this.filteredEvents = [...this.events];
  } else {
    this.filteredEvents = this.events.filter(
      e => e.visibilityLevel === selected
    );
  }
}

applyFilterByLocation() {
  const selected = this.selectedLocationFilter;

  if (!selected) {
    this.filteredEvents = [...this.events];
  } else {
    this.filteredEvents = this.events.filter(
      (e) => e.eventLocation === selected
    );
  }
}



  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  createEvent() {
    if (this.eventForm.invalid || !this.selectedFile) {
      alert('All required fields and an image must be selected.');
      return;
    }

    const formData = new FormData();
    const formValues = this.eventForm.value;

    formData.append('title', formValues.title);
    formData.append(
      'description',
      this.convertToParagraphs(formValues.description || '')
    );
    formData.append('isMandatory', formValues.isMandatory.toString());
    formData.append('eventDate', formValues.eventDate);
    formData.append('repeat', formValues.repeat);
    formData.append('visibilityLevel', formValues.visibilityLevel.toString());
    formData.append('eventLocation', formValues.eventLocation.toString());
    formData.append('date', formValues.eventDate);
    formData.append('image', this.selectedFile);

    this.adminevent.createEvent(formData).subscribe(() => {
      this.eventForm.reset({
        repeat: 'none',
        visibilityLevel: 0,
        isMandatory: false,
      });
      this.selectedFile = null;
      this.getEvents();
    });
  }

  editEvent(event: Event) {
    this.editingEventId = event.id!;
    this.eventForm.patchValue({
      title: event.title,
      description: this.convertHtmlToPlainText(event.description || ''),
      isMandatory: event.isMandatory,
      eventDate: event.eventDate,
      repeat: event.repeat,
      visibilityLevel: event.visibilityLevel,
      eventLocation: event.eventLocation 
    });

    setTimeout(() => this.autoGrowTextarea(), 50);
  }

  updateEventSubmit() {
    if (!this.editingEventId || this.eventForm.invalid) return;

    const formData = new FormData();
    const formValues = this.eventForm.value;

    formData.append('title', formValues.title);
    formData.append(
      'description',
      this.convertToParagraphs(formValues.description || '')
    );
    formData.append('isMandatory', formValues.isMandatory.toString());
    formData.append('eventDate', formValues.eventDate);
    formData.append('repeat', formValues.repeat);
    formData.append('visibilityLevel', formValues.visibilityLevel.toString());
    formData.append('date', formValues.eventDate);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.adminevent.updatEvent(this.editingEventId, formData).subscribe(() => {
      this.eventForm.reset({
        repeat: 'none',
        visibilityLevel: 0,
        isMandatory: false,
      });
      this.selectedFile = null;
      this.editingEventId = null;
      this.getEvents();
    });
  }

  cancelEdit() {
    this.eventForm.reset({
      repeat: 'none',
      visibilityLevel: 0,
      isMandatory: false,
    });
    this.selectedFile = null;
    this.editingEventId = null;
  }

  deleteEvent(id: string) {
    if (!confirm('Are you sure you want to delete this event?')) return;

    this.adminevent.deleteEvent(id).subscribe(() => {
      this.events = this.events.filter((e) => e.id !== id);
      this.applyFilter();
    });
  }

  getVisibilityLabel(level: number): string {
    const match = this.visibilityOptions.find((o) => o.value === level);
    return match ? match.label : 'Unknown';
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
    return paragraphs
      .map((p) => `<p>${p.trim().replace(/\n/g, '<br>')}</p>`)
      .join('');
  }

  convertHtmlToPlainText(html: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Convert <br> to \n
    tempDiv.querySelectorAll('br').forEach((br) =>
      br.replaceWith('\n')
    );

    // Convert <p> to paragraphs with double newlines
    let text = '';
    tempDiv.querySelectorAll('p').forEach((p, index, array) => {
      text += (p.textContent?.trim() || '');
      if (index < array.length - 1) text += '\n\n';
    });

    return text.trim();
  }
}
