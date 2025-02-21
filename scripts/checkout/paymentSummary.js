import { cart } from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { centsToDollar } from "../utils/money.js";
import {deliveryOptions, getDeliveryOption} from "../../data/deliveryOptions.js";
import { addOrder } from "../../data/orders.js";

export function renderPaymentSummary() {
  let itemsPriceCents = 0;
  let deliveryPriceCents = 0;
  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    
    let productPriceCents = getProduct(productId).priceCents;
    itemsPriceCents += productPriceCents * cartItem.quantity;

    deliveryPriceCents += getDeliveryOption(cartItem.deliveryOptionId).priceCents;

  });
  const deliveryPrice = centsToDollar(deliveryPriceCents);
  const itemsPrice = centsToDollar(itemsPriceCents);

  const totalBeforeTaxPriceCents = deliveryPriceCents + itemsPriceCents;
  const totalBeforeTaxPrice = centsToDollar(totalBeforeTaxPriceCents);
  
  const taxPriceCents = totalBeforeTaxPriceCents * 0.1;
  const taxPrice = centsToDollar(taxPriceCents);

  const totalPriceCents = totalBeforeTaxPriceCents + taxPriceCents;
  const totalPrice = centsToDollar(totalPriceCents);

  const paymentSummaryHTML = `
    
      <div class="payment-summary-title">
        Order Summary
      </div>

      <div class="payment-summary-row">
        <div>Items (3):</div>
        <div class="payment-summary-money">$${itemsPrice}</div>
      </div>

      <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money">$${deliveryPrice}</div>
      </div>

      <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money">$${totalBeforeTaxPrice}</div>
      </div>

      <div class="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div class="payment-summary-money">$${taxPrice}</div>
      </div>

      <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money">$${totalPrice}</div>
      </div>

      <button class="place-order-button js-place-order button-primary">
        Place your order
      </button>
  `

  document.querySelector('.js-payment-summary')
    .innerHTML = paymentSummaryHTML;

  document.querySelector('.js-place-order')
    .addEventListener('click', async () => {
      try {
        const response = await fetch('https://supersimplebackend.dev/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            cart: cart
          })
        });
        const order = await response.json();
        addOrder(order);
      }
      catch (error) {
        console.log('Unexpected error, try again later');
      }

      window.location.href = 'orders.html';
    });
}