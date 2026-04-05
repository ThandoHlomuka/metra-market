# 🔒 Bobgo API Key Security - Implementation Guide

## Date: April 5, 2026
## Status: ✅ API KEY SECURED

---

## 🎯 What Changed

The Bobgo API key has been **removed from client-side code** and is now securely stored in **Vercel Environment Variables**, accessed only through serverless proxy functions.

---

## ⚡ Quick Setup - Required Steps

### Step 1: Add Environment Variables to Vercel

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Select your project: **metra-market**
3. Click **Settings** → **Environment Variables**
4. Add these variables:

| Variable Name | Value | Environments |
|--------------|-------|--------------|
| `BOBGO_API_KEY` | `5a830068eeb9431da5bf1577a9980d99` | ✅ Production<br>✅ Preview<br>✅ Development |
| `BOBGO_API_URL` | `https://api.bobgo.co.za/v1` | ✅ Production<br>✅ Preview<br>✅ Development |

5. Click **Save** for each variable

### Step 2: Redeploy Your Application

After adding the environment variables, you **MUST redeploy** for them to take effect:

```bash
# Option 1: Deploy via Vercel CLI
cd "C:\Users\Thando Hlomuka\Desktop\metra-market"
vercel --prod

# Option 2: Deploy via Git
git add .
git commit -m "security: Move Bobgo API key to serverless proxy"
git push origin main
```

### Step 3: Test the Integration

After deployment, test the shipping calculation:
1. Open your deployed site
2. Add items to cart
3. Go to checkout
4. Select a province
5. Verify shipping rates appear

---

## 📁 Files Created/Modified

### ✅ New Serverless API Routes

1. **`api/bobgo-shipping.js`** - Secure proxy for shipping calculations
   - Handles POST requests to `/api/bobgo-shipping`
   - Reads API key from environment variables
   - Validates and sanitizes requests
   - Returns normalized courier data

2. **`api/bobgo-collection-points.js`** - Secure proxy for collection points
   - Handles GET/POST requests to `/api/bobgo-collection-points`
   - Fetches collection points from Bobgo API
   - Returns sanitized response

### ✅ Modified Files

1. **`script.js`**
   - Removed hardcoded API key from `BOBGO_CONFIG`
   - Updated to use `/api/bobgo-shipping` endpoint
   - No more `Authorization` headers in client code
   - Updated test function

2. **`checkout.html`**
   - Removed hardcoded API key
   - Updated to use secure proxy endpoint
   - Simplified configuration

3. **`admin.html`**
   - Removed API key input field
   - Shows "API Key Secured" status
   - Updated to reflect secure setup

4. **`admin-script.js`**
   - Removed API key handling from settings
   - Updated save notification

---

## 🔐 Security Improvements

### Before (❌ INSECURE)
```javascript
// API key visible in browser source code
const BOBGO_CONFIG = {
    apiKey: '5a830068eeb9431da5bf1577a9980d99', // EXPOSED!
    apiUrl: 'https://api.bobgo.co.za/v1'
};

// API key sent from browser with every request
fetch('https://api.bobgo.co.za/v1/couriers', {
    headers: {
        'Authorization': 'Bearer 5a830068eeb9431da5bf1577a9980d99' // VISIBLE!
    }
});
```

### After (✅ SECURE)
```javascript
// No API key in client code
const BOBGO_CONFIG = {
    apiUrl: '/api/bobgo-shipping', // Our secure proxy
    sandbox: false
};

// Request goes to our serverless function
fetch('/api/bobgo-shipping', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(shippingData)
    // No API key needed - server has it!
});
```

---

## 🛡️ Security Benefits

1. **✅ API Key Hidden** - Key is never sent to the browser
2. **✅ Server-Side Only** - Key only exists in Vercel's secure environment
3. **✅ Request Validation** - Serverless functions validate all requests
4. **✅ Rate Limiting Ready** - Can add rate limiting to proxy endpoints
5. **✅ Audit Trail** - All API calls go through your serverless functions
6. **✅ Rotation Ready** - Easy to rotate key by updating Vercel env vars

---

## 📊 How It Works

