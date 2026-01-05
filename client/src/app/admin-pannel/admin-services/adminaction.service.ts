import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Action } from 'src/app/_models/action';



@Injectable({ providedIn: 'root' })
export class AdminactionService {
  private base = 'http://localhost:5000/api/actions';

  constructor(private http: HttpClient) {}

  getAllActions(): Observable<Action[]> {
    return this.http.get<Action[]>(this.base);
  }

  getActionById(id: string): Observable<Action> {
    return this.http.get<Action>(`${this.base}/${id}`);
  }

  createAction(formData: FormData): Observable<Action> {
    return this.http.post<Action>(this.base, formData);
  }

  updateAction(id: string, formData: FormData): Observable<Action> {
    return this.http.put<Action>(`${this.base}/${id}`, formData);
  }

  deleteAction(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}

