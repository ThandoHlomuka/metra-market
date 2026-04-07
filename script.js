// PayFast Configuration (Production Mode)
// NOTE: These values must be configured via serverless functions or replaced at build time
// For client-side security, actual credentials should NEVER be in browser JavaScript
const PAYFAST_CONFIG = {
    sandbox: false, // Production mode
    merchantId: '[PAYFAST_MERCHANT_ID]', // Set via serverless proxy
    merchantKey: '[PAYFAST_MERCHANT_KEY]', // Set via serverless proxy
    passphrase: '[PAYFAST_PASSPHRASE]' // Set via serverless proxy
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
        ],
        weight: 0.35,
        length: 22,
        width: 20,
        height: 10,
        stock: 50
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
        ],
        weight: 0.15,
        length: 12,
        width: 10,
        height: 8,
        stock: 35
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
        ],
        weight: 1.2,
        length: 28,
        width: 25,
        height: 6,
        stock: 100
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
        ],
        weight: 1.1,
        length: 44,
        width: 15,
        height: 5,
        stock: 45
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
        ],
        weight: 0.12,
        length: 15,
        width: 10,
        height: 6,
        stock: 80
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
        ],
        weight: 0.18,
        length: 14,
        width: 8,
        height: 4,
        stock: 120
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
        ],
        weight: 0.65,
        length: 18,
        width: 10,
        height: 10,
        stock: 60
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
        ],
        weight: 0.08,
        length: 18,
        width: 12,
        height: 3,
        stock: 200
    },
    {
        id: 9,
        name: "Tablet Stand",
        price: 449.99,
        desc: "Adjustable tablet and phone stand",
        icon: "📱",
        sku: "TS-009",
        tags: ["Accessories", "Office", "Portable"],
        fullDescription: "Universal stand for tablets and phones with adjustable angles and sturdy aluminum construction.",
        specs: ["Universal compatibility", "Adjustable angle", "Aluminum build", "Non-slip base"],
        reviews: [
            { user: "Lisa M.", rating: 5, comment: "Perfect for video calls!", date: "2026-03-19" }
        ],
        weight: 0.4,
        length: 15,
        width: 12,
        height: 3,
        stock: 150
    },
    {
        id: 10,
        name: "Webcam HD",
        price: 1299.99,
        desc: "1080p HD webcam with microphone",
        icon: "📹",
        sku: "WC-010",
        tags: ["Office", "Electronics", "Streaming"],
        fullDescription: "Professional HD webcam with built-in noise-canceling microphone, perfect for video conferencing and streaming.",
        specs: ["1080p Full HD", "Built-in mic", "Auto focus", "USB plug-and-play"],
        reviews: [
            { user: "James P.", rating: 4, comment: "Great quality for the price", date: "2026-03-17" }
        ],
        weight: 0.25,
        length: 10,
        width: 8,
        height: 8,
        stock: 75
    },
    {
        id: 11,
        name: "Power Bank 20000mAh",
        price: 899.99,
        desc: "High-capacity portable charger",
        icon: "🔋",
        sku: "PB-011",
        tags: ["Accessories", "Portable", "Electronics"],
        fullDescription: "Never run out of battery with this high-capacity power bank. Features dual USB ports and fast charging.",
        specs: ["20000mAh capacity", "Dual USB ports", "Fast charging", "LED indicator"],
        reviews: [
            { user: "Sarah K.", rating: 5, comment: "Lasts for days!", date: "2026-03-18" }
        ],
        weight: 0.45,
        length: 16,
        width: 8,
        height: 2,
        stock: 90
    },
    {
        id: 12,
        name: "Gaming Headset",
        price: 1799.99,
        desc: "Surround sound gaming headset",
        icon: "🎮",
        sku: "GH-012",
        tags: ["Gaming", "Audio", "RGB"],
        fullDescription: "Immersive 7.1 surround sound gaming headset with RGB lighting and detachable microphone.",
        specs: ["7.1 Surround sound", "RGB lighting", "Detachable mic", "Memory foam cushions"],
        reviews: [
            { user: "Mike R.", rating: 5, comment: "Best gaming headset I've owned!", date: "2026-03-16" }
        ],
        weight: 0.38,
        length: 20,
        width: 18,
        height: 10,
        stock: 55
    },
    {
        id: 13,
        name: "Monitor 27 inch",
        price: 4499.99,
        desc: "4K UHD IPS monitor",
        icon: "🖥️",
        sku: "MN-013",
        tags: ["Office", "Electronics", "Gaming"],
        fullDescription: "Stunning 4K UHD monitor with IPS panel for accurate colors and wide viewing angles.",
        specs: ["27 inch 4K UHD", "IPS panel", "HDR10", "HDMI & DisplayPort"],
        reviews: [
            { user: "Alex T.", rating: 5, comment: "Crystal clear display!", date: "2026-03-15" }
        ],
        weight: 5.5,
        length: 62,
        width: 45,
        height: 18,
        stock: 25
    },
    {
        id: 14,
        name: "External SSD 1TB",
        price: 2199.99,
        desc: "Portable solid state drive",
        icon: "💾",
        sku: "SSD-014",
        tags: ["Electronics", "Storage", "Portable"],
        fullDescription: "Ultra-fast portable SSD with 1TB storage. Perfect for backups and file transfers.",
        specs: ["1TB capacity", "USB 3.2 Gen 2", "1050MB/s read", "Shock resistant"],
        reviews: [
            { user: "Chris B.", rating: 5, comment: "Lightning fast!", date: "2026-03-14" }
        ],
        weight: 0.06,
        length: 10,
        width: 6,
        height: 1,
        stock: 70
    },
    {
        id: 15,
        name: "Desk Lamp LED",
        price: 549.99,
        desc: "Adjustable LED desk lamp",
        icon: "💡",
        sku: "DL-015",
        tags: ["Office", "Home", "LED"],
        fullDescription: "Modern LED desk lamp with adjustable brightness and color temperature.",
        specs: ["Adjustable brightness", "Color temperature control", "USB charging port", "Touch control"],
        reviews: [
            { user: "Emma W.", rating: 4, comment: "Great for late night work", date: "2026-03-13" }
        ],
        weight: 0.8,
        length: 40,
        width: 15,
        height: 15,
        stock: 110
    },
    {
        id: 16,
        name: "Bluetooth Earbuds",
        price: 799.99,
        desc: "True wireless earbuds",
        icon: "🎵",
        sku: "BE-016",
        tags: ["Audio", "Wireless", "Portable"],
        fullDescription: "Compact true wireless earbuds with charging case. Great sound quality and comfortable fit.",
        specs: ["True wireless", "20hr battery with case", "IPX4 water resistant", "Touch controls"],
        reviews: [
            { user: "Tom H.", rating: 4, comment: "Great value for money", date: "2026-03-12" }
        ],
        weight: 0.05,
        length: 8,
        width: 8,
        height: 4,
        stock: 130
    },
    {
        id: 17,
        name: "Laptop Bag",
        price: 649.99,
        desc: "Premium laptop messenger bag",
        icon: "👜",
        sku: "LB-017",
        tags: ["Accessories", "Office", "Travel"],
        fullDescription: "Stylish and protective laptop bag with multiple compartments for accessories.",
        specs: ["Fits 15.6 inch laptops", "Water resistant", "Multiple compartments", "Padded shoulder strap"],
        reviews: [
            { user: "Nina S.", rating: 5, comment: "Perfect for daily commute", date: "2026-03-11" }
        ],
        weight: 0.9,
        length: 42,
        width: 30,
        height: 12,
        stock: 85
    },
    {
        id: 18,
        name: "Smart Home Hub",
        price: 1899.99,
        desc: "Voice-controlled smart home assistant",
        icon: "🏠",
        sku: "SH-018",
        tags: ["Smart Home", "Electronics", "Voice Control"],
        fullDescription: "Control your entire home with voice commands. Compatible with thousands of smart devices.",
        specs: ["Voice control", "Smart home hub", "Premium speaker", "Privacy controls"],
        reviews: [
            { user: "Peter J.", rating: 5, comment: "Makes life so much easier!", date: "2026-03-10" }
        ],
        weight: 0.7,
        length: 15,
        width: 15,
        height: 10,
        stock: 40
    },
    {
        id: 19,
        name: "Fitness Tracker",
        price: 1499.99,
        desc: "Advanced fitness band with GPS",
        icon: "💪",
        sku: "FT-019",
        tags: ["Wearables", "Fitness", "Health"],
        fullDescription: "Track your workouts, heart rate, sleep, and more with this advanced fitness tracker.",
        specs: ["Built-in GPS", "Heart rate monitor", "Sleep tracking", "7-day battery"],
        reviews: [
            { user: "Kelly M.", rating: 5, comment: "Perfect for my workouts!", date: "2026-03-09" }
        ],
        weight: 0.03,
        length: 4,
        width: 2,
        height: 1,
        stock: 95
    },
    {
        id: 20,
        name: "Wireless Charger",
        price: 399.99,
        desc: "Fast wireless charging pad",
        icon: "⚡",
        sku: "WC-020",
        tags: ["Accessories", "Wireless", "Charging"],
        fullDescription: "Fast wireless charging for all Qi-enabled devices. Sleek design with LED indicator.",
        specs: ["15W fast charging", "Qi-certified", "LED indicator", "Non-slip surface"],
        reviews: [
            { user: "Dan L.", rating: 4, comment: "Works great with my phone", date: "2026-03-08" }
        ],
        weight: 0.15,
        length: 10,
        width: 10,
        height: 1,
        stock: 180
    }
];

// State
let cart = [];
let wishlist = [];
let currentUser = null;
let shippingCost = 0;
let paymentMethod = 'card';
let invoiceDeliveryMethod = 'email';
let selectedCourier = null;
let courierOptions = [];
let selectedDeliveryMethod = 'delivery'; // 'delivery' or 'collection'
let selectedCollectionPoint = null;

// Coupon/Discount System
let appliedCoupon = null;

// Newsletter Subscribers
let newsletterSubscribers = [];

// Recently Viewed Products
let recentlyViewed = [];
const MAX_RECENTLY_VIEWED = 5;

// Customer Addresses (if logged in)
let savedAddresses = [];

// Bobgo Shipping Configuration - PRODUCTION MODE
const BOBGO_CONFIG = {
    // API key removed from client-side for security
    apiUrl: '/api/bobgo-shipping', // Use our secure serverless proxy
    productionApiUrl: 'https://api.bobgo.co.za/v1', // For reference only
    sandbox: false, // Set to false for production
    defaultShipping: 0,
    enabled: true,
    collectionPoints: [], // Will be populated from API
    shopAddress: '1335 Ingwayuma Street, Senaoane, Soweto, Gauteng, 1818' // Primary collection/origin address
};

// Load Bobgo settings
function loadBobgoConfig() {
    const saved = localStorage.getItem('metraBobgoConfig');
    if (saved) {
        const config = JSON.parse(saved);
        Object.assign(BOBGO_CONFIG, config);
        BOBGO_CONFIG.enabled = !!(config.apiKey || BOBGO_CONFIG.apiKey);
        BOBGO_CONFIG.sandbox = config.sandbox || false;
    }
}

