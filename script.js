const business = {
  name: 'UOCO AGRO FARM',
  tagline: 'LET MY PEOPLE EAT.',
  location: 'Ethiope West, Oghara, Delta State, Nigeria.',
  email: 'uocofarmingproject@gamil.com',
  instagram: '@uocofarming',
  whatsappNumbers: ['+447848866648', '+2349127475250'],
};

const products = [
  {
    id: 'fresh-tomatoes',
    name: 'Fresh Tomatoes',
    price: 10000,
    measurement: 'Per Basket',
    unit: 'Basket',
    image: 'assets/tomatoes.jpg',
    description:
      'Fresh, carefully selected tomatoes supplied directly from UOCO Agro Farm. Quality produce for homes, restaurants, food vendors and bulk buyers.',
  },
  {
    id: 'fresh-habanero-peppers',
    name: 'Fresh Habanero Peppers',
    price: 8000,
    measurement: 'Per Kilogram (KG)',
    unit: 'KG',
    image: 'assets/habanero-peppers.jpg',
    description:
      'Fresh and quality habanero peppers from UOCO Agro Farm. Perfect for Nigerian cooking, restaurants, food businesses and everyday meals.',
  },
];

const cartKey = 'uoco-agro-farm-cart';
const currency = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
});

let cart = loadCart();

const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const cartButton = document.getElementById('cart-button');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutButton = document.getElementById('checkout-button');
const checkoutModal = document.getElementById('checkout-modal');
const checkoutOverlay = document.getElementById('checkout-overlay');
const closeCartButton = document.getElementById('close-cart');
const closeCheckoutButton = document.getElementById('close-checkout');
const checkoutForm = document.getElementById('checkout-form');
const toastContainer = document.getElementById('toast-container');
const productGrid = document.getElementById('product-grid');

function formatMoney(value) {
  return currency.format(value);
}

function loadCart() {
  try {
    const savedCart = localStorage.getItem(cartKey);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(cartKey, JSON.stringify(cart));
}

function getCartCount() {
  return cart.reduce((total, item) => total + Number(item.quantity), 0);
}

function getCartTotal() {
  return cart.reduce((total, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return total + ((product ? product.price : 0) * Number(item.quantity));
  }, 0);
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2400);
}

function renderProducts() {
  productGrid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card reveal">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}" />
          </div>
          <div class="product-content">
            <span class="product-tag">${product.measurement}</span>
            <h3>${product.name}</h3>
            <div class="product-price">${formatMoney(product.price)} <span>${product.unit}</span></div>
            <p class="product-description">${product.description}</p>
            <div class="product-meta">
              <span class="availability">Available</span>
              <span>Fresh arrival</span>
            </div>
            <div class="product-actions">
              <label class="qty-control" aria-label="Quantity for ${product.name}">
                <span>Qty</span>
                <input type="number" min="1" max="99" value="1" data-product-input="${product.id}" />
              </label>
              <button type="button" class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
            </div>
          </div>
        </article>
      `,
    )
    .join('');

  document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', () => addToCart(button.dataset.productId));
  });

  document.querySelectorAll('[data-product-input]').forEach((input) => {
    input.addEventListener('input', () => {
      const value = Number(input.value);
      if (!Number.isFinite(value) || value < 1) {
        input.value = 1;
      } else if (value > 99) {
        input.value = 99;
      }
    });
  });
}

function addToCart(productId) {
  const input = document.querySelector(`[data-product-input="${productId}"]`);
  const requestedQuantity = Number(input ? input.value : 1);
  const safeQuantity = Math.max(1, Math.min(99, requestedQuantity || 1));

  if (input) {
    input.value = safeQuantity;
  }

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += safeQuantity;
  } else {
    cart.push({ id: productId, quantity: safeQuantity });
  }

  saveCart();
  renderCart();
  showToast('Item added to cart');
}

function updateCartCount() {
  const count = getCartCount();
  cartCount.textContent = String(count);
  cartCount.classList.remove('bump');
  void cartCount.offsetWidth;
  cartCount.classList.add('bump');
}

function renderCart() {
  if (!cart.length) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <div>
          <p>Your cart is empty.</p>
        </div>
      </div>
    `;
    cartTotal.textContent = formatMoney(0);
    checkoutButton.disabled = true;
    updateCartCount();
    return;
  }

  cartItems.innerHTML = cart
    .map((item) => {
      const product = products.find((entry) => entry.id === item.id);
      if (!product) return '';

      const itemTotal = product.price * item.quantity;

      return `
        <div class="cart-item">
          <img src="${product.image}" alt="${product.name}" />
          <div class="cart-item-copy">
            <h4>${product.name}</h4>
            <div class="cart-item-meta">
              <span>${item.quantity} ${product.unit} × ${formatMoney(product.price)}</span>
              <strong>${formatMoney(itemTotal)}</strong>
            </div>
            <button type="button" class="remove-item" data-remove-id="${product.id}">Remove</button>
          </div>
          <div class="quantity-stepper">
            <button type="button" class="qty-btn" data-decrease-id="${product.id}" aria-label="Decrease quantity">−</button>
            <strong>${item.quantity}</strong>
            <button type="button" class="qty-btn" data-increase-id="${product.id}" aria-label="Increase quantity">+</button>
          </div>
        </div>
      `;
    })
    .join('');

  cartTotal.textContent = formatMoney(getCartTotal());
  checkoutButton.disabled = false;
  updateCartCount();

  document.querySelectorAll('[data-remove-id]').forEach((button) => {
    button.addEventListener('click', () => removeItem(button.dataset.removeId));
  });

  document.querySelectorAll('[data-increase-id]').forEach((button) => {
    button.addEventListener('click', () => changeQuantity(button.dataset.increaseId, 1));
  });

  document.querySelectorAll('[data-decrease-id]').forEach((button) => {
    button.addEventListener('click', () => changeQuantity(button.dataset.decreaseId, -1));
  });
}

