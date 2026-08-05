import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Event} from '../_models/event';
import {AuthService} from '../services/auth.service';
import {EventsService} from '../services/events.service';
import {LanguageService} from '../services/language.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit, OnDestroy {
  events: Event[] = [];
  loading = false;
  isLoggedIn = false;
  roleLevel: number = 7;
  expandedEventIds = new Set<string>();
  private langSub!: Subscription;

  constructor(
    private auth: AuthService,
    private eventService: EventsService,
    public langService: LanguageService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.langSub = this.langService.lang$.subscribe(() => this.cdr.markForCheck());
    this.loading = true;
    this.isLoggedIn = this.auth.isLoggedIn();
    this.roleLevel = Number(localStorage.getItem('roleLevel') ?? 7);
    // Server filters events by role+location; client just renders what it receives
    this.eventService.getEvents().subscribe({
      next: (events: any[]) => {
        this.events = events
          .map(e => ({
            ...e,
            attendeesCount: e.attendeesCount ?? e.attendees?.length ?? 0,
            isAttending: e.isAttending ?? false,
          }))
          .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching events:', err);
        this.loading = false;
      }
    });
  }


  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  toggleReadMore(eventId: string): void {
    this.expandedEventIds.has(eventId)
      ? this.expandedEventIds.delete(eventId)
      : this.expandedEventIds.add(eventId);
  }

  isExpanded(eventId: string): boolean {
    return this.expandedEventIds.has(eventId);
  }

  hasLongDescription(desc?: string): boolean {
    return !!desc && desc.length > 180;
  }

  toggleAttendance(event: Event): void {

    const attend = !event.isAttending;

    this.eventService.toggleAttendance(event.id, attend).subscribe({
      next: (res) => {
        event.isAttending = attend;
        event.attendeesCount = res.attendees;
      },
      error: (err) => {
        console.error('❌ Toggle attendance failed:', err);
      }
    });
  }


  convertToParagraphs(text: string): string {
    if (!text) return '';

    const isHTML = /<\/?[a-z][\s\S]*>/i.test(text); // detects basic HTML tags

    if (isHTML) {
      // ✅ already has <p>, <br>, etc. → return as-is
      return text;
    }

    // Else treat as plain text and wrap into paragraphs
    const paragraphs = text.includes('\n\n')
      ? text.split(/\n{2,}/g)
      : [text];

    return paragraphs
      .map(para => `<p>${para.trim().replace(/\n/g, '<br>')}</p>`)
      .join('');
  }


  getDateLabel(event: Event): string {
    if (!event.repeat || event.repeat === 'none') {
      return this.formatDate(event.eventDate);
    }
    const start = this.formatDate(event.eventDate);
    const end = event.repeatEndDate ? this.formatDate(event.repeatEndDate) : null;
    return end ? `${start} – ${end}` : `${this.langService.t('events.startingFrom')} ${start}`;
  }

  private formatDate(d: string): string {
    return new Date(d).toLocaleDateString('de-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\./g, '-');
  }
}
