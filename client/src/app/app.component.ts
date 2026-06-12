import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, NavigationCancel, NavigationError, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ThemeService } from './services/theme.service';
import { InfoBannerService } from './services/info-banner.service';
import { InfoBanner } from './_models/infoBanner';
import { LanguageService } from './services/language.service';

const MIN_INITIAL_MS = 600;
const MIN_NAV_MS     = 300;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'Büezer und KMU Partei';
  showNavbar = true;
  isAdminRoute: boolean = false;
  isLoading = true;

  // Announcement ticker
  banners: InfoBanner[] = [];
  currentBannerIndex = 0;
  bannerState: 'visible' | 'exiting' | 'entering' = 'visible';

  private isFirstNav = true;
  private loadingStartTime = Date.now();
  private hideTimer: any;
  private tickerTimer: any;
  private scrollRevealObserver?: IntersectionObserver;

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private infoBannerService: InfoBannerService,
    public langService: LanguageService
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        clearTimeout(this.hideTimer);
        this.isLoading = true;
        this.loadingStartTime = Date.now();
      } else if (event instanceof NavigationEnd) {
        this.isAdminRoute = event.urlAfterRedirects.startsWith('/admin');
        this.scheduleHide();
      } else if (event instanceof NavigationCancel || event instanceof NavigationError) {
        this.scheduleHide();
      }
    });
  }

  private scheduleHide(): void {
    const min = this.isFirstNav ? MIN_INITIAL_MS : MIN_NAV_MS;
    this.isFirstNav = false;
    const elapsed = Date.now() - this.loadingStartTime;
    this.hideTimer = setTimeout(() => {
      this.isLoading = false;
      setTimeout(() => this.setupScrollReveal(), 100);
    }, Math.max(0, min - elapsed));
  }

  private setupScrollReveal(): void {
    const SELECTOR =
      '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, ' +
      '.scroll-reveal-scale, .scroll-reveal-fade, .stagger';

    if (!this.scrollRevealObserver) {
      this.scrollRevealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-in');
              this.scrollRevealObserver!.unobserve(entry.target);
            }
          });
        },
        { threshold: 0, rootMargin: '0px 0px 600px 0px' }
      );
    }

    document.querySelectorAll(SELECTOR).forEach(el => {
      if (!el.classList.contains('animate-in')) {
        this.scrollRevealObserver!.observe(el);
      }
    });
  }

  private startTicker(): void {
    const tick = () => {
      // Slide current item out
      this.bannerState = 'exiting';

      setTimeout(() => {
        // Advance index and jump to enter position instantly
        this.currentBannerIndex = (this.currentBannerIndex + 1) % this.banners.length;
        this.bannerState = 'entering';

        // One frame later: transition to visible (triggers slide-in animation)
        setTimeout(() => {
          this.bannerState = 'visible';

          // Schedule next tick after this item has been displayed
          this.tickerTimer = setTimeout(tick, 3500);
        }, 40);
      }, 400);
    };

    // First tick after initial display period
    this.tickerTimer = setTimeout(tick, 3500);
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.setupScrollReveal(), 50);
    this.infoBannerService.getBanners().subscribe(banners => {
      this.banners = banners.filter(b => b.isActive);
      if (this.banners.length > 0) this.startTicker();
    });
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const fragment = this.router.parseUrl(this.router.url).fragment;
      if (fragment) {
        setTimeout(() => {
          const element = document.getElementById(fragment);
          if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      } else {
        // Use setTimeout to fire after Angular finishes rendering the new route
        setTimeout(() => {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }, 0);
      }
    });
  }

  ngOnDestroy(): void {
    this.scrollRevealObserver?.disconnect();
    clearTimeout(this.hideTimer);
    clearTimeout(this.tickerTimer);
  }
}
