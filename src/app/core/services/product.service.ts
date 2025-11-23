import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

export interface Product {
  _id?: string;
  name: string;
  stock: number;
  price: number;
  expiry: Date | string;
  lot: string;
  warehouse: string;
  supplier: string;
  category: string;
  description: string;
  batches?: Array<{
    batch: string;
    quantity: number;
    expiry: Date | string;
    location: string;
  }>;
  vendorId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productServiceUrl = environment.useProxy && !environment.production 
    ? environment.proxyServices?.product || environment.services.product
    : environment.services.product;

  constructor(private api: ApiService) {}

  getProducts(params?: { search?: string; category?: string; lowStock?: boolean }): Observable<{ products: Product[] }> {
    let endpoint = '/api/v1/products';
    if (params) {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      if (params.category) queryParams.append('category', params.category);
      if (params.lowStock !== undefined) queryParams.append('lowStock', params.lowStock.toString());
      const queryString = queryParams.toString();
      if (queryString) endpoint += `?${queryString}`;
    }
    return this.api.get<{ products: Product[] }>(endpoint, this.productServiceUrl);
  }

  getProduct(id: string): Observable<{ product: Product }> {
    return this.api.get<{ product: Product }>(`/api/v1/products/${id}`, this.productServiceUrl);
  }

  createProduct(product: Product): Observable<{ message: string; product: Product }> {
    return this.api.post<{ message: string; product: Product }>('/api/v1/products', product, this.productServiceUrl);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<{ message: string; product: Product }> {
    return this.api.put<{ message: string; product: Product }>(`/api/v1/products/${id}`, product, this.productServiceUrl);
  }

  deleteProduct(id: string): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(`/api/v1/products/${id}`, this.productServiceUrl);
  }

  bulkUploadProducts(products: Product[]): Observable<{ message: string; products: Product[] }> {
    return this.api.post<{ message: string; products: Product[] }>('/api/v1/products/bulk-upload', { products }, this.productServiceUrl);
  }
}

