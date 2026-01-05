import { NgModule } from '@angular/core';
import { ShortsVideo } from '../shortsvideo/shortsvideo.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ShortsVideo],
  imports: [CommonModule],
  exports: [ShortsVideo],
})
export class ShortsVideoPlayerModule {}
