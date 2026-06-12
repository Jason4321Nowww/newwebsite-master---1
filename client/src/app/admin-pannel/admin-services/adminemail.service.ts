import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AdminemailService {
  private base = '/api/emails';

  constructor(private http: HttpClient) {}

  // ─── Email CRUD ─────────────────────────────────────────────────────────────
  createEmail(body: { name: string; email: string }) {
    return this.http.post<any>(this.base, body);
  }
  updateEmail(id: string, body: { name: string; email: string }) {
    return this.http.put<any>(`${this.base}/${id}`, body);
  }
  deleteEmail(id: string) {
    return this.http.delete<any>(`${this.base}/${id}`);
  }
  getAllEmails() {
    return this.http.get<any[]>(this.base);
  }

  // ─── List membership ─────────────────────────────────────────────────────────
  addToList(emailId: string, listName: string) {
    return this.http.post<any>(`${this.base}/add/${emailId}`, { listName });
  }
  removeFromList(emailId: string, listName: string) {
    return this.http.post<any>(`${this.base}/remove/${emailId}`, { listName });
  }
  getEmailsByList(listName: string) {
    return this.http.get<any[]>(`${this.base}/list/${encodeURIComponent(listName)}`);
  }

  // ─── Mailing list CRUD ───────────────────────────────────────────────────────
  getLists() {
    return this.http.get<string[]>(`${this.base}/lists`);
  }
  createList(name: string) {
    return this.http.post<any>(`${this.base}/lists`, { name });
  }
  renameList(oldName: string, newName: string) {
    return this.http.patch<any>(`${this.base}/lists/${encodeURIComponent(oldName)}`, { name: newName });
  }
  deleteList(name: string) {
    return this.http.delete<any>(`${this.base}/lists/${encodeURIComponent(name)}`);
  }
}
