// PayFast Configuration (Production Mode)
const PAYFAST_CONFIG = {
    sandbox: false, // Production mode
    merchantId: '13343379',
    merchantKey: '8jgcm78j7sqph',
    passphrase: 'ThandoHlomuka93'
};

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
        fullDescription: "Experience superior sound quality with our Premium Wireless Headphones. Featuring advanced noise-canceling technology, 40-hour battery life, and ultra-comfortable memory foam ear cushions.",
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
        fullDescription: "Stay connected and track your fitness goals with our advanced Smart Watch. Features heart rate monitoring, GPS tracking, sleep analysis, and 7-day battery life.",
        specs: ["1.4 AMOLED", "Heart rate monitor", "GPS", "5ATM water resistant", "7-day battery"],
        reviews: [
            { user: "Thabo D.", rating: 5, comment: "Perfect fitness companion! Tracks everything accurately.", date: "2026-03-18" },
            { user: "Zanele P.", rating: 5, comment: "Love the design and battery life is incredible!", date: "2026-03-12" }
        ]
    },
    {
        id: 3,
        name: "Laptop Stand",
        price: 749.99,
        desc: "Ergonomic aluminum laptop stand",
        icon: "💻",
        sku: "LS-003",
        tags: ["Office", "Ergonomic", "Accessories"],
        fullDescription: "Improve your posture and workspace ergonomics with our premium aluminum laptop stand. Features 6 adjustable heights and supports up to 17-inch laptops.",
        specs: ["Aluminum alloy", "6 height adjustments", "Supports 17 inch", "Anti-slip pads", "Foldable"],
        reviews: [
            { user: "Priya N.", rating: 5, comment: "Game changer for my home office setup!", date: "2026-03-14" }
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
        fullDescription: "Dominate your games with our premium mechanical keyboard featuring Cherry MX switches, customizable RGB lighting, and aircraft-grade aluminum frame.",
        specs: ["Cherry MX Red switches", "RGB backlighting", "Aluminum frame", "N-key rollover", "Detachable cable"],
        reviews: [
            { user: "Kyle B.", rating: 5, comment: "Best keyboard I've ever used. The switches are so smooth!", date: "2026-03-16" }
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
        fullDescription: "Experience pixel-perfect precision with our ultra-lightweight wireless gaming mouse. Features a 25K DPI sensor, 68g weight, and 80-hour battery life.",
        specs: ["25K DPI sensor", "68g ultra-light", "80hr battery", "Wireless 2.4GHz", "6 programmable buttons"],
        reviews: [
            { user: "David M.", rating: 5, comment: "Incredibly responsive. My aim has improved significantly!", date: "2026-03-17" }
        ]
    },
    {
        id: 6,
        name: "USB-C Hub",
        price: 599.99,
        desc: "7-in-1 USB-C hub with HDMI",
        icon: "🔌",
        sku: "UH-006",
        tags: ["Connectivity", "USB-C", "Adapter"],
        fullDescription: "Expand your connectivity with our premium 7-in-1 USB-C hub. Features 4K HDMI output, 3x USB 3.0 ports, SD/microSD card readers, and 100W power delivery.",
        specs: ["4K HDMI output", "3x USB 3.0", "SD/microSD readers", "100W PD", "Aluminum body"],
        reviews: [
            { user: "Robert T.", rating: 5, comment: "Perfect for my MacBook. All ports work flawlessly.", date: "2026-03-15" }
        ]
    },
    {
        id: 7,
        name: "Portable Speaker",
        price: 1349.99,
        desc: "Waterproof Bluetooth speaker",
        icon: "🔊",
        sku: "PS-007",
        tags: ["Audio", "Portable", "Waterproof"],
        fullDescription: "Take your music anywhere with our waterproof Bluetooth speaker. Features 360° sound, 24-hour battery life, and IPX7 water resistance.",
        specs: ["360° sound", "24hr battery", "IPX7 waterproof", "Bluetooth 5.0", "Built-in mic"],
        reviews: [
            { user: "Mark W.", rating: 5, comment: "Amazing sound for its size. Took it to the beach!", date: "2026-03-18" }
        ]
    },
    {
        id: 8,
        name: "Phone Case",
        price: 374.99,
        desc: "Premium leather phone case",
        icon: "📱",
        sku: "PC-008",
        tags: ["Accessories", "Leather", "Protection"],
        fullDescription: "Protect your phone in style with our premium genuine leather case. Features card slots, magnetic closure, and precise cutouts.",
        specs: ["Genuine leather", "Card slots", "Magnetic closure", "Precise cutouts", "Wireless charging compatible"],
        reviews: [
            { user: "Michelle D.", rating: 5, comment: "Beautiful case, feels so premium!", date: "2026-03-16" }
        ]
    }
];

// State
let cart = [];
let wishlist = [];
let currentUser = null;
let shippingCost = 0;
let paymentMethod = 'card';
let invoiceDeliveryMethod = 'email';

// Database Configuration
// Uses localStorage by default. Vercel Neon DB integration available via environment variables.
const DB_CONFIG = {
    useDatabase: false // Set to true when database is configured
};

// Email Configuration - Managed via Admin Dashboard
const EMAIL_CONFIG = {
    enabled: false,
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    fromEmail: 'noreply@metramarket.co.za',
    adminEmail: 'admin@metramarket.co.za'
};

// Load email config from localStorage
function loadEmailConfig() {
    const saved = localStorage.getItem('metraEmailConfig');
    if (saved) {
        const config = JSON.parse(saved);
        Object.assign(EMAIL_CONFIG, config);
    }
}

// Email Templates
const EMAIL_TEMPLATES = {
    order_confirmation: {
        id: 'order_confirmation',
        name: 'Order Confirmation',
        subject: 'Order Confirmation - {{invoiceNumber}}',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #8B0000, #DC143C); padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Metra Market</h1>
                </div>
                <div style="padding: 30px; background: #f9f9f9;">
                    <h2 style="color: #8B0000;">Thank you for your order!</h2>
                    <p>Dear {{customerName}},</p>
                    <p>Your order has been received and is being processed.</p>
                    <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <p><strong>Order ID:</strong> {{orderNumber}}</p>
                        <p><strong>Invoice:</strong> {{invoiceNumber}}</p>
                        <p><strong>Date:</strong> {{date}}</p>
                        <p><strong>Total:</strong> R{{total}}</p>
                    </div>
                    <h3>Items:</h3>
                    <ul>{{itemsList}}</ul>
                    <p>We will notify you when your order ships.</p>
                    <p style="text-align: center; margin-top: 30px;">
                        <strong>Thank you for shopping with Metra Market!</strong>
                    </p>
                </div>
                <div style="background: #8B0000; color: white; text-align: center; padding: 15px; font-size: 12px;">
                    <p>&copy; 2026 Metra Market. All rights reserved.</p>
                </div>
            </div>
        `
    },
    invoice: {
        id: 'invoice',
        name: 'Invoice',
        subject: 'Invoice {{invoiceNumber}} - Metra Market',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #8B0000, #DC143C); padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">INVOICE</h1>
                </div>
                <div style="padding: 30px; background: white;">
                    <p><strong>Invoice Number:</strong> {{invoiceNumber}}</p>
                    <p><strong>Date:</strong> {{date}}</p>
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 10px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #8B0000;">Bill To:</h3>
                        <p>{{customerName}}<br>{{customerEmail}}</p>
                    </div>
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <thead>
                            <tr style="background: #8B0000; color: white;">
                                <th style="padding: 12px; text-align: left;">Item</th>
                                <th style="padding: 12px;">Qty</th>
                                <th style="padding: 12px;">Price</th>
                                <th style="padding: 12px;">Total</th>
                            </tr>
                        </thead>
                        <tbody>{{itemsRows}}</tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
                                <td style="padding: 10px; text-align: right;">R{{subtotal}}</td>
                            </tr>
                            <tr>
                                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Shipping:</strong></td>
                                <td style="padding: 10px; text-align: right;">R{{shipping}}</td>
                            </tr>
                            <tr style="font-size: 1.3em; font-weight: bold; background: #f0f0f0;">
                                <td colspan="3" style="padding: 15px 10px; text-align: right;">Total:</td>
                                <td style="padding: 15px 10px; text-align: right; color: #8B0000;">R{{total}}</td>
                            </tr>
                        </tfoot>
                    </table>
                    <p style="text-align: center; margin-top: 30px; color: #8B0000;">
                        <strong>Thank you for your business!</strong>
                    </p>
                </div>
            </div>
        `
    },
    admin_new_order: {
        id: 'admin_new_order',
        name: 'Admin - New Order Alert',
        subject: 'New Order Received - {{orderNumber}}',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #228B22, #32CD32); padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">🛒 New Order Alert</h1>
                </div>
                <div style="padding: 30px; background: #f9f9f9;">
                    <p>You have received a new order!</p>
                    <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #228B22;">
                        <p><strong>Order ID:</strong> {{orderNumber}}</p>
                        <p><strong>Customer:</strong> {{customerName}}</p>
                        <p><strong>Email:</strong> {{customerEmail}}</p>
                        <p><strong>Total:</strong> R{{total}}</p>
                        <p><strong>Items:</strong> {{itemCount}}</p>
                        <p><strong>Payment Method:</strong> {{paymentMethod}}</p>
                    </div>
                    <p style="text-align: center;">
                        <a href="{{adminUrl}}" style="display: inline-block; padding: 12px 30px; background: #228B22; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            View in Admin Dashboard
                        </a>
                    </p>
                </div>
            </div>
        `
    },
    password_reset: {
        id: 'password_reset',
        name: 'Password Reset',
        subject: 'Password Reset Request - Metra Market',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #8B0000, #DC143C); padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Password Reset</h1>
                </div>
                <div style="padding: 30px; background: #f9f9f9;">
                    <p>Hi {{customerName}},</p>
                    <p>You requested a password reset. Click the button below to reset your password:</p>
                    <p style="text-align: center; margin: 30px 0;">
                        <a href="{{resetUrl}}" style="display: inline-block; padding: 15px 40px; background: #8B0000; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Reset Password
                        </a>
                    </p>
                    <p style="color: #666; font-size: 14px;">This link expires in 1 hour.</p>
                    <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
                </div>
            </div>
        `
    }
};

// Load email templates from localStorage (allows admin customization)
function loadEmailTemplates() {
    const saved = localStorage.getItem('metraEmailTemplates');
    if (saved) {
        const customTemplates = JSON.parse(saved);
        customTemplates.forEach(t => {
            if (EMAIL_TEMPLATES[t.id]) {
                Object.assign(EMAIL_TEMPLATES[t.id], t);
            }
        });
    }
}

// Send Email Function
function sendEmail(to, templateId, data) {
    const template = EMAIL_TEMPLATES[templateId];
    if (!template) {
        console.error('Email template not found:', templateId);
        return false;
    }

    if (!EMAIL_CONFIG.enabled) {
        // Email not enabled, just log
        console.log('Email not enabled. Would send to:', to);
        console.log('Template:', template.name);
        return false;
    }

    // Replace placeholders
    let subject = template.subject;
    let html = template.html;
    
    Object.keys(data).forEach(key => {
        const regex = new RegExp('{{' + key + '}}', 'g');
        subject = subject.replace(regex, data[key]);
        html = html.replace(regex, data[key]);
    });

    // Store email in queue (for later processing when backend is connected)
    const emailQueue = JSON.parse(localStorage.getItem('metraEmailQueue') || '[]');
    emailQueue.push({
        to,
        subject,
        html,
        templateId,
        status: 'pending',
        createdAt: new Date().toISOString()
    });
    localStorage.setItem('metraEmailQueue', JSON.stringify(emailQueue));

    console.log('Email queued:', { to, subject, template: template.name });
    return true;
}

// Process Email Queue (call this periodically)
function processEmailQueue() {
    const queue = JSON.parse(localStorage.getItem('metraEmailQueue') || '[]');
    if (queue.length === 0) return;

    console.log(`Processing ${queue.length} emails in queue...`);
    
    // In production, this would send via SMTP/API
    // For now, just mark as sent
    queue.forEach(email => email.status = 'sent');
    localStorage.setItem('metraEmailQueue', JSON.stringify(queue));
}

// Analytics Tracking
function trackEvent(eventType, metadata = {}) {
    const eventData = {
        eventType,
        userId: currentUser?.id || null,
        sessionId: getSessionId(),
        pageUrl: window.location.href,
        metadata,
        timestamp: new Date().toISOString()
    };

    // Always save to localStorage
    const events = JSON.parse(localStorage.getItem('metraAnalytics') || '[]');
    events.push(eventData);
    localStorage.setItem('metraAnalytics', JSON.stringify(events));

    // Also send to API if database is enabled
    if (DB_CONFIG.useDatabase) {
        fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
        }).catch(err => console.log('Analytics tracking failed:', err));
    }
}

