import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, NavigationCancel, NavigationError, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ThemeService } from './services/theme.service';

const MIN_INITIAL_MS = 1800; // first page load — long enough for assets
const MIN_NAV_MS     = 500;  // subsequent in-app navigations

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Büezer und KMU Partei';
  showNavbar = true;
  isAdminRoute: boolean = false;
  isLoading = true;

  private isFirstNav = true;
  private loadingStartTime = Date.now();
  private hideTimer: any;
  private scrollRevealObserver?: IntersectionObserver;

constructor(
    private router: Router,
    private themeService: ThemeService
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
      // Re-scan for new scroll-reveal elements after page transition completes
      setTimeout(() => this.setupScrollReveal(), 100);
    }, Math.max(0, min - elapsed));
  }

  /** Creates (or re-uses) a global IntersectionObserver that adds
   *  `.animate-in` to any element carrying a scroll-reveal utility class. */
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
        { threshold: 0.1 }
      );
    }

    // Observe all matching elements that haven't been animated yet
    document.querySelectorAll(SELECTOR).forEach(el => {
      if (!el.classList.contains('animate-in')) {
        this.scrollRevealObserver!.observe(el);
      }
    });
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const fragment = this.router.parseUrl(this.router.url).fragment;
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  ngOnDestroy(): void {
    this.scrollRevealObserver?.disconnect();
    clearTimeout(this.hideTimer);
  }
}


