import { Component, OnInit } from '@angular/core';
import { Action } from '../_models/action';
import { ActionService } from '../services/action.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {
  allActions: Action[] = [];
  previewAction: Action | null = null;
  selectedMedia: string | null = null;

  constructor(private action: ActionService) {}

  ngOnInit(): void {
    this.action.getAllActions().subscribe(actions => {
      this.allActions = actions.sort(
        (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      );
    });
  }

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