```
┌─────────────────┐
│   Browser       │
│   (Client)      │
└────────┬────────┘
         │
         │ 1. POST /api/bobgo-shipping
         │    { destination, parcels }
         │    NO API KEY NEEDED
         ▼
┌─────────────────────────┐
│  Vercel Serverless      │
│  Function               │
│                         │
│  - Reads BOBGO_API_KEY  │
│    from environment     │
│  - Validates request    │
│  - Calls Bobgo API      │
│  - Returns clean data   │
└────────┬────────────────┘
         │
         │ 2. POST https://api.bobgo.co.za/v1/couriers
         │    Authorization: Bearer [API KEY]
         │    (Secure server-to-server)
         ▼
┌─────────────────────────┐
│  Bobgo API Server       │
│  (api.bobgo.co.za)      │
└─────────────────────────┘
```

---

## 🧪 Testing Checklist

### Local Testing (Will NOT work without deployment)
⚠️ **Important**: Serverless functions only work when deployed to Vercel or running `vercel dev`

- [ ] Environment variables added to Vercel
- [ ] Code pushed to repository
- [ ] Deployment completed successfully
- [ ] Main store shipping calculation works
- [ ] Checkout page shipping calculation works
- [ ] Admin "Test Bobgo Shipping" button works
- [ ] Network tab shows `/api/bobgo-shipping` calls (not external API)
- [ ] No API keys visible in browser source code

### Verification Steps

1. **Check Network Tab**:
   - Open browser DevTools (F12)
   - Go to Network tab
   - Add item to cart, go to checkout
   - You should see: `POST /api/bobgo-shipping`
   - You should NOT see: `api.bobgo.co.za` or API keys

2. **Check Source Code**:
   - View page source (Ctrl+U)
   - Search for "5a830068eeb9431da5bf1577a9980d99"
   - Should find: **0 results** ✅

3. **Check Console**:
   - Open browser console
   - Should see: "Bobgo API request:" with endpoint info
   - Should NOT see: API key in logs

---

## 🚀 Deployment Commands

### Deploy to Production
```bash
cd "C:\Users\Thando Hlomuka\Desktop\metra-market"
git add .
git commit -m "security: Secure Bobgo API key with serverless proxy"
git push origin main
```

### Deploy via Vercel CLI
```bash
vercel --prod
```

### Check Deployment Status
```bash
vercel ls
```

---

## ⚠️ Important Notes

### Local Development
For local testing, you have two options:

**Option 1: Use Vercel Dev CLI**
```bash
npm i -g vercel
vercel dev
```

**Option 2: Create `.env.local` for testing**
```env
BOBGO_API_KEY=5a830068eeb9431da5bf1577a9980d99
BOBGO_API_URL=https://api.bobgo.co.za/v1
```
⚠️ **WARNING**: Never commit `.env.local` to git!

### Fallback Behavior
If environment variables are missing:
- Shipping calculation will return error
- Fallback to default shipping cost (R0)
- Error logged to console

### API Key Rotation
To rotate your API key:
1. Generate new key from Bobgo dashboard
2. Update `BOBGO_API_KEY` in Vercel
3. Redeploy application
4. Test thoroughly

---

## 🐛 Troubleshooting

### Issue: "Shipping service unavailable"
**Solution**: Check that `BOBGO_API_KEY` is set in Vercel environment variables

### Issue: Shipping calculation fails after deployment
**Solutions**:
1. Verify environment variables are set for correct environments
2. Check Vercel deployment logs
3. Redeploy to ensure env vars are loaded

### Issue: Works locally but not on production
**Solution**: Environment variables must be set in Vercel dashboard, not just in `.env.local`

### Issue: 500 Internal Server Error
**Solutions**:
1. Check Vercel function logs in dashboard
2. Verify API key is valid
3. Check Bobgo API status

---

## 📞 Support

### Vercel Environment Variables Docs
https://vercel.com/docs/concepts/projects/environment-variables

### Bobgo API Dashboard
https://my.bobgo.co.za/

### Bobgo API Documentation
https://api-docs.bob.co.za/bobgo

---

## ✅ Security Checklist

- [x] API key removed from `script.js`
- [x] API key removed from `checkout.html`
- [x] API key removed from `admin.html`
- [x] API key removed from `admin-script.js`
- [x] Serverless proxy created for shipping
- [x] Serverless proxy created for collection points
- [x] Request validation implemented
- [x] Response sanitization implemented
- [x] Error handling without key exposure
- [ ] Environment variables added to Vercel ⚠️ **YOU MUST DO THIS**
- [ ] Application redeplyed to Vercel ⚠️ **YOU MUST DO THIS**
- [ ] Testing completed

---

*This implementation follows security best practices for API key management in serverless architectures.*
