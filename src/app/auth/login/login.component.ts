import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from '../auth.service';

import {
  PaymentIntent,
  PaymentRequestPaymentMethodEvent,
  PaymentRequestShippingAddressEvent,
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { StripeCardComponent, StripeService } from 'ngx-stripe';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public hide = true;
  isLoading = false;
  private authStatusSubscription: Subscription;

  @ViewChild(StripeCardComponent) card?: StripeCardComponent;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private stripeService: StripeService
  ) {}

  elementsOptions: StripeElementsOptions = {
    locale: 'es',
  };

  paymentRequestOptions = {
    country: 'ES',
    currency: 'eur',
    total: {
      label: 'Demo Total',
      amount: 1099,
    },
    requestPayerName: true,
    requestPayerEmail: true,
  };

  onPaymentMethod(ev: PaymentRequestPaymentMethodEvent) {
    this.createPaymentIntent()
      .pipe(
        switchMap((pi) => {
          return this.stripeService
            .confirmCardPayment(
              pi.client_secret,
              { payment_method: ev.paymentMethod.id },
              { handleActions: false }
            )
            .pipe(
              switchMap((confirmResult) => {
                if (confirmResult.error) {
                  // Report to the browser that the payment failed,
                  // prompting it to re-show the payment interface,
                  // or show an error message and close the payment.
                  ev.complete('fail');
                  return of({
                    error: new Error('Error Confirming the payment'),
                  });
                } else {
                  // Report to the browser that the confirmation was
                  // successful, prompting it to close the browser
                  // payment method collection interface.
                  ev.complete('success');
                  // Let Stripe.js handle the rest of the payment flow.
                  return this.stripeService.confirmCardPayment(
                    pi.client_secret
                  );
                }
              })
            );
        })
      )
      .subscribe((result) => {
        if (result.error) {
          // The payment failed -- ask your customer for a new payment method.
        } else {
          // The payment has succeeded.
        }
      });
  }

  onShippingAddressChange(ev: PaymentRequestShippingAddressEvent) {
    if (ev.shippingAddress.country !== 'US') {
      ev.updateWith({ status: 'invalid_shipping_address' });
    } else {
      // Replace this with your own custom implementation if needed
      fetch('/calculateShipping', {
        data: JSON.stringify({
          shippingAddress: ev.shippingAddress,
        }),
      } as any)
        .then((response) => response.json())
        .then((result) =>
          ev.updateWith({
            status: 'success',
            shippingOptions: result.supportedShippingOptions,
          })
        );
    }
  }

  onNotAvailable() {
    // Subscribe to this event in case you want to act
    // base on availability
    console.log('Payment Request is not Available');
  }

  createPaymentIntent(): Observable<PaymentIntent> {
    // Replace this with your own custom implementation
    // to perform a Payment Intent Creation
    // You will need your own Server to do that
    return this.http.post<PaymentIntent>('/create-payment-intent', {
      amount: this.paymentRequestOptions.total.amount,
    });
  }

  ngOnInit() {
    this.authStatusSubscription = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    } else {
      this.isLoading = true;
      this.authService.userLogin(form.value.email, form.value.password);
    }
  }

  ngOnDestroy() {
    this.authStatusSubscription.unsubscribe();
  }
}
