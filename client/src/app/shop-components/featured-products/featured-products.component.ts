import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ShopService } from '../../services/shop.service';
import { CartService } from '../../services/cart.service';
import { LanguageService } from '../../services/language.service';
import { Product } from '../../_models/product';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-featured-products',
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.scss'],
})
export class FeaturedProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  loading = true;
  private langSub!: Subscription;

  constructor(
    private shopService: ShopService,
    private cart: CartService,
    public langService: LanguageService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.langSub = this.langService.lang$.subscribe(() => this.cdr.markForCheck());
    this.shopService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data
          .filter(p => p.isFeatured && p.isActive)
          .map(p => ({ ...p, stockWarning: false }));
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  ngOnDestroy(): void { this.langSub?.unsubscribe(); }

  addToCart(product: Product): void {
    const existing = this.cart.getCartItems().find(i => i.id === product.id);
    const qty = existing?.quantity || 0;
    if (qty + 1 > (product.stock || 0)) {
      product.stockWarning = true;
      return;
    }
    product.stockWarning = false;
    if (existing) {
      this.cart.updateQuantity(product.id!, qty + 1);
    } else {
      this.cart.addToCart({ ...product, quantity: 1 });
    }
  }
}
