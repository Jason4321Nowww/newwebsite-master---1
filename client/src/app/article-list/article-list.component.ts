import { Component, OnInit } from '@angular/core';
import { Article } from '../_models/article';
import { ArticlesService } from '../services/articles.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule],
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'] // ✅ fixed
})
export class ArticleListComponent implements OnInit {
  searchTerm = '';
  articles: Article[] = [];

  constructor(private articleService: ArticlesService, private router: Router) {}

  ngOnInit(): void {
    this.articleService.getArticles().subscribe({
      next: (data) => this.articles = data,
      error: (err) => console.error('Error fetching articles:', err)
    });
  }

  get filteredArticles(): Article[] {
    const term = this.searchTerm.toLowerCase();
    return this.articles.filter(article =>
      article.title.toLowerCase().includes(term) ||
      article.body.some(block =>
        block.type === 'text' &&
        block.value &&
        block.value.toLowerCase().includes(term)
      )
    );
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
