import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap, filter, map, catchError, of } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css'],
})
export class ProductDetails {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);




  errorMsg: string | null = null;
  product: Product | null = null;
product$ = this.route.paramMap.pipe(
  map(p => Number(p.get('id'))),
  filter(id => !!id),
  switchMap(id =>
    this.productService.getProduct(id).pipe(
      map(product => {
        this.product = product;   // store product here
        return product;
      }),
      catchError(err => {
        console.error('getProduct failed', err);
        this.errorMsg = `Failed to load product (status: ${err?.status ?? 'unknown'})`;
        return of(null as Product | null);
      })
    )
  )
);

  imageSrc(url?: string): string {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('/')) return url;
    return '/' + url;
  }


// addToCart() {

//   if (!this.product) {
//     console.warn('Product not loaded yet');
//     return;
//   }

//   console.log(`Adding to cart: ${this.product.name}, ${this.product.unitPrice}`);

//   const theCartItem = new CartItem(this.product);
//   this.cartService.addToCart(theCartItem);
// }
// }
}