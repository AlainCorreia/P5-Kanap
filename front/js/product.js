const url = new URL(window.location.href);
const productId = url.searchParams.get('id');

const createProductImage = product => {
  const $productImage = document.createElement('img');
  $productImage.setAttribute('src', product.imageUrl);
  $productImage.setAttribute('alt', `${product.altTxt}, ${product.name}`);

  return $productImage;
};

const createProductColors = product => {
  for (let color of product.colors) {
    const $productColor = document.createElement('option');
    $productColor.setAttribute('value', color);
    $productColor.textContent = color;
    document.getElementById('colors').appendChild($productColor);
  }
};

const createProductInfo = product => {
  document.querySelector('title').textContent = product.name;
  document.querySelector('.item__img').appendChild(createProductImage(product));
  document.getElementById('title').textContent = product.name;
  document.getElementById('price').textContent = product.price;
  document.getElementById('description').textContent = product.description;

  createProductColors(product);
};

fetch(`http://localhost:3000/api/products/${productId}`)
  .then(res => {
    if (res.ok) {
      return res.json();
    }
  })
  .then(product => createProductInfo(product))
  .catch(err => {
    console.error('Error', err)
  });

let productSelectedColor;
document.getElementById('colors').addEventListener('change', (e) => {
  productSelectedColor = e.target.value;
});

let productSelectedQuantity;
document.getElementById('quantity').addEventListener('change', (e) => {
  productSelectedQuantity = +e.target.value;
});

const saveCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
}

const getCart = () => {
  let cart = JSON.parse(localStorage.getItem('cart'));
  if (!cart) {
    cart = [];
  }
  return cart;
}

const addToCart = (product) => {
  let cart = getCart();
  const foundProduct = cart.find(p => p.id == product.id && p.color == product.color);
  if (foundProduct) {
    foundProduct.quantity += productSelectedQuantity;
  } else {
    cart.push(product);
  }
  saveCart(cart);
}

document.getElementById('addToCart').addEventListener('click', () => {
  if (productSelectedColor && productSelectedQuantity > 0 && productSelectedQuantity <= 100) {
    const product = {
      id: productId,
      quantity: productSelectedQuantity,
      color: productSelectedColor
    };
    addToCart(product);
  }
})