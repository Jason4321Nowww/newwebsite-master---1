export interface OrderItem {
  product: string;
  quantity: number;
}

export interface CustomerAddress {
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface Order {
  _id?: string;
  items: OrderItem[];
  customerName: string;
  customerEmail: string;
  customerAddress: CustomerAddress;
  paymentMethod: 'vorkasse';
  totalAmount: number;
  paymentNumber?: string;   // Auto-generated Kaufnummer for bank transfer reference
  invoiceNumber?: string;   // 10-char alphanumeric, generated server-side
  lang?: string;            // Customer's UI language at time of order
  status?: 'pending' | 'paid' | 'shipped' | 'cancelled';
  createdAt?: string;
}
