// Product Data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 1199.99,
        desc: "Premium noise-canceling wireless headphones",
        icon: "🎧"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 2999.99,
        desc: "Feature-rich smartwatch with health tracking",
        icon: "⌚"
    },
    {
        id: 3,
        name: "Laptop Stand",
        price: 749.99,
        desc: "Ergonomic aluminum laptop stand",
        icon: "💻"
    },
    {
        id: 4,
        name: "Mechanical Keyboard",
        price: 1949.99,
        desc: "RGB mechanical gaming keyboard",
        icon: "⌨️"
    },
    {
        id: 5,
        name: "Wireless Mouse",
        price: 899.99,
        desc: "Precision wireless gaming mouse",
        icon: "🖱️"
    },
    {
        id: 6,
        name: "USB-C Hub",
        price: 599.99,
        desc: "7-in-1 USB-C hub with HDMI output",
        icon: "🔌"
    },
    {
        id: 7,
        name: "Portable Speaker",
        price: 1349.99,
        desc: "Waterproof Bluetooth portable speaker",
        icon: "🔊"
    },
    {
        id: 8,
        name: "Phone Case",
        price: 374.99,
        desc: "Premium leather phone case",
        icon: "📱"
    }
];

// Cart State
let cart = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    loadCart();
});

// Render Products
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">${product.icon}</div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.desc}</p>
                <div class="product-footer">
                    <span class="product-price">R${product.price.toFixed(2)}</span>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Toggle Cart
function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('active');
    document.getElementById('cartOverlay').classList.toggle('active');
}

// Toggle Menu
function toggleMenu() {
    document.querySelector('.nav-links').classList.toggle('active');
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    saveCart();
    showNotification('Added to cart!');
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCart();
}

// Update Cart UI
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartCount.textContent = totalItems;
    cartTotal.textContent = `R${totalPrice.toFixed(2)}`;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">${item.icon}</div>
                <div class="cart-item-info">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-price">R${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('metraCart', JSON.stringify(cart));
}

// Load Cart from LocalStorage
function loadCart() {
    const saved = localStorage.getItem('metraCart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCart();
    }
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    showNotification('Thank you for your order! 🎉');
    cart = [];
    updateCart();
    saveCart();
    toggleCart();
}

// Contact Form Handler
function handleSubmit(e) {
    e.preventDefault();
    showNotification('Message sent successfully! ✨');
    e.target.reset();
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #6366f1, #ec4899);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        font-weight: 500;
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
