import {cart, removeFromCart, updateDeliveryOption} from '../../data/cart.js';
import {getProduct, products} from '../../data/products.js';
import {centsToDollar} from '../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

export function renderOrderSummary() {
  let ordersHTML = '';

  // generating cart items html
  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId);

    let deliveryOptionId = cartItem.deliveryOptionId;
    let deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(
      deliveryOption.deliveryDays,
      'days'
  );
    
    const priceString = deliveryOption.priceCents === 0 ? 'FREE': 
      `$${centsToDollar(deliveryOption.priceCents)} -`;

    const dateString = deliveryDate.format('dddd, MMMM D');

    ordersHTML += `
      <div class="cart-item-container 
        js-cart-item-container
        js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              $${centsToDollar(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity 
              js-product-quantity-${matchingProduct.id}">
              <span>
                Quantity: ${cartItem.quantity}
              </span>
              <span class="update-quantity-link js-update-quantity-link link-primary">
                Update
              </span>
              <span data-product-id="${matchingProduct.id}" 
                class="delete-quantity-link js-delete-link 
                link-primary
                js-delete-link-${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });


  // generating delivery options html for cart items
  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(
        deliveryOption.deliveryDays,
        'days'
      );
      
      const priceString = deliveryOption.priceCents === 0 ? 'FREE': 
        `$${centsToDollar(deliveryOption.priceCents)} -`;

      const dateString = deliveryDate.format('dddd, MMMM D');

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
        <div class="delivery-option js-delivery-option"
          data-product-id="${matchingProduct.id}"
          data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
            ${isChecked ? 'checked': ''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>
      `
    });
    return html;
  }

  document.querySelector('.js-order-summary')
    .innerHTML = ordersHTML;



  document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);
        renderPaymentSummary();
        
        document.querySelector(`.js-cart-item-container-${productId}`)
          .remove();
      });
    })

  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        const {productId, deliveryOptionId} = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummary();
      });
    });
}




