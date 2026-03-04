import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Event } from '../_models/event';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private baseUrl = 'http://localhost:5000/api/events';

  constructor(private http: HttpClient) {}

  getPublicEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/public`);
  }
  getEvents(): Observable<Event[]> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
    return this.http.get<Event[]>(`${this.baseUrl}/events`, { headers });
  }

  getProtectedEvents(): Observable<Event[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Event[]>(`${this.baseUrl}/protected`, { headers });
  }



toggleAttendance(eventId: string, attend: boolean) {
  const token = localStorage.getItem('token') || '';
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.post<{ attendees: number }>(
    `http://localhost:5000/api/events/attend`,
    { eventId, attend }, {
      headers
    }
  );
}


}
