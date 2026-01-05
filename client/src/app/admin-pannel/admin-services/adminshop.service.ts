import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../_models/product'; // Adjust the path as needed

@Injectable({
  providedIn: 'root'
})
export class AdminshopService {
  toggleActive(id: string) {
    return this.http.patch(`${this.api}/${id}/toggle`, {});
  }
  private api = 'http://localhost:5000/api/products';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.api);
  }

  createProduct(data: FormData): Observable<Product> {
    return this.http.post<Product>(this.api, data);
  }

  updateProduct(id: string, data: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.api}/${id}`, data);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }

  toggleFeatured(id: string): Observable<any> {
    return this.http.patch(`${this.api}/${id}/featured`, {});
  }
}
