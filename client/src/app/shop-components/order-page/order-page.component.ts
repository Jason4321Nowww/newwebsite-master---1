import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem, CartService } from '../../services/cart.service';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss']
})
export class OrderPageComponent implements OnInit {
  cartItems: CartItem[] = [];
  total = 0;

  customer = {
    name: '',
    email: '',
    address: {
      street: '',
      postalCode: '',
      city: '',
      country: '',
    }
  };

  validationError = '';

  constructor(
    private cartService: CartService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotalPrice();
    });
  }

  proceedToPayment(): void {
    const { name, email, address } = this.customer;
    if (!name || !email || !address.street || !address.city || !address.postalCode || !address.country) {
      this.validationError = 'Please fill out all fields before continuing.';
      return;
    }
    this.validationError = '';
    this.router.navigate(['/bank-payment'], {
      state: {
        customer:  this.customer,
        cartItems: this.cartItems,
        total:     this.total,
      }
    });
  }
}
