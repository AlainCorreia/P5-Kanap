// Récupère le numéro de commande dans l'url et l'affiche sur la page
const url = new URL(window.location.href);
document.getElementById('orderId').textContent = url.searchParams.get('orderId');