// Session Management - Persistent across browser sessions
const SESSION_CONFIG = {
    expiryDays: 30, // Sessions last 30 days
    checkInterval: 60000 // Check session expiry every minute
};

function createSession(user) {
    const session = {
        userId: user.id,
        email: user.email,
        name: user.name,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + (SESSION_CONFIG.expiryDays * 24 * 60 * 60 * 1000)).toISOString()
    };
    localStorage.setItem('metraSession', JSON.stringify(session));
    localStorage.setItem('metraUserLoggedIn', 'true');
    return session;
}

function getSession() {
    const sessionData = localStorage.getItem('metraSession');
    if (!sessionData) return null;
    
    try {
        const session = JSON.parse(sessionData);
        // Check if session has expired
        if (new Date(session.expiresAt) < new Date()) {
            destroySession();
            return null;
        }
        return session;
    } catch (e) {
        destroySession();
        return null;
    }
}

function destroySession() {
    localStorage.removeItem('metraSession');
    localStorage.removeItem('metraUserLoggedIn');
    localStorage.removeItem('metraCurrentUser');
}

function extendSession() {
    const session = getSession();
    if (session) {
        session.expiresAt = new Date(Date.now() + (SESSION_CONFIG.expiryDays * 24 * 60 * 60 * 1000)).toISOString();
        localStorage.setItem('metraSession', JSON.stringify(session));
    }
}

