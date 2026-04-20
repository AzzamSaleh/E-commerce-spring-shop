import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { ProductDetails } from './components/product-details/product-details';
import { CartDetails } from './components/cart-details/cart-details';
import { ProductAdmin } from './components/admin/product-admin/product-admin';
import { CheckoutComponent } from './components/checkout/checkout';


 

// Define Routes:
export const routes: Routes = [

  {path: 'admin/products', component: ProductAdmin }, //Admin Panel

  {path: 'checkout', component: CheckoutComponent},//Angular route for checkout
  {path: 'cart-details', component: CartDetails},//Angular route for cart details
  {path: 'products/:id', component: ProductDetails},//Angular route for product details
  {path: 'search/:keyword', component: ProductList},//Angular route for searching
  {path: 'category/:id', component: ProductList},
  {path: 'category', component: ProductList},
  {path: 'products', component: ProductList},
  {path: '', redirectTo:'/products', pathMatch:'full'},
  {path: '**', redirectTo:'/products', pathMatch:'full'},//generic wildcard


];
  