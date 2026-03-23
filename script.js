// Product Data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 1199.99,
        desc: "Premium noise-canceling wireless headphones",
        icon: "🎧",
        sku: "WH-001",
        tags: ["Audio", "Wireless", "Premium"],
        fullDescription: "Experience superior sound quality with our Premium Wireless Headphones. Featuring advanced noise-canceling technology, 40-hour battery life, and ultra-comfortable memory foam ear cushions. Perfect for music lovers, gamers, and professionals who demand the best audio experience.",
        specs: ["40mm drivers", "Bluetooth 5.2", "40hr battery", "Fast charging", "Foldable design"],
        reviews: [
            { user: "Sipho M.", rating: 5, comment: "Amazing sound quality! Best headphones I've ever owned.", date: "2026-03-15" },
            { user: "Nomsa K.", rating: 4, comment: "Great headphones, very comfortable for long use.", date: "2026-03-10" }
        ]
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 2999.99,
        desc: "Feature-rich smartwatch with health tracking",
        icon: "⌚",
        sku: "SW-002",
        tags: ["Wearables", "Fitness", "Smart"],
        fullDescription: "Stay connected and track your fitness goals with our advanced Smart Watch. Features include heart rate monitoring, GPS tracking, sleep analysis, and 7-day battery life. Water-resistant up to 50m with a stunning AMOLED display.",
        specs: ["1.4\" AMOLED", "Heart rate monitor", "GPS", "5ATM water resistant", "7-day battery"],
        reviews: [
            { user: "Thabo D.", rating: 5, comment: "Perfect fitness companion! Tracks everything accurately.", date: "2026-03-18" },
            { user: "Zanele P.", rating: 5, comment: "Love the design and battery life is incredible!", date: "2026-03-12" },
            { user: "Michael R.", rating: 4, comment: "Great value for money. GPS is very accurate.", date: "2026-03-08" }
        ]
    },
    {
        id: 3,
        name: "Laptop Stand",
        price: 749.99,
        desc: "Ergonomic aluminum laptop stand",
        icon: "💻",
        sku: "LS-003",
        tags: ["Office", "Ergonomic", "Aluminum"],
        fullDescription: "Improve your posture and productivity with our Ergonomic Laptop Stand. Made from premium aluminum alloy, it features 6 adjustable height levels and supports laptops up to 17 inches. The open design provides better airflow to keep your device cool.",
        specs: ["Aluminum alloy", "6 height levels", "Up to 17\"", "Anti-slip pads", "Portable"],
        reviews: [
            { user: "Priya S.", rating: 5, comment: "My neck pain is gone! Best purchase ever.", date: "2026-03-20" },
            { user: "David L.", rating: 4, comment: "Sturdy and well-built. Highly recommend.", date: "2026-03-14" }
        ]
    },
    {
        id: 4,
        name: "Mechanical Keyboard",
        price: 1949.99,
        desc: "RGB mechanical gaming keyboard",
        icon: "⌨️",
        sku: "MK-004",
        tags: ["Gaming", "RGB", "Mechanical"],
        fullDescription: "Dominate your games with our RGB Mechanical Gaming Keyboard. Features genuine Cherry MX switches, per-key RGB lighting, aircraft-grade aluminum frame, and dedicated media controls. Built for gamers who demand precision and style.",
        specs: ["Cherry MX Red", "Per-key RGB", "Aluminum frame", "N-key rollover", "Detachable cable"],
        reviews: [
            { user: "Jason T.", rating: 5, comment: "Best keyboard for gaming! The switches feel amazing.", date: "2026-03-19" },
            { user: "Lerato M.", rating: 5, comment: "Beautiful RGB lighting and solid build quality.", date: "2026-03-16" },
            { user: "Chris B.", rating: 4, comment: "Great keyboard but a bit loud for office use.", date: "2026-03-11" }
        ]
    },
    {
        id: 5,
        name: "Wireless Mouse",
        price: 899.99,
        desc: "Precision wireless gaming mouse",
        icon: "🖱️",
        sku: "WM-005",
        tags: ["Gaming", "Wireless", "Precision"],
        fullDescription: "Achieve pixel-perfect precision with our Wireless Gaming Mouse. Equipped with a 25K DPI sensor, ultra-lightweight 68g design, and 80-hour battery life. Features 8 programmable buttons and ultra-fast 1ms response time.",
        specs: ["25K DPI sensor", "68g lightweight", "80hr battery", "8 programmable buttons", "1ms response"],
        reviews: [
            { user: "Ayanda N.", rating: 5, comment: "Incredibly responsive! Perfect for FPS games.", date: "2026-03-17" },
            { user: "Kevin W.", rating: 4, comment: "Great mouse, very light and comfortable.", date: "2026-03-13" }
        ]
    },
    {
        id: 6,
        name: "USB-C Hub",
        price: 599.99,
        desc: "7-in-1 USB-C hub with HDMI output",
        icon: "🔌",
        sku: "UH-006",
        tags: ["Connectivity", "USB-C", "Portable"],
        fullDescription: "Expand your connectivity with our 7-in-1 USB-C Hub. Features 4K HDMI output, 3 USB 3.0 ports, SD/microSD card readers, and 100W power delivery. Compact aluminum design perfect for laptops and tablets.",
        specs: ["4K HDMI", "3x USB 3.0", "SD/microSD", "100W PD", "Aluminum body"],
        reviews: [
            { user: "Michelle G.", rating: 5, comment: "Works flawlessly with my MacBook. Great value!", date: "2026-03-21" },
            { user: "Peter H.", rating: 4, comment: "Compact and does everything I need.", date: "2026-03-09" },
            { user: "Sarah J.", rating: 5, comment: "4K output is crystal clear. Highly recommend!", date: "2026-03-05" }
        ]
    },
    {
        id: 7,
        name: "Portable Speaker",
        price: 1349.99,
        desc: "Waterproof Bluetooth portable speaker",
        icon: "🔊",
        sku: "PS-007",
        tags: ["Audio", "Portable", "Waterproof"],
        fullDescription: "Take your music anywhere with our Waterproof Bluetooth Speaker. Delivers powerful 360° sound, 24-hour playtime, and IPX7 waterproof rating. Perfect for outdoor adventures, pool parties, and travel.",
        specs: ["360° sound", "24hr playtime", "IPX7 waterproof", "Bluetooth 5.0", "Built-in mic"],
        reviews: [
            { user: "Bongani F.", rating: 5, comment: "Amazing sound for its size! Survived my pool party.", date: "2026-03-22" },
            { user: "Emma C.", rating: 5, comment: "Battery lasts forever! Great for camping trips.", date: "2026-03-18" }
        ]
    },
    {
        id: 8,
        name: "Phone Case",
        price: 374.99,
        desc: "Premium leather phone case",
        icon: "📱",
        sku: "PC-008",
        tags: ["Accessories", "Leather", "Premium"],
        fullDescription: "Protect your phone in style with our Premium Leather Case. Made from genuine full-grain leather that develops a beautiful patina over time. Features precise cutouts, card slot, and magnetic closure for ultimate convenience.",
        specs: ["Genuine leather", "Card slot", "Magnetic closure", "Precise cutouts", "Wireless charging"],
        reviews: [
            { user: "Grace O.", rating: 5, comment: "Beautiful leather! Gets better with age.", date: "2026-03-20" },
            { user: "Daniel K.", rating: 4, comment: "Great quality case, fits perfectly.", date: "2026-03-15" },
            { user: "Lisa M.", rating: 5, comment: "Love the card slot! Very practical.", date: "2026-03-07" }
        ]
    }
];

