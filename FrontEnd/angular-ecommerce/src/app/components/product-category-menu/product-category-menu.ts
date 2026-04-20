import { Component, OnInit } from '@angular/core';
import { ProductCategory } from '../../common/product-category';
import { ProductService } from '../../services/product.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-category-menu',
  standalone: true,  
  imports: [RouterModule,CommonModule],
  templateUrl: './product-category-menu.html',
  styleUrl: './product-category-menu.css',
})
export class ProductCategoryMenu implements OnInit {

  //read the categories from service

  //productCategories: ProductCategory[] = [];
productCategories$!: Observable<ProductCategory[]>;
  constructor(private productService: ProductService) { }
  ngOnInit() {
    this.listProductCategories();
  }

  listProductCategories() {

    this.productService.getProductCategories().subscribe(
      data => {
        console.log('Product Categories=' + JSON.stringify(data));//Log data returned from service
        this.productCategories$ = this.productService.getProductCategories();//Assign data to our property

      }
    );
  }
}
