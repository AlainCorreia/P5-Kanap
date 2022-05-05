const getCart = () => {
  let cart = JSON.parse(localStorage.getItem('cart'));
  if (!cart) {
    cart = [];
  }
  return cart;
}

const cart = getCart();
cart.sort((a, b) => a.id > b.id ? 1 : -1);

const createCartItemImage = product => {
  const $itemImageContainer = document.createElement('div');
  $itemImageContainer.className = 'cart__item__img';

  const $itemImg = document.createElement('img');
  $itemImg.setAttribute('src', product.imageUrl);
  $itemImg.setAttribute('alt', `${product.altTxt}, ${product.name}`);

  $itemImageContainer.appendChild($itemImg);

  return $itemImageContainer;
};


const createCartItemContent = (item, product) => {
  const $cartItemContent = document.createElement('div');
  $cartItemContent.className = 'cart__item__content';

  const $itemDescription = document.createElement('div');
  $itemDescription.className = 'cart__item__content__description';

  const $itemName = document.createElement('h2');
  $itemName.textContent = product.name;

  const $itemColor = document.createElement('p');
  $itemColor.textContent = item.color;

  const $itemPrice = document.createElement('p');
  $itemPrice.textContent = product.price.toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'});

  $itemDescription.appendChild($itemName);
  $itemDescription.appendChild($itemColor);
  $itemDescription.appendChild($itemPrice);

  const $itemSettings = document.createElement('div');
  $itemSettings.className = 'cart__item__content__settings';

  const $itemQuantity = document.createElement('div');
  $itemQuantity.className = 'cart__item__content__settings__quantity';
  const $itemQuantityText = document.createElement('p');
  $itemQuantityText.textContent = 'Qté : ';
  $itemQuantity.appendChild($itemQuantityText);

  const $itemQuantityInput = document.createElement('input');
  $itemQuantityInput.className = 'itemQuantity';
  $itemQuantityInput.setAttribute('type', 'number');
  $itemQuantityInput.setAttribute('name', 'itemQuantity');
  $itemQuantityInput.setAttribute('min', 1);
  $itemQuantityInput.setAttribute('max', 100);
  $itemQuantityInput.setAttribute('value', item.quantity);
  $itemQuantity.appendChild($itemQuantityInput);

  const $itemDelete = document.createElement('div');
  $itemDelete.className = 'cart__item__content__settings__delete';
  const $itemDeleteText = document.createElement('p');
  $itemDeleteText.className = 'deleteItem';
  $itemDeleteText.textContent = 'Supprimer';
  $itemDelete.appendChild($itemDeleteText);

  $itemSettings.appendChild($itemQuantity);
  $itemSettings.appendChild($itemDelete);

  $cartItemContent.appendChild($itemDescription);
  $cartItemContent.appendChild($itemSettings);

  return $cartItemContent;
};

const createCartItem = (item, product) => {
  const $cartItem = document.createElement('article');
  $cartItem.dataset.id = item.id;
  $cartItem.dataset.color = item.color;
  $cartItem.className = 'cart__item';
  $cartItem.appendChild(createCartItemImage(product));
  $cartItem.appendChild(createCartItemContent(item, product));

  return $cartItem;
};

for (let item of cart) {
  fetch(`http://localhost:3000/api/products/${item.id}`)
    .then(res => {
      if (res.ok) {
        return res.json();
      }
    })
    .then(product => {
      document.getElementById('cart__items').appendChild(createCartItem(item, product));
    })
};




