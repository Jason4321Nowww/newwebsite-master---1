import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InfoBanner } from 'src/app/_models/infoBanner';


@Injectable({
  providedIn: 'root'
})
export class InfoBannerService {
  private apiUrl = 'http://localhost:5000/api/banner'; // Adjust as needed

  constructor(private http: HttpClient) {}

  getBanners(): Observable<InfoBanner[]> {
    return this.http.get<InfoBanner[]>(this.apiUrl);
  }

  createBanner(banner: InfoBanner): Observable<InfoBanner> {
    return this.http.post<InfoBanner>(this.apiUrl, banner);
  }

  updateBanner(id: string, banner: InfoBanner): Observable<InfoBanner> {
    return this.http.put<InfoBanner>(`${this.apiUrl}/${id}`, banner);
  }

  deleteBanner(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
