/* ==========================================================================
   NOIR STUDIO — script.js
   Handles: product rendering, size/quantity selection, category filtering,
   shopping cart, the checkout modal, n8n webhook submission, and the
   chatbot placeholder toggle.
   ========================================================================== */

// ---- CONFIG -----------------------------------------------------------
// 🔧 Replace this with your real n8n production webhook URL.
const WEBHOOK_URL = "https://mohmedshakerr.app.n8n.cloud/webhook/new-order";
const CART_STORAGE_KEY = "noirCart";

// ---- SAMPLE PRODUCT DATA -----------------------------------------------
// Edit / add products here. `category` must match a data-filter value
// used in the categories section and filter bar (tshirts, hoodies, pants, jackets).
const PRODUCTS = [
  {
    id: "p1",
    name: "Essential Cotton Tee",
    category: "tshirts",
    price: 450,
    stock: 18,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "p2",
    name: "Oversized Graphic Tee",
    category: "tshirts",
    price: 520,
    stock: 4,
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "p3",
    name: "Heavyweight Pullover Hoodie",
    category: "hoodies",
    price: 950,
    stock: 12,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "p4",
    name: "Zip-Up Fleece Hoodie",
    category: "hoodies",
    price: 1020,
    stock: 3,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "p5",
    name: "Tapered Cargo Pants",
    category: "pants",
    price: 780,
    stock: 9,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "p6",
    name: "Straight Fit Denim Jeans",
    category: "pants",
    price: 890,
    stock: 15,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "p7",
    name: "Denim Trucker Jacket",
    category: "jackets",
    price: 1250,
    stock: 6,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "p8",
    name: "Water-Resistant Bomber",
    category: "jackets",
    price: 1480,
    stock: 2,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "p9",
    name: "Striped Boxy Tee",
    category: "tshirts",
    price: 480,
    stock: 21,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "p10",
    name: "Long Sleeve Ribbed Tee",
    category: "tshirts",
    price: 510,
    stock: 7,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "p11",
    name: "Pocket Tee — Off White",
    category: "tshirts",
    price: 440,
    stock: 5,
    image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "p12",
    name: "Acid Wash Tee",
    category: "tshirts",
    price: 495,
    stock: 13,
    image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "p13",
    name: "Cropped Hoodie",
    category: "hoodies",
    price: 880,
    stock: 10,
    image: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "p14",
    name: "Oversized Hoodie — Charcoal",
    category: "hoodies",
    price: 970,
    stock: 1,
    image: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "p15",
    name: "Sherpa-Lined Hoodie",
    category: "hoodies",
    price: 1150,
    stock: 8,
    image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "p16",
    name: "Track Pants — Ribbed Cuff",
    category: "pants",
    price: 700,
    stock: 16,
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "p17",
    name: "Wide Leg Chinos",
    category: "pants",
    price: 820,
    stock: 4,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "p18",
    name: "Slim Fit Black Jeans",
    category: "pants",
    price: 860,
    stock: 11,
    image: "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "p19",
    name: "Utility Cargo Jogger",
    category: "pants",
    price: 750,
    stock: 0,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "p20",
    name: "Leather Biker Jacket",
    category: "jackets",
    price: 2200,
    stock: 3,
    image: "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "p21",
    name: "Quilted Puffer Jacket",
    category: "jackets",
    price: 1650,
    stock: 9,
    image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "p22",
    name: "Corduroy Overshirt Jacket",
    category: "jackets",
    price: 1380,
    stock: 6,
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&q=80&auto=format&fit=crop",
  },
];

const SIZES = ["S", "M", "L", "XL"];

// Keeps track of the size + quantity currently selected on each product card
// (this is just the "picker" state before something is added to the cart).
const cardState = {}; // { [productId]: { size: "M", qty: 1 } }

// The actual shopping cart. Each line is unique per product+size combo.
// Persisted to localStorage so the cart survives a page refresh.
let cart = loadCart(); // [{ id, name, price, image, size, qty, stock }]

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // localStorage unavailable (e.g. some private-browsing modes) — cart just won't persist.
  }
}

// ---- DOM REFERENCES -----------------------------------------------------
const productGrid = document.getElementById("productGrid");
const filterBar = document.getElementById("filterBar");
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const orderForm = document.getElementById("orderForm");
const formStatus = document.getElementById("formStatus");
const submitOrderBtn = document.getElementById("submitOrderBtn");
const orderSummary = document.getElementById("orderSummary");
const orderTotal = document.getElementById("orderTotal");

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

const cartToggle = document.getElementById("cartToggle");
const cartBadge = document.getElementById("cartBadge");
const cartOverlay = document.getElementById("cartOverlay");
const cartClose = document.getElementById("cartClose");
const cartItemsEl = document.getElementById("cartItems");
const cartSubtotalEl = document.getElementById("cartSubtotal");
const checkoutBtn = document.getElementById("checkoutBtn");

