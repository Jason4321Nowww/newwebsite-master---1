import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Article } from '../_models/article';
import { ActivatedRoute } from '@angular/router';
import { ArticlesService } from '../services/articles.service';
import { LanguageService } from '../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent implements OnInit, OnDestroy {

  article?: Article;
  currentLang: string = 'de';
  private langSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticlesService,
    public langService: LanguageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentLang = this.langService.current;

    this.langSub = this.langService.lang$.subscribe(lang => {
      this.currentLang = lang;
      this.cdr.markForCheck();
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.articleService.getArticleById(id).subscribe({
        next: (data) => this.article = data,
        error: (err) => {
          console.error('Error fetching article:', err);
          alert('Article not found');
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  getTranslatedBody(): string {
    if (!this.article) return '';
    if (this.currentLang === 'de') return '';
    // Return translation if available, empty string triggers DE fallback in template
    return (this.article as any)[`body_${this.currentLang}`] || '';
  }

  convertToParagraphs(text?: string): string {
    if (!text) return '';

    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const urlRegex = /((https?:\/\/|www\.)[^\s<]+)/g;
    const linkedText = escaped.replace(urlRegex, (match) => {
      const href = match.startsWith('http') ? match : `https://${match}`;
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${match}</a>`;
    });

    return linkedText
      .split(/\n{2,}/g)
      .map(p => `<p>${p.trim().replace(/\n/g, '<br>')}</p>`)
      .join('');
  }
}