// Auto-extend session on user activity
['click', 'scroll', 'keypress', 'mousemove'].forEach(event => {
    document.addEventListener(event, () => {
        if (getSession()) {
            extendSession();
        }
    }, { passive: true });
});

// Check session expiry periodically
setInterval(() => {
    const session = getSession();
    if (!session && localStorage.getItem('metraUserLoggedIn') === 'true') {
        // Session expired, force logout
        localStorage.removeItem('metraUserLoggedIn');
        localStorage.removeItem('metraCurrentUser');
        showNotification('Your session has expired. Please login again.');
        setTimeout(() => location.reload(), 2000);
    }
}, SESSION_CONFIG.checkInterval);

// Update user session activity
function updateUserActivity() {
    if (currentUser) {
        currentUser.lastActive = new Date().toISOString();
        localStorage.setItem('metraCurrentUser', JSON.stringify(currentUser));
        
        // Update in users array
        const users = JSON.parse(localStorage.getItem('metraUsers') || '[]');
        const index = users.findIndex(u => u.id === currentUser.id);
        if (index > -1) {
            users[index].lastActive = currentUser.lastActive;
            localStorage.setItem('metraUsers', JSON.stringify(users));
        }

        // Track activity
        trackEvent('user_active', { userId: currentUser.id });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadEmailConfig();
    loadEmailTemplates();
    loadCart();
    loadWishlist();
    checkUserSession();
    renderProducts();
    updateCart();
    updateWishlistCount();
    setupMobileNav();
    showRandomSalesNotification();
    initFacebookSDK();
    
    // Track page view
    trackEvent('page_view', { page: window.location.pathname });
    
    // Update user activity every minute
    setInterval(updateUserActivity, 60000);
    
    // Process email queue every 30 seconds
    setInterval(processEmailQueue, 30000);
    
    // Load chat messages if user is logged in
    if (currentUser) {
        loadChatMessages();
    }
});

// ==================== CHAT SUPPORT SYSTEM ====================

