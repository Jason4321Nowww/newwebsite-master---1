import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {LanguageService} from '../services/language.service';

@Component({
  selector: 'app-titlescreen',
  templateUrl: './titlescreen.component.html',
  styleUrls: ['./titlescreen.component.scss'],
})
export class TitlescreenComponent implements AfterViewInit, OnDestroy {
  constructor(public langService: LanguageService, private cdr: ChangeDetectorRef) {
  }

  @ViewChildren('videoEl') videoEls!: QueryList<ElementRef<HTMLVideoElement>>;

  items = [
    {id: 1, type: 'video', src: '/assets/videos/vone.mp4', captionKey: 'titlescreen.caption1'},
    {id: 2, type: 'image', src: '/assets/mountains.webp', captionKey: 'titlescreen.caption1'},
    {id: 3, type: 'image', src: '/assets/industrie.webp', captionKey: 'titlescreen.caption2'},
    {id: 4, type: 'image', src: 'https://bkps.ch/IMG/slider/gruppenfoto2.webp', captionKey: 'titlescreen.caption3'},
  ];

  currentIndex = 0;
  private interval: any;
  private readonly slideDuration = 6000;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.videoEls.forEach(ref => {
        const v = ref.nativeElement;
        v.muted = true;
        v.volume = 0;
        v.load();
      });
      this.syncVideoPlayback();
      this.startAutoSlide();
    }, 0);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  // Force DOM update first, then play/pause each video based on active state
  private syncVideoPlayback(): void {
    this.cdr.detectChanges();
    this.videoEls.forEach(ref => {
      const video = ref.nativeElement;
      video.muted = true;
      const slide = video.closest<HTMLElement>('.slider-item');
      if (slide?.classList.contains('active')) {
        this.playVideo(video);
      } else {
        video.pause();
      }
    });
  }

  private playVideo(video: HTMLVideoElement): void {
    video.muted = true;
    video.volume = 0;
    const doPlay = () => {
      video.muted = true;
      video.play().catch(() => {
      });
    };
    if (video.readyState >= 2) {
      doPlay();
    } else {
      video.addEventListener('canplay', doPlay, {once: true});
      video.load();
    }
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.syncVideoPlayback();
    this.scheduleNextSlide();
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.syncVideoPlayback();
    this.resetAutoSlide();
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    this.syncVideoPlayback();
    this.resetAutoSlide();
  }

  private startAutoSlide(): void {
    this.scheduleNextSlide();
  }

  private resetAutoSlide(): void {
    clearInterval(this.interval);
    this.scheduleNextSlide();
  }

  // Decides how the current slide should advance: image slides use the fixed
  // timer; video slides wait for the 'ended' event instead of a timer.
  private scheduleNextSlide(): void {
    clearInterval(this.interval);
    const current = this.items[this.currentIndex];

    if (current.type === 'video') {
      const videoRef = this.videoEls.find(ref =>
        ref.nativeElement.closest('.slider-item')?.classList.contains('active')
      );
      if (videoRef) {
        const video = videoRef.nativeElement;
        const onEnded = () => {
          video.removeEventListener('ended', onEnded);
          this.nextSlide();
        };
        video.addEventListener('ended', onEnded, {once: true});
        return; // no timer — advance is driven by the video finishing
      }
    }

    // Image slides (or fallback if video ref not found yet): use the fixed timer
    this.interval = setInterval(() => this.nextSlide(), this.slideDuration);
  }

  trackByFn(_index: number, item: any): number {
    return item.id;
  }
}
