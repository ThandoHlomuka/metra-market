# Mailgun Email Integration - Setup Guide

## Overview
The Metra Market online store now has full Mailgun email integration for all notifications including:
- ✅ Order confirmation emails (customer + admin)
- ✅ Password reset emails
- ✅ Return request notifications
- ✅ Contact form notifications
- ✅ Shipping notifications
- ✅ Welcome emails
- ✅ Bulk notifications from admin dashboard
- ✅ Custom email templates from admin

## Setup Instructions

### 1. Mailgun Account Setup
1. Sign up at [mailgun.com](https://mailgun.com)
2. Verify your domain (mg.metramarket.co.za)
3. Get your API key from Account Settings → API Keys

### 2. Vercel Environment Variables
Add these environment variables in your Vercel project settings:

```bash
MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MAILGUN_DOMAIN=mg.metramarket.co.za
```

**To add in Vercel:**
1. Go to your project on Vercel
2. Settings → Environment Variables
3. Add both variables for Production, Preview, and Development
4. Redeploy your project

### 3. Admin Dashboard Configuration
1. Login to admin dashboard (`/admin.html`)
2. Go to **Email Settings** section
3. Enable **Mailgun Email Service** checkbox
4. Enter your **Mailgun API key** (key-xxxx...)
5. Enter your **Mailgun domain** (mg.metramarket.co.za)
6. Set **From email** (noreply@metramarket.co.za)
7. Set **Admin email** (admin@metramarket.co.za)
8. Click **Save Mailgun Settings**
9. Click **Test Mailgun** to verify connection

### 4. Test the System
1. **Test Email**: In Email Settings, use the "Send Test Email" feature
2. **Order Test**: Place a test order to receive order confirmation
3. **Password Reset**: Test password reset flow
4. **Bulk Notification**: Send a test bulk notification to a small group

## API Endpoints

### Single Email
- **URL**: `/api/send-email`
- **Method**: POST
- **Body**:
```json
{
  "to": "customer@example.com",
  "subject": "Order Confirmation",
  "html": "<h1>Your order details...</h1>",
  "text": "Plain text version",
  "from": "Metra Market <noreply@metramarket.co.za>"
}
```

### Batch Email
- **URL**: `/api/send-batch-email`
- **Method**: POST
- **Body**:
```json
{
  "emails": [
    { "to": "user1@example.com", "html": "<p>Message 1</p>" },
    { "to": "user2@example.com", "html": "<p>Message 2</p>" }
  ],
  "subject": "Bulk Notification",
  "from": "Metra Market <noreply@metramarket.co.za>"
}
```

## Email Templates Available
1. `order_confirmation` - Customer order confirmation
2. `admin_new_order` - Admin notification for new orders
3. `password_reset` - Password reset link
4. `order_shipped` - Shipping notification with tracking
5. `return_request` - Return request confirmation
6. `contact_form` - Contact form submission to admin
7. `welcome_email` - New user welcome email

## Troubleshooting

### Emails not sending?
1. Check Vercel environment variables are set correctly
2. Verify Mailgun API key and domain in admin settings
3. Check browser console for errors
4. Check Vercel function logs

### CORS errors?
- The API routes are serverless functions, so CORS is handled automatically
- Make sure you're calling `/api/send-email` not the Mailgun API directly

### Mailgun domain not verified?
- You must verify your domain in Mailgun before sending emails
- Add DNS records as specified in Mailgun dashboard

## Files Added/Modified

### New Files
- `/api/send-email.js` - Single email endpoint
- `/api/send-batch-email.js` - Batch email endpoint
- `/api/email-service.js` - Email service utilities

### Modified Files
- `/script.js` - Updated sendEmail and processEmailQueue
- `/admin-script.js` - Updated bulk notifications and test email

## Security Notes
- Mailgun API key is stored in environment variables (server-side only)
- Never expose API keys in client-side code
- All email sending goes through serverless functions
- Rate limiting is built into batch email endpoint (100 emails per batch)
