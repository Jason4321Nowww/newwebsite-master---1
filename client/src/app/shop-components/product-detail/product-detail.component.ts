import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../_models/product';
import { CartService } from '../../services/cart.service';
import { ShopService } from '../../services/shop.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product!: Product;
  quantity = 0;

  constructor(
    private cart: CartService,
    private route: ActivatedRoute,
    private productService: ShopService
  ) {}

 ngOnInit(): void {
  const productId = this.route.snapshot.paramMap.get('id');
  if (productId) {
    this.productService.getProductById(productId).subscribe({
      next: (data) => {
        // Add a custom property to the product
        this.product = {
          ...data,
          stockWarning: false, // new property
        };

        // If product already in cart, load its quantity
        const existingItem = this.cart.getCartItems().find(item => item.id === this.product.id);
        if (existingItem) {
          this.quantity = existingItem.quantity; ;
        }
      },
      error: (err) => console.error('Error loading product:', err),
    });
  }
}


 increaseQty() {
  if (this.quantity < (this.product.stock || 0)) {
    this.quantity++;
    this.syncCart();
  } else {
    // Show stock warning if trying to exceed
    this.product.stockWarning = true;
  }
}

 decreaseQty() {
  if (this.quantity > 0) {
    this.quantity--;
    this.product.stockWarning = false; // hide warning when decreasing
    this.syncCart();
  }
}

addToCart() {
  if (!this.product.id) return;

  const stock = this.product.stock || 0;
  const existingItem = this.cart.getCartItems().find(i => i.id === this.product.id);
  const currentQuantity = existingItem?.quantity || 0;

  if (currentQuantity >= stock) {
    this.product.stockWarning = true; // cannot add more
    return;
  }

  // Always add exactly 1
  this.cart.addToCart({
    ...this.product,
    quantity: 1
  });

  this.product.stockWarning = false;
  this.quantity = currentQuantity + 1;
}






  private syncCart() {
  if (!this.product.id) return;

  const isInCart = this.cart.isInCart(this.product.id);
  if (isInCart) {
    if (this.quantity > 0) {
      this.cart.updateQuantity(this.product.id, this.quantity);
    } else {
      this.cart.removeItem(this.product.id); // auto remove if 0
    }
  } else {
    if (this.quantity > 0) {
      this.cart.addToCart({ ...this.product, quantity: this.quantity });
    }
  }
}

}