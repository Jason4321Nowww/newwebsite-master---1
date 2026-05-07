import { Component, OnInit } from '@angular/core';
import { AdminOrder, AdminOrderService } from '../admin-services/adminorder.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit {
  orders: AdminOrder[] = [];
  selectedOrder: AdminOrder | null = null;
  actionMessage = '';
  actionError = false;

  constructor(private orderService: AdminOrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders(status?: string) {
    const fetch = status
      ? this.orderService.getOrdersByStatus(status)
      : this.orderService.getAllOrders();
    fetch.subscribe(res => this.orders = res);
  }

  markAsPaid(orderId: string) {
    this.orderService.markAsPaid(orderId).subscribe({
      next: () => {
        this.actionError = false;
        this.actionMessage = 'Order marked as paid.';
        this.loadOrders();
        setTimeout(() => this.actionMessage = '', 4000);
      },
      error: (err) => {
        this.actionError = true;
        this.actionMessage = err.error?.error || 'Failed to mark as paid.';
      }
    });
  }

  markAsShipped(orderId: string) {
    this.orderService.markAsShipped(orderId).subscribe({
      next: () => {
        this.actionError = false;
        this.actionMessage = 'Order marked as shipped. Shipping email sent.';
        this.loadOrders();
        setTimeout(() => this.actionMessage = '', 4000);
      },
      error: (err) => {
        this.actionError = true;
        this.actionMessage = err.error?.error || 'Failed to mark as shipped.';
      }
    });
  }

  cancelOrder(orderId: string) {
    this.orderService.cancelOrder(orderId).subscribe({
      next: () => {
        this.actionError = false;
        this.actionMessage = 'Order cancelled. Cancellation email sent to customer.';
        this.loadOrders();
        if (this.selectedOrder?._id === orderId) this.selectedOrder = null;
        setTimeout(() => this.actionMessage = '', 4000);
      },
      error: (err) => {
        this.actionError = true;
        this.actionMessage = err.error?.error || 'Failed to cancel order.';
      }
    });
  }

  viewDetails(order: AdminOrder) {
    this.selectedOrder = order;
  }

  closeDetails() {
    this.selectedOrder = null;
  }
}
