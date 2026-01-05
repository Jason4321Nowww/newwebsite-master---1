import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AdminemailService {
  private base = 'http://localhost:5000/api/emails';

  constructor(private http: HttpClient) {}

  createEmail(body: any) {
    return this.http.post(this.base, body);
  }

  deleteEmail(id: string) {
    return this.http.delete(`${this.base}/${id}`);
  }

  getAllEmails() {
    return this.http.get(this.base);
  }

  addToList(id: string, listName: string) {
    return this.http.post(`${this.base}/add/${id}`, { listName });
  }

  removeFromList(id: string, listName: string) {
    return this.http.post(`${this.base}/remove/${id}`, { listName });
  }

  getLists() {
    return this.http.get(`${this.base}/lists`);
  }

  getEmailsByList(listName: string) {
    return this.http.get(`${this.base}/list/${listName}`);
  }
}
