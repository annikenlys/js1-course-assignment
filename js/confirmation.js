document.addEventListener("DOMContentLoaded", function () {
  const confirmationContainer = document.getElementById(
    "confirmation-container",
  );

  function displayConfirmationSummary() {
    const summary = JSON.parse(localStorage.getItem("orderSummary") || "null");
    if (!summary) {
      confirmationContainer.innerHTML = `<p>Your order summary is missing.</p>`;
      return;
    }

    const { items, totals } = summary;

    confirmationContainer.innerHTML = `
      <h1>Order Confirmation</h1>
      <h2>Thank you for shopping with us!</h2>
      <div class="order-summary">
        <h3>Order summary:</h3>
        <p>Total items: ${totals.totalItems}</p>
        <p>Total price: $${totals.subtotal.toFixed(2)}</p>
        ${totals.saved > 0 ? `<p class="you-saved">You saved $${totals.saved.toFixed(2)} 🎉</p>` : ""}
        <ul>
          ${items
            .map(
              (i) => `
            <li>
              <img src="${i.image || ""}" alt="${i.title || ""}" class="cart-item-image">
              <div>
                <p>${i.title}</p>
                ${
                  i.onSale
                    ? `<p>Price:
                  <span class="sale-price">$${i.unitPrice.toFixed(2)}</span>
                  <span class="old-price" style="text-decoration:line-through;opacity:.7;">
                    $${i.originalUnitPrice.toFixed(2)}
                  </span>
                  ${i.quantity > 1 ? ` ×${i.quantity}` : ""}
                  </p>`
                    : `<p>Price:
                    <span class="sale-price">$${i.unitPrice.toFixed(2)}</span>
                    ${i.quantity > 1 ? ` ×${i.quantity}` : ""}
                  </p>`
                }
                ${i.quantity > 1 ? `<p>Subtotal: <span class="sale-price">$${(i.unitPrice * i.quantity).toFixed(2)}</span></p>` : ""}
              </div>
            </li>`,
            )
            .join("")}
          </ul>
      </div>
    `;

    const continueShoppingBtn = document.createElement("button");
    continueShoppingBtn.addEventListener("click", () => {
      localStorage.removeItem("cart");
      localStorage.removeItem("orderSummary");
      sessionStorage.removeItem("productCart");
      window.location.href = "index.html";
    });
    continueShoppingBtn.innerText = "Continue shopping";
    continueShoppingBtn.classList.add("continue-shopping-btn");
    confirmationContainer.appendChild(continueShoppingBtn);
  }

  displayConfirmationSummary();
});
