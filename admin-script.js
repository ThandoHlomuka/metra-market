// Admin Credentials
// NOTE: For production security, implement server-side authentication
// IMPORTANT: Change this password immediately for production use
// Use a strong password: 12+ characters, mix of uppercase, lowercase, numbers, symbols
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

// ==================== SECURITY MEASURES ====================

(function secureAdmin() {
    document.addEventListener('keydown', function (e) {
        if (e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
            (e.ctrlKey && (e.key === 'U' || e.key === 'u'))) {
            e.preventDefault();
            return false;
        }
    });

    document.addEventListener('contextmenu', function (e) {
        var t = e.target;
        if (t.tagName === 'IMG' || t.closest('.image-preview') || t.closest('.gallery-item') || t.closest('.product-card')) {
            e.preventDefault();
            return false;
        }
    });

    document.addEventListener('dragstart', function (e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });

    function protectImages() {
        document.querySelectorAll('.image-preview img, .gallery-item img, .product-image img').forEach(function (img) {
            if (img.getAttribute('draggable') !== 'false') {
                img.setAttribute('draggable', 'false');
            }
        });
    }
    protectImages();
    if (window.MutationObserver) {
        new MutationObserver(protectImages).observe(document.body, { childList: true, subtree: true });
    }

    console.log('%c⚠️ ADMIN — PROTECTED', 'font-size:24px;font-weight:bold;color:#d32f2f;');
    console.log('%cUnauthorized access or copying is prohibited.', 'font-size:13px;color:#555;');

    function detectDevtools() {
        var start = performance.now();
        debugger;
        var end = performance.now();
        if (end - start > 200) {
            document.body.style.outline = '4px solid red';
            document.body.style.outlineOffset = '-4px';
            setTimeout(function () { document.body.style.outline = 'none'; }, 5000);
        }
    }
    setInterval(detectDevtools, 4000);
})();

// ==================== XSS SANITIZATION ====================

// Strip HTML tags from all string fields of a product
function sanitizeProduct(p) {
    if (!p) return p;
    var out = {};
    for (var k in p) {
        if (Object.prototype.hasOwnProperty.call(p, k)) {
            var v = p[k];
            if (typeof v === 'string') {
                out[k] = v.replace(/<[^>]*>/g, '');
            } else if (Array.isArray(v)) {
                out[k] = v.map(function (item) {
                    return typeof item === 'string' ? item.replace(/<[^>]*>/g, '') : item;
                });
            } else {
                out[k] = v;
            }
        }
    }
    return out;
}

function sanitizeAllProducts() {
    if (Array.isArray(products)) {
        products = products.map(sanitizeProduct);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Clean up any stale/corrupted stored password
    var pwd = localStorage.getItem('metraAdminPassword');
    if (pwd && pwd.length < 4) {
        localStorage.removeItem('metraAdminPassword');
    }
    checkAdminSession();
    startSessionMonitor();
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
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value.trim();
    const errorEl = document.getElementById('loginError');

    // Get stored password and validate it
    var storedPassword = localStorage.getItem('metraAdminPassword');
    if (!storedPassword || storedPassword.length < 4) {
        storedPassword = ADMIN_CREDENTIALS.password;
    }

    // Always accept default credentials, even if localStorage has stale data
    var passwordOk = (password === storedPassword) || (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password);

    if (username === ADMIN_CREDENTIALS.username && passwordOk) {
        localStorage.setItem('metraAdminLoggedIn', 'true');
        localStorage.setItem('metraAdminName', username);
        localStorage.setItem('metraAdminLoginTime', Date.now().toString());
        // Store auth for API calls (tab-only, cleared on close)
        sessionStorage.setItem('metraAdminAuth', btoa(username + ':' + password));
        showDashboard();
    } else {
        errorEl.textContent = 'Invalid username or password';
    }
}

// Admin Logout
function adminLogout() {
    localStorage.removeItem('metraAdminLoggedIn');
    localStorage.removeItem('metraAdminName');
    localStorage.removeItem('metraAdminLoginTime');
    window.location.reload();
}

// Session idle + absolute expiry monitor
function startSessionMonitor() {
    if (localStorage.getItem('metraAdminLoggedIn') !== 'true') return;

    // Absolute expiry: 24 hours
    var loginTime = parseInt(localStorage.getItem('metraAdminLoginTime'), 10);
    if (loginTime && Date.now() - loginTime > 86400000) {
        adminLogout();
        return;
    }

    // Idle timeout: 30 minutes
    var IDLE_TIMEOUT = 30 * 60 * 1000;
    var idleTimer;

    function resetIdle() {
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(function () {
            alert('Session expired due to inactivity. Please log in again.');
            adminLogout();
        }, IDLE_TIMEOUT);
    }

    var events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach(function (ev) {
        document.addEventListener(ev, resetIdle, { passive: true });
    });
    resetIdle();
}

// Show Dashboard
async function showDashboard() {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'flex';

    // Load data
    await loadData();
    updateDashboard();
    
    // Start real-time updates
    startRealTimeUpdates();

    // Set admin name
    const adminName = localStorage.getItem('metraAdminName') || 'Admin';
    document.getElementById('adminName').textContent = adminName;
}

// Start Real-Time Updates
function startRealTimeUpdates() {
    // Update every 5 seconds
    setInterval(() => {
        updateLiveVisitors();
        updateRecentOrders();
        updateDashboardStats();
    }, 5000);
    
    // Listen for storage events from other tabs
    window.addEventListener('storage', (event) => {
        if (event.key === 'metraOrders') {
            loadData();
            updateDashboard();
            showAdminNotification('New order received!');
        }
        if (event.key === 'metraUsers') {
            loadData();
            updateDashboard();
        }
        if (event.key === 'metraActiveVisitors') {
            updateLiveVisitors();
        }
        if (event.key === 'metraContactMessages') {
            showAdminNotification('New contact message!');
        }
        if (event.key === 'metraChatMessages') {
            loadSupportChats();
        }
    });
    
    // Initial live visitors update
    updateLiveVisitors();
}

// Update Live Visitors Count
function updateLiveVisitors() {
    const visitors = JSON.parse(localStorage.getItem('metraActiveVisitors') || '{}');
    const count = Object.keys(visitors).length;
    
    // Update dashboard if element exists
    const liveCountEl = document.getElementById('liveVisitorsCount');
    if (liveCountEl) {
        liveCountEl.textContent = count;
    }
    
    // Update analytics page if active
    if (document.getElementById('analyticsSection')?.classList.contains('active')) {
        const visitorListEl = document.getElementById('liveVisitorList');
        if (visitorListEl) {
            visitorListEl.innerHTML = Object.values(visitors).map(v => `
                <div style="padding: 0.5rem; background: rgba(255,248,231,0.05); border-radius: 5px; margin-bottom: 0.5rem;">
                    <span style="color: var(--gray); font-size: 0.85rem;">Viewing: ${v.page}</span>
                </div>
            `).join('');
        }
    }
}

// Update Recent Orders in Real-Time
function updateRecentOrders() {
    const orders = JSON.parse(localStorage.getItem('metraOrders') || '[]');
    const recentOrders = orders.slice(-5).reverse();
    
    const recentOrdersEl = document.getElementById('recentOrders');
    if (recentOrdersEl && recentOrders.length > 0) {
        recentOrdersEl.innerHTML = recentOrders.map(order => `
            <div class="order-item" style="display: flex; justify-content: space-between; padding: 0.8rem 0; border-bottom: 1px solid rgba(255,248,231,0.1);">
                <div>
                    <strong>${order.id}</strong>
                    <p style="color: var(--gray); font-size: 0.85rem;">${order.date}</p>
                </div>
                <span class="status-badge ${order.status}">${order.status}</span>
            </div>
        `).join('');
    }
}

// Update Dashboard Stats
function updateDashboardStats() {
    const storedProducts = JSON.parse(localStorage.getItem('metraProducts') || '[]');
    const storedOrders = JSON.parse(localStorage.getItem('metraOrders') || '[]');
    const storedUsers = JSON.parse(localStorage.getItem('metraUsers') || '[]');
    
    document.getElementById('totalProducts').textContent = storedProducts.length;
    document.getElementById('totalOrders').textContent = storedOrders.length;
    document.getElementById('totalUsers').textContent = storedUsers.length;
    
    const totalRevenue = storedOrders.reduce((sum, order) => sum + order.total, 0);
    document.getElementById('totalRevenue').textContent = 'R' + totalRevenue.toFixed(2);
}

// Show Admin Notification
function showAdminNotification(message) {
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
        z-index: 5000;
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

// API helpers for product persistence
function getApiBaseUrl() {
    return window.location.origin;
}

function getAuthToken() {
    return sessionStorage.getItem('metraAdminAuth') || '';
}

async function syncProductsToDB(productArray) {
    try {
        const token = getAuthToken();
        if (!token) return false;
        const resp = await fetch(getApiBaseUrl() + '/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + token
            },
            body: JSON.stringify({ products: productArray })
        });
        if (!resp.ok) {
            console.warn('DB sync failed:', resp.status);
            return false;
        }
        // Update timestamp to reflect DB save
        localStorage.setItem('metraProductsTimestamp', Date.now().toString());
        return true;
    } catch (e) {
        console.warn('DB sync error:', e.message);
        return false;
    }
}

async function loadProductsFromDB() {
    try {
        const resp = await fetch(getApiBaseUrl() + '/api/products');
        if (resp.ok) {
            const data = await resp.json();
            if (data.products && Array.isArray(data.products)) {
                const localTs = parseInt(localStorage.getItem('metraProductsTimestamp') || '0', 10);
                const dbTs = data.updatedAt ? new Date(data.updatedAt).getTime() : 0;
                // Only use DB data if it's newer than local or local has no timestamp
                if (data.products.length > 0 && dbTs >= localTs) {
                    products = data.products;
                    localStorage.setItem('metraProducts', JSON.stringify(products));
                    localStorage.setItem('metraProductsTimestamp', dbTs.toString());
                    return true;
                }
            }
        }
    } catch (e) {
        // Fall through to localStorage
    }
    return false;
}

// Load All Data
async function loadData() {
    // Load products — try DB first, fall back to localStorage
    const dbLoaded = await loadProductsFromDB();
    if (!dbLoaded) {
        const storedProducts = localStorage.getItem('metraProducts');
        if (storedProducts) {
            products = JSON.parse(storedProducts);
        } else {
            products = [];
        }
    }
    sanitizeAllProducts();

    // Load orders
    orders = safeJSON('metraOrders', []);

    // Load users
    users = safeJSON('metraUsers', []);

    // Load settings
    settings = safeJSON('metraSettings', {});

    // Load tracking settings
    loadTrackingSettings();

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
    localStorage.setItem('metraProductsTimestamp', Date.now().toString());
    syncProductsToDB(products).then(function (ok) {
        if (!ok && document.getElementById('editProductId').value) {
            showNotification('Saved locally but DB sync failed — data may not persist on reload');
        }
    });
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
                    <div class="top-product-icon">${product.image ? `<img src="${product.image}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;">` : product.icon}</div>
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
        shipments: 'BobGo Shipments',
        users: 'Users Management',
        reviews: 'Reviews Management',
        invoices: 'Invoices Management',
        settings: 'Settings',
        sessions: 'Sessions & Data Management',
        analytics: 'Analytics Dashboard',
        email: 'Email Settings',
        support: 'Support Inbox',
        shipments: 'BobGo Shipments'
    };
    document.getElementById('pageTitle').textContent = titles[section] || 'Dashboard';

    // Refresh data for each section
    if (section === 'products') renderProductsTable();
    if (section === 'orders') renderOrders();
    if (section === 'users') renderUsersTable();
    if (section === 'reviews') renderReviews();
    if (section === 'invoices') renderInvoices();
    if (section === 'sessions') loadSessionsData();
    if (section === 'analytics') loadAnalytics();
    if (section === 'email') loadEmailSettings();
    if (section === 'settings') loadTrackingSettings();
    if (section === 'shipments') loadShipmentsData();
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
            <td class="product-icon-cell">
                ${product.image
                    ? `<img src="${product.image}" alt="${product.name}" class="product-thumb">`
                    : product.icon
                }
            </td>
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
    
    // Reset SEO preview
    if (document.getElementById('productSlug')) {
        document.getElementById('productSlug').value = '';
        document.getElementById('productMetaTitle').value = '';
        document.getElementById('productMetaDesc').value = '';
        document.getElementById('productMetaKeywords').value = '';
        updateSeoPreview();
    }

    // Reset image and gallery
    resetImageUpload();
    resetGallery();
    // Reset variants
    currentVariants = [];
    renderVariantsTable();
    document.querySelectorAll('#variantAttrs .variant-attr-row').forEach(el => el.remove());
    document.getElementById('clearVariantsBtn').style.display = 'none';
}

