// src/app/admin-articles/admin-articles.component.ts
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ArticlesService } from '../admin-services/articles.service';

type Block = { type: 'text' | 'image'; value: string; url: string };

@Component({
  selector: 'app-admin-articles',
  templateUrl: './admin-articles.component.html',
  styleUrls: ['./admin-articles.component.scss']
})
export class AdminArticlesComponent implements OnInit, AfterViewInit {
  @ViewChild('descriptionTextarea') descriptionTextareaRef!: ElementRef<HTMLTextAreaElement>;
  articleForm: FormGroup;

  // DE blocks (FormArray)
  filesMap: Map<number, File> = new Map();
  filePreviews: Map<number, string> = new Map();

  // Translation blocks (IT/FR/EN) — plain arrays, converted to HTML on submit
  langBlocks: Record<string, Block[]> = { it: [], fr: [], en: [] };
  langFilesMap: Record<string, Map<number, File>> = {
    it: new Map(), fr: new Map(), en: new Map()
  };
  langFilePreviews: Record<string, Map<number, string>> = {
    it: new Map(), fr: new Map(), en: new Map()
  };

  articles: any[] = [];
  editingArticleId: string | null = null;
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


  constructor(private fb: FormBuilder, public svc: ArticlesService) {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      title_it: [''],
      title_fr: [''],
      title_en: [''],
      author: [''],
      blocks: this.fb.array([], Validators.required),
    });
  }

  ngOnInit() { this.loadArticles(); }

  ngAfterViewInit(): void {
    setTimeout(() => this.autoGrowTextarea(), 100);
  }

  get blocks(): FormArray { return this.articleForm.get('blocks') as FormArray; }

  onLangChange(lang: string): void {
    this.activeLang = lang;
    if (!this.selectedLangs.includes(lang)) {
      this.selectedLangs.push(lang);
    }
  }

  removeLang(lang: string): void {
    if (lang === 'de') return;
    this.selectedLangs = this.selectedLangs.filter(l => l !== lang);
    this.langBlocks[lang] = [];
    this.langFilesMap[lang] = new Map();
    this.langFilePreviews[lang] = new Map();
    const patch: any = {};
    patch[`title_${lang}`] = '';
    this.articleForm.patchValue(patch);
    if (this.activeLang === lang) {
      this.activeLang = 'de';
    }
  }

  // ── DE blocks ─────────────────────────────────────────────────────────────

  addTextBlock(text = '') {
    this.blocks.push(this.fb.group({ type: ['text'], value: [text, Validators.required], url: [''] }));
  }

  addImageBlock() {
    this.blocks.push(this.fb.group({ type: ['image'], value: [''], url: [''] }));
  }

  addSample() {
    this.addTextBlock('First paragraph...');
    this.addImageBlock();
    this.addTextBlock('Second paragraph...');
  }

  removeBlock(index: number) {
    this.blocks.removeAt(index);
    this.filesMap.delete(index);
    this.filePreviews.delete(index);
    const newFiles = new Map<number, File>();
    const newPreviews = new Map<number, string>();
    Array.from(this.filesMap.keys()).sort((a, b) => a - b).forEach(k => {
      const ni = k > index ? k - 1 : k;
      const f = this.filesMap.get(k); if (f) newFiles.set(ni, f);
      const p = this.filePreviews.get(k); if (p) newPreviews.set(ni, p);
    });
    this.filesMap = newFiles;
    this.filePreviews = newPreviews;
  }

  onFileSelected(e: Event, blockIndex: number) {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    this.filesMap.set(blockIndex, file);
    const reader = new FileReader();
    reader.onload = () => this.filePreviews.set(blockIndex, reader.result as string);
    reader.readAsDataURL(file);
  }

  // ── Translation blocks (IT/FR/EN) ─────────────────────────────────────────

  addLangTextBlock(lang: string, text = '') {
    this.langBlocks[lang].push({ type: 'text', value: text, url: '' });
  }

  addLangImageBlock(lang: string) {
    this.langBlocks[lang].push({ type: 'image', value: '', url: '' });
  }

  addLangSample(lang: string) {
    this.addLangTextBlock(lang, 'First paragraph...');
    this.addLangImageBlock(lang);
    this.addLangTextBlock(lang, 'Second paragraph...');
  }

  removeLangBlock(lang: string, index: number) {
    this.langBlocks[lang].splice(index, 1);
    this.langFilesMap[lang].delete(index);
    this.langFilePreviews[lang].delete(index);
    const newFiles = new Map<number, File>();
    const newPreviews = new Map<number, string>();
    Array.from(this.langFilesMap[lang].keys()).sort((a, b) => a - b).forEach(k => {
      const ni = k > index ? k - 1 : k;
      const f = this.langFilesMap[lang].get(k); if (f) newFiles.set(ni, f);
      const p = this.langFilePreviews[lang].get(k); if (p) newPreviews.set(ni, p);
    });
    this.langFilesMap[lang] = newFiles;
    this.langFilePreviews[lang] = newPreviews;
  }

  onLangFileSelected(e: Event, lang: string, blockIndex: number) {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    this.langFilesMap[lang].set(blockIndex, file);
    const reader = new FileReader();
    reader.onload = () => this.langFilePreviews[lang].set(blockIndex, reader.result as string);
    reader.readAsDataURL(file);
  }

  // ── Article CRUD ──────────────────────────────────────────────────────────

  loadArticles() {
    this.svc.getArticles().subscribe(res => this.articles = res, err => console.error(err));
  }

  deleteArticle(id: string) {
    this.svc.deleteArticle(id).subscribe(() => this.loadArticles());
  }

  editArticle(article: any) {
    this.editingArticleId = article.id;
    this.articleForm.patchValue({
      title: article.title,
      title_it: article.title_it || '',
      title_fr: article.title_fr || '',
      title_en: article.title_en || '',
      author: article.author || '',
    });

    // Restore DE blocks
    while (this.blocks.length) this.blocks.removeAt(0);
    this.filesMap.clear(); this.filePreviews.clear();
    (article.body || []).forEach((b: any) => {
      this.blocks.push(this.fb.group({ type: [b.type], value: [b.value || ''], url: [b.url || ''] }));
      if (b.type === 'image' && b.url) {
        this.filePreviews.set(this.blocks.length - 1, `${b.url}`);
      }
    });

    // Restore translation blocks by parsing HTML
    ['it', 'fr', 'en'].forEach(lang => {
      this.langBlocks[lang] = this.parseHtmlToBlocks(article[`body_${lang}`] || '');
      this.langFilesMap[lang] = new Map();
      this.langFilePreviews[lang] = new Map();
    });

    // Show chips for langs that have content
    this.selectedLangs = ['de'];
    ['it', 'fr', 'en'].forEach(lang => {
      if (this.langBlocks[lang].length > 0 || article[`title_${lang}`]) {
        this.selectedLangs.push(lang);
      }
    });

    setTimeout(() => this.autoGrowTextarea(), 50);
  }

  cancelEdit() {
    this.editingArticleId = null;
    this.activeLang = 'de';
    this.selectedLangs = ['de'];
    this.articleForm.reset();
    while (this.blocks.length) this.blocks.removeAt(0);
    this.filesMap.clear(); this.filePreviews.clear();
    ['it', 'fr', 'en'].forEach(lang => {
      this.langBlocks[lang] = [];
      this.langFilesMap[lang] = new Map();
      this.langFilePreviews[lang] = new Map();
    });
  }

  submit() {
    if (this.articleForm.invalid) { alert('Please fill title and text blocks.'); return; }

    const payloadBlocks = this.blocks.controls.map(ctrl => {
      const val = ctrl.value;
      if (val.type === 'image') return { type: 'image', url: val.url || '' };
      return { type: 'text', value: val.value };
    });

    const formData = new FormData();
    formData.append('title', this.articleForm.get('title')?.value);
    formData.append('title_it', this.articleForm.get('title_it')?.value || '');
    formData.append('title_fr', this.articleForm.get('title_fr')?.value || '');
    formData.append('title_en', this.articleForm.get('title_en')?.value || '');
    formData.append('author', this.articleForm.get('author')?.value || '');
    formData.append('body', JSON.stringify(payloadBlocks));

    // Convert translation blocks to HTML
    ['it', 'fr', 'en'].forEach(lang => {
      formData.append(`body_${lang}`, this.langBlocksToHtml(lang));
    });

    // DE images
    Array.from(this.filesMap.keys()).sort((a, b) => a - b).forEach(idx => {
      const f = this.filesMap.get(idx);
      if (f) formData.append('images', f);
    });

    // Translation images
    ['it', 'fr', 'en'].forEach(lang => {
      Array.from(this.langFilesMap[lang].keys()).sort((a, b) => a - b).forEach(idx => {
        const f = this.langFilesMap[lang].get(idx);
        if (f) formData.append(`images_${lang}`, f);
      });
    });

    const obs = this.editingArticleId
      ? this.svc.updateArticle(this.editingArticleId, formData)
      : this.svc.createArticle(formData);

    obs.subscribe({
      next: () => { alert('Saved'); this.cancelEdit(); this.loadArticles(); },
      error: err => { console.error(err); alert('Save failed'); }
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private langBlocksToHtml(lang: string): string {
    return this.langBlocks[lang].map(b => {
      if (b.type === 'text') return `<p>${b.value}</p>`;
      if (b.type === 'image' && b.url) return `<img src="${b.url}" />`;
      return '';
    }).filter(s => s).join('');
  }

  private parseHtmlToBlocks(html: string): Block[] {
    if (!html) return [];
    const div = document.createElement('div');
    div.innerHTML = html;
    const blocks: Block[] = [];
    div.childNodes.forEach(node => {
      if (node.nodeName === 'P') {
        blocks.push({ type: 'text', value: (node as HTMLElement).innerText || node.textContent || '', url: '' });
      } else if (node.nodeName === 'IMG') {
        const src = (node as HTMLImageElement).src || '';
        const url = src.replace('', '');
        blocks.push({ type: 'image', value: '', url });
      }
    });
    return blocks;
  }

  autoGrow(event: any): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  autoGrowTextarea(): void {
    if (this.descriptionTextareaRef?.nativeElement) {
      const ta = this.descriptionTextareaRef.nativeElement;
      ta.style.height = 'auto';
      ta.style.height = ta.scrollHeight + 'px';
    }
  }
}
