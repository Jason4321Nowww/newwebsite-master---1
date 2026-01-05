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

  constructor(private orderService: AdminOrderService) {}

  ngOnInit() {
    this.loadOrders(); 
    console.log(this.loadOrders())
  }

  loadOrders(status?: string) {
    const fetch = status
      ? this.orderService.getOrdersByStatus(status)
      : this.orderService.getAllOrders();
    fetch.subscribe((res) => (this.orders = res));
  }

  markAsPaid(orderId: string) {
    this.orderService.markAsPaid(orderId).subscribe(() => {
      alert('✅ Order marked as paid!');
      this.loadOrders();
    });
  }

  markAsShipped(orderId: string) {
    this.orderService.markAsShipped(orderId).subscribe(() => {
      alert('📦 Order marked as shipped!');
      this.loadOrders();
    });
  }

  viewDetails(order: AdminOrder) {
    this.selectedOrder = order;
  }

  closeDetails() {
    this.selectedOrder = null;
  }
}
