import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Action } from '../_models/action';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

   private base = 'http://localhost:5000/api/actions';

  constructor(private http: HttpClient) {}

  getAllActions(): Observable<Action[]> {
    return this.http.get<Action[]>(this.base);
  }
}
