import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Action } from '../_models/action';
import { ActionService } from '../services/action.service';
import { LanguageService } from '../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit, OnDestroy {
  allActions: Action[] = [];
  previewAction: Action | null = null;
  selectedMedia: string | null = null;
  private langSub!: Subscription;

  constructor(private action: ActionService, public langService: LanguageService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.langSub = this.langService.lang$.subscribe(() => this.cdr.markForCheck());
    this.action.getAllActions().subscribe(actions => {
      this.allActions = actions.sort(
        (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      );
    });
  }

  ngOnDestroy(): void { this.langSub?.unsubscribe(); }

 openPreview(action: Action) {
  this.previewAction = action;
  this.selectedMedia = action.media?.[0] || null; // Default to the first item
}

selectMedia(item: string) {
  this.selectedMedia = item;
}

  closePreview() {
    this.previewAction = null;
  }

  isImage(file: string): boolean {
  return /\.(jpe?g|png|gif|webp)$/i.test(file);
}

isVideo(file: string): boolean {
  return /\.(mp4|webm|ogg)$/i.test(file);
}




}