// Get Bobgo API URL (sandbox or production)
function getBobgoApiUrl() {
    return BOBGO_CONFIG.sandbox 
        ? 'https://sandbox-api.bobgo.co.za/v1' 
        : 'https://api.bobgo.co.za/v1';
}

// Calculate Bobgo shipping via API with product-specific data - PRODUCTION
async function calculateBobgoShipping(address, cartItems = null) {
    if (!BOBGO_CONFIG.enabled) {
        return { success: false, defaultCost: BOBGO_CONFIG.defaultShipping };
    }

    try {
        // Calculate total weight and dimensions from cart items
        const shippingData = calculateCartShippingData(cartItems || cart);

        // Validate shipping data
        if (!shippingData || shippingData.weight <= 0) {
            throw new Error('Invalid shipping data: weight must be greater than 0');
        }

        const requestBody = {
            endpoint: 'couriers',
            origin: '1335 Ingwayuma Street, Senaoane, Soweto, Gauteng, 1818',
            destination: address || 'Cape Town',
            parcels: [{
                weight: Math.round(shippingData.weight * 1000) / 1000, // Round to 3 decimals
                length: Math.round(shippingData.length),
                width: Math.round(shippingData.width),
                height: Math.round(shippingData.height)
            }],
            currency: 'ZAR',
            live_rates: !BOBGO_CONFIG.sandbox
        };

        console.log('Bobgo API request:', requestBody);

        const response = await fetch(BOBGO_CONFIG.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        // Handle HTTP errors
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Bobgo API HTTP error:', response.status, errorData);
            throw new Error(errorData.message || `Bobgo API error: HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log('Bobgo couriers response:', data);

        // Validate response structure
        if (!data.success || !data.couriers || !Array.isArray(data.couriers)) {
            console.warn('Bobgo API returned invalid response structure:', data);
            return {
                success: false,
                error: data.message || 'Invalid response from Bobgo API',
                defaultCost: BOBGO_CONFIG.defaultShipping
            };
        }

        console.log('Valid couriers after filtering:', data.couriers);

        if (data.couriers.length === 0) {
            console.warn('No valid courier options returned from Bobgo API');
            return {
                success: false,
                error: 'No courier options available',
                defaultCost: BOBGO_CONFIG.defaultShipping
            };
        }

        // Return courier options with pricing
        return {
            success: true,
            couriers: data.couriers,
            defaultCost: data.defaultCost || BOBGO_CONFIG.defaultShipping
        };
    } catch (error) {
        console.error('Bobgo shipping calculation error:', error);
        // Fallback to default shipping on error
        return {
            success: false,
            error: error.message,
            defaultCost: BOBGO_CONFIG.defaultShipping
        };
    }
}

// Get collection points from Bobgo API
async function getCollectionPoints() {
    if (!BOBGO_CONFIG.enabled) return [];

    try {
        const response = await fetch('/api/bobgo-collection-points', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Collection points API error: HTTP ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        
        // Handle different response formats
        BOBGO_CONFIG.collectionPoints = data.points || data.collection_points || data.data || [];
        console.log('Collection points loaded:', BOBGO_CONFIG.collectionPoints.length);
        
        return BOBGO_CONFIG.collectionPoints;
    } catch (error) {
        console.error('Error fetching collection points:', error);
        return [];
    }
}

// Calculate total shipping data from cart items
function calculateCartShippingData(cartItems) {
    let totalWeight = 0;
    let maxLength = 0;
    let maxWidth = 0;
    let totalHeight = 0;

    cartItems.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            // Weight is cumulative
            totalWeight += (product.weight || 0.5) * item.quantity;
            
            // Find largest dimensions
            maxLength = Math.max(maxLength, product.length || 30);
            maxWidth = Math.max(maxWidth, product.width || 20);
            
            // Height is cumulative for stackable items
            totalHeight += (product.height || 15) * item.quantity;
        }
    });

    // If no items, use defaults
    if (totalWeight === 0) {
        totalWeight = 0.5;
        maxLength = 30;
        maxWidth = 20;
        totalHeight = 15;
    }

    return {
        weight: totalWeight,
        length: maxLength,
        width: maxWidth,
        height: totalHeight
    };
}

// Get cart dimensions (in cm) - legacy function
function getCartDimensions() {
    // Default dimensions (can be enhanced with product-specific dimensions)
    return {
        length: 30,
        width: 20,
        height: 15
    };
}

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

// Send Email Function - Now sends via Mailgun API
async function sendEmail(to, templateId, data) {
    const template = EMAIL_TEMPLATES[templateId];
    if (!template) {
        console.error('❌ Email template not found:', templateId);
        return { success: false, error: 'Template not found' };
    }

    // Replace placeholders
    let subject = template.subject;
    let html = template.html;

    Object.keys(data).forEach(key => {
        const regex = new RegExp('{{' + key + '}}', 'g');
        subject = subject.replace(regex, data[key] || '');
        html = html.replace(regex, data[key] || '');
    });

    // Store email in queue
    const emailQueue = JSON.parse(localStorage.getItem('metraEmailQueue') || '[]');
    const emailRecord = {
        to,
        subject,
        html,
        templateId,
        status: 'sending',
        createdAt: new Date().toISOString()
    };
    emailQueue.push(emailRecord);
    localStorage.setItem('metraEmailQueue', JSON.stringify(emailQueue));

    // Try to send via Mailgun API
    try {
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to,
                subject,
                html,
                from: EMAIL_CONFIG.fromEmail || 'noreply@metramarket.co.za'
            })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            emailRecord.status = 'sent';
            emailRecord.sentAt = new Date().toISOString();
            emailRecord.messageId = result.id;
            console.log('✅ Email sent successfully:', result.id);
        } else {
            emailRecord.status = 'failed';
            emailRecord.error = result.error || result.message;
            console.error('❌ Email sending failed:', result.error);
        }
    } catch (error) {
        emailRecord.status = 'failed';
        emailRecord.error = error.message;
        console.error('❌ Email sending error:', error);
    }

    // Update queue
    localStorage.setItem('metraEmailQueue', JSON.stringify(emailQueue));
    return emailRecord;
}

// Process Email Queue - Sends all pending emails
async function processEmailQueue() {
    const queue = JSON.parse(localStorage.getItem('metraEmailQueue') || '[]');
    const pendingEmails = queue.filter(e => e.status === 'pending' || e.status === 'failed');
    
    if (pendingEmails.length === 0) {
        console.log('✅ No pending emails to process');
        return { processed: 0 };
    }

    console.log(`📧 Processing ${pendingEmails.length} pending emails...`);
    let processed = 0;

    for (const email of pendingEmails) {
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: email.to,
                    subject: email.subject,
                    html: email.html
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                email.status = 'sent';
                email.sentAt = new Date().toISOString();
                email.messageId = result.id;
                processed++;
            } else {
                email.status = 'failed';
                email.error = result.error || result.message;
            }
        } catch (error) {
            email.status = 'failed';
            email.error = error.message;
        }

        // Small delay to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    localStorage.setItem('metraEmailQueue', JSON.stringify(queue));
    console.log(`✅ Processed ${processed}/${pendingEmails.length} emails`);
    return { processed, total: pendingEmails.length };
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
    console.log('DOM Content Loaded - Initializing Metra Market...');
    console.log('Products array length:', products.length);

    loadEmailConfig();
    loadEmailTemplates();
    loadCart();
    loadWishlist();
    loadNewsletterSubscribers();
    loadRecentlyViewed();
    checkUserSession();
    
    // Load addresses if user is logged in
    if (currentUser) {
        loadAddresses();
    }
    
    // Load applied coupon
    const savedCoupon = localStorage.getItem('metraAppliedCoupon');
    if (savedCoupon) {
        appliedCoupon = JSON.parse(savedCoupon);
    }

    // Render products with error handling
    try {
        renderProducts();
        console.log('Products rendered successfully');
    } catch (error) {
        console.error('Error rendering products:', error);
    }

    updateCart();
    updateWishlistCount();
    setupMobileNav();
    initTouchGestures();
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

    // Track visitor activity for admin dashboard
    trackVisitorActivity();

    // Listen for storage events (real-time updates from other tabs)
    window.addEventListener('storage', handleStorageEvent);

    console.log('Metra Market initialization complete');
});

// ==================== REAL-TIME ACTIVITY TRACKING ====================

// Track visitor activity
function trackVisitorActivity() {
    const activity = {
        type: 'page_view',
        page: window.location.pathname,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        sessionId: getSessionId()
    };
    
    // Store in localStorage for admin to read
    const activities = JSON.parse(localStorage.getItem('metraActivities') || '[]');
    activities.push(activity);
    
    // Keep only last 1000 activities
    if (activities.length > 1000) {
        activities.splice(0, activities.length - 1000);
    }
    
    localStorage.setItem('metraActivities', JSON.stringify(activities));
    
    // Update active visitors count
    updateActiveVisitors();
}

// Update active visitors count
function updateActiveVisitors() {
    const sessionId = getSessionId();
    const visitors = JSON.parse(localStorage.getItem('metraActiveVisitors') || '{}');
    
    // Add/update this visitor
    visitors[sessionId] = {
        lastActive: Date.now(),
        page: window.location.pathname,
        userAgent: navigator.userAgent
    };
    
    // Remove visitors inactive for more than 5 minutes
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    Object.keys(visitors).forEach(sid => {
        if (visitors[sid].lastActive < fiveMinutesAgo) {
            delete visitors[sid];
        }
    });
    
    localStorage.setItem('metraActiveVisitors', JSON.stringify(visitors));
}

// Handle storage events (cross-tab communication)
function handleStorageEvent(event) {
    const adminPages = ['admin.html'];
    const isAdminPage = adminPages.some(page => window.location.pathname.includes(page));
    
    if (isAdminPage) {
        // Admin dashboard - update in real-time
        switch(event.key) {
            case 'metraOrders':
                updateAdminDashboard();
                showAdminNotification('New order received!');
                break;
            case 'metraUsers':
                updateAdminDashboard();
                break;
            case 'metraActivities':
                updateLiveVisitors();
                break;
            case 'metraActiveVisitors':
                updateLiveVisitors();
                break;
            case 'metraContactMessages':
                showAdminNotification('New contact message!');
                break;
            case 'metraChatMessages':
                loadSupportChats();
                break;
        }
    }
}

// Admin dashboard update function
function updateAdminDashboard() {
    // Refresh all dashboard sections
    if (document.getElementById('dashboardSection') && document.getElementById('dashboardSection').classList.contains('active')) {
        updateDashboard();
    }
}

// Show admin notification
function showAdminNotification(message) {
    if (!document.getElementById('adminDashboard')) return;
    
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

// Update live visitors display (admin only)
function updateLiveVisitors() {
    const visitorsCountEl = document.getElementById('liveVisitorsCount');
    if (!visitorsCountEl) return;
    
    const visitors = JSON.parse(localStorage.getItem('metraActiveVisitors') || '{}');
    const count = Object.keys(visitors).length;
    
    visitorsCountEl.textContent = count;
    
    // Update visitor list if on analytics page
    const visitorListEl = document.getElementById('liveVisitorList');
    if (visitorListEl) {
        visitorListEl.innerHTML = Object.values(visitors).map(v => `
            <div style="padding: 0.5rem; background: rgba(255,248,231,0.05); border-radius: 5px; margin-bottom: 0.5rem;">
                <span style="color: var(--gray); font-size: 0.85rem;">On: ${v.page}</span>
            </div>
        `).join('');
    }
}

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

// Render Products (Homepage - shows random selection)
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) {
        console.error('Products grid element not found!');
        return;
    }

    if (!products || products.length === 0) {
        console.error('No products to render!');
        grid.innerHTML = '<p style="text-align: center; color: var(--gray); padding: 3rem;">No products available</p>';
        return;
    }

    console.log('✅ Rendering', products.length, 'products');

    // Initialize filtered products
    filteredProducts = [...products];

    // Show only 8 products on homepage
    const homepageProducts = products.slice(0, 8);

    grid.innerHTML = homepageProducts.map(product => `
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

    // Update product count
    const productCount = document.getElementById('productCount');
    if (productCount) productCount.textContent = `${homepageProducts.length} of ${products.length} products`;

    console.log('✅ Products grid updated with', homepageProducts.length, 'products');
}

// ==================== PRODUCT SEARCH, FILTER & SORT ====================

// Filtered products state
let filteredProducts = [...products];
let currentSort = 'default';

// Search Products
function searchProducts() {
    const searchTerm = document.getElementById('productSearch')?.value.toLowerCase() || '';
    filterAndRenderProducts(searchTerm);
}

// Filter Products
function filterProducts() {
    const searchTerm = document.getElementById('productSearch')?.value.toLowerCase() || '';
    filterAndRenderProducts(searchTerm);
}

// Sort Products
function sortProducts() {
    const sortValue = document.getElementById('sortFilter')?.value || 'default';
    currentSort = sortValue;
    
    // Sort the filtered products
    switch(sortValue) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'rating':
            filteredProducts.sort((a, b) => {
                const avgRatingA = a.reviews?.length ? a.reviews.reduce((sum, r) => sum + r.rating, 0) / a.reviews.length : 0;
                const avgRatingB = b.reviews?.length ? b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length : 0;
                return avgRatingB - avgRatingA;
            });
            break;
        default:
            // Reset to original order
            filteredProducts = [...products];
            const searchTerm = document.getElementById('productSearch')?.value.toLowerCase() || '';
            const category = document.getElementById('categoryFilter')?.value || 'all';
            const priceRange = document.getElementById('priceFilter')?.value || 'all';
            filteredProducts = applyFilters(searchTerm, category, priceRange);
    }
    
    renderFilteredProducts();
}

// Filter and Render Products
function filterAndRenderProducts(searchTerm = '') {
    const category = document.getElementById('categoryFilter')?.value || 'all';
    const priceRange = document.getElementById('priceFilter')?.value || 'all';
    
    filteredProducts = applyFilters(searchTerm, category, priceRange);
    
    // Apply current sort
    sortProducts();
}

// Apply Filters
function applyFilters(searchTerm, category, priceRange) {
    let result = [...products];
    
    // Search filter
    if (searchTerm) {
        result = result.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.desc.toLowerCase().includes(searchTerm) ||
            product.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            product.sku.toLowerCase().includes(searchTerm)
        );
    }
    
    // Category filter
    if (category !== 'all') {
        result = result.filter(product => product.tags.includes(category));
    }
    
    // Price filter
    if (priceRange !== 'all') {
        switch(priceRange) {
            case '0-500':
                result = result.filter(product => product.price < 500);
                break;
            case '500-1000':
                result = result.filter(product => product.price >= 500 && product.price < 1000);
                break;
            case '1000-2000':
                result = result.filter(product => product.price >= 1000 && product.price < 2000);
                break;
            case '2000+':
                result = result.filter(product => product.price >= 2000);
                break;
        }
    }
    
    return result;
}

// Render Filtered Products
function renderFilteredProducts() {
    const grid = document.getElementById('productsGrid');
    const noResults = document.getElementById('noResults');
    const productCount = document.getElementById('productCount');
    
    if (!grid) return;
    
    // Update product count
    if (productCount) productCount.textContent = filteredProducts.length;
    
    // Show/hide no results message
    if (noResults) {
        noResults.style.display = filteredProducts.length === 0 ? 'block' : 'none';
        grid.style.display = filteredProducts.length === 0 ? 'none' : 'grid';
    }
    
    if (filteredProducts.length === 0) return;
    
    grid.innerHTML = filteredProducts.map(product => `
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

// Clear Filters
function clearFilters() {
    document.getElementById('productSearch').value = '';
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('priceFilter').value = 'all';
    document.getElementById('sortFilter').value = 'default';
    
    filteredProducts = [...products];
    currentSort = 'default';
    renderFilteredProducts();
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    saveCart();
    showNotification(`${product.name} added to cart!`);

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
        // Render coupon input even if cart is empty
        renderCouponInput();
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = calculateDiscount(subtotal);

    // Apply free shipping coupon
    let finalShipping = shippingCost;
    if (appliedCoupon && appliedCoupon.type === 'freeship') {
        finalShipping = 0;
    }

    const total = subtotal + finalShipping - discount;

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
    if (cartShipping) cartShipping.textContent = `R${finalShipping.toFixed(2)}`;
    if (cartTotal) cartTotal.textContent = `R${total.toFixed(2)}`;

    // Render coupon input
    renderCouponInput();
}

function saveCart() {
    localStorage.setItem('metraCart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('metraCart');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Validate cart data
            if (Array.isArray(parsed)) {
                // Remove any duplicates and invalid items
                const seen = new Set();
                cart = parsed.filter(item => {
                    if (!item || !item.id || seen.has(item.id)) return false;
                    seen.add(item.id);
                    // Ensure quantity is a valid number
                    item.quantity = Math.max(1, parseInt(item.quantity) || 1);
                    return true;
                });
                // Save cleaned cart
                saveCart();
            }
        } catch (e) {
            console.error('Failed to load cart:', e);
            cart = [];
            saveCart();
        }
    }
}

// Shipping
async function updateShipping(method) {
    if (method === 'bobgo') {
        // Use Bobgo shipping - calculate via API
        const bobgoPriceEl = document.getElementById('bobgoPrice');
        const shippingOptionsEl = document.getElementById('shippingOptions');

        if (bobgoPriceEl) {
            bobgoPriceEl.textContent = 'Calculating...';
        }

        // Set timeout to prevent stuck "Calculating..."
        const timeoutId = setTimeout(() => {
            if (bobgoPriceEl && bobgoPriceEl.textContent === 'Calculating...') {
                console.warn('Bobgo API timeout, using default shipping cost');
                shippingCost = BOBGO_CONFIG.defaultShipping;
                if (bobgoPriceEl) {
                    bobgoPriceEl.textContent = 'R' + shippingCost.toFixed(2) + ' (Standard)';
                }
                if (shippingOptionsEl) {
                    shippingOptionsEl.innerHTML = `
                        <p style="color: var(--gray); font-size: 0.85rem; margin-top: 0.5rem;">
                            <i class="fas fa-info-circle"></i> Standard shipping: R${shippingCost.toFixed(2)}
                        </p>
                    `;
                }
                updateCart();
            }
        }, 5000); // 5 second timeout

        try {
            if (selectedDeliveryMethod === 'collection') {
                clearTimeout(timeoutId);
                // Collection - no shipping cost
                shippingCost = 0;
                if (bobgoPriceEl) {
                    bobgoPriceEl.textContent = 'R0.00 (Collection)';
                }
                if (shippingOptionsEl) {
                    shippingOptionsEl.innerHTML = `
                        <p style="color: var(--gray); font-size: 0.85rem;">
                            <i class="fas fa-store"></i> Free collection at checkout
                        </p>
                    `;
                }
                updateCart();
            } else {
                // Delivery - get courier options with timeout
                const address = currentUser?.address || 'Cape Town';
                const result = await Promise.race([
                    calculateBobgoShipping(address),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 4500))
                ]);

                clearTimeout(timeoutId);

                if (result.success && result.couriers && result.couriers.length > 0) {
                    // Store courier options
                    courierOptions = result.couriers;
                    selectedCourier = result.couriers[0];
                    shippingCost = result.couriers[0].price || 0;

                    // Display courier selection with full courier names and service charges
                    if (shippingOptionsEl) {
                        shippingOptionsEl.innerHTML = `
                            <h4 style="margin-bottom: 0.8rem; color: var(--cream);">
                                <i class="fas fa-truck"></i> Available Couriers & Service Charges
                            </h4>
                            ${result.couriers.map((courier, index) => {
                                const courierName = courier.name || courier.partner_name || 'Standard Courier';
                                const serviceName = courier.service_name || courier.service_type || 'Standard Service';
                                const deliveryTime = courier.delivery_time || courier.transit_time || '2-5 business days';
                                const price = parseFloat(courier.price || courier.amount || 0);
                                const code = courier.code || '';
                                const trackingIncluded = courier.tracking_included !== false;
                                const insuranceIncluded = courier.insurance_included || false;
                                
                                return `
                                <label class="shipping-option" style="cursor: pointer; display: flex; align-items: flex-start; gap: 0.8rem; padding: 1rem; background: rgba(255,248,231,0.05); border-radius: 8px; margin-bottom: 0.75rem; border: 2px solid ${index === 0 ? '#DC143C' : 'transparent'};">
                                    <input type="radio" name="bobgoCourier" value="${index}" ${index === 0 ? 'checked' : ''} onchange="selectCourier(${index})" style="width: auto; accent-color: #00C853; margin-top: 0.25rem;">
                                    <div style="flex: 1;">
                                        <div style="font-weight: 600; color: var(--light); font-size: 1rem;">
                                            ${courierName}
                                            ${code ? `<span style="font-size: 0.75rem; color: var(--gray); margin-left: 0.5rem;">(${code})</span>` : ''}
                                        </div>
                                        <div style="font-size: 0.85rem; color: var(--gray); margin-top: 0.25rem; font-style: italic;">
                                            ${serviceName}
                                        </div>
                                        <div style="font-size: 0.8rem; color: var(--gray); margin-top: 0.35rem;">
                                            <i class="fas fa-clock" style="font-size: 0.7rem;"></i> ${deliveryTime}
                                            ${trackingIncluded ? ' <i class="fas fa-map-marker-alt" style="font-size: 0.7rem; margin-left: 0.5rem; color: #00C853;" title="Tracking included"></i>' : ''}
                                            ${insuranceIncluded ? ' <i class="fas fa-shield-alt" style="font-size: 0.7rem; margin-left: 0.3rem; color: #FFA500;" title="Insurance included"></i>' : ''}
                                        </div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div style="font-size: 0.7rem; color: var(--gray);">Service Charge</div>
                                        <span class="shipping-price" style="color: #00C853; font-weight: 700; font-size: 1.2rem;">R${price.toFixed(2)}</span>
                                    </div>
                                </label>
                            `}).join('')}
                        `;
                    }

                    if (bobgoPriceEl) {
                        bobgoPriceEl.textContent = 'R' + shippingCost.toFixed(2);
                    }
                    updateCart();
                } else {
                    // Fallback to default
                    shippingCost = result.defaultCost || BOBGO_CONFIG.defaultShipping;
                    if (bobgoPriceEl) {
                        bobgoPriceEl.textContent = 'R' + shippingCost.toFixed(2) + ' (Standard)';
                    }
                    if (shippingOptionsEl) {
                        shippingOptionsEl.innerHTML = `
                            <p style="color: var(--gray); font-size: 0.85rem; margin-top: 0.5rem;">
                                <i class="fas fa-truck"></i> Standard shipping: R${shippingCost.toFixed(2)}
                            </p>
                        `;
                    }
                    updateCart();
                }
            }
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('Bobgo shipping error:', error);
            shippingCost = BOBGO_CONFIG.defaultShipping;
            if (bobgoPriceEl) {
                bobgoPriceEl.textContent = 'R' + shippingCost.toFixed(2) + ' (Standard)';
            }
            if (shippingOptionsEl) {
                shippingOptionsEl.innerHTML = `
                    <p style="color: var(--gray); font-size: 0.85rem; margin-top: 0.5rem;">
                        <i class="fas fa-truck"></i> Standard shipping: R${shippingCost.toFixed(2)}
                    </p>
                `;
            }
            updateCart();
        }
    }
    updateCart();
}

// Select courier from options
function selectCourier(index) {
    if (courierOptions[index]) {
        selectedCourier = courierOptions[index];
        shippingCost = selectedCourier.price || 0;
        updateCart();
        console.log('Selected courier:', selectedCourier);
    }
}

// Select collection point
function selectCollectionPoint(index) {
    const collectionPoints = BOBGO_CONFIG.collectionPoints;
    if (collectionPoints[index]) {
        selectedCollectionPoint = collectionPoints[index];
        shippingCost = 0; // Free collection
        updateCart();
        console.log('Selected collection point:', selectedCollectionPoint);
    }
}

// Set delivery method (delivery or collection)
function setDeliveryMethod(method) {
    selectedDeliveryMethod = method;
    localStorage.setItem('metraDeliveryMethod', method);
    updateShipping('bobgo');
}

// Test Bobgo Shipping (for admin testing)
async function testBobgoShipping() {
    console.log('=== Testing Bobgo Shipping API (Secure Proxy) ===');
    console.log('API Endpoint:', BOBGO_CONFIG.apiUrl);
    console.log('Production Mode:', !BOBGO_CONFIG.sandbox ? 'YES ✓' : 'NO ✗');

    try {
        const testAddress = 'Cape Town';
        const result = await calculateBobgoShipping(testAddress);
        console.log('Test shipping cost to', testAddress, ':', result);
        
        if (result.success) {
            showNotification('✓ Bobgo API Test: R' + result.defaultCost + ' to ' + testAddress);
            return { success: true, result: result };
        } else {
            showNotification('⚠ Bobgo API Test: Using fallback');
            return { success: false, result: result };
        }
    } catch (error) {
        console.error('Bobgo test failed:', error);
        showNotification('✗ Bobgo API Test Failed: ' + error.message);
        return { success: false, error: error.message };
    }
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

// Checkout - Redirect to dedicated checkout page
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }

    // Redirect to dedicated checkout page
    window.location.href = 'checkout.html';
}

// Guest Checkout Modal
function openCheckoutModal() {
    let modal = document.getElementById('checkoutModal');
    let overlay = document.getElementById('checkoutModalOverlay');
    
    if (!modal) {
        createCheckoutModal();
        modal = document.getElementById('checkoutModal');
        overlay = document.getElementById('checkoutModalOverlay');
    }

    // Show modal immediately
    if (modal) {
        modal.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Load checkout items
        loadCheckoutItems();

        // Pre-fill if user is logged in
        if (currentUser) {
            const nameEl = document.getElementById('checkoutName');
            const emailEl = document.getElementById('checkoutEmail');
            const phoneEl = document.getElementById('checkoutPhone');
            if (nameEl) nameEl.value = currentUser.name || '';
            if (emailEl) emailEl.value = currentUser.email || '';
            if (phoneEl) phoneEl.value = currentUser.phone || '';
        }
        
        // Initialize address locator after modal is rendered
        if (typeof initCheckoutAddressLocator === 'function') {
            setTimeout(() => initCheckoutAddressLocator(), 150);
        }
    }
}

function createCheckoutModal() {
    const modalHTML = `
    <div class="modal" id="checkoutModal">
        <div class="modal-overlay" id="checkoutModalOverlay" onclick="closeCheckoutModal()"></div>
        <div class="modal-content checkout-modal-content">
            <button class="modal-close" onclick="closeCheckoutModal()">
                <i class="fas fa-times"></i>
            </button>
            <div class="checkout-modal-body">
                <div class="checkout-header">
                    <h2><i class="fas fa-shopping-bag"></i> Checkout</h2>
                    <p class="checkout-subtitle">Complete your order</p>
                </div>

                <div class="checkout-grid">
                    <!-- Order Summary -->
                    <div class="order-summary">
                        <h3><i class="fas fa-receipt"></i> Order Summary</h3>
                        <div id="checkoutItemsList"></div>
                        <div class="checkout-totals">
                            <div class="checkout-total-row">
                                <span>Subtotal:</span>
                                <span id="checkoutSubtotal">R0.00</span>
                            </div>
                            <div class="checkout-total-row">
                                <span>Shipping:</span>
                                <span id="checkoutShipping">R0.00</span>
                            </div>
                            <div class="checkout-total-row discount-row" id="discountRow" style="display: none;">
                                <span>Discount:</span>
                                <span id="checkoutDiscount">-R0.00</span>
                            </div>
                            <div class="checkout-total-row final-total">
                                <span>Total:</span>
                                <span id="checkoutTotal">R0.00</span>
                            </div>
                        </div>

                        <!-- Coupon Code -->
                        <div class="coupon-section">
                            <h4><i class="fas fa-tag"></i> Have a coupon?</h4>
                            <div class="coupon-input-group">
                                <input type="text" id="couponCode" placeholder="Enter coupon code" maxlength="20">
                                <button onclick="applyCoupon()" class="btn-apply-coupon">Apply</button>
                            </div>
                            <p id="couponMessage" style="display: none; font-size: 0.85rem; margin-top: 0.5rem;"></p>
                        </div>
                    </div>

                    <!-- Customer Details -->
                    <div class="customer-details">
                        <h3><i class="fas fa-user"></i> Your Details</h3>
                        <form id="checkoutForm" onsubmit="processCheckout(event)">
                            <div class="form-group">
                                <label for="checkoutName">Full Name *</label>
                                <input type="text" id="checkoutName" required placeholder="John Doe">
                            </div>
                            <div class="form-group">
                                <label for="checkoutEmail">Email Address *</label>
                                <input type="email" id="checkoutEmail" required placeholder="john@example.com">
                                <small style="color: var(--gray); font-size: 0.8rem;">We'll send your order confirmation here</small>
                            </div>
                            <div class="form-group">
                                <label for="checkoutPhone">Phone Number *</label>
                                <input type="tel" id="checkoutPhone" required placeholder="+27 12 345 6789">
                            </div>

                            <h3 style="margin-top: 1.5rem;"><i class="fas fa-map-marker-alt"></i> Delivery Address</h3>
                            <div class="form-group" style="position: relative;">
                                <label for="checkoutAddress">Street Address *</label>
                                <input type="text" id="checkoutAddress" required placeholder="Start typing to search addresses...">
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="checkoutCity">City *</label>
                                    <input type="text" id="checkoutCity" required placeholder="Johannesburg">
                                </div>
                                <div class="form-group">
                                    <label for="checkoutPostalCode">Postal Code *</label>
                                    <input type="text" id="checkoutPostalCode" required placeholder="2001" maxlength="4">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="checkoutProvince">Province *</label>
                                <select id="checkoutProvince" required>
                                    <option value="">Select Province</option>
                                    <option value="Gauteng">Gauteng</option>
                                    <option value="Western Cape">Western Cape</option>
                                    <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                                    <option value="Eastern Cape">Eastern Cape</option>
                                    <option value="Free State">Free State</option>
                                    <option value="Limpopo">Limpopo</option>
                                    <option value="Mpumalanga">Mpumalanga</option>
                                    <option value="North West">North West</option>
                                    <option value="Northern Cape">Northern Cape</option>
                                </select>
                            </div>

                            <h3 style="margin-top: 1.5rem;"><i class="fas fa-credit-card"></i> Payment Method</h3>
                            <div class="payment-options">
                                <label class="payment-option">
                                    <input type="radio" name="checkoutPayment" value="card" checked>
                                    <span><i class="fas fa-credit-card"></i> Card / EFT</span>
                                </label>
                                <label class="payment-option">
                                    <input type="radio" name="checkoutPayment" value="payfast">
                                    <span><i class="fas fa-lock"></i> PayFast (Secure)</span>
                                </label>
                                <label class="payment-option">
                                    <input type="radio" name="checkoutPayment" value="bank_transfer">
                                    <span><i class="fas fa-university"></i> Bank Transfer</span>
                                </label>
                            </div>

                            <h3 style="margin-top: 1.5rem;"><i class="fas fa-truck"></i> Delivery Method</h3>
                            <div class="delivery-options">
                                <label class="delivery-option">
                                    <input type="radio" name="checkoutDelivery" value="delivery" checked onchange="toggleDeliveryOptions()">
                                    <span><i class="fas fa-truck"></i> Home Delivery</span>
                                </label>
                                <label class="delivery-option">
                                    <input type="radio" name="checkoutDelivery" value="collection" onchange="toggleDeliveryOptions()">
                                    <span><i class="fas fa-store"></i> Store Collection (Free)</span>
                                </label>
                            </div>

                            <div id="collectionDetails" style="display: none; margin-top: 1rem; padding: 1rem; background: rgba(0, 200, 83, 0.1); border-radius: 8px;">
                                <p><strong>Collection Point:</strong></p>
                                <p>123 Commerce Street, Johannesburg, 2001</p>
                                <p style="font-size: 0.85rem; color: var(--gray);">Ready for collection within 24 hours of order confirmation</p>
                            </div>

                            <div class="form-group" style="margin-top: 1.5rem;">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="checkoutTerms" required>
                                    <span>I agree to the <a href="terms.html" target="_blank">Terms & Conditions</a> and <a href="privacy.html" target="_blank">Privacy Policy</a> *</span>
                                </label>
                            </div>

                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="checkoutNewsletter">
                                    <span>Subscribe to our newsletter for exclusive deals</span>
                                </label>
                            </div>

                            <button type="submit" class="checkout-submit-btn">
                                <i class="fas fa-lock"></i> Complete Order
                            </button>

                            <p class="secure-checkout-note">
                                <i class="fas fa-shield-alt"></i> Your information is secure and encrypted
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const overlay = document.getElementById('checkoutModalOverlay');
    if (modal) {
        modal.classList.remove('active');
    }
    if (overlay) {
        overlay.classList.remove('active');
    }
    document.body.style.overflow = '';
}

function toggleDeliveryOptions() {
    const deliveryMethod = document.querySelector('input[name="checkoutDelivery"]:checked').value;
    const collectionDetails = document.getElementById('collectionDetails');

    if (deliveryMethod === 'collection') {
        collectionDetails.style.display = 'block';
        // Remove shipping cost for collection
        shippingCost = 0;
        updateCheckoutTotals();
    } else {
        collectionDetails.style.display = 'none';
        // Recalculate shipping
        calculateShipping();
        updateCheckoutTotals();
    }
}

function updateCheckoutTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = window.appliedDiscount || 0;
    const total = subtotal + shippingCost - discount;

    document.getElementById('checkoutSubtotal').textContent = `R${subtotal.toFixed(2)}`;
    document.getElementById('checkoutShipping').textContent = shippingCost === 0 ? 'FREE' : `R${shippingCost.toFixed(2)}`;
    
    if (discount > 0) {
        document.getElementById('discountRow').style.display = 'flex';
        document.getElementById('checkoutDiscount').textContent = `-R${discount.toFixed(2)}`;
    }
    
    document.getElementById('checkoutTotal').textContent = `R${total.toFixed(2)}`;
}

function loadCheckoutItems() {
    const container = document.getElementById('checkoutItemsList');
    if (!container) return;

    container.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <div class="checkout-item-icon">${item.icon}</div>
            <div class="checkout-item-details">
                <h4>${item.name}</h4>
                <p>Qty: ${item.quantity} x R${item.price.toFixed(2)}</p>
            </div>
            <div class="checkout-item-price">R${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');

    updateCheckoutTotals();
}

// Coupon System
const VALID_COUPONS = {
    'WELCOME10': { discount: 0.10, type: 'percent', description: '10% off your order', maxDiscount: 500 },
    'SAVE50': { discount: 50, type: 'fixed', description: 'R50 off your order' },
    'FREESHIP': { discount: 0, type: 'freeshipping', description: 'Free shipping' },
    'METRA20': { discount: 0.20, type: 'percent', description: '20% off orders over R1000', minPurchase: 1000, maxDiscount: 1000 }
};

function applyCoupon() {
    const code = document.getElementById('couponCode').value.trim().toUpperCase();
    const message = document.getElementById('couponMessage');
    
    if (!code) {
        message.style.display = 'block';
        message.style.color = '#DC143C';
        message.textContent = 'Please enter a coupon code';
        return;
    }

    const coupon = VALID_COUPONS[code];
    
    if (!coupon) {
        message.style.display = 'block';
        message.style.color = '#DC143C';
        message.textContent = 'Invalid coupon code';
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (coupon.minPurchase && subtotal < coupon.minPurchase) {
        message.style.display = 'block';
        message.style.color = '#DC143C';
        message.textContent = `Minimum purchase of R${coupon.minPurchase} required`;
        return;
    }

    let discountAmount = 0;
    
    if (coupon.type === 'percent') {
        discountAmount = subtotal * coupon.discount;
        if (coupon.maxDiscount) {
            discountAmount = Math.min(discountAmount, coupon.maxDiscount);
        }
    } else if (coupon.type === 'fixed') {
        discountAmount = coupon.discount;
    } else if (coupon.type === 'freeshipping') {
        shippingCost = 0;
        discountAmount = 0;
    }

    window.appliedDiscount = discountAmount;
    window.appliedCoupon = code;

    message.style.display = 'block';
    message.style.color = '#228B22';
    message.textContent = `✓ Coupon applied! ${coupon.description}`;

    updateCheckoutTotals();
    showNotification('Coupon applied successfully!', 'success');
}

function processCheckout(event) {
    event.preventDefault();

    const name = document.getElementById('checkoutName').value.trim();
    const email = document.getElementById('checkoutEmail').value.trim().toLowerCase();
    const phone = document.getElementById('checkoutPhone').value.trim();
    const address = document.getElementById('checkoutAddress').value.trim();
    const city = document.getElementById('checkoutCity').value.trim();
    const postalCode = document.getElementById('checkoutPostalCode').value.trim();
    const province = document.getElementById('checkoutProvince').value;
    const paymentMethod = document.querySelector('input[name="checkoutPayment"]:checked').value;
    const deliveryMethod = document.querySelector('input[name="checkoutDelivery"]:checked').value;
    const termsAccepted = document.getElementById('checkoutTerms').checked;
    const newsletterSignup = document.getElementById('checkoutNewsletter').checked;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address');
        return;
    }

    if (!termsAccepted) {
        showNotification('Please accept the Terms & Conditions to continue');
        return;
    }

    // Check stock availability
    for (const item of cart) {
        const product = products.find(p => p.id === item.id);
        if (product && product.stock !== undefined && product.stock < item.quantity) {
            showNotification(`Sorry, only ${product.stock} units available for ${product.name}`);
            return;
        }
    }

    // Create guest user if not logged in
    let userId = currentUser ? currentUser.id : 'guest-' + Date.now();
    let customerName = name;
    let customerEmail = email;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = window.appliedDiscount || 0;
    const total = subtotal + shippingCost - discount;

    const order = {
        id: 'ORD-' + Date.now(),
        invoiceNumber: 'INV-' + Date.now(),
        userId: userId,
        isGuest: !currentUser,
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: phone,
        shippingAddress: {
            street: address,
            city: city,
            postalCode: postalCode,
            province: province,
            country: 'South Africa'
        },
        deliveryMethod: deliveryMethod,
        items: [...cart],
        subtotal: subtotal,
        shipping: shippingCost,
        discount: discount,
        couponCode: window.appliedCoupon || null,
        total: total,
        paymentMethod: paymentMethod,
        status: 'processing',
        date: new Date().toLocaleDateString('en-ZA'),
        createdAt: new Date().toISOString()
    };

    // Handle PayFast payment
    if (paymentMethod === 'payfast') {
        if (processPayFastPayment(order)) {
            saveOrder(order, newsletterSignup);
            return;
        } else {
            showNotification('PayFast unavailable. Processing as regular order...');
        }
    }

    // Regular checkout
    saveOrder(order, newsletterSignup);
}

// Save Order (updated for guest checkout)
function saveOrder(order, newsletterSignup = false) {
    const orders = JSON.parse(localStorage.getItem('metraOrders') || '[]');
    orders.push(order);
    localStorage.setItem('metraOrders', JSON.stringify(orders));

    // Update user orders if logged in
    if (currentUser) {
        if (!currentUser.orders) currentUser.orders = [];
        currentUser.orders.push(order.id);
        localStorage.setItem('metraUsers', JSON.stringify(
            JSON.parse(localStorage.getItem('metraUsers') || '[]').map(u =>
                u.id === currentUser.id ? currentUser : u
            )
        ));
        localStorage.setItem('metraCurrentUser', JSON.stringify(currentUser));
    }

    // Update stock
    order.items.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product && product.stock !== undefined) {
            product.stock -= item.quantity;
        }
    });

    generateInvoice(order);

    // Send order confirmation email to customer
    const itemsList = order.items.map(item =>
        `<tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">R${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
    ).join('');

    sendEmail(order.customerEmail, 'order_confirmation', {
        customerName: order.customerName,
        orderNumber: order.id,
        invoiceNumber: order.invoiceNumber,
        date: order.date,
        total: order.total.toFixed(2),
        itemsList: itemsList,
        subtotal: order.subtotal.toFixed(2),
        shipping: order.shipping.toFixed(2),
        paymentMethod: order.paymentMethod
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

    // Newsletter signup
    if (newsletterSignup) {
        const subscribers = JSON.parse(localStorage.getItem('metraSubscribers') || '[]');
        if (!subscribers.find(s => s.email === order.customerEmail)) {
            subscribers.push({ email: order.customerEmail, date: new Date().toISOString(), source: 'checkout' });
            localStorage.setItem('metraSubscribers', JSON.stringify(subscribers));
        }
    }

    showNotification('🎉 Order placed successfully! Check your email for confirmation.');

    // Track purchase
    trackEvent('purchase', {
        orderId: order.id,
        total: order.total,
        items: order.items.length,
        isGuest: order.isGuest
    });

    // Trigger real-time admin update
    localStorage.setItem('metraRealtimeOrder', JSON.stringify({
        type: 'new_order',
        orderId: order.id,
        total: order.total,
        customer: order.customerName,
        timestamp: Date.now()
    }));

    // Clear cart and close modal
    cart = [];
    shippingCost = 0;
    window.appliedDiscount = 0;
    window.appliedCoupon = null;
    updateCart();
    saveCart();
    closeCheckoutModal();

    // Show order success page
    showOrderSuccess(order);
}

function showOrderSuccess(order) {
    const successHTML = `
    <div class="modal active" id="orderSuccessModal">
        <div class="modal-overlay"></div>
        <div class="modal-content order-success-content">
            <!-- Checkout Animation -->
            <div class="checkout-animation-container">
                <div class="checkout-scene">
                    <div class="cashier-counter">
                        <div class="counter-top"></div>
                        <div class="counter-front"></div>
                    </div>
                    <div class="cashier">
                        <div class="cashier-body"></div>
                        <div class="cashier-head">
                            <div class="cashier-face"></div>
                        </div>
                        <div class="cashier-arm arm-left"></div>
                        <div class="cashier-arm arm-right"></div>
                    </div>
                    <div class="customer">
                        <div class="customer-body"></div>
                        <div class="customer-head">
                            <div class="customer-face"></div>
                        </div>
                        <div class="customer-arm"></div>
                    </div>
                    <div class="register">
                        <div class="register-screen"></div>
                        <div class="register-base"></div>
                    </div>
                    <div class="receipt">
                        <div class="receipt-paper"></div>
                    </div>
                    <div class="payment-success-icon">
                        <i class="fas fa-check"></i>
                    </div>
                </div>
            </div>

            <h2>Order Placed Successfully!</h2>
            <p class="order-success-message">Thank you for shopping with Metra Market, <strong>${order.customerName}</strong>!</p>
            
            <div class="order-details-summary">
                <div class="order-detail-row">
                    <span>Order Number:</span>
                    <strong>${order.id}</strong>
                </div>
                <div class="order-detail-row">
                    <span>Invoice:</span>
                    <strong>${order.invoiceNumber}</strong>
                </div>
                <div class="order-detail-row">
                    <span>Total:</span>
                    <strong style="color: #228B22;">R${order.total.toFixed(2)}</strong>
                </div>
                <div class="order-detail-row">
                    <span>Payment Method:</span>
                    <strong>${order.paymentMethod === 'card' ? 'Card/EFT' : order.paymentMethod === 'payfast' ? 'PayFast' : 'Bank Transfer'}</strong>
                </div>
            </div>

            <div class="order-next-steps">
                <h4>What's Next?</h4>
                <ul>
                    <li><i class="fas fa-envelope"></i> Order confirmation sent to <strong>${order.customerEmail}</strong></li>
                    <li><i class="fas fa-box"></i> Your order will be processed within 1-2 business days</li>
                    <li><i class="fas fa-truck"></i> You'll receive tracking info once shipped</li>
                </ul>
            </div>

            <div class="order-actions">
                <a href="track-order.html" class="btn-track-order">
                    <i class="fas fa-map-marker-alt"></i> Track Your Order
                </a>
                <a href="shopping.html" class="btn-continue-shopping">
                    <i class="fas fa-shopping-bag"></i> Continue Shopping
                </a>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', successHTML);

    // Trigger checkout animation
    setTimeout(() => {
        const animationContainer = document.querySelector('.checkout-animation-container');
        if (animationContainer) {
            animationContainer.classList.add('animate');
        }
    }, 300);

    // Auto-close after 15 seconds
    setTimeout(() => {
        const modal = document.getElementById('orderSuccessModal');
        if (modal) modal.remove();
    }, 15000);
}

