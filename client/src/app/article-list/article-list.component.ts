import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Article } from '../_models/article';
import { ArticlesService } from '../services/articles.service';
import { Router } from '@angular/router';
import { LanguageService } from '../services/language.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule],
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit, OnDestroy {
  searchTerm = '';
  articles: Article[] = [];
  currentLang: string = 'de';
  private langSub!: Subscription;

  constructor(
    private articleService: ArticlesService,
    private router: Router,
    public langService: LanguageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentLang = this.langService.current;
    this.langSub = this.langService.lang$.subscribe(lang => {
      this.currentLang = lang;
      this.cdr.markForCheck();
    });
    this.articleService.getArticles().subscribe({
      next: (data) => this.articles = data,
      error: (err) => console.error('Error fetching articles:', err)
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  get filteredArticles(): Article[] {
    const term = this.searchTerm.toLowerCase();
    return this.articles.filter(article => {
      const title = this.langService.getField(article, 'title')?.toLowerCase() ?? '';
      const deBody = article.body.some(b => b.type === 'text' && b.value?.toLowerCase().includes(term));
      const transBody = ((article as any)[`body_${this.currentLang}`] ?? '').toLowerCase().includes(term);
      return title.includes(term) || deBody || transBody;
    });
  }

  getBodyPreview(article: Article): string {
    if (this.currentLang !== 'de') {
      const translated: string = (article as any)[`body_${this.currentLang}`] ?? '';
      if (translated.trim()) {
        const div = document.createElement('div');
        div.innerHTML = translated;
        return (div.textContent ?? '').slice(0, 215) + '...';
      }
    }
    // Fallback: DE blocks plain text
    const deText = article.body
      .filter(b => b.type === 'text' && b.value)
      .map(b => b.value!)
      .join(' ')
      .slice(0, 215);
    return deText + '...';
  }

  openArticle(id: string) {
    if (typeof id === 'string') {
      this.router.navigate(['/article', id]);
    } else {
      console.error('Invalid article ID in openArticle()', id);
    }
  }


  getFirstImage(article: Article): string | undefined {
  const imageBlock = article.body.find(block => block.type === 'image' && block.url);
  return imageBlock?.url;
}



  convertToParagraphs(text?: string): string {
    if (!text) return '';
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const urlRegex = /((https?:\/\/|www\.)[^\s<]+)/g;
    const linkedText = escaped.replace(urlRegex, match => {
      const href = match.startsWith('http') ? match : `https://${match}`;
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${match}</a>`;
    });

    return linkedText
      .split(/\n{2,}/g)
      .map(p => `<p>${p.trim().replace(/\n/g, '<br>')}</p>`)
      .join('');
  }
}
