import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Event } from '../_models/event';
import { AuthService } from '../services/auth.service';
import { EventsService } from '../services/events.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  loading = false;
  userId: string = '';
  isLoggedIn = false;
  roleLevel !: number;
  expandedEventIds = new Set<string>();


  constructor(
    private auth: AuthService,
    private eventService: EventsService
  ) {}

ngOnInit(): void {
  this.loading = true;
  this.isLoggedIn = this.auth.isLoggedIn();

  if (this.isLoggedIn) {
    this.auth.getCurrentUser().subscribe({
      next: (res:any) => {
        this.roleLevel = res.user.roleLevel;
        console.log('role level:', this.roleLevel);

        // Now fetch events after roleLevel is known
        this.eventService.getEvents().subscribe((events: any[]) => {
          this.events = events.filter(e => e.visibilityLevel == this.roleLevel);
          this.loading = false;
        });
      },
      error: (err) => {
        console.error('Error fetching user:', err);
        // fallback: fetch only public events
        this.eventService.getEvents().subscribe((events: any[]) => {
          this.events = events.filter(e => e.visibilityLevel === 7);
          this.loading = false;
        });
      }
    });
  } else {
    // Not logged in → only show public events
    this.eventService.getEvents().subscribe((events: any[]) => {
      this.events = events.filter(e => e.visibilityLevel === 7);
      this.loading = false;
    });
  }
}



  toggleReadMore(eventId: string): void {
    this.expandedEventIds.has(eventId)
      ? this.expandedEventIds.delete(eventId)
      : this.expandedEventIds.add(eventId);
  }

  isExpanded(eventId: string): boolean {
    return this.expandedEventIds.has(eventId);
  }

  hasShortDescription(desc?: string): boolean {
    return !!desc && desc.length > 0;
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




}