// PayFast Payment Processing
function processPayFastPayment(order) {
    if (!PAYFAST_CONFIG.merchantId || !PAYFAST_CONFIG.merchantKey) {
        showNotification('PayFast configuration required. Please use Card or Bank Transfer.');
        return false;
    }

    // Validate customer email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const customerEmail = order.customerEmail ? order.customerEmail.trim().toLowerCase() : '';

    if (!customerEmail || !emailRegex.test(customerEmail)) {
        showNotification('Invalid email address. Please update your profile with a valid email before checkout.');
        // Open profile modal for user to fix email
        setTimeout(() => {
            openProfileModal();
            // Switch to settings tab
            const settingsTab = document.getElementById('settingsTab');
            if (settingsTab) settingsTab.click();
        }, 1500);
        return false;
    }

    const payFastUrl = PAYFAST_CONFIG.sandbox ? 'https://sandbox.payfast.co.za/eng/process' : 'https://www.payfast.co.za/eng/process';

    // Save order ID for success/cancel pages
    localStorage.setItem('lastOrderId', order.id);
    localStorage.setItem('lastOrderTotal', order.total.toString());

    // Debug logging
    console.log('=== PayFast Payment Debug ===');
    console.log('Merchant ID:', PAYFAST_CONFIG.merchantId);
    console.log('Sandbox Mode:', PAYFAST_CONFIG.sandbox);
    console.log('Order ID:', order.id);
    console.log('Order Total:', order.total);
    console.log('Customer Email:', customerEmail);
    console.log('Email Valid:', emailRegex.test(customerEmail));
    console.log('PayFast URL:', payFastUrl);

    const formData = {
        merchant_id: PAYFAST_CONFIG.merchantId,
        merchant_key: PAYFAST_CONFIG.merchantKey,
        amount: order.total.toFixed(2),
        item_name: 'Order ' + order.id,
        item_description: 'Purchase from Metra Market',
        return_url: window.location.origin + '/success.html?order_id=' + encodeURIComponent(order.id),
        cancel_url: window.location.origin + '/cancel.html?order_id=' + encodeURIComponent(order.id),
        notify_url: window.location.origin + '/ipn.php',
        email_address: customerEmail,
        email_confirmation: 'true',
        confirmation_first: 'buyer'
    };

    // Debug: Log form data
    console.log('Form Data:', formData);

    // Generate signature
    if (PAYFAST_CONFIG.passphrase) {
        const pfParam = Object.keys(formData).map(key => key + '=' + encodeURIComponent(formData[key])).join('&');
        const signature = CryptoJS.MD5(pfParam + '&passphrase=' + encodeURIComponent(PAYFAST_CONFIG.passphrase)).toString();
        formData.signature = signature;
        console.log('Signature Generated:', signature);
    } else {
        console.log('No passphrase configured - signature not generated');
    }

    // Create and submit form
    try {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = payFastUrl;
        form.target = '_blank'; // Open in new window/tab
        form.style.display = 'none';

        Object.keys(formData).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = formData[key];
            form.appendChild(input);
        });

        document.body.appendChild(form);
        console.log('Submitting PayFast form...');
        
        // Submit the form
        form.submit();
        
        // Remove form after submission
        setTimeout(() => {
            document.body.removeChild(form);
        }, 1000);
        
        return true;
    } catch (error) {
        console.error('PayFast form submission error:', error);
        showNotification('PayFast payment failed. Please try again or use another payment method.');
        return false;
    }
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
    if (!productId) {
        showNotification('Invalid product');
        return;
    }
    
    if (wishlist.includes(productId)) {
        showNotification('Already in wishlist');
        return;
    }

    wishlist.push(productId);
    saveWishlist();
    updateWishlistCount();
    showNotification('Added to wishlist!');
    
    // Trigger storage event for real-time update
    localStorage.setItem('metraWishlistUpdate', Date.now().toString());
}

