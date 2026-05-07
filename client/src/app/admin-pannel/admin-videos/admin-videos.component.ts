import { Component, HostListener, OnInit } from '@angular/core';
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
  editingVideoId: string | null = null;

  activeLang = 'de';
  selectedLangs: string[] = ['de'];
  showLangDropdown = false;

  readonly langMeta: Record<string, { label: string; flag: string }> = {
    de: { label: 'Deutsch (DE)', flag: 'assets/images/flags/de.svg' },
    it: { label: 'Italiano (IT)', flag: 'assets/images/flags/it.svg' },
    fr: { label: 'Français (FR)', flag: 'assets/images/flags/fr.svg' },
    en: { label: 'English (EN)', flag: 'assets/images/flags/gb.svg' },
  };

  get availableLangs(): string[] {
    return ['de', 'it', 'fr', 'en'].filter(l => !this.selectedLangs.includes(l));
  }

  onLangChange(lang: string): void {
    this.activeLang = lang;
    if (!this.selectedLangs.includes(lang)) this.selectedLangs.push(lang);
  }

  removeLang(lang: string): void {
    if (lang === 'de') return;
    this.selectedLangs = this.selectedLangs.filter(l => l !== lang);
    (this as any)[`videoTitle_${lang}`] = '';
    if (this.activeLang === lang) this.activeLang = 'de';
  }

  @HostListener('document:click')
  closeLangDropdown(): void { this.showLangDropdown = false; }
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

  editVideo(video: Video): void {
    this.editingVideoId = video._id!;
    this.videoId = video.videoId;
    this.videoTitle = video.title;
    this.videoTitle_it = video.title_it || '';
    this.videoTitle_fr = video.title_fr || '';
    this.videoTitle_en = video.title_en || '';
    this.isLandscape = video.orientation === 'landscape';
    this.activeLang = 'de';
    this.selectedLangs = ['de',
      ...(video.title_it ? ['it'] : []),
      ...(video.title_fr ? ['fr'] : []),
      ...(video.title_en ? ['en'] : []),
    ];
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.editingVideoId = null;
    this.videoId = '';
    this.videoTitle = '';
    this.videoTitle_it = '';
    this.videoTitle_fr = '';
    this.videoTitle_en = '';
    this.isLandscape = true;
    this.activeLang = 'de';
    this.selectedLangs = ['de'];
    this.videoPreviewUrl = null;
  }

  onSubmit() {
    if (!this.videoId) return;

    if (this.editingVideoId) {
      const video: Partial<Video> = {
        videoId: this.videoId.trim(),
        title: this.videoTitle.trim(),
        title_it: this.videoTitle_it.trim() || undefined,
        title_fr: this.videoTitle_fr.trim() || undefined,
        title_en: this.videoTitle_en.trim() || undefined,
        orientation: this.isLandscape ? 'landscape' : 'portrait'
      };
      this.adminvideo.updateVideo(this.editingVideoId, video).subscribe(() => {
        this.loadVideos();
        this.cancelEdit();
      });
      return;
    }

    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${this.videoId}&format=json`;

    this.http.get<{ title: string }>(oembedUrl).subscribe({
      next: (res) => {
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
          this.cancelEdit();
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
