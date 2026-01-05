import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminOrder {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerAddress: any;
  paymentMethod: string;
  customerIBAN: string;
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped';
  createdAt: string;
  items: { product: any; quantity: number }[];
}

@Injectable({ providedIn: 'root' })
export class AdminOrderService {
  private baseUrl = 'http://localhost:5000/api/orders';

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<AdminOrder[]> {
    return this.http.get<AdminOrder[]>(`${this.baseUrl}`);
  }

  getOrdersByStatus(status: string): Observable<AdminOrder[]> {
    return this.http.get<AdminOrder[]>(`${this.baseUrl}/filter?status=${status}`);
  }

  markAsPaid(orderId: string) {
    return this.http.patch(`${this.baseUrl}/${orderId}/mark-paid`, {});
  }

  markAsShipped(orderId: string) {
    return this.http.patch(`${this.baseUrl}/${orderId}/mark-shipped`, {});
  }
}