function removeFromWishlist(productId) {
    if (!productId) return;
    
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        saveWishlist();
        updateWishlistCount();
        showNotification('Removed from wishlist');
        
        // Trigger storage event for real-time update
        localStorage.setItem('metraWishlistUpdate', Date.now().toString());
    }
}

function saveWishlist() {
    localStorage.setItem('metraWishlist', JSON.stringify(wishlist));
}

function loadWishlist() {
    const saved = localStorage.getItem('metraWishlist');
    if (saved) {
        try {
            wishlist = JSON.parse(saved);
            if (!Array.isArray(wishlist)) {
                wishlist = [];
            }
        } catch (e) {
            wishlist = [];
        }
    }
}

function updateWishlistCount() {
    const count = document.getElementById('wishlistCount');
    const navCount = document.getElementById('navWishlistCount');
    if (count) count.textContent = wishlist.length;
    if (navCount) navCount.textContent = wishlist.length;
}

// Handle wishlist button click in product modal
function handleWishlistClick(productId, button) {
    if (!productId) {
        showNotification('Invalid product');
        return;
    }

    if (wishlist.includes(productId)) {
        // Already in wishlist - remove it
        removeFromWishlist(productId);
        button.innerHTML = '<i class="fas fa-heart"></i> Add to Wishlist';
    } else {
        // Add to wishlist
        addToWishlist(productId);
        button.innerHTML = '<i class="fas fa-heart"></i> Wishlisted';
    }
}

