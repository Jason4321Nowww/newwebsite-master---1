import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Canton {
  kantonCode: string;
  kantonName: string;
}

export interface UserLocation {
  kantonCode: string;
  kantonName: string;
  bezirk: string;
  gemeinde: string;
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  private base = '/api/locations';

  constructor(private http: HttpClient) {}

  getCantons(): Observable<Canton[]> {
    return this.http.get<Canton[]>(`${this.base}/cantons`);
  }

  getBezirke(kantonCode: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.base}/bezirke/${kantonCode}`);
  }

  getGemeinden(kantonCode: string, bezirk: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.base}/gemeinden/${kantonCode}/${encodeURIComponent(bezirk)}`);
  }
}
