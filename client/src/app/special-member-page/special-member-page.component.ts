import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { EventsService } from '../services/events.service';
import { Event } from '../_models/event';
import { User } from '../_models/user';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-special-member-page',
  templateUrl: './special-member-page.component.html',
  styleUrl: './special-member-page.component.scss'
})
export class SpecialMemberPageComponent implements OnInit{

  userName = '';
  userRole = 7;          // default public
  userLocation = '';
  events: Event[] = [];
  loading = false;

  constructor(
    private auth: AuthService,
    private eventService: EventsService,
    public langService: LanguageService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.auth.getCurrentUser().subscribe({
      next: (res: User) => {
        console.log(res)
        this.userName = res.user.username;
        this.userRole = res.user.roleLevel;
        this.userLocation = res.user.userLocation;    // Make sure user model has location

        this.loadEvents();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

truncateHtml(text: string | undefined, limit: number): string {
  if (!text) return '';
  return text.length > limit ? text.slice(0, limit) + '...' : text;
}




  loadEvents() {
    this.eventService.getEvents().subscribe((allEvents: Event[]) => {
      this.events = allEvents.filter(e => {
        // Event is visible if its visibilityLevel >= user's roleLevel
        // (lower roleLevel = higher privilege, e.g. 0=Admin, 7=Public)
        const level = e.visibilityLevel ?? 7;
        const levelMatch = level >= this.userRole;

        // Only apply location filter when both event and user have a location
        const locationMatch =
          !e.eventLocation ||
          !this.userLocation ||
          e.eventLocation.toLowerCase() === this.userLocation.toLowerCase();

        return levelMatch && locationMatch;
      });
      this.loading = false;
    });
  }
}

