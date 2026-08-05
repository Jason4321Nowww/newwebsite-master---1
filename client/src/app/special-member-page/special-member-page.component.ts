import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {EventsService} from '../services/events.service';
import {Event} from '../_models/event';
import {User} from '../_models/user';
import {LanguageService} from '../services/language.service';

@Component({
  selector: 'app-special-member-page',
  templateUrl: './special-member-page.component.html',
  styleUrl: './special-member-page.component.scss'
})
export class SpecialMemberPageComponent implements OnInit {

  userName = '';
  events: Event[] = [];
  loading = true;
  error = false;

  constructor(
    private auth: AuthService,
    private eventService: EventsService,
    public langService: LanguageService,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.auth.getCurrentUser().subscribe({
      next: (res: User) => {
        this.userName = res.user?.username ?? res.username ?? '';
        this.loadEvents();
      },
      error: () => {
        this.loading = false;
        this.error = true;
        this.cdr.markForCheck();
      }
    });
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (events: any) => {
        // Server already applies role+location filtering — sort newest-first here
        this.events = (Array.isArray(events) ? events : [])
          .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.error = true;
        this.cdr.markForCheck();
      }
    });
  }

  formatLocation(loc: any): string {
    if (!loc || typeof loc !== 'object') return loc || '';
    const parts = [loc.gemeinde, loc.bezirk, loc.kantonName].filter(Boolean);
    return parts.join(', ');
  }

  truncateHtml(text: string | undefined, limit: number): string {
    if (!text) return '';
    return text.length > limit ? text.slice(0, limit) + '...' : text;
  }

  convertToParagraphs(text: string): string {
    if (!text) return '';

    const isHTML = /<\/?[a-z][\s\S]*>/i.test(text); // detects basic HTML tags

    if (isHTML) {
      // already has <p>, <br>, etc. → return as-is
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
}
