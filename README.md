# Metra Market 🛍️

A comprehensive online store with a customized admin dashboard, developed by Metra Team in partnership with Thando Hlomuka.

![Metra Market](https://img.shields.io/badge/Metra-Market-8B0000?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.5.0-crimson?style=for-the-badge)
![Last Updated](https://img.shields.io/badge/last%20updated-March%202026-brown?style=for-the-badge)

## ✨ Features

- 🎨 **Modern Design** - Beautiful crimson red & cream white gradient UI
- 🛒 **Shopping Cart** - Full cart functionality with localStorage persistence
- 🚚 **Bobgo Shipping** - Integrated with Bobgo delivery services (API ready)
- 👤 **User Accounts** - Registration, login, and profile management
- ❤️ **Wishlist** - Save favorite products for later
- ⭐ **Reviews** - Customer reviews with star ratings
- 📱 **Responsive** - Works perfectly on all devices (mobile, tablet, desktop)
- ⚡ **Fast & Lightweight** - No frameworks, pure HTML/CSS/JS
- 🎯 **User Friendly** - Intuitive navigation and checkout process
- 🔧 **Admin CMS** - Complete admin dashboard for managing all aspects
- 📧 **Email System** - Mailgun integration, email templates, bulk notifications

## 🚀 Quick Start

1. Clone or download this repository
2. Open `index.html` in your browser
3. Start shopping!

## 📁 Project Structure

```
metra-market/
├── index.html          # Main store HTML file
├── admin.html          # Admin dashboard (hidden)
├── styles.css          # Store styling
├── admin-styles.css    # Admin dashboard styling
├── script.js           # Store functionality
├── admin-script.js     # Admin dashboard functionality
└── README.md           # This file
```

## 🎨 Customization

- Edit `products` array in `script.js` to add your own products
- Modify CSS variables in `styles.css` to change colors
- Update content in `index.html` for your brand

## 🔐 User Features

### Authentication
- **Register** - Create account with name, email, phone, password
- **Login** - Access your account with email & password
- **Session Persistence** - Stay logged in across page reloads

### Profile Dashboard
- **Overview** - View stats (orders, wishlist, total spent, reviews)
- **Order History** - Track all your orders with status
- **Wishlist** - Manage saved products
- **Settings** - Edit profile information & logout

### Shopping Experience
- **Product Modals** - Click products for detailed info
- **Product Details** - Full description, SKU, specs, tags
- **Reviews** - Read and write customer reviews
- **Add to Cart** - Easy one-click add to cart
- **Multiple Shipping** - Choose delivery speed

## 🌟 Demo Features

- 8 sample products with full details
- Add/remove items from cart
- Bobgo shipping integration (API ready)
- Cart & wishlist persist across page reloads
- Contact form with validation
- Smooth scroll navigation
- Animated UI elements
- User authentication system
- Order tracking

## 🔧 Admin Panel

Access the admin dashboard at: `admin.html`

**🔐 Admin Credentials:**
> **Note:** For security, admin credentials are not displayed in this public repository.
> Contact the repository owner or check your project's secure documentation for access details.
>
> Default credentials are set in `admin-script.js` - please change them after first login!

<!--
ADMIN CREDENTIALS (DO NOT COMMIT TO GITHUB):
Username: [Set in admin-script.js]
Password: [Set in admin-script.js]
-->

### Real-Time Features

The admin dashboard now includes **real-time updates**:
- **Live Visitors Counter** - See how many people are browsing now
- **Real-Time Orders** - New orders appear instantly
- **Live Chat Support** - Customer messages appear in real-time
- **Activity Feed** - Track user activity across the site
- **Auto-Refresh** - Dashboard updates every 5 seconds

### Admin Dashboard Sections

#### Dashboard Overview
- Real-time statistics (products, orders, users, revenue)
- **Live visitors count** (updates every 5 seconds)
- Recent orders (auto-updates)
- Order status breakdown
- Top-selling products
- Recent reviews

#### Analytics
- Visitor trends chart
- Orders & revenue chart
- Product categories
- User engagement funnel
- **Live visitor tracking**

### Admin Features

#### Dashboard Overview
- Real-time statistics (products, orders, users, revenue)
- Recent orders summary
- Order status breakdown
- Top-selling products
- Recent reviews

#### Products Management
- ✅ Add new products with full details
- ✅ Edit existing products
- ✅ Delete products
- ✅ Manage SKU, price, description, specs, tags

#### Orders Management
- ✅ View all orders with filtering
- ✅ Update order status (Processing → Shipped → Delivered)
- ✅ View order details (items, totals, customer)
- ✅ Track shipping status

#### Users Management
- ✅ View all registered users
- ✅ See user order history
- ✅ Delete user accounts

#### Reviews Management
- ✅ View all customer reviews
- ✅ Delete inappropriate reviews
- ✅ See review ratings

#### Settings
- ✅ Configure store settings
- ✅ Update shipping prices
- ✅ Change admin password
- ✅ Clear data (orders, users)
- ✅ Reset products to default

---

## 📬 Changelog / Updates

### v1.6.0 - March 26, 2026 *(Latest)*
**📧 Comprehensive Email Management System**
- ✅ Mailgun API integration for reliable email delivery
- ✅ SMTP fallback configuration
- ✅ Email template designer with 8 template types
- ✅ 3 pre-designed layout styles (Modern, Minimal, Classic)
- ✅ Live email template preview
- ✅ Quick insert placeholders for template variables
- ✅ Send test emails from admin dashboard
- ✅ Bulk email notifications to user groups
- ✅ Email queue management with filtering
- ✅ Email statistics dashboard (Sent, Pending, Failed, Total)
- ✅ Export email logs to CSV
- ✅ Resend failed emails functionality

**🏪 Shop Feed Improvements**
- ✅ Enhanced product rendering with error handling
- ✅ Debug logging for troubleshooting
- ✅ Defensive checks for missing elements

**📝 Documentation Updates**
- ✅ Updated README with proper authorship
- ✅ Changed license to Proprietary
- ✅ Added project type description

---

### v1.5.0 - March 23, 2026 *(Previous)*
**📧 Invoice Delivery Preferences**
- ✅ Customer chooses invoice delivery: Email or WhatsApp
- ✅ Invoice sent via WhatsApp with formatted message
- ✅ WhatsApp invoice includes download link
- ✅ Save invoice via WhatsApp feature
- ✅ Invoice modal with WhatsApp save button
- ✅ PDF-style invoice text for WhatsApp

**❤️ Enhanced Wishlist System**
- ✅ Wishlist icon in navbar with count badge
- ✅ Dedicated wishlist modal popup
- ✅ View all wishlist items in one place
- ✅ Add all wishlist items to cart
- ✅ Clear entire wishlist
- ✅ Remove individual items
- ✅ Quick view product from wishlist
- ✅ Integrated with profile system
- ✅ Wishlist persists across sessions

### v1.4.0 - March 23, 2026
**📧 Invoicing System**
- ✅ Auto-generated invoices after successful checkout
- ✅ Professional invoice modal with print option
- ✅ Invoice email sending to customer
- ✅ Download invoice as text file
- ✅ Invoice stored in localStorage
- ✅ Admin invoice management panel
- ✅ View, download, email invoices from admin
- ✅ Export all invoices feature
- ✅ Invoice tracking with unique numbers

**🔐 Social Authentication**
- ✅ Google OAuth login (simulated)
- ✅ WhatsApp login with OTP verification
- ✅ Facebook login (simulated)
- ✅ Auto-registration for social login users
- ✅ Social login buttons on login form
- ✅ Quick login via WhatsApp or Google

### v1.3.0 - March 23, 2026
**🔧 Admin CMS Dashboard**
- ✅ Created separate admin dashboard (admin.html)
- ✅ Secure admin login with credentials
- ✅ Dashboard with real-time statistics
- ✅ Product management (Add, Edit, Delete)
- ✅ Order management with status updates
- ✅ Shipping order tracking
- ✅ User management
- ✅ Reviews moderation
- ✅ Settings configuration
- ✅ Admin password change
- ✅ Data management tools
- ✅ Hidden admin link in footer

### v1.2.0 - March 23, 2026
**🔐 Profile System & Authentication**
- ✅ Added user registration form with validation
- ✅ Added login form with password verification
- ✅ Created comprehensive user profile modal
- ✅ Profile overview with stats (orders, wishlist, spending)
- ✅ Order history tracking with status indicators
- ✅ Wishlist management from profile
- ✅ Profile settings with edit capability
- ✅ Logout functionality
- ✅ Session persistence via localStorage
- ✅ User icon in navbar (changes when logged in)
- ✅ Login required for checkout

**🐛 Bug Fixes**
- ✅ Fixed add to cart error with null element handling
- ✅ Added defensive checks for cart UI elements

---

### v1.1.0 - March 22, 2026
**📦 Product Details & Reviews**
- ✅ Product modal popups on click
- ✅ Full product descriptions with specifications
- ✅ Product SKU and tags display
- ✅ Customer reviews section with star ratings
- ✅ Review submission form
- ✅ Wishlist functionality with localStorage
- ✅ Add to wishlist from product modal

**🚚 Bobgo Shipping**
- ✅ Bobgo delivery integration
- ✅ API-ready for real-time calculations
- ✅ Default shipping cost configuration
- ✅ Real-time cart total updates

**📱 Responsive Design**
- ✅ Mobile optimized (<480px)
- ✅ Tablet optimized (481-1024px)
- ✅ Desktop optimized (>1024px)
- ✅ Cross-browser compatible

---

### v1.0.1 - March 21, 2026
**🎨 Theme Update**
- ✅ Changed theme to Deep Crimson Red & Cream White
- ✅ Updated all hardcoded color values
- ✅ Fixed gradient backgrounds
- ✅ Updated notification colors

**💱 Currency Update**
- ✅ Changed from USD ($) to ZAR (R)
- ✅ Updated all product prices
- ✅ Updated shipping thresholds

---

### v1.0.0 - March 20, 2026
**🎉 Initial Release**
- ✅ Modern gradient UI design
- ✅ 8 sample products
- ✅ Shopping cart with localStorage
- ✅ Contact form
- ✅ Smooth scroll navigation
- ✅ Animated product cards
- ✅ Responsive navbar
- ✅ Features section
- ✅ Footer with social links
- ✅ GitHub deployment

---

## 📊 Feature Roadmap

### Coming Soon
- [ ] Payment gateway integration (PayFast, Yoco)
- [ ] Order email notifications
- [ ] Admin dashboard
- [ ] Product search & filtering
- [ ] Product categories
- [ ] Dark/Light theme toggle
- [ ] Multi-language support

## 🛠️ Technologies Used

- HTML5
- CSS3 (Custom Properties, Flexbox, Grid)
- JavaScript (ES6+)
- Font Awesome Icons
- Google Fonts (Poppins)
- LocalStorage (Data Persistence)

## 📄 License

Proprietary - Developed by Metra Team in partnership with Thando Hlomuka. All rights reserved.

---

## 👨‍💻 Development Team

**Developed by Metra Team in partnership with Thando Hlomuka**

**Project Type:** Comprehensive Online Store with Customized Admin Dashboard

**Contact:** Metra Market Team

Made with ❤️ by Metra Market Team

---

*Last Updated: March 26, 2026*