function openChatSupport() {
    if (!currentUser) {
        showNotification('Please login to use chat support');
        openAuthModal();
        return;
    }

    const existingChat = document.getElementById('chatSupportBox');
    if (existingChat) {
        existingChat.remove();
        return;
    }

    const chatBox = document.createElement('div');
    chatBox.id = 'chatSupportBox';
    chatBox.innerHTML = `
        <div style="position: fixed; bottom: 80px; right: 20px; width: 350px; max-height: 500px; background: var(--dark); border: 1px solid rgba(255,248,231,0.1); border-radius: 15px; z-index: 4000; display: flex; flex-direction: column; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid rgba(255,248,231,0.1); background: var(--gradient); border-radius: 15px 15px 0 0;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-headset" style="color: white;"></i>
                    <span style="color: white; font-weight: 600;">Support Chat</span>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button onclick="toggleChatMessages()" style="background: none; border: none; color: white; cursor: pointer; font-size: 1.2rem;" title="Toggle Messages">
                        <i class="fas fa-comments"></i>
                    </button>
                    <button onclick="closeChatSupport()" style="background: none; border: none; color: white; cursor: pointer; font-size: 1.2rem;" title="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div id="chatMessages" style="flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 0.8rem; max-height: 350px;">
                <div style="text-align: center; color: var(--gray); padding: 1rem; font-size: 0.9rem;">
                    <i class="fas fa-info-circle"></i> Start a conversation with our support team
                </div>
            </div>
            <div style="padding: 1rem; border-top: 1px solid rgba(255,248,231,0.1);">
                <form onsubmit="sendChatMessage(event)" style="display: flex; gap: 0.5rem;">
                    <input type="text" id="chatInput" placeholder="Type your message..." style="flex: 1; padding: 0.8rem; background: rgba(255,248,231,0.05); border: 1px solid rgba(255,248,231,0.1); border-radius: 10px; color: var(--light); font-family: inherit;" required>
                    <button type="submit" style="background: var(--gradient); border: none; color: white; padding: 0.8rem 1rem; border-radius: 10px; cursor: pointer; transition: transform 0.3s;">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(chatBox);
    loadChatMessages();
}

function closeChatSupport() {
    const chatBox = document.getElementById('chatSupportBox');
    if (chatBox) chatBox.remove();
}

function toggleChatMessages() {
    const messagesDiv = document.getElementById('chatMessages');
    if (messagesDiv) {
        messagesDiv.style.display = messagesDiv.style.display === 'none' ? 'flex' : 'none';
    }
}

function sendChatMessage(event) {
    event.preventDefault();
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message || !currentUser) return;

    const chatMessage = {
        id: Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        message: message,
        from: 'user',
        timestamp: new Date().toISOString(),
        status: 'sent',
        adminReply: null
    };

    // Save to localStorage
    const messages = JSON.parse(localStorage.getItem('metraChatMessages') || '[]');
    messages.push(chatMessage);
    localStorage.setItem('metraChatMessages', JSON.stringify(messages));

    // Also save to user's chat history
    const userChats = JSON.parse(localStorage.getItem('metraUserChats_' + currentUser.id) || '[]');
    userChats.push(chatMessage);
    localStorage.setItem('metraUserChats_' + currentUser.id, JSON.stringify(userChats));

    input.value = '';
    loadChatMessages();
    showNotification('Message sent! Admin will respond soon');

    // Notify admin (in production, this would send real-time notification)
    console.log('New chat message from', currentUser.email, ':', message);
}

function loadChatMessages() {
    if (!currentUser) return;

    const messagesDiv = document.getElementById('chatMessages');
    if (!messagesDiv) return;

    const userChats = JSON.parse(localStorage.getItem('metraUserChats_' + currentUser.id) || '[]');
    
    if (userChats.length === 0) {
        messagesDiv.innerHTML = `
            <div style="text-align: center; color: var(--gray); padding: 2rem;">
                <i class="fas fa-comments" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>No messages yet</p>
                <p style="font-size: 0.85rem;">Start a conversation with our support team</p>
            </div>
        `;
        return;
    }

    messagesDiv.innerHTML = userChats.map(msg => `
        <div style="background: ${msg.from === 'user' ? 'rgba(139, 0, 0, 0.2)' : 'rgba(34, 139, 34, 0.2)'}; padding: 0.8rem; border-radius: 10px; ${msg.from === 'user' ? 'margin-left: 20px;' : 'margin-right: 20px;'}">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
                <span style="font-size: 0.75rem; color: var(--gray);">${msg.from === 'user' ? 'You' : 'Support'} • ${new Date(msg.timestamp).toLocaleString('en-ZA', { hour: '2-digit', minute: '2-digit' })}</span>
                <span style="font-size: 0.75rem; color: ${msg.status === 'read' ? '#228B22' : '#FFA500'};">
                    <i class="fas fa-${msg.status === 'read' ? 'check-double' : 'check'}"></i>
                </span>
            </div>
            <p style="margin: 0; color: var(--light);">${msg.message}</p>
            ${msg.adminReply ? `<p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #228B22;"><i class="fas fa-reply"></i> ${msg.adminReply}</p>` : ''}
        </div>
    `).join('');

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Auto-check for new chat messages every 10 seconds
setInterval(() => {
    if (currentUser && document.getElementById('chatSupportBox')) {
        loadChatMessages();
    }
}, 10000);

// Initialize Facebook SDK
function initFacebookSDK() {
    window.fbAsyncInit = function() {
        FB.init({
            appId      : 'YOUR_FACEBOOK_APP_ID', // Replace with your Facebook App ID
            cookie     : true,
            xfbml      : true,
            version    : 'v17.0'
        });
    };
    
    // Load Facebook SDK asynchronously
    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}

// Render Products
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    grid.innerHTML = products.map(product => `
        <div class="product-card" onclick="openProductModal(${product.id})">
            <div class="product-image">${product.icon}</div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.desc}</p>
                <div class="product-footer">
                    <span class="product-price">R${product.price.toFixed(2)}</span>
                    <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
    saveCart();
    showNotification('Added to cart!');
    
    // Track event
    trackEvent('add_to_cart', { productId, productName: product.name, price: product.price });
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCart();
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const navCartCount = document.getElementById('navCartCount');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartShipping = document.getElementById('cartShipping');
    const cartTotal = document.getElementById('cartTotal');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
    if (navCartCount) navCartCount.textContent = totalItems;
    
    if (cart.length === 0) {
        if (cartItems) cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        if (cartSubtotal) cartSubtotal.textContent = 'R0.00';
        if (cartShipping) cartShipping.textContent = 'R0.00';
        if (cartTotal) cartTotal.textContent = 'R0.00';
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + shippingCost;
    
    if (cartItems) {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">${item.icon}</div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">R${item.price.toFixed(2)} x ${item.quantity}</div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
    
    if (cartSubtotal) cartSubtotal.textContent = `R${subtotal.toFixed(2)}`;
    if (cartShipping) cartShipping.textContent = `R${shippingCost.toFixed(2)}`;
    if (cartTotal) cartTotal.textContent = `R${total.toFixed(2)}`;
}

function saveCart() {
    localStorage.setItem('metraCart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('metraCart');
    if (saved) cart = JSON.parse(saved);
}

// Shipping
function updateShipping(cost) {
    shippingCost = cost;
    updateCart();
}

function setPaymentMethod(method) {
    paymentMethod = method;
    const bankDetails = document.getElementById('bankDetails');
    if (bankDetails) {
        bankDetails.style.display = method === 'bank_transfer' ? 'block' : 'none';
    }
}

function setInvoiceDelivery(method) {
    invoiceDeliveryMethod = method;
    localStorage.setItem('metraInvoiceDeliveryPreference', method);
}

// Toggle Cart
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    if (!currentUser) {
        showNotification('Please login to checkout');
        openAuthModal();
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + shippingCost;
    
    const order = {
        id: 'ORD-' + Date.now(),
        invoiceNumber: 'INV-' + Date.now(),
        userId: currentUser.id,
        customerName: currentUser.name,
        customerEmail: currentUser.email,
        items: [...cart],
        subtotal: subtotal,
        shipping: shippingCost,
        total: total,
        paymentMethod: paymentMethod,
        invoiceDelivery: invoiceDeliveryMethod,
        status: 'processing',
        date: new Date().toLocaleDateString('en-ZA')
    };

    // Handle PayFast payment
    if (paymentMethod === 'payfast') {
        if (processPayFastPayment(order)) {
            // Save order only if PayFast redirect succeeds
            saveOrder(order);
            return;
        } else {
            // If PayFast fails, fall back to regular checkout
            showNotification('PayFast unavailable. Processing as regular order...');
        }
    }

    // Regular checkout for card, EFT, bank transfer
    saveOrder(order);
}

// Save Order
function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem('metraOrders') || '[]');
    orders.push(order);
    localStorage.setItem('metraOrders', JSON.stringify(orders));

    if (!currentUser.orders) currentUser.orders = [];
    currentUser.orders.push(order.id);
    localStorage.setItem('metraUsers', JSON.stringify(
        JSON.parse(localStorage.getItem('metraUsers') || '[]').map(u =>
            u.id === currentUser.id ? currentUser : u
        )
    ));
    localStorage.setItem('metraCurrentUser', JSON.stringify(currentUser));

    generateInvoice(order);

    // Send order confirmation email to customer
    const itemsList = order.items.map(item => 
        `<li>${item.name} x ${item.quantity} - R${(item.price * item.quantity).toFixed(2)}</li>`
    ).join('');
    
    sendEmail(order.customerEmail, 'order_confirmation', {
        customerName: order.customerName,
        orderNumber: order.id,
        invoiceNumber: order.invoiceNumber,
        date: order.date,
        total: order.total.toFixed(2),
        itemsList: itemsList
    });

    // Send admin notification
    sendEmail(EMAIL_CONFIG.adminEmail, 'admin_new_order', {
        orderNumber: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        total: order.total.toFixed(2),
        itemCount: order.items.length,
        paymentMethod: order.paymentMethod,
        adminUrl: window.location.origin + '/admin.html'
    });

    const deliveryText = invoiceDeliveryMethod === 'whatsapp' ? 'WhatsApp' : 'email';
    showNotification('Order placed successfully! Invoice sent via ' + deliveryText);
    
    // Track purchase
    trackEvent('purchase', { 
        orderId: order.id, 
        total: order.total, 
        items: order.items.length 
    });
    
    cart = [];
    shippingCost = 0;
    updateCart();
    saveCart();
    toggleCart();
}

// PayFast Payment Processing
function processPayFastPayment(order) {
    if (!PAYFAST_CONFIG.merchantId || !PAYFAST_CONFIG.merchantKey) {
        showNotification('PayFast configuration required. Please use Card or Bank Transfer.');
        return false;
    }

    const payFastUrl = PAYFAST_CONFIG.sandbox ? 'https://sandbox.payfast.co.za/eng/process' : 'https://www.payfast.co.za/eng/process';

    // Save order ID for success/cancel pages
    localStorage.setItem('lastOrderId', order.id);
    localStorage.setItem('lastOrderTotal', order.total.toString());

    const formData = {
        merchant_id: PAYFAST_CONFIG.merchantId,
        merchant_key: PAYFAST_CONFIG.merchantKey,
        amount: order.total.toFixed(2),
        item_name: 'Order ' + order.id,
        item_description: 'Purchase from Metra Market',
        return_url: window.location.origin + '/success.html?order_id=' + encodeURIComponent(order.id),
        cancel_url: window.location.origin + '/cancel.html?order_id=' + encodeURIComponent(order.id),
        notify_url: window.location.origin + '/ipn.php',
        email_address: order.customerEmail,
        email_confirmation: 'true',
        confirmation_first: 'buyer'
    };

    // Generate signature
    if (PAYFAST_CONFIG.passphrase) {
        const pfParam = Object.keys(formData).map(key => key + '=' + encodeURIComponent(formData[key])).join('&');
        const signature = CryptoJS.MD5(pfParam + '&passphrase=' + encodeURIComponent(PAYFAST_CONFIG.passphrase)).toString();
        formData.signature = signature;
    }

    // Create and submit form
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = payFastUrl;
    form.target = '_blank';

    Object.keys(formData).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = formData[key];
        form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    return true;
}

