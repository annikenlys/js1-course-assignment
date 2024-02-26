const productCardContainer = document.getElementById("product-card-container");

const selectedProduct = JSON.parse(sessionStorage.getItem("selectedProduct"));

displayProductDetails(selectedProduct);

function displayProductDetails(product) {
  const singleProductCard = document.createElement("div");
  singleProductCard.classList.add("single-product-card");

  const priceDisplay = product.onSale
    ? `<h2 class="sale-price">${product.discountedPrice}</h2>`
    : `<h2>${product.price}</h2>`;
  singleProductCard.innerHTML = `
    <img src="${product.image}" alt="${product.title}" class="single-product-image">
    <div class="product-info">
      <h1>${product.title}</h1>
      <p>${product.description}</p>
      ${priceDisplay}
      <button id="add-to-cart-btn">Add to Cart</button>
    </div>
  `;

  productCardContainer.appendChild(singleProductCard);

  const addToCartBtn = singleProductCard.querySelector("#add-to-cart-btn");
  addToCartBtn.addEventListener("click", () => addToCart(product));
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Product added to cart!");
}
