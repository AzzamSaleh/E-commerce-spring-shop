import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../common/cart-item';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];

 totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);//Subject is a subclass of Observable ,can use Subject to publish events in our code.
  totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  addToCart(theCartItem: CartItem) {

    // check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = new CartItem("", "", "", 0);

    if (this.cartItems.length > 0) {
      // find the item in the cart based on item id

      for (let tempCartItem of this.cartItems) {
        if (tempCartItem.id === theCartItem.id) {
          existingCartItem = tempCartItem;
          alreadyExistsInCart = true;
          break;
        }
      }

    }

    if (alreadyExistsInCart) {

      //Added stock validation
      //before incrementing quantity
      // increment the quantity
      if (existingCartItem.quantity < existingCartItem.unitsInStock) {
        existingCartItem.quantity++;
      }
      else {

        Swal.fire({
          icon: 'warning',
          title: 'Stock Limit Reached',
          text: `Only ${existingCartItem.unitsInStock} items available in stock.`,
          confirmButtonColor: '#3085d6'
        });

      }

    }
    else {
      // just add the item to the array
      this.cartItems.push(theCartItem);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();
  }

  computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * Number(currentCartItem.unitPrice); totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data just for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {

    console.log('Contents of the cart');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice =
        tempCartItem.quantity * Number(tempCartItem.unitPrice);
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }


    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('----');
  }


  decrementQuantity(theCartItem: CartItem) {

    theCartItem.quantity--;

    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    }
    else {
      this.computeCartTotals();
    }
  }

  incrementQuantity(theCartItem: CartItem) {

   //Before incrementing:
    //check if current quantity is already equal to stock.
    if (theCartItem.quantity < theCartItem.unitsInStock) {
      theCartItem.quantity++;
      this.computeCartTotals();
    }
    else {

      Swal.fire({
        icon: 'warning',
        title: 'Stock Limit Reached',
        text: `Only ${theCartItem.unitsInStock} items available in stock.`,
        confirmButtonColor: '#3085d6'
      });

    }
  }

  remove(theCartItem: CartItem) {

    // get index of item in the array
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);

    // if found, remove the item from the array at the given index
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }
  }

}