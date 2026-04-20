import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({ providedIn: 'root' })
export class AdminProductService {
 private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/product-category`);
  }

getProductsByCategory(categoryId: number, page = 0, size = 10) {
  return this.http.get<any>(
    `${this.baseUrl}/admin/products/by-category?id=${categoryId}&page=${page}&size=${size}`
  );
}

  deleteProduct(id: number) {
    return this.http.delete(`${this.baseUrl}/admin/products/${id}`);
  }

createProduct(product: any) {
  return this.http.post(`${this.baseUrl}/admin/products`, product);
}
updateProduct(id: number, product: any) {
  return this.http.put(`${this.baseUrl}/admin/products/${id}`, product);
}
}

export interface Category {
  id: number;
  categoryName: string;
}

export interface Product {
  id: number;
  name: string;
  sku?: string;
  description?: string;
  unitPrice: number;
  imageUrl?: string;
  unitsInStock: number;
  active: boolean;
  categoryId?: number; // helpful for edit form
  category?: { id: number; categoryName?: string }; // if backend returns category object
}

export interface ProductRequestDto {
  categoryId: number;
  name: string;
  sku?: string;
  description?: string;
  unitPrice: number;
  imageUrl?: string;
  unitsInStock: number;
}