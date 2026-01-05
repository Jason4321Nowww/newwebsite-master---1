// src/app/admin-articles/admin-articles.component.ts
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ArticlesService } from '../admin-services/articles.service';



@Component({
  selector: 'app-admin-articles',
  templateUrl: './admin-articles.component.html',
  styleUrls: ['./admin-articles.component.scss']
})
export class AdminArticlesComponent implements OnInit,  AfterViewInit, AfterViewChecked {
  @ViewChild('descriptionTextarea') descriptionTextareaRef!: ElementRef<HTMLTextAreaElement>;
  articleForm: FormGroup;
  filesMap: Map<number, File> = new Map(); // map blockIndex -> File
  filePreviews: Map<number, string> = new Map(); // blockIndex -> dataURL
  articles: any[] = [];
  editingArticleId: string | null = null;

  constructor(private fb: FormBuilder, public svc: ArticlesService) {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      author: [''],
      blocks: this.fb.array([], Validators.required)
    });
  }

  ngOnInit() { this.loadArticles(); }

    ngAfterViewInit(): void {
    setTimeout(() => this.autoGrowTextarea(), 100);
  }

  ngAfterViewChecked(): void {
    this.autoGrowTextarea();
  }

  // Helpers
  get blocks(): FormArray { return this.articleForm.get('blocks') as FormArray; }

  loadArticles() {
    this.svc.getArticles().subscribe(res => this.articles = res, err => console.error(err));
  }

  deleteArticle(id: string) {
  this.svc.deleteArticle(id).subscribe(() => {
    this.loadArticles();     // reload article list
  });
}

  // Add text block
  addTextBlock(text = '') {
    const fg = this.fb.group({
      type: ['text'],
      value: [text, Validators.required],
      url: ['']
    });
    this.blocks.push(fg);
  }

  // Add image block (placeholder)
  addImageBlock() {
    const fg = this.fb.group({
      type: ['image'],
      value: [''],
      url: [''] // server will fill url after upload
    });
    this.blocks.push(fg);
  }

  removeBlock(index: number) {
    this.blocks.removeAt(index);
    this.filesMap.delete(index);
    this.filePreviews.delete(index);
    // shift keys in maps down by one to keep alignment
    const newFiles = new Map<number, File>();
    const newPreviews = new Map<number, string>();
    Array.from(this.filesMap.keys()).sort((a,b)=>a-b).forEach(k => {
      const newIndex = k > index ? k - 1 : k;
      if (this.filesMap.get(k)) newFiles.set(newIndex, this.filesMap.get(k)!);
      if (this.filePreviews.get(k)) newPreviews.set(newIndex, this.filePreviews.get(k)!);
    });
    this.filesMap = newFiles;
    this.filePreviews = newPreviews;
  }

  onFileSelected(e: Event, blockIndex: number) {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.filesMap.set(blockIndex, file);

    // preview
    const reader = new FileReader();
    reader.onload = () => this.filePreviews.set(blockIndex, reader.result as string);
    reader.readAsDataURL(file);
  }

  editArticle(article: any) {
    this.editingArticleId = article.id;
    this.articleForm.patchValue({ title: article.title, author: article.author || '' });
    // reset blocks
    while (this.blocks.length) this.blocks.removeAt(0);
    this.filesMap.clear();
    this.filePreviews.clear();

    article.body.forEach((b: any) => {
      const fg = this.fb.group({ type: [b.type], value: [b.value || ''], url: [b.url || ''] });
      this.blocks.push(fg);
      // For image blocks that already have a url, we won't have a file in filesMap.
      if (b.type === 'image' && b.url) {
        this.filePreviews.set(this.blocks.length - 1, `http://localhost:5000${b.url}`);
      }
    });
    setTimeout(() => this.autoGrowTextarea(), 50);
  }

  cancelEdit() {
    this.editingArticleId = null;
    this.articleForm.reset();
    while (this.blocks.length) this.blocks.removeAt(0);
    this.filesMap.clear();
    this.filePreviews.clear();
  }

 autoGrow(event: any): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  autoGrowTextarea(): void {
    if (this.descriptionTextareaRef?.nativeElement) {
      const textarea = this.descriptionTextareaRef.nativeElement;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }






  submit() {
    if (this.articleForm.invalid) { alert('Please fill title and text blocks.'); return; }

    const payloadBlocks = this.blocks.controls.map((ctrl, idx) => {
      const val = ctrl.value;
      // For image blocks with a selected File, set url to empty string (server will fill).
      if (val.type === 'image') {
        return { type: 'image', url: val.url || '' };
      }
      return { type: 'text', value: val.value };
    });

    const formData = new FormData();
    formData.append('title', this.articleForm.get('title')?.value);
    formData.append('author', this.articleForm.get('author')?.value || '');
    formData.append('body', JSON.stringify(payloadBlocks));

    // Append files in order of block indexes (server will map in-order to empty image blocks)
    Array.from(this.filesMap.keys()).sort((a,b)=>a-b).forEach(idx => {
      const f = this.filesMap.get(idx);
      if (f) formData.append('images', f);
    });

    const obs = this.editingArticleId
      ? this.svc.updateArticle(this.editingArticleId, formData)
      : this.svc.createArticle(formData);

    obs.subscribe({
      next: () => { alert('Saved'); this.cancelEdit(); this.loadArticles(); },
      error: err => {
        console.error(err);
        alert('Save failed');
      }
    });
  }

  // Utility to create initial demo block quickly
  addSample() {
    this.addTextBlock('First paragraph...');
    this.addImageBlock();
    this.addTextBlock('Second paragraph...');
  }
}
