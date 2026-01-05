import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Action } from 'src/app/_models/action';
import { AdminactionService } from '../admin-services/adminaction.service';

@Component({
  selector: 'app-admin-action',
  templateUrl: './admin-action.component.html',
  styleUrls: ['./admin-action.component.scss']
})
export class AdminActionComponent implements OnInit {
  actions: Action[] = [];
  actionForm!: FormGroup;
  isEditing = false;
  selectedId: string | null = null;
  selectedMedia: File[] = [];
  previewUrls: string[] = [];
  existingMedia: string[] = [];

  constructor(private adminAction: AdminactionService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadActions();
  }

  initForm() {
    this.actionForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      media: [null]
    });
  }

  loadActions() {
    this.adminAction.getAllActions().subscribe(res => this.actions = res);
  }

  onMediaSelected(event: any) {
    const files: FileList = event.target.files;
    this.selectedMedia = Array.from(files);
    this.previewUrls = [];

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => this.previewUrls.push(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  submitForm() {
    if (this.actionForm.invalid) return;

    const formData = new FormData();
    formData.append('title', this.actionForm.value.title);
    formData.append('description', this.actionForm.value.description);
    this.selectedMedia.forEach(file =>{
      console.log('Uploading:', file.name, file.type)
      formData.append('media', file)}); // field name should match multer array name

    const request = this.isEditing && this.selectedId
      ? this.adminAction.updateAction(this.selectedId, formData)
      : this.adminAction.createAction(formData);

    request.subscribe(() => {
      this.resetForm();
      this.loadActions();
    });
  }

  editAction(action: Action) {
    this.isEditing = true;
    this.selectedId = action._id || null;
    this.existingMedia = action.media || [];

    this.actionForm.patchValue({
      title: action.title,
      description: action.description
    });

    this.previewUrls = [...this.existingMedia.map(url => 'http://localhost:5000' + url)];
    this.selectedMedia = [];
  }

  deleteAction(id: string) {
    if (confirm('Are you sure you want to delete this action?')) {
      this.adminAction.deleteAction(id).subscribe(() => this.loadActions());
    }
  }

  resetForm() {
    this.actionForm.reset();
    this.isEditing = false;
    this.selectedId = null;
    this.previewUrls = [];
    this.selectedMedia = [];
    this.existingMedia = [];
  }

  isImage(fileUrl: string): boolean {
    return /\.(jpe?g|png|gif|webp)$/i.test(fileUrl);
  }

  isVideo(fileUrl: string): boolean {
    return /\.(mp4|webm|ogg)$/i.test(fileUrl);
  }
}
