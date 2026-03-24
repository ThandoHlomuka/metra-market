// Neon Database Configuration for Vercel
// Uses serverless Postgres connection

const NEON_DATABASE_URL = process.env.NEON_DATABASE_URL || '';

// Email Configuration
const EMAIL_CONFIG = {
    smtp: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASSWORD || ''
        }
    },
    imap: {
        host: process.env.IMAP_HOST || 'imap.gmail.com',
        port: parseInt(process.env.IMAP_PORT || '993'),
        tls: true,
        auth: {
            user: process.env.IMAP_USER || '',
            pass: process.env.IMAP_PASSWORD || ''
        }
    },
    from: process.env.EMAIL_FROM || 'noreply@metramarket.co.za',
    adminEmail: process.env.ADMIN_EMAIL || 'admin@metramarket.co.za'
};

// Database connection helper
async function getNeonClient() {
    if (!NEON_DATABASE_URL) {
        throw new Error('NEON_DATABASE_URL not configured');
    }
    
    // For Vercel serverless functions, we use direct SQL over HTTP
    const response = await fetch(NEON_DATABASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: 'SELECT 1' })
    });
    
    if (!response.ok) {
        throw new Error('Database connection failed');
    }
    
    return { query: executeNeonQuery };
}

// Execute SQL query on Neon
async function executeNeonQuery(sql, params = []) {
    if (!NEON_DATABASE_URL) {
        // Fallback to localStorage if no database
        console.log('No database URL, using localStorage');
        return { rows: [] };
    }

    try {
        const response = await fetch(NEON_DATABASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sql, params })
        });

        if (!response.ok) {
            throw new Error(`Query failed: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

// Database operations with Neon
const db = {
    // Users
    users: {
        getAll: async () => {
            const result = await executeNeonQuery('SELECT * FROM users ORDER BY created_at DESC');
            return result.rows || [];
        },
        getById: async (id) => {
            const result = await executeNeonQuery('SELECT * FROM users WHERE id = $1', [id]);
            return result.rows?.[0] || null;
        },
        getByEmail: async (email) => {
            const result = await executeNeonQuery('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
            return result.rows?.[0] || null;
        },
        create: async (data) => {
            const result = await executeNeonQuery(
                `INSERT INTO users (name, email, username, phone, password, provider, created_at, last_active) 
                 VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) 
                 RETURNING *`,
                [data.name, data.email, data.username, data.phone, data.password, data.provider || 'email']
            );
            return result.rows?.[0];
        },
        update: async (id, data) => {
            const fields = Object.keys(data).map((k, i) => `${k} = $${i + 1}`).join(', ');
            const values = Object.values(data);
            const result = await executeNeonQuery(
                `UPDATE users SET ${fields}, last_active = NOW() WHERE id = $${values.length + 1} RETURNING *`,
                [...values, id]
            );
            return result.rows?.[0];
        },
        updateLastActive: async (id) => {
            await executeNeonQuery('UPDATE users SET last_active = NOW() WHERE id = $1', [id]);
        },
        delete: async (id) => {
            await executeNeonQuery('DELETE FROM users WHERE id = $1', [id]);
        }
    },

    // Orders
    orders: {
        getAll: async (options = {}) => {
            let sql = 'SELECT * FROM orders';
            const params = [];
            const conditions = [];
            
            if (options.userId) {
                params.push(options.userId);
                conditions.push(`user_id = $${params.length}`);
            }
            if (options.status) {
                params.push(options.status);
                conditions.push(`status = $${params.length}`);
            }
            
            if (conditions.length > 0) {
                sql += ' WHERE ' + conditions.join(' AND ');
            }
            sql += ' ORDER BY created_at DESC';
            
            const result = await executeNeonQuery(sql, params);
            return result.rows || [];
        },
        getById: async (id) => {
            const result = await executeNeonQuery('SELECT * FROM orders WHERE id = $1', [id]);
            return result.rows?.[0] || null;
        },
        getByOrderNumber: async (orderNumber) => {
            const result = await executeNeonQuery('SELECT * FROM orders WHERE order_number = $1', [orderNumber]);
            return result.rows?.[0] || null;
        },
        create: async (data) => {
            const result = await executeNeonQuery(
                `INSERT INTO orders (order_number, invoice_number, user_id, customer_name, customer_email, items, subtotal, shipping, total, payment_method, payment_status, invoice_delivery, status) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
                 RETURNING *`,
                [data.orderNumber, data.invoiceNumber, data.userId, data.customerName, data.customerEmail, 
                 JSON.stringify(data.items), data.subtotal, data.shipping, data.total, data.paymentMethod, 
                 'pending', data.invoiceDelivery, data.status || 'processing']
            );
            return result.rows?.[0];
        },
        updateStatus: async (id, status) => {
            const result = await executeNeonQuery(
                'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
                [status, id]
            );
            return result.rows?.[0];
        },
        updatePaymentStatus: async (id, status) => {
            const result = await executeNeonQuery(
                'UPDATE orders SET payment_status = $1 WHERE id = $2 RETURNING *',
                [status, id]
            );
            return result.rows?.[0];
        }
    },

    // Analytics
    analytics: {
        track: async (data) => {
            await executeNeonQuery(
                `INSERT INTO analytics (event_type, user_id, session_id, page_url, metadata, created_at) 
                 VALUES ($1, $2, $3, $4, $5, NOW())`,
                [data.eventType, data.userId, data.sessionId, data.pageUrl, JSON.stringify(data.metadata)]
            );
        },
        getEvents: async (options = {}) => {
            let sql = 'SELECT * FROM analytics';
            const params = [];
            const conditions = [];
            
            if (options.eventType) {
                params.push(options.eventType);
                conditions.push(`event_type = $${params.length}`);
            }
            if (options.days) {
                params.push(options.days);
                conditions.push(`created_at >= NOW() - INTERVAL '${options.days} days'`);
            }
            
            if (conditions.length > 0) {
                sql += ' WHERE ' + conditions.join(' AND ');
            }
            sql += ' ORDER BY created_at DESC';
            
            const result = await executeNeonQuery(sql, params);
            return result.rows || [];
        },
        getStats: async (days = 30) => {
            const events = await db.analytics.getEvents({ days });
            return {
                totalEvents: events.length,
                visitors: new Set(events.filter(e => e.event_type === 'page_view').map(e => e.session_id)).size,
                pageViews: events.filter(e => e.event_type === 'page_view').length,
                addToCarts: events.filter(e => e.event_type === 'add_to_cart').length,
                purchases: events.filter(e => e.event_type === 'purchase').length
            };
        }
    },

    // Sessions
    sessions: {
        create: async (data) => {
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry
            
            const result = await executeNeonQuery(
                `INSERT INTO sessions (user_id, session_token, ip_address, user_agent, expires_at) 
                 VALUES ($1, $2, $3, $4, $5) 
                 RETURNING *`,
                [data.userId, data.sessionToken, data.ipAddress, data.userAgent, expiresAt]
            );
            return result.rows?.[0];
        },
        getByToken: async (token) => {
            const result = await executeNeonQuery(
                'SELECT * FROM sessions WHERE session_token = $1 AND expires_at > NOW()',
                [token]
            );
            return result.rows?.[0] || null;
        },
        delete: async (id) => {
            await executeNeonQuery('DELETE FROM sessions WHERE id = $1', [id]);
        },
        deleteExpired: async () => {
            await executeNeonQuery('DELETE FROM sessions WHERE expires_at < NOW()');
        },
        getByUserId: async (userId) => {
            const result = await executeNeonQuery(
                'SELECT * FROM sessions WHERE user_id = $1 AND expires_at > NOW()',
                [userId]
            );
            return result.rows || [];
        }
    }
};

// Email functions
const email = {
    // Send order confirmation
    sendOrderConfirmation: async (order) => {
        const subject = `Order Confirmation - ${order.invoiceNumber}`;
        const html = `
            <h1>Thank you for your order!</h1>
            <p>Dear ${order.customerName},</p>
            <p>Your order has been received and is being processed.</p>
            <h2>Order Details</h2>
            <p><strong>Order ID:</strong> ${order.orderNumber}</p>
            <p><strong>Invoice:</strong> ${order.invoiceNumber}</p>
            <p><strong>Total:</strong> R${order.total.toFixed(2)}</p>
            <h3>Items:</h3>
            <ul>
                ${order.items.map(item => `<li>${item.name} x ${item.quantity} - R${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
            </ul>
            <p>We will notify you when your order ships.</p>
            <p>Thank you for shopping with Metra Market!</p>
        `;
        
        return email.send(order.customerEmail, subject, html);
    },

    // Send invoice
    sendInvoice: async (invoice) => {
        const subject = `Invoice ${invoice.invoiceNumber} - Metra Market`;
        const html = `
            <h1>Invoice</h1>
            <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-ZA')}</p>
            <h2>Bill To:</h2>
            <p>${invoice.customerName}<br>${invoice.customerEmail}</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <thead>
                    <tr style="background: #8B0000; color: white;">
                        <th style="padding: 10px; text-align: left;">Item</th>
                        <th style="padding: 10px;">Qty</th>
                        <th style="padding: 10px;">Price</th>
                        <th style="padding: 10px;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoice.items.map(item => `
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 10px;">${item.name}</td>
                            <td style="padding: 10px; text-align: center;">${item.quantity}</td>
                            <td style="padding: 10px; text-align: right;">R${item.price.toFixed(2)}</td>
                            <td style="padding: 10px; text-align: right;">R${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
                        <td style="padding: 10px; text-align: right;">R${invoice.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="padding: 10px; text-align: right;"><strong>Shipping:</strong></td>
                        <td style="padding: 10px; text-align: right;">R${invoice.shipping.toFixed(2)}</td>
                    </tr>
                    <tr style="font-size: 1.2em; font-weight: bold; background: #f0f0f0;">
                        <td colspan="3" style="padding: 10px; text-align: right;">Total:</td>
                        <td style="padding: 10px; text-align: right;">R${invoice.total.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
            <p>Thank you for your business!</p>
        `;
        
        return email.send(invoice.customerEmail, subject, html);
    },

    // Send admin notification for new order
    sendAdminNotification: async (order) => {
        const subject = `New Order Received - ${order.orderNumber}`;
        const html = `
            <h1>New Order Alert</h1>
            <p><strong>Order ID:</strong> ${order.orderNumber}</p>
            <p><strong>Customer:</strong> ${order.customerName} (${order.customerEmail})</p>
            <p><strong>Total:</strong> R${order.total.toFixed(2)}</p>
            <p><strong>Items:</strong> ${order.items.length}</p>
            <p>Please process this order in the admin dashboard.</p>
        `;
        
        return email.send(EMAIL_CONFIG.adminEmail, subject, html);
    },

    // Send password reset
    sendPasswordReset: async (user, resetToken) => {
        const subject = 'Password Reset Request - Metra Market';
        const html = `
            <h1>Password Reset</h1>
            <p>Hi ${user.name},</p>
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <p><a href="${process.env.BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}" 
               style="display: inline-block; padding: 10px 20px; background: #8B0000; color: white; text-decoration: none; border-radius: 5px;">
               Reset Password
            </a></p>
            <p>This link expires in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        `;
        
        return email.send(user.email, subject, html);
    },

    // Generic send function
    send: async (to, subject, html) => {
        // In production, use a proper email service
        // For now, log the email
        console.log('Sending email:', { to, subject, html: html.substring(0, 100) + '...' });
        
        // Call API endpoint to send email
        try {
            const response = await fetch('/api/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to, subject, html })
            });
            
            if (!response.ok) {
                throw new Error('Failed to send email');
            }
            
            return { success: true };
        } catch (error) {
            console.error('Email send error:', error);
            // Fallback: store email in localStorage for later sending
            const pendingEmails = JSON.parse(localStorage.getItem('metraPendingEmails') || '[]');
            pendingEmails.push({ to, subject, html, createdAt: new Date().toISOString() });
            localStorage.setItem('metraPendingEmails', JSON.stringify(pendingEmails));
            
            return { success: false, error: error.message };
        }
    }
};

// Export for use in API routes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { db, email, EMAIL_CONFIG, getNeonClient, executeNeonQuery };
}
