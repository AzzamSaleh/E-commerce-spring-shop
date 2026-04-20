import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminProductService, Category, Product } from '../admin-product.service';
import { ProductDialog } from '../product-dialog/product-dialog';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-product-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatPaginatorModule
  ],
  templateUrl: './product-admin.html',
  styleUrl: './product-admin.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAdmin implements OnInit {
  categories: Category[] = [];
  selectedCategoryId!: number;

  // Replace
  //  products: Product[] = [];
  dataSource = signal<Product[]>([]);

  displayedColumns = ['id', 'name', 'unitPrice', 'unitsInStock', 'actions'];
  pageIndex = 0;
  pageSize = 10;
  totalElements = 0;
  constructor(private api: AdminProductService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {

    this.api.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        if (data.length > 0) {
          this.selectedCategoryId = data[0].id;
          this.pageIndex = 0;
          this.loadProducts();
        }
      },
      error: () => Swal.fire('Error', 'Failed to load categories', 'error')

    });
  }

  loadProducts() {
    this.api.getProductsByCategory(this.selectedCategoryId, this.pageIndex, this.pageSize).subscribe({
      next: (res) => {
        this.dataSource.set(res.content ?? []); // This triggers the update automatically
        this.totalElements = res.totalElements ?? 0;
      }
    });
  }
  onCategoryChange(categoryId: number) {
    this.selectedCategoryId = categoryId;
    this.pageIndex = 0;
    this.loadProducts();
  }

  deleteProduct(product: Product) {
    Swal.fire({
      title: 'Delete product?',
      text: product.name,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete'
    }).then(result => {
      if (result.isConfirmed) {
        this.api.deleteProduct(product.id).subscribe({
          next: () => {
            Swal.fire('Deleted', 'Product deleted', 'success');

            // If last item on last page deleted, go back a page
            if (this.dataSource().length === 1 && this.pageIndex > 0) {
              this.pageIndex--;
            }
            this.loadProducts();
          },
          error: () => Swal.fire('Error', 'Delete failed', 'error')
        });
      }
    });
  }
  openAddDialog() {
    const dialogRef = this.dialog.open(ProductDialog, {
      width: '600px',
      data: { categoryId: this.selectedCategoryId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.loadProducts();
      }
    });
  }
  openEditDialog(product: Product) {
    const dialogRef = this.dialog.open(ProductDialog, {
      width: '600px',
      data: { mode: 'edit', product }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.loadProducts();
      }
    });
  }
  onPageChange(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.loadProducts();
  }

}