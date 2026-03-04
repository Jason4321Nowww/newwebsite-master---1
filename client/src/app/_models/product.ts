export interface Product {
  stockWarning: any;
  id?: string;
  name: string;
  name_it?: string;
  name_fr?: string;
  name_en?: string;
  category: string;
  price: number;
  description?: string;
  description_it?: string;
  description_fr?: string;
  description_en?: string;
  stock: number;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  isExternal?: boolean;
  externalUrl?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  size?: 'S' | 'M' | 'L';
}
