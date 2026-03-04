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

  // Stage wide enough to show peeking side cards
  get portraitStageWidth():  number { return Math.round(this.portraitCardWidth  * 2.4); }
  get landscapeStageWidth(): number { return Math.round(this.landscapeCardWidth * 2.4); }

  // ── 3D Coverflow transform ────────────────────────────────────
  // IMPORTANT: NO perspective() function here.
  // Perspective comes from the CSS `perspective: 800px` property on
  // the .carousel1-stage container — that gives all cards a SHARED
  // vanishing point (true coverflow). Using perspective() per-element
  // gives each card its own vanishing point → "opened book" artifact.
  //
  // top:50% + translateY(-50%) centres cards vertically in the stage.
  // tx   : horizontal offset so cards overlap behind the center card
  // ry   : gentle 22° tilt per step (NOT 50°!)
  // s    : scale: center=1.0, ±1=0.88, ±2=0.72
  private covTransform(offset: number, cardWidth: number): string {
    const tx = Math.round(offset * cardWidth * 0.65);
    const ry = Math.sign(offset) * Math.min(50, Math.abs(offset) * 22);
    const s  = offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.88 : 0.72;
    return `translateX(calc(-50% + ${tx}px)) translateY(-50%) rotateY(${ry}deg) scale(${s})`;
  }

  getPortraitTransform(slotIndex: number): string {
    return this.covTransform((slotIndex - 2) + this.portraitShift, this.portraitCardWidth);
  }
  getLandscapeTransform(slotIndex: number): string {
    return this.covTransform((slotIndex - 2) + this.landscapeShift, this.landscapeCardWidth);
  }

  // Opacity: ±2=hidden(buffer), ±1=dimmed, 0=full
  getPortraitOpacity(slotIndex: number): number {
    const off = Math.abs((slotIndex - 2) + this.portraitShift);
    return off >= 2 ? 0 : off === 1 ? 0.78 : 1;
  }
  getLandscapeOpacity(slotIndex: number): number {
    const off = Math.abs((slotIndex - 2) + this.landscapeShift);
    return off >= 2 ? 0 : off === 1 ? 0.78 : 1;
  }

  // z-index: center on top, ±2 behind everything
  getPortraitZIndex(slotIndex: number): number {
    return Math.max(1, 10 - Math.abs((slotIndex - 2) + this.portraitShift) * 3);
  }
  getLandscapeZIndex(slotIndex: number): number {
    return Math.max(1, 10 - Math.abs((slotIndex - 2) + this.landscapeShift) * 3);
  }

  // ── Slot builders ─────────────────────────────────────────────
  private wrap(i: number, len: number): number { return ((i % len) + len) % len; }

  private updatePortraitSlots(): void {
    if (!this.portraitItems.length) { this.portraitSlots = []; return; }
    const items = this.portraitItems, i = this.portraitIndex;
    this.portraitSlots = [
      { video: items[this.wrap(i - 2, items.length)], isCenter: false },
      { video: items[this.wrap(i - 1, items.length)], isCenter: false },
      { video: items[this.wrap(i,     items.length)], isCenter: true  },
      { video: items[this.wrap(i + 1, items.length)], isCenter: false },
      { video: items[this.wrap(i + 2, items.length)], isCenter: false },
    ];
  }

  private updateLandscapeSlots(): void {
    if (!this.landscapeItems.length) { this.landscapeSlots = []; return; }
    const items = this.landscapeItems, i = this.landscapeIndex;
    this.landscapeSlots = [
      { video: items[this.wrap(i - 2, items.length)], isCenter: false },
      { video: items[this.wrap(i - 1, items.length)], isCenter: false },
      { video: items[this.wrap(i,     items.length)], isCenter: true  },
      { video: items[this.wrap(i + 1, items.length)], isCenter: false },
      { video: items[this.wrap(i + 2, items.length)], isCenter: false },
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

  clickPortraitSlot(index: number):  void { if (index < 2) this.prevPortrait();  else if (index > 2) this.nextPortrait();  }
  clickLandscapeSlot(index: number): void { if (index < 2) this.prevLandscape(); else if (index > 2) this.nextLandscape(); }

  @HostListener('window:resize')
  onResize(): void {
    this.portraitNoTransition = this.landscapeNoTransition = true;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      this.portraitNoTransition = this.landscapeNoTransition = false;
    }));
  }
}
