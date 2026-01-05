import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Product } from '../../_models/product';
import { AdminshopService } from '../admin-services/adminshop.service';

@Component({
  selector: 'app-admin-shop',
  templateUrl: './admin-shop.component.html',
  styleUrls: ['./admin-shop.component.scss']
})
export class AdminShopComponent implements OnInit {
  productForm: FormGroup;
  products: Product[] = [];
  selectedProduct: Product | null = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private adminShop: AdminshopService
  ) {
    this.productForm = this.fb.group({
      name: [''],
      category: [''],
      price: [''],
      description: [''],
      stock: [''],
      mediaType: ['image'],
      isExternal: [false],
      externalUrl: [''],
      isActive: [true],
      isFeatured: [false],
      size: ['none']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.adminShop.getAllProducts().subscribe(data => {
      console.log('📦 Loaded products from backend:', data);
      this.products = data;
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.selectedFile = file;
  }

  submitForm() {
    const formValues = this.productForm.value;
    const formData = new FormData();

    formData.append('name', formValues.name || '');
    formData.append('category', formValues.category || '');
    formData.append('price', formValues.price?.toString() || '0');
    formData.append('stock', formValues.stock?.toString() || '0');
    formData.append('description', formValues.description || '');
    // formData.append('mediaType', formValues.mediaType || '');
    formData.append('size', formValues.size || '');
    formData.append('isExternal', formValues.isExternal ? 'true' : 'false');
    formData.append('externalUrl', formValues.externalUrl || '');
    formData.append('isActive', formValues.isActive ? 'true' : 'false');
    formData.append('isFeatured', formValues.isFeatured ? 'true' : 'false');

    // 🖼️ Handle file upload or preserve existing image
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    } else if (this.selectedProduct?.mediaUrl) {
      formData.append('mediaUrl', this.selectedProduct.mediaUrl); // keep existing image
    }

    // 🚀 Create or Update
    if (this.selectedProduct) {
      this.adminShop.updateProduct(this.selectedProduct.id!, formData).subscribe({
        next: () => this.resetForm(),
        error: err => console.error('❌ Update Product Error:', err)
      });
    } else {
      this.adminShop.createProduct(formData).subscribe({
        next: () => this.resetForm(),
        error: err => console.error('❌ Create Product Error:', err)
      });
    }
  }

  editProduct(product: Product) {
    this.selectedProduct = product;
    this.productForm.patchValue(product);
  }

  deleteProduct(id: string) {
    this.adminShop.deleteProduct(id).subscribe(() => this.loadProducts());
  }
   toggleFeatured(id: string) {
    this.adminShop.toggleFeatured(id).subscribe(() => this.loadProducts());
  }

  toggleActive(id: string) {
    this.adminShop.toggleActive(id).subscribe(() => this.loadProducts());
  }

  resetForm() {
    this.productForm.reset();
    this.selectedProduct = null;
    this.selectedFile = null;
    this.loadProducts();
  }
}
