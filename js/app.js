let productData = [];
const loadingContainerElement = document.getElementById("loading-container");
const productListElement = document.getElementById("product-list");
const genreDropdownElement = document.getElementById("filter-list");

genreDropdownElement.addEventListener("change", () => {
  filterByGenre(genreDropdownElement.value);
});

async function fetchData() {
  const loadingIndicator = showLoadingIndicator();

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
    removeLoadingIndicator(loadingIndicator);
  }
}

fetchData().catch((error) =>
  console.error("Unhandled fetchData error:", error),
);

function showLoadingIndicator() {
  loadingContainerElement.style.display = "flex";
  return loadingContainerElement;
}

function removeLoadingIndicator(indicator) {
  indicator?.remove();
  loadingContainerElement.style.display = "none";
}

function loadGenreIntoDropDown() {
  const genres = [...new Set(productData.map((product) => product.genre))];

  genres.forEach((genre) => {
    const genreOption = document.createElement("option");
    genreOption.value = genre;
    genreOption.innerText = genre;
    genreDropdownElement.appendChild(genreOption);
  });
}

function displayProducts(products) {
  productListElement.innerHTML = "";

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

function displayProduct(product) {
  const productCard = document.createElement("div");
  productCard.classList.add("product-card");

  productCard.addEventListener("click", () => {
    sessionStorage.setItem("selectedProduct", JSON.stringify(product));
    window.location.href = "product.html";
  });

  const discount = product.onSale
    ? Math.round(
        ((product.price - product.discountedPrice) / product.price) * 100,
      )
    : 0;

  const saleBadge = product.onSale
    ? `<span class="sale-badge">-${discount}%</span>`
    : "";

  const priceDisplay = product.onSale
    ? `<p class="sale-price">$${product.discountedPrice}
        <em class="old-price"><s>$${product.price}</s></em></p>`
    : `<p class="price">$${product.price}</p>`;

  productCard.innerHTML = `
      <div class="image-wrapper">
        <img src="${product.image}" alt="${product.title}" class="product-image">
          ${saleBadge}
      </div>
  <h3 class="title">${product.title}</h3>
 ${priceDisplay}
`;

  productListElement.appendChild(productCard);
}

function filterByGenre(genreToFilterBy) {
  try {
    if (genreToFilterBy === "default") {
      displayProducts(productData);
    } else {
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
