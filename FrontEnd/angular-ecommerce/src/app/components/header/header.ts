import { Component } from '@angular/core';
import { Search } from "../search/search";
import { CartStatus } from "../cart-status/cart-status";
import { RouterLink } from '@angular/router';
import { LoginStatus } from '../login-status/login-status';

@Component({
  selector: 'app-header',
  imports: [Search, CartStatus,LoginStatus,RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

}
