import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Action} from '../_models/action';
import {ActionService} from '../services/action.service';
import {LanguageService} from '../services/language.service';
import {Subscription} from 'rxjs';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgFullscreen from 'lightgallery/plugins/fullscreen';
import lgZoom from 'lightgallery/plugins/zoom';
import lgVideo from 'lightgallery/plugins/video';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit, OnDestroy {
  allActions: Action[] = [];
  videoThumbs = new Map<string, string>();
  private lgRefs: any[] = [];

  // Placeholder shown in thumbnail strip before canvas capture completes
  readonly videoPlaceholder = 'data:image/svg+xml;base64,' + btoa(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180">' +
    '<rect width="320" height="180" fill="#1a1a2e"/>' +
    '<polygon points="125,55 125,125 200,90" fill="white" opacity="0.75"/>' +
    '</svg>'
  );
  private langSub!: Subscription;

  settings = {
    counter: true,
    plugins: [lgThumbnail, lgFullscreen, lgZoom, lgVideo],
    thumbnail: true,
    animateThumb: true,
    zoomFromOrigin: true,
    allowMediaOverlap: false,
    toggleThumb: true,
    appendSubHtmlTo: '.lg-item',
  };

  constructor(
    private actionService: ActionService,
    public langService: LanguageService,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.langSub = this.langService.lang$.subscribe(() => this.cdr.markForCheck());
    this.actionService.getAllActions().subscribe(actions => {
      this.allActions = actions.sort(
        (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      );
      actions.forEach(a => (a.media || []).filter(m => this.isVideo(m)).forEach(v => this.captureVideoThumb(v)));
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  captureVideoThumb(url: string): void {
    const video = document.createElement('video');
    video.muted = true;
    video.preload = 'auto';
    video.playsInline = true;

    const capture = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 320;
        canvas.height = video.videoHeight || 180;
        canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumb = canvas.toDataURL('image/jpeg', 0.8);
        // 'data:,' or very short strings mean empty frame — skip
        if (thumb && thumb.length > 200) {
          this.videoThumbs.set(url, thumb);
          this.refreshGalleries();
        }
      } catch { /* CORS or security restriction */
      }
      video.src = ''; // release resource
    };

    // loadeddata fires when the first frame is genuinely available
    video.addEventListener('loadeddata', capture, {once: true});

    video.addEventListener('canplay', () => {
      if (!this.videoThumbs.has(url)) capture();
    }, {once: true});

    video.src = url;
    video.load();
  }

  onGalleryInit(event: any): void {
    this.lgRefs.push(event.instance);
  }

  private refreshGalleries(): void {
    // After detectChanges updates data-thumb in the DOM, tell lightgallery to re-read it
    this.cdr.detectChanges();
    setTimeout(() => {
      this.lgRefs.forEach(lg => {
        try {
          lg.refresh();
        } catch { /* gallery may be closed */
        }
      });
    }, 0);
  }

  thumbFor(item: string): string {
    return this.isVideo(item) ? (this.videoThumbs.get(item) ?? '') : item;
  }

  isImage(file: string): boolean {
    return /\.(jpe?g|png|gif|webp)$/i.test(file);
  }

  isVideo(file: string): boolean {
    return /\.(mp4|webm|ogg)$/i.test(file);
  }

  openCard(event: MouseEvent, galleryEl: any): void {
    // If the click already landed inside the gallery's own trigger (<a>/img/icon),
    // let lightgallery handle it natively — don't double-trigger.
    const target = event.target as HTMLElement;
    if (target.closest('.card-gallery')) return;

    const firstLink: HTMLElement | null = galleryEl?.el?.nativeElement?.querySelector('a');
    firstLink?.click();
  }

  videoData(url: string): string {
    const ext = url.split('.').pop()?.toLowerCase();
    const mimeMap: Record<string, string> = {mp4: 'video/mp4', webm: 'video/webm', ogg: 'video/ogg'};
    const type = mimeMap[ext ?? ''] ?? 'video/mp4';
    return JSON.stringify({
      source: [{src: url, type}],
      attributes: {preload: 'auto', controls: true},
    });
  }
}
