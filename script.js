// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
}

// Cart management
const cartKey = 'fashionStoreCart';

function getCart() {
  const cart = localStorage.getItem(cartKey);
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    // Use the product name from the product card's data-name attribute to ensure correct name
    cart.push({...product, name: product.name, qty: 1});
  }
  saveCart(cart);
  alert(`Produk "${product.name}" berhasil ditambahkan ke keranjang.`);
}

// Add to cart buttons on products page
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    const product = {
      id: card.dataset.id,
      name: card.dataset.name,
      price: parseInt(card.dataset.price),
    };
    addToCart(product);
  });
});

// Cart page rendering and form handling
function renderCart() {
  const cartItemsContainer = document.querySelector('.cart-items');
  const totalPriceEl = document.getElementById('total-price');
  if (!cartItemsContainer || !totalPriceEl) return;

  const cart = getCart();
  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Keranjang kosong.</p>';
    totalPriceEl.textContent = 'Rp0';
    return;
  }

  let total = 0;
  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    const itemEl = document.createElement('div');
    itemEl.classList.add('cart-item');
    itemEl.innerHTML = `
      <div class="cart-item-name">${item.name}</div>
      <div class="cart-item-qty">
        Jumlah: ${item.qty}
        <button class="btn-decrease" data-id="${item.id}" title="Kurangi jumlah">-</button>
        <button class="btn-increase" data-id="${item.id}" title="Tambah jumlah">+</button>
      </div>
      <div class="cart-item-price">Rp${itemTotal.toLocaleString('id-ID')}</div>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

  // Add event listeners for decrease buttons
  document.querySelectorAll('.btn-decrease').forEach(button => {
    button.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      decreaseQty(id);
    });
  });

  // Add event listeners for increase buttons
  document.querySelectorAll('.btn-increase').forEach(button => {
    button.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      increaseQty(id);
    });
  });

  totalPriceEl.textContent = `Rp${total.toLocaleString('id-ID')}`;
}

function handlePaymentForm() {
  const form = document.getElementById('payment-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const cart = getCart();
    if (cart.length === 0) {
      alert('Keranjang kosong. Silakan tambahkan produk terlebih dahulu.');
      return;
    }

    const paymentMethod = form.elements['payment-method'].value;
    if (!paymentMethod) {
      alert('Silakan pilih metode pembayaran.');
      return;
    }

    let message = 'Halo, saya ingin memesan:%0A';
    cart.forEach(item => {
      message += `- Produk: ${item.name}%0A- Jumlah: ${item.qty}%0A`;
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    message += `- Total: Rp${total.toLocaleString('id-ID')}%0A- Metode Pembayaran: ${paymentMethod}`;

    const phoneNumber = '6281911009245';
    const url = `https://wa.me/${phoneNumber}?text=${message}`;

    window.open(url, '_blank');
  });
}

// Decrease quantity function
function decreaseQty(id) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    if (item.qty > 1) {
      item.qty -= 1;
    } else {
      // Remove item if qty is 1 and decrease is clicked
      const index = cart.findIndex(i => i.id === id);
      cart.splice(index, 1);
    }
    saveCart(cart);
    renderCart();
  }
}

// Increase quantity function
function increaseQty(id) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += 1;
    saveCart(cart);
    renderCart();
  }
}

// Initialize on cart page
if (document.querySelector('.cart-section')) {
  renderCart();
  handlePaymentForm();
}

// Scroll animation using IntersectionObserver
const observerOptions = {
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('aos-animate');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => {
  el.classList.add('aos-init');
  observer.observe(el);
});
