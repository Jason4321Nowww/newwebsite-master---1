import { Component, OnInit } from '@angular/core';
import { CartItem, CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { ShopService } from '../../services/shop.service';
import { forkJoin } from 'rxjs';
import { Order, OrderItem } from 'src/app/_models/order';
import { SweetAlertService } from '../../services/sweet-alert.service';

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
    customerIBAN: '',
    address: {
      street: '',
      postalCode: '',
      city: '',
      country: '',
      
    }
  };

  cardDetails = {
    
   
  };

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private productService: ShopService,
    private sweetAlert:SweetAlertService
  ) {}

  ngOnInit() {
    this.cartService.cart$.subscribe((items) => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  calculateTotal() {
    this.total = this.cartService.getTotalPrice();
  }


checkout() {
  if (!this.customer.name || !this.customer.email || !this.customer.address.street ||
      !this.customer.address.city || !this.customer.address.postalCode ||
      !this.customer.address.country) {
    this.sweetAlert.warning('Please fill out all customer details before placing your order.');
    return;
  }

  const order: Order = {
    items: this.cartItems
      .filter(item => item.id)
      .map(item => ({ product: item.id!, quantity: item.quantity })),
    customerName: this.customer.name,
    customerEmail: this.customer.email,
    customerAddress: this.customer.address,
    paymentMethod: 'vorkasse',
    totalAmount: this.total
  };

  this.orderService.placeOrder(order).subscribe({
    next: (res: any) => {
      // alert(`✅ Order placed! Reference: ORDER-${res._id}`);
        // Normal alert
    this.sweetAlert.success('Order placed successfully!');
      // ✅ TRACKING ALERT AFTER 20 SECONDS
        // Start tracking order status
  this.sweetAlert.startOrderTracking(
    res._id,
    this.orderService  // <-- calling endpoint from order.service.ts
  );
      this.cartService.clearCart();
    },
    error: (err) => {
      console.error('Order failed', err);
      this.sweetAlert.error('Failed to place order.');
    }
  });
}




}
