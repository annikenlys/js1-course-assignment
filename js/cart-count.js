function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const count = cart.length;

  const link = document.querySelector(".cart-btn .cart-link");
  if (!link) return;

  let badge = link.querySelector(".cart-count");

  if (count > 0) {
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "cart-count";
      link.appendChild(badge);
    }
    badge.textContent = count;
    badge.style.display = "inline-flex";
  } else {
    if (badge) badge.remove();
  }
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
