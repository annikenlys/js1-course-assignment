function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const count = cart.length;

  document.querySelectorAll(".cart-btn .cart-link").forEach((link) => {
    let badge = link.querySelector(".cart-count");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "cart-count";
      link.appendChild(badge);
    }
    badge.textContent = count;
    badge.style.display = count ? "inline-flex" : "none";
  });
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
