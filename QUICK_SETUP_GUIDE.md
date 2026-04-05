# 🚀 Quick Setup Guide - Environment Variables & Deployment

## Step-by-Step Instructions

### Step 1: Add Environment Variables to Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click on your **metra-market** project

2. **Navigate to Environment Variables**
   - Click **Settings** tab
   - Click **Environment Variables** in left sidebar

3. **Add These Variables** (click "Add New" for each):

   #### Email Configuration (Mailgun)
   ```
   Variable name: MAILGUN_API_KEY
   Value: [Get from Mailgun dashboard]
   Environments: ✅ Production, ✅ Preview, ✅ Development
   ```
   
   ```
   Variable name: MAILGUN_DOMAIN
   Value: [Get from Mailgun dashboard]
   Environments: ✅ Production, ✅ Preview, ✅ Development
   ```

   #### Bobgo Shipping (Should already exist)
   ```
   Variable name: BOBGO_API_KEY
   Value: 5a830068eeb9431da5bf1577a9980d99
   Environments: ✅ Production, ✅ Preview, ✅ Development
   ```

   ```
   Variable name: BOBGO_API_URL
   Value: https://api.bobgo.co.za/v1
   Environments: ✅ Production, ✅ Preview, ✅ Development
   ```

   #### PayFast Payment Gateway
   ```
   Variable name: PAYFAST_MERCHANT_ID
   Value: 13343379
   Environments: ✅ Production, ✅ Preview, ✅ Development
   ```

   ```
   Variable name: PAYFAST_MERCHANT_KEY
   Value: 8jgcm78j7sqph
   Environments: ✅ Production, ✅ Preview, ✅ Development
   ```

   ```
   Variable name: PAYFAST_PASSPHRASE
   Value: ThandoHlomuka93
   Environments: ✅ Production, ✅ Preview, ✅ Development
   ```

4. **Save each variable** - Click "Save" after adding each one

---

### Step 2: Rotate Database Password (CRITICAL!)

1. **Go to Neon Dashboard**
   - Visit: https://console.neon.tech
   - Log in to your account

2. **Find Your Database**
   - Click on your project
   - Go to the database with the exposed credentials

3. **Rotate Password**
   - Click on **Database** → **Connection**
   - Click **Reset Password** or **Rotate Credentials**
   - Copy the NEW connection string

4. **Update Vercel**
   - Go back to Vercel → Settings → Environment Variables
   - Add or update:
   ```
   Variable name: DATABASE_URL
   Value: [paste new connection string here]
   Environments: ✅ Production, ✅ Preview, ✅ Development
   ```

---

### Step 3: Change Admin Password

Since admin password is currently hardcoded, you need to change it:

1. **Open `admin-script.js`**
2. **Find lines 1-5** and update:
   ```javascript
   const ADMIN_USERNAME = 'ThandoHlomuka'; // Change this
   const ADMIN_PASSWORD = 'Nozibusiso89';  // CHANGE THIS TO A NEW PASSWORD
   ```

3. **Save the file**
4. **Important**: Choose a strong password (12+ characters, mix of letters, numbers, symbols)

**Better Alternative**: Implement server-side authentication (see long-term plan below)

---

### Step 4: Commit and Deploy

Open terminal/command prompt:

```bash
# Navigate to project
cd "C:\Users\Thando Hlomuka\Desktop\metra-market"

# Stage all changes
git add .

# Commit with message
git commit -m "fix: Critical security fixes - remove hardcoded credentials, fix checkout shipping"

# Push to deploy
git push origin main
```

**Alternative**: If you don't have git set up:
```bash
# Deploy directly with Vercel CLI
vercel --prod
```

---

### Step 5: Verify Deployment

1. **Check Vercel Dashboard**
   - Wait for deployment to complete (~2-5 minutes)
   - Check deployment logs for errors

2. **Test Checkout Flow**
   - Visit your deployed site
   - Open browser console (F12)
   - Add item to cart
   - Go to checkout
   - Select province
   - Watch console for shipping calculation logs
   - Verify shipping cost displays correctly

3. **Test Email (Optional)**
   - Go to admin dashboard
   - Try sending test email
   - Should succeed if Mailgun vars are set correctly

4. **Test Bobgo Shipping**
   - Use admin "Test Bobgo Shipping" button
   - Should return courier rates

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Site loads without errors
- [ ] Can add items to cart
- [ ] Checkout shows shipping options when province selected
- [ ] Shipping cost displays (not R0)
- [ ] Console shows Bobgo API logs (not errors)
- [ ] Orders save to localStorage
- [ ] Success page shows order details
- [ ] Admin dashboard accessible
- [ ] Email test succeeds (if configured)

---

## 🐛 Troubleshooting

### "Mailgun not configured" Error
**Cause**: Environment variables not set in Vercel
**Fix**: Double-check variables in Vercel dashboard, redeploy

### Shipping Still Shows R0
**Cause**: Bobgo API not responding or products not loaded
**Fix**: 
1. Check browser console for errors
2. Verify BOBGO_API_KEY is set in Vercel
3. Ensure products have weight/dimensions set

### Database Connection Error
**Cause**: Old password still in use
**Fix**: Rotate password in Neon dashboard, update DATABASE_URL in Vercel

### Admin Login Fails After Password Change
**Cause**: Hardcoded credentials changed
**Fix**: Use the new username/password you set in admin-script.js

---

## 🔐 Security Best Practices (Going Forward)

### DO:
✅ Use environment variables for all secrets
✅ Keep .env.local in .gitignore
✅ Rotate credentials regularly
✅ Use strong, unique passwords
✅ Monitor Vercel logs for errors
✅ Test in preview deployments first

### DON'T:
❌ Hardcode API keys in JavaScript
❌ Commit .env files to git
❌ Share credentials in plain text
❌ Use same password everywhere
❌ Ignore security warnings
❌ Skip environment variable setup

---

## 📞 Need Help?

If you encounter issues:

1. **Check Vercel Logs**: Dashboard → Deployments → Click deployment → Logs
2. **Check Browser Console**: F12 → Console tab
3. **Review Documentation**: 
   - CRITICAL_FIXES_APPLIED.md
   - CHECKOUT_SHIPPING_FIX.md
   - SECURITY_API_KEY_SETUP.md

---

*Follow this guide step-by-step to complete the security setup!*
