// ----------------------------
// CART DATA (Replace with real data)
let cartItems = [
  { name: "Starter 1", price: 25, desc: "Crispy starter", category: "Starters", quantity: 1 },
  { name: "Main 1", price: 50, desc: "Delicious main", category: "Mains", quantity: 2 },
  { name: "Dessert 1", price: 30, desc: "Sweet treat", category: "Desserts", quantity: 1 },
];

let selectedCategory = "All";
const categories = ["All", "Starters", "Mains", "Desserts"];

// ----------------------------
// ELEMENTS
const categoryInfoContainer = document.getElementById("categoryInfoContainer");
const filterContainer = document.getElementById("filterContainer");
const cartList = document.getElementById("cartList");
const totalEl = document.getElementById("total");

// ----------------------------
// FUNCTIONS
function getCategoryInfo(cat) {
  const items = cat === "All" ? cartItems : cartItems.filter(i => i.category === cat);
  const count = items.reduce((acc, i) => acc + (i.quantity || 1), 0);
  const avg = count === 0 ? 0 : (items.reduce((sum, i) => sum + (i.price*(i.quantity||1)), 0)/count).toFixed(2);
  return { count, avg };
}

function renderCategoryInfo() {
  categoryInfoContainer.innerHTML = "";
  categories.forEach((cat, idx) => {
    const info = getCategoryInfo(cat);
    const span = document.createElement("span");
    span.className = "categoryInfo" + (cat === selectedCategory ? " categoryInfoSelected" : "");
    span.textContent = `${cat}: ${info.count} items, Avg: R${info.avg}${idx < 3 ? " | " : ""}`;
    categoryInfoContainer.appendChild(span);
  });
}

function renderFilterButtons() {
  filterContainer.innerHTML = "";
  categories.forEach(cat => {
    const info = getCategoryInfo(cat);
    const btn = document.createElement("button");
    btn.className = "filterBtn" + (cat === selectedCategory ? " filterBtnSelected" : "");
    btn.innerHTML = `${cat} <span class="badge"><span class="badgeText">${info.count}</span></span>`;
    btn.onclick = () => { selectedCategory = cat; renderAll(); };
    filterContainer.appendChild(btn);
  });
}

function renderCartItems() {
  cartList.innerHTML = "";
  const filteredItems = selectedCategory === "All" ? cartItems : cartItems.filter(i => i.category === selectedCategory);
  
  if(filteredItems.length === 0) {
    const empty = document.createElement("p");
    empty.className = "emptyText";
    empty.textContent = "No items in this category.";
    cartList.appendChild(empty);
    return;
  }

  filteredItems.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "cartItem";

    // Item info
    const infoDiv = document.createElement("div");
    infoDiv.style.flex = 1;
    const namePrice = document.createElement("p");
    namePrice.className = "itemText";
    namePrice.textContent = `${item.name} - R${item.price}`;
    infoDiv.appendChild(namePrice);
    if(item.desc) {
      const desc = document.createElement("p");
      desc.className = "itemDesc";
      desc.textContent = item.desc;
      infoDiv.appendChild(desc);
    }
    div.appendChild(infoDiv);

    // Quantity controls
    const qtyDiv = document.createElement("div");
    qtyDiv.className = "qtyContainer";

    const decBtn = document.createElement("button");
    decBtn.className = "qtyBtn";
    decBtn.textContent = "-";
    decBtn.onclick = () => { decreaseQuantity(index); renderAll(); };
    qtyDiv.appendChild(decBtn);

    const qtyText = document.createElement("span");
    qtyText.className = "qtyCounter";
    qtyText.textContent = item.quantity || 1;
    qtyDiv.appendChild(qtyText);

    const incBtn = document.createElement("button");
    incBtn.className = "qtyBtn";
    incBtn.textContent = "+";
    incBtn.onclick = () => { increaseQuantity(index); renderAll(); };
    qtyDiv.appendChild(incBtn);

    div.appendChild(qtyDiv);

    // Remove button
    const removeBtn = document.createElement("button");
    removeBtn.className = "removeText";
    removeBtn.textContent = "Remove";
    removeBtn.onclick = () => { removeFromCart(index); renderAll(); };
    div.appendChild(removeBtn);

    cartList.appendChild(div);
  });
}

function increaseQuantity(index) {
  if(!cartItems[index].quantity) cartItems[index].quantity = 1;
  cartItems[index].quantity += 1;
}

function decreaseQuantity(index) {
  if(!cartItems[index].quantity) cartItems[index].quantity = 1;
  if(cartItems[index].quantity > 1) {
    cartItems[index].quantity -= 1;
  } else {
    cartItems.splice(index, 1);
  }
}

function removeFromCart(index) {
  cartItems.splice(index, 1);
}

function renderTotal() {
  const filteredItems = selectedCategory === "All" ? cartItems : cartItems.filter(i => i.category === selectedCategory);
  const total = filteredItems.reduce((sum, i) => sum + (i.price*(i.quantity||1)),0).toFixed(2);
  totalEl.textContent = `Total: R${total}`;
}

// Render all
function renderAll() {
  renderCategoryInfo();
  renderFilterButtons();
  renderCartItems();
  renderTotal();
}

// Initial render
renderAll();

// Checkout & Back button actions
document.getElementById("checkoutBtn").onclick = () => { alert("Go to Checkout"); };
document.getElementById("backBtn").onclick = () => { alert("Back to Menu"); };
