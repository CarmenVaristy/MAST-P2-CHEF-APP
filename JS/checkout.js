// Example promo codes
const PROMO_CODES = { DISCOUNT10: 10, DISCOUNT20: 20 };

// Example cart items
let cartItems = [
  { name: 'Item 1', price: 50 },
  { name: 'Item 2', price: 30 },
];

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const addressInput = document.getElementById('address');
const promoInput = document.getElementById('promoCode');

const orderBtn = document.getElementById('orderBtn');
const backBtn = document.getElementById('backBtn');

const summaryBox = document.getElementById('summaryBox');
const subtotalText = document.getElementById('subtotalText');
const discountText = document.getElementById('discountText');
const totalText = document.getElementById('totalText');

// Validate form
function validateForm() {
  if (!nameInput.value.trim()) return 'Please enter your full name';
  if (!emailInput.value.trim() || !/^\S+@\S+\.\S+$/.test(emailInput.value))
    return 'Please enter a valid email address';
  if (!phoneInput.value.trim() || !/^\d{7,15}$/.test(phoneInput.value))
    return 'Please enter a valid phone number';
  if (!addressInput.value.trim()) return 'Please enter your delivery address';
  if (cartItems.length === 0) return 'Your cart is empty';
  return null;
}

// Calculate total
function calculateTotal() {
  let subtotal = cartItems.reduce((sum, item) => sum + Number(item.price), 0);
  let discount = 0;

  const code = promoInput.value.toUpperCase();
  if (code && PROMO_CODES[code]) {
    discount = (subtotal * PROMO_CODES[code]) / 100;
  }

  const total = subtotal - discount;
  return { subtotal, discount, total };
}

// Handle order
orderBtn.addEventListener('click', () => {
  const error = validateForm();
  if (error) {
    alert(error);
    return;
  }

  const { subtotal, discount, total } = calculateTotal();

  subtotalText.textContent = `Subtotal: R${subtotal.toFixed(2)}`;
  discountText.textContent = `Discount: R${discount.toFixed(2)}`;
  totalText.textContent = `Total: R${total.toFixed(2)}`;

  summaryBox.style.display = 'block';

  alert(
    `✅ Thank you for your order!\n\nSubtotal: R${subtotal.toFixed(
      2
    )}\nDiscount: R${discount.toFixed(2)}\nTotal: R${total.toFixed(2)}`
  );

  // Redirect to home (or reload)
  window.location.href = 'index.html'; // change as needed
});

// Back to cart
backBtn.addEventListener('click', () => {
  window.location.href = 'cart.html'; // change as needed
});
