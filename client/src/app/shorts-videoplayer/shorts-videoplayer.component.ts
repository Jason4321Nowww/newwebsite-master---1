import { Component, QueryList, ViewChildren, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { VideoService } from '../services/video.service';

interface VideoItem {
  title: string;
  videoId: string;
}

@Component({
  selector: 'app-shorts-videoplayer',
  templateUrl: './shorts-videoplayer.component.html',
  styleUrls: ['./shorts-videoplayer.component.scss'],
})
export class ShortsVideoPlayer implements AfterViewInit, OnInit {
  currentIndex = 0;
  landscapeCurrentIndex = 0;

    portraitItems: VideoItem[] = [];
    landscapeItems: VideoItem[] = [];


 @ViewChildren('videoFrame') videoFrames!: QueryList<ElementRef<HTMLIFrameElement>>;
constructor(private video:VideoService){}
  ngAfterViewInit(): void {
    setTimeout(() => this.updateVideoStates(), 0);
  }

  ngOnInit(): void {
    this.video.getVideos().subscribe((videos)=>{
      this.portraitItems = videos.filter(video  =>video.orientation === 'portrait')
       this.landscapeItems = videos.filter(video  =>video.orientation === 'landscape')
    })
  }

selectVideo(index: number) {
  const wrappedIndex = this.getWrappedIndex(index);
  if (wrappedIndex !== this.currentIndex) {
    this.currentIndex = wrappedIndex;
    this.updateVideoStates();
  }
}

  updateVideoStates() {
    const iframes = this.videoFrames.toArray();
    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes[i].nativeElement;
      // const idx = this.currentIndex + i - 1;
      if (i === this.currentIndex) {
        iframe.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        iframe.contentWindow?.postMessage('{"event":"command","func":"unMute","args":""}', '*');
      } else {
        iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        iframe.contentWindow?.postMessage('{"event":"command","func":"mute","args":""}', '*');
      }
    }
  }

  getWrappedIndex(index: number): number {
  const len = this.portraitItems.length;
  return ((index % len) + len) % len;
}
//landscape videos logic
selectLandscapeVideo(index: number) {
  const wrappedIndex = this.getWrappedLandscapeIndex(index);
  if (wrappedIndex !== this.landscapeCurrentIndex) {
    this.landscapeCurrentIndex = wrappedIndex;
    this.updateVideoStates(); // same method will mute/pause all inactive
  }
}

getWrappedLandscapeIndex(index: number): number {
  const len = this.landscapeItems.length;
  return ((index % len) + len) % len;
}


}