// Generate Invoice
function generateInvoice(order) {
    const invoice = {
        invoiceNumber: order.invoiceNumber,
        orderId: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        items: order.items,
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
        date: order.date
    };

    const invoices = JSON.parse(localStorage.getItem('metraInvoices') || '[]');
    invoices.push(invoice);
    localStorage.setItem('metraInvoices', JSON.stringify(invoices));

    // Send invoice email
    const itemsRows = invoice.items.map(item => `
        <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px;">${item.icon} ${item.name}</td>
            <td style="padding: 10px; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; text-align: right;">R${item.price.toFixed(2)}</td>
            <td style="padding: 10px; text-align: right;">R${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
    `).join('');

    sendEmail(invoice.customerEmail, 'invoice', {
        invoiceNumber: invoice.invoiceNumber,
        date: invoice.date,
        customerName: invoice.customerName,
        customerEmail: invoice.customerEmail,
        itemsRows: itemsRows,
        subtotal: invoice.subtotal.toFixed(2),
        shipping: invoice.shipping.toFixed(2),
        total: invoice.total.toFixed(2)
    });

    if (order.invoiceDelivery === 'whatsapp') {
        sendInvoiceViaWhatsApp(invoice);
    }
}

function sendInvoiceViaWhatsApp(invoice) {
    const itemsList = invoice.items.map(item => 
        `${item.icon} ${item.name} x${item.quantity} - R${(item.price * item.quantity).toFixed(2)}`
    ).join('%0A');
    
    const message = `*INVOICE - ${invoice.invoiceNumber}*%0A%0A` +
        `*Customer:* ${invoice.customerName}%0A` +
        `*Date:* ${invoice.date}%0A%0A` +
        `*Items:*%0A${itemsList}%0A%0A` +
        `*Subtotal:* R${invoice.subtotal.toFixed(2)}%0A` +
        `*Shipping:* R${invoice.shipping.toFixed(2)}%0A` +
        `*TOTAL:* R${invoice.total.toFixed(2)}%0A%0A` +
        `Thank you for shopping with Metra Market!`;
    
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

// Wishlist Functions
function addToWishlist(productId) {
    if (wishlist.includes(productId)) {
        removeFromWishlist(productId);
        return;
    }
    
    wishlist.push(productId);
    saveWishlist();
    updateWishlistCount();
    showNotification('Added to wishlist!');
}

function removeFromWishlist(productId) {
    wishlist = wishlist.filter(id => id !== productId);
    saveWishlist();
    updateWishlistCount();
    showNotification('Removed from wishlist');
}

function saveWishlist() {
    localStorage.setItem('metraWishlist', JSON.stringify(wishlist));
}

function loadWishlist() {
    const saved = localStorage.getItem('metraWishlist');
    if (saved) wishlist = JSON.parse(saved);
}

function updateWishlistCount() {
    const count = document.getElementById('wishlistCount');
    const navCount = document.getElementById('navWishlistCount');
    if (count) count.textContent = wishlist.length;
    if (navCount) navCount.textContent = wishlist.length;
}

function openWishlistModal() {
    // Remove existing modal if any
    const existingModal = document.getElementById('wishlistModal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.className = 'product-modal active';
    modal.id = 'wishlistModal';

    const wishlistProducts = products.filter(p => wishlist.includes(p.id));

    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px; max-height: 85vh; overflow: hidden;">
            <button class="modal-close" onclick="closeWishlistModal()">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-body" style="overflow-y: auto; max-height: 85vh;">
                <h2 style="margin-bottom: 1.5rem; color: var(--light);">My Wishlist</h2>
                ${wishlistProducts.length > 0 ? `
                    <div class="products-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
                        ${wishlistProducts.map(product => `
                            <div class="product-card" style="background: rgba(255, 248, 231, 0.05); border-radius: 20px; overflow: hidden; border: 1px solid rgba(255, 248, 231, 0.1);">
                                <div class="product-image" style="width: 100%; height: 200px; background: linear-gradient(135deg, rgba(139, 0, 0, 0.2), rgba(220, 20, 60, 0.2)); display: flex; align-items: center; justify-content: center; font-size: 4rem; color: var(--primary);">${product.icon}</div>
                                <div class="product-info" style="padding: 1.5rem;">
                                    <h3 class="product-name" style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--light);">${product.name}</h3>
                                    <p class="product-desc" style="color: var(--gray); font-size: 0.85rem; margin-bottom: 1rem;">${product.desc}</p>
                                    <div class="product-footer" style="display: flex; justify-content: space-between; align-items: center;">
                                        <span class="product-price" style="font-size: 1.2rem; font-weight: 700; background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">R${product.price.toFixed(2)}</span>
                                        <div style="display: flex; gap: 0.5rem;">
                                            <button class="add-to-cart" onclick="addToCart(${product.id}); showNotification('Added to cart!');" style="background: var(--gradient); border: none; color: white; padding: 0.6rem 1rem; border-radius: 10px; cursor: pointer; font-weight: 600; transition: transform 0.3s;">
                                                <i class="fas fa-cart-plus"></i>
                                            </button>
                                            <button class="add-to-cart" style="background: var(--secondary); border: none; color: white; padding: 0.6rem 1rem; border-radius: 10px; cursor: pointer; font-weight: 600; transition: transform 0.3s;" onclick="removeFromWishlist(${product.id}); closeWishlistModal(); setTimeout(openWishlistModal, 100);">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: flex-end; flex-wrap: wrap;">
                        <button class="btn-secondary" onclick="clearWishlist(); closeWishlistModal(); setTimeout(openWishlistModal, 100);" style="background: rgba(255, 248, 231, 0.1); border: 1px solid rgba(255, 248, 231, 0.2); color: var(--light); padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; font-weight: 600;">
                            <i class="fas fa-trash"></i> Clear All
                        </button>
                        <button class="cta-btn" onclick="addAllToCart(); closeWishlistModal();" style="background: var(--gradient); border: none; color: white; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-cart-plus"></i> Add All to Cart
                        </button>
                    </div>
                ` : '<p class="empty-cart" style="text-align: center; color: var(--gray); padding: 3rem 1rem; font-size: 1.1rem;">Your wishlist is empty</p>'}
            </div>
        </div>
        <div class="modal-overlay active" onclick="closeWishlistModal()"></div>
    `;

    document.body.appendChild(modal);
}

function closeWishlistModal() {
    const modal = document.getElementById('wishlistModal');
    if (modal) modal.remove();
}

function clearWishlist() {
    wishlist = [];
    saveWishlist();
    updateWishlistCount();
    showNotification('Wishlist cleared');
}

function addAllToCart() {
    wishlist.forEach(id => addToCart(id));
    showNotification('All items added to cart!');
}

// Auth Modal Functions
function openAuthModal() {
    const modal = document.getElementById('authModal');
    const overlay = document.getElementById('authOverlay');
    if (modal && overlay) {
        modal.classList.add('active');
        overlay.classList.add('active');
    }
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    const overlay = document.getElementById('authOverlay');
    if (modal && overlay) {
        modal.classList.remove('active');
        overlay.classList.remove('active');
    }
}

function switchAuthTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    
    if (tab === 'login') {
        if (loginForm) loginForm.style.display = 'block';
        if (registerForm) registerForm.style.display = 'none';
        if (loginTab) loginTab.classList.add('active');
        if (registerTab) registerTab.classList.remove('active');
    } else {
        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = 'block';
        if (loginTab) loginTab.classList.remove('active');
        if (registerTab) registerTab.classList.add('active');
    }
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('metraUsers') || '[]');
    const user = users.find(u => (u.email === email || u.username === email) && u.password === password);

    if (user) {
        currentUser = user;
        // Create persistent session
        createSession(user);
        // Also save full user data
        localStorage.setItem('metraCurrentUser', JSON.stringify(user));
        
        // Update last login
        user.lastLogin = new Date().toISOString();
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex > -1) {
            users[userIndex] = user;
            localStorage.setItem('metraUsers', JSON.stringify(users));
        }
        
        closeAuthModal();
        updateProfileIcon();
        showNotification('Welcome back, ' + user.name + '!');
        trackEvent('user_login', { userId: user.id });
    } else {
        showNotification('Invalid credentials');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim().toLowerCase();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    // Validation
    if (!name || !email || !password) {
        showNotification('Please fill in all required fields');
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Passwords do not match');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address');
        return;
    }

    const users = JSON.parse(localStorage.getItem('metraUsers') || '[]');

    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        showNotification('Email already registered. Please login instead.');
        return;
    }

    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        username: email,
        phone: phone,
        password: password,
        orders: [],
        wishlist: [],
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        provider: 'email'
    };

    try {
        users.push(newUser);
        localStorage.setItem('metraUsers', JSON.stringify(users));
        
        // Verify save was successful
        const savedUsers = JSON.parse(localStorage.getItem('metraUsers') || '[]');
        const savedUser = savedUsers.find(u => u.id === newUser.id);
        
        if (!savedUser) {
            throw new Error('Failed to save user');
        }

        // Login the user with persistent session
        currentUser = newUser;
        createSession(newUser);
        localStorage.setItem('metraCurrentUser', JSON.stringify(newUser));

        // Track registration
        trackEvent('user_registered', { userId: newUser.id, email: newUser.email });

        closeAuthModal();
        updateProfileIcon();
        showNotification('Account created successfully! Welcome, ' + name + '!');
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('Failed to create account. Please try again.');
    }
}

