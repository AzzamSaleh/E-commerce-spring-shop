import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Checkout } from '../common/checkout';


@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
    private checkoutUrl = 'http://localhost:8080/api/checkout';

  constructor(private httpClient: HttpClient) { }

  placeOrder(checkout: Checkout): Observable<any> {
    return this.httpClient.post<Checkout>(this.checkoutUrl, checkout);    
  }
}
