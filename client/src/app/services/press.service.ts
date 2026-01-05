// src/app/admin-services/adminpress.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PressRelease } from '../_models/press';

@Injectable({
  providedIn: 'root'
})
export class PressService {
  private baseUrl = 'http://localhost:5000/api/press-release';

  constructor(private http: HttpClient) {}

  getAllReleases(): Observable<PressRelease[]> {
    return this.http.get<PressRelease[]>(this.baseUrl);
  }


}
