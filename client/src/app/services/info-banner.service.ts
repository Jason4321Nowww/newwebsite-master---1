import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InfoBanner } from 'src/app/_models/infoBanner';

@Injectable({
  providedIn: 'root'
})
export class InfoBannerService {
  private apiUrl = '/api/banner'; // 🔁 Replace with your real API endpoint

  constructor(private http: HttpClient) {}

  // GET all banners
  getBanners(): Observable<InfoBanner[]> {
    return this.http.get<InfoBanner[]>(this.apiUrl);
  }

  
}
