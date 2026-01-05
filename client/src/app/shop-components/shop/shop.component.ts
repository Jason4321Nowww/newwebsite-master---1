import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../services/shop.service';
import { Product } from '../../_models/product';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ShopService, private cart: CartService) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        // Initialize stockWarning property for each product
        this.products = data.map(p => ({
          ...p,
          stockWarning: false
        }));
      },
      error: (err) => console.error('Error fetching products:', err)
    });
  }

  get featuredProducts() {
    return this.products.filter(p => p.isFeatured && p.isActive);
  }

  get regularProducts() {
    return this.products.filter(p => p.isActive);
  }

  addToCart(product: Product) {
    const cartItem = this.cart.getCartItems().find(item => item.id === product.id);
    const currentQuantity = cartItem?.quantity || 0;

    // Check if adding would exceed stock
    if (currentQuantity + 1 > (product.stock || 0)) {
      product.stockWarning = true; // Show warning
      return;
    }

    // Reset warning if addition is allowed
    product.stockWarning = false;

    // Add to cart or increase quantity
    if (cartItem) {
      this.cart.updateQuantity(product.id!, currentQuantity + 1);
    } else {
      this.cart.addToCart({ ...product, quantity: 1 });
    }
  }
}
