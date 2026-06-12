import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem, CartService } from '../../services/cart.service';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss']
})
export class OrderPageComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  total = 0;
  private cartSub!: Subscription;

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
    public langService: LanguageService,
  ) {}

  ngOnInit(): void {
    // Read cart snapshot once — don't stay subscribed so clearCart() after
    // a successful order doesn't trigger this check from a leaked subscription
    this.cartItems = this.cartService.getCartItems().filter(i => i.quantity > 0);
    this.total = this.cartService.getTotalPrice();

    if (this.cartItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: this.langService.t('cart.emptyTitle'),
        text: this.langService.t('cart.emptyWarning'),
        confirmButtonColor: '#009d63',
        confirmButtonText: this.langService.t('cart.browse'),
        allowOutsideClick: false,
      }).then(() => this.router.navigate(['/shop']));
    }
  }

  ngOnDestroy(): void { this.cartSub?.unsubscribe(); }

  proceedToPayment(): void {
    const { name, email, address } = this.customer;
    if (!name || !email || !address.street || !address.city || !address.postalCode || !address.country) {
      this.validationError = this.langService.t('order.fillAllFields');
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
