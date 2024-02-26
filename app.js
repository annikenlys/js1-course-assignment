let productData = [];
const productListElement = document.getElementById("product-list");
const genreDropdownElement = document.getElementById("filter-list");

// Event listener for genre filter selection
genreDropdownElement.addEventListener("change", () => {
  filterByGenre(genreDropdownElement.value);
});

// Fetch data from the API
async function fetchData() {
  const loadingIndicator = createLoadingIndicator();

  try {
    const response = await fetch("https://api.noroff.dev/api/v1/gamehub");
    const productResultData = await response.json();

    if (productResultData.length > 0) {
      productData = productResultData;
      loadGenreIntoDropDown();
      displayProducts(productData);
    } else {
      console.warn("No data received from API");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("An error occurred while fetching data. Please try again later");
  } finally {
    // Remove loading indicator
    removeLoadingIndicator(loadingIndicator);
  }
}

fetchData();

// Function to create loading indicator
function createLoadingIndicator() {
  const loadingIndicator = document.createElement("div");
  loadingIndicator.textContent = "Loading products...";
  productListElement.appendChild(loadingIndicator);
  return loadingIndicator;
}

//Function to remove loading indicator
function removeLoadingIndicator(loadingIndicator) {
  if (loadingIndicator && loadingIndicator.parentNode) {
    loadingIndicator.parentNode.removeChild(loadingIndicator);
  }
}

// Load genres into dropdown list
function loadGenreIntoDropDown() {
  // Extract genres from product data
  const genres = [...new Set(productData.map((product) => product.genre))];

  // Fill the dropdown with genre options
  genres.forEach((genre) => {
    const genreOption = document.createElement("option");
    genreOption.value = genre;
    genreOption.innerText = genre;
    genreDropdownElement.appendChild(genreOption);
  });
}

// Display products on the page
function displayProducts(products) {
  // Clear product list
  productListElement.innerHTML = "";

  // Display each product with error handling
  products.forEach((product) => {
    try {
      displayProduct(product);
    } catch (error) {
      console.error("Error displaying product", error);
      const errorCard = document.createElement("div");
      errorCard.classList.add("error-card");
      errorCard.textContent = "An error occurred while loading this product.";
      productListElement.appendChild(errorCard);
    }
  });
}

// Display single product details
function displayProduct(product) {
  const productCard = document.createElement("div");
  productCard.classList.add("product-card");

  // Add click event to navigate to product details
  productCard.addEventListener("click", () => {
    sessionStorage.setItem("selectedProduct", JSON.stringify(product));
    window.location.href = "pages/product.html";
  });

  const priceDisplay = product.onSale
    ? `<p class="sale-price">${product.discountedPrice}</p>`
    : `<p>${product.price}</p>`;
  productCard.innerHTML = `
    <img src="${product.image}" alt="${product.title}" class="product-image">
    <h3>${product.title}</h3>
    ${priceDisplay}
  `;

  productListElement.appendChild(productCard);
}

// Filter products by genre
function filterByGenre(genreToFilterBy) {
  try {
    if (genreToFilterBy === "default") {
      // If default selected, display all products
      displayProducts(productData);
    } else {
      // Filter products by genre
      const filteredProducts = productData.filter(
        (product) => product.genre === genreToFilterBy,
      );
      displayProducts(filteredProducts);
    }
  } catch (error) {
    console.error("Error filtering products:", error);
    alert(
      "An error occurred while filtering products. Please try again later.",
    );
  }
}
