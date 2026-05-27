import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Event } from '../_models/event';
import { FingerprintService } from './fingerprint.service';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private baseUrl = '/api/events';

  constructor(
    private http: HttpClient,
    private fingerprint: FingerprintService,
  ) {}

  private get commonHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders().set('x-visitor-id', this.fingerprint.visitorId);
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  getPublicEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/public`, { headers: this.commonHeaders });
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/events`, { headers: this.commonHeaders });
  }

  toggleAttendance(eventId: string, attend: boolean): Observable<{ attendees: number }> {
    return this.http.post<{ attendees: number }>(
      `${this.baseUrl}/attend`,
      { eventId, attend, visitorId: this.fingerprint.visitorId },
      { headers: this.commonHeaders }
    );
  }
}
