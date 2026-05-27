import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Video } from 'src/app/_models/video';

@Injectable({ providedIn: 'root' })
export class AdminvideoService {
  private baseUrl = '/api/videos'; // Change if needed

  constructor(private http: HttpClient) {}

  addVideo(video: Video) {
    return this.http.post(this.baseUrl, video);
  }

  getVideos() {
    return this.http.get<Video[]>(this.baseUrl);
  }

    updateVideo(videoId: string, video: Partial<Video>) {
    return this.http.put(`${this.baseUrl}/${videoId}`, video);
  }

  deleteVideo(videoId: string) {
    return this.http.delete(`${this.baseUrl}/${videoId}`);
  }
}
