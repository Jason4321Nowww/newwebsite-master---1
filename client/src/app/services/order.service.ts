import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../_models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/api/orders';

  constructor(private http: HttpClient) {}

  placeOrder(orderData: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, orderData);
  }

  getOrderStatus(orderId: string) {
  return this.http.get<{ status: string }>(`${this.apiUrl}/${orderId}/status`);
}

}
