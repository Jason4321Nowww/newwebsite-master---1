import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminOrder {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerAddress: any;
  paymentMethod: string;
  paymentNumber?: string;
  invoiceNumber?: string;
  lang?: string;
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  createdAt: string;
  paidAt?: string | null;
  items: { product: any; quantity: number }[];
}

@Injectable({ providedIn: 'root' })
export class AdminOrderService {
  private baseUrl = '/api/orders';

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<AdminOrder[]> {
    return this.http.get<AdminOrder[]>(`${this.baseUrl}`);
  }

  getOrdersByStatus(status: string): Observable<AdminOrder[]> {
    return this.http.get<AdminOrder[]>(`${this.baseUrl}/filter?status=${status}`);
  }

  markAsPaid(orderId: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${orderId}/mark-paid`, {});
  }

  markAsShipped(orderId: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${orderId}/mark-shipped`, {});
  }

  cancelOrder(orderId: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${orderId}/cancel`, {});
  }
}
