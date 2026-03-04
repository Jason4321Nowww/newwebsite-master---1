import { Component, HostListener, OnInit } from '@angular/core';
import { VideoService } from '../services/video.service';

interface VideoItem {
  title: string;
  title_it?: string;
  title_fr?: string;
  title_en?: string;
  videoId: string;
  orientation?: string;
}

interface CarouselSlot {
  video: VideoItem;
  isCenter: boolean;
}

@Component({
  selector: 'app-shorts-videoplayer',
  templateUrl: './shorts-videoplayer.component.html',
  styleUrls: ['./shorts-videoplayer.component.scss'],
})
export class ShortsVideoPlayer implements OnInit {
  portraitItems:  VideoItem[] = [];
  landscapeItems: VideoItem[] = [];

  portraitSlots:  CarouselSlot[] = [];
  landscapeSlots: CarouselSlot[] = [];

  portraitIndex  = 0;
  landscapeIndex = 0;

  // shift: 0 = rest | -1 = next animating | +1 = prev animating
  portraitShift  = 0;
  landscapeShift = 0;

  portraitNoTransition  = false;
  landscapeNoTransition = false;

  portraitSliding  = false;
  landscapeSliding = false;

  // Center slot index for 7-slot carousel (slots 0-6, center = 3)
  private readonly CENTER = 3;

  constructor(private video: VideoService) {}

  ngOnInit(): void {
    this.video.getVideos().subscribe(videos => {
      this.portraitItems  = videos.filter(v => v.orientation === 'portrait');
      this.landscapeItems = videos.filter(v => v.orientation === 'landscape');
      this.updatePortraitSlots();
      this.updateLandscapeSlots();
    });
  }

  // ── Responsive card widths (must match shortsvideo.component.scss) ──
  get portraitCardWidth(): number {
    if (window.innerWidth <= 480) return 160;
    if (window.innerWidth <= 768) return 200;
    return 270;
  }
  get landscapeCardWidth(): number {
    if (window.innerWidth <= 480) return 200;
    if (window.innerWidth <= 768) return 260;
    return 350;
  }

  // Stage wide enough to show 5 cards (±2 visible, ±3 hidden buffers)
  get portraitStageWidth():  number {
    return Math.min(Math.round(this.portraitCardWidth  * 3.2), window.innerWidth - 40);
  }
  get landscapeStageWidth(): number {
    return Math.min(Math.round(this.landscapeCardWidth * 3.2), window.innerWidth - 40);
  }

  // ── Flat carousel transform (no rotateY, no perspective) ────────
  // Pure translateX + scale only — completely flat, no 3D distortion.
  // tx spacing at 58% of card width gives visible overlapping between cards.
  // Scales: center=1.0, ±1=0.85, ±2=0.72, ±3=0.62 (hidden buffer)
  private covTransform(offset: number, cardWidth: number): string {
    const tx = Math.round(offset * cardWidth * 0.58);
    const s  = offset === 0        ? 1.00
             : Math.abs(offset) === 1 ? 0.85
             : Math.abs(offset) === 2 ? 0.72
             : 0.62;
    return `translateX(calc(-50% + ${tx}px)) translateY(-50%) scale(${s})`;
  }

  getPortraitTransform(slotIndex: number): string {
    return this.covTransform((slotIndex - this.CENTER) + this.portraitShift, this.portraitCardWidth);
  }
  getLandscapeTransform(slotIndex: number): string {
    return this.covTransform((slotIndex - this.CENTER) + this.landscapeShift, this.landscapeCardWidth);
  }

  // Opacity: ±3 (buffer) = 0, ±2 = 0.65, ±1 = 0.90, center = 1
  getPortraitOpacity(slotIndex: number): number {
    const off = Math.abs((slotIndex - this.CENTER) + this.portraitShift);
    return off >= 3 ? 0 : off === 2 ? 0.65 : off === 1 ? 0.90 : 1;
  }
  getLandscapeOpacity(slotIndex: number): number {
    const off = Math.abs((slotIndex - this.CENTER) + this.landscapeShift);
    return off >= 3 ? 0 : off === 2 ? 0.65 : off === 1 ? 0.90 : 1;
  }

  // z-index: center on top, side cards layer behind progressively
  getPortraitZIndex(slotIndex: number): number {
    return Math.max(1, 10 - Math.abs((slotIndex - this.CENTER) + this.portraitShift) * 2);
  }
  getLandscapeZIndex(slotIndex: number): number {
    return Math.max(1, 10 - Math.abs((slotIndex - this.CENTER) + this.landscapeShift) * 2);
  }