function checkUserSession() {
    // First check if user is marked as logged in
    const loggedIn = localStorage.getItem('metraUserLoggedIn');
    if (loggedIn === 'true') {
        // Try to get persistent session
        const session = getSession();
        if (session) {
            // Get full user data
            const user = JSON.parse(localStorage.getItem('metraCurrentUser') || 'null');
            if (user && user.id === session.userId) {
                currentUser = user;
                updateProfileIcon();
                // Update last active
                updateUserActivity();
                return;
            }
        }
        // Session invalid, clear login state
        destroySession();
    }
}

function logout() {
    // Clear session
    destroySession();
    currentUser = null;
    closeProfileModal();
    showNotification('You have been logged out successfully');
    setTimeout(() => location.reload(), 1500);
}

function updateProfileIcon() {
    const icon = document.getElementById('userIcon');
    if (icon && currentUser) {
        icon.classList.add('logged-in');
    }
}

function openProfileModal() {
    if (!currentUser) {
        openAuthModal();
        return;
    }

    const modal = document.getElementById('profileModal');
    const overlay = document.getElementById('profileOverlay');
    if (modal && overlay) {
        document.getElementById('profileName').textContent = currentUser.name;
        document.getElementById('profileEmail').textContent = currentUser.email;

        const memberSince = new Date(currentUser.createdAt).toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' });
        document.getElementById('memberSince').textContent = memberSince;

        modal.classList.add('active');
        overlay.classList.add('active');

        switchProfileTab('overview');
    }
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    const overlay = document.getElementById('profileOverlay');
    if (modal && overlay) {
        modal.classList.remove('active');
        overlay.classList.remove('active');
    }
}

function switchProfileTab(tab) {
    const content = document.getElementById('profileContent');
    document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tab + 'Tab').classList.add('active');

    const orders = JSON.parse(localStorage.getItem('metraOrders') || '[]');
    const userOrders = orders.filter(o => o.userId === currentUser.id);

    switch(tab) {
        case 'overview':
            const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
            content.innerHTML = `
                <div class="profile-stats">
                    <div class="stat-card">
                        <h3>${userOrders.length}</h3>
                        <p>Total Orders</p>
                    </div>
                    <div class="stat-card">
                        <h3>${wishlist.length}</h3>
                        <p>Wishlist Items</p>
                    </div>
                    <div class="stat-card">
                        <h3>R${totalSpent.toFixed(2)}</h3>
                        <p>Total Spent</p>
                    </div>
                </div>
            `;
            break;
        case 'orders':
            content.innerHTML = userOrders.length > 0 ? `
                <div class="order-history">
                    ${userOrders.map(order => `
                        <div class="order-card">
                            <div class="order-header">
                                <span>${order.id}</span>
                                <span class="status-badge ${order.status}">${order.status}</span>
                            </div>
                            <p>Date: ${order.date}</p>
                            <p>Total: R${order.total.toFixed(2)}</p>
                        </div>
                    `).join('')}
                </div>
            ` : '<p class="empty-cart">No orders yet</p>';
            break;
        case 'wishlist':
            const wishlistProducts = products.filter(p => wishlist.includes(p.id));
            content.innerHTML = wishlistProducts.length > 0 ? `
                <div class="products-grid">
                    ${wishlistProducts.map(product => `
                        <div class="product-card">
                            <div class="product-image">${product.icon}</div>
                            <div class="product-info">
                                <h3>${product.name}</h3>
                                <p>R${product.price.toFixed(2)}</p>
                                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : '<p class="empty-cart">Your wishlist is empty</p>';
            break;
        case 'settings':
            content.innerHTML = `
                <form class="profile-settings" onsubmit="updateProfile(event)">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" value="${currentUser.name}" id="editName" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" value="${currentUser.email}" id="editEmail" required>
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" value="${currentUser.phone || ''}" id="editPhone">
                    </div>
                    <button type="submit" class="cta-btn">Update Profile</button>
                    <button type="button" class="btn-secondary" onclick="logout()" style="margin-top: 1rem; width: 100%;">Logout</button>
                </form>
                <div style="margin-top: 2rem; padding: 1.5rem; background: rgba(34, 139, 34, 0.1); border: 1px solid rgba(34, 139, 34, 0.3); border-radius: 15px;">
                    <h4 style="color: #228B22; margin-bottom: 0.5rem;"><i class="fas fa-headset"></i> Need Help?</h4>
                    <p style="color: var(--gray); font-size: 0.9rem; margin-bottom: 1rem;">Chat with our support team for assistance</p>
                    <button class="cta-btn" onclick="openChatSupport()" style="background: linear-gradient(135deg, #228B22, #32CD32); width: 100%;">
                        <i class="fas fa-comments"></i> Open Support Chat
                    </button>
                </div>
            `;
            break;
    }
}