function removeItem(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  renderCart();
  showToast('Item removed from cart');
}

function changeQuantity(productId, delta) {
  const item = cart.find((entry) => entry.id === productId);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    cart = cart.filter((entry) => entry.id !== productId);
  }

  saveCart();
  renderCart();
}

function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('visible');
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('visible');
}

function openCheckout() {
  if (!cart.length) {
    showToast('Your cart is empty');
    return;
  }

  checkoutModal.classList.add('open');
  checkoutOverlay.classList.add('visible');
  closeCart();
}

function closeCheckout() {
  checkoutModal.classList.remove('open');
  checkoutOverlay.classList.remove('visible');
}

function validateCheckout(values) {
  const errors = [];
  const fullName = values.fullName.trim();
  const phone = values.phone.trim();
  const address = values.address.trim();
  const state = values.state.trim();

  if (fullName.length < 2) {
    errors.push('Please enter your full name.');
  }

  if (!/^[+0-9\s()-]{7,20}$/.test(phone)) {
    errors.push('Please enter a valid phone number.');
  }

  if (!address) {
    errors.push('Please enter your delivery address.');
  }

  if (!state) {
    errors.push('Please enter your state.');
  }

  return errors;
}

function buildWhatsAppMessage(formData) {
  const orderLines = cart
    .map((item) => {
      const product = products.find((entry) => entry.id === item.id);
      if (!product) return '';

      const itemTotal = product.price * item.quantity;
      return `${product.name}\n${item.quantity} ${product.unit} × ${formatMoney(product.price)} = ${formatMoney(itemTotal)}`;
    })
    .filter(Boolean)
    .join('\n\n');

  return [
    'UOCO AGRO FARM',
    'NEW CUSTOMER ORDER',
    '',
    `Customer Name: ${formData.fullName}`,
    `Phone Number: ${formData.phone}`,
    `Delivery Address: ${formData.address}`,
    `State: ${formData.state}`,
    '',
    'ORDER DETAILS:',
    orderLines,
    '',
    `TOTAL ORDER AMOUNT: ${formatMoney(getCartTotal())}`,
    '',
    `Additional Instructions: ${formData.instructions || 'None'}`,
    '',
    'Please confirm product availability and delivery arrangements.',
  ].join('\n');
}

function submitCheckout(event) {
  event.preventDefault();

  const formData = Object.fromEntries(new FormData(checkoutForm).entries());
  const validationErrors = validateCheckout(formData);

  if (validationErrors.length) {
    validationErrors.forEach((message) => showToast(message));
    return;
  }

  const message = buildWhatsAppMessage({
    fullName: formData.fullName.trim(),
    phone: formData.phone.trim(),
    address: formData.address.trim(),
    state: formData.state.trim(),
    instructions: (formData.instructions || '').trim(),
  });

  const primaryNumber = business.whatsappNumbers[0].replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${primaryNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank', 'noopener');

  checkoutForm.reset();
  cart = [];
  saveCart();
  renderCart();
  closeCheckout();
  showToast('Order ready for WhatsApp confirmation');
}

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

cartButton.addEventListener('click', openCart);
closeCartButton.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);
checkoutOverlay.addEventListener('click', closeCheckout);
closeCheckoutButton.addEventListener('click', closeCheckout);
checkoutButton.addEventListener('click', openCheckout);
checkoutForm.addEventListener('submit', submitCheckout);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeCart();
    closeCheckout();
  }
});

const callback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
};

const observer = new IntersectionObserver(callback, { threshold: 0.14 });

function observeRevealElements() {
  document.querySelectorAll('.reveal').forEach((element) => {
    observer.observe(element);
  });
}

observeRevealElements();
renderProducts();
observeRevealElements();
renderCart();
