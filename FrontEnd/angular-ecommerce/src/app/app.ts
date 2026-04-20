
import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive, RouterLink } from '@angular/router';
import { ProductCategoryMenu } from "./components/product-category-menu/product-category-menu";
import { Search } from "./components/search/search";
import { CartStatus } from "./components/cart-status/cart-status";
import { Header } from './components/header/header';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProductCategoryMenu, RouterLink, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-ecommerce');
}
