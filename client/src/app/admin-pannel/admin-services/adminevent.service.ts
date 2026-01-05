import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from 'src/app/_models/event';



@Injectable({
  providedIn: 'root'
})
export class AdmineventService {
  private apiUrl = 'http://localhost:5000/api/events';

  constructor(private http: HttpClient) {}

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }
  getAllEventsForAdmin() {
  return this.http.get<Event[]>(this.apiUrl + '/admin'); // Adjust base URL if needed
}


  createEvent(event: FormData): Observable<Event> {
  return this.http.post<Event>(this.apiUrl, event);
}
 updatEvent(id: string, data: FormData): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, data);
  }

  deleteEvent(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
