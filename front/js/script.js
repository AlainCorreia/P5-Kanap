// Stocke l'élément HTML avec l'id 'items' dans une constante
const $items = document.getElementById('items');

/**
 * Crée l'élément img du produit
 * @param {Object} product un produit du catalogue
 * @return {HTMLImageElement} img
 */
const createProductImage = (product) => {
  const $productImage = document.createElement('img');
  $productImage.setAttribute('src', product.imageUrl);
  $productImage.setAttribute('alt', `${product.altTxt}, ${product.name}`);

  return $productImage;
};

/**
 * Crée l'élément h3 contenant le nom du produit
 * @param {Object} product un produit du catalogue
 * @return {HTMLHeadingElement} h3
 */
const createProductName = (product) => {
  const $productName = document.createElement('h3');
  $productName.className = 'productName';
  $productName.textContent = product.name;

  return $productName;
};

/**
 * Crée un élément p contenant la description du produit
 * @param {Object} product un produit du catalogue
 * @return {HTMLParagraphElement} p
 */
const createProductDescription = (product) => {
  const $productDescription = document.createElement('p');
  $productDescription.className = 'productDescription';
  $productDescription.textContent = product.description;

  return $productDescription;
};

/**
 * Crée un élément a contenant la carte produit
 * @param {Object} product un produit du catalogue
 * @return {HTMLAnchorElement} a
 */
const createProductCard = (product) => {
  const $productCard = document.createElement('a');
  $productCard.setAttribute('href', './product.html?' + new URLSearchParams({id: product._id}));

  const $productCardArticle = document.createElement('article');
  $productCardArticle.appendChild(createProductImage(product));
  $productCardArticle.appendChild(createProductName(product));
  $productCardArticle.appendChild(createProductDescription(product));

  $productCard.appendChild($productCardArticle);

  return $productCard;
};

/**
 * Requête l'API pour créer les cartes des produits et les ajoute à la page
 */
fetch('http://localhost:3000/api/products')
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((products) => {
      for (const product of products) {
        $items.appendChild(createProductCard(product));
      }
    })
    .catch((err) => {
      console.error('Error', err);
    });
