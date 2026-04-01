import { Component, ElementRef, HostListener, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ThemeService } from '../services/theme.service';
import { LanguageService } from '../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  webseitenTitel: string = 'Büezer und KMU Partei (BKP)';
  isMenuOpen = false;
  isMobileView = false;
  previousScrollY = 0;
  hideNavbar = false;
  userName: string | null = null;
  cartCount = 0;
  isDarkMode = false;
  isProfileOpen = false;
  private themeSubscription?: Subscription;
  private userNameSub?: Subscription;

  constructor(
    private router: Router,
    private auth: AuthService,
    private cartService: CartService,
    private themeService: ThemeService,
    public langService: LanguageService,
    private elRef: ElementRef,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });
  }

  // Passive scroll handler runs outside Angular zone — only triggers CD when hideNavbar changes
  private readonly scrollHandler = () => {
    const currentScrollY = window.scrollY;
    const shouldHide = currentScrollY > this.previousScrollY && currentScrollY > 80;
    this.previousScrollY = currentScrollY;
    if (shouldHide !== this.hideNavbar) {
      this.hideNavbar = shouldHide;
      this.ngZone.run(() => this.cdr.detectChanges());
    }
  };

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isProfileOpen = false;
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobileView = window.innerWidth <= 768;
    if (!this.isMobileView) this.isMenuOpen = false;
  }

  ngOnInit() {
    this.onResize();
    this.previousScrollY = window.scrollY;
    // Register scroll listener outside Angular zone so it never triggers change detection on its own
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.scrollHandler, { passive: true });
    });

    // ✅ Subscribe reactively — updates instantly on login/logout without needing a page refresh
    this.userNameSub = this.auth.userName$.subscribe(name => {
      this.userName = name;
      this.cdr.detectChanges();
    });
  
  
   // ✅ Subscribe to cart item count
  this.cartService.cart$.subscribe(items => {
    this.cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  })
}

  toggleProfile(): void {
    this.isProfileOpen = !this.isProfileOpen;
  }

  logout() {
    this.isProfileOpen = false;
    this.auth.logout();
  }

  toggleMenu() {
    if (this.isMobileView) {
      this.isMenuOpen = !this.isMenuOpen;
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollHandler);
    this.themeSubscription?.unsubscribe();
    this.userNameSub?.unsubscribe();
  }
}
