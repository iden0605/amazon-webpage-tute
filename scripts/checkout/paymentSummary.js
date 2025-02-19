import { cart } from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { centsToDollar } from "../utils/money.js";
import {deliveryOptions, getDeliveryOption} from "../../data/deliveryOptions.js";

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

      <button class="place-order-button button-primary">
        Place your order
      </button>
  `

  document.querySelector('.js-payment-summary')
    .innerHTML = paymentSummaryHTML;

}