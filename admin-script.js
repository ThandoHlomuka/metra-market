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
        invoices: 'Invoices Management',
        settings: 'Settings',
        sessions: 'Sessions & Data Management',
        analytics: 'Analytics Dashboard',
        email: 'Email Settings'
    };
    document.getElementById('pageTitle').textContent = titles[section];

    // Refresh data for each section
    if (section === 'products') renderProductsTable();
    if (section === 'orders') renderOrders();
    if (section === 'users') renderUsersTable();
    if (section === 'reviews') renderReviews();
    if (section === 'invoices') renderInvoices();
    if (section === 'sessions') loadSessionsData();
    if (section === 'analytics') loadAnalytics();
    if (section === 'email') loadEmailSettings();
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

// Invoice Management
function renderInvoices() {
    const invoices = JSON.parse(localStorage.getItem('metraInvoices') || '[]');
    const tbody = document.getElementById('invoicesTable');

    if (invoices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No invoices generated yet</td></tr>';
        return;
    }

    tbody.innerHTML = invoices.map(invoice => `
        <tr>
            <td><strong>${invoice.invoiceNumber}</strong></td>
            <td>${invoice.orderId}</td>
            <td>
                ${invoice.customer.name}<br>
                <small style="color: var(--gray);">${invoice.customer.email}</small>
            </td>
            <td>${invoice.date}</td>
            <td><strong>R${invoice.total.toFixed(2)}</strong></td>
            <td>
                <div class="action-btns">
                    <button class="action-btn view" onclick="viewInvoice('${invoice.orderId}')" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="downloadInvoice('${invoice.orderId}')" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="action-btn edit" onclick="emailInvoice('${invoice.orderId}')" title="Email">
                        <i class="fas fa-envelope"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function viewInvoice(orderId) {
    const orders = JSON.parse(localStorage.getItem('metraOrders') || '[]');
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        showNotification('Invoice not found!');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal" style="max-width: 700px;">
            <div class="modal-header">
                <h3>Invoice ${order.invoiceNumber}</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; margin-bottom: 1.5rem;">
                    <h2 style="color: var(--primary);">INVOICE</h2>
                    <p style="color: var(--gray);">${order.date}</p>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                    <div>
                        <p style="color: var(--gray); font-size: 0.85rem;">Bill To:</p>
                        <p><strong>${order.customerName}</strong></p>
                        <p>${order.customerEmail}</p>
                        <p>${order.customerPhone || 'N/A'}</p>
                    </div>
                    <div>
                        <p style="color: var(--gray); font-size: 0.85rem;">Order Details:</p>
                        <p>Order ID: ${order.id}</p>
                        <p>Status: <span class="status-badge ${order.status}">${order.status}</span></p>
                    </div>
                </div>
                <table class="data-table" style="margin-bottom: 1rem;">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.icon} ${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>R${item.price.toFixed(2)}</td>
                                <td>R${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div style="border-top: 2px solid var(--primary); padding-top: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>Subtotal:</span>
                        <span>R${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>Shipping:</span>
                        <span>R${order.shipping.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 1.3rem; font-weight: 700; color: var(--primary);">
                        <span>Total:</span>
                        <span>R${order.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="window.print()"><i class="fas fa-print"></i> Print</button>
                <button class="btn-primary" onclick="downloadInvoice('${order.id}'); this.closest('.modal-overlay').remove()">
                    <i class="fas fa-download"></i> Download
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function emailInvoice(orderId) {
    const orders = JSON.parse(localStorage.getItem('metraOrders') || '[]');
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const subject = `Invoice ${order.invoiceNumber} - Metra Market`;
    const body = `Dear ${order.customerName},%0D%0A%0D%0AThank you for your order!%0D%0A%0D%0AInvoice: ${order.invoiceNumber}%0D%0AOrder Total: R${order.total.toFixed(2)}%0D%0A%0D%0AView your invoice at: Metra Market%0D%0A%0D%0AThank you for your business!%0D%0AMetra Market Team`;

    window.open(`mailto:${order.customerEmail}?subject=${subject}&body=${body}`);
    showNotification('Opening email client...');
}

function exportAllInvoices() {
    const invoices = JSON.parse(localStorage.getItem('metraInvoices') || '[]');
    if (invoices.length === 0) {
        showNotification('No invoices to export!');
        return;
    }

    let content = 'METRA MARKET - ALL INVOICES\n========================\n\n';
    invoices.forEach((inv, i) => {
        content += `INVOICE ${i + 1}\n`;
        content += `Invoice: ${inv.invoiceNumber}\n`;
        content += `Order: ${inv.orderId}\n`;
        content += `Date: ${inv.date}\n`;
        content += `Customer: ${inv.customer.name}\n`;
        content += `Email: ${inv.customer.email}\n`;
        content += `Total: R${inv.total.toFixed(2)}\n`;
        content += `Status: ${inv.status}\n`;
        content += '------------------------\n\n';
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `All-Invoices-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Invoices exported! 📄');
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

// ==================== SESSIONS & DATA MANAGEMENT ====================

// Load Sessions Data
function loadSessionsData() {
    // Update admin name
    const adminName = localStorage.getItem('metraAdminName') || 'Admin';
    document.getElementById('currentAdminName').textContent = adminName;

    // Load data overview
    const storedProducts = JSON.parse(localStorage.getItem('metraProducts') || '[]');
    const storedOrders = JSON.parse(localStorage.getItem('metraOrders') || '[]');
    const storedUsers = JSON.parse(localStorage.getItem('metraUsers') || '[]');
    const storedInvoices = JSON.parse(localStorage.getItem('metraInvoices') || '[]');

    document.getElementById('dataProducts').textContent = storedProducts.length;
    document.getElementById('dataOrders').textContent = storedOrders.length;
    document.getElementById('dataUsers').textContent = storedUsers.length;
    document.getElementById('dataInvoices').textContent = storedInvoices.length;

    // Load user sessions (simulate - in real app, track login times)
    loadUserSessions(storedUsers);

    // Load carts
    loadCartsData();

    // Load wishlist stats
    loadWishlistStats();
}

// Load User Sessions
function loadUserSessions(users) {
    const tbody = document.getElementById('userSessionsTable');
    
    // Get currently logged in users from localStorage
    // In production, you'd track this server-side
    const activeSessions = users.filter(u => {
        // Check if user has recent activity (within last 24 hours)
        const lastActive = u.lastActive || u.createdAt;
        const now = new Date().getTime();
        const lastActiveTime = new Date(lastActive).getTime();
        const hoursSinceActive = (now - lastActiveTime) / (1000 * 60 * 60);
        return hoursSinceActive < 24;
    });

    if (activeSessions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No active sessions</td></tr>';
        return;
    }

    tbody.innerHTML = activeSessions.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${new Date(user.lastActive || user.createdAt).toLocaleString('en-ZA')}</td>
            <td>${user.provider || 'Email'}</td>
            <td>
                <button class="action-btn delete" onclick="logoutUser(${user.id})" title="Logout User">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Logout Single User
function logoutUser(userId) {
    if (confirm('Are you sure you want to logout this user?')) {
        const users = JSON.parse(localStorage.getItem('metraUsers') || '[]');
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex > -1) {
            // Remove user's active session
            users[userIndex].lastActive = null;
            localStorage.setItem('metraUsers', JSON.stringify(users));
            
            // If this is the current user, clear their session
            const currentUser = JSON.parse(localStorage.getItem('metraCurrentUser') || 'null');
            if (currentUser && currentUser.id === userId) {
                localStorage.removeItem('metraCurrentUser');
                localStorage.removeItem('metraUserLoggedIn');
            }
            
            loadSessionsData();
            showNotification('User logged out successfully!');
        }
    }
}

// Clear All User Sessions
function clearAllUserSessions() {
    if (confirm('Are you sure you want to logout ALL users? This will clear all active sessions.')) {
        localStorage.removeItem('metraCurrentUser');
        localStorage.removeItem('metraUserLoggedIn');
        
        // Clear lastActive for all users
        const users = JSON.parse(localStorage.getItem('metraUsers') || '[]');
        users.forEach(u => u.lastActive = null);
        localStorage.setItem('metraUsers', JSON.stringify(users));
        
        loadSessionsData();
        showNotification('All user sessions cleared!');
    }
}

// Load Carts Data
function loadCartsData() {
    const tbody = document.getElementById('cartsTable');
    const cart = JSON.parse(localStorage.getItem('metraCart') || '[]');
    
    if (cart.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No active carts</td></tr>';
        document.getElementById('totalWishlistItems').parentElement.parentElement.style.display = 'none';
        return;
    }

    const totalValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    tbody.innerHTML = `
        <tr>
            <td>CART-${Date.now().toString().slice(-6)}</td>
            <td>${cart.length} items</td>
            <td>R${totalValue.toFixed(2)}</td>
            <td>Just now</td>
            <td>
                <button class="action-btn delete" onclick="clearAllCarts()" title="Clear Cart">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `;
}

// Clear All Carts
function clearAllCarts() {
    if (confirm('Are you sure you want to clear all shopping carts?')) {
        localStorage.removeItem('metraCart');
        loadSessionsData();
        showNotification('All carts cleared!');
    }
}

// Load Wishlist Stats
function loadWishlistStats() {
    const wishlist = JSON.parse(localStorage.getItem('metraWishlist') || '[]');
    document.getElementById('totalWishlistItems').textContent = wishlist.length;
    document.getElementById('activeWishlists').textContent = wishlist.length > 0 ? '1' : '0';
}

// Export All Data
function exportAllData() {
    const data = {
        exportDate: new Date().toISOString(),
        products: JSON.parse(localStorage.getItem('metraProducts') || '[]'),
        orders: JSON.parse(localStorage.getItem('metraOrders') || '[]'),
        users: JSON.parse(localStorage.getItem('metraUsers') || '[]'),
        invoices: JSON.parse(localStorage.getItem('metraInvoices') || '[]'),
        settings: JSON.parse(localStorage.getItem('metraSettings') || '{}')
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `metra-market-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('All data exported! 📦');
}

// Import Data
function importData() {
    document.getElementById('importFile').click();
}

// Handle File Import
function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (confirm('This will overwrite all current data. Are you sure?')) {
                if (data.products) localStorage.setItem('metraProducts', JSON.stringify(data.products));
                if (data.orders) localStorage.setItem('metraOrders', JSON.stringify(data.orders));
                if (data.users) localStorage.setItem('metraUsers', JSON.stringify(data.users));
                if (data.invoices) localStorage.setItem('metraInvoices', JSON.stringify(data.invoices));
                if (data.settings) localStorage.setItem('metraSettings', JSON.stringify(data.settings));
                
                showNotification('Data imported successfully! 🎉');
                setTimeout(() => window.location.reload(), 1500);
            }
        } catch (error) {
            showNotification('Invalid file format. Please upload a valid JSON backup.');
        }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
}

// ==================== ANALYTICS DASHBOARD ====================

// Analytics charts instances
let visitorChartInstance = null;
let revenueChartInstance = null;
let categoryChartInstance = null;
let engagementChartInstance = null;

// Load Analytics
function loadAnalytics() {
    updateAnalytics();
}

// Update Analytics
function updateAnalytics() {
    const days = parseInt(document.getElementById('analyticsPeriod')?.value || '30');
    const now = new Date();
    const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));

    // Get data from localStorage
    const orders = JSON.parse(localStorage.getItem('metraOrders') || '[]');
    const users = JSON.parse(localStorage.getItem('metraUsers') || '[]');
    const products = JSON.parse(localStorage.getItem('metraProducts') || '[]');

    // Filter orders by date range
    const filteredOrders = orders.filter(o => new Date(o.date) >= startDate);

    // Calculate metrics
    const totalVisitors = users.length + Math.floor(Math.random() * 100); // Simulated page visitors
    const activeUsers = users.filter(u => {
        const lastActive = new Date(u.lastActive || u.createdAt);
        return lastActive >= startDate;
    }).length;
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
    const conversionRate = totalVisitors > 0 ? ((totalOrders / totalVisitors) * 100).toFixed(2) : 0;
    const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

    // Update metrics display
    document.getElementById('totalVisitors').textContent = totalVisitors.toLocaleString();
    document.getElementById('activeUsers').textContent = activeUsers.toLocaleString();
    document.getElementById('conversionRate').textContent = conversionRate + '%';
    document.getElementById('avgOrderValue').textContent = 'R' + avgOrderValue.toFixed(2);

    // Update change indicators (simulated)
    const changes = ['↑ 12%', '↑ 8%', '↑ 5%', '↑ 15%'];
    document.getElementById('visitorsChange').textContent = changes[0];
    document.getElementById('usersChange').textContent = changes[1];
    document.getElementById('conversionChange').textContent = changes[2];
    document.getElementById('aovChange').textContent = changes[3];

    // Engagement stats
    document.getElementById('avgSessionDuration').textContent = Math.floor(2 + Math.random() * 8) + 'm';
    document.getElementById('pagesPerSession').textContent = (2 + Math.random() * 5).toFixed(1);
    document.getElementById('bounceRate').textContent = (20 + Math.random() * 30).toFixed(1) + '%';
    document.getElementById('returningVisitors').textContent = (30 + Math.random() * 40).toFixed(1) + '%';

    // Generate chart data
    generateVisitorChart(days, filteredOrders, users);
    generateRevenueChart(days, filteredOrders);
    generateCategoryChart(products, filteredOrders);
    generateEngagementChart();
    generateTopProductsTable(products, filteredOrders);
}

// Generate Visitor Trends Chart
function generateVisitorChart(days, orders, users) {
    const ctx = document.getElementById('visitorChart');
    if (!ctx) return;

    // Generate labels for each day
    const labels = [];
    const visitorsData = [];
    const ordersData = [];

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' });
        labels.push(dateStr);

        // Simulated visitor data with realistic patterns
        const baseVisitors = 50 + Math.random() * 100;
        const weekendMultiplier = (date.getDay() === 0 || date.getDay() === 6) ? 1.5 : 1;
        visitorsData.push(Math.floor(baseVisitors * weekendMultiplier));

        // Count orders for this day
        const dayOrders = orders.filter(o => {
            const orderDate = new Date(o.date);
            return orderDate.getDate() === date.getDate() && 
                   orderDate.getMonth() === date.getMonth() &&
                   orderDate.getFullYear() === date.getFullYear();
        }).length;
        ordersData.push(dayOrders);
    }

    if (visitorChartInstance) visitorChartInstance.destroy();

    visitorChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Visitors',
                data: visitorsData,
                borderColor: '#8B0000',
                backgroundColor: 'rgba(139, 0, 0, 0.1)',
                fill: true,
                tension: 0.4
            }, {
                label: 'Orders',
                data: ordersData,
                borderColor: '#DC143C',
                backgroundColor: 'rgba(220, 20, 60, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#FFF8E7' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 248, 231, 0.1)' },
                    ticks: { color: '#8B7355' }
                },
                x: {
                    grid: { color: 'rgba(255, 248, 231, 0.1)' },
                    ticks: { color: '#8B7355' }
                }
            }
        }
    });
}

// Generate Revenue Chart
function generateRevenueChart(days, orders) {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    const labels = [];
    const revenueData = [];
    const ordersCountData = [];

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' });
        labels.push(dateStr);

        const dayOrders = orders.filter(o => {
            const orderDate = new Date(o.date);
            return orderDate.getDate() === date.getDate() && 
                   orderDate.getMonth() === date.getMonth() &&
                   orderDate.getFullYear() === date.getFullYear();
        });

        revenueData.push(dayOrders.reduce((sum, o) => sum + o.total, 0));
        ordersCountData.push(dayOrders.length);
    }

    if (revenueChartInstance) revenueChartInstance.destroy();

    revenueChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenue (R)',
                data: revenueData,
                backgroundColor: 'rgba(139, 0, 0, 0.8)',
                borderColor: '#8B0000',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#FFF8E7' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 248, 231, 0.1)' },
                    ticks: { color: '#8B7355' }
                },
                x: {
                    grid: { color: 'rgba(255, 248, 231, 0.1)' },
                    ticks: { color: '#8B7355' }
                }
            }
        }
    });
}

// Generate Category Chart
function generateCategoryChart(products, orders) {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    // Group products by tags
    const categorySales = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product && product.tags && product.tags.length > 0) {
                product.tags.forEach(tag => {
                    categorySales[tag] = (categorySales[tag] || 0) + item.quantity;
                });
            }
        });
    });

    const labels = Object.keys(categorySales);
    const data = Object.values(categorySales);

    if (categoryChartInstance) categoryChartInstance.destroy();

    categoryChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.length > 0 ? labels : ['No data'],
            datasets: [{
                data: data.length > 0 ? data : [1],
                backgroundColor: [
                    '#8B0000',
                    '#DC143C',
                    '#B22222',
                    '#228B22',
                    '#FFA500',
                    '#FFD700',
                    '#1E90FF',
                    '#32CD32'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { color: '#FFF8E7' }
                }
            }
        }
    });
}

// Generate Engagement Chart
function generateEngagementChart() {
    const ctx = document.getElementById('engagementChart');
    if (!ctx) return;

    if (engagementChartInstance) engagementChartInstance.destroy();

    engagementChartInstance = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: ['Page Views', 'Add to Cart', 'Wishlist', 'Checkout', 'Purchases'],
            datasets: [{
                data: [100, 45, 30, 25, 15],
                backgroundColor: [
                    'rgba(139, 0, 0, 0.8)',
                    'rgba(220, 20, 60, 0.8)',
                    'rgba(178, 34, 34, 0.8)',
                    'rgba(34, 139, 34, 0.8)',
                    'rgba(50, 205, 50, 0.8)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#FFF8E7' }
                }
            },
            scales: {
                r: {
                    grid: { color: 'rgba(255, 248, 231, 0.1)' },
                    ticks: { color: '#8B7355', backdropColor: 'transparent' }
                }
            }
        }
    });
}

// Generate Top Products Table
function generateTopProductsTable(products, orders) {
    const tbody = document.getElementById('topProductsTable');
    if (!tbody) return;

    // Calculate product performance
    const productStats = {};
    products.forEach(product => {
        productStats[product.id] = {
            product: product,
            views: Math.floor(Math.random() * 500) + 50, // Simulated views
            sales: 0,
            revenue: 0
        };
    });

    orders.forEach(order => {
        order.items.forEach(item => {
            if (productStats[item.id]) {
                productStats[item.id].sales += item.quantity;
                productStats[item.id].revenue += item.price * item.quantity;
            }
        });
    });

    // Sort by revenue and get top 10
    const sortedProducts = Object.values(productStats)
        .filter(p => p.sales > 0)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

    if (sortedProducts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No sales data yet</td></tr>';
        return;
    }

    tbody.innerHTML = sortedProducts.map((stat, index) => {
        const conversion = stat.views > 0 ? ((stat.sales / stat.views) * 100).toFixed(1) : 0;
        return `
            <tr>
                <td>#${index + 1}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 1.5rem;">${stat.product.icon}</span>
                        <span>${stat.product.name}</span>
                    </div>
                </td>
                <td>${stat.views}</td>
                <td>${stat.sales}</td>
                <td>R${stat.revenue.toFixed(2)}</td>
                <td>
                    <span style="color: ${conversion > 5 ? '#228B22' : conversion > 2 ? '#FFA500' : '#DC143C'}">
                        ${conversion}%
                    </span>
                </td>
            </tr>
        `;
    }).join('');
}

// ==================== EMAIL MANAGEMENT ====================

let currentEditingTemplate = null;

// Load Email Settings
function loadEmailSettings() {
    // Load email config
    const config = JSON.parse(localStorage.getItem('metraEmailConfig') || '{}');
    
    document.getElementById('emailEnabled').checked = config.enabled || false;
    document.getElementById('smtpHost').value = config.smtpHost || '';
    document.getElementById('smtpPort').value = config.smtpPort || 587;
    document.getElementById('smtpUser').value = config.smtpUser || '';
    document.getElementById('smtpPassword').value = config.smtpPassword || '';
    document.getElementById('fromEmail').value = config.fromEmail || 'noreply@metramarket.co.za';
    document.getElementById('adminEmail').value = config.adminEmail || 'admin@metramarket.co.za';

    // Load email queue
    loadEmailQueue();
}

// Save Email Config
function saveEmailConfig(event) {
    event.preventDefault();
    
    const config = {
        enabled: document.getElementById('emailEnabled').checked,
        smtpHost: document.getElementById('smtpHost').value,
        smtpPort: parseInt(document.getElementById('smtpPort').value),
        smtpUser: document.getElementById('smtpUser').value,
        smtpPassword: document.getElementById('smtpPassword').value,
        fromEmail: document.getElementById('fromEmail').value,
        adminEmail: document.getElementById('adminEmail').value
    };

    localStorage.setItem('metraEmailConfig', JSON.stringify(config));
    showNotification('Email settings saved successfully!');
}

// Test Email Connection
function testEmailConnection() {
    const config = JSON.parse(localStorage.getItem('metraEmailConfig') || '{}');
    
    if (!config.enabled) {
        showNotification('Please enable email notifications first');
        return;
    }

    if (!config.smtpHost || !config.smtpUser || !config.smtpPassword) {
        showNotification('Please fill in all SMTP settings');
        return;
    }

    showNotification('Testing connection...');
    setTimeout(() => {
        showNotification('Connection test successful! (Simulation)');
    }, 1500);
}

// Edit Template
function editTemplate(templateId) {
    currentEditingTemplate = templateId;
    
    const savedTemplates = JSON.parse(localStorage.getItem('metraEmailTemplates') || '[]');
    const savedTemplate = savedTemplates.find(t => t.id === templateId);
    
    const templateNames = {
        order_confirmation: 'Order Confirmation',
        invoice: 'Invoice',
        admin_new_order: 'Admin - New Order Alert',
        password_reset: 'Password Reset'
    };

    document.getElementById('templateName').value = templateNames[templateId] || templateId;
    document.getElementById('templateSubject').value = savedTemplate?.subject || '';
    document.getElementById('templateHtml').value = savedTemplate?.html || '';
    document.getElementById('templateEditor').style.display = 'block';
}

// Save Template
function saveTemplate() {
    if (!currentEditingTemplate) return;

    const subject = document.getElementById('templateSubject').value;
    const html = document.getElementById('templateHtml').value;

    const templates = JSON.parse(localStorage.getItem('metraEmailTemplates') || '[]');
    const index = templates.findIndex(t => t.id === currentEditingTemplate);
    
    if (index > -1) {
        templates[index].subject = subject;
        templates[index].html = html;
    } else {
        templates.push({
            id: currentEditingTemplate,
            subject: subject,
            html: html
        });
    }

    localStorage.setItem('metraEmailTemplates', JSON.stringify(templates));
    showNotification('Template saved successfully!');
    document.getElementById('templateEditor').style.display = 'none';
}

// Reset Template
function resetTemplate() {
    if (!currentEditingTemplate) return;

    if (confirm('Reset this template to default? Your customizations will be lost.')) {
        const templates = JSON.parse(localStorage.getItem('metraEmailTemplates') || '[]');
        const filtered = templates.filter(t => t.id !== currentEditingTemplate);
        localStorage.setItem('metraEmailTemplates', JSON.stringify(filtered));
        
        document.getElementById('templateSubject').value = '';
        document.getElementById('templateHtml').value = '';
        showNotification('Template reset to default');
    }
}

// Load Email Queue
function loadEmailQueue() {
    const tbody = document.getElementById('emailQueueTable');
    const queue = JSON.parse(localStorage.getItem('metraEmailQueue') || '[]');

    if (queue.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No emails in queue</td></tr>';
        return;
    }

    tbody.innerHTML = queue.map(email => `
        <tr>
            <td>${email.to}</td>
            <td>${email.subject?.substring(0, 40) || ''}${(email.subject?.length || 0) > 40 ? '...' : ''}</td>
            <td>${email.templateId || 'Custom'}</td>
            <td>
                <span style="padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; 
                    background: ${email.status === 'sent' ? 'rgba(34, 139, 34, 0.2)' : 'rgba(255, 165, 0, 0.2)'};
                    color: ${email.status === 'sent' ? '#228B22' : '#FFA500'};">
                    ${email.status || 'pending'}
                </span>
            </td>
            <td>${new Date(email.createdAt).toLocaleString('en-ZA')}</td>
        </tr>
    `).reverse().join('');
}

// Clear Email Queue
function clearEmailQueue() {
    if (confirm('Clear all emails from queue?')) {
        localStorage.removeItem('metraEmailQueue');
        loadEmailQueue();
        showNotification('Email queue cleared');
    }
}

// ==================== SUPPORT CHAT MANAGEMENT ====================

let selectedChatMessage = null;

// Load Support Chat Messages
function loadSupportChats() {
    const allMessages = JSON.parse(localStorage.getItem('metraChatMessages') || '[]');
    const tbody = document.getElementById('supportChatsTable');
    
    // Update counts
    const unreadCount = allMessages.filter(m => m.status === 'sent').length;
    document.getElementById('unreadChatsCount').textContent = unreadCount;
    document.getElementById('totalChatsCount').textContent = allMessages.length;

    if (allMessages.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No support messages yet</td></tr>';
        return;
    }

    // Group by user and get latest message
    const userChats = {};
    allMessages.forEach(msg => {
        if (!userChats[msg.userId] || new Date(msg.timestamp) > new Date(userChats[msg.userId].timestamp)) {
            userChats[msg.userId] = msg;
        }
    });

    const sortedChats = Object.values(userChats).sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    );

    tbody.innerHTML = sortedChats.map(chat => `
        <tr>
            <td>
                <div>
                    <strong>${chat.userName}</strong><br>
                    <span style="color: var(--gray); font-size: 0.85rem;">${chat.userEmail}</span>
                </div>
            </td>
            <td>${chat.message.substring(0, 50)}${chat.message.length > 50 ? '...' : ''}</td>
            <td>${new Date(chat.timestamp).toLocaleString('en-ZA')}</td>
            <td>
                <span style="padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; 
                    background: ${chat.status === 'read' ? 'rgba(34, 139, 34, 0.2)' : 'rgba(255, 165, 0, 0.2)'};
                    color: ${chat.status === 'read' ? '#228B22' : '#FFA500'};">
                    ${chat.status}
                </span>
            </td>
            <td>
                <button class="action-btn view" onclick="openChatReply('${chat.userId}', '${chat.id}')" title="Reply">
                    <i class="fas fa-reply"></i>
                </button>
                <button class="action-btn delete" onclick="deleteChatMessage('${chat.userId}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Refresh Chat Messages
function refreshChatMessages() {
    loadSupportChats();
    showNotification('Chat messages refreshed');
}

// Open Chat Reply Section
function openChatReply(userId, messageId) {
    const allMessages = JSON.parse(localStorage.getItem('metraChatMessages') || '[]');
    const userChats = JSON.parse(localStorage.getItem('metraUserChats_' + userId) || '[]');
    
    const message = allMessages.find(m => m.id == messageId);
    if (!message) return;

    selectedChatMessage = { userId, messageId };
    
    document.getElementById('replyCustomerName').textContent = message.userName;
    document.getElementById('replyCustomerEmail').textContent = message.userEmail;
    document.getElementById('replyMessage').textContent = message.message;
    document.getElementById('adminReplyText').value = '';
    document.getElementById('chatReplySection').style.display = 'block';
    
    // Scroll to reply section
    document.getElementById('chatReplySection').scrollIntoView({ behavior: 'smooth' });
}

// Send Admin Reply
function sendAdminReply() {
    const replyText = document.getElementById('adminReplyText').value.trim();
    
    if (!replyText || !selectedChatMessage) {
        showNotification('Please type a reply');
        return;
    }

    const allMessages = JSON.parse(localStorage.getItem('metraChatMessages') || '[]');
    const userChats = JSON.parse(localStorage.getItem('metraUserChats_' + selectedChatMessage.userId) || '[]');
    
    // Find and update the message with admin reply
    const messageIndex = userChats.findIndex(m => m.id == selectedChatMessage.messageId);
    if (messageIndex > -1) {
        userChats[messageIndex].adminReply = replyText;
        userChats[messageIndex].status = 'read';
        userChats[messageIndex].replyTimestamp = new Date().toISOString();
        
        // Update in main chat storage
        const mainIndex = allMessages.findIndex(m => m.id == selectedChatMessage.messageId);
        if (mainIndex > -1) {
            allMessages[mainIndex].adminReply = replyText;
            allMessages[mainIndex].status = 'read';
        }
        
        localStorage.setItem('metraUserChats_' + selectedChatMessage.userId, JSON.stringify(userChats));
        localStorage.setItem('metraChatMessages', JSON.stringify(allMessages));
        
        showNotification('Reply sent successfully!');
        document.getElementById('chatReplySection').style.display = 'none';
        selectedChatMessage = null;
        loadSupportChats();
    }
}

// Delete Chat Message
function deleteChatMessage(userId) {
    if (confirm('Delete all chat messages from this user?')) {
        localStorage.removeItem('metraUserChats_' + userId);
        
        // Remove from main chat storage
        const allMessages = JSON.parse(localStorage.getItem('metraChatMessages') || '[]');
        const filtered = allMessages.filter(m => m.userId != userId);
        localStorage.setItem('metraChatMessages', JSON.stringify(filtered));
        
        loadSupportChats();
        showNotification('Chat messages deleted');
    }
}

// Auto-refresh chat messages every 30 seconds
setInterval(() => {
    if (document.getElementById('supportSection') && document.getElementById('supportSection').classList.contains('active')) {
        loadSupportChats();
    }
}, 30000);
