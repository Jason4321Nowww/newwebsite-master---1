import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Action } from 'src/app/_models/action';



@Injectable({ providedIn: 'root' })
export class AdminactionService {
  private base = '/api/actions';

  constructor(private http: HttpClient) {}

  getAllActions(): Observable<Action[]> {
    return this.http.get<Action[]>(this.base);
  }

  getActionById(id: string): Observable<Action> {
    return this.http.get<Action>(`${this.base}/${id}`);
  }

  createAction(formData: FormData): Observable<HttpEvent<any>> {
    return this.http.post(this.base, formData, { reportProgress: true, observe: 'events' });
  }

  updateAction(id: string, formData: FormData): Observable<HttpEvent<any>> {
    return this.http.put(`${this.base}/${id}`, formData, { reportProgress: true, observe: 'events' });
  }

  deleteAction(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}

