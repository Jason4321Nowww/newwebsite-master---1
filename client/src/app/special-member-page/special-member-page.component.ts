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
  userLocation: any = null;
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
      // Server applies all role+location filtering — trust the result as a safety net
      this.events = allEvents.filter(e => this.canSeeEvent(e));
      this.loading = false;
    });
  }

  private canSeeEvent(e: Event): boolean {
    const r = this.userRole;
    const loc = this.userLocation || {};
    const userKanton   = typeof loc === 'object' ? (loc.kantonCode || '') : '';
    const userGemeinde = typeof loc === 'object' ? (loc.gemeinde   || '') : '';
    const evtKanton    = e.eventLocation?.kantonCode || '';
    const evtGemeinde  = e.eventLocation?.gemeinde   || '';
    const t = e.eventType;

    if (t === 'oeffentlich')         return true;
    if (t === 'nationalversammlung') return r <= 6;
    if (t === 'vorstand')            return r <= 3;
    if (t === 'vorsitzende')         return r <= 1;
    if (t === 'rv_zusammenkunft')    return r <= 4;

    if (t === 'regionalversammlung') {
      if (r <= 3) return true;
      return r <= 7 && !!userKanton && userKanton === evtKanton;
    }
    if (t === 'lokalversammlung') {
      if (r <= 3) return true;
      return r <= 7 && !!userGemeinde && userGemeinde === evtGemeinde;
    }
    if (t === 'lv_zusammenkunft') {
      if (r <= 3) return true;
      if (r === 4) return !!userKanton && userKanton === evtKanton;
      if (r === 5) return !!userGemeinde && userGemeinde === evtGemeinde;
      return false;
    }
    return false;
  }
}