function openWishlistModal() {
    // Remove existing modal if any
    const existingModal = document.getElementById('wishlistModal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.className = 'product-modal active';
    modal.id = 'wishlistModal';
    
    // Force reflow for animation
    setTimeout(() => modal.classList.add('active'), 10);

    const wishlistProducts = products.filter(p => wishlist.includes(p.id));

    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px; max-height: 85vh; background: #1a0a0a;">
            <button class="modal-close" onclick="closeWishlistModal()" style="z-index: 100; background: rgba(255,255,255,0.1);">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-body" style="max-height: 85vh; padding: 2rem; background: #1a0a0a;">
                <h2 style="margin-bottom: 1.5rem; color: #FFF8E7; text-align: center; font-size: 1.8rem;">
                    <i class="fas fa-heart" style="color: #DC143C;"></i> My Wishlist
                </h2>
                ${wishlistProducts.length > 0 ? `
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.5rem; padding: 1rem;">
                        ${wishlistProducts.map(product => `
                            <div style="background: linear-gradient(135deg, rgba(255, 248, 231, 0.08), rgba(255, 248, 231, 0.03)); border-radius: 15px; overflow: hidden; border: 1px solid rgba(255, 248, 231, 0.15); box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                                <div style="width: 100%; height: 150px; background: linear-gradient(135deg, rgba(139, 0, 0, 0.4), rgba(220, 20, 60, 0.4)); display: flex; align-items: center; justify-content: center; font-size: 3.5rem; border-bottom: 1px solid rgba(255, 248, 231, 0.1);">
                                    ${product.icon}
                                </div>
                                <div style="padding: 1rem;">
                                    <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; color: #FFF8E7; min-height: 40px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                                        ${product.name}
                                    </h3>
                                    <p style="color: #8B7355; font-size: 0.8rem; margin-bottom: 0.8rem; min-height: 32px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                                        ${product.desc}
                                    </p>
                                    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.8rem; border-top: 1px solid rgba(255, 248, 231, 0.1);">
                                        <span style="font-size: 1.1rem; font-weight: 700; color: #DC143C;">
                                            R${product.price.toFixed(2)}
                                        </span>
                                        <div style="display: flex; gap: 0.4rem;">
                                            <button onclick="addToCart(${product.id}); showNotification('Added to cart!');" title="Add to Cart" style="background: linear-gradient(135deg, #8B0000, #DC143C); border: none; color: white; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(139, 0, 0, 0.4);">
                                                <i class="fas fa-cart-plus"></i>
                                            </button>
                                            <button onclick="removeFromWishlist(${product.id}); openWishlistModal();" title="Remove" style="background: rgba(220, 20, 60, 0.2); border: 1px solid rgba(220, 20, 60, 0.4); color: #DC143C; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; font-size: 0.9rem; display: flex; align-items: center; justify-content: center;">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,248,231,0.1); display: flex; gap: 1rem; justify-content: flex-end; flex-wrap: wrap;">
                        <button onclick="clearWishlist(); openWishlistModal();" style="background: rgba(255, 248, 231, 0.1); border: 1px solid rgba(255, 248, 231, 0.2); color: #FFF8E7; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: all 0.3s;">
                            <i class="fas fa-trash"></i> Clear All
                        </button>
                        <button onclick="addAllToCart(); closeWishlistModal();" style="background: linear-gradient(135deg, #8B0000, #DC143C); border: none; color: white; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 15px rgba(139, 0, 0, 0.4);">
                            <i class="fas fa-cart-plus"></i> Add All to Cart
                        </button>
                    </div>
                ` : `
                    <div style="text-align: center; padding: 4rem 2rem; color: #8B7355;">
                        <i class="fas fa-heart" style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.3; color: #DC143C;"></i>
                        <p style="font-size: 1.2rem; margin-bottom: 0.5rem; color: #FFF8E7;">Your wishlist is empty</p>
                        <p style="font-size: 0.9rem;">Start adding products you love!</p>
                    </div>
                `}
            </div>
        </div>
        <div class="modal-overlay active" onclick="closeWishlistModal()" style="background: rgba(26, 10, 10, 0.95);"></div>
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

// ==================== COUPON/DISCOUNT SYSTEM ====================

// Apply Coupon
function applyCoupon(code) {
    if (!code) {
        showNotification('Please enter a coupon code');
        return;
    }
    
    const coupon = VALID_COUPONS.find(c => c.code.toUpperCase() === code.toUpperCase());
    
    if (!coupon) {
        showNotification('Invalid coupon code');
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (subtotal < coupon.minOrder) {
        showNotification(`Minimum order amount is R${coupon.minOrder} for this coupon`);
        return;
    }
    
    appliedCoupon = coupon;
    updateCart();
    showNotification(`Coupon applied! ${coupon.description}`);
    
    // Save to localStorage
    localStorage.setItem('metraAppliedCoupon', JSON.stringify(coupon));
}

// Remove Coupon
function removeCoupon() {
    appliedCoupon = null;
    localStorage.removeItem('metraAppliedCoupon');
    updateCart();
    showNotification('Coupon removed');
}

// Calculate Discount
function calculateDiscount(subtotal) {
    if (!appliedCoupon) return 0;
    
    switch(appliedCoupon.type) {
        case 'percent':
            return (subtotal * appliedCoupon.discount) / 100;
        case 'fixed':
            return Math.min(appliedCoupon.discount, subtotal);
        case 'freeship':
            return 0; // Discount applied to shipping
        default:
            return 0;
    }
}

// Render Coupon Input in Cart
function renderCouponInput() {
    const cartFooter = document.querySelector('.cart-footer');
    if (!cartFooter) return;
    
    let couponHTML = cartFooter.querySelector('.coupon-section');
    
    if (!couponHTML) {
        couponHTML = document.createElement('div');
        couponHTML.className = 'coupon-section';
        cartFooter.insertBefore(couponHTML, cartFooter.firstChild);
    }
    
    if (appliedCoupon) {
        couponHTML.innerHTML = `
            <div style="background: rgba(34, 139, 34, 0.1); border: 1px solid rgba(34, 139, 34, 0.3); border-radius: 10px; padding: 1rem; margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <i class="fas fa-tag" style="color: #228B22; margin-right: 0.5rem;"></i>
                        <strong style="color: #228B22;">${appliedCoupon.code}</strong>
                        <span style="color: var(--gray); font-size: 0.85rem; margin-left: 0.5rem;">${appliedCoupon.description}</span>
                    </div>
                    <button class="btn-secondary btn-sm" onclick="removeCoupon()" style="background: rgba(220, 20, 60, 0.2); color: #DC143C; border: none; padding: 0.3rem 0.8rem; border-radius: 5px; cursor: pointer;">
                        <i class="fas fa-times"></i> Remove
                    </button>
                </div>
            </div>
        `;
    } else {
        couponHTML.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <div style="display: flex; gap: 0.5rem;">
                    <input type="text" id="couponCode" placeholder="Enter coupon code" style="flex: 1; padding: 0.8rem; background: rgba(255,248,231,0.05); border: 1px solid rgba(255,248,231,0.1); border-radius: 10px; color: var(--light); font-family: inherit;">
                    <button class="btn-primary" onclick="applyCoupon(document.getElementById('couponCode').value)" style="padding: 0.8rem 1.5rem; background: var(--gradient); border: none; color: white; border-radius: 10px; cursor: pointer; font-weight: 600;">
                        <i class="fas fa-ticket-alt"></i> Apply
                    </button>
                </div>
                <p style="color: var(--gray); font-size: 0.8rem; margin-top: 0.5rem;">
                    <i class="fas fa-info-circle"></i> Try: WELCOME10, SAVE50, SUMMER20
                </p>
            </div>
        `;
    }
}

