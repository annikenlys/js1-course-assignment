const productList = document.getElementById("product-list");
let productData = [];

// Fetch data from the API
async function fetchData() {
  const loadingIndicator = document.createElement("div");
  loadingIndicator.textContent = "Loading products...";
  productList.appendChild(loadingIndicator);

  try {
    const response = await fetch("https://api.noroff.dev/api/v1/gamehub");
    const productResultData = await response.json();

    if (productResultData.length > 0) {
      productList.removeChild(loadingIndicator);
      productData = productResultData;
      for (const product of productData) {
        displayProduct(product);
      }
    } else {
      console.warn("No data received from API");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchData();

// Display the data from the API
function displayProduct(product) {
  const productDiv = document.createElement("div");

  productDiv.addEventListener("click", () => {
    navigateToProductDetails(product);
  });

  if (product.onSale) {
    productDiv.innerHTML += `
    <img src="${product.image}" alt="video game cover">
    <h2>${product.title}</h2>
    <h3 class="discounted-price">${product.discountedPrice}</h3>
    <h3 class="before-price">${product.price}</h3>
    `;
  } else {
    productDiv.innerHTML += `
    <img src="${product.image}" alt="video game cover">
    <h2>${product.title}</h2>
    <h3>${product.price}</h3>
    `;
  }
  productList.appendChild(productDiv);
}

// Function to navigate to product details page
function navigateToProductDetails(product) {
  sessionStorage.setItem("selectedProduct", JSON.stringify(product));
  window.location.href = "pages/products/product.html";
}
