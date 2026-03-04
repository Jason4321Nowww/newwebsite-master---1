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
  videoTitle_it = '';
  videoTitle_fr = '';
  videoTitle_en = '';
  isLandscape: boolean = true;
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

  getSafeUrl(videoId: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`
    );
  }

  onSubmit() {
    if (!this.videoId) return;

    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${this.videoId}&format=json`;

    this.http.get<{ title: string }>(oembedUrl).subscribe({
      next: (res) => {
        // If the user left the German title blank, use the YouTube-fetched title
        const title = this.videoTitle.trim() || res.title;

        const video: Video = {
          title,
          title_it: this.videoTitle_it.trim() || undefined,
          title_fr: this.videoTitle_fr.trim() || undefined,
          title_en: this.videoTitle_en.trim() || undefined,
          videoId: this.videoId,
          orientation: this.isLandscape ? 'landscape' : 'portrait'
        };

        this.adminvideo.addVideo(video).subscribe(() => {
          this.loadVideos();
          this.videoId = '';
          this.videoTitle = '';
          this.videoTitle_it = '';
          this.videoTitle_fr = '';
          this.videoTitle_en = '';
          this.isLandscape = true;
          this.videoPreviewUrl = null;
        });
      },
      error: () => {
        alert('Invalid Video ID or failed to fetch video title.');
      }
    });
  }

  loadVideos() {
    this.adminvideo.getVideos().subscribe((videos) => {
      this.videoList = videos;
      this.landscapeVideos = videos.filter(v => v.orientation === 'landscape');
      this.portraitVideos = videos.filter(v => v.orientation === 'portrait');
    });
  }

  deleteVideo(id: string) {
    if (confirm('Are you sure you want to delete this video?')) {
      this.adminvideo.deleteVideo(id).subscribe(() => {
        this.loadVideos();
      });
    }
  }
}