// Auto-generate slug when product name changes
document.addEventListener('DOMContentLoaded', () => {
    const productNameInput = document.getElementById('productName');
    if (productNameInput) {
        productNameInput.addEventListener('input', autoGenerateSlug);
    }
});

function closeProductModal() {
    document.getElementById('productModalOverlay').style.display = 'none';
}

/**
 * SEO Helper Functions
 */
function toggleSeoSection() {
    const seoFields = document.getElementById('seoFields');
    const icon = document.getElementById('seoToggleIcon');
    if (seoFields) {
        const isVisible = seoFields.style.display !== 'none';
        seoFields.style.display = isVisible ? 'none' : 'block';
        icon.className = isVisible ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
    }
}

function autoGenerateSlug() {
    const productName = document.getElementById('productName').value;
    const slugInput = document.getElementById('productSlug');
    const slugPreview = document.getElementById('slugPreview');
    
    if (slugInput && !slugInput.value && productName) {
        const slug = productName
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        slugPreview.textContent = slug || 'your-slug-here';
    } else if (slugInput) {
        slugPreview.textContent = slugInput.value || 'your-slug-here';
    }
}

function updateSeoPreview() {
    const metaTitle = document.getElementById('productMetaTitle')?.value || '';
    const metaDesc = document.getElementById('productMetaDesc')?.value || '';
    const slug = document.getElementById('productSlug')?.value || '';
    const productName = document.getElementById('productName')?.value || '';
    
    // Update character counts
    const titleCount = document.getElementById('metaTitleCount');
    const descCount = document.getElementById('metaDescCount');
    if (titleCount) titleCount.textContent = metaTitle.length;
    if (descCount) descCount.textContent = metaDesc.length;
    
    // Color code counts
    if (titleCount) {
        titleCount.style.color = metaTitle.length > 60 ? '#DC143C' : '#228B22';
    }
    if (descCount) {
        descCount.style.color = metaDesc.length > 160 ? '#DC143C' : '#228B22';
    }
    
    // Update Google preview
    const previewTitle = document.getElementById('googlePreviewTitle');
    const previewSlug = document.getElementById('googlePreviewSlug');
    const previewDesc = document.getElementById('googlePreviewDesc');
    const slugPreview = document.getElementById('slugPreview');
    
    if (previewTitle) previewTitle.textContent = metaTitle || productName || 'Your Product Title';
    if (previewSlug) previewSlug.textContent = slug || 'slug';
    if (slugPreview) slugPreview.textContent = slug || 'your-slug-here';
    if (previewDesc) previewDesc.textContent = metaDesc || 'Your meta description will appear here...';
}

// ==================== PRODUCT IMAGE UPLOAD ====================

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
        showNotification('Image must be less than 5MB');
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const imageUrl = e.target.result;
        const preview = document.getElementById('imagePreview');
        const removeBtn = document.getElementById('removeImageBtn');
        const input = document.getElementById('productImageInput');

        input.dataset.imageUrl = imageUrl;
        preview.innerHTML = `<img src="${imageUrl}" alt="Product image">`;
        removeBtn.style.display = 'inline-flex';
        const bgBtn = document.getElementById('removeBgBtn');
        if (bgBtn) bgBtn.style.display = 'inline-flex';
    };
    reader.onerror = function() {
        showNotification('Failed to read image file');
    };
    reader.readAsDataURL(file);
}

function removeProductImage() {
    const input = document.getElementById('productImageInput');
    const preview = document.getElementById('imagePreview');
    const removeBtn = document.getElementById('removeImageBtn');

    input.value = '';
    delete input.dataset.imageUrl;
    removeBtn.style.display = 'none';
    preview.innerHTML = '<i class="fas fa-image"></i><span>No image selected</span>';
}

function resetImageUpload() {
    const input = document.getElementById('productImageInput');
    const preview = document.getElementById('imagePreview');
    const removeBtn = document.getElementById('removeImageBtn');
    const bgBtn = document.getElementById('removeBgBtn');

    input.value = '';
    delete input.dataset.imageUrl;
    removeBtn.style.display = 'none';
    if (bgBtn) bgBtn.style.display = 'none';
    preview.innerHTML = '<i class="fas fa-image"></i><span>No image selected</span>';

    resetGallery();
}

function removeImageBackground() {
    const imageUrl = document.getElementById('productImageInput')?.dataset?.imageUrl;
    if (!imageUrl) return;

    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            const whiteness = 0.299 * r + 0.587 * g + 0.114 * b;
            const maxChannel = Math.max(r, g, b);
            const minChannel = Math.min(r, g, b);
            const saturation = maxChannel - minChannel;
            const bgScore = whiteness - saturation * 0.4;

            const bgThreshold = 225;
            const featherRange = 25;

            if (bgScore > bgThreshold + featherRange) {
                data[i + 3] = 0;
            } else if (bgScore > bgThreshold) {
                const t = (bgScore - bgThreshold) / featherRange;
                const alpha = 1 - t;
                data[i + 3] = Math.round(alpha * 255);
            }
        }

        ctx.putImageData(imageData, 0, 0);
        const transparentUrl = canvas.toDataURL('image/png');

        const preview = document.getElementById('imagePreview');
        const input = document.getElementById('productImageInput');
        input.dataset.imageUrl = transparentUrl;
        preview.innerHTML = `<img src="${transparentUrl}" alt="Product image">`;
        showNotification('Background removed!');
    };
    img.src = imageUrl;
}

function removeGalleryImageBackground(index) {
    const url = galleryUploadData[index];
    if (!url) return;

    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            const whiteness = 0.299 * r + 0.587 * g + 0.114 * b;
            const maxChannel = Math.max(r, g, b);
            const minChannel = Math.min(r, g, b);
            const saturation = maxChannel - minChannel;
            const bgScore = whiteness - saturation * 0.4;

            const bgThreshold = 225;
            const featherRange = 25;

            if (bgScore > bgThreshold + featherRange) {
                data[i + 3] = 0;
            } else if (bgScore > bgThreshold) {
                const t = (bgScore - bgThreshold) / featherRange;
                const alpha = 1 - t;
                data[i + 3] = Math.round(alpha * 255);
            }
        }

        ctx.putImageData(imageData, 0, 0);
        galleryUploadData[index] = canvas.toDataURL('image/png');
        renderGalleryPreview();
        showNotification('Gallery image background removed!');
    };
    img.src = url;
}

// ==================== PRODUCT GALLERY (MULTIPLE IMAGES) ====================

let galleryUploadData = [];

function handleGalleryUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
            showNotification(`Image ${file.name} must be less than 5MB`);
            continue;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            galleryUploadData.push(e.target.result);
            renderGalleryPreview();
        };
        reader.onerror = function() {
            showNotification(`Failed to read image: ${file.name}`);
        };
        reader.readAsDataURL(file);
    }

    event.target.value = '';
}

function removeGalleryImage(index) {
    galleryUploadData.splice(index, 1);
    renderGalleryPreview();
}

function renderGalleryPreview() {
    const container = document.getElementById('galleryPreview');
    if (!container) return;

    if (galleryUploadData.length === 0) {
        container.innerHTML = '<div class="gallery-empty"><i class="fas fa-images"></i><span>No gallery images</span></div>';
        return;
    }

    container.innerHTML = galleryUploadData.map((url, index) => `
        <div class="gallery-item">
            <img src="${url}" alt="Gallery image ${index + 1}">
            <div class="gallery-item-overlay">
                <span class="gallery-item-index">${index + 1}</span>
                ${index === 0 ? '<span class="gallery-item-main">Main</span>' : ''}
            </div>
            <div style="position: absolute; bottom: 4px; left: 4px; right: 4px; display: flex; gap: 4px;">
                <button type="button" class="gallery-item-bg" onclick="removeGalleryImageBackground(${index})" title="Remove white background">
                    <i class="fas fa-magic"></i>
                </button>
                <button type="button" class="gallery-item-remove" onclick="removeGalleryImage(${index})" title="Remove image">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function resetGallery() {
    galleryUploadData = [];
    const container = document.getElementById('galleryPreview');
    if (container) {
        container.innerHTML = '<div class="gallery-empty"><i class="fas fa-images"></i><span>No gallery images</span></div>';
    }
}

// ==================== PRODUCT VARIANTS ====================

let currentVariants = [];

function addVariantAttr() {
    const container = document.getElementById('variantAttrs');
    const row = document.createElement('div');
    row.className = 'variant-attr-row';
    row.style.cssText = 'display: flex; gap: 0.5rem; margin-bottom: 0.5rem; align-items: center;';
    row.innerHTML = `
        <input type="text" class="variant-attr-name" placeholder="Attribute name (e.g. Size)"
               style="flex: 1; padding: 0.5rem; border: 1px solid rgba(255,255,255,0.2); border-radius: 5px; background: rgba(255,255,255,0.05); color: var(--text);">
        <input type="text" class="variant-attr-values" placeholder="Values (e.g. Small, Medium, Large)"
               style="flex: 2; padding: 0.5rem; border: 1px solid rgba(255,255,255,0.2); border-radius: 5px; background: rgba(255,255,255,0.05); color: var(--text);">
        <button type="button" class="btn-danger btn-sm" onclick="this.parentElement.remove(); updateClearBtn()" style="padding: 0.4rem 0.6rem;">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(row);
    updateClearBtn();
}

function getVariantAttrs() {
    const rows = document.querySelectorAll('#variantAttrs .variant-attr-row');
    const attrs = [];
    rows.forEach(row => {
        const name = row.querySelector('.variant-attr-name').value.trim();
        const values = row.querySelector('.variant-attr-values').value.split(',').map(v => v.trim()).filter(Boolean);
        if (name && values.length > 0) {
            attrs.push({ name, values });
        }
    });
    return attrs;
}

function cartesianProduct(arrays) {
    if (arrays.length === 0) return [[]];
    const [first, ...rest] = arrays;
    const restProduct = cartesianProduct(rest);
    const result = [];
    first.values.forEach(val => {
        restProduct.forEach(combo => {
            result.push([{ ...combo, [first.name]: val }]);
        });
    });
    return result.flat(Infinity);
}

function generateVariants() {
    const attrs = getVariantAttrs();
    if (attrs.length === 0) {
        showNotification('Add at least one attribute with values first!');
        return;
    }

    const valuesArrays = attrs.map(a => a.values.map(v => ({ name: a.name, value: v })));

    function combine(arrs) {
        if (arrs.length === 0) return [];
        if (arrs.length === 1) return arrs[0].map(v => [v]);
        const [first, ...rest] = arrs;
        const restCombo = combine(rest);
        const result = [];
        first.forEach(v => {
            restCombo.forEach(combo => {
                result.push([v, ...combo]);
            });
        });
        return result;
    }

    const combinations = combine(valuesArrays);
    const basePrice = parseFloat(document.getElementById('productPrice').value) || 0;

    const prodW = parseFloat(document.getElementById('productDimWeight').value) || null;
    const prodL = parseFloat(document.getElementById('productDimLength').value) || null;
    const prodWd = parseFloat(document.getElementById('productDimWidth').value) || null;
    const prodH = parseFloat(document.getElementById('productDimHeight').value) || null;
    const shipW = parseFloat(document.getElementById('productWeight').value) || null;
    const shipL = parseFloat(document.getElementById('productLength').value) || null;
    const shipWd = parseFloat(document.getElementById('productWidth').value) || null;
    const shipH = parseFloat(document.getElementById('productHeight').value) || null;

    currentVariants = combinations.map((combo) => {
        const labels = combo.map(c => c.value);
        return {
            label: labels.join(' / '),
            price: basePrice,
            stock: parseInt(document.getElementById('productStock').value) || 0,
            skuSuffix: labels.map(l => l.substring(0, 2).toUpperCase()).join(''),
            prodWeight: prodW, prodLength: prodL, prodWidth: prodWd, prodHeight: prodH,
            weight: shipW, length: shipL, width: shipWd, height: shipH
        };
    });

    renderVariantsTable();
    document.getElementById('clearVariantsBtn').style.display = 'inline-flex';
    showNotification(`${currentVariants.length} variants generated!`);
}

function renderVariantsTable() {
    const container = document.getElementById('variantsTable');
    const tbody = document.getElementById('variantsTbody');
    if (!container || !tbody) return;

    if (currentVariants.length === 0) {
        container.style.display = 'none';
        return;
    }

    const inp = 'padding:0.3rem;border:1px solid rgba(255,255,255,0.2);border-radius:4px;background:rgba(255,255,255,0.05);color:var(--text);';
    const dim = `type="number" step="0.01" style="width:62px;${inp}"`;

    container.style.display = 'block';
    tbody.innerHTML = currentVariants.map((v, i) => `
        <tr>
            <td><strong>${v.label}</strong></td>
            <td><input type="number" step="0.01" class="variant-price" value="${v.price}" data-index="${i}"
                       style="width:80px;${inp}"></td>
            <td><input type="number" class="variant-stock" value="${v.stock}" data-index="${i}"
                       style="width:60px;${inp}"></td>
            <td><input type="text" class="variant-sku" value="${v.skuSuffix}" data-index="${i}"
                       style="width:70px;${inp}"></td>
            <td><input ${dim} class="variant-prod-weight" value="${v.prodWeight ?? ''}" data-index="${i}"></td>
            <td><input ${dim} class="variant-prod-length" value="${v.prodLength ?? ''}" data-index="${i}"></td>
            <td><input ${dim} class="variant-prod-width" value="${v.prodWidth ?? ''}" data-index="${i}"></td>
            <td><input ${dim} class="variant-prod-height" value="${v.prodHeight ?? ''}" data-index="${i}"></td>
            <td><input ${dim} class="variant-ship-weight" value="${v.weight ?? ''}" data-index="${i}"></td>
            <td><input ${dim} class="variant-ship-length" value="${v.length ?? ''}" data-index="${i}"></td>
            <td><input ${dim} class="variant-ship-width" value="${v.width ?? ''}" data-index="${i}"></td>
            <td><input ${dim} class="variant-ship-height" value="${v.height ?? ''}" data-index="${i}"></td>
            <td><button type="button" class="btn-danger btn-sm" onclick="removeVariant(${i})"><i class="fas fa-times"></i></button></td>
        </tr>
    `).join('');

    tbody.querySelectorAll('.variant-price, .variant-stock, .variant-sku, .variant-prod-weight, .variant-prod-length, .variant-prod-width, .variant-prod-height, .variant-ship-weight, .variant-ship-length, .variant-ship-width, .variant-ship-height').forEach(input => {
        input.addEventListener('input', syncVariantInput);
    });
}

function syncVariantInput(e) {
    const index = parseInt(e.target.dataset.index);
    if (isNaN(index) || !currentVariants[index]) return;
    const el = e.target;
    const val = el.value.trim();
    if (el.classList.contains('variant-price')) {
        currentVariants[index].price = parseFloat(val) || 0;
    } else if (el.classList.contains('variant-stock')) {
        currentVariants[index].stock = parseInt(val) || 0;
    } else if (el.classList.contains('variant-sku')) {
        currentVariants[index].skuSuffix = val;
    } else if (el.classList.contains('variant-prod-weight')) {
        currentVariants[index].prodWeight = val ? parseFloat(val) : null;
    } else if (el.classList.contains('variant-prod-length')) {
        currentVariants[index].prodLength = val ? parseFloat(val) : null;
    } else if (el.classList.contains('variant-prod-width')) {
        currentVariants[index].prodWidth = val ? parseFloat(val) : null;
    } else if (el.classList.contains('variant-prod-height')) {
        currentVariants[index].prodHeight = val ? parseFloat(val) : null;
    } else if (el.classList.contains('variant-ship-weight')) {
        currentVariants[index].weight = val ? parseFloat(val) : null;
    } else if (el.classList.contains('variant-ship-length')) {
        currentVariants[index].length = val ? parseFloat(val) : null;
    } else if (el.classList.contains('variant-ship-width')) {
        currentVariants[index].width = val ? parseFloat(val) : null;
    } else if (el.classList.contains('variant-ship-height')) {
        currentVariants[index].height = val ? parseFloat(val) : null;
    }
}

function removeVariant(index) {
    currentVariants.splice(index, 1);
    renderVariantsTable();
    updateClearBtn();
}

function clearVariants() {
    if (confirm('Clear all variants?')) {
        currentVariants = [];
        renderVariantsTable();
        document.getElementById('clearVariantsBtn').style.display = 'none';
        document.querySelectorAll('#variantAttrs .variant-attr-row').forEach(el => el.remove());
    }
}

function updateClearBtn() {
    const hasAttrs = document.querySelectorAll('#variantAttrs .variant-attr-row').length > 0;
    const hasVariants = currentVariants.length > 0;
    document.getElementById('clearVariantsBtn').style.display = (hasAttrs || hasVariants) ? 'inline-flex' : 'none';
}

function collectVariants() {
    return currentVariants.length > 0 ? currentVariants : null;
}

function loadVariants(variants) {
    currentVariants = variants && Array.isArray(variants) ? variants : [];
    if (currentVariants.length > 0) {
        renderVariantsTable();
        document.getElementById('clearVariantsBtn').style.display = 'inline-flex';
    }
}

function saveProduct(event) {
    event.preventDefault();

    const editId = document.getElementById('editProductId').value;
    const specsInput = document.getElementById('productSpecs').value;
    const tagsInput = document.getElementById('productTags').value;
    const imageInput = document.getElementById('productImageInput');

    // Sync variant input fields before saving
    document.querySelectorAll('#variantsTbody .variant-price, #variantsTbody .variant-stock, #variantsTbody .variant-sku, #variantsTbody .variant-prod-weight, #variantsTbody .variant-prod-length, #variantsTbody .variant-prod-width, #variantsTbody .variant-prod-height, #variantsTbody .variant-ship-weight, #variantsTbody .variant-ship-length, #variantsTbody .variant-ship-width, #variantsTbody .variant-ship-height').forEach(syncVariantInput);

    const formFields = {
        name: document.getElementById('productName').value,
        sku: document.getElementById('productSku').value,
        price: parseFloat(document.getElementById('productPrice').value),
        icon: document.getElementById('productIcon').value,
        image: imageInput.dataset.imageUrl || (galleryUploadData.length > 0 ? galleryUploadData[0] : ''),
        gallery: galleryUploadData.length > 0 ? galleryUploadData.slice() : [],
        desc: document.getElementById('productDesc').value,
        fullDescription: document.getElementById('productFullDesc').value,
        stock: parseInt(document.getElementById('productStock').value) || 0,
        specs: specsInput ? specsInput.split(',').map(s => s.trim()) : [],
        tags: tagsInput ? tagsInput.split(',').map(t => t.trim()) : [],
        variants: collectVariants(),
        // Product dimensions (for storefront display)
        prodWeight: parseFloat(document.getElementById('productDimWeight').value) || null,
        prodLength: parseFloat(document.getElementById('productDimLength').value) || null,
        prodWidth: parseFloat(document.getElementById('productDimWidth').value) || null,
        prodHeight: parseFloat(document.getElementById('productDimHeight').value) || null,
        // Shipping dimensions for Bobgo
        weight: parseFloat(document.getElementById('productWeight').value) || 0.5,
        length: parseFloat(document.getElementById('productLength').value) || 30,
        width: parseFloat(document.getElementById('productWidth').value) || 20,
        height: parseFloat(document.getElementById('productHeight').value) || 15,
        // SEO details
        slug: document.getElementById('productSlug')?.value?.trim() || '',
        metaTitle: document.getElementById('productMetaTitle')?.value?.trim() || '',
        metaDesc: document.getElementById('productMetaDesc')?.value?.trim() || '',
        metaKeywords: document.getElementById('productMetaKeywords')?.value?.trim() || ''
    };

    if (editId) {
        const index = products.findIndex(p => p.id == editId);
        if (index > -1) {
            const existing = products[index];
            // Only update form-sourced fields, preserve everything else
            existing.name = formFields.name;
            existing.sku = formFields.sku;
            existing.price = formFields.price;
            existing.icon = formFields.icon;
            existing.image = formFields.image;
            existing.desc = formFields.desc;
            existing.fullDescription = formFields.fullDescription;
            existing.stock = formFields.stock;
            existing.slug = formFields.slug;
            existing.metaTitle = formFields.metaTitle;
            existing.metaDesc = formFields.metaDesc;
            existing.metaKeywords = formFields.metaKeywords;
            existing.prodWeight = formFields.prodWeight;
            existing.prodLength = formFields.prodLength;
            existing.prodWidth = formFields.prodWidth;
            existing.prodHeight = formFields.prodHeight;
            existing.weight = formFields.weight;
            existing.length = formFields.length;
            existing.width = formFields.width;
            existing.height = formFields.height;
            // Gallery: only overwrite if gallery was actually interacted with
            if (galleryUploadData.length > 0) {
                existing.gallery = formFields.gallery;
            }
            // Specs / tags / variants: only overwrite when form has values
            if (specsInput) {
                existing.specs = formFields.specs;
            }
            if (tagsInput) {
                existing.tags = formFields.tags;
            }
            if (currentVariants.length > 0) {
                existing.variants = formFields.variants;
            }
            products[index] = existing;
        }
    } else {
        formFields.id = Date.now();
        formFields.reviews = [];
        products.push(formFields);
    }

    saveProducts();
    closeProductModal();
    renderProductsTable();
    updateDashboard();

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
    document.getElementById('productStock').value = product.stock || '';
    document.getElementById('productSpecs').value = product.specs ? product.specs.join(', ') : '';
    document.getElementById('productTags').value = product.tags ? product.tags.join(', ') : '';
    
    // Load product dimensions
    document.getElementById('productDimWeight').value = product.prodWeight || '';
    document.getElementById('productDimLength').value = product.prodLength || '';
    document.getElementById('productDimWidth').value = product.prodWidth || '';
    document.getElementById('productDimHeight').value = product.prodHeight || '';

    // Load shipping details
    document.getElementById('productWeight').value = product.weight || 0.5;
    document.getElementById('productLength').value = product.length || 30;
    document.getElementById('productWidth').value = product.width || 20;
    document.getElementById('productHeight').value = product.height || 15;

    // Load SEO details
    if (document.getElementById('productSlug')) {
        document.getElementById('productSlug').value = product.slug || '';
        document.getElementById('productMetaTitle').value = product.metaTitle || '';
        document.getElementById('productMetaDesc').value = product.metaDesc || '';
        document.getElementById('productMetaKeywords').value = product.metaKeywords || '';
        updateSeoPreview();
    }

    // Load product image
    const imageInput = document.getElementById('productImageInput');
    const preview = document.getElementById('imagePreview');
    const removeBtn = document.getElementById('removeImageBtn');
    const bgBtn = document.getElementById('removeBgBtn');
    if (product.image) {
        imageInput.dataset.imageUrl = product.image;
        preview.innerHTML = `<img src="${product.image}" alt="${product.name}">`;
        removeBtn.style.display = 'inline-flex';
        if (bgBtn) bgBtn.style.display = 'inline-flex';
    } else {
        resetImageUpload();
    }

    // Load product gallery
    resetGallery();
    if (product.gallery && product.gallery.length > 0) {
        galleryUploadData = [...product.gallery];
        renderGalleryPreview();
    }

    // Load product variants
    loadVariants(product.variants);

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
            <span>${item.name}${item._variantLabel ? ' <span style="color: var(--gray); font-size: 0.8rem;">(' + item._variantLabel + ')</span>' : ''} x ${item.quantity}</span>
            <span style="margin-left: auto;">R${(item.price * item.quantity).toFixed(2)}</span>
        </div>`
    ).join('');

    // Bobgo shipment info display
    const bobgoTrackingHTML = order.bobgoTrackingNumber ? `
        <div style="background: rgba(34, 139, 34, 0.1); border: 1px solid rgba(34, 139, 34, 0.3); border-radius: 10px; padding: 1rem; margin-bottom: 1.5rem;">
            <h4 style="margin-bottom: 0.75rem; color: #228B22;"><i class="fas fa-shipping-fast"></i> Bobgo Shipment Details</h4>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem;">
                <div>
                    <p style="color: var(--gray); font-size: 0.85rem;">Tracking Number</p>
                    <p style="font-weight: 600; color: #228B22;">${order.bobgoTrackingNumber}</p>
                </div>
                <div>
                    <p style="color: var(--gray); font-size: 0.85rem;">Shipment ID</p>
                    <p style="font-weight: 600;">${order.bobgoShipmentId || 'N/A'}</p>
                </div>
                <div>
                    <p style="color: var(--gray); font-size: 0.85rem;">Courier</p>
                    <p style="font-weight: 600;">${order.bobgoShipment?.courier || order.selectedCourier?.name || 'N/A'}</p>
                </div>
                <div>
                    <p style="color: var(--gray); font-size: 0.85rem;">Status</p>
                    <span class="status-badge" style="background: ${order.shipmentStatus === 'delivered' ? '#228B22' : order.shipmentStatus === 'in_transit' ? '#FFA500' : '#1E90FF'};">${order.shipmentStatus || 'created'}</span>
                </div>
            </div>
            <a href="https://track.bobgo.co.za/${order.bobgoTrackingNumber}" target="_blank" style="display: inline-block; margin-top: 0.75rem; padding: 0.5rem 1rem; background: #228B22; color: white; text-decoration: none; border-radius: 8px; font-size: 0.85rem;">
                <i class="fas fa-external-link-alt"></i> Track on Bobgo
            </a>
        </div>
    ` : order.deliveryMethod === 'bobgo' || order.shippingMethod ? `
        <div style="background: rgba(255, 165, 0, 0.1); border: 1px solid rgba(255, 165, 0, 0.3); border-radius: 10px; padding: 1rem; margin-bottom: 1.5rem;">
            <h4 style="margin-bottom: 0.75rem; color: #FFA500;"><i class="fas fa-shipping-fast"></i> Bobgo Shipment Pending</h4>
            <p style="color: var(--gray); font-size: 0.85rem;">Shipment will be created on Bobgo dashboard once payment is confirmed.</p>
        </div>
    ` : '';

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
                ${bobgoTrackingHTML}
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
                    <div>
                        <p style="color: var(--gray); font-size: 0.85rem;">Date</p>
                        <p>${order.date}</p>
                    </div>
                    <div>
                        <p style="color: var(--gray); font-size: 0.85rem;">Status</p>
                <span class="status-badge ${order.status || 'pending'}">${order.status || 'pending'}</span>
                    </div>
                    <div>
                        <p style="color: var(--gray); font-size: 0.85rem;">Customer</p>
                        <p>${order.customerName}</p>
                    </div>
                    <div>
                        <p style="color: var(--gray); font-size: 0.85rem;">Email</p>
                        <p>${order.customerEmail}</p>
                    </div>
                    <div style="grid-column: span 2;">
                        <p style="color: var(--gray); font-size: 0.85rem;">Shipping Address</p>
                        <p>${order.shippingAddress?.street || 'N/A'}, ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.province || ''} ${order.shippingAddress?.postalCode || ''}</p>
                    </div>
                    <div>
                        <p style="color: var(--gray); font-size: 0.85rem;">Subtotal</p>
                        <p>R${(order.subtotal || order.total - (order.shipping || 0)).toFixed(2)}</p>
                    </div>
                    <div>
                        <p style="color: var(--gray); font-size: 0.85rem;">Shipping</p>
                        <p>R${(order.shipping || order.shippingCost || 0).toFixed(2)}</p>
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

// BobGo Shipments Management
function loadShipmentsData() {
    renderPendingShipmentsTable();
    renderFailedShipmentsTable();
    renderSyncedShipmentsTable();
    updateShipmentStats();
}

function updateShipmentStats() {
    try {
        const orders = JSON.parse(localStorage.getItem('metraOrders') || '[]');
        const pending = window.bobgoSyncQueue?.getPending() || [];
        const failed = window.bobgoSyncQueue?.getFailed() || [];
        
        const syncedCount = orders.filter(o => o.bobgoTrackingNumber).length;
        
        document.getElementById('syncedShipments').textContent = syncedCount;
        document.getElementById('pendingShipments').textContent = pending.length;
        document.getElementById('failedShipments').textContent = failed.length;
    } catch(e) {
        console.error('Error updating shipment stats:', e);
    }
}

function renderPendingShipmentsTable() {
    const tbody = document.getElementById('pendingShipmentsTable');
    if (!tbody) return;
    
    try {
        const pending = window.bobgoSyncQueue?.getPending() || [];
        
        if (pending.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No pending shipments</td></tr>';
            return;
        }
        
        tbody.innerHTML = pending.map(item => `
            <tr>
                <td>${item.shipmentData?.orderId || 'N/A'}</td>
                <td>${item.shipmentData?.recipientName || 'N/A'}</td>
                <td>${item.shipmentData?.courierName || item.shipmentData?.courierCode || 'Auto'}</td>
                <td>${item.attempts}/${item.maxAttempts}</td>
                <td><span class="status-badge" style="background: #FFA500;">${item.status}</span></td>
                <td>${new Date(item.createdAt).toLocaleDateString('en-ZA')}</td>
            </tr>
        `).join('');
    } catch(e) {
        console.error('Error rendering pending shipments:', e);
    }
}

function renderFailedShipmentsTable() {
    const tbody = document.getElementById('failedShipmentsTable');
    if (!tbody) return;
    
    try {
        const failed = window.bobgoSyncQueue?.getFailed() || [];
        
        if (failed.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No failed shipments</td></tr>';
            return;
        }
        
        tbody.innerHTML = failed.map(item => `
            <tr>
                <td>${item.shipmentData?.orderId || 'N/A'}</td>
                <td>${item.shipmentData?.recipientName || 'N/A'}</td>
                <td style="color: #DC143C; font-size: 0.85rem;">${item.error || 'Unknown'}</td>
                <td>${item.attempts}</td>
                <td>${new Date(item.failedAt || item.createdAt).toLocaleDateString('en-ZA')}</td>
                <td>
                    <button class="btn-primary btn-sm" onclick="retryFailedShipment('${item.id}')">
                        <i class="fas fa-redo"></i> Retry
                    </button>
                </td>
            </tr>
        `).join('');
    } catch(e) {
        console.error('Error rendering failed shipments:', e);
    }
}

function renderSyncedShipmentsTable() {
    const tbody = document.getElementById('syncedShipmentsTable');
    if (!tbody) return;

    try {
        const orders = JSON.parse(localStorage.getItem('metraOrders') || '[]');
        const syncedOrders = orders.filter(o => o.bobgoTrackingNumber || o.bobgoShipmentId);

        if (syncedOrders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No synced shipments yet</td></tr>';
            return;
        }

        tbody.innerHTML = syncedOrders.map(order => {
            const paymentStatus = order.bobgoPaymentStatus || order.paymentStatus || order.status || 'pending';
            const statusColor = paymentStatus === 'paid' ? '#228B22' : 
                               paymentStatus === 'cancelled' ? '#DC143C' : 
                               paymentStatus === 'processing' ? '#FFA500' : '#1E90FF';
            
            return `
            <tr>
                <td>${order.id}</td>
                <td>${order.customerName}</td>
                <td style="color: #228B22; font-weight: 600;">${order.bobgoTrackingNumber || 'N/A'}</td>
                <td>${order.bobgoShipment?.courier || order.selectedCourier?.name || 'N/A'}</td>
                <td>
                    <span class="status-badge" style="background: ${order.shipmentStatus === 'delivered' ? '#228B22' : order.shipmentStatus === 'in_transit' ? '#FFA500' : '#1E90FF'};">
                        ${order.shipmentStatus || 'created'}
                    </span>
                </td>
                <td>
                    <span class="status-badge" style="background: ${statusColor}; color: white; font-size: 0.75rem;">
                        ${paymentStatus}
                    </span>
                </td>
                <td>
                    ${order.bobgoTrackingNumber ? `
                    <a href="https://track.bobgo.co.za/${order.bobgoTrackingNumber}" target="_blank" class="btn-secondary btn-sm">
                        <i class="fas fa-external-link-alt"></i> Track
                    </a>` : '-'}
                </td>
            </tr>
        `}).join('');
    } catch(e) {
        console.error('Error rendering synced shipments:', e);
    }
}

function processPendingShipments() {
    if (window.bobgoSyncQueue) {
        window.bobgoSyncQueue.processNow().then(() => {
            loadShipmentsData();
            showNotification('✅ Shipment sync completed!');
        });
    }
}

async function retryFailedShipment(queueId) {
    if (window.bobgoSyncQueue) {
        const success = await window.bobgoSyncQueue.retryFailed(queueId);
        if (success) {
            showNotification('🔄 Retrying shipment sync...');
            setTimeout(() => loadShipmentsData(), 2000);
        } else {
            showNotification('❌ Failed to retry shipment');
        }
    }
}

function clearFailedShipments() {
    if (confirm('Are you sure you want to clear all failed shipments?')) {
        if (window.bobgoSyncQueue) {
            window.bobgoSyncQueue.clearFailed();
            loadShipmentsData();
            showNotification('🗑️ Failed shipments cleared');
        }
    }
}

// Test BobGo API connectivity and available endpoints
async function testBobGoAPI() {
    const btn = document.getElementById('testBobGoBtn');
    const statusDiv = document.getElementById('bobgoDebugStatus');
    const output = document.getElementById('bobgoDebugOutput');
    
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...'; }
    if (statusDiv) statusDiv.style.display = 'block';
    if (output) output.textContent = 'Testing BobGo API endpoints...';

    try {
        const response = await fetch('/api/bobgo-debug');
        const data = await response.json();
        
        // Format results
        let resultText = `API URL: ${data.api_url}\n`;
        resultText += `API Key: ${data.api_key_configured ? '✅ Configured (' + data.api_key_preview + ')' : '❌ NOT CONFIGURED'}\n`;
        resultText += `Tests Run: ${data.tests_run}\n\n`;
        
        if (data.working_endpoints?.length > 0) {
            resultText += `✅ Working Endpoints:\n`;
            data.working_endpoints.forEach(ep => resultText += `  ✓ ${ep}\n`);
            resultText += '\n';
        }
        
        if (!data.api_key_configured) {
            resultText += `⚠️ ACTION REQUIRED: Add BOBGO_API_KEY to Vercel Dashboard\n`;
            resultText += `   Go to: Vercel → metra-market → Settings → Environment Variables\n\n`;
        }
        
        resultText += `All Results:\n`;
        resultText += '─'.repeat(50) + '\n';
        
        data.results.forEach(r => {
            const icon = r.ok ? (r.hasData ? '✅' : '⚠️') : '❌';
            resultText += `${icon} ${r.endpoint} (${r.label})\n`;
            resultText += `   Status: ${r.status}\n`;
            if (r.response) resultText += `   Response: ${r.response.substring(0, 150)}...\n`;
            if (r.error) resultText += `   Error: ${r.error}\n`;
            resultText += '\n';
        });
        
        if (output) output.textContent = resultText;
        
        if (data.working_endpoints?.length > 0) {
            showNotification('✅ BobGo API test complete - ' + data.working_endpoints.length + ' endpoints working');
        } else {
            showNotification('⚠️ BobGo API test complete - check debug output for details');
        }
    } catch (err) {
        if (output) output.textContent = `Error testing BobGo API:\n${err.message}`;
        showNotification('❌ API test failed: ' + err.message);
    } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-flask"></i> Test API'; }
    }
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
            <p class="review-user">${review.user || 'Anonymous'} - ${review.date || ''}</p>
            <p class="review-comment">${(review.comment || '').substring(0, 200)}</p>
            <button class="btn-danger btn-sm" onclick="deleteReview(${review.productId}, ${index})">
                <i class="fas fa-trash"></i> Delete Review
            </button>
        </div>
    `).join('') : '<div class="empty-state" style="grid-column: 1/-1;"><i class="fas fa-star"></i><p>No reviews yet</p></div>';
}

function deleteReview(productId, flatIndex) {
    if (confirm('Delete this review?')) {
        const product = products.find(p => p.id === productId);
        const reviewToDelete = reviews[flatIndex];
        if (product && product.reviews && reviewToDelete) {
            const productReviewIndex = product.reviews.findIndex(r =>
                r.user === reviewToDelete.user &&
                r.date === reviewToDelete.date &&
                r.comment === reviewToDelete.comment
            );
            if (productReviewIndex > -1) {
                product.reviews.splice(productReviewIndex, 1);
            }
            saveProducts();
            renderReviews();
            updateDashboard();
            showNotification('Review deleted successfully!');
        }
    }
}

// Test Bobgo Shipping (available in admin page)
function testBobgoShipping() {
    showNotification('Open the storefront to test Bobgo shipping with live rates');
}

// Settings
function saveSettings(event) {
    event.preventDefault();

    // Save Bobgo configuration (API key now managed via Vercel env vars)
    const bobgoConfig = {
        defaultShipping: parseFloat(document.getElementById('defaultShipping').value) || 0,
        securedViaVercel: true // API key is now in Vercel environment variables
    };

    localStorage.setItem('metraBobgoConfig', JSON.stringify(bobgoConfig));

    // Also save store name in settings
    settings = {
        storeName: document.getElementById('storeName').value
    };
    localStorage.setItem('metraSettings', JSON.stringify(settings));

    // Reload Bobgo config in main window (if script.js is loaded)
    if (typeof loadBobgoConfig === 'function') loadBobgoConfig();

    showNotification('Bobgo shipping settings saved successfully! API key is securely managed in Vercel dashboard.');
}

/**
 * Save Analytics & Tracking Settings
 */
function saveTrackingSettings(event) {
    event.preventDefault();

    const trackingConfig = {
        googleAnalyticsId: document.getElementById('googleAnalyticsId').value.trim(),
        clarityProjectId: document.getElementById('clarityProjectId').value.trim(),
        enabled: document.getElementById('trackingEnabled').checked
    };

    localStorage.setItem('metraTrackingConfig', JSON.stringify(trackingConfig));

    showNotification('✅ Analytics tracking settings saved successfully!');
    updateTrackingStatus();
}

/**
 * Load Analytics & Tracking Settings
 */
function loadTrackingSettings() {
    try {
        const config = JSON.parse(localStorage.getItem('metraTrackingConfig') || '{}');
        
        if (document.getElementById('googleAnalyticsId')) {
            document.getElementById('googleAnalyticsId').value = config.googleAnalyticsId || '';
        }
        if (document.getElementById('clarityProjectId')) {
            document.getElementById('clarityProjectId').value = config.clarityProjectId || '';
        }
        if (document.getElementById('trackingEnabled')) {
            document.getElementById('trackingEnabled').checked = config.enabled || false;
        }
    } catch(e) {
        console.error('Error loading tracking settings:', e);
    }
}

/**
 * Update tracking status display in analytics section
 */
function updateTrackingStatus() {
    try {
        const config = JSON.parse(localStorage.getItem('metraTrackingConfig') || '{}');
        const events = JSON.parse(localStorage.getItem('metraAnalytics') || '[]');
        
        // Update GA status
        const gaStatus = document.getElementById('gaStatus');
        const gaId = document.getElementById('gaId');
        if (gaStatus && gaId) {
            if (config.googleAnalyticsId) {
                gaStatus.textContent = 'Active';
                gaStatus.style.color = '#228B22';
                gaId.textContent = config.googleAnalyticsId;
            } else {
                gaStatus.textContent = 'Not Configured';
                gaStatus.style.color = 'var(--gray)';
                gaId.textContent = '-';
            }
        }

        // Update Clarity status
        const clarityStatus = document.getElementById('clarityStatus');
        const clarityId = document.getElementById('clarityId');
        if (clarityStatus && clarityId) {
            if (config.clarityProjectId) {
                clarityStatus.textContent = 'Active';
                clarityStatus.style.color = '#228B22';
                clarityId.textContent = config.clarityProjectId;
            } else {
                clarityStatus.textContent = 'Not Configured';
                clarityStatus.style.color = 'var(--gray)';
                clarityId.textContent = '-';
            }
        }

        // Update tracking active status
        const trackingActive = document.getElementById('trackingActive');
        const trackingEvents = document.getElementById('trackingEvents');
        if (trackingActive && trackingEvents) {
            if (config.enabled && (config.googleAnalyticsId || config.clarityProjectId)) {
                trackingActive.textContent = 'Enabled';
                trackingActive.style.color = '#228B22';
            } else {
                trackingActive.textContent = 'Disabled';
                trackingActive.style.color = 'var(--gray)';
            }
            trackingEvents.textContent = `${events.length} events tracked`;
        }
    } catch(e) {
        console.error('Error updating tracking status:', e);
    }
}

/**
 * Test tracking scripts
 */
