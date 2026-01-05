import { Component, Input, OnChanges, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-shorts-video',
  templateUrl: './shortsvideo.component.html',
  styleUrls: ['./shortsvideo.component.scss'],
})
export class ShortsVideo implements OnChanges {
  @Input() videoInfo: any;
  @Input() isActive: boolean = false;
  @Input() index: number = 0; // receives the index from parent

  @ViewChild('iframeRef', { static: true }) iframeRef!: ElementRef<HTMLIFrameElement>;

  videoUrl: SafeResourceUrl = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(): void {
    
    const muteParam = this.isActive ? '0' : '1';
     const autoplayParam = this.isActive && this.index !== 0 ? '1' : '0';
    const url = `https://www.youtube.com/embed/${this.videoInfo.videoId}?autoplay=${autoplayParam}&mute=${muteParam}&enablejsapi=1&origin=http://localhost`;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}``