export interface OrderItem {
  product: string;         // Product ID
  quantity: number;
}

export interface CustomerAddress {
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface Order {
  _id?: string; // Optional, returned after saving
  items: OrderItem[];
  customerName: string;
  customerEmail: string;
  customerAddress: CustomerAddress;
  customerIBAN?: string ,
  paymentMethod: 'vorkasse'
  totalAmount: number;
  status?: 'pending' | 'paid' | 'shipped'; // Optional, default: pending
  createdAt?: string; // Optional ISO timestamp

}
