let cartItems = [];

function navigateTo(page) {
  switch(page) {
    case 'cart':
      window.location.href = 'cart.html';
      break;
    case 'filter':
      window.location.href = 'menu.html';
      break;
    default:
      window.location.href = 'index.html';
  }
}

function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  if(cartCount) cartCount.textContent = cartItems.length;
}

// Call on load
updateCartCount();

