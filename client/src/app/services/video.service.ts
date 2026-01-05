import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Video } from 'src/app/_models/video';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private baseUrl = 'http://localhost:5000/api/videos'; // Change if needed

  constructor(private http: HttpClient) {}

   getVideos() {
    return this.http.get<Video[]>(this.baseUrl);
  }

}
