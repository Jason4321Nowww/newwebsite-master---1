import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from '../_models/contact';

export interface ContactResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private baseUrl = '/api/contacts';

  constructor(private http:HttpClient) { }

  submitContact(contactData: Contact): Observable<ContactResponse>{
  return this.http.post<ContactResponse>(this.baseUrl, contactData)
  }

}
