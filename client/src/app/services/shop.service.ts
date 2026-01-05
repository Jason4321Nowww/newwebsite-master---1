import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../_models/product';

@Injectable({
  providedIn: 'root'
})
export class ShopService {


  private apiUrl = 'http://localhost:5000/api/products';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
  getProductById(id: string) {
  return this.http.get<Product>(`http://localhost:5000/api/products/${id}`);
}

// reduceStock(productId: string, quantity: number) {
//   return this.http.patch<Product>(`http://localhost:5000/api/products/${productId}/reduce-stock`, { quantity });
// }


}
