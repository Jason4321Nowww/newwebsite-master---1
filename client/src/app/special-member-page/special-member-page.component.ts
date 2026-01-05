import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { EventsService } from '../services/events.service';
import { Event } from '../_models/event';
import { User } from '../_models/user';

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
    private eventService: EventsService
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
             allEvents.map(e => console.log(e))

      this.events = allEvents.filter(e => 
        e.visibilityLevel === this.userRole &&
        e.eventLocation === this.userLocation
      );
      this.loading = false;
    });
  }
}

