const PRODUCT_DATA = [
  {
    id: "lap-01",
    name: "Walnut Laptop Stand",
    category: "Laptop Stands",
    originalPrice: 1999,
    discountPrice: 1499,
    stockText: "Only 5 pieces left",
    description: "Hand-finished stand with a premium grain texture and balanced ergonomic elevation.",
    images: [
      "assets/images/laptop-stand-1.jpg",
      "assets/images/laptop-stand-2.jpg",
      "assets/images/laptop-stand-3.jpg",
      "assets/images/laptop-stand-4.jpg"
    ]
  },
  {
    id: "key-01",
    name: "Classic Key Holder",
    category: "Key Holders",
    originalPrice: 999,
    discountPrice: 699,
    stockText: "Only 8 pieces left",
    description: "Minimal wooden key organizer crafted for everyday use and premium wall styling.",
    images: [
      "assets/images/key-holder-1.jpg",
      "assets/images/key-holder-2.jpg",
      "assets/images/key-holder-3.jpg",
      "assets/images/key-holder-4.jpg"
    ]
  },
  {
    id: "acc-01",
    name: "Executive Pen Stand",
    category: "Accessories",
    originalPrice: 899,
    discountPrice: 599,
    stockText: "Only 6 pieces left",
    description: "Compact desk accessory with handcrafted detailing and smooth polish.",
    images: [
      "assets/images/pen-stand-1.jpg",
      "assets/images/pen-stand-2.jpg",
      "assets/images/pen-stand-3.jpg",
      "assets/images/pen-stand-4.jpg"
    ]
  }
];

const IG_URL = "https://www.instagram.com/mpeagle_wood_craft/";
const CART_KEY = "mpwc-cart";

const formatINR = (value) => `Rs ${value.toLocaleString("en-IN")}`;

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function buildProductCard(product) {
  return `
    <article class="card product-card" data-product-id="${product.id}">
      <button class="product-open" data-open-id="${product.id}" aria-label="Open ${product.name} details">
        <div class="product-media">
          <img src="${product.images[0]}" alt="${product.name} handcrafted wooden product" loading="lazy" />
        </div>
      </button>
      <div class="product-body">
        <h3>${product.name}</h3>
        <div class="price-row">
          <span class="old-price">${formatINR(product.originalPrice)}</span>
          <span class="new-price">${formatINR(product.discountPrice)}</span>
        </div>
        <p class="stock">${product.stockText}</p>
        <div class="hero-actions">
          <button class="btn btn-ghost" data-open-id="${product.id}">View</button>
          <button class="btn" data-add-id="${product.id}">Add to Cart</button>
        </div>
      </div>
    </article>
  `;
}

function renderProducts(category = "All") {
  const holder = document.querySelector("[data-products-grid]");
  if (!holder) return;
  const filtered = PRODUCT_DATA.filter(
    (item) => category === "All" || item.category === category
  );
  holder.innerHTML = filtered.map(buildProductCard).join("");
}

function renderModal(productId) {
  const modal = document.querySelector("[data-product-modal]");
  const content = document.querySelector("[data-modal-content]");
  if (!modal || !content) return;
  const product = PRODUCT_DATA.find((item) => item.id === productId);
  if (!product) return;

  content.innerHTML = `
    <h3>${product.name}</h3>
    <p>${product.description}</p>
    <div class="modal-gallery">
      ${product.images
        .map(
          (src, idx) =>
            `<img src="${src}" alt="${product.name} angle ${idx + 1}" loading="lazy" />`
        )
        .join("")}
    </div>
    <div class="hero-actions" style="margin-top: 1rem;">
      <a class="btn" href="${IG_URL}" target="_blank" rel="noopener noreferrer">Order on Instagram</a>
      <button class="btn btn-ghost" data-close-modal>Close</button>
    </div>
  `;

  modal.classList.add("open");
}

function renderCart() {
  const cartItems = document.querySelector("[data-cart-items]");
  const cartTotal = document.querySelector("[data-cart-total]");
  if (!cartItems || !cartTotal) return;
  const cart = loadCart();
  if (!cart.length) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "Rs 0";
    return;
  }

  const detail = cart
    .map((entry) => {
      const product = PRODUCT_DATA.find((item) => item.id === entry.id);
      if (!product) return "";
      return `
        <div class="cart-item">
          <span>${product.name} x ${entry.qty}</span>
          <button class="filter-btn" data-remove-id="${entry.id}">Remove</button>
        </div>
      `;
    })
    .join("");

  const total = cart.reduce((sum, entry) => {
    const product = PRODUCT_DATA.find((item) => item.id === entry.id);
    return sum + (product ? product.discountPrice * entry.qty : 0);
  }, 0);

  cartItems.innerHTML = detail;
  cartTotal.textContent = formatINR(total);
}

function addToCart(productId) {
  const cart = loadCart();
  const current = cart.find((item) => item.id === productId);
  if (current) {
    current.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  saveCart(cart);
  renderCart();
}

function removeFromCart(productId) {
  const updated = loadCart().filter((item) => item.id !== productId);
  saveCart(updated);
  renderCart();
}

function initProductEvents() {
  document.addEventListener("click", (event) => {
    const filter = event.target.closest("[data-filter]");
    if (filter) {
      const category = filter.getAttribute("data-filter");
      document.querySelectorAll("[data-filter]").forEach((btn) => {
        btn.classList.toggle("active", btn === filter);
      });
      renderProducts(category);
      return;
    }

    const openButton = event.target.closest("[data-open-id]");
    if (openButton) {
      renderModal(openButton.getAttribute("data-open-id"));
      return;
    }

    const addButton = event.target.closest("[data-add-id]");
    if (addButton) {
      addToCart(addButton.getAttribute("data-add-id"));
      return;
    }

    const removeButton = event.target.closest("[data-remove-id]");
    if (removeButton) {
      removeFromCart(removeButton.getAttribute("data-remove-id"));
      return;
    }

    const close = event.target.closest("[data-close-modal]");
    const modal = document.querySelector("[data-product-modal]");
    if (close && modal) {
      modal.classList.remove("open");
      return;
    }

    if (event.target.matches("[data-product-modal]")) {
      event.target.classList.remove("open");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector("[data-products-grid]")) return;
  renderProducts("All");
  renderCart();
  initProductEvents();
});