const chatToggle = document.getElementById("chatToggle");
const chatPanel = document.getElementById("chatPanel");
const chatClose = document.getElementById("chatClose");

// ---- RENDER PRODUCT CARDS -----------------------------------------------
function renderProducts(filter = "all") {
  productGrid.innerHTML = "";

  const list = filter === "all"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === filter);

  list.forEach((product) => {
    // initialize state for this product if it doesn't exist yet
    if (!cardState[product.id]) {
      cardState[product.id] = { size: "M", qty: 1 };
    }
    const state = cardState[product.id];

    const isLowStock = product.stock > 0 && product.stock <= 5;
    const isOutOfStock = product.stock === 0;

    const card = document.createElement("article");
    card.className = "product-card";
    card.dataset.id = product.id;

    card.innerHTML = `
      <div class="product-card__img-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
      </div>
      <div class="product-card__body">
        <div class="product-card__top">
          <span class="product-card__name">${product.name}</span>
          <span class="product-card__price">${product.price} EGP</span>
        </div>

        <span class="product-card__stock ${isLowStock ? "low" : ""}">
          ${isOutOfStock ? "Out of Stock" : isLowStock ? `Low Stock: ${product.stock}` : `In Stock: ${product.stock}`}
        </span>

        <div class="product-card__field">
          <label>Size</label>
          <div class="size-selector" data-role="sizeSelector">
            ${SIZES.map(
              (s) => `<button type="button" class="size-btn ${s === state.size ? "selected" : ""}" data-size="${s}">${s}</button>`
            ).join("")}
          </div>
        </div>

        <div class="product-card__field">
          <label>Quantity</label>
          <div class="qty-selector">
            <button type="button" class="qty-btn" data-action="dec">&minus;</button>
            <span class="qty-value" data-role="qtyValue">${state.qty}</span>
            <button type="button" class="qty-btn" data-action="inc">&#43;</button>
          </div>
        </div>

        <button type="button" class="btn btn--primary order-btn" data-action="add-cart" ${isOutOfStock ? "disabled" : ""}>
          ${isOutOfStock ? "Unavailable" : "Add to Cart"}
        </button>
      </div>
    `;

    productGrid.appendChild(card);
  });
}

// ---- PRODUCT CARD INTERACTIONS (event delegation) ------------------------
productGrid.addEventListener("click", (e) => {
  const card = e.target.closest(".product-card");
  if (!card) return;
  const productId = card.dataset.id;
  const product = PRODUCTS.find((p) => p.id === productId);
  const state = cardState[productId];

  // Size selection
  const sizeBtn = e.target.closest(".size-btn");
  if (sizeBtn) {
    state.size = sizeBtn.dataset.size;
    card.querySelectorAll(".size-btn").forEach((b) => b.classList.remove("selected"));
    sizeBtn.classList.add("selected");
    return;
  }

  // Quantity controls
  const qtyBtn = e.target.closest(".qty-btn");
  if (qtyBtn) {
    const action = qtyBtn.dataset.action;
    if (action === "inc") {
      state.qty = Math.min(state.qty + 1, product.stock || 1);
    } else if (action === "dec") {
      state.qty = Math.max(state.qty - 1, 1);
    }
    card.querySelector('[data-role="qtyValue"]').textContent = state.qty;
    return;
  }

  // Add to Cart button
  const addBtn = e.target.closest('[data-action="add-cart"]');
  if (addBtn) {
    addToCart(product, state);
    const originalLabel = addBtn.textContent;
    addBtn.textContent = "Added ✓";
    setTimeout(() => { addBtn.textContent = originalLabel; }, 1000);
  }
});

// ---- CATEGORY FILTERING ---------------------------------------------------
filterBar.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  filterBar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderProducts(btn.dataset.filter);
});

// Category cards on the homepage also trigger the shop filter
document.querySelectorAll(".category-card").forEach((card) => {
  card.addEventListener("click", () => {
    const filter = card.dataset.filter;
    filterBar.querySelectorAll(".filter-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.filter === filter);
    });
    renderProducts(filter);
  });
});

// ---- CART LOGIC -----------------------------------------------------
function addToCart(product, state) {
  const existing = cart.find((line) => line.id === product.id && line.size === state.size);

  if (existing) {
    existing.qty = Math.min(existing.qty + state.qty, product.stock);
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: state.size,
      qty: state.qty,
      stock: product.stock,
    });
  }

  saveCart();
  renderCart();
  openCartDrawer();
}

function updateCartLineQty(index, delta) {
  const line = cart[index];
  if (!line) return;
  line.qty = Math.max(1, Math.min(line.qty + delta, line.stock));
  saveCart();
  renderCart();
}