// Cart State
let cart = [];
let shippingCost = 0;
let wishlist = [];
let currentUser = null;
let orders = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    loadCart();
    loadWishlist();
    loadUser();
    loadOrders();
    updateAuthUI();
});

// Render Products
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = products.map((product, index) => `
        <div class="product-card" style="animation-delay: ${index * 0.1}s" onclick="openProductModal(${product.id})">
            <div class="product-image">${product.icon}</div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.desc}</p>
                <div class="product-footer">
                    <span class="product-price">R${product.price.toFixed(2)}</span>
                    <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
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
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartShipping = document.getElementById('cartShipping');
    const cartTotal = document.getElementById('cartTotal');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + shippingCost;

    if (cartCount) cartCount.textContent = totalItems;
    if (cartSubtotal) cartSubtotal.textContent = `R${subtotal.toFixed(2)}`;
    if (cartShipping) cartShipping.textContent = `R${shippingCost.toFixed(2)}`;
    if (cartTotal) cartTotal.textContent = `R${total.toFixed(2)}`;

    if (cartItems) {
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
}

// Update Shipping
function updateShipping(cost) {
    shippingCost = cost;
    updateCart();
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

    if (!currentUser) {
        showNotification('Please login to complete your order! 🔐');
        toggleCart();
        openAuthModal();
        return;
    }

    // Create order
    const order = {
        id: 'ORD-' + Date.now(),
        userId: currentUser.id,
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + shippingCost,
        shipping: shippingCost,
        status: 'processing',
        date: new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    // Save order
    orders.push(order);
    const savedOrders = JSON.parse(localStorage.getItem('metraOrders') || '[]');
    savedOrders.push(order);
    localStorage.setItem('metraOrders', JSON.stringify(savedOrders));

    // Update user review count placeholder
    if (!currentUser.reviews) currentUser.reviews = 0;

    showNotification('Order placed successfully! 🎉');
    cart = [];
    shippingCost = 0;
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
        background: linear-gradient(135deg, #8B0000, #DC143C);
        color: var(--light);
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

// Product Modal Functions
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    const modalBody = document.getElementById('modalBody');
    const isInWishlist = wishlist.includes(productId);

    modalBody.innerHTML = `
        <div class="modal-product-image">${product.icon}</div>
        <div class="modal-product-details">
            <h2 class="modal-product-name">${product.name}</h2>
            <p class="modal-product-sku">SKU: ${product.sku}</p>
            <div class="modal-product-price">R${product.price.toFixed(2)}</div>
            
            <div class="modal-product-description">
                <h3>Description</h3>
                <p>${product.fullDescription}</p>
            </div>
            
            <div class="modal-product-specs">
                <h3>Specifications</h3>
                <ul class="specs-list">
                    ${product.specs.map(spec => `<li><i class="fas fa-check"></i> ${spec}</li>`).join('')}
                </ul>
            </div>
            
            <div class="modal-product-tags">
                <h3>Tags</h3>
                <div class="tags-container">
                    ${product.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            
            <div class="modal-product-actions">
                <button class="btn-add-to-cart-modal" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                <button class="btn-add-to-wishlist ${isInWishlist ? 'active' : ''}" onclick="toggleWishlist(${product.id})">
                    <i class="${isInWishlist ? 'fas' : 'far'} fa-heart"></i> 
                    ${isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </button>
            </div>
        </div>
        
        <div class="modal-reviews-section">
            <h3>Customer Reviews (${product.reviews.length})</h3>
            <div class="reviews-container" id="reviewsContainer">
                ${renderReviews(product.reviews)}
            </div>
            
            <div class="review-form-container">
                <h4>Write a Review</h4>
                <form class="review-form" onsubmit="submitReview(event, ${product.id})">
                    <input type="text" id="reviewName" placeholder="Your Name" required>
                    <div class="rating-input">
                        <label>Your Rating:</label>
                        <div class="star-rating">
                            <input type="radio" name="rating" value="5" id="star5" required>
                            <label for="star5">★</label>
                            <input type="radio" name="rating" value="4" id="star4">
                            <label for="star4">★</label>
                            <input type="radio" name="rating" value="3" id="star3">
                            <label for="star3">★</label>
                            <input type="radio" name="rating" value="2" id="star2">
                            <label for="star2">★</label>
                            <input type="radio" name="rating" value="1" id="star1">
                            <label for="star1">★</label>
                        </div>
                    </div>
                    <textarea id="reviewComment" placeholder="Your Review" rows="4" required></textarea>
                    <button type="submit" class="btn-submit-review">Submit Review</button>
                </form>
            </div>
        </div>
    `;

    document.getElementById('productModal').classList.add('active');
    document.getElementById('modalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    document.getElementById('modalOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

function renderReviews(reviews) {
    if (reviews.length === 0) {
        return '<p class="no-reviews">No reviews yet. Be the first to review!</p>';
    }
    return reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="reviewer-info">
                    <span class="reviewer-name">${review.user}</span>
                    <span class="review-date">${review.date}</span>
                </div>
                <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
            </div>
            <p class="review-comment">${review.comment}</p>
        </div>
    `).join('');
}

function submitReview(event, productId) {
    event.preventDefault();
    const product = products.find(p => p.id === productId);
    const name = document.getElementById('reviewName').value;
    const comment = document.getElementById('reviewComment').value;
    const rating = parseInt(document.querySelector('input[name="rating"]:checked').value);

    product.reviews.unshift({
        user: name,
        rating: rating,
        comment: comment,
        date: new Date().toISOString().split('T')[0]
    });

    document.getElementById('reviewsContainer').innerHTML = renderReviews(product.reviews);
    event.target.reset();
    showNotification('Review submitted successfully! ✨');
}

// Wishlist Functions
function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('Removed from wishlist');
    } else {
        wishlist.push(productId);
        showNotification('Added to wishlist! ❤️');
    }
    // Re-render modal if open
    const modal = document.getElementById('productModal');
    if (modal.classList.contains('active')) {
        openProductModal(productId);
    }
}

