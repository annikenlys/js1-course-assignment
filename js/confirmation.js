document.addEventListener("DOMContentLoaded", function () {
  const confirmationContainer = document.getElementById(
    "confirmation-container",
  );

  function displayConfirmationSummary() {
    const cartItemsFromCheckout =
      JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsFromProduct =
      JSON.parse(sessionStorage.getItem("productCart")) || [];

    const allCartItems = [...cartItemsFromCheckout, ...cartItemsFromProduct];

    const totalItems = allCartItems.reduce(
      (total, item) => total + (item.quantity || 0),
      0,
    );
    const totalPrice = allCartItems.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 0),
      0,
    );

    confirmationContainer.innerHTML = `
      <h1>Order Confirmation</h1>
      <h2>Thank you for shopping with us!</h2>
      <h3>Order summary:</h3>
      <p>Total items: ${totalItems}</p>
      <p>Total price: $${totalPrice.toFixed(2)}</p>
      <ul>
        ${allCartItems
          .map(
            (item) => `
              <li>
                <img src="${item.image || ""}" alt="${item.title || ""}" class="cart-item-image">
                <div>
                  <p>${item.title || ""}: ${item.quantity || ""}</p>
                  <p>Price: $${(item.price || 0).toFixed(2)}</p>
                </div>
              </li>
            `,
          )
          .join("")}
      </ul>
    `;

    const continueShoppingBtn = document.createElement("button");
    continueShoppingBtn.addEventListener("click", () => {
      localStorage.removeItem("cart");
      window.location.href = "index.html";
    });
    continueShoppingBtn.innerText = "Continue shopping";
    continueShoppingBtn.classList.add("continue-shopping-btn");
    confirmationContainer.appendChild(continueShoppingBtn);
  }

  displayConfirmationSummary();
});
