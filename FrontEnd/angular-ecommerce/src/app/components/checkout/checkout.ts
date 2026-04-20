import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { CheckoutForm } from '../../services/checkout-form.service';
import { CheckoutService } from '../../services/checkout.service';
import { CartService } from '../../services/cart.service';

import { Country } from '../../common/country';
import { State } from '../../common/state';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Checkout } from '../../common/checkout';

interface OrderResponse {
  orderTrackingNumber: string;
}

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice = 0;
  totalQuantity = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  

  constructor(
    private formBuilder: FormBuilder,
    private checkoutFormService: CheckoutForm,
    private checkoutService: CheckoutService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({

      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
        ])
      }),

      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),

  

      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    const startMonth = new Date().getMonth() + 1;

    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(
      (data: number[]) => {
        this.creditCardMonths = data;
      }
    );

    this.checkoutFormService.getCreditCardYears().subscribe(
      (data: number[]) => {
        this.creditCardYears = data;
      }
    );

    this.checkoutFormService.getCountries().subscribe(
      (data: Country[]) => {
        this.countries = data;
      }
    );
  }

  reviewCartDetails(): void {
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );

    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

onSubmit(): void {
  if (this.checkoutFormGroup.invalid) {
    this.checkoutFormGroup.markAllAsTouched();
    return;
  }

  const checkout = new Checkout();

  checkout.customer = this.checkoutFormGroup.get('customer')?.value;
  checkout.shippingAddress = this.checkoutFormGroup.get('shippingAddress')?.value;


  const shippingState = checkout.shippingAddress?.state as unknown as State;
  const shippingCountry = checkout.shippingAddress?.country as unknown as Country;


  if (!shippingState || !shippingCountry ) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing address data',
      text: 'Please select country and state for both shipping and billing addresses.'
    });
    return;
  }

  checkout.shippingAddress.state = shippingState.name;
  checkout.shippingAddress.country = shippingCountry.name;
 

  const order = new Order(this.totalQuantity, this.totalPrice);
  checkout.order = order;

  const cartItems = this.cartService.cartItems;
  checkout.orderItems = cartItems.map(
    item => new OrderItem(item.imageUrl!, item.unitPrice!, item.quantity, item.id!)
  );

  this.checkoutService.placeOrder(checkout).subscribe({
    next: (response: OrderResponse) => {
      Swal.fire({
        icon: 'success',
        title: 'Order Placed Successfully',
        text: `Tracking number: ${response.orderTrackingNumber}`
      });
      this.resetCart();
    },
    error: err => {
      Swal.fire({
        icon: 'error',
        title: 'Checkout Failed',
        text: err.message
      });
    }
  });
}

  resetCart(): void {

    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.checkoutFormGroup.reset();

    this.shippingAddressStates = [];
  

    const startMonth = new Date().getMonth() + 1;

    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(
      (data: number[]) => {
        this.creditCardMonths = data;
      }
    );

    this.router.navigateByUrl('/products');
  }

  handleMonthsAndYears(): void {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    if (!creditCardFormGroup) {
      return;
    }

    const currentYear = new Date().getFullYear();
    const selectedYear = Number(creditCardFormGroup.value.expirationYear);

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(
      (data: number[]) => {
        this.creditCardMonths = data;
      }
    );
  }

  getStates(formGroupName: string): void {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    if (!formGroup) return;

    const country = formGroup.value.country;

    if (!country || !country.code) return;

    const countryCode = country.code;

    this.checkoutFormService.getStates(countryCode).subscribe(
      (data: State[]) => {

        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } 

        if (data.length > 0) {
          formGroup.get('state')?.setValue(data[0]);
        }
      }
    );
  }
}