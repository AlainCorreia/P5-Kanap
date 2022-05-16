const url = new URL(window.location.href);
const productId = url.searchParams.get('id');


const createProductImage = (product) => {
  const $productImage = document.createElement('img');
  $productImage.setAttribute('src', product.imageUrl);
  $productImage.setAttribute('alt', `${product.altTxt}, ${product.name}`);

  return $productImage;
};

const createProductColors = (product) => {
  for (const color of product.colors) {
    const $productColor = document.createElement('option');
    $productColor.setAttribute('value', color);
    $productColor.textContent = color;
    document.getElementById('colors').appendChild($productColor);
  }
};

const createProductInfo = (product) => {
  document.querySelector('title').textContent = product.name;
  document.querySelector('.item__img').appendChild(createProductImage(product));
  document.getElementById('title').textContent = product.name;
  document.getElementById('price').textContent = product.price;
  document.getElementById('description').textContent = product.description;

  createProductColors(product);
};

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

const saveCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

const getCart = () => {
  let cart = JSON.parse(localStorage.getItem('cart'));
  if (!cart) {
    cart = [];
  }
  return cart;
};

const addToCart = (product) => {
  const cart = getCart();
  const selectedQuantity = +(document.getElementById('quantity').value);
  const foundProduct = cart.find((p) => p.id === product.id && p.color === product.color);
  if (foundProduct && foundProduct.quantity + selectedQuantity > 100) {
    alert('Pas plus de 100 produits');
  } else if (foundProduct) {
    foundProduct.quantity += selectedQuantity;
  } else {
    cart.push(product);
  }
  saveCart(cart);
};

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
  }
});
