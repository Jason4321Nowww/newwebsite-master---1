import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem, CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Order } from '../../_models/order';

@Component({
  selector: 'app-bank-payment',
  templateUrl: './bank-payment.component.html',
  styleUrls: ['./bank-payment.component.scss'],
})
export class BankPaymentComponent implements OnInit {
  customer: any = null;
  cartItems: CartItem[] = [];
  total = 0;

  submitting = false;
  success = false;
  errorMsg = '';

  paymentNumber = '';   // returned from server after order is placed
  invoiceNumber = '';

  readonly bankDetails = {
    iban:    'CH60 0900 0000 1581 0867 8',
    holder:  'Büezer und KMU Partei (BKP)',
    bank:    'PostFinance AG',
    address: 'Zürichstrasse 23, 8607 Aathal-Seegräben',
  };

  constructor(
    private router: Router,
    private orderService: OrderService,
    private cartService: CartService,
  ) {
    const nav   = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as any;
    if (state) {
      this.customer  = state['customer'];
      this.cartItems = state['cartItems'] || [];
      this.total     = state['total'] || 0;
    }
  }

  ngOnInit(): void {
    if (!this.customer || !this.cartItems.length) {
      this.router.navigate(['/order']);
    }
  }

  placeOrder(): void {
    this.errorMsg  = '';
    this.submitting = true;

    const lang = localStorage.getItem('bkp_lang') || 'de';

    const order: Order = {
      items: this.cartItems
        .filter(i => i.id)
        .map(i => ({ product: i.id!, quantity: i.quantity })),
      customerName:    this.customer.name,
      customerEmail:   this.customer.email,
      customerAddress: this.customer.address,
      paymentMethod:   'vorkasse',
      totalAmount:     this.total,
      lang,
    };

    this.orderService.placeOrder(order).subscribe({
      next: (res: any) => {
        this.paymentNumber = res.paymentNumber || '';
        this.invoiceNumber = res.invoiceNumber || '';
        this.success = true;
        this.submitting = false;
        this.cartService.clearCart();
        setTimeout(() => this.router.navigate(['/shop']), 6000);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMsg = err.error?.error || 'Failed to place order. Please try again.';
      },
    });
  }
}
