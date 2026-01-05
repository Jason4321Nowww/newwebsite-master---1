// cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../_models/product';

export interface CartItem extends Product {
  id?: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  cart$ = this.cartSubject.asObservable();

  addToCart(item: CartItem) {
      if (item.quantity <= 0) return;
    const existingIndex = this.cart.findIndex(p => p.id === item.id);
    if (existingIndex !== -1) {
      this.cart[existingIndex].quantity += item.quantity;
    } else {
      this.cart.push(item);
    }
    this.cartSubject.next([...this.cart]);
  }

  // updateQuantity(productId: string, quantity: number) {
  //   const index = this.cart.findIndex(item => item.id === productId);
  //   if (index > -1) {
  //        if (quantity <= 0) {
  //     this.cart.splice(index, 1); // remove item completely
  //   } else {
  //     this.cart[index].quantity = quantity;
  //   }
  //     this.saveCart(this.cart);
  //   }
  // }
  updateQuantity(id: string, qty: number) {
  const cart = this.getCartItems();
  const item = cart.find(p => p.id === id);
  if (item) {
    item.quantity = qty;
    this.saveCart(cart);
  }
}


  removeItem(id: string) {
    this.cart = this.cart.filter(p => p.id !== id);
    this.cartSubject.next([...this.cart]);
  }

  clearCart() {
    this.cart = [];
    this.cartSubject.next([...this.cart]);
  }

  getCartItems() {
    return this.cart;
  }

   saveCart(cart: CartItem[]) {
    localStorage.setItem('cart', JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  isInCart(productId: string): boolean {
    return this.cart.some(item => item.id === productId);
  }

  getTotalPrice() {
    return this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }
}
