import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-titlescreen',
  templateUrl: './titlescreen.component.html',
  styleUrls: ['./titlescreen.component.scss'],
})
export class TitlescreenComponent implements OnInit, OnDestroy {
  items = [
    {
      id: 1,
      type: 'video',
      src: '/assets/videos/movie.mp4',
      caption: 'Jung, frisch bürgernah',
    },
    {
      id: 2,
      type: 'image',
      src: 'https://bkps.ch/IMG/slider/gruppenfoto2.webp',
      caption: 'Für unsere Rechte',
    },
   {
      id: 3,
      type: 'image',
      src: 'https://bkps.ch/IMG/slider/gruppenfoto2.webp',
      caption: 'Für unsere Rechte',
    },
     {
      id: 4,
      type: 'image',
      src: 'https://bkps.ch/IMG/slider/gruppenfoto2.webp',
      caption: 'Für unsere Rechte',
    },
        {
      id: 5,
      type: 'image',
      src: 'https://bkps.ch/IMG/slider/gruppenfoto2.webp',
      caption: 'Jung, frisch bürgernah',
    },
  ];

  currentIndex = 0;
  interval: any;
  slideDuration = 10000; // default for images

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  startAutoSlide(): void {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, this.slideDuration);
  }

  resetAutoSlide(): void {
    clearInterval(this.interval);
    this.startAutoSlide();
  }

  setVideoDuration(event: Event): void {
    const video = event.target as HTMLVideoElement;
    this.slideDuration = Math.min(video.duration * 1000, 60000);
    this.resetAutoSlide();
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
  }

  prevSlide(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.items.length) % this.items.length;
  }
  
goToSlide(index: number): void {
  this.currentIndex = index;
  this.resetAutoSlide();
}

  trackByFn(index: number, item: any): number {
    return item.id;
  }
}