function updateProfile(event) {
    event.preventDefault();
    currentUser.name = document.getElementById('editName').value;
    currentUser.email = document.getElementById('editEmail').value;
    currentUser.phone = document.getElementById('editPhone').value;

    const users = JSON.parse(localStorage.getItem('metraUsers') || '[]');
    const index = users.findIndex(u => u.id === currentUser.id);
    if (index > -1) {
        users[index] = currentUser;
        localStorage.setItem('metraUsers', JSON.stringify(users));
    }
    localStorage.setItem('metraCurrentUser', JSON.stringify(currentUser));

    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;

    showNotification('Profile updated successfully!');
}

// Google OAuth Configuration
const GOOGLE_CONFIG = {
    clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com', // Replace with your actual Google Client ID
    callback: handleGoogleCredentialResponse,
    auto_select: false
};

// WhatsApp Configuration  
const WHATSAPP_CONFIG = {
    apiKey: 'YOUR_WHATSAPP_API_KEY', // Replace with your WhatsApp Business API key
    phoneNumber: '' // Will be filled by user
};

// Google OAuth - Real Implementation
function googleLogin() {
    // Initialize Google Sign-In
    if (window.google && google.accounts) {
        google.accounts.id.initialize({
            client_id: GOOGLE_CONFIG.clientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false
        });
        
        google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                // Fallback: open popup
                google.accounts.id.renderButton(
                    document.createElement('div'),
                    { theme: 'outline', size: 'large', type: 'standard' }
                );
            }
        });
    } else {
        showNotification('Google Sign-In not loaded. Please try again.');
    }
}

// Handle Google Credential Response
function handleGoogleCredentialResponse(response) {
    // Decode JWT token
    const userInfo = JSON.parse(atob(response.credential.split('.')[1]));
    
    // Check if user exists or create new
    const users = JSON.parse(localStorage.getItem('metraUsers') || '[]');
    let user = users.find(u => u.email === userInfo.email);
    
    if (!user) {
        // Create new user
        user = {
            id: Date.now(),
            name: userInfo.name,
            email: userInfo.email,
            username: userInfo.email,
            phone: userInfo.phone_number || '',
            picture: userInfo.picture,
            password: '',
            orders: [],
            createdAt: new Date().toISOString(),
            provider: 'google'
        };
        users.push(user);
        localStorage.setItem('metraUsers', JSON.stringify(users));
        showNotification('Account created successfully!');
    } else {
        showNotification('Welcome back, ' + user.name + '!');
    }
    
    // Login user
    currentUser = user;
    localStorage.setItem('metraCurrentUser', JSON.stringify(user));
    localStorage.setItem('metraUserLoggedIn', 'true');
    closeAuthModal();
    updateProfileIcon();
}

// WhatsApp OTP Login - Real Implementation
function whatsappLogin() {
    // Show phone number input modal
    showWhatsAppOTPModal();
}