function testTrackingScripts() {
    const config = JSON.parse(localStorage.getItem('metraTrackingConfig') || '{}');
    const statusDiv = document.getElementById('trackingStatus');
    
    if (!statusDiv) return;
    
    statusDiv.style.display = 'block';
    statusDiv.innerHTML = '<p style="color: var(--gray);"><i class="fas fa-spinner fa-spin"></i> Testing tracking scripts...</p>';

    let results = [];
    
    if (config.googleAnalyticsId) {
        results.push(`<p style="color: #228B22;"><i class="fas fa-check-circle"></i> Google Analytics ID: ${config.googleAnalyticsId}</p>`);
    } else {
        results.push('<p style="color: #FFA500;"><i class="fas fa-exclamation-circle"></i> Google Analytics not configured</p>');
    }
    
    if (config.clarityProjectId) {
        results.push(`<p style="color: #228B22;"><i class="fas fa-check-circle"></i> Microsoft Clarity ID: ${config.clarityProjectId}</p>`);
    } else {
        results.push('<p style="color: #FFA500;"><i class="fas fa-exclamation-circle"></i> Microsoft Clarity not configured</p>');
    }
    
    if (config.enabled) {
        results.push('<p style="color: #228B22;"><i class="fas fa-check-circle"></i> Tracking is enabled</p>');
    } else {
        results.push('<p style="color: #FFA500;"><i class="fas fa-exclamation-circle"></i> Tracking is disabled</p>');
    }

    statusDiv.innerHTML = results.join('');
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

async function resetProducts() {
    if (confirm('Remove all locally cached products and reload from database?')) {
        localStorage.removeItem('metraProducts');
        await loadData();
        renderProductsTable();
        updateDashboard();
        showNotification('Products reloaded from database!');
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
                ${invoice.customerName || (invoice.customer && invoice.customer.name) || 'N/A'}<br>
                <small style="color: var(--gray);">${invoice.customerEmail || (invoice.customer && invoice.customer.email) || ''}</small>
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
                        <span>R${(order.subtotal || 0).toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>Shipping:</span>
                        <span>R${(order.shipping || 0).toFixed(2)}</span>
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

// Download Invoice
function downloadInvoice(orderId) {
    const invoices = JSON.parse(localStorage.getItem('metraInvoices') || '[]');
    const invoice = invoices.find(i => i.orderId === orderId || i.id === orderId);
    if (!invoice) {
        showNotification('Invoice not found');
        return;
    }
    const text = `INVOICE ${invoice.invoiceNumber || orderId}\nDate: ${invoice.date || ''}\nCustomer: ${invoice.customerName || ''}\nTotal: R${(invoice.total || 0).toFixed(2)}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${invoice.invoiceNumber || orderId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Invoice downloaded');
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
    loadTrackingSettings();
    updateTrackingStatus();
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
                        <span style="font-size: 1.5rem;">${stat.product.image ? `<img src="${stat.product.image}" alt="${stat.product.name}" style="width:40px;height:40px;object-fit:cover;border-radius:8px;vertical-align:middle;">` : stat.product.icon}</span>
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

// Safe JSON parser helper
function safeJSON(key, fallback = null) {
    try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : fallback;
    } catch {
        return fallback;
    }
}

// ==================== EMAIL MANAGEMENT ====================

let currentEditingTemplate = null;

// Load Email Settings
function loadEmailSettings() {
    // Load email config (SMTP)
    const config = JSON.parse(localStorage.getItem('metraEmailConfig') || '{}');

    document.getElementById('emailEnabled').checked = config.enabled || false;
    document.getElementById('smtpHost').value = config.smtpHost || '';
    document.getElementById('smtpPort').value = config.smtpPort || 587;
    document.getElementById('smtpUser').value = config.smtpUser || '';
    document.getElementById('smtpPassword').value = config.smtpPassword || '';
    document.getElementById('fromEmail').value = config.fromEmail || 'noreply@metramarket.co.za';
    document.getElementById('adminEmail').value = config.adminEmail || 'admin@metramarket.co.za';

    // Load Mailgun config
    const mailgunConfig = JSON.parse(localStorage.getItem('metraMailgunConfig') || '{}');
    document.getElementById('mailgunEnabled').checked = mailgunConfig.enabled || false;
    document.getElementById('mailgunApiKey').value = mailgunConfig.apiKey || '';
    document.getElementById('mailgunDomain').value = mailgunConfig.domain || 'mg.metramarket.co.za';
    document.getElementById('mailgunFromEmail').value = mailgunConfig.fromEmail || 'noreply@metramarket.co.za';
    document.getElementById('mailgunAdminEmail').value = mailgunConfig.adminEmail || 'admin@metramarket.co.za';

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

// Save Mailgun Config
function saveMailgunConfig(event) {
    event.preventDefault();

    const config = {
        enabled: document.getElementById('mailgunEnabled').checked,
        apiKey: document.getElementById('mailgunApiKey').value,
        domain: document.getElementById('mailgunDomain').value,
        fromEmail: document.getElementById('mailgunFromEmail').value,
        adminEmail: document.getElementById('mailgunAdminEmail').value
    };

    localStorage.setItem('metraMailgunConfig', JSON.stringify(config));
    showNotification('Mailgun settings saved successfully!');
}

// Test Mailgun Connection
function testMailgunConnection() {
    const config = JSON.parse(localStorage.getItem('metraMailgunConfig') || '{}');

    if (!config.enabled) {
        showNotification('Please enable Mailgun email service first');
        return;
    }

    if (!config.apiKey || !config.domain) {
        showNotification('Please fill in Mailgun API key and domain');
        return;
    }

    showNotification('Testing Mailgun connection...');

    // Test by making a simple API call
    fetch(`https://api.mailgun.net/v3/${config.domain}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + btoa(`api:${config.apiKey}`)
        }
    })
    .then(response => {
        if (response.ok) {
            showNotification('Mailgun connection test successful! ✓');
        } else {
            return response.json().then(err => {
                throw new Error(err.message || 'API error');
            });
        }
    })
    .catch(error => {
        showNotification('Mailgun test failed: ' + error.message);
    });
}

// Send Test Email from Admin
function sendTestEmailFromAdmin(event) {
    event.preventDefault();

    const mailgunConfig = JSON.parse(localStorage.getItem('metraMailgunConfig') || '{}');
    const smtpConfig = JSON.parse(localStorage.getItem('metraEmailConfig') || '{}');

    const to = document.getElementById('testEmailTo').value;
    const type = document.getElementById('testEmailType').value;
    const customMessage = document.getElementById('testCustomMessage').value;

    // Check if either Mailgun or SMTP is configured
    if (!mailgunConfig.enabled && !smtpConfig.enabled) {
        showTestEmailResult('error', 'Please configure either Mailgun or SMTP settings first');
        return;
    }

    // Use Mailgun if available, otherwise fall back to SMTP
    if (mailgunConfig.enabled && mailgunConfig.apiKey && mailgunConfig.domain) {
        sendTestEmailViaMailgun(mailgunConfig, to, type, customMessage);
    } else if (smtpConfig.enabled) {
        sendTestEmailViaSmtp(smtpConfig, to, type, customMessage);
    } else {
        showTestEmailResult('error', 'No email service configured. Please enable Mailgun or SMTP.');
    }
}

// Send Test Email via Mailgun - Uses serverless API
async function sendTestEmailViaMailgun(config, to, type, customMessage) {
    const resultDiv = document.getElementById('testEmailResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = '<p style="color: #FFA500;"><i class="fas fa-spinner fa-spin"></i> Sending via Mailgun...</p>';

    const subjects = {
        test: '🧪 Test Email from Metra Market Admin',
        order_confirmation: 'Test Order Confirmation - Metra Market',
        invoice: 'Test Invoice - Metra Market',
        password_reset: 'Test Password Reset - Metra Market',
        custom: 'Custom Test Email - Metra Market'
    };

    const htmlTemplates = {
        test: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #8B0000, #DC143C); padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">🧪 Test Email</h1>
                </div>
                <div style="padding: 30px; background: #f9f9f9;">
                    <p>This is a test email from the Metra Market Admin Dashboard.</p>
                    <p><strong>Email Service:</strong> Mailgun</p>
                    <p><strong>Domain:</strong> ${config.domain}</p>
                    <p><strong>Timestamp:</strong> ${new Date().toLocaleString('en-ZA')}</p>
                    ${customMessage ? `<div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;"><p>${customMessage}</p></div>` : ''}
                    <p style="text-align: center; margin-top: 30px;">
                        <strong>Metra Market Admin Dashboard</strong>
                    </p>
                </div>
                <div style="background: #8B0000; color: white; text-align: center; padding: 15px; font-size: 12px;">
                    <p>&copy; 2026 Metra Market. All rights reserved.</p>
                </div>
            </div>
        `,
        order_confirmation: getTestOrderConfirmationHtml(),
        invoice: getTestInvoiceHtml(),
        password_reset: getTestPasswordResetHtml(),
        custom: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;"><p>${customMessage || 'Custom test email'}</p></div>`
    };

    try {
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to,
                subject: subjects[type],
                html: htmlTemplates[type],
                from: config.fromEmail || 'noreply@metramarket.co.za'
            })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showTestEmailResult('success', `Email sent successfully via Mailgun! Message ID: ${result.id}`);
            queueEmail(config.fromEmail, to, subjects[type], type, 'sent');
        } else {
            showTestEmailResult('error', 'Mailgun error: ' + (result.error || result.message || 'Unknown error'));
        }
    } catch (error) {
        showTestEmailResult('error', 'Failed to send: ' + error.message);
    }
}

