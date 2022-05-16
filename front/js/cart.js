const getCart = () => {
  let cart = JSON.parse(localStorage.getItem('cart'));
  if (!cart) {
    cart = [];
  }
  return cart;
};

const cart = getCart();
cart.sort((a, b) => a.id > b.id ? 1 : -1);

const createCartItemImage = (product) => {
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

const saveCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

const displayTotalQuantity = () => {
  let totalQuantity = 0;
  for (const item of cart) {
    totalQuantity += item.quantity;
  }
  document.getElementById('totalQuantity').textContent = totalQuantity;
};

const displayTotalPrice = async () => {
  let totalPrice = 0;
  for (const item of cart) {
    await fetch(`http://localhost:3000/api/products/${item.id}`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        .then((product) => {
          totalPrice += item.quantity * product.price;
        });
  }
  document.getElementById('totalPrice').textContent = totalPrice.toLocaleString('fr-FR', {minimumFractionDigits: 2});
};

const removeFromCart = (id, color) => {
  const itemToRemove = cart.findIndex((p) => id === p.id && color === p.color);
  cart.splice(itemToRemove, 1);
  saveCart(cart);
  displayTotalQuantity();
  displayTotalPrice();
};

const handleRemoveFromCart = () => {
  const deleteButtons = document.querySelectorAll('p.deleteItem');
  deleteButtons.forEach((button) => {
    const id = button.closest('.cart__item').dataset.id;
    const color = button.closest('.cart__item').dataset.color;
    button.addEventListener('click', (e) => {
      removeFromCart(id, color);
      e.target.closest('.cart__item').remove();
    });
  });
};

const changeQuantity = (id, color, quantity) => {
  const quantityToChange = cart.find((p) => id === p.id && color === p.color);
  if (quantity > 0 && quantity <= 100) {
    quantityToChange.quantity = quantity;
    saveCart(cart);
    displayTotalQuantity();
    displayTotalPrice();
  }
};

const handleChangeQuantity = () => {
  const quantityInputs = document.querySelectorAll('input.itemQuantity');
  quantityInputs.forEach((input) => {
    const id = input.closest('.cart__item').dataset.id;
    const color = input.closest('.cart__item').dataset.color;
    input.addEventListener('change', (e) => {
      changeQuantity(id, color, +e.target.value);
    });
  });
};

const createList = async () => {
  for (const item of cart) {
    await fetch(`http://localhost:3000/api/products/${item.id}`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        .then((product) => {
          document.getElementById('cart__items').appendChild(createCartItem(item, product));
        });
  }
  displayTotalQuantity();
  displayTotalPrice();
  handleRemoveFromCart();
  handleChangeQuantity();
};

createList();

document.getElementById('firstName').setAttribute('pattern', '^[a-zA-ZàâæçéèêëîïôœùûüÿÀÂÆÇnÉÈÊËÎÏÔŒÙÛÜŸ]+[a-zA-ZàâæçéèêëîïôœùûüÿÀÂÆÇnÉÈÊËÎÏÔŒÙÛÜŸ \.\'\-]{0,30}');
document.getElementById('lastName').setAttribute('pattern', '^[a-zA-ZàâæçéèêëîïôœùûüÿÀÂÆÇnÉÈÊËÎÏÔŒÙÛÜŸ]+[a-zA-ZàâæçéèêëîïôœùûüÿÀÂÆÇnÉÈÊËÎÏÔŒÙÛÜŸ \.\'\-]{0,30}');
document.getElementById('address').setAttribute('pattern', '^[a-zA-Z0-9àâæçéèêëîïôœùûüÿÀÂÆÇnÉÈÊËÎÏÔŒÙÛÜŸ]+[a-zA-Z0-9àâæçéèêëîïôœùûüÿÀÂÆÇnÉÈÊËÎÏÔŒÙÛÜŸ \.\,\'\-]{5,40}');
document.getElementById('city').setAttribute('pattern', '^[a-zA-ZàâæçéèêëîïôœùûüÿÀÂÆÇnÉÈÊËÎÏÔŒÙÛÜŸ]+[a-zA-ZàâæçéèêëîïôœùûüÿÀÂÆÇnÉÈÊËÎÏÔŒÙÛÜŸ \'\-]{0,40}');
document.getElementById('email').setAttribute('pattern', '^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z.]{2,15}$');

const checkField = (field) => {
  const errorMessages = document.querySelectorAll('form p');
  for (const msg of errorMessages) {
    msg.textContent = '';
  }
  if (field.validity.valueMissing) {
    field.nextElementSibling.textContent = 'Veuillez renseigner ce champ';
  }
  if (field.validity.patternMismatch) {
    if (field.id === 'firstName' || field.id === 'lastName') {
      field.nextElementSibling.textContent = 'Ce champ ne peut contenir que des lettres ou les caractères . \' - (max. 30 caractères)';
    } else if (field.id === 'address') {
      document.getElementById('addressErrorMsg').textContent = 'Ce champ ne peut contenir que des lettres, des chiffres ou les caractères , \' - (max. 40 caractères)';
    } else if (field.id === 'city') {
      document.getElementById('cityErrorMsg').textContent = 'Ce champ ne peut contenir que des lettres ou les caractères \' - (max. 40 caractères)';
    } else {
      document.getElementById('emailErrorMsg').textContent = 'Veuillez saisir une adresse email valide';
    }
  }
  return field.checkValidity();
};

const createContact = () => {
  const contact = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    email: document.getElementById('email').value,
  };
  return contact;
};

const createOrderProducts = () => {
  const products = [];
  for (const product of cart) {
    products.push(product.id);
  }
  return products;
};

document.getElementById('order').addEventListener('click', (e) => {
  e.preventDefault();
  const fields = document.querySelectorAll('form input[type="text"], form input[type="email"]');
  let valid = true;
  for (const field of fields) {
    valid &= checkField(field);
    if (!valid) {
      break;
    }
  }
  if (valid) {
    sendOrder();
  }
});

const sendOrder = () => {
  fetch('http://localhost:3000/api/products/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({contact: createContact(), products: createOrderProducts()}),
  })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((value) => {
        console.log(value);

        window.location.href = `./confirmation.html?${value.orderId}`;
      });
};