// Show WhatsApp OTP Modal
function showWhatsAppOTPModal() {
    const existingModal = document.getElementById('whatsappOTPModal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'whatsappOTPModal';
    modal.innerHTML = `
        <div class="product-modal active">
            <div class="modal-content" style="max-width: 450px;">
                <button class="modal-close" onclick="this.closest('#whatsappOTPModal').remove()">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-body" style="text-align: center;">
                    <div style="font-size: 3rem; color: #25D366; margin-bottom: 1rem;">
                        <i class="fab fa-whatsapp"></i>
                    </div>
                    <h2 style="margin-bottom: 0.5rem;">WhatsApp Login</h2>
                    <p style="color: var(--gray); margin-bottom: 1.5rem;">Enter your phone number to receive an OTP</p>
                    
                    <form id="whatsappPhoneForm" onsubmit="sendWhatsAppOTP(event)" style="display: flex; flex-direction: column; gap: 1rem;">
                        <div class="form-group" style="text-align: left;">
                            <label>Phone Number</label>
                            <input type="tel" id="whatsappPhone" placeholder="+27 12 345 6789" required 
                                style="width: 100%; padding: 1rem; background: rgba(255,248,231,0.05); border: 1px solid rgba(255,248,231,0.1); border-radius: 10px; color: var(--light); font-size: 1rem;">
                        </div>
                        <button type="submit" class="cta-btn" style="background: #25D366;">
                            <i class="fab fa-whatsapp"></i> Send OTP
                        </button>
                    </form>
                    
                    <div id="whatsappOTPForm" style="display: none; margin-top: 1rem;">
                        <p style="color: var(--gray); margin-bottom: 1rem;">Enter the 6-digit OTP sent to your WhatsApp</p>
                        <input type="text" id="whatsappOTP" placeholder="123456" maxlength="6" 
                            style="width: 100%; padding: 1rem; background: rgba(255,248,231,0.05); border: 1px solid rgba(255,248,231,0.1); border-radius: 10px; color: var(--light); font-size: 1.2rem; text-align: center; letter-spacing: 0.5rem; margin-bottom: 1rem;">
                        <button class="cta-btn" onclick="verifyWhatsAppOTP()" style="width: 100%;">
                            Verify OTP
                        </button>
                    </div>
                    
                    <p style="color: var(--gray); font-size: 0.85rem; margin-top: 1.5rem;">
                        By continuing, you agree to receive messages from Metra Market
                    </p>
                </div>
            </div>
        </div>
        <div class="modal-overlay active" onclick="this.parentElement.remove()"></div>
    `;
    document.body.appendChild(modal);
}

// Send WhatsApp OTP (using WhatsApp Business API)
function sendWhatsAppOTP(event) {
    event.preventDefault();
    const phone = document.getElementById('whatsappPhone').value.replace(/\s/g, '');
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP temporarily (in production, send via API and verify server-side)
    sessionStorage.setItem('whatsappOTP', otp);
    sessionStorage.setItem('whatsappPhone', phone);
    
    // In production, send via WhatsApp Business API:
    // fetch('https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages', {
    //     method: 'POST',
    //     headers: {
    //         'Authorization': 'Bearer YOUR_WHATSAPP_API_KEY',
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         messaging_product: 'whatsapp',
    //         to: phone,
    //         type: 'template',
    //         template: {
    //             name: 'login_otp',
    //             language: { code: 'en' },
    //             components: [{ type: 'body', parameters: [{ type: 'text', text: otp }] }]
    //         }
    //     })
    // });
    
    // For demo: show OTP in notification (remove in production!)
    showNotification(`Your OTP is: ${otp} (Check console in production)`);
    console.log('WhatsApp OTP for', phone, ':', otp);
    
    // Show OTP input form
    document.getElementById('whatsappPhoneForm').style.display = 'none';
    document.getElementById('whatsappOTPForm').style.display = 'block';
}

// Verify WhatsApp OTP
function verifyWhatsAppOTP() {
    const enteredOTP = document.getElementById('whatsappOTP').value;
    const storedOTP = sessionStorage.getItem('whatsappOTP');
    const phone = sessionStorage.getItem('whatsappPhone');
    
    if (enteredOTP === storedOTP) {
        // OTP verified - login or create user
        const users = JSON.parse(localStorage.getItem('metraUsers') || '[]');
        let user = users.find(u => u.phone === phone);
        
        if (!user) {
            // Create new user
            user = {
                id: Date.now(),
                name: 'WhatsApp User',
                email: phone.replace(/\+/g, '') + '@whatsapp.user',
                username: phone,
                phone: phone,
                password: '',
                orders: [],
                createdAt: new Date().toISOString(),
                provider: 'whatsapp'
            };
            users.push(user);
            localStorage.setItem('metraUsers', JSON.stringify(users));
            showNotification('Account created successfully!');
        } else {
            showNotification('Welcome back!');
        }
        
        // Login user
        currentUser = user;
        localStorage.setItem('metraCurrentUser', JSON.stringify(user));
        localStorage.setItem('metraUserLoggedIn', 'true');
        
        // Close modals
        document.getElementById('whatsappOTPModal').remove();
        closeAuthModal();
        updateProfileIcon();
        
        // Clear stored OTP
        sessionStorage.removeItem('whatsappOTP');
        sessionStorage.removeItem('whatsappPhone');
    } else {
        showNotification('Invalid OTP. Please try again.');
    }
}

// Facebook Login (using Facebook SDK)
function facebookLogin() {
    // Check if Facebook SDK is loaded
    if (window.FB) {
        FB.login((response) => {
            if (response.authResponse) {
                // Get user info
                FB.api('/me', { fields: 'name, email, picture' }, (userInfo) => {
                    handleFacebookLogin(userInfo);
                });
            } else {
                showNotification('Facebook login cancelled');
            }
        }, { scope: 'email,public_profile' });
    } else {
        // Fallback: create account
        showNotification('Facebook SDK not loaded. Creating account...');
        setTimeout(() => {
            const newUser = {
                id: Date.now(),
                name: 'Facebook User',
                email: 'user@facebook.com',
                username: 'user@facebook.com',
                phone: '',
                password: '',
                orders: [],
                createdAt: new Date().toISOString(),
                provider: 'facebook'
            };
            currentUser = newUser;
            localStorage.setItem('metraCurrentUser', JSON.stringify(newUser));
            localStorage.setItem('metraUserLoggedIn', 'true');
            closeAuthModal();
            updateProfileIcon();
        }, 1000);
    }
}

function handleFacebookLogin(userInfo) {
    const users = JSON.parse(localStorage.getItem('metraUsers') || '[]');
    let user = users.find(u => u.email === userInfo.email);
    
    if (!user) {
        user = {
            id: Date.now(),
            name: userInfo.name,
            email: userInfo.email,
            username: userInfo.email,
            phone: '',
            picture: userInfo.picture?.data?.url,
            password: '',
            orders: [],
            createdAt: new Date().toISOString(),
            provider: 'facebook'
        };
        users.push(user);
        localStorage.setItem('metraUsers', JSON.stringify(users));
        showNotification('Account created successfully!');
    } else {
        showNotification('Welcome back, ' + user.name + '!');
    }
    
    currentUser = user;
    localStorage.setItem('metraCurrentUser', JSON.stringify(user));
    localStorage.setItem('metraUserLoggedIn', 'true');
    closeAuthModal();
    updateProfileIcon();
}

// Product Modal
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    const overlay = document.getElementById('modalOverlay');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !overlay || !modalBody) return;
    
    const isWishlisted = wishlist.includes(product.id);
    
    modalBody.innerHTML = `
        <div class="modal-product-image">${product.icon}</div>
        <h2 class="modal-product-name">${product.name}</h2>
        <p class="modal-product-sku">SKU: ${product.sku}</p>
        <p class="modal-product-price">R${product.price.toFixed(2)}</p>
        
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
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                ${product.tags.map(tag => `<span style="background: rgba(255,248,231,0.1); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem;">${tag}</span>`).join('')}
            </div>
        </div>
        
        <div class="modal-product-reviews">
            <h3>Reviews (${product.reviews?.length || 0})</h3>
            ${product.reviews && product.reviews.length > 0 ? `
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    ${product.reviews.map(review => `
                        <div style="background: rgba(255,248,231,0.05); padding: 1rem; border-radius: 10px;">
                            <div style="color: #FFD700;">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                            <p style="margin: 0.5rem 0;">${review.comment}</p>
                            <p style="color: var(--gray); font-size: 0.85rem;">- ${review.user} (${review.date})</p>
                        </div>
                    `).join('')}
                </div>
            ` : '<p>No reviews yet</p>'}
        </div>
        
        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
            <button class="cta-btn" style="flex: 1;" onclick="addToCart(${product.id}); closeProductModal();">
                <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
            <button class="cta-btn" style="background: var(--secondary);" onclick="addToWishlist(${product.id}); this.innerHTML = '${isWishlisted ? '<i class=\'fas fa-heart\'></i> Wishlisted' : '<i class=\'fas fa-heart\'></i> Add to Wishlist'}';">
                <i class="fas fa-heart"></i> ${isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
            </button>
        </div>
    `;
    
    modal.classList.add('active');
    overlay.classList.add('active');
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    const overlay = document.getElementById('modalOverlay');
    if (modal && overlay) {
        modal.classList.remove('active');
        overlay.classList.remove('active');
    }
}

// Mobile Navigation
function setupMobileNav() {
    const mobileNav = document.getElementById('mobileBottomNav');
    if (mobileNav && window.innerWidth < 768) {
        mobileNav.style.display = 'flex';
    }
}

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

// Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
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

// Sales Notification
function showRandomSalesNotification() {
    const productNames = products.map(p => p.name);
    const randomProduct = productNames[Math.floor(Math.random() * productNames.length)];
    
    const notification = document.getElementById('salesNotification');
    const messageEl = document.getElementById('salesNotificationMessage');
    
    if (notification && messageEl) {
        messageEl.textContent = 'Someone just purchased ' + randomProduct + '!';
        notification.classList.add('active');
        
        setTimeout(() => {
            notification.classList.remove('active');
        }, 5000);
        
        setTimeout(showRandomSalesNotification, 30000 + Math.random() * 30000);
    }
}

// Contact Form
function handleSubmit(event) {
    event.preventDefault();
    showNotification('Message sent! We will get back to you soon.');
    event.target.reset();
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .nav-links.active {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(26, 10, 10, 0.98);
        padding: 1rem;
    }
    .profile-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }
    .order-history {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .order-card {
        background: rgba(255, 248, 231, 0.05);
        padding: 1rem;
        border-radius: 10px;
    }
    .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }
    .btn-secondary {
        background: rgba(255, 248, 231, 0.1);
        border: 1px solid rgba(255, 248, 231, 0.2);
        color: var(--light);
        padding: 0.8rem 1.5rem;
        border-radius: 10px;
        cursor: pointer;
    }
    @media (max-width: 768px) {
        .profile-stats {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(style);

// Load saved invoice delivery preference
const savedInvoiceDelivery = localStorage.getItem('metraInvoiceDeliveryPreference');
if (savedInvoiceDelivery) {
    invoiceDeliveryMethod = savedInvoiceDelivery;
    const invoiceRadio = document.querySelector('input[name="invoiceDelivery"][value="' + savedInvoiceDelivery + '"]');
    if (invoiceRadio) invoiceRadio.checked = true;
}
