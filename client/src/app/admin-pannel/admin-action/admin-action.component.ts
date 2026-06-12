import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
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
  activeLang: string = 'de';
  readonly langMeta: Record<string, { label: string; flag: string }> = {
    de: { label: 'Deutsch (DE)', flag: 'assets/images/flags/de.svg' },
    it: { label: 'Italiano (IT)', flag: 'assets/images/flags/it.svg' },
    fr: { label: 'Français (FR)', flag: 'assets/images/flags/fr.svg' },
    en: { label: 'English (EN)', flag: 'assets/images/flags/gb.svg' },
  };
  selectedLangs: string[] = ['de'];

  showLangDropdown = false;

  get availableLangs(): string[] {
    return ['de', 'it', 'fr', 'en'].filter(l => !this.selectedLangs.includes(l));
  }

  @HostListener('document:click')
  closeLangDropdown(): void {
    this.showLangDropdown = false;
  }

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  selectedMedia: File[] = [];
  previewUrls: string[] = [];
  existingMedia: string[] = [];

  uploadProgress: number | null = null;
  uploadDone = false;
  isUploading = false;
  uploadError: string | null = null;
  successMessage: string | null = null;

  private readonly MAX_FILE_MB = 10;
  private readonly MAX_FILE_BYTES = this.MAX_FILE_MB * 1024 * 1024;
  private readonly MAX_FILE_COUNT = 20;

  constructor(private adminAction: AdminactionService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadActions();
  }

  initForm() {
    this.actionForm = this.fb.group({
      title: ['', Validators.required],
      title_it: [''],
      title_fr: [''],
      title_en: [''],
      description: ['', Validators.required],
      description_it: [''],
      description_fr: [''],
      description_en: [''],
      media: [null]
    });
  }

  loadActions() {
    this.adminAction.getAllActions().subscribe(res => this.actions = res);
  }

  onLangChange(lang: string): void {
    this.activeLang = lang;
    if (!this.selectedLangs.includes(lang)) {
      this.selectedLangs.push(lang);
    }
  }

  removeLang(lang: string): void {
    if (lang === 'de') return;
    this.selectedLangs = this.selectedLangs.filter(l => l !== lang);
    const patch: any = {};
    patch[`title_${lang}`] = '';
    patch[`description_${lang}`] = '';
    this.actionForm.patchValue(patch);
    if (this.activeLang === lang) this.activeLang = 'de';
  }

  onMediaSelected(event: any) {
    const files: FileList = event.target.files;
    this.uploadError = null;

    if (files.length > this.MAX_FILE_COUNT) {
      this.uploadError = `Too many files. Maximum is ${this.MAX_FILE_COUNT} files at once (you selected ${files.length}).`;
      (event.target as HTMLInputElement).value = '';
      this.selectedMedia = [];
      this.previewUrls = [];
      return;
    }

    const oversized = Array.from(files).filter(f => f.size > this.MAX_FILE_BYTES);
    if (oversized.length > 0) {
      const names = oversized.map(f => `${f.name} (${(f.size / 1024 / 1024).toFixed(1)} MB)`).join(', ');
      this.uploadError = `File(s) exceed the ${this.MAX_FILE_MB} MB limit: ${names}`;
      (event.target as HTMLInputElement).value = '';
      this.selectedMedia = [];
      this.previewUrls = [];
      return;
    }

    this.selectedMedia = Array.from(files);
    this.previewUrls = [];

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => this.previewUrls.push(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  submitForm() {
    this.actionForm.markAllAsTouched();
    const title = (this.actionForm.value.title || '').trim();
    const description = (this.actionForm.value.description || '').trim();
    if (!title || !description) {
      this.uploadError = 'Title and description are required.';
      return;
    }
    if (!this.isEditing && this.selectedMedia.length === 0) {
      this.uploadError = 'Please select at least one image or video.';
      return;
    }
    this.uploadError = null;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('title_it', (this.actionForm.value.title_it || '').trim());
    formData.append('title_fr', (this.actionForm.value.title_fr || '').trim());
    formData.append('title_en', (this.actionForm.value.title_en || '').trim());
    formData.append('description', description);
    formData.append('description_it', (this.actionForm.value.description_it || '').trim());
    formData.append('description_fr', (this.actionForm.value.description_fr || '').trim());
    formData.append('description_en', this.actionForm.value.description_en || '');
    this.selectedMedia.forEach(file =>{
      console.log('Uploading:', file.name, file.type)
      formData.append('media', file)}); // field name should match multer array name

    this.isUploading = true;
    this.uploadProgress = 0;
    this.uploadDone = false;
    this.uploadError = null;
    this.successMessage = null;

    const request = this.isEditing && this.selectedId
      ? this.adminAction.updateAction(this.selectedId, formData)
      : this.adminAction.createAction(formData);

    request.pipe(timeout(120000)).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = event.total
            ? Math.round(100 * event.loaded / event.total)
            : 0;
        } else if (event.type === HttpEventType.Response) {
          this.uploadProgress = 100;
          this.uploadDone = true;
          this.isUploading = false;
          const label = this.isEditing ? 'updated' : 'created';
          setTimeout(() => {
            this.uploadProgress = null;
            this.uploadDone = false;
            this.successMessage = `Action ${label} successfully!`;
            this.resetForm();
            this.loadActions();
            setTimeout(() => { this.successMessage = null; }, 4000);
          }, 1000);
        }
      },
      error: (err) => {
        this.isUploading = false;
        this.uploadProgress = null;
        this.uploadDone = false;
        console.error('Upload error:', err);
        if (err?.name === 'TimeoutError') {
          this.uploadError = 'Upload timed out. The server did not respond. Please try again.';
        } else if (err?.error?.message) {
          this.uploadError = err.error.message;
        } else if (err?.error?.error) {
          this.uploadError = err.error.error;
        } else if (typeof err?.error === 'string' && err.error.length) {
          this.uploadError = err.error;
        } else if (err?.message) {
          this.uploadError = err.message;
        } else if (err?.statusText) {
          this.uploadError = `Server error: ${err.statusText}`;
        } else {
          this.uploadError = 'Upload failed. Please try again.';
        }
      }
    });
  }

  editAction(action: Action) {
    this.isEditing = true;
    this.selectedId = action._id || null;
    this.existingMedia = action.media || [];

    this.actionForm.patchValue({
      title: action.title,
      title_it: action.title_it || '',
      title_fr: action.title_fr || '',
      title_en: action.title_en || '',
      description: action.description,
      description_it: action.description_it || '',
      description_fr: action.description_fr || '',
      description_en: action.description_en || '',
    });

    this.previewUrls = [...this.existingMedia.map(url => '' + url)];
    this.selectedMedia = [];

    this.activeLang = 'de';
    this.selectedLangs = ['de'];
    ['it', 'fr', 'en'].forEach(lang => {
      if (action[`title_${lang}` as keyof Action] || action[`description_${lang}` as keyof Action]) {
        this.selectedLangs.push(lang);
      }
    });
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
    this.activeLang = 'de';
    this.selectedLangs = ['de'];
    if (this.fileInput) this.fileInput.nativeElement.value = '';
  }

  isImage(fileUrl: string): boolean {
    return /\.(jpe?g|png|gif|webp)$/i.test(fileUrl);
  }

  isVideo(fileUrl: string): boolean {
    return /\.(mp4|webm|ogg)$/i.test(fileUrl);
  }
}
