const productList = document.getElementById("product-list");

let productData = [];

fetch("https://api.noroff.dev/api/v1/gamehub")
  .then((Response) => Response.json())
  .then((productResultData) => {
    productData = productResultData;

    for (const product of productData) {
      displayProduct(product);
    }
  });

function displayProduct(product) {
  const productDiv = document.createElement("div");
  const productTitlePara = document.createElement("p");
  productTitlePara.innerText = product.title;
  const productImg = document.createElement("img");
  productImg.src = product.image;
  productImg.alt = "Picture of the video game";
  productDiv.appendChild(productImg);
  productDiv.appendChild(productTitlePara);
  productList.appendChild(productDiv);
}
