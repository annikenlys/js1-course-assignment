const productCardContent = document.getElementById("product-card-content");
const checkoutDetails = document.getElementById("checkout-details");
const confirmationButton = document.getElementById("confirmation-button");
let groupedItems = {};
let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

displayCartItems(cartItems);

function displayCartItems(items) {
  productCardContent.innerHTML = "";
  if (items.length === 0) {
    confirmationButton.style.display = "none";
    productCardContent.innerHTML = `<p class="sale-price">Your cart is empty.</p>`;
    clearCheckoutSummary();
    return;
  }
  groupedItems = groupItemsById(items);
  Object.values(groupedItems).forEach((item) => {
    const productCard = createProductCard(item);
    productCardContent.appendChild(productCard);
    addEventListeners(item, productCard);
  });
  displayCartSummary();
}

function groupItemsById(items) {
  return items.reduce((groupedItems, item) => {
    if (!groupedItems[item.id]) {
      groupedItems[item.id] = { ...item, quantity: 1 };
    } else {
      groupedItems[item.id].quantity++;
    }
    return groupedItems;
  }, {});
}

function createProductCard(item) {
  const unitPrice = Number(item.onSale ? item.discountedPrice : item.price);
  const priceHtml = item.onSale
    ? `<p>Price:
        <span class="sale-price">$${unitPrice.toFixed(2)}</span>
        <span class="old-price" style="text-decoration:line-through;opacity:.7;">
          $${Number(item.price).toFixed(2)}
        </span>
      </p>`
    : `<p>Price: <span class="sale-price">$${unitPrice.toFixed(2)}</span></p>`;

  const productCard = document.createElement("div");
  productCard.classList.add("cart-product-card");
  productCard.innerHTML = `
    <img src="${item.image}" alt="${item.title}" class="product-image">
    <div class="product-info">
      <h3>${item.title}</h3>
      ${priceHtml}
      <p>Quantity: <span class="quantity">${item.quantity}</span></p>
      ${
        item.quantity > 1
          ? `<button class="increase-quantity-btn">+</button>
      <button class="decrease-quantity-btn">-</button>`
          : ""
      }
      <button class="remove-from-cart-btn">Remove</button>
    </div>
  `;
  return productCard;
}

function addEventListeners(item, productCard) {
  const removeFromCartBtn = productCard.querySelector(".remove-from-cart-btn");
  removeFromCartBtn.addEventListener("click", () => removeFromCart(item));
  if (item.quantity > 1) {
    const increaseQuantityBtn = productCard.querySelector(
      ".increase-quantity-btn",
    );
    increaseQuantityBtn.addEventListener("click", () => increaseQuantity(item));
    const decreaseQuantityBtn = productCard.querySelector(
      ".decrease-quantity-btn",
    );
    decreaseQuantityBtn.addEventListener("click", () => decreaseQuantity(item));
  }
}

function removeFromCart(item) {
  cartItems = cartItems.filter((cartItem) => cartItem.id !== item.id);
  delete groupedItems[item.id];
  updateCart();
}

function increaseQuantity(item) {
  groupedItems[item.id].quantity++;
  updateCart();
}

function decreaseQuantity(item) {
  if (groupedItems[item.id].quantity > 1) {
    groupedItems[item.id].quantity--;
    updateCart();
  }
}

function updateCart() {
  cartItems = Object.values(groupedItems).flatMap((item) =>
    Array(item.quantity).fill(item),
  );
  localStorage.setItem("cart", JSON.stringify(cartItems));
  displayCartItems(cartItems);
}

function displayCartSummary() {
  const items = Object.values(groupedItems);
  const totalItems = items.reduce((n, it) => n + it.quantity, 0);

  const totals = items.reduce(
    (acc, it) => {
      const orig = Number(it.price) || 0;
      const unit = Number(it.onSale ? it.discountedPrice : it.price) || 0;
      acc.original += orig * it.quantity;
      acc.actual += unit * it.quantity;
      return acc;
    },
    { original: 0, actual: 0 },
  );

  const saved = Math.max(0, totals.original - totals.actual);
  checkoutDetails.innerHTML = `
    <h3>Summary</h3>
    <p>Total items: ${totalItems}</p>
    <p>Total price: $${totals.actual.toFixed(2)}</p>
    ${saved > 0 ? `<p class="you-saved">You saved $${saved.toFixed(2)} 🎉</p>` : ""}
    <ul>
    ${items.map((it) => `<li>${it.title}: ${it.quantity}</li>`).join("")}
    </ul>
  `;
}

function clearCheckoutSummary() {
  checkoutDetails.innerHTML = "";
}

confirmationButton.addEventListener("click", () => {
  window.location.href = "confirmation.html";
});