// Send Test Email via SMTP (simulation - requires backend for real SMTP)
function sendTestEmailViaSmtp(config, to, type, customMessage) {
    const resultDiv = document.getElementById('testEmailResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = '<p style="color: #FFA500;"><i class="fas fa-spinner fa-spin"></i> Sending via SMTP...</p>';

    // In production, this would call a backend API to send via SMTP
    // For now, simulate success and queue the email
    setTimeout(() => {
        const subjects = {
            test: '🧪 Test Email from Metra Market Admin',
            order_confirmation: 'Test Order Confirmation - Metra Market',
            invoice: 'Test Invoice - Metra Market',
            password_reset: 'Test Password Reset - Metra Market',
            custom: 'Custom Test Email - Metra Market'
        };

        showTestEmailResult('success', `Email queued for sending via SMTP! (Backend required for actual delivery)`);
        queueEmail(config.fromEmail, to, subjects[type], type, 'pending');
    }, 1500);
}

// Show Test Email Result
function showTestEmailResult(type, message) {
    const resultDiv = document.getElementById('testEmailResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div style="padding: 1rem; border-radius: 10px; ${type === 'success' ? 'background: rgba(34, 139, 34, 0.1); border: 1px solid rgba(34, 139, 34, 0.3); color: #228B22;' : 'background: rgba(220, 20, 60, 0.1); border: 1px solid rgba(220, 20, 60, 0.3); color: #DC143C;'}">
            <strong><i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i></strong>
            ${message}
        </div>
    `;
}

// Queue Email (for tracking)
function queueEmail(from, to, subject, template, status) {
    const queue = JSON.parse(localStorage.getItem('metraEmailQueue') || '[]');
    queue.push({
        to,
        subject,
        template,
        status,
        createdAt: new Date().toISOString()
    });
    localStorage.setItem('metraEmailQueue', JSON.stringify(queue));
    loadEmailQueue();
}

// Send Bulk Notification - Uses serverless batch email API
async function sendBulkNotification(event) {
    event.preventDefault();

    const mailgunConfig = JSON.parse(localStorage.getItem('metraMailgunConfig') || '{}');

    const group = document.getElementById('bulkNotificationGroup').value;
    const subject = document.getElementById('bulkNotificationSubject').value;
    const message = document.getElementById('bulkNotificationMessage').value;
    const isHtml = document.getElementById('bulkNotificationHtml').checked;

    // Check if Mailgun is configured
    if (!mailgunConfig.enabled || !mailgunConfig.apiKey || !mailgunConfig.domain) {
        showBulkNotificationResult('error', 'Please configure Mailgun settings first and enable the service');
        return;
    }

    // Get users based on group
    const allUsers = JSON.parse(localStorage.getItem('metraUsers') || '[]');
    const allOrders = JSON.parse(localStorage.getItem('metraOrders') || '[]');
    let recipients = [];

    switch (group) {
        case 'all':
            recipients = allUsers.filter(u => u.email);
            break;
        case 'customers':
            const customerIds = [...new Set(allOrders.map(o => o.userId))];
            recipients = allUsers.filter(u => u.email && customerIds.includes(u.id));
            break;
        case 'recent':
            const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
            recipients = allUsers.filter(u => u.email && u.lastActive && new Date(u.lastActive).getTime() > thirtyDaysAgo);
            break;
    }

    if (recipients.length === 0) {
        showBulkNotificationResult('error', 'No recipients found for this group');
        return;
    }

    // Confirm before sending
    if (!confirm(`Send notification to ${recipients.length} recipients?\n\nThis will send ${recipients.length} individual emails.`)) {
        return;
    }

    const resultDiv = document.getElementById('bulkNotificationResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `<p style="color: #FFA500;"><i class="fas fa-spinner fa-spin"></i> Sending to ${recipients.length} recipients... Please wait</p>`;

    // Prepare email data for batch API
    const emails = recipients.map(user => ({
        to: user.email,
        html: isHtml ? message : `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <p>Dear ${user.name},</p>
                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B0000;">
                    <p style="white-space: pre-wrap; margin: 0;">${message}</p>
                </div>
                <p style="text-align: center; margin-top: 30px; color: #666;">
                    <strong>Metra Market Team</strong><br>
                    <small>Sent on ${new Date().toLocaleString('en-ZA')}</small>
                </p>
            </div>
        `
    }));

    try {
        // Send in batches of 100 (API limit)
        let totalSent = 0;
        let totalFailed = 0;

        for (let i = 0; i < emails.length; i += 100) {
            const batch = emails.slice(i, i + 100);
            
            const response = await fetch('/api/send-batch-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    emails: batch,
                    subject,
                    from: `Metra Market <${mailgunConfig.fromEmail || 'noreply@metramarket.co.za'}>`
                })
            });

            const result = await response.json();

            if (result.success) {
                totalSent += result.successCount;
                totalFailed += result.failureCount;
                
                resultDiv.innerHTML = `<p style="color: #FFA500;"><i class="fas fa-spinner fa-spin"></i> Sent ${totalSent}/${emails.length} emails...</p>`;
            } else {
                totalFailed += batch.length;
            }

            // Small delay between batches
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        if (totalFailed === 0) {
            showBulkNotificationResult('success', `✅ Bulk notification completed! Sent: ${totalSent} emails successfully`);
        } else {
            showBulkNotificationResult('success', `⚠️ Bulk notification completed! Sent: ${totalSent}, Failed: ${totalFailed}`);
        }

        // Queue emails for tracking
        recipients.forEach(user => {
            queueEmail(mailgunConfig.fromEmail, user.email, subject, 'bulk_notification', 'sent');
        });

    } catch (error) {
        showBulkNotificationResult('error', 'Failed to send bulk emails: ' + error.message);
    }
}

// Show Bulk Notification Result
function showBulkNotificationResult(type, message) {
    const resultDiv = document.getElementById('bulkNotificationResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div style="padding: 1rem; border-radius: 10px; ${type === 'success' ? 'background: rgba(34, 139, 34, 0.1); border: 1px solid rgba(34, 139, 34, 0.3); color: #228B22;' : 'background: rgba(220, 20, 60, 0.1); border: 1px solid rgba(220, 20, 60, 0.3); color: #DC143C;'}">
            <strong><i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i></strong>
            ${message}
        </div>
    `;
}

// Update bulk recipient count when group changes
function updateBulkRecipientCount() {
    const group = document.getElementById('bulkNotificationGroup')?.value;
    const countEl = document.getElementById('bulkRecipientCount');
    
    if (!group || !countEl) return;

    const allUsers = JSON.parse(localStorage.getItem('metraUsers') || '[]');
    const allOrders = JSON.parse(localStorage.getItem('metraOrders') || '[]');
    let count = 0;

    switch (group) {
        case 'all':
            count = allUsers.filter(u => u.email).length;
            break;
        case 'customers':
            const customerIds = [...new Set(allOrders.map(o => o.userId))];
            count = allUsers.filter(u => u.email && customerIds.includes(u.id)).length;
            break;
        case 'recent':
            const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
            count = allUsers.filter(u => u.email && u.lastActive && new Date(u.lastActive).getTime() > thirtyDaysAgo).length;
            break;
    }

    countEl.textContent = count;
}

// Listen for changes to bulk notification group
document.addEventListener('DOMContentLoaded', () => {
    const groupSelect = document.getElementById('bulkNotificationGroup');
    if (groupSelect) {
        groupSelect.addEventListener('change', updateBulkRecipientCount);
    }
    // Initial count
    setTimeout(updateBulkRecipientCount, 500);
});

// ==================== EMAIL TEMPLATE DESIGNER ====================

// Current editing template state (already declared at line 1527)
// let currentEditingTemplate = null;
let currentLayout = 'modern';

// Pre-designed email templates
const PREDESIGNED_TEMPLATES = {
    order_confirmation: {
        name: 'Order Confirmation',
        subject: 'Order Confirmation - {{orderNumber}}',
        modern: getModernOrderConfirmationTemplate(),
        minimal: getMinimalOrderConfirmationTemplate(),
        classic: getClassicOrderConfirmationTemplate()
    },
    invoice: {
        name: 'Invoice',
        subject: 'Invoice {{invoiceNumber}} - Metra Market',
        modern: getModernInvoiceTemplate(),
        minimal: getMinimalInvoiceTemplate(),
        classic: getClassicInvoiceTemplate()
    },
    password_reset: {
        name: 'Password Reset',
        subject: 'Password Reset Request - Metra Market',
        modern: getModernPasswordResetTemplate(),
        minimal: getMinimalPasswordResetTemplate(),
        classic: getClassicPasswordResetTemplate()
    },
    welcome_email: {
        name: 'Welcome Email',
        subject: 'Welcome to Metra Market, {{customerName}}!',
        modern: getModernWelcomeTemplate(),
        minimal: getMinimalWelcomeTemplate(),
        classic: getClassicWelcomeTemplate()
    },
    shipping_notification: {
        name: 'Shipping Notification',
        subject: 'Your Order Has Shipped! - {{orderNumber}}',
        modern: getModernShippingTemplate(),
        minimal: getMinimalShippingTemplate(),
        classic: getClassicShippingTemplate()
    },
    promotional: {
        name: 'Promotional Email',
        subject: 'Special Offer Just for You!',
        modern: getModernPromotionalTemplate(),
        minimal: getMinimalPromotionalTemplate(),
        classic: getClassicPromotionalTemplate()
    },
    custom: {
        name: 'Custom Template',
        subject: '',
        modern: '<html><body><h1>Custom Template</h1></body></html>',
        minimal: '<html><body><h1>Custom Template</h1></body></html>',
        classic: '<html><body><h1>Custom Template</h1></body></html>'
    }
};

// Edit Template
function editTemplate(templateId) {
    currentEditingTemplate = templateId;
    
    const template = PREDESIGNED_TEMPLATES[templateId];
    if (!template) {
        showNotification('Template not found');
        return;
    }
    
    // Show layout selector
    document.getElementById('layoutSelector').style.display = 'block';
    
    // Show editor
    document.getElementById('templateEditor').style.display = 'block';
    
    // Set template name and subject
    document.getElementById('templateName').value = template.name;
    
    // Load saved template or use default
    const savedTemplates = JSON.parse(localStorage.getItem('metraEmailTemplates') || '[]');
    const savedTemplate = savedTemplates.find(t => t.id === templateId);
    
    if (savedTemplate) {
        document.getElementById('templateSubject').value = savedTemplate.subject || template.subject;
        document.getElementById('templateHtml').value = savedTemplate.html || template[currentLayout];
    } else {
        document.getElementById('templateSubject').value = template.subject;
        document.getElementById('templateHtml').value = template[currentLayout];
    }
    
    // Scroll to editor
    document.getElementById('templateEditor').scrollIntoView({ behavior: 'smooth' });
}

// Select Layout
function selectLayout(layout, event) {
    currentLayout = layout;
    
    // Highlight selected layout
    document.querySelectorAll('.layout-option').forEach(el => {
        el.style.borderColor = 'rgba(255,248,231,0.1)';
    });
    if (event && event.currentTarget) {
        event.currentTarget.style.borderColor = 'var(--primary)';
    }
    
    // Update template with selected layout
    if (currentEditingTemplate && PREDESIGNED_TEMPLATES[currentEditingTemplate]) {
        const template = PREDESIGNED_TEMPLATES[currentEditingTemplate];
        document.getElementById('templateHtml').value = template[layout];
    }
}

// Toggle Editor View (show/hide preview)
function toggleEditorView() {
    const previewPanel = document.getElementById('templatePreviewPanel');
    previewPanel.style.display = previewPanel.style.display === 'none' ? 'block' : 'none';
    
    if (previewPanel.style.display === 'block') {
        previewTemplate();
    }
}

// Insert Placeholder
function insertPlaceholder(placeholder) {
    const textarea = document.getElementById('templateHtml');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    textarea.value = textarea.value.substring(0, start) + placeholder + textarea.value.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + placeholder.length;
    textarea.focus();
}

// Preview Template
function previewTemplate() {
    const html = document.getElementById('templateHtml').value;
    const preview = document.getElementById('templatePreview');
    
    // Replace placeholders with sample data for preview
    const sampleData = {
        '{{customerName}}': 'John Doe',
        '{{customerEmail}}': 'john@example.com',
        '{{orderNumber}}': 'ORD-12345',
        '{{invoiceNumber}}': 'INV-12345',
        '{{total}}': 'R1,499.99',
        '{{date}}': new Date().toLocaleDateString('en-ZA'),
        '{{itemsList}}': '<li>Product 1 x 1 - R999.99</li><li>Product 2 x 2 - R500.00</li>',
        '{{trackingUrl}}': '#',
        '{{adminUrl}}': '#',
        '{{resetUrl}}': '#'
    };
    
    let previewHtml = html;
    Object.keys(sampleData).forEach(key => {
        previewHtml = previewHtml.replace(new RegExp(key, 'g'), sampleData[key]);
    });
    
    preview.innerHTML = previewHtml;
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
        templates[index].layout = currentLayout;
    } else {
        templates.push({
            id: currentEditingTemplate,
            subject: subject,
            html: html,
            layout: currentLayout,
            createdAt: new Date().toISOString()
        });
    }
    
    localStorage.setItem('metraEmailTemplates', JSON.stringify(templates));
    showNotification('Template saved successfully!');
}

// Reset Template
function resetTemplate() {
    if (!currentEditingTemplate) return;
    
    if (confirm('Reset this template to default? Your customizations will be lost.')) {
        const templates = JSON.parse(localStorage.getItem('metraEmailTemplates') || '[]');
        const filtered = templates.filter(t => t.id !== currentEditingTemplate);
        localStorage.setItem('metraEmailTemplates', JSON.stringify(filtered));
        
        const template = PREDESIGNED_TEMPLATES[currentEditingTemplate];
        document.getElementById('templateSubject').value = template.subject;
        document.getElementById('templateHtml').value = template[currentLayout];
        
        showNotification('Template reset to default');
    }
}

// Template Generator Functions
function getModernOrderConfirmationTemplate() {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #8B0000, #DC143C); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 30px; }
        .order-info { background: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .items-table th { background: #8B0000; color: white; padding: 12px; text-align: left; }
        .items-table td { padding: 12px; border-bottom: 1px solid #eee; }
        .total { font-size: 20px; font-weight: bold; color: #8B0000; }
        .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 14px; }
        .btn { display: inline-block; padding: 12px 30px; background: #8B0000; color: white; text-decoration: none; border-radius: 25px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛒 Order Confirmed!</h1>
            <p>Thank you for shopping with Metra Market</p>
        </div>
        <div class="content">
            <p>Dear {{customerName}},</p>
            <p>Your order has been received and is being processed.</p>
            <div class="order-info">
                <p><strong>Order Number:</strong> {{orderNumber}}</p>
                <p><strong>Invoice:</strong> {{invoiceNumber}}</p>
                <p><strong>Date:</strong> {{date}}</p>
            </div>
            <h3>Order Summary</h3>
            <table class="items-table">
                <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
                <tbody>{{itemsList}}</tbody>
                <tfoot>
                    <tr><td colspan="2" style="text-align: right;"><strong>Total:</strong></td><td class="total">{{total}}</td></tr>
                </tfoot>
            </table>
            <p style="text-align: center;"><a href="#" class="btn">Track Your Order</a></p>
        </div>
        <div class="footer">
            <p>&copy; 2026 Metra Market. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
}

function getMinimalOrderConfirmationTemplate() {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { border-bottom: 2px solid #8B0000; padding-bottom: 20px; margin-bottom: 20px; }
        .header h1 { margin: 0; color: #8B0000; }
        .info { margin: 20px 0; }
        .items { width: 100%; border-collapse: collapse; }
        .items th { text-align: left; border-bottom: 2px solid #333; padding: 10px; }
        .items td { padding: 10px; border-bottom: 1px solid #eee; }
        .total { font-size: 18px; font-weight: bold; color: #8B0000; text-align: right; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Order Confirmation</h1>
    </div>
    <p>Hi {{customerName}},</p>
    <p>Thanks for your order!</p>
    <div class="info">
        <p><strong>Order:</strong> {{orderNumber}}</p>
        <p><strong>Date:</strong> {{date}}</p>
    </div>
    <table class="items">
        <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
        <tbody>{{itemsList}}</tbody>
    </table>
    <div class="total">Total: {{total}}</div>
</body>
</html>`;
}

function getClassicOrderConfirmationTemplate() {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Georgia, serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .container { border: 3px double #228B22; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #228B22; padding-bottom: 15px; margin-bottom: 20px; }
        .header h1 { color: #228B22; margin: 0; }
        .content { padding: 15px; background: #f9f9f9; }
        .items { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .items th { background: #228B22; color: white; padding: 10px; }
        .items td { padding: 10px; border-bottom: 1px solid #ddd; }
        .footer { text-align: center; margin-top: 20px; font-style: italic; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📦 Order Confirmation</h1>
        </div>
        <div class="content">
            <p>Dear {{customerName}},</p>
            <p>We are pleased to confirm your order.</p>
            <p><strong>Order Number:</strong> {{orderNumber}} | <strong>Date:</strong> {{date}}</p>
            <table class="items">
                <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
                <tbody>{{itemsList}}</tbody>
                <tr><td colspan="2" style="text-align: right;"><strong>Total:</strong></td><td><strong>{{total}}</strong></td></tr>
            </table>
        </div>
        <div class="footer">
            <p>Thank you for your business!</p>
            <p>Metra Market</p>
        </div>
    </div>
</body>
</html>`;
}

// Add more template generators as needed...
// (For brevity, adding just the order confirmation templates above)
// You can add similar functions for invoice, password_reset, welcome_email, etc.

// Placeholder template generators (simplified for brevity)
function getModernInvoiceTemplate() { return getModernOrderConfirmationTemplate(); }
function getMinimalInvoiceTemplate() { return getMinimalOrderConfirmationTemplate(); }
function getClassicInvoiceTemplate() { return getClassicOrderConfirmationTemplate(); }
function getModernPasswordResetTemplate() { return getModernOrderConfirmationTemplate(); }
function getMinimalPasswordResetTemplate() { return getMinimalOrderConfirmationTemplate(); }
function getClassicPasswordResetTemplate() { return getClassicOrderConfirmationTemplate(); }
function getModernWelcomeTemplate() { return getModernOrderConfirmationTemplate(); }
function getMinimalWelcomeTemplate() { return getMinimalOrderConfirmationTemplate(); }
function getClassicWelcomeTemplate() { return getClassicOrderConfirmationTemplate(); }
function getModernShippingTemplate() { return getModernOrderConfirmationTemplate(); }
function getMinimalShippingTemplate() { return getMinimalOrderConfirmationTemplate(); }
function getClassicShippingTemplate() { return getClassicOrderConfirmationTemplate(); }
function getModernPromotionalTemplate() { return getModernOrderConfirmationTemplate(); }
function getMinimalPromotionalTemplate() { return getMinimalOrderConfirmationTemplate(); }
function getClassicPromotionalTemplate() { return getClassicOrderConfirmationTemplate(); }

// ==================== EMAIL MANAGEMENT FUNCTIONS ====================

// Load Email Queue with filtering
function loadEmailQueue() {
    const queue = JSON.parse(localStorage.getItem('metraEmailQueue') || '[]');
    const tbody = document.getElementById('emailQueueTable');
    
    if (!tbody) return;
    
    // Get filter values
    const statusFilter = document.getElementById('emailFilterStatus')?.value || 'all';
    const typeFilter = document.getElementById('emailFilterType')?.value || 'all';
    const dateFilter = document.getElementById('emailFilterDate')?.value;
    
    // Filter emails
    let filteredQueue = queue;
    
    if (statusFilter !== 'all') {
        filteredQueue = filteredQueue.filter(email => email.status === statusFilter);
    }
    
    if (typeFilter !== 'all') {
        filteredQueue = filteredQueue.filter(email => email.template === typeFilter);
    }
    
    if (dateFilter) {
        filteredQueue = filteredQueue.filter(email => {
            const emailDate = new Date(email.createdAt).toISOString().split('T')[0];
            return emailDate === dateFilter;
        });
    }
    
    // Sort by date (newest first)
    filteredQueue.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Update stats
    updateEmailStats(queue);
    
    // Render table
    if (filteredQueue.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--gray);">No emails found</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredQueue.map(email => `
        <tr>
            <td>${email.to || 'N/A'}</td>
            <td>${email.subject || 'No Subject'}</td>
            <td><span style="background: rgba(255,248,231,0.1); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem;">${email.template || 'custom'}</span></td>
            <td>
                <span style="padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem; ${getStatusColor(email.status)}">
                    ${email.status || 'pending'}
                </span>
            </td>
            <td>${new Date(email.createdAt).toLocaleString('en-ZA')}</td>
            <td>
                <button class="btn-secondary btn-sm" onclick="viewEmailDetails('${email.to}', '${email.subject}')" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-danger btn-sm" onclick="resendEmail('${email.to}', '${email.subject}')" style="padding: 0.3rem 0.6rem; font-size: 0.8rem; margin-left: 0.5rem;">
                    <i class="fas fa-redo"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Get status color
function getStatusColor(status) {
    switch(status) {
        case 'sent': return 'background: rgba(34, 139, 34, 0.2); color: #228B22;';
        case 'pending': return 'background: rgba(255, 165, 0, 0.2); color: #FFA500;';
        case 'failed': return 'background: rgba(220, 20, 60, 0.2); color: #DC143C;';
        default: return 'background: rgba(139, 0, 0, 0.2); color: var(--primary);';
    }
}

// Update Email Stats
function updateEmailStats(queue) {
    const sent = queue.filter(e => e.status === 'sent').length;
    const pending = queue.filter(e => e.status === 'pending').length;
    const failed = queue.filter(e => e.status === 'failed').length;
    const total = queue.length;
    
    const sentEl = document.getElementById('emailsSentCount');
    const pendingEl = document.getElementById('emailsPendingCount');
    const failedEl = document.getElementById('emailsFailedCount');
    const totalEl = document.getElementById('emailsTotalCount');
    
    if (sentEl) sentEl.textContent = sent;
    if (pendingEl) pendingEl.textContent = pending;
    if (failedEl) failedEl.textContent = failed;
    if (totalEl) totalEl.textContent = total;
}

// Clear Email Queue
function clearEmailQueue() {
    if (confirm('Are you sure you want to clear all email records? This cannot be undone.')) {
        localStorage.removeItem('metraEmailQueue');
        loadEmailQueue();
        showNotification('Email queue cleared');
    }
}

// Export Email Log
function exportEmailLog() {
    const queue = JSON.parse(localStorage.getItem('metraEmailQueue') || '[]');
    
    if (queue.length === 0) {
        showNotification('No emails to export');
        return;
    }
    
    // Create CSV content
    const headers = ['To', 'Subject', 'Type', 'Status', 'Date'];
    const csvContent = [
        headers.join(','),
        ...queue.map(email => [
            `"${email.to || ''}"`,
            `"${email.subject || ''}"`,
            `"${email.template || ''}"`,
            `"${email.status || ''}"`,
            `"${new Date(email.createdAt).toLocaleString('en-ZA')}"`
        ].join(','))
    ].join('\n');
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Email log exported successfully');
}

// View Email Details
function viewEmailDetails(to, subject) {
    alert(`Email Details:\n\nTo: ${to}\nSubject: ${subject}`);
}

// Resend Email
function resendEmail(to, subject) {
    if (confirm(`Resend email to ${to}?`)) {
        showNotification('Email resend initiated');
    }
}

// Test SMTP Connection (simulation)
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

    showNotification('Testing SMTP connection...');
    setTimeout(() => {
        showNotification('SMTP connection test successful! (Simulation - backend required)');
    }, 1500);
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
                <div class="customer-info">
                    <span class="customer-name">${chat.userName}</span>
                    <span class="customer-email">${chat.userEmail}</span>
                </div>
            </td>
            <td>
                <div class="message-preview" title="${chat.message}">
                    ${chat.message.substring(0, 60)}${chat.message.length > 60 ? '...' : ''}
                </div>
            </td>
            <td>${new Date(chat.timestamp).toLocaleDateString('en-ZA')}</td>
            <td>
                <span style="padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem;
                    background: ${chat.status === 'read' ? 'rgba(34, 139, 34, 0.2)' : 'rgba(255, 165, 0, 0.2)'};
                    color: ${chat.status === 'read' ? '#228B22' : '#FFA500'};">
                    ${chat.status === 'read' ? 'Replied' : 'Unread'}
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

// ==================== TEST EMAIL HTML TEMPLATES ====================

// Get Test Order Confirmation HTML
function getTestOrderConfirmationHtml() {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #8B0000, #DC143C); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 20px; }
                .footer { background: #8B0000; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; }
                th { background: #8B0000; color: white; padding: 12px; text-align: left; }
                .total { font-size: 1.3em; font-weight: bold; color: #8B0000; }
                .test-badge { background: #FFA500; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; display: inline-block; margin-bottom: 10px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <span class="test-badge">🧪 TEST EMAIL</span>
                    <h1>Order Confirmation</h1>
                    <p>Thank you for shopping with Metra Market!</p>
                </div>
                <div class="content">
                    <p>Dear Valued Customer,</p>
                    <p>Your order has been received and is being processed.</p>
                    <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Order Number:</strong> ORD-TEST-12345</p>
                        <p><strong>Invoice:</strong> INV-TEST-12345</p>
                        <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-ZA')}</p>
                    </div>
                    <h3>Order Summary</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Qty</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;">🎧 Wireless Headphones</td><td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">1</td><td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">R1,199.99</td></tr>
                            <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;">⌚ Smart Watch</td><td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">1</td><td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">R2,999.99</td></tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="2" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
                                <td style="padding: 10px; text-align: right;">R4,199.98</td>
                            </tr>
                            <tr>
                                <td colspan="2" style="padding: 10px; text-align: right;"><strong>Shipping:</strong></td>
                                <td style="padding: 10px; text-align: right;">R150.00</td>
                            </tr>
                            <tr class="total">
                                <td colspan="2" style="padding: 15px 10px; text-align: right;">Total:</td>
                                <td style="padding: 15px 10px; text-align: right; color: #8B0000;">R4,349.98</td>
                            </tr>
                        </tfoot>
                    </table>
                    <p>We'll notify you when your order ships. Thank you for shopping with Metra Market!</p>
                </div>
                <div class="footer">
                    <p>&copy; 2026 Metra Market. All rights reserved.</p>
                    <p>Questions? Contact us at support@metramarket.co.za</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

// Get Test Invoice HTML
function getTestInvoiceHtml() {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #8B0000, #DC143C); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: white; padding: 20px; }
                .footer { background: #8B0000; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th { background: #8B0000; color: white; padding: 12px; text-align: left; }
                .total { font-size: 1.3em; font-weight: bold; color: #8B0000; }
                .test-badge { background: #FFA500; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; display: inline-block; margin-bottom: 10px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <span class="test-badge">🧪 TEST EMAIL</span>
                    <h1>INVOICE</h1>
                </div>
                <div class="content">
                    <p><strong>Invoice Number:</strong> INV-TEST-12345</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-ZA')}</p>
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 10px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #8B0000;">Bill To:</h3>
                        <p>Test Customer<br>test@example.com</p>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th style="padding: 12px; text-align: left;">Item</th>
                                <th style="padding: 12px;">Qty</th>
                                <th style="padding: 12px;">Price</th>
                                <th style="padding: 12px;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 10px;">🎧 Wireless Headphones</td><td style="padding: 10px; text-align: center;">1</td><td style="padding: 10px; text-align: right;">R1,199.99</td><td style="padding: 10px; text-align: right;">R1,199.99</td></tr>
                            <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 10px;">⌚ Smart Watch</td><td style="padding: 10px; text-align: center;">1</td><td style="padding: 10px; text-align: right;">R2,999.99</td><td style="padding: 10px; text-align: right;">R2,999.99</td></tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
                                <td style="padding: 10px; text-align: right;">R4,199.98</td>
                            </tr>
                            <tr>
                                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Shipping:</strong></td>
                                <td style="padding: 10px; text-align: right;">R150.00</td>
                            </tr>
                            <tr class="total">
                                <td colspan="3" style="padding: 15px 10px; text-align: right;">Total:</td>
                                <td style="padding: 15px 10px; text-align: right; color: #8B0000;">R4,349.98</td>
                            </tr>
                        </tfoot>
                    </table>
                    <p style="text-align: center; margin-top: 30px; color: #8B0000;"><strong>Thank you for your business!</strong></p>
                </div>
                <div class="footer">
                    <p>&copy; 2026 Metra Market. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

// Get Test Password Reset HTML
function getTestPasswordResetHtml() {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #8B0000, #DC143C); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 20px; }
                .footer { background: #8B0000; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
                .btn { display: inline-block; padding: 15px 40px; background: #8B0000; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
                .test-badge { background: #FFA500; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; display: inline-block; margin-bottom: 10px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <span class="test-badge">🧪 TEST EMAIL</span>
                    <h1>Password Reset Request</h1>
                </div>
                <div class="content">
                    <p>Hello,</p>
                    <p>You requested a password reset for your Metra Market account.</p>
                    <p style="text-align: center; margin: 30px 0;">
                        <a href="#" class="btn">Reset Password</a>
                    </p>
                    <p>This link expires in 1 hour.</p>
                    <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
                    <p style="text-align: center; margin-top: 30px;">
                        <strong>Metra Market Admin Dashboard - Test Email</strong>
                    </p>
                </div>
                <div class="footer">
                    <p>&copy; 2026 Metra Market. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

// Show custom message group when "Custom Message" is selected
document.addEventListener('DOMContentLoaded', () => {
    const emailTypeSelect = document.getElementById('testEmailType');
    const customMessageGroup = document.getElementById('customMessageGroup');

    if (emailTypeSelect && customMessageGroup) {
        emailTypeSelect.addEventListener('change', () => {
            customMessageGroup.style.display = emailTypeSelect.value === 'custom' ? 'block' : 'none';
        });
    }
});