function loadWishlist() {
    const saved = localStorage.getItem('metraWishlist');
    if (saved) {
        wishlist = JSON.parse(saved);
    }
}

function saveWishlist() {
    localStorage.setItem('metraWishlist', JSON.stringify(wishlist));
}

// Authentication Functions
function openAuthModal() {
    if (currentUser) {
        openProfileModal();
    } else {
        document.getElementById('authModal').classList.add('active');
        document.getElementById('authOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
    document.getElementById('authOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

function switchAuthTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');

    if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
    }
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('metraUsers') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('metraCurrentUser', JSON.stringify(user));
        closeAuthModal();
        updateAuthUI();
        showNotification(`Welcome back, ${user.name}! 🎉`);
        document.getElementById('loginForm').reset();
    } else {
        showNotification('Invalid email or password ❌');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match! ❌');
        return;
    }

    // Get existing users
    const users = JSON.parse(localStorage.getItem('metraUsers') || '[]');

    // Check if email already exists
    if (users.find(u => u.email === email)) {
        showNotification('Email already registered! ❌');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        password: password,
        createdAt: new Date().toISOString(),
        avatar: null
    };

    users.push(newUser);
    localStorage.setItem('metraUsers', JSON.stringify(users));

    // Auto login
    currentUser = newUser;
    localStorage.setItem('metraCurrentUser', JSON.stringify(newUser));

    closeAuthModal();
    updateAuthUI();
    showNotification('Account created successfully! 🎉');
    document.getElementById('registerForm').reset();
}

function loadUser() {
    const saved = localStorage.getItem('metraCurrentUser');
    if (saved) {
        currentUser = JSON.parse(saved);
    }
}

function loadOrders() {
    const saved = localStorage.getItem('metraOrders');
    if (saved) {
        orders = JSON.parse(saved);
    }
}

function updateAuthUI() {
    const userIcon = document.getElementById('userIcon');
    if (currentUser) {
        userIcon.classList.add('logged-in');
        userIcon.innerHTML = '<i class="fas fa-user-check"></i>';
    } else {
        userIcon.classList.remove('logged-in');
        userIcon.innerHTML = '<i class="fas fa-user"></i>';
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('metraCurrentUser');
    closeProfileModal();
    updateAuthUI();
    showNotification('Logged out successfully 👋');
}

// Profile Functions
function openProfileModal() {
    if (!currentUser) {
        openAuthModal();
        return;
    }

    updateProfileHeader();
    switchProfileTab('overview');

    document.getElementById('profileModal').classList.add('active');
    document.getElementById('profileOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProfileModal() {
    document.getElementById('profileModal').classList.remove('active');
    document.getElementById('profileOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

function updateProfileHeader() {
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;

    const memberDate = new Date(currentUser.createdAt);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    document.getElementById('memberSince').textContent = `${months[memberDate.getMonth()]} ${memberDate.getFullYear()}`;
}

function switchProfileTab(tab) {
    // Update tab active states
    document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`${tab}Tab`).classList.add('active');

    // Update content
    const content = document.getElementById('profileContent');

    switch (tab) {
        case 'overview':
            content.innerHTML = renderOverviewSection();
            break;
        case 'orders':
            content.innerHTML = renderOrdersSection();
            break;
        case 'wishlist':
            content.innerHTML = renderProfileWishlistSection();
            break;
        case 'settings':
            content.innerHTML = renderSettingsSection();
            break;
    }
}

function renderOverviewSection() {
    const totalOrders = orders.filter(o => o.userId === currentUser.id).length;
    const totalSpent = orders.filter(o => o.userId === currentUser.id)
        .reduce((sum, o) => sum + o.total, 0);

    return `
        <div class="profile-section active">
            <h3>Account Overview</h3>
            <div class="overview-stats">
                <div class="stat-card">
                    <i class="fas fa-box"></i>
                    <div class="stat-number">${totalOrders}</div>
                    <div class="stat-label">Total Orders</div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-heart"></i>
                    <div class="stat-number">${wishlist.length}</div>
                    <div class="stat-label">Wishlist Items</div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-wallet"></i>
                    <div class="stat-number">R${totalSpent.toFixed(2)}</div>
                    <div class="stat-label">Total Spent</div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-star"></i>
                    <div class="stat-number">${currentUser.reviews || 0}</div>
                    <div class="stat-label">Reviews Given</div>
                </div>
            </div>

            <div class="recent-activity">
                <h3>Recent Activity</h3>
                <div class="empty-state">
                    <i class="fas fa-clock"></i>
                    <p>No recent activity to display</p>
                </div>
            </div>
        </div>
    `;
}

function renderOrdersSection() {
    const userOrders = orders.filter(o => o.userId === currentUser.id);

    if (userOrders.length === 0) {
        return `
            <div class="profile-section active">
                <h3>Order History</h3>
                <div class="empty-state">
                    <i class="fas fa-box-open"></i>
                    <p>You haven't placed any orders yet</p>
                    <button class="cta-btn" onclick="closeProfileModal(); document.getElementById('products').scrollIntoView()" style="margin-top: 1rem;">
                        Start Shopping <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
    }

    return `
        <div class="profile-section active">
            <h3>Order History</h3>
            <div class="orders-list">
                ${userOrders.map(order => `
                    <div class="order-card">
                        <div class="order-header">
                            <span class="order-id">Order #${order.id}</span>
                            <span class="order-status ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                        </div>
                        <div class="order-details">
                            <div class="order-detail">Date <span>${order.date}</span></div>
                            <div class="order-detail">Items <span>${order.items.length}</span></div>
                            <div class="order-detail">Total <span>R${order.total.toFixed(2)}</span></div>
                        </div>
                        <div class="order-items">
                            ${order.items.map(item => `
                                <div class="order-item">${item.icon} ${item.name}</div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderProfileWishlistSection() {
    if (wishlist.length === 0) {
        return `
            <div class="profile-section active">
                <h3>My Wishlist</h3>
                <div class="empty-state">
                    <i class="fas fa-heart-broken"></i>
                    <p>Your wishlist is empty</p>
                    <button class="cta-btn" onclick="closeProfileModal(); document.getElementById('products').scrollIntoView()" style="margin-top: 1rem;">
                        Browse Products <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
    }

    const wishlistProducts = products.filter(p => wishlist.includes(p.id));

    return `
        <div class="profile-section active">
            <h3>My Wishlist (${wishlist.length})</h3>
            <div class="profile-wishlist-grid">
                ${wishlistProducts.map(product => `
                    <div class="profile-wishlist-item" onclick="closeProfileModal(); openProductModal(${product.id})">
                        <div class="icon">${product.icon}</div>
                        <div class="info">
                            <div class="name">${product.name}</div>
                            <div class="price">R${product.price.toFixed(2)}</div>
                        </div>
                        <button class="remove" onclick="event.stopPropagation(); toggleWishlist(${product.id}); switchProfileTab('wishlist');">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderSettingsSection() {
    return `
        <div class="profile-section active">
            <h3>Account Settings</h3>
            <form class="settings-form" onsubmit="updateProfile(event)">
                <div class="form-group">
                    <label><i class="fas fa-user"></i> Full Name</label>
                    <input type="text" id="profileNameInput" value="${currentUser.name}" required>
                </div>
                <div class="form-group">
                    <label><i class="fas fa-envelope"></i> Email</label>
                    <input type="email" id="profileEmailInput" value="${currentUser.email}" required>
                </div>
                <div class="form-group">
                    <label><i class="fas fa-phone"></i> Phone Number</label>
                    <input type="tel" id="profilePhoneInput" value="${currentUser.phone || ''}">
                </div>
                <button type="submit" class="btn-save-profile">
                    <i class="fas fa-save"></i> Save Changes
                </button>
            </form>
            <button class="btn-logout" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i> Logout
            </button>
        </div>
    `;
}

function updateProfile(event) {
    event.preventDefault();
    const name = document.getElementById('profileNameInput').value;
    const email = document.getElementById('profileEmailInput').value;
    const phone = document.getElementById('profilePhoneInput').value;

    currentUser.name = name;
    currentUser.email = email;
    currentUser.phone = phone;

    // Update in users array
    const users = JSON.parse(localStorage.getItem('metraUsers') || '[]');
    const index = users.findIndex(u => u.id === currentUser.id);
    if (index > -1) {
        users[index] = currentUser;
        localStorage.setItem('metraUsers', JSON.stringify(users));
    }

    // Update current user in localStorage
    localStorage.setItem('metraCurrentUser', JSON.stringify(currentUser));

    updateProfileHeader();
    showNotification('Profile updated successfully! ✨');
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