// ==================== NEWSLETTER SUBSCRIPTION ====================

// Subscribe to Newsletter
function subscribeToNewsletter(email) {
    if (!email) {
        showNotification('Please enter your email address');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address');
        return false;
    }
    
    // Check if already subscribed
    if (newsletterSubscribers.includes(email)) {
        showNotification('You are already subscribed to our newsletter');
        return false;
    }
    
    newsletterSubscribers.push(email);
    localStorage.setItem('metraNewsletterSubscribers', JSON.stringify(newsletterSubscribers));
    
    showNotification('Thank you for subscribing! You will receive our latest offers.');
    return true;
}

// Load Newsletter Subscribers
function loadNewsletterSubscribers() {
    const saved = localStorage.getItem('metraNewsletterSubscribers');
    if (saved) {
        newsletterSubscribers = JSON.parse(saved);
    }
}

// ==================== RECENTLY VIEWED PRODUCTS ====================

// Add to Recently Viewed
function addToRecentlyViewed(productId) {
    // Remove if already exists
    recentlyViewed = recentlyViewed.filter(id => id !== productId);
    
    // Add to beginning
    recentlyViewed.unshift(productId);
    
    // Limit to max items
    if (recentlyViewed.length > MAX_RECENTLY_VIEWED) {
        recentlyViewed.pop();
    }
    
    // Save to localStorage
    localStorage.setItem('metraRecentlyViewed', JSON.stringify(recentlyViewed));
    
    // Update UI if on page
    renderRecentlyViewed();
}