  // ── Slot builders (7 slots: center ±3) ────────────────────────
  private wrap(i: number, len: number): number { return ((i % len) + len) % len; }

  private updatePortraitSlots(): void {
    if (!this.portraitItems.length) { this.portraitSlots = []; return; }
    const items = this.portraitItems, i = this.portraitIndex;
    this.portraitSlots = [
      { video: items[this.wrap(i - 3, items.length)], isCenter: false },
      { video: items[this.wrap(i - 2, items.length)], isCenter: false },
      { video: items[this.wrap(i - 1, items.length)], isCenter: false },
      { video: items[this.wrap(i,     items.length)], isCenter: true  },
      { video: items[this.wrap(i + 1, items.length)], isCenter: false },
      { video: items[this.wrap(i + 2, items.length)], isCenter: false },
      { video: items[this.wrap(i + 3, items.length)], isCenter: false },
    ];
  }

  private updateLandscapeSlots(): void {
    if (!this.landscapeItems.length) { this.landscapeSlots = []; return; }
    const items = this.landscapeItems, i = this.landscapeIndex;
    this.landscapeSlots = [
      { video: items[this.wrap(i - 3, items.length)], isCenter: false },
      { video: items[this.wrap(i - 2, items.length)], isCenter: false },
      { video: items[this.wrap(i - 1, items.length)], isCenter: false },
      { video: items[this.wrap(i,     items.length)], isCenter: true  },
      { video: items[this.wrap(i + 1, items.length)], isCenter: false },
      { video: items[this.wrap(i + 2, items.length)], isCenter: false },
      { video: items[this.wrap(i + 3, items.length)], isCenter: false },
    ];
  }

  // ── Core slide ────────────────────────────────────────────────
  private slide(type: 'portrait' | 'landscape', dir: 'next' | 'prev'): void {
    const isP = type === 'portrait';
    const delta = dir === 'next' ? -1 : 1;

    if (isP) { this.portraitSliding  = true; this.portraitShift  = delta; }
    else      { this.landscapeSliding = true; this.landscapeShift = delta; }

    setTimeout(() => {
      if (isP) {
        this.portraitNoTransition = true;
        requestAnimationFrame(() => {
          this.portraitIndex = dir === 'next'
            ? (this.portraitIndex  + 1) % this.portraitItems.length
            : (this.portraitIndex  - 1 + this.portraitItems.length) % this.portraitItems.length;
          this.portraitShift = 0;
          this.updatePortraitSlots();
          requestAnimationFrame(() => {
            this.portraitNoTransition = false;
            setTimeout(() => { this.portraitSliding = false; }, 30);
          });
        });
      } else {
        this.landscapeNoTransition = true;
        requestAnimationFrame(() => {
          this.landscapeIndex = dir === 'next'
            ? (this.landscapeIndex + 1) % this.landscapeItems.length
            : (this.landscapeIndex - 1 + this.landscapeItems.length) % this.landscapeItems.length;
          this.landscapeShift = 0;
          this.updateLandscapeSlots();
          requestAnimationFrame(() => {
            this.landscapeNoTransition = false;
            setTimeout(() => { this.landscapeSliding = false; }, 30);
          });
        });
      }
    }, 480);
  }

  // ── Controls ──────────────────────────────────────────────────
  nextPortrait():  void { if (!this.portraitSliding  && this.portraitItems.length  > 1) this.slide('portrait',  'next'); }
  prevPortrait():  void { if (!this.portraitSliding  && this.portraitItems.length  > 1) this.slide('portrait',  'prev'); }
  nextLandscape(): void { if (!this.landscapeSliding && this.landscapeItems.length > 1) this.slide('landscape', 'next'); }
  prevLandscape(): void { if (!this.landscapeSliding && this.landscapeItems.length > 1) this.slide('landscape', 'prev'); }

  clickPortraitSlot(index: number):  void { if (index < this.CENTER) this.prevPortrait();  else if (index > this.CENTER) this.nextPortrait();  }
  clickLandscapeSlot(index: number): void { if (index < this.CENTER) this.prevLandscape(); else if (index > this.CENTER) this.nextLandscape(); }

  @HostListener('window:resize')
  onResize(): void {
    this.portraitNoTransition = this.landscapeNoTransition = true;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      this.portraitNoTransition = this.landscapeNoTransition = false;
    }));
  }
}
