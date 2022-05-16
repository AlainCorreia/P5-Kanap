const url = new URL(window.location.href);
document.getElementById('orderId').textContent = url.search.substring(1);
