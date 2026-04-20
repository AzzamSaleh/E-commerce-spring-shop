import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, of } from "rxjs";
import { Product } from "../common/product";
import { ProductCategory } from "../common/product-category";
import { Page } from "../common/page";

//Our service can be injected into other classes / components
@Injectable({
  providedIn: 'root'//automatically register it at app startup
})

//export allows other files to import and use it
export class ProductService {

  //The main method => fetching product
  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';//URL for product categories

  //Dependency Injection
  constructor(private httpClient: HttpClient) { } // Inject httpClient

  //The main method => fetching product
  getProductList(theCategoryId: number): Observable<Product[]> {

    // need to build URL based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.httpClient.get<GetResponse>(searchUrl).pipe(
      map(response => response.content)//This cleans the data before components use it, Transforms it
    );
  }

  //product categories -> read them dynamiclly
  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<ProductCategory[]>(this.categoryUrl);//Call REST API ,Returns an observable
  }

  //search products by keyword
  searchProducts(theKeyword: string): Observable<Product[]> {

    // need to build URL based on the keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${encodeURIComponent(theKeyword)}`;//URL for searching products

    return this.getProducts(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponse>(searchUrl).pipe(map(response => response.content));
  }

  //get product details
  getProduct(theProductId: number): Observable<Product> {

    // need to build URL based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  // autocomplete / autofill suggestions
  // Backend endpoint: GET /api/products/search/suggest?keyword=lap
//   suggestProducts(query: string): Observable<string[]> {
//     return this.httpClient.get<string[]>('/api/products/suggest', {
//       params: { q: query }
//     });}
getProductListPaginate(categoryId: number, page: number, size: number): Observable<Page<Product>> {
  const url = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}&page=${page}&size=${size}`;
  return this.httpClient.get<Page<Product>>(url);
}

searchProductsPaginate(keyword: string, page: number, size: number): Observable<Page<Product>> {
  const url = `${this.baseUrl}/products/search/findByNameContaining?name=${keyword}&page=${page}&size=${size}`;
  return this.httpClient.get<Page<Product>>(url);
}
}

// DTO interface matching backend response
export interface ProductSuggestion {
  id: number;
  name: string;
}

//Interface for backend response
//TypeScript must understand its structure
interface GetResponse {
  content: Product[]; // Spring Page content array
}
