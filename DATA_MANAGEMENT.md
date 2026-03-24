# Metra Market - Admin Data Management Guide

## 📊 Sessions & Data Management

Access the new **Sessions & Data** section in the admin dashboard to manage all user data and sessions.

### Navigation
1. Login to admin dashboard at `admin.html`
2. Click **Sessions & Data** in the sidebar

---

## 👥 Active User Sessions

View and manage all logged-in user sessions.

### Features:
- **User List**: Shows all users with activity in the last 24 hours
- **Login Time**: When the user last accessed the site
- **Provider**: How they logged in (Email, Google, WhatsApp, Facebook)
- **Actions**: Logout individual users

### Actions:
- **Logout Single User**: Click the logout icon next to any user
- **Logout All Users**: Click "Logout All Users" button to clear all sessions

---

## 💾 Stored Data Overview

Real-time statistics of all data stored in the application.

### Data Types:
| Type | Description |
|------|-------------|
| Products | Total products in catalog |
| Orders | Total customer orders |
| Users | Registered user accounts |
| Invoices | Generated invoices |

### Export All Data:
1. Click **Export All Data** button
2. Downloads `metra-market-backup-YYYY-MM-DD.json`
3. Contains all products, orders, users, invoices, and settings

### Import Data:
1. Click **Import Data** button
2. Select a previously exported `.json` backup file
3. Confirm overwrite (⚠️ this replaces ALL current data)
4. Page reloads automatically

---

## 🛒 Shopping Carts Management

View and manage active/abandoned shopping carts.

### Information Displayed:
- Cart ID (generated)
- Number of items
- Total cart value
- Last activity time

### Actions:
- **Clear Cart**: Remove all items from cart
- **Clear All Carts**: Button to remove all active carts

---

## ❤️ Wishlist Statistics

View wishlist usage across the platform.

### Metrics:
- **Total Wishlist Items**: Sum of all wishlisted products
- **Active Wishlists**: Number of users with items in wishlist

---

## 🔐 Admin Session

Your current admin session information.

### Display:
- Current admin username
- Session status (active)
- Logout button

---

## 📋 Data Retention Policy

### What is Stored:
- **User Accounts**: Name, email, phone, login provider
- **Orders**: Complete order history with items and totals
- **Products**: Product catalog with descriptions and reviews
- **Invoices**: All generated invoices
- **Carts**: Active shopping carts
- **Wishlists**: User wishlist items
- **Settings**: Store configuration

### Session Persistence:
- User sessions persist across page reloads
- Sessions remain active until:
  - User manually logs out
  - Admin logs out the user
  - Browser data is cleared
  - 24 hours of inactivity (shown as inactive in admin)

### No Automatic Deletion:
- **Orders**: Never automatically deleted
- **User Accounts**: Never automatically deleted
- **Carts**: Persist until cleared by user or admin
- **Sessions**: No automatic timeout

---

## 🛡️ Security Best Practices

### For Admins:
1. **Regular Backups**: Export data weekly using "Export All Data"
2. **Monitor Sessions**: Check active sessions for suspicious activity
3. **Clear Old Data**: Remove inactive user sessions periodically
4. **Secure Admin Credentials**: Change default password

### For Production:
1. **Server-Side Sessions**: Move session tracking to backend
2. **Database Storage**: Use database instead of localStorage
3. **Session Tokens**: Implement JWT or session-based auth
4. **Rate Limiting**: Add rate limits for login attempts
5. **HTTPS**: Always use HTTPS in production

---

## 📥 Data Export Format

Exported JSON includes:
```json
{
  "exportDate": "2026-03-24T...",
  "products": [...],
  "orders": [...],
  "users": [...],
  "invoices": [...],
  "settings": {...}
}
```

### Import Validation:
- File must be valid JSON
- Must contain recognized data structure
- Requires admin confirmation before import

---

## 🚨 Emergency Actions

### Clear All Data:
In the **Settings** section (Danger Zone):
- **Clear All Orders**: Deletes all order history
- **Clear All Users**: Deletes all user accounts
- **Reset Products**: Restores default 8 products

⚠️ **Warning**: These actions cannot be undone! Always export data first.

---

## 📊 Monitoring Tips

### Daily:
- Check active sessions for anomalies
- Monitor new orders

### Weekly:
- Export data backup
- Review cart abandonment rates
- Check wishlist trends

### Monthly:
- Clean up old inactive sessions
- Archive old orders (export then clear)
- Review and update product catalog

---

**Last Updated:** March 24, 2026
**Version:** 1.7.0
