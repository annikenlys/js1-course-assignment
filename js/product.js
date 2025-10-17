const productCardContainer = document.getElementById("product-card-container");

const selectedProduct = JSON.parse(sessionStorage.getItem("selectedProduct"));

displayProductDetails(selectedProduct);

function displayProductDetails(product) {
  const singleProductCard = document.createElement("div");
  singleProductCard.classList.add("single-product-card");

  const discount = product.onSale
    ? Math.round(
        ((product.price - product.discountedPrice) / product.price) * 100,
      )
    : 0;

  const saleBadge = product.onSale
    ? `<span class="sale-badge">-${discount}%</span>`
    : "";

  const priceDisplay = product.onSale
    ? `<h2 class="sale-price">$${product.discountedPrice}
        <em class="old-price"><s>$${product.price}</s></em></h2>`
    : `<h2 class="price">$${product.price}</h2>`;

  singleProductCard.innerHTML = `
      <div class="image-wrapper">
        <img src="${product.image}" alt="${product.title}" class="single-product-image">
          ${saleBadge}
      </div>
  <div class="product-info">
    <h1>${product.title}</h1>
    <p>${product.description}</p>
    ${priceDisplay}
    <button id="add-to-cart-btn">Add to Cart</button>
  </div>
`;

  productCardContainer.appendChild(singleProductCard);

  const addToCartBtn = singleProductCard.querySelector("#add-to-cart-btn");
  addToCartBtn.addEventListener("click", (e) => {
    addToCart(product);
    const btn = e.currentTarget;
    btn.textContent = "Added ✓";
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = "Add to Cart";
      btn.disabled = false;
    }, 1500);
  });
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
}
