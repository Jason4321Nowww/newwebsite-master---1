import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.scss']
})
export class CartDetailsComponent implements OnInit {
  cartItems: CartItem[] = [];
  total = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items.filter(i => i.quantity >0).map(i => ({
    ...i,
    stock: i.stock ?? 0 // fallback if undefined
  }));
      this.calculateTotal();
    });
  }

increase(item: CartItem) {
  if (item.quantity < item.stock) {
    this.cartService.updateQuantity(item.id!, item.quantity + 1);
  }
}


  decrease(item: CartItem) {
    if (item.quantity >= 1) {
      this.cartService.updateQuantity(item.id!, item.quantity - 1);
    }
  }

  calculateTotal() {
    this.total = this.cartService.getTotalPrice();
  }
}
