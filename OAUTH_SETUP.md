# OAuth & Authentication Setup Guide

## 📋 Overview

This guide explains how to configure real OAuth authentication for Google, WhatsApp, and Facebook login.

---

## 🔐 Current Admin Access

**Admin Dashboard:** `admin.html`
- **Username:** `ThandoHlomuka`
- **Password:** `Nozibusiso89`

---

## 🌐 Google OAuth Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Name it "Metra Market" or your preferred name

### Step 2: Enable Google+ API
1. In the Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google+ API" and enable it

### Step 3: Create OAuth 2.0 Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Select **Web application**
4. Add authorized JavaScript origins:
   - `http://localhost` (for testing)
   - `https://yourdomain.com` (for production)
5. Add authorized redirect URIs:
   - `http://localhost/index.html`
   - `https://yourdomain.com/index.html`
6. Click **Create**

### Step 4: Copy Client ID
1. Copy the **Client ID** (looks like: `xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com`)
2. Open `script.js`
3. Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Client ID:
   ```javascript
   const GOOGLE_CONFIG = {
       clientId: 'YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com',
       callback: handleGoogleCredentialResponse,
       auto_select: false
   };
   ```

### Step 5: Test
1. Open `index.html` in your browser
2. Click the user icon → Login
3. Click "Continue with Google"
4. You should see the Google sign-in popup

---

## 📱 WhatsApp Business API Setup

### Step 1: Create Meta Developer Account
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Log in with your Facebook account
3. Create a developer account if you don't have one

### Step 2: Create WhatsApp Business App
1. Click **My Apps** > **Create App**
2. Select **Other** > **Business**
3. Fill in app details and create

### Step 3: Add WhatsApp Product
1. In your app dashboard, add **WhatsApp** product
2. Follow the setup wizard
3. Get your **Phone Number ID** and **Business Account ID**

### Step 4: Get API Key
1. Go to **Settings** > **Basic**
2. Copy your **App Secret**
3. Go to **WhatsApp** > **API Setup**
4. Copy your **Temporary Access Token** (for testing) or create a permanent one

### Step 5: Update Configuration
1. Open `script.js`
2. Replace `YOUR_WHATSAPP_API_KEY` with your actual API key:
   ```javascript
   const WHATSAPP_CONFIG = {
       apiKey: 'YOUR_ACTUAL_API_KEY',
       phoneNumber: ''
   };
   ```

### Step 6: Test WhatsApp Login
1. Open `index.html`
2. Click login → WhatsApp
3. Enter your phone number (e.g., `+27123456789`)
4. Click "Send OTP"
5. Check the browser console for the OTP (in production, it will be sent via WhatsApp)
6. Enter the OTP to login

---

## 📘 Facebook Login Setup

### Step 1: Create Facebook App
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click **My Apps** > **Create App**
3. Select **Consumer** as the app type
4. Fill in app details

### Step 2: Configure Facebook Login
1. In your app dashboard, add **Facebook Login** product
2. Go to **Facebook Login** > **Settings**
3. Set **Valid OAuth Redirect URIs**:
   - `http://localhost/index.html`
   - `https://yourdomain.com/index.html`
4. Enable **Client OAuth Login**
5. Enable **Embedded Browser OAuth Login**

### Step 3: Get App ID
1. Go to **Settings** > **Basic**
2. Copy your **App ID**

### Step 4: Update Configuration
1. Open `script.js`
2. Replace `YOUR_FACEBOOK_APP_ID` with your actual App ID:
   ```javascript
   function initFacebookSDK() {
       window.fbAsyncInit = function() {
           FB.init({
               appId      : 'YOUR_ACTUAL_APP_ID',
               cookie     : true,
               xfbml      : true,
               version    : 'v17.0'
           });
       };
       // ... rest of the code
   };
   ```

### Step 5: Test
1. Open `index.html`
2. Click login → Facebook
3. You should see the Facebook login popup

---

## 🧪 Testing

### Test All Login Methods:
1. **Email/Password:**
   - Register with email, name, phone, password
   - Login with credentials

2. **Google OAuth:**
   - Click "Continue with Google"
   - Sign in with Google account
   - Should auto-create account or login existing user

3. **WhatsApp OTP:**
   - Click "Continue with WhatsApp"
   - Enter phone number
   - Get OTP (check console for demo)
   - Enter OTP to login

4. **Facebook:**
   - Click "Continue with Facebook"
   - Login with Facebook account
   - Should auto-create account or login existing user

---

## 🔒 Security Notes

### For Production:
1. **Never commit API keys to GitHub**
   - Use environment variables or a backend server
   - Create a `.env` file (add to `.gitignore`)

2. **WhatsApp OTP in Production:**
   - The current implementation shows OTP in console for testing
   - In production, the OTP is sent via WhatsApp Business API
   - Uncomment the `fetch()` code in `sendWhatsAppOTP()` function

3. **Server-Side Validation:**
   - All OAuth tokens should be validated server-side
   - Implement JWT or session-based authentication
   - Add rate limiting for OTP requests

4. **HTTPS Required:**
   - OAuth requires HTTPS in production
   - Get an SSL certificate for your domain

---

## 📧 Support

For issues or questions:
- Check browser console for errors
- Verify all API keys are correct
- Ensure redirect URIs match exactly
- Check Meta/Google developer dashboards for app status

---

**Last Updated:** March 24, 2026
**Version:** 1.6.0