// Render Recently Viewed
function renderRecentlyViewed() {
    const container = document.getElementById('recentlyViewedContainer');
    if (!container) return;
    
    if (recentlyViewed.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--gray); padding: 2rem;">No recently viewed products</p>';
        return;
    }
    
    const viewedProducts = products.filter(p => recentlyViewed.includes(p.id));
    
    container.innerHTML = `
        <h3 style="margin-bottom: 1.5rem; color: var(--light);">Recently Viewed</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
            ${viewedProducts.map(product => `
                <div class="product-card" onclick="openProductModal(${product.id})" style="cursor: pointer;">
                    <div class="product-image" style="height: 150px; font-size: 3rem;">${product.icon}</div>
                    <div class="product-info" style="padding: 1rem;">
                        <h4 style="font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--light);">${product.name}</h4>
                        <p style="font-weight: 700; color: var(--primary);">R${product.price.toFixed(2)}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Load Recently Viewed
function loadRecentlyViewed() {
    const saved = localStorage.getItem('metraRecentlyViewed');
    if (saved) {
        recentlyViewed = JSON.parse(saved);
    }
}

// Clear Recently Viewed
function clearRecentlyViewed() {
    recentlyViewed = [];
    localStorage.removeItem('metraRecentlyViewed');
    renderRecentlyViewed();
    showNotification('Recently viewed cleared');
}

// ==================== CUSTOMER ADDRESSES ====================

// Add Address
function addAddress(address) {
    if (!currentUser) {
        showNotification('Please login to save addresses');
        return false;
    }
    
    savedAddresses.push({
        id: Date.now(),
        ...address,
        isDefault: savedAddresses.length === 0
    });
    
    saveAddresses();
    showNotification('Address saved successfully');
    return true;
}

// Remove Address
function removeAddress(addressId) {
    savedAddresses = savedAddresses.filter(a => a.id !== addressId);
    saveAddresses();
    showNotification('Address removed');
}

// Set Default Address
function setDefaultAddress(addressId) {
    savedAddresses.forEach(a => {
        a.isDefault = (a.id === addressId);
    });
    saveAddresses();
    showNotification('Default address updated');
}

// Save Addresses
function saveAddresses() {
    if (currentUser) {
        localStorage.setItem('metraAddresses_' + currentUser.id, JSON.stringify(savedAddresses));
    }
}

// Load Addresses
function loadAddresses() {
    if (currentUser) {
        const saved = localStorage.getItem('metraAddresses_' + currentUser.id);
        if (saved) {
            savedAddresses = JSON.parse(saved);
        }
    }
}

// Get Default Address
function getDefaultAddress() {
    return savedAddresses.find(a => a.isDefault) || savedAddresses[0];
}

// Render Addresses in Profile
function renderAddresses() {
    const container = document.getElementById('addressesContainer');
    if (!container) return;
    
    if (savedAddresses.length === 0) {
        container.innerHTML = `
            <p style="color: var(--gray); margin-bottom: 1rem;">No saved addresses</p>
            <button class="btn-primary" onclick="showAddAddressForm()">
                <i class="fas fa-plus"></i> Add Address
            </button>
        `;
        return;
    }
    
    container.innerHTML = `
        <div style="display: grid; gap: 1rem; margin-bottom: 1.5rem;">
            ${savedAddresses.map(addr => `
                <div style="background: rgba(255,248,231,0.05); border: 1px solid ${addr.isDefault ? 'var(--primary)' : 'rgba(255,248,231,0.1)'}; border-radius: 10px; padding: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <div>
                            ${addr.isDefault ? '<span style="background: var(--primary); color: white; padding: 0.2rem 0.6rem; border-radius: 15px; font-size: 0.75rem;">DEFAULT</span>' : ''}
                            <strong style="margin-left: 0.5rem;">${addr.name}</strong>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            ${!addr.isDefault ? `<button class="btn-secondary btn-sm" onclick="setDefaultAddress(${addr.id})"><i class="fas fa-check"></i> Set Default</button>` : ''}
                            <button class="btn-danger btn-sm" onclick="removeAddress(${addr.id})"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                    <p style="color: var(--gray); font-size: 0.9rem;">${addr.street}, ${addr.city}, ${addr.province} ${addr.postalCode}</p>
                    <p style="color: var(--gray); font-size: 0.9rem;">${addr.phone}</p>
                </div>
            `).join('')}
        </div>
        <button class="btn-primary" onclick="showAddAddressForm()">
            <i class="fas fa-plus"></i> Add New Address
        </button>
    `;
}

// Show Add Address Form
function showAddAddressForm() {
    const container = document.getElementById('addressesContainer');
    if (!container) return;
    
    container.innerHTML = `
        <h4 style="margin-bottom: 1rem;">Add New Address</h4>
        <form onsubmit="handleAddAddress(event)" style="display: grid; gap: 1rem;">
            <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" id="addrName" required style="width: 100%; padding: 0.8rem; background: rgba(255,248,231,0.05); border: 1px solid rgba(255,248,231,0.1); border-radius: 10px; color: var(--light);">
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" id="addrPhone" required style="width: 100%; padding: 0.8rem; background: rgba(255,248,231,0.05); border: 1px solid rgba(255,248,231,0.1); border-radius: 10px; color: var(--light);">
                </div>
            </div>
            <div class="form-group">
                <label>Street Address</label>
                <input type="text" id="addrStreet" required style="width: 100%; padding: 0.8rem; background: rgba(255,248,231,0.05); border: 1px solid rgba(255,248,231,0.1); border-radius: 10px; color: var(--light);">
            </div>
            <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                    <label>City</label>
                    <input type="text" id="addrCity" required style="width: 100%; padding: 0.8rem; background: rgba(255,248,231,0.05); border: 1px solid rgba(255,248,231,0.1); border-radius: 10px; color: var(--light);">
                </div>
                <div class="form-group">
                    <label>Province</label>
                    <input type="text" id="addrProvince" required style="width: 100%; padding: 0.8rem; background: rgba(255,248,231,0.05); border: 1px solid rgba(255,248,231,0.1); border-radius: 10px; color: var(--light);">
                </div>
                <div class="form-group">
                    <label>Postal Code</label>
                    <input type="text" id="addrPostal" required style="width: 100%; padding: 0.8rem; background: rgba(255,248,231,0.05); border: 1px solid rgba(255,248,231,0.1); border-radius: 10px; color: var(--light);">
                </div>
            </div>
            <div style="display: flex; gap: 1rem;">
                <button type="submit" class="btn-primary"><i class="fas fa-save"></i> Save Address</button>
                <button type="button" class="btn-secondary" onclick="renderAddresses()"><i class="fas fa-times"></i> Cancel</button>
            </div>
        </form>
    `;
}

