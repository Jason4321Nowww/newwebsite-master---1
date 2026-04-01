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
  currentLang = 'de';
  currentPage = 1;
  readonly pageSize = 6;
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

  ngOnDestroy(): void { this.langSub?.unsubscribe(); }

  get filtered(): Article[] {
    const term = this.searchTerm.toLowerCase();
    if (!term) return this.articles;
    return this.articles.filter(a => {
      const title = this.langService.getField(a, 'title')?.toLowerCase() ?? '';
      const deBody = a.body.some(b => b.type === 'text' && b.value?.toLowerCase().includes(term));
      const transBody = ((a as any)[`body_${this.currentLang}`] ?? '').toLowerCase().includes(term);
      return title.includes(term) || deBody || transBody;
    });
  }

  get popularArticles(): Article[] { return this.filtered.slice(0, 4); }
  get featuredArticle(): Article | null { return this.popularArticles[0] ?? null; }
  get sideArticles(): Article[] { return this.popularArticles.slice(1); }

  get latestArticles(): Article[] { return this.filtered.slice(4); }
  get totalPages(): number { return Math.ceil(this.latestArticles.length / this.pageSize); }
  get pageNumbers(): number[] { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }

  get paginatedArticles(): Article[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.latestArticles.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openArticle(id: string): void {
    this.router.navigate(['/article', id]);
  }

  getFirstImage(article: Article): string | undefined {
    return article.body.find(b => b.type === 'image' && b.url)?.url;
  }

  getBodyPreview(article: Article, length = 120): string {
    if (this.currentLang !== 'de') {
      const translated: string = (article as any)[`body_${this.currentLang}`] ?? '';
      if (translated.trim()) {
        const div = document.createElement('div');
        div.innerHTML = translated;
        const text = div.textContent ?? '';
        return text.length > length ? text.slice(0, length) + '…' : text;
      }
    }
    const text = article.body.filter(b => b.type === 'text' && b.value).map(b => b.value!).join(' ');
    return text.length > length ? text.slice(0, length) + '…' : text;
  }
}
