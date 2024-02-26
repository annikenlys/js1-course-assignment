const productCardContent = document.getElementById("product-card-content");
const checkoutDetails = document.getElementById("checkout-details");
const confirmationButton = document.getElementById("confirmation-button");
let groupedItems = {};
let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

displayCartItems(cartItems);

function displayCartItems(items) {
  productCardContent.innerHTML = "";
  if (items.length === 0) {
    productCardContent.innerHTML = `<p>Your cart is empty.</p>`;
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
  const productCard = document.createElement("div");
  productCard.classList.add("cart-product-card");
  productCard.innerHTML = `
    <img src="${item.image}" alt="${item.title}" class="product-image">
    <div class="product-info">
      <h3>${item.title}</h3>
      <p>Price: ${item.price}</p>
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
  const totalItems = Object.values(groupedItems).reduce(
    (groupedItems, curr) => groupedItems + curr.quantity,
    0,
  );
  const totalPrice = Object.values(groupedItems).reduce(
    (groupedItems, curr) =>
      groupedItems + parseFloat(curr.price) * curr.quantity,
    0,
  );
  checkoutDetails.innerHTML = `
    <h3>Summary</h3>
    <p>Total items: ${totalItems}</p>
    <p>Total price: $${totalPrice.toFixed(2)}</p>
    <ul>
      ${Object.values(groupedItems)
        .map((item) => `<li>${item.title}: ${item.quantity}</li>`)
        .join("")}
    </ul>
  `;
}

function clearCheckoutSummary() {
  checkoutDetails.innerHTML = "";
}

confirmationButton.addEventListener("click", () => {
  window.location.href = "confirmation.html";
});
