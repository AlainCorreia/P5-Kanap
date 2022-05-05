const $items = document.getElementById('items');

const createProductImage = product => {
  const $productImage = document.createElement('img');
  $productImage.setAttribute('src', product.imageUrl);
  $productImage.setAttribute('alt', `${product.altTxt}, ${product.name}`);

  return $productImage;
};

const createProductName = product => {
  const $productName = document.createElement('h3');
  $productName.className = 'productName';
  $productName.textContent = product.name;

  return $productName;
};

const createProductDescription = product => {
  const $productDescription = document.createElement('p');
  $productDescription.className = 'productDescription';
  $productDescription.textContent = product.description;

  return $productDescription;
};

const createProductCard = product => {
  const $productCard = document.createElement('a');
  $productCard.setAttribute('href', './product.html?' + new URLSearchParams({
    id: product._id
  }));
  
  const $productCardArticle = document.createElement('article');
  $productCardArticle.appendChild(createProductImage(product));
  $productCardArticle.appendChild(createProductName(product));
  $productCardArticle.appendChild(createProductDescription(product));

  $productCard.appendChild($productCardArticle);

  return $productCard;
};

fetch('http://localhost:3000/api/products')
  .then(res => {
    if (res.ok) {
      return res.json();
    }
  })
  .then(products => {
    for (let product of products) {
      $items.appendChild(createProductCard(product));
    }
  })
  .catch(err => {
    console.error('Error', err)
  });