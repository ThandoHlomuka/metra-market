// Admin Credentials
const ADMIN_CREDENTIALS = {
    username: 'ThandoHlomuka',
    password: 'Nozibusiso89'
};

// State
let products = [];
let orders = [];
let users = [];
let reviews = [];
let settings = {};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAdminSession();
});

// Check Admin Session
function checkAdminSession() {
    const isAdmin = localStorage.getItem('metraAdminLoggedIn');
    if (isAdmin === 'true') {
        showDashboard();
    }
}

// Admin Login
function adminLogin(event) {
    event.preventDefault();
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    const errorEl = document.getElementById('loginError');

    // Get stored password (allows admin to change it)
    const storedPassword = localStorage.getItem('metraAdminPassword') || ADMIN_CREDENTIALS.password;

    if (username === ADMIN_CREDENTIALS.username && password === storedPassword) {
        localStorage.setItem('metraAdminLoggedIn', 'true');
        localStorage.setItem('metraAdminName', username);
        showDashboard();
    } else {
        errorEl.textContent = 'Invalid username or password';
    }
}

// Admin Logout
function adminLogout() {
    localStorage.removeItem('metraAdminLoggedIn');
    localStorage.removeItem('metraAdminName');
    window.location.reload();
}

// Show Dashboard
function showDashboard() {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'flex';
    
    // Load data
    loadData();
    updateDashboard();
    
    // Set admin name
    const adminName = localStorage.getItem('metraAdminName') || 'Admin';
    document.getElementById('adminName').textContent = adminName;
}

// Load All Data
function loadData() {
    // Load products
    const storedProducts = localStorage.getItem('metraProducts');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    } else {
        // Default products if none exist
        products = [
            { id: 1, name: "Wireless Headphones", price: 1199.99, desc: "Premium noise-canceling wireless headphones", icon: "🎧", sku: "WH-001", tags: ["Audio", "Wireless", "Premium"], fullDescription: "Experience superior sound quality", specs: ["40mm drivers", "Bluetooth 5.2", "40hr battery"], reviews: [] },
            { id: 2, name: "Smart Watch", price: 2999.99, desc: "Feature-rich smartwatch with health tracking", icon: "⌚", sku: "SW-002", tags: ["Wearables", "Fitness"], fullDescription: "Stay connected and track fitness", specs: ["1.4 AMOLED", "Heart rate", "GPS"], reviews: [] },
            { id: 3, name: "Laptop Stand", price: 749.99, desc: "Ergonomic aluminum laptop stand", icon: "💻", sku: "LS-003", tags: ["Office", "Ergonomic"], fullDescription: "Improve your posture", specs: ["Aluminum", "6 heights", "17 inch"], reviews: [] },
            { id: 4, name: "Mechanical Keyboard", price: 1949.99, desc: "RGB mechanical gaming keyboard", icon: "⌨️", sku: "MK-004", tags: ["Gaming", "RGB"], fullDescription: "Dominate your games", specs: ["Cherry MX", "RGB", "Aluminum"], reviews: [] },
            { id: 5, name: "Wireless Mouse", price: 899.99, desc: "Precision wireless gaming mouse", icon: "🖱️", sku: "WM-005", tags: ["Gaming", "Wireless"], fullDescription: "Pixel-perfect precision", specs: ["25K DPI", "68g", "80hr"], reviews: [] },
            { id: 6, name: "USB-C Hub", price: 599.99, desc: "7-in-1 USB-C hub with HDMI", icon: "🔌", sku: "UH-006", tags: ["Connectivity", "USB-C"], fullDescription: "Expand your connectivity", specs: ["4K HDMI", "3x USB", "SD"], reviews: [] },
            { id: 7, name: "Portable Speaker", price: 1349.99, desc: "Waterproof Bluetooth speaker", icon: "🔊", sku: "PS-007", tags: ["Audio", "Portable"], fullDescription: "Take music anywhere", specs: ["360 sound", "24hr", "IPX7"], reviews: [] },
            { id: 8, name: "Phone Case", price: 374.99, desc: "Premium leather phone case", icon: "📱", sku: "PC-008", tags: ["Accessories", "Leather"], fullDescription: "Protect in style", specs: ["Leather", "Card slot", "Magnetic"], reviews: [] }
        ];
        saveProducts();
    }

    // Load orders
    orders = JSON.parse(localStorage.getItem('metraOrders') || '[]');

    // Load users
    users = JSON.parse(localStorage.getItem('metraUsers') || '[]');

    // Load settings
    settings = JSON.parse(localStorage.getItem('metraSettings') || '{}');

    // Collect all reviews from products
    reviews = [];
    products.forEach(product => {
        if (product.reviews && product.reviews.length > 0) {
            product.reviews.forEach(review => {
                reviews.push({
                    productId: product.id,
                    productName: product.name,
                    ...review
                });
            });
        }
    });
}

// Save Products
function saveProducts() {
    localStorage.setItem('metraProducts', JSON.stringify(products));
}

// Update Dashboard
function updateDashboard() {
    // Stats
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('totalUsers').textContent = users.length;
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    document.getElementById('totalRevenue').textContent = `R${totalRevenue.toFixed(2)}`;

    // Recent Orders
    const recentOrders = orders.slice(-5).reverse();
    document.getElementById('recentOrders').innerHTML = recentOrders.length > 0 
        ? recentOrders.map(order => `
            <div class="order-item" style="display: flex; justify-content: space-between; padding: 0.8rem 0; border-bottom: 1px solid rgba(255,248,231,0.1);">
                <div>
                    <strong>${order.id}</strong>
                    <p style="color: var(--gray); font-size: 0.85rem;">${order.date}</p>
                </div>
                <span class="status-badge ${order.status}">${order.status}</span>
            </div>
        `).join('')
        : '<p class="empty-state">No orders yet</p>';

    // Status Breakdown
    const processing = orders.filter(o => o.status === 'processing').length;
    const shipped = orders.filter(o => o.status === 'shipped').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;

    document.getElementById('statusBreakdown').innerHTML = `
        <div class="status-item">
            <div class="status-label">
                <span class="status-dot processing"></span>
                <span>Processing</span>
            </div>
            <strong>${processing}</strong>
        </div>
        <div class="status-item">
            <div class="status-label">
                <span class="status-dot shipped"></span>
                <span>Shipped</span>
            </div>
            <strong>${shipped}</strong>
        </div>
        <div class="status-item">
            <div class="status-label">
                <span class="status-dot delivered"></span>
                <span>Delivered</span>
            </div>
            <strong>${delivered}</strong>
        </div>
    `;

    // Top Products (by order count)
    const productSales = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            productSales[item.id] = (productSales[item.id] || 0) + item.quantity;
        });
    });

    const sortedProducts = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    document.getElementById('topProducts').innerHTML = sortedProducts.length > 0
        ? sortedProducts.map(([id, sales]) => {
            const product = products.find(p => p.id == id);
            return product ? `
                <div class="top-product-item">
                    <div class="top-product-icon">${product.icon}</div>
                    <div class="top-product-info">
                        <div class="top-product-name">${product.name}</div>
                        <div class="top-product-sales">${sales} sold</div>
                    </div>
                </div>
            ` : '';
        }).join('')
        : '<p class="empty-state">No sales yet</p>';

    // Recent Reviews
    const recentReviews = reviews.slice(-5).reverse();
    document.getElementById('recentReviews').innerHTML = recentReviews.length > 0
        ? recentReviews.map(review => `
            <div style="padding: 0.8rem 0; border-bottom: 1px solid rgba(255,248,231,0.1);">
                <div style="color: #FFD700;">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                <p style="font-size: 0.9rem; margin: 0.3rem 0;">${review.comment.substring(0, 50)}${review.comment.length > 50 ? '...' : ''}</p>
                <p style="color: var(--gray); font-size: 0.8rem;">- ${review.user}</p>
            </div>
        `).join('')
        : '<p class="empty-state">No reviews yet</p>';

    // Render tables
    renderProductsTable();
    renderOrders();
    renderUsersTable();
    renderReviews();
}

// Show Section
function showSection(section, element) {
    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    if (element) element.classList.add('active');

    // Update sections
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(`${section}Section`).classList.add('active');

    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        products: 'Products Management',
        orders: 'Orders Management',
        users: 'Users Management',
        reviews: 'Reviews Management',
        settings: 'Settings'
    };
    document.getElementById('pageTitle').textContent = titles[section];

    // Refresh data for each section
    if (section === 'products') renderProductsTable();
    if (section === 'orders') renderOrders();
    if (section === 'users') renderUsersTable();
    if (section === 'reviews') renderReviews();
}

// Toggle Sidebar (mobile)
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
}

// Products Management
function renderProductsTable() {
    const tbody = document.getElementById('productsTable');
    tbody.innerHTML = products.map(product => `
        <tr>
            <td class="product-icon-cell">${product.icon}</td>
            <td>${product.name}</td>
            <td>${product.sku}</td>
            <td>R${product.price.toFixed(2)}</td>
            <td>${product.stock || '∞'}</td>
            <td>
                <div class="action-btns">
                    <button class="action-btn edit" onclick="editProduct(${product.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteProduct(${product.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openProductModal() {
    document.getElementById('productModalTitle').textContent = 'Add Product';
    document.getElementById('productForm').reset();
    document.getElementById('editProductId').value = '';
    document.getElementById('productModalOverlay').style.display = 'flex';
}

function closeProductModal() {
    document.getElementById('productModalOverlay').style.display = 'none';
}

function saveProduct(event) {
    event.preventDefault();
    
    const editId = document.getElementById('editProductId').value;
    const specsInput = document.getElementById('productSpecs').value;
    const tagsInput = document.getElementById('productTags').value;

    const productData = {
        name: document.getElementById('productName').value,
        sku: document.getElementById('productSku').value,
        price: parseFloat(document.getElementById('productPrice').value),
        icon: document.getElementById('productIcon').value,
        desc: document.getElementById('productDesc').value,
        fullDescription: document.getElementById('productFullDesc').value,
        specs: specsInput ? specsInput.split(',').map(s => s.trim()) : [],
        tags: tagsInput ? tagsInput.split(',').map(t => t.trim()) : [],
        reviews: []
    };

    if (editId) {
        // Edit existing
        const index = products.findIndex(p => p.id == editId);
        if (index > -1) {
            productData.id = parseInt(editId);
            productData.reviews = products[index].reviews || [];
            products[index] = productData;
        }
    } else {
        // Add new
        productData.id = Date.now();
        products.push(productData);
    }

    saveProducts();
    closeProductModal();
    renderProductsTable();
    updateDashboard();
    
    // Also update the main store products
    localStorage.setItem('metraProducts', JSON.stringify(products));
    
    showNotification('Product saved successfully!');
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    document.getElementById('productModalTitle').textContent = 'Edit Product';
    document.getElementById('editProductId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productSku').value = product.sku;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productIcon').value = product.icon;
    document.getElementById('productDesc').value = product.desc;
    document.getElementById('productFullDesc').value = product.fullDescription || '';
    document.getElementById('productSpecs').value = product.specs ? product.specs.join(', ') : '';
    document.getElementById('productTags').value = product.tags ? product.tags.join(', ') : '';

    document.getElementById('productModalOverlay').style.display = 'flex';
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        saveProducts();
        renderProductsTable();
        updateDashboard();
        showNotification('Product deleted successfully!');
    }
}

// Orders Management
function renderOrders() {
    const filter = document.getElementById('orderFilter').value;
    const tbody = document.getElementById('ordersTable');
    
    let filteredOrders = orders;
    if (filter !== 'all') {
        filteredOrders = orders.filter(o => o.status === filter);
    }

    tbody.innerHTML = filteredOrders.length > 0 ? filteredOrders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customerName || 'Customer'}</td>
            <td>${order.date}</td>
            <td>${order.items.length}</td>
            <td>R${order.total.toFixed(2)}</td>
            <td><span class="status-badge ${order.status}">${order.status}</span></td>
            <td>
                <div class="action-btns">
                    <button class="action-btn view" onclick="viewOrder('${order.id}')" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <select onchange="updateOrderStatus('${order.id}', this.value)" style="padding: 0.3rem; background: rgba(255,248,231,0.1); border: 1px solid rgba(255,248,231,0.2); border-radius: 5px; color: var(--light); cursor: pointer;">
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                </div>
            </td>
        </tr>
    `).join('') : '<tr><td colspan="7" class="empty-state">No orders found</td></tr>';
}

function updateOrderStatus(orderId, status) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = status;
        localStorage.setItem('metraOrders', JSON.stringify(orders));
        renderOrders();
        updateDashboard();
        showNotification(`Order ${orderId} status updated to ${status}`);
    }
}

function viewOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const itemsList = order.items.map(item => 
        `<div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0;">
            <span>${item.icon}</span>
            <span>${item.name} x ${item.quantity}</span>
            <span style="margin-left: auto;">R${(item.price * item.quantity).toFixed(2)}</span>
        </div>`
    ).join('');

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Order ${orderId}</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
                    <div>
                        <p style="color: var(--gray); font-size: 0.85rem;">Date</p>
                        <p>${order.date}</p>
                    </div>
                    <div>
                        <p style="color: var(--gray); font-size: 0.85rem;">Status</p>
                        <span class="status-badge ${order.status}">${order.status}</span>
                    </div>
                    <div>
                        <p style="color: var(--gray); font-size: 0.85rem;">Subtotal</p>
                        <p>R${(order.total - (order.shipping || 0)).toFixed(2)}</p>
                    </div>
                    <div>
                        <p style="color: var(--gray); font-size: 0.85rem;">Shipping</p>
                        <p>R${(order.shipping || 0).toFixed(2)}</p>
                    </div>
                </div>
                <h4 style="margin-bottom: 1rem;">Items</h4>
                ${itemsList}
                <div style="border-top: 1px solid rgba(255,248,231,0.1); margin-top: 1rem; padding-top: 1rem; display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: 700;">
                    <span>Total</span>
                    <span>R${order.total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Users Management
function renderUsersTable() {
    const tbody = document.getElementById('usersTable');
    tbody.innerHTML = users.length > 0 ? users.map(user => {
        const userOrders = orders.filter(o => o.userId === user.id).length;
        const joinDate = new Date(user.createdAt).toLocaleDateString('en-ZA');
        return `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone || '-'}</td>
                <td>${joinDate}</td>
                <td>${userOrders}</td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn delete" onclick="deleteUser(${user.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('') : '<tr><td colspan="6" class="empty-state">No users registered</td></tr>';
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user? This cannot be undone.')) {
        users = users.filter(u => u.id !== id);
        localStorage.setItem('metraUsers', JSON.stringify(users));
        renderUsersTable();
        updateDashboard();
        showNotification('User deleted successfully!');
    }
}

// Reviews Management
function renderReviews() {
    const grid = document.getElementById('reviewsGrid');
    
    // Reload reviews from products
    reviews = [];
    products.forEach(product => {
        if (product.reviews && product.reviews.length > 0) {
            product.reviews.forEach(review => {
                reviews.push({
                    productId: product.id,
                    productName: product.name,
                    ...review
                });
            });
        }
    });

    grid.innerHTML = reviews.length > 0 ? reviews.map((review, index) => `
        <div class="review-card">
            <div class="review-card-header">
                <span class="review-product">${review.productName}</span>
                <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
            </div>
            <p class="review-user">${review.user} - ${review.date}</p>
            <p class="review-comment">${review.comment}</p>
            <button class="btn-danger btn-sm" onclick="deleteReview(${review.productId}, ${index})">
                <i class="fas fa-trash"></i> Delete Review
            </button>
        </div>
    `).join('') : '<div class="empty-state" style="grid-column: 1/-1;"><i class="fas fa-star"></i><p>No reviews yet</p></div>';
}

function deleteReview(productId, reviewIndex) {
    if (confirm('Delete this review?')) {
        const product = products.find(p => p.id === productId);
        if (product && product.reviews) {
            product.reviews.splice(reviewIndex, 1);
            saveProducts();
            renderReviews();
            updateDashboard();
            showNotification('Review deleted successfully!');
        }
    }
}

// Settings
function saveSettings(event) {
    event.preventDefault();
    
    settings = {
        storeName: document.getElementById('storeName').value,
        freeShipping: parseFloat(document.getElementById('freeShipping').value),
        expressShipping: parseFloat(document.getElementById('expressShipping').value),
        sameDayShipping: parseFloat(document.getElementById('sameDayShipping').value)
    };

    localStorage.setItem('metraSettings', JSON.stringify(settings));
    showNotification('Settings saved successfully!');
}

function changeAdminPassword(event) {
    event.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    const storedPassword = localStorage.getItem('metraAdminPassword') || ADMIN_CREDENTIALS.password;
    
    if (currentPassword !== storedPassword) {
        showNotification('Current password is incorrect!');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match!');
        return;
    }
    
    if (newPassword.length < 6) {
        showNotification('Password must be at least 6 characters!');
        return;
    }
    
    localStorage.setItem('metraAdminPassword', newPassword);
    showNotification('Password changed successfully! Please login again.');
    setTimeout(() => adminLogout(), 1500);
}

// Clear Data
function clearData(type) {
    const confirmMsg = type === 'orders' 
        ? 'Clear all orders? This cannot be undone.'
        : 'Clear all users? This cannot be undone.';
    
    if (confirm(confirmMsg)) {
        if (type === 'orders') {
            localStorage.removeItem('metraOrders');
            orders = [];
        } else if (type === 'users') {
            localStorage.removeItem('metraUsers');
            users = [];
        }
        updateDashboard();
        renderUsersTable();
        renderOrders();
        showNotification(`All ${type} cleared successfully!`);
    }
}

function resetProducts() {
    if (confirm('Reset products to default? Custom products will be lost.')) {
        localStorage.removeItem('metraProducts');
        loadData();
        renderProductsTable();
        updateDashboard();
        showNotification('Products reset to default!');
    }
}

// Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #228B22, #32CD32);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        font-weight: 500;
        z-index: 2000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles if not exists
if (!document.getElementById('admin-animations')) {
    const style = document.createElement('style');
    style.id = 'admin-animations';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}
