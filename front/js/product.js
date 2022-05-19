// Récupère l'id du produit dans l'url
const url = new URL(window.location.href);
const productId = url.searchParams.get('id');

/**
 * Crée l'élément img de la fiche produit
 * @param {Object} product
 * @return {HTMLImageElement} img
 */
const createProductImage = (product) => {
  const $productImage = document.createElement('img');
  $productImage.setAttribute('src', product.imageUrl);
  $productImage.setAttribute('alt', `${product.altTxt}, ${product.name}`);

  return $productImage;
};

/**
 * Crée des options de couleur pour le menu déroulant de la fiche produit
 * @param {Object} product
 */
const createProductColors = (product) => {
  for (const color of product.colors) {
    const $productColor = document.createElement('option');
    $productColor.setAttribute('value', color);
    $productColor.textContent = color;
    document.getElementById('colors').appendChild($productColor);
  }
};

/**
 * Crée les infos de la fiche produit
 * @param {*} product
 */
const createProductInfo = (product) => {
  document.querySelector('title').textContent = product.name;
  document.querySelector('.item__img').appendChild(createProductImage(product));
  document.getElementById('title').textContent = product.name;
  document.getElementById('price').textContent = product.price;
  document.getElementById('description').textContent = product.description;

  createProductColors(product);
};

/**
 * Requête l'API pour créer la fiche produit
 */
fetch(`http://localhost:3000/api/products/${productId}`)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((product) => createProductInfo(product))
    .catch((err) => {
      console.error('Error', err);
    });

/**
 * Sauvegarde le panier dans le localStorage
 * @param {Array} cart
 */
const saveCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

/**
 * Récupère le panier depuis le localStorage
 * @return {Array}
 */
const getCart = () => {
  let cart = JSON.parse(localStorage.getItem('cart'));
  if (!cart) {
    cart = [];
  }
  return cart;
};

/**
 * Gère l'ajout de produit au panier
 * @param {Object} product {id, quantity, color}
 */
const addToCart = (product) => {
  const cart = getCart();
  const selectedQuantity = +(document.getElementById('quantity').value);
  // Vérifie si le produit est déjà présent dans le panier (même id et couleur)
  const foundProduct = cart.find((p) => p.id === product.id && p.color === product.color);
  if (foundProduct && foundProduct.quantity + selectedQuantity > 100) {
    alert('Votre panier ne peut pas contenir plus de 100 produits identiques (même référence, même couleur)'); // Alerte si plus de 100 produits identiques
  } else if (foundProduct) {
    foundProduct.quantity += selectedQuantity; // Incrémente la quantité si le produit est déjà dans le panier
  } else {
    cart.push(product); // Ajoute le produit au panier s'il n'y est pas déjà
  }
  saveCart(cart);
};

/**
 * Écoute l'évènement click sur le bouton 'Ajouter au panier'
 */
document.getElementById('addToCart').addEventListener('click', () => {
  const selectedColor = document.getElementById('colors').value;
  const selectedQuantity = +(document.getElementById('quantity').value);
  if (selectedColor && selectedQuantity > 0 && selectedQuantity <= 100) {
    const product = {
      id: productId,
      quantity: selectedQuantity,
      color: selectedColor,
    };
    addToCart(product);
  } else {
    alert('Veuillez sélectionner une couleur et une quantité de 1 à 100');
  }
});
