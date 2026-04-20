import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { AdminProductService, Category, ProductRequestDto } from '../admin-product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './product-dialog.html',
})
export class ProductDialog implements OnInit {
  categories: Category[] = [];

  form: any;   // declare first
  mode: 'create' | 'edit' = 'create';
  productId?: number;
  constructor(
    private fb: FormBuilder,
    private api: AdminProductService,
    private dialogRef: MatDialogRef<ProductDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    //  initialize AFTER fb is available
this.form = this.fb.group({
  categoryId: [null, Validators.required],

  name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],

  sku: ['', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(30),
    Validators.pattern(/^[A-Z0-9_-]+$/i) // letters/numbers/_/-
  ]],

  description: ['', [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(2000)
  ]],

  unitPrice: [null, [Validators.required, Validators.min(0.01)]],

  unitsInStock: [0, [Validators.required, Validators.min(0)]],


});
  }


  ngOnInit(): void {
    this.api.getCategories().subscribe({
      next: (res) => this.categories = res,
      error: () => Swal.fire('Error', 'Failed to load categories', 'error')
    });

    // detect mode
    if (this.data?.mode === 'edit' && this.data?.product) {
      this.mode = 'edit';
      this.productId = this.data.product.id;

      const p = this.data.product;

      // backend returns category as object -> use p.category?.id
      this.form.patchValue({
        categoryId: p.category?.id,
        name: p.name,
        unitPrice: p.unitPrice,
        unitsInStock: p.unitsInStock,
        imageUrl: p.imageUrl,
        description: p.description,
        sku: p.sku
      });
    } else {
      // create mode: preselect category from admin page
      if (this.data?.categoryId) {
        this.form.patchValue({ categoryId: this.data.categoryId });
      }
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.value;

    if (this.mode === 'edit' && this.productId) {
      // UPDATE
      this.api.updateProduct(this.productId, payload).subscribe({
        next: () => {
          Swal.fire('Success', 'Product updated', 'success');
          this.dialogRef.close('saved');
        },
        error: () => Swal.fire('Error', 'Failed to update product', 'error')
      });
    } else {
      //  CREATE
      this.api.createProduct(payload).subscribe({
        next: () => {
          Swal.fire('Success', 'Product added', 'success');
          this.dialogRef.close('saved');
        },
        error: () => Swal.fire('Error', 'Failed to save product', 'error')
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
