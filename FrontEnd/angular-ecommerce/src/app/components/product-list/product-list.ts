import { Component, OnInit, signal } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  //This component’s job is to load products from the backend


  //products: Product[] = []; //hold an array of Product objects.

  // Signal holds the array of products
  products = signal<Product[]>([]);

  //
  currentCategoryId: number = 1;

  //
  searchMode: boolean = false;


  // Pagination Signals
  pageNumber = signal(1);
  pageSize = signal(10);
  totalElements = signal(0);
  totalPages = signal(0);
  // ActivatedRoute => useful for accessing route parameters
  constructor(private productService: ProductService, private route: ActivatedRoute, private cartService: CartService,) { }

  ngOnInit() {
    //console.log('ProductList ngOnInit');

    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });

  }



  //Note:
  /*
  Subscribe means:
  Start listening to this Observable, and when the data arrives, run this function
  */
  //clalled when the component initalized
  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // now search for the products using keyword
    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        // this.products = data;
        this.products.set(data); //update signal
      }
    )
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    this.currentCategoryId = hasCategoryId ? +this.route.snapshot.paramMap.get('id')! : 1;

    // Call paginated service
    this.productService.getProductListPaginate(this.currentCategoryId, this.pageNumber() - 1, this.pageSize())
      .subscribe(this.processResult());
  }
  // Common processor for the data returned from API
  private processResult() {
    return (data: any) => {
      this.products.set(data.content ?? []);
      this.totalElements.set(data.totalElements ?? 0);
      this.totalPages.set(data.totalPages ?? 0);
    };
  }
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;

    this.pageNumber.set(page);
    this.listProducts();
  }
  updatePageSize(pageSize: string) {
    this.pageSize.set(+pageSize);
    this.pageNumber.set(1);
    this.listProducts();
  }
  addToCart(theProduct: Product) {

    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(
    theProduct.id!,
    theProduct.name!,
    theProduct.imageUrl!,
    theProduct.unitPrice!,
    theProduct.unitsInStock!
  );

  this.cartService.addToCart(theCartItem);

  }
}


