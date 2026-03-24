// Supabase Configuration for Vercel
// This file should NOT be committed with real credentials
// Use environment variables in production

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'your-anon-key';

// Supabase client (browser-compatible)
// For API routes, we use direct fetch calls

// Initialize Supabase client for browser
function createSupabaseClient() {
    if (typeof window !== 'undefined' && window.supabase) {
        return window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
    return null;
}

// API helper functions
async function apiRequest(endpoint, options = {}) {
    const url = `${SUPABASE_URL}${endpoint}`;
    
    const headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        ...options.headers
    };

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
    }

    return response.json();
}

// Database operations
const db = {
    // Users
    users: {
        getAll: () => apiRequest('/rest/v1/users?select=*'),
        getById: (id) => apiRequest(`/rest/v1/users?id=eq.${id}`),
        getByEmail: (email) => apiRequest(`/rest/v1/users?email=eq.${email}`),
        create: (data) => apiRequest('/rest/v1/users', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        update: (id, data) => apiRequest(`/rest/v1/users?id=eq.${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        }),
        delete: (id) => apiRequest(`/rest/v1/users?id=eq.${id}`, {
            method: 'DELETE'
        })
    },

    // Products
    products: {
        getAll: () => apiRequest('/rest/v1/products?select=*'),
        getById: (id) => apiRequest(`/rest/v1/products?id=eq.${id}`),
        create: (data) => apiRequest('/rest/v1/products', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        update: (id, data) => apiRequest(`/rest/v1/products?id=eq.${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        }),
        delete: (id) => apiRequest(`/rest/v1/products?id=eq.${id}`, {
            method: 'DELETE'
        })
    },

    // Orders
    orders: {
        getAll: (options = {}) => {
            let query = '/rest/v1/orders?select=*';
            if (options.userId) query += `&user_id=eq.${options.userId}`;
            if (options.status) query += `&status=eq.${options.status}`;
            if (options.limit) query += `&limit=${options.limit}`;
            return apiRequest(query);
        },
        getById: (id) => apiRequest(`/rest/v1/orders?id=eq.${id}`),
        getByOrderNumber: (orderNumber) => apiRequest(`/rest/v1/orders?order_number=eq.${orderNumber}`),
        create: (data) => apiRequest('/rest/v1/orders', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        update: (id, data) => apiRequest(`/rest/v1/orders?id=eq.${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        }),
        delete: (id) => apiRequest(`/rest/v1/orders?id=eq.${id}`, {
            method: 'DELETE'
        })
    },

    // Invoices
    invoices: {
        getAll: () => apiRequest('/rest/v1/invoices?select=*'),
        getById: (id) => apiRequest(`/rest/v1/invoices?id=eq.${id}`),
        getByInvoiceNumber: (invoiceNumber) => apiRequest(`/rest/v1/invoices?invoice_number=eq.${invoiceNumber}`),
        create: (data) => apiRequest('/rest/v1/invoices', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        update: (id, data) => apiRequest(`/rest/v1/invoices?id=eq.${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        })
    },

    // Analytics
    analytics: {
        track: (data) => apiRequest('/rest/v1/analytics', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        getEvents: (options = {}) => {
            let query = '/rest/v1/analytics?select=*';
            if (options.eventType) query += `&event_type=eq.${options.eventType}`;
            if (options.days) {
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - options.days);
                query += `&created_at=gte.${startDate.toISOString()}`;
            }
            return apiRequest(query);
        },
        getStats: async (days = 30) => {
            const events = await db.analytics.getEvents({ days });
            return {
                totalEvents: events.length,
                eventsByType: events.reduce((acc, e) => {
                    acc[e.event_type] = (acc[e.event_type] || 0) + 1;
                    return acc;
                }, {})
            };
        }
    },

    // Sessions
    sessions: {
        create: (data) => apiRequest('/rest/v1/sessions', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        getByToken: (token) => apiRequest(`/rest/v1/sessions?session_token=eq.${token}`),
        delete: (id) => apiRequest(`/rest/v1/sessions?id=eq.${id}`, {
            method: 'DELETE'
        }),
        deleteExpired: () => apiRequest('/rest/v1/sessions?expires_at=lt.' + new Date().toISOString(), {
            method: 'DELETE'
        }),
        getByUserId: (userId) => apiRequest(`/rest/v1/sessions?user_id=eq.${userId}`)
    }
};

// Export for use in API routes and browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { db, apiRequest, createSupabaseClient, SUPABASE_URL, SUPABASE_KEY };
}
