import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Event } from '../_models/event';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnChanges {
  @Input() events: Event[] = [];

  currentMonth = new Date();
  calendarDates: { date: Date; inCurrentMonth: boolean; event?: Event }[] = [];
  weekDays = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
  isMobile = false;

  ngOnInit() {
    this.isMobile = window.innerWidth <= 768;
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

  generateCalendar() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month, daysInMonth);

    // Build calendar cells
    const calendar: { date: Date; inCurrentMonth: boolean; event?: Event }[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      calendar.push({ date: new Date(year, month, day), inCurrentMonth: true });
    }

    // Map for events on dates
    const eventDatesMap = new Map<string, Event>();

    this.events.forEach(event => {
      const eventDate = new Date(event.eventDate);
      let current = new Date(eventDate);

      // Skip non-repeating events outside current month
      if (event.repeat === 'none' && (eventDate < startDate || eventDate > endDate)) return;

      // Loop to add repeated events
      while (current <= endDate) {
        if (current >= startDate) {
          eventDatesMap.set(current.toDateString(), event);
        }

        switch (event.repeat) {
          case 'weekly': current.setDate(current.getDate() + 7); break;
          case 'bi-weekly': current.setDate(current.getDate() + 14); break;
          case 'monthly': current.setMonth(current.getMonth() + 1); break;
          case 'annually': current.setFullYear(current.getFullYear() + 1); break;
          default: break;
        }

        if (!event.repeat || event.repeat === 'none') break;
      }
    });

    this.calendarDates = calendar.map(day => ({
      ...day,
      event: eventDatesMap.get(day.date.toDateString())
    }));
  }

  getTooltipText(event: Event): string {
    return `Title: ${event.title}
Repeat: ${event.repeat || 'One-time'}
Date: ${new Date(event.eventDate).toDateString()}`;
  }
}
