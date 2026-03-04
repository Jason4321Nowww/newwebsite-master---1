import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { InfoBanner } from 'src/app/_models/infoBanner';
import { InfoBannerService } from '../services/info-banner.service';
import { LanguageService } from '../services/language.service';
import { ArticlesService } from '../services/articles.service';
import { Article } from '../_models/article';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  activeBanner: InfoBanner | null = null;
  latestArticles: Article[] = [];
  private revealObserver?: IntersectionObserver;

  constructor(
    private infoBanner: InfoBannerService,
    public langService: LanguageService,
    private articleService: ArticlesService,
    private router: Router,
    private elRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.infoBanner.getBanners().subscribe(banners => {
      this.activeBanner = banners.find(b => b.isActive) || null;
    });

    this.articleService.getArticles().subscribe({
      next: (articles) => {
        this.latestArticles = articles.slice(0, 3);
        // Observe the articles section after it's rendered into the DOM
        setTimeout(() => this.observeRevealElements(), 0);
      },
      error: (err) => console.error('Error fetching articles:', err)
    });
  }

  ngAfterViewInit(): void {
    this.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this.revealObserver?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    this.observeRevealElements();
  }

  private observeRevealElements(): void {
    if (!this.revealObserver) return;
    this.elRef.nativeElement.querySelectorAll('.reveal:not(.visible)').forEach((el: Element) => {
      this.revealObserver!.observe(el);
    });
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
  }

  openArticle(id: string): void {
    this.router.navigate(['/article', id]);
  }

  getFirstImage(article: Article): string | undefined {
    if (article.imageUrls?.length) return article.imageUrls[0];
    return article.body.find(b => b.type === 'image' && b.url)?.url;
  }

  getExcerpt(article: Article): string {
    const firstText = article.body.find(b => b.type === 'text' && b.value);
    if (!firstText?.value) return '';
    return firstText.value.length > 120
      ? firstText.value.slice(0, 120).trimEnd() + '…'
      : firstText.value;
  }
}