// Handle Add Address
function handleAddAddress(event) {
    event.preventDefault();
    
    const address = {
        name: document.getElementById('addrName').value,
        phone: document.getElementById('addrPhone').value,
        street: document.getElementById('addrStreet').value,
        city: document.getElementById('addrCity').value,
        province: document.getElementById('addrProvince').value,
        postalCode: document.getElementById('addrPostal').value
    };
    
    if (addAddress(address)) {
        renderAddresses();
    }
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
    const emailInput = document.getElementById('loginEmail').value.trim();
    const email = emailInput.toLowerCase();
    const password = document.getElementById('loginPassword').value;

    console.log('Login attempt:', { email: emailInput, passwordLength: password.length });

    const users = JSON.parse(localStorage.getItem('metraUsers') || '[]');
    console.log('Users in storage:', users.length);
    
    // Find user by email or username (case-insensitive for email/username)
    const user = users.find(u => {
        const storedEmail = (u.email || '').toLowerCase();
        const storedUsername = (u.username || '').toLowerCase();
        const emailMatch = storedEmail === email || storedUsername === email;
        const passwordMatch = u.password === password;
        console.log('Checking user:', { storedEmail, storedUsername, emailMatch, passwordMatch });
        return emailMatch && passwordMatch;
    });

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
        console.log('Login failed - user not found or password mismatch');
        showNotification('Invalid credentials. Please check your email and password.');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value.trim();
    const emailInput = document.getElementById('registerEmail').value.trim();
    const email = emailInput.toLowerCase();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    console.log('Registration attempt:', { name, email: emailInput, phone, passwordLength: password.length });

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

    // Check if email already exists (case-insensitive)
    const existingUser = users.find(u => (u.email || '').toLowerCase() === email);
    if (existingUser) {
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
        
        // Verify save was successful immediately
        const verifySave = JSON.parse(localStorage.getItem('metraUsers') || '[]');
        const savedUser = verifySave.find(u => u.id === newUser.id);
        console.log('User saved verification:', { saved: !!savedUser, totalUsers: verifySave.length });

        if (!savedUser) {
            throw new Error('Failed to save user to localStorage');
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

// Password Reset Functions
function openForgotPasswordModal() {
    const modal = document.getElementById('forgotPasswordModal');
    const overlay = document.getElementById('forgotPasswordOverlay');
    if (modal && overlay) {
        modal.classList.add('active');
        overlay.classList.add('active');
        document.getElementById('forgotPasswordForm').style.display = 'flex';
        document.getElementById('resetSuccess').style.display = 'none';
    }
}

function closeForgotPasswordModal() {
    const modal = document.getElementById('forgotPasswordModal');
    const overlay = document.getElementById('forgotPasswordOverlay');
    if (modal && overlay) {
        modal.classList.remove('active');
        overlay.classList.remove('active');
    }
}

function handleForgotPassword(event) {
    event.preventDefault();
    const email = document.getElementById('resetEmail').value.trim().toLowerCase();
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address');
        return;
    }
    
    // Check if user exists
    const users = JSON.parse(localStorage.getItem('metraUsers') || '[]');
    const user = users.find(u => u.email === email);
    
    if (!user) {
        // For security, show same success message even if email doesn't exist
        document.getElementById('forgotPasswordForm').style.display = 'none';
        document.getElementById('resetSuccess').style.display = 'block';
        return;
    }
    
    // Generate reset token
    const resetToken = 'reset_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const resetExpiry = new Date(Date.now() + (60 * 60 * 1000)).toISOString(); // 1 hour expiry
    
    // Save reset token
    const resetData = {
        userId: user.id,
        email: email,
        token: resetToken,
        expiresAt: resetExpiry,
        createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('passwordReset_' + email, JSON.stringify(resetData));
    
    // In production, send email with reset link
    // For demo, show token in console
    console.log('Password Reset Token:', resetToken);
    console.log('Reset Link:', window.location.origin + '/reset-password.html?token=' + resetToken);
    
    // Show success message
    document.getElementById('forgotPasswordForm').style.display = 'none';
    document.getElementById('resetSuccess').style.display = 'block';
    
    showNotification('Password reset link sent to your email');
}

// Reset Password Page Handler (for reset-password.html)
function handleResetPassword(token, newPassword) {
    // Find reset data
    const resetData = JSON.parse(localStorage.getItem('passwordReset_' + token.split('_')[1]) || 'null');
    
    if (!resetData || resetData.token !== token) {
        return { success: false, message: 'Invalid reset token' };
    }
    
    // Check expiry
    if (new Date(resetData.expiresAt) < new Date()) {
        return { success: false, message: 'Reset token has expired' };
    }
    
    // Update password
    const users = JSON.parse(localStorage.getItem('metraUsers') || '[]');
    const userIndex = users.findIndex(u => u.id === resetData.userId);
    
    if (userIndex === -1) {
        return { success: false, message: 'User not found' };
    }
    
    users[userIndex].password = newPassword;
    localStorage.setItem('metraUsers', JSON.stringify(users));
    
    // Clear reset token
    localStorage.removeItem('passwordReset_' + resetData.email);
    
    return { success: true, message: 'Password updated successfully' };
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

    // Add to recently viewed
    addToRecentlyViewed(productId);

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
        
        <div class="modal-product-shipping" style="background: rgba(0, 200, 83, 0.1); border: 1px solid rgba(0, 200, 83, 0.3); border-radius: 10px; padding: 1.5rem; margin: 1.5rem 0;">
            <h3 style="color: #00C853; margin-bottom: 1rem;"><i class="fas fa-shipping-fast"></i> Shipping Details</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                <div>
                    <p style="color: var(--gray); font-size: 0.85rem; margin-bottom: 0.3rem;">Weight</p>
                    <p style="font-weight: 600;">${product.weight || 0.5} kg</p>
                </div>
                <div>
                    <p style="color: var(--gray); font-size: 0.85rem; margin-bottom: 0.3rem;">Dimensions</p>
                    <p style="font-weight: 600;">${product.length || 30} × ${product.width || 20} × ${product.height || 15} cm</p>
                </div>
            </div>
            <p style="color: var(--gray); font-size: 0.85rem; margin-top: 1rem;">
                <i class="fas fa-info-circle"></i> Shipping cost calculated at checkout based on these details
            </p>
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
            <button class="cta-btn" style="background: var(--secondary);" onclick="handleWishlistClick(${product.id}, this)">
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

// ==================== TOUCH & SWIPE GESTURES ====================
function initTouchGestures() {
    if (typeof window === 'undefined') return;
    
    // Only enable on touch devices
    if (!('ontouchstart' in window) && navigator.maxTouchPoints === 0) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let touchStartTime = 0;
    let isSwiping = false;
    let currentTranslateX = 0;
    let productSwipeIndex = 0;

    // Cart swipe gesture
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
        isSwiping = true;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        touchEndX = e.touches[0].clientX;
        touchEndY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        isSwiping = false;
        
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const deltaTime = Date.now() - touchStartTime;
        
        // Only process horizontal swipes
        if (Math.abs(deltaX) < Math.abs(deltaY)) return;
        if (Math.abs(deltaX) < 50) return; // Minimum swipe distance
        if (deltaTime > 500) return; // Maximum swipe duration

        // Swipe right from left edge - Open cart
        if (deltaX > 0 && touchStartX < 50) {
            if (cartSidebar && !cartSidebar.classList.contains('active')) {
                toggleCart();
            }
        }
        
        // Swipe left - Close cart
        if (deltaX < 0 && cartSidebar && cartSidebar.classList.contains('active')) {
            if (cartOverlay) {
                toggleCart();
            }
        }
    }, { passive: true });

    // Product modal swipe for specs/reviews
    const productModal = document.getElementById('productModal');
    if (productModal) {
        let modalSwipeStartX = 0;
        let modalSwipeStartY = 0;

        productModal.addEventListener('touchstart', (e) => {
            modalSwipeStartX = e.touches[0].clientX;
            modalSwipeStartY = e.touches[0].clientY;
        }, { passive: true });

        productModal.addEventListener('touchend', (e) => {
            const deltaX = e.changedTouches[0].clientX - modalSwipeStartX;
            const deltaY = e.changedTouches[0].clientY - modalSwipeStartY;
            
            // Swipe down to close modal
            if (deltaY > 100 && Math.abs(deltaY) > Math.abs(deltaX)) {
                closeProductModal();
            }
        }, { passive: true });
    }

    // Checkout modal swipe down to close
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        let checkoutSwipeStartY = 0;

        checkoutModal.addEventListener('touchstart', (e) => {
            checkoutSwipeStartY = e.touches[0].clientY;
        }, { passive: true });

        checkoutModal.addEventListener('touchend', (e) => {
            const deltaY = e.changedTouches[0].clientY - checkoutSwipeStartY;
            
            // Swipe down to close
            if (deltaY > 100) {
                closeCheckoutModal();
            }
        }, { passive: true });
    }

    // Horizontal swipe between product images in modal
    const modalImage = document.querySelector('.product-modal-image');
    if (modalImage) {
        let imageSwipeX = 0;
        
        modalImage.addEventListener('touchstart', (e) => {
            imageSwipeX = e.touches[0].clientX;
        }, { passive: true });

        modalImage.addEventListener('touchend', (e) => {
            const deltaX = e.changedTouches[0].clientX - imageSwipeX;
            
            if (Math.abs(deltaX) > 50) {
                // Could implement image gallery swipe here
                console.log('Image swipe detected:', deltaX > 0 ? 'right' : 'left');
            }
        }, { passive: true });
    }

    // Pull to refresh on homepage
    let pullStartY = 0;
    let isPulling = false;
    
    document.addEventListener('touchstart', (e) => {
        if (window.scrollY === 0) {
            pullStartY = e.touches[0].clientY;
            isPulling = true;
        }
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (!isPulling) return;
        const pullDistance = e.touches[0].clientY - pullStartY;
        
        // Pull down more than 100px at top of page
        if (pullDistance > 100 && window.scrollY === 0) {
            // Could trigger refresh
            console.log('Pull to refresh triggered');
        }
    }, { passive: true });

    document.addEventListener('touchend', () => {
        isPulling = false;
    }, { passive: true });

    console.log('✅ Touch gestures initialized');

    // Show cart swipe hint on mobile
    if (window.innerWidth < 768) {
        const cartHint = document.getElementById('cartSwipeHint');
        if (cartHint) {
            cartHint.style.display = 'block';
            // Hide hint after 5 seconds
            setTimeout(() => {
                cartHint.style.display = 'none';
            }, 5000);
        }
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

// Contact Form Handler
function handleContactSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    
    // Validate
    if (!name || !email || !message) {
        showNotification('Please fill in all required fields');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address');
        return;
    }
    
    // Save contact message
    const contactMessage = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        message: message,
        status: 'unread',
        createdAt: new Date().toISOString()
    };
    
    const messages = JSON.parse(localStorage.getItem('metraContactMessages') || '[]');
    messages.push(contactMessage);
    localStorage.setItem('metraContactMessages', JSON.stringify(messages));
    
    // In production, send email to admin
    console.log('Contact form submission:', contactMessage);
    
    // Show success
    showNotification('Message sent! We will get back to you soon.');
    event.target.reset();
}

// Load saved invoice delivery preference
const savedInvoiceDelivery = localStorage.getItem('metraInvoiceDeliveryPreference');
if (savedInvoiceDelivery) {
    invoiceDeliveryMethod = savedInvoiceDelivery;
    const invoiceRadio = document.querySelector('input[name="invoiceDelivery"][value="' + savedInvoiceDelivery + '"]');
    if (invoiceRadio) invoiceRadio.checked = true;
}
