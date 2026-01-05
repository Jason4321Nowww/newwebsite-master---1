import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AdminvideoService } from '../admin-services/adminvideo.service';
import { Video } from 'src/app/_models/video';

@Component({
  selector: 'app-admin-videos',
  templateUrl: './admin-videos.component.html',
  styleUrls: ['./admin-videos.component.scss']
})
export class AdminVideosComponent implements OnInit {
  videoId = '';
  videoTitle = '';
  videoIdOrientation: 'portrait' | 'landscape' = 'landscape';
  videoPreviewUrl: SafeResourceUrl | null = null;
  videoList: Video[] = [];
  landscapeVideos: Video[] = [];
portraitVideos: Video[] = [];

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private adminvideo: AdminvideoService
  ) {}

  ngOnInit() {
    this.loadVideos();
  }

  // Converts videoId to a SafeResourceUrl for embedding
  getSafeUrl(videoId: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`
    );
  }

  // Preview the video in the iframe before submission
  preview() {
    if (!this.videoId) {
      this.videoPreviewUrl = null;
      return;
    }
    this.videoPreviewUrl = this.getSafeUrl(this.videoId);
  }

  // Handle form submission
  onSubmit() {
    if (!this.videoId) return;

    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${this.videoId}&format=json`;

    this.http.get<{ title: string }>(oembedUrl).subscribe({
      next: (res) => {
        this.videoTitle = res.title;

        const video: Video = {
          title: this.videoTitle,
          videoId: this.videoId,
          orientation: this.videoIdOrientation
        };

        this.adminvideo.addVideo(video).subscribe(() => {
          this.loadVideos();

          // Reset form
          this.videoId = '';
          this.videoTitle = '';
          this.videoIdOrientation = 'landscape';
          this.videoPreviewUrl = null;
        });
      },
      error: () => {
        alert('Invalid Video ID or failed to fetch video title.');
      }
    });
  }

  // Load all videos from backend
loadVideos() {
  this.adminvideo.getVideos().subscribe((videos) => {
    this.videoList = videos;
    this.landscapeVideos = videos.filter(v => v.orientation === 'landscape');
    this.portraitVideos = videos.filter(v => v.orientation === 'portrait');
  });
}

  // Delete a video from backend and refresh list
deleteVideo(id: string) {
  if (confirm('Are you sure you want to delete this video?')) {
    this.adminvideo.deleteVideo(id).subscribe(() => {
      this.loadVideos(); // reloads and updates filtered arrays
    });
  }
}

 


}
