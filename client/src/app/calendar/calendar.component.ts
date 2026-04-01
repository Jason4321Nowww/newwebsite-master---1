import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Event } from '../_models/event';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnChanges {
  @Input() events: Event[] = [];

  currentMonth = new Date();
  // Each cell: null = empty padding cell, otherwise has date + optional event
  calendarDates: ({ date: Date; inCurrentMonth: boolean; event?: Event } | null)[] = [];
  weekDayKeys = ['calendar.mo', 'calendar.tu', 'calendar.we', 'calendar.th', 'calendar.fr', 'calendar.sa', 'calendar.su'];
  isMobile = false;

  constructor(public langService: LanguageService) {}

  ngOnInit() {
    this.isMobile = window.innerWidth <= 768;
    this.generateCalendar(); // Build on first load (events may be empty initially)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['events']) {
      this.generateCalendar();
    }
  }

  truncateTitle(title: string): string {
    const limit = this.isMobile ? 25 : 12;
    return title.length > limit ? title.slice(0, limit) + '...' : title;
  }

  prevMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1);
    this.generateCalendar();
  }

  // Parse an ISO date string as a LOCAL date (avoids UTC timezone shift)
  private parseLocalDate(dateStr: string): Date {
    const s = (dateStr || '').toString();
    const datePart = s.split('T')[0]; // "2025-07-26"
    const [y, m, d] = datePart.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  generateCalendar() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month, daysInMonth);

    // Day-of-week padding for Monday-first grid
    // getDay(): 0=Sun,1=Mon,...,6=Sat → convert to Mon-first: (getDay()+6)%7
    const firstDayOfWeek = (startDate.getDay() + 6) % 7; // 0=Mon … 6=Sun
    const padding: null[] = Array(firstDayOfWeek).fill(null);

    // Build day cells for current month
    const dayCells: { date: Date; inCurrentMonth: boolean; event?: Event }[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      dayCells.push({ date: new Date(year, month, day), inCurrentMonth: true });
    }

    // Map events to dates (using local-date parsing to avoid UTC shift)
    const eventDatesMap = new Map<string, Event>();

    this.events.forEach(event => {
      const eventDate = this.parseLocalDate(event.eventDate as any);
      let current = new Date(eventDate);

      // Skip one-time events outside this month
      const repeatInterval = (event as any).repeatEveryWeeks;
      const hasWeeklyRepeat = repeatInterval && repeatInterval > 0;
      const hasOtherRepeat = event.repeat && event.repeat !== 'none';

      if (!hasWeeklyRepeat && !hasOtherRepeat && (eventDate < startDate || eventDate > endDate)) return;

      const repeatEnd = (event as any).repeatEndDate
        ? this.parseLocalDate((event as any).repeatEndDate)
        : null;

      while (current <= endDate) {
        if (repeatEnd && current > repeatEnd) break;

        if (current >= startDate) {
          eventDatesMap.set(current.toDateString(), event);
        }

        if (!hasWeeklyRepeat && !hasOtherRepeat) break;

        const next = new Date(current);
        if (hasWeeklyRepeat) {
          next.setDate(next.getDate() + repeatInterval * 7);
        } else {
          switch (event.repeat) {
            case 'weekly':    next.setDate(next.getDate() + 7); break;
            case 'biweekly':  next.setDate(next.getDate() + 14); break;
            case 'monthly':   next.setMonth(next.getMonth() + 1); break;
            case 'annually':  next.setFullYear(next.getFullYear() + 1); break;
            default: current = new Date(endDate.getTime() + 1); break; // force exit
          }
        }
        current = next;
      }
    });

    const resolvedCells = dayCells.map(day => ({
      ...day,
      event: eventDatesMap.get(day.date.toDateString())
    }));

    this.calendarDates = [...padding, ...resolvedCells];
  }

  getTooltipText(event: Event): string {
    const repeatInterval = (event as any).repeatEveryWeeks;
    const repeatLabel = repeatInterval > 0
      ? `Every ${repeatInterval} week(s)`
      : (event.repeat || 'One-time');
    return `${event.title}\nRepeat: ${repeatLabel}\nDate: ${this.parseLocalDate(event.eventDate as any).toDateString()}`;
  }

  isRepeating(event: Event): boolean {
    const repeatInterval = (event as any).repeatEveryWeeks;
    return (repeatInterval > 0) || (!!event.repeat && event.repeat !== 'none');
  }
}