function removeCartLine(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function cartTotal() {
  return cart.reduce((sum, line) => sum + line.price * line.qty, 0);
}

function renderCart() {
  // Badge
  const count = cart.reduce((sum, line) => sum + line.qty, 0);
  cartBadge.textContent = count;

  // Drawer contents
  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<p class="cart-drawer__empty">Your cart is empty. Go add something you'll actually wear.</p>`;
    checkoutBtn.disabled = true;
  } else {
    cartItemsEl.innerHTML = cart
      .map(
        (line, index) => `
        <div class="cart-item" data-index="${index}">
          <div class="cart-item__img"><img src="${line.image}" alt="${line.name}" /></div>
          <div class="cart-item__info">
            <p class="cart-item__name">${line.name}</p>
            <p class="cart-item__meta">Size ${line.size} &middot; ${line.price} EGP</p>
            <div class="cart-item__row">
              <div class="cart-item__qty">
                <button type="button" data-action="dec">&minus;</button>
                <span>${line.qty}</span>
                <button type="button" data-action="inc">&#43;</button>
              </div>
              <span class="cart-item__price">${line.price * line.qty} EGP</span>
            </div>
            <button type="button" class="cart-item__remove" data-action="remove">Remove</button>
          </div>
        </div>`
      )
      .join("");
    checkoutBtn.disabled = false;
  }

  cartSubtotalEl.textContent = `${cartTotal()} EGP`;
}

cartItemsEl.addEventListener("click", (e) => {
  const itemEl = e.target.closest(".cart-item");
  if (!itemEl) return;
  const index = Number(itemEl.dataset.index);

  if (e.target.closest('[data-action="inc"]')) updateCartLineQty(index, 1);
  else if (e.target.closest('[data-action="dec"]')) updateCartLineQty(index, -1);
  else if (e.target.closest('[data-action="remove"]')) removeCartLine(index);
});

// ---- CART DRAWER OPEN/CLOSE -----------------------------------------------
function openCartDrawer() { cartOverlay.classList.add("open"); }
function closeCartDrawer() { cartOverlay.classList.remove("open"); }

cartToggle.addEventListener("click", openCartDrawer);
cartClose.addEventListener("click", closeCartDrawer);
cartOverlay.addEventListener("click", (e) => {
  if (e.target === cartOverlay) closeCartDrawer();
});

// ---- CHECKOUT -> ORDER MODAL -----------------------------------------------
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) return;
  closeCartDrawer();
  openOrderModal();
});

function openOrderModal() {
  orderSummary.innerHTML = cart
    .map(
      (line) => `
      <div class="order-summary__row">
        <span class="name">${line.name}</span>
        <span class="meta">Size ${line.size} &middot; x${line.qty} &middot; ${line.price * line.qty} EGP</span>
      </div>`
    )
    .join("");
  orderTotal.innerHTML = `<span>Total</span><span>${cartTotal()} EGP</span>`;

  formStatus.textContent = "";
  formStatus.className = "form-status";
  modalOverlay.classList.add("open");
}

function closeOrderModal() {
  modalOverlay.classList.remove("open");
}

modalClose.addEventListener("click", closeOrderModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeOrderModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (modalOverlay.classList.contains("open")) closeOrderModal();
    if (cartOverlay.classList.contains("open")) closeCartDrawer();
  }
});

// ---- ORDER SUBMISSION -> n8n WEBHOOK --------------------------------------
orderForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // never let the browser do a native form submit

  const payload = {
    name: document.getElementById("customerName").value.trim(),
    phone: document.getElementById("customerPhone").value.trim(),
    address: document.getElementById("customerAddress").value.trim(),
    items: cart.map((line) => ({
      product: line.name,
      size: line.size,
      quantity: line.qty,
      price: line.price,
    })),
    total: cartTotal(),
    date: new Date().toISOString(),
  };

  submitOrderBtn.disabled = true;
  submitOrderBtn.textContent = "Sending...";
  formStatus.textContent = "";
  formStatus.className = "form-status";

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Webhook responded with an error");

    formStatus.textContent = "Order submitted successfully";
    formStatus.className = "form-status success";
    orderForm.reset();

    cart = [];
    saveCart();
    renderCart();

    setTimeout(closeOrderModal, 1500);
  } catch (err) {
    // Common in local/dev testing since WEBHOOK_URL is a placeholder.
    formStatus.textContent = "Could not reach the server. Please try again later.";
    formStatus.className = "form-status error";
    console.error("Order submission failed:", err);
  } finally {
    submitOrderBtn.disabled = false;
    submitOrderBtn.textContent = "Submit Order";
  }
});

// ---- MOBILE NAV TOGGLE -----------------------------------------------
navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close mobile menu after tapping a link
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// ---- CHATBOT PLACEHOLDER TOGGLE -----------------------------------------
chatToggle.addEventListener("click", () => chatPanel.classList.toggle("open"));
chatClose.addEventListener("click", () => chatPanel.classList.remove("open"));

// ---- INIT -----------------------------------------------------------
renderProducts();
renderCart();
