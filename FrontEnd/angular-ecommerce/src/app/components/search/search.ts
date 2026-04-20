// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-search',
//   imports: [],
//   templateUrl: './search.html',
//   styleUrl: './search.css',
// })
// export class Search implements OnInit {

//   constructor(private router: Router) { }

//   ngOnInit() {

//   }


//  doSearch(value: string) {
//     console.log(`value=${value}`);
//     this.router.navigateByUrl(`/search/${value}`); //Route the data to our "search" route, that value goes to keyword param in search route
//   }
// }
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, catchError, filter, startWith, tap } from 'rxjs/operators';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';

@Component({
  selector: 'app-search',
  standalone: true,
  templateUrl: './search.html',
  styleUrl: './search.css',
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    
  ]
})
export class Search {

  control = new FormControl('', { nonNullable: true });

  // We’ll show product names
  filteredProducts$!: Observable<Product[]>;

  constructor(private productService: ProductService, private router: Router) {
    this.filteredProducts$ = this.control.valueChanges.pipe(
      startWith(''),
      map(v => v.trim()),
      debounceTime(250),
      distinctUntilChanged(),

      // don’t call backend for short text
      filter(v => v.length >= 2),

      switchMap(keyword =>
        this.productService.searchProducts(keyword).pipe(
          // limit suggestions
          map(products => products.slice(0, 10)),
          catchError(() => of([] as Product[]))
        )
      )
    );
  }

  // user selects an option or presses enter
  doSearch(value: string) {
    const q = value.trim();
    if (!q) return;
    this.router.navigate(['/search', q]);
  }

  // called when user picks from dropdown
  onOptionSelected(name: string) {
    this.control.setValue(name);
    this.doSearch(name);
  }

  // Helps Material display the string value properly if you ever pass objects
  displayFn(value: any): string {
    return typeof value === 'string' ? value : (value?.name ?? '');
  }
}

