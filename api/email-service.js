// Metra Market Email Service
// Connects frontend to serverless Mailgun API

const API_BASE = window.location.origin;

// Core email sending function
async function sendEmail({ to, subject, html, text, from, replyTo }) {
    try {
        const response = await fetch(`${API_BASE}/api/send-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to, subject, html, text, from, replyTo })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            console.log('✅ Email sent:', result.id);
            return { success: true, id: result.id };
        } else {
            console.error('❌ Email failed:', result.error);
            return { success: false, error: result.error || result.message };
        }
    } catch (error) {
        console.error('❌ Email sending error:', error);
        return { success: false, error: error.message };
    }
}

// Batch email sending
async function sendBatchEmail({ emails, subject, html, text, from }) {
    try {
        const response = await fetch(`${API_BASE}/api/send-batch-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emails, subject, html, text, from })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            console.log(`✅ Batch email sent: ${result.successCount}/${result.total} successful`);
            return result;
        } else {
            console.error('❌ Batch email failed:', result.error);
            return { success: false, error: result.error || result.message };
        }
    } catch (error) {
        console.error('❌ Batch email error:', error);
        return { success: false, error: error.message };
    }
}

// Email Templates
const EMAIL_TEMPLATES = {
    order_confirmation: (data) => ({
        subject: `Order Confirmation - ${data.invoiceNumber || data.orderNumber}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 0 auto; }
                    .header { background: linear-gradient(135deg, #8B0000, #DC143C); color: white; padding: 30px; text-align: center; }
                    .header h1 { margin: 0; font-size: 28px; }
                    .content { background: #f9f9f9; padding: 30px; }
                    .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .order-details p { margin: 8px 0; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; }
                    th { background: #8B0000; color: white; padding: 12px; text-align: left; }
                    td { padding: 12px; border-bottom: 1px solid #ddd; }
                    .total { font-size: 1.4em; font-weight: bold; color: #8B0000; }
                    .footer { background: #8B0000; color: white; padding: 20px; text-align: center; font-size: 12px; }
                    .footer a { color: #FFD700; text-decoration: none; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🛒 Order Confirmation</h1>
                        <p style="margin: 10px 0 0 0;">Thank you for shopping with Metra Market!</p>
                    </div>
                    <div class="content">
                        <p>Dear <strong>${data.customerName}</strong>,</p>
                        <p>Your order has been received and is being processed.</p>

                        <div class="order-details">
                            <p><strong>Order Number:</strong> ${data.orderNumber || data.invoiceNumber}</p>
                            <p><strong>Invoice:</strong> ${data.invoiceNumber}</p>
                            <p><strong>Date:</strong> ${data.date}</p>
                            <p><strong>Payment Method:</strong> ${data.paymentMethod || 'PayFast'}</p>
                        </div>

                        <h3>Order Summary</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Qty</th>
                                    <th style="text-align: right;">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.itemsList || ''}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="2" style="text-align: right;"><strong>Subtotal:</strong></td>
                                    <td style="text-align: right;">R${data.subtotal || data.total}</td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="text-align: right;"><strong>Shipping:</strong></td>
                                    <td style="text-align: right;">R${data.shipping || '0.00'}</td>
                                </tr>
                                <tr class="total">
                                    <td colspan="2" style="text-align: right;">Total:</td>
                                    <td style="text-align: right;">R${data.total}</td>
                                </tr>
                            </tfoot>
                        </table>

                        <p>We'll notify you when your order ships. Thank you for shopping with Metra Market!</p>
                        
                        <p style="margin-top: 30px;">
                            <a href="${data.trackOrderUrl || window.location.origin + '/track-order.html'}" 
                               style="display: inline-block; padding: 12px 30px; background: #8B0000; color: white; text-decoration: none; border-radius: 5px;">
                                Track Your Order
                            </a>
                        </p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2026 Metra Market. All rights reserved.</p>
                        <p>Questions? Contact us at <a href="mailto:support@metramarket.co.za">support@metramarket.co.za</a></p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
            Order Confirmation - Metra Market
            
            Dear ${data.customerName},
            
            Your order has been received!
            
            Order Number: ${data.orderNumber || data.invoiceNumber}
            Invoice: ${data.invoiceNumber}
            Date: ${data.date}
            Total: R${data.total}
            
            Thank you for shopping with Metra Market!
        `
    }),

    admin_new_order: (data) => ({
        subject: `🛒 New Order: ${data.orderNumber}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .alert { background: #228B22; color: white; padding: 25px; text-align: center; }
                    .alert h1 { margin: 0; }
                    .details { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; }
                    .details p { margin: 10px 0; }
                    .btn { display: inline-block; padding: 12px 30px; background: #8B0000; color: white; text-decoration: none; border-radius: 5px; }
                    .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="alert">
                    <h1>🛒 New Order Received!</h1>
                </div>
                <div class="details">
                    <p><strong>Order ID:</strong> ${data.orderNumber}</p>
                    <p><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</p>
                    <p><strong>Total:</strong> R${data.total}</p>
                    <p><strong>Items:</strong> ${data.itemCount}</p>
                    <p><strong>Payment:</strong> ${data.paymentMethod}</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleString('en-ZA')}</p>
                </div>
                <p style="text-align: center;">
                    <a href="${data.adminUrl || window.location.origin + '/admin.html'}" class="btn">View in Admin Dashboard</a>
                </p>
                <div class="footer">
                    <p>Metra Market Admin Notification System</p>
                </div>
            </body>
            </html>
        `,
        text: `
            New Order Received!
            
            Order ID: ${data.orderNumber}
            Customer: ${data.customerName} (${data.customerEmail})
            Total: R${data.total}
            Items: ${data.itemCount}
            Payment: ${data.paymentMethod}
        `
    }),

    password_reset: (data) => ({
        subject: '🔑 Password Reset Request - Metra Market',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .container { max-width: 600px; margin: 0 auto; }
                    .header { background: linear-gradient(135deg, #8B0000, #DC143C); color: white; padding: 30px; text-align: center; }
                    .content { background: #f9f9f9; padding: 30px; }
                    .btn { display: inline-block; padding: 15px 40px; background: #8B0000; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
                    .footer { background: #8B0000; color: white; padding: 20px; text-align: center; font-size: 12px; }
                    .warning { background: #FFF3CD; border: 1px solid #FFC107; padding: 15px; border-radius: 5px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔑 Password Reset Request</h1>
                    </div>
                    <div class="content">
                        <p>Hello,</p>
                        <p>You requested a password reset for your Metra Market account.</p>
                        <p style="text-align: center; margin: 30px 0;">
                            <a href="${data.resetUrl}" class="btn">Reset Password</a>
                        </p>
                        <div class="warning">
                            <p><strong>⚠️ Important:</strong> This link expires in 1 hour.</p>
                            <p>If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
                        </div>
                    </div>
                    <div class="footer">
                        <p>&copy; 2026 Metra Market. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
            Password Reset Request
            
            You requested a password reset for your Metra Market account.
            
            Reset URL: ${data.resetUrl}
            
            This link expires in 1 hour.
        `
    }),

    order_shipped: (data) => ({
        subject: `📦 Your Order Has Shipped! - ${data.orderNumber}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .container { max-width: 600px; margin: 0 auto; }
                    .header { background: linear-gradient(135deg, #228B22, #32CD32); color: white; padding: 30px; text-align: center; }
                    .content { background: #f9f9f9; padding: 30px; }
                    .tracking { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
                    .btn { display: inline-block; padding: 12px 30px; background: #228B22; color: white; text-decoration: none; border-radius: 5px; }
                    .footer { background: #8B0000; color: white; padding: 20px; text-align: center; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📦 Your Order Has Shipped!</h1>
                        <p style="margin: 10px 0 0 0;">Great news! Your order is on its way.</p>
                    </div>
                    <div class="content">
                        <p>Dear <strong>${data.customerName}</strong>,</p>
                        <p>Your order has been shipped and is on its way to you!</p>

                        <div class="tracking">
                            <p><strong>Order Number:</strong> ${data.orderNumber}</p>
                            <p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
                            <p><strong>Carrier:</strong> ${data.carrier || 'Bobgo'}</p>
                            <p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery || '3-5 business days'}</p>
                        </div>

                        <p style="text-align: center;">
                            <a href="${data.trackOrderUrl || window.location.origin + '/track-order.html'}" class="btn">Track Your Order</a>
                        </p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2026 Metra Market. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
            Your Order Has Shipped!
            
            Order Number: ${data.orderNumber}
            Tracking Number: ${data.trackingNumber}
            Carrier: ${data.carrier || 'Bobgo'}
            Estimated Delivery: ${data.estimatedDelivery || '3-5 business days'}
        `
    }),

    return_request: (data) => ({
        subject: `🔄 Return Request Received - ${data.returnNumber}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .container { max-width: 600px; margin: 0 auto; }
                    .header { background: linear-gradient(135deg, #FF8C00, #FFA500); color: white; padding: 30px; text-align: center; }
                    .content { background: #f9f9f9; padding: 30px; }
                    .return-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .footer { background: #8B0000; color: white; padding: 20px; text-align: center; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔄 Return Request Received</h1>
                    </div>
                    <div class="content">
                        <p>Dear <strong>${data.customerName}</strong>,</p>
                        <p>We have received your return request and are processing it.</p>

                        <div class="return-details">
                            <p><strong>Return Number:</strong> ${data.returnNumber}</p>
                            <p><strong>Order Number:</strong> ${data.orderNumber}</p>
                            <p><strong>Return Reason:</strong> ${data.reason}</p>
                            <p><strong>Status:</strong> ${data.status || 'Pending Review'}</p>
                        </div>

                        <p>Our team will review your return request and contact you within 24-48 hours with further instructions.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2026 Metra Market. All rights reserved.</p>
                        <p>Questions? Contact us at support@metramarket.co.za</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
            Return Request Received
            
            Return Number: ${data.returnNumber}
            Order Number: ${data.orderNumber}
            Reason: ${data.reason}
            Status: ${data.status || 'Pending Review'}
        `
    }),

    contact_form: (data) => ({
        subject: `📧 New Contact Form Message from ${data.name}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .container { max-width: 600px; margin: 0 auto; }
                    .header { background: linear-gradient(135deg, #8B0000, #DC143C); color: white; padding: 30px; text-align: center; }
                    .content { background: #f9f9f9; padding: 30px; }
                    .message { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B0000; }
                    .details { background: white; padding: 15px; border-radius: 5px; }
                    .footer { background: #8B0000; color: white; padding: 20px; text-align: center; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📧 New Contact Form Submission</h1>
                    </div>
                    <div class="content">
                        <div class="details">
                            <p><strong>From:</strong> ${data.name} (${data.email})</p>
                            ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
                            <p><strong>Date:</strong> ${new Date().toLocaleString('en-ZA')}</p>
                        </div>
                        <div class="message">
                            <h3>Message:</h3>
                            <p>${data.message}</p>
                        </div>
                    </div>
                    <div class="footer">
                        <p>Metra Market Contact Form Notification</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
            New Contact Form Message
            
            From: ${data.name} (${data.email})
            Phone: ${data.phone || 'Not provided'}
            Date: ${new Date().toLocaleString('en-ZA')}
            
            Message:
            ${data.message}
        `
    }),

    welcome_email: (data) => ({
        subject: '🎉 Welcome to Metra Market!',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .container { max-width: 600px; margin: 0 auto; }
                    .header { background: linear-gradient(135deg, #8B0000, #DC143C); color: white; padding: 40px; text-align: center; }
                    .content { background: #f9f9f9; padding: 30px; }
                    .btn { display: inline-block; padding: 15px 40px; background: #8B0000; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px; }
                    .footer { background: #8B0000; color: white; padding: 20px; text-align: center; font-size: 12px; }
                    .benefits { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .benefits li { margin: 10px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Welcome to Metra Market!</h1>
                        <p style="margin: 10px 0 0 0;">Your account has been created successfully</p>
                    </div>
                    <div class="content">
                        <p>Dear <strong>${data.customerName}</strong>,</p>
                        <p>Welcome to Metra Market! We're excited to have you join our community.</p>

                        <div class="benefits">
                            <h3>What you can enjoy:</h3>
                            <ul>
                                <li>✅ Free shipping on orders over R750</li>
                                <li>✅ 30-day hassle-free returns</li>
                                <li>✅ Secure payment via PayFast</li>
                                <li>✅ Exclusive member discounts</li>
                                <li>✅ Order tracking</li>
                            </ul>
                        </div>

                        <p style="text-align: center;">
                            <a href="${data.shopUrl || window.location.origin + '/shopping.html'}" class="btn">Start Shopping</a>
                        </p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2026 Metra Market. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
            Welcome to Metra Market!
            
            Dear ${data.customerName},
            
            Welcome to Metra Market! We're excited to have you join our community.
            
            What you can enjoy:
            - Free shipping on orders over R750
            - 30-day hassle-free returns
            - Secure payment via PayFast
            - Exclusive member discounts
            - Order tracking
            
            Start shopping at: ${data.shopUrl || window.location.origin + '/shopping.html'}
        `
    })
};

// Export for use in other files
if (typeof window !== 'undefined') {
    window.MetraEmail = {
        sendEmail,
        sendBatchEmail,
        templates: EMAIL_TEMPLATES
    };
}
