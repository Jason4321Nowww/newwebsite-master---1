import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from 'src/app/_models/contact';

@Injectable({ providedIn: 'root' })
export class AdmincontactService {
  private base = '/api/contacts/admin';

  constructor(private http: HttpClient) {}

  getAllContacts(): Observable<{ success: boolean; data: Contact[] }> {
    return this.http.get<{ success: boolean; data: Contact[] }>(this.base);
  }

  createContact(body: { name: string; email: string; participation: string }): Observable<any> {
    return this.http.post<any>(this.base, body);
  }

  updateContact(id: string, body: { name: string; email: string; participation: string }): Observable<any> {
    return this.http.put<any>(`${this.base}/${id}`, body);
  }

  deleteContact(id: string): Observable<any> {
    return this.http.delete<any>(`${this.base}/${id}`);
  }
}
