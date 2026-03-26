// Mailgun Email Integration
// Configure with your Mailgun credentials via environment variables

const MAILGUN_CONFIG = {
    apiKey: process.env.MAILGUN_API_KEY || '', // Set in Vercel environment variables
    domain: process.env.MAILGUN_DOMAIN || 'mg.metramarket.co.za',
    apiUrl: 'https://api.mailgun.net/v3'
};

// NOTE: Add these environment variables in Vercel:
// MAILGUN_API_KEY=your-api-key-here
// MAILGUN_DOMAIN=mg.metramarket.co.za

// Send email via Mailgun API
async function sendEmailViaMailgun(to, subject, html, text = '') {
    if (!MAILGUN_CONFIG.apiKey || !MAILGUN_CONFIG.domain) {
        console.error('Mailgun not configured - using fallback');
        return { success: false, error: 'Mailgun not configured' };
    }

    const formData = new FormData();
    formData.append('from', `Metra Market <noreply@${MAILGUN_CONFIG.domain}>`);
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('html', html);
    if (text) {
        formData.append('text', text);
    }

    try {
        const response = await fetch(`${MAILGUN_CONFIG.apiUrl}/${MAILGUN_CONFIG.domain}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(`api:${MAILGUN_CONFIG.apiKey}`)
            },
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            console.log('Email sent via Mailgun:', result.id);
            return { success: true, id: result.id };
        } else {
            console.error('Mailgun error:', result);
            return { success: false, error: result.message };
        }
    } catch (error) {
        console.error('Mailgun request failed:', error);
        return { success: false, error: error.message };
    }
}

// Send order confirmation
async function sendOrderConfirmationEmail(order) {
    const itemsList = order.items.map(item => 
        `<tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">R${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
    ).join('');

    const html = `
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
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Order Confirmation</h1>
                    <p>Thank you for shopping with Metra Market!</p>
                </div>
                <div class="content">
                    <p>Dear ${order.customerName},</p>
                    <p>Your order has been received and is being processed.</p>
                    
                    <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Order Number:</strong> ${order.id}</p>
                        <p><strong>Invoice:</strong> ${order.invoiceNumber}</p>
                        <p><strong>Date:</strong> ${order.date}</p>
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
                            ${itemsList}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="2" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
                                <td style="padding: 10px; text-align: right;">R${order.subtotal.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colspan="2" style="padding: 10px; text-align: right;"><strong>Shipping:</strong></td>
                                <td style="padding: 10px; text-align: right;">R${order.shipping.toFixed(2)}</td>
                            </tr>
                            <tr class="total">
                                <td colspan="2" style="padding: 15px 10px; text-align: right;">Total:</td>
                                <td style="padding: 15px 10px; text-align: right;">R${order.total.toFixed(2)}</td>
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

    const text = `
        Order Confirmation - Metra Market
        
        Dear ${order.customerName},
        
        Your order has been received!
        
        Order Number: ${order.id}
        Invoice: ${order.invoiceNumber}
        Date: ${order.date}
        Total: R${order.total.toFixed(2)}
        
        Thank you for shopping with Metra Market!
    `;

    return await sendEmailViaMailgun(order.customerEmail, `Order Confirmation - ${order.id}`, html, text);
}

// Send admin notification for new order
async function sendAdminOrderNotification(order) {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; }
                .alert { background: #228B22; color: white; padding: 20px; border-radius: 10px; }
                .details { background: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px; }
                .btn { display: inline-block; padding: 12px 30px; background: #8B0000; color: white; text-decoration: none; border-radius: 5px; }
            </style>
        </head>
        <body>
            <div class="alert">
                <h1>🛒 New Order Received!</h1>
            </div>
            <div class="details">
                <p><strong>Order ID:</strong> ${order.id}</p>
                <p><strong>Customer:</strong> ${order.customerName} (${order.customerEmail})</p>
                <p><strong>Total:</strong> R${order.total.toFixed(2)}</p>
                <p><strong>Items:</strong> ${order.items.length}</p>
                <p><strong>Payment:</strong> ${order.paymentMethod}</p>
            </div>
            <p>
                <a href="${process.env.BASE_URL || 'http://localhost:3000'}/admin.html" class="btn">View in Admin Dashboard</a>
            </p>
        </body>
        </html>
    `;

    return await sendEmailViaMailgun(
        MAILGUN_CONFIG.adminEmail || 'admin@metramarket.co.za',
        `New Order: ${order.id}`,
        html
    );
}

// Send password reset email
async function sendPasswordResetEmail(userEmail, resetToken) {
    const resetUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/reset-password.html?token=${resetToken}`;
    
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #8B0000, #DC143C); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 20px; }
                .btn { display: inline-block; padding: 15px 40px; background: #8B0000; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
                .footer { background: #8B0000; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔑 Password Reset Request</h1>
                </div>
                <div class="content">
                    <p>You requested a password reset for your Metra Market account.</p>
                    <p style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" class="btn">Reset Password</a>
                    </p>
                    <p>This link expires in 1 hour.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2026 Metra Market. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    return await sendEmailViaMailgun(userEmail, 'Password Reset Request', html);
}

// Send contact form notification to admin
async function sendContactFormNotification(contactData) {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .message { background: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0; }
                .details { background: white; padding: 15px; border-radius: 5px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>📧 New Contact Form Submission</h2>
                <div class="details">
                    <p><strong>From:</strong> ${contactData.name} (${contactData.email})</p>
                    ${contactData.phone ? `<p><strong>Phone:</strong> ${contactData.phone}</p>` : ''}
                </div>
                <div class="message">
                    <h3>Message:</h3>
                    <p>${contactData.message}</p>
                </div>
            </div>
        </body>
        </html>
    `;

    return await sendEmailViaMailgun(
        MAILGUN_CONFIG.adminEmail || 'admin@metramarket.co.za',
        `Contact Form: ${contactData.name}`,
        html
    );
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sendEmailViaMailgun,
        sendOrderConfirmationEmail,
        sendAdminOrderNotification,
        sendPasswordResetEmail,
        sendContactFormNotification,
        MAILGUN_CONFIG
    };
}
