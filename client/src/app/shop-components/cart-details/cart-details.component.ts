import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.scss']
})
export class CartDetailsComponent implements OnInit {
  cartItems: CartItem[] = [];
  total = 0;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items.filter(i => i.quantity > 0).map(i => ({
        ...i,
        stock: i.stock ?? 0
      }));
      this.calculateTotal();
    });
  }

  get isEmpty(): boolean {
    return this.cartItems.length === 0;
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

  proceedToCheckout() {
    if (this.isEmpty) {
      Swal.fire({
        icon: 'warning',
        title: 'Cart is empty',
        text: 'Please add at least one item to your cart before proceeding to checkout.',
        confirmButtonColor: '#009d63',
        confirmButtonText: 'Go to Shop',
      }).then(result => {
        if (result.isConfirmed) {
          this.router.navigate(['/shop']);
        }
      });
      return;
    }
    this.router.navigate(['/order']);
  }
}
