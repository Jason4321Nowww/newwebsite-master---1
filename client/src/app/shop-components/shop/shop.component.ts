import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ShopService } from '../../services/shop.service';
import { Product } from '../../_models/product';
import { CartService } from '../../services/cart.service';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  private langSub!: Subscription;

  constructor(
    private productService: ShopService,
    private cart: CartService,
    public langService: LanguageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.langSub = this.langService.lang$.subscribe(() => this.cdr.markForCheck());

    // Show success alert if redirected here after a completed order
    if (window.history.state?.orderSuccess) {
      history.replaceState({}, ''); // clear so refresh doesn't re-show
      Swal.fire({
        icon: 'success',
        title: this.langService.t('shop.orderSuccessTitle'),
        text:  this.langService.t('shop.orderSuccessMsg'),
        confirmButtonColor: '#009d63',
        confirmButtonText: this.langService.t('shop.orderSuccessBtn'),
      });
    }

    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data.map(p => ({ ...p, stockWarning: false }));
      },
      error: (err) => console.error('Error fetching products:', err)
    });
  }

  ngOnDestroy(): void { this.langSub?.unsubscribe(); }

  get featuredProducts() {
    return this.products.filter(p => p.isFeatured && p.isActive);
  }

  get regularProducts() {
    return this.products.filter(p => p.isActive);
  }

  addToCart(product: Product) {
    const cartItem = this.cart.getCartItems().find(item => item.id === product.id);
    const currentQuantity = cartItem?.quantity || 0;

    if (currentQuantity + 1 > (product.stock || 0)) {
      product.stockWarning = true;
      return;
    }

    product.stockWarning = false;

    if (cartItem) {
      this.cart.updateQuantity(product.id!, currentQuantity + 1);
    } else {
      this.cart.addToCart({ ...product, quantity: 1 });
    }
  }
}
