import { Component, Input, OnChanges, ViewChild, ElementRef, HostListener } from '@angular/core';
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

  @ViewChild('wrapEl') wrapEl!: ElementRef<HTMLDivElement>;

  playing = false;
  isFullscreen = false;
  videoUrl: SafeResourceUrl = '';

  constructor(private sanitizer: DomSanitizer, public langService: LanguageService) {}

  // Track browser fullscreen state (covers Esc key exit too)
  @HostListener('document:fullscreenchange')
  @HostListener('document:webkitfullscreenchange')
  @HostListener('document:mozfullscreenchange')
  onFsChange(): void {
    this.isFullscreen = !!document.fullscreenElement;
  }

  ngOnChanges(): void {
    if (!this.isActive) this.playing = false;
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

  openFullscreen(event: Event): void {
    event.stopPropagation();
    if (!this.playing) {
      this.play();
      setTimeout(() => this.requestFs(), 300);
    } else {
      this.requestFs();
    }
  }

  exitFullscreen(event: Event): void {
    event.stopPropagation();
    const doc = document as any;
    if (doc.exitFullscreen) { doc.exitFullscreen(); }
    else if (doc.webkitExitFullscreen) { doc.webkitExitFullscreen(); }
    else if (doc.mozCancelFullScreen) { doc.mozCancelFullScreen(); }
    else if (doc.msExitFullscreen) { doc.msExitFullscreen(); }
  }

  // Fullscreen the wrapper div so our close button stays visible inside it
  private requestFs(): void {
    const el = this.wrapEl?.nativeElement as any;
    if (!el) return;
    if (el.requestFullscreen) { el.requestFullscreen(); }
    else if (el.webkitRequestFullscreen) { el.webkitRequestFullscreen(); }
    else if (el.mozRequestFullScreen) { el.mozRequestFullScreen(); }
    else if (el.msRequestFullscreen) { el.msRequestFullscreen(); }
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
