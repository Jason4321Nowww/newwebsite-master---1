import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from 'src/app/_models/contact';

@Injectable({
  providedIn: 'root'
})
export class AdmincontactService {

  private baseUrl = 'http://localhost:5000/api/contacts/admin'; // Ensure this returns all contacts

  constructor(private http: HttpClient) {}

  getAllContacts(): Observable<{ success: boolean; data: Contact[] }> {
    return this.http.get<{ success: boolean; data: Contact[] }>(this.baseUrl);
  }
}
