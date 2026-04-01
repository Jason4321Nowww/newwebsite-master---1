import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-shorts-video',
  templateUrl: './shortsvideo.component.html',
  styleUrls: ['./shortsvideo.component.scss'],
})
export class ShortsVideo implements OnChanges {
  @Input() videoInfo: any;
  @Input() isActive: boolean = false;

  playing = false;
  videoUrl: SafeResourceUrl = '';

  constructor(private sanitizer: DomSanitizer, public langService: LanguageService) {}

  ngOnChanges(): void {
    if (!this.isActive) {
      this.playing = false;
    }
  }

  get thumbnailUrl(): string {
    if (!this.videoInfo?.videoId) return '';
    return `https://img.youtube.com/vi/${this.videoInfo.videoId}/hqdefault.jpg`;
  }

  get isLandscape(): boolean {
    return this.videoInfo?.orientation === 'landscape';
  }

  play(): void {
    if (!this.videoInfo?.videoId) return;
    const url = `https://www.youtube.com/embed/${this.videoInfo.videoId}?autoplay=1&rel=0&modestbranding=1`;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.playing = true;
  }

  getTitle(lang: string | null): string {
    if (!this.videoInfo) return '';
    const l = lang || 'de';
    if (l !== 'de') {
      const langTitle = this.videoInfo[`title_${l}`];
      if (langTitle) return langTitle;
    }
    return this.videoInfo.title;
  }
}
