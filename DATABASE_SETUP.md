# Database Configuration for Vercel

This project uses **Supabase** as the primary database, which is fully compatible with Vercel.

## Setup Instructions

### 1. Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

### 2. Get Your Credentials
1. Go to **Settings** > **API**
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key**

### 3. Install Supabase Client
The Supabase client is already included via CDN in the HTML files.

### 4. Update Configuration
Edit `api/config.js` with your Supabase credentials:
```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_KEY = 'your-anon-key';
```

### 5. Deploy to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`

---

## Database Schema

### Tables

#### users
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    username TEXT,
    phone TEXT,
    password TEXT,
    provider TEXT DEFAULT 'email',
    picture TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'
);
```

#### products
```sql
CREATE TABLE products (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    full_description TEXT,
    icon TEXT,
    sku TEXT UNIQUE,
    tags TEXT[],
    specs TEXT[],
    stock INTEGER DEFAULT -1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);
```

#### orders
```sql
CREATE TABLE orders (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    order_number TEXT UNIQUE NOT NULL,
    invoice_number TEXT UNIQUE NOT NULL,
    user_id BIGINT REFERENCES users(id),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    items JSONB NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    shipping DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    payment_method TEXT,
    payment_status TEXT DEFAULT 'pending',
    invoice_delivery TEXT DEFAULT 'email',
    status TEXT DEFAULT 'processing',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);
```

#### invoices
```sql
CREATE TABLE invoices (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    invoice_number TEXT UNIQUE NOT NULL,
    order_id BIGINT REFERENCES orders(id),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    items JSONB NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    shipping DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'paid',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);
```

#### analytics
```sql
CREATE TABLE analytics (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    event_type TEXT NOT NULL,
    user_id BIGINT REFERENCES users(id),
    session_id TEXT,
    page_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### sessions
```sql
CREATE TABLE sessions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT REFERENCES users(id),
    session_token TEXT UNIQUE NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);
```

### Indexes
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_analytics_event_type ON analytics(event_type);
CREATE INDEX idx_analytics_created_at ON analytics(created_at);
CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

### Row Level Security (RLS)
```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Users can view their own data
CREATE POLICY users_select_own ON users
    FOR SELECT USING (auth.uid()::text = email);

-- Users can view their own orders
CREATE POLICY orders_select_own ON orders
    FOR SELECT USING (auth.uid()::bigint = user_id);

-- Admin policy (using a custom claim or role)
CREATE POLICY admin_all ON users
    FOR ALL USING (current_setting('app.admin_role', true) = 'true');
```

---

## Migration Script

Run this SQL in your Supabase SQL Editor to create all tables:

```sql
-- Create all tables
[See schema above]

-- Insert default products
INSERT INTO products (name, price, description, icon, sku, tags, specs, full_description) VALUES
('Wireless Headphones', 1199.99, 'Premium noise-canceling wireless headphones', '🎧', 'WH-001', 
 ARRAY['Audio', 'Wireless', 'Premium'], 
 ARRAY['40mm drivers', 'Bluetooth 5.2', '40hr battery'],
 'Experience superior sound quality'),
('Smart Watch', 2999.99, 'Feature-rich smartwatch with health tracking', '⌚', 'SW-002',
 ARRAY['Wearables', 'Fitness', 'Smart'],
 ARRAY['1.4 AMOLED', 'Heart rate monitor', 'GPS'],
 'Stay connected and track fitness');
```

---

## Environment Variables

Add these to your Vercel project settings:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
ADMIN_USERNAME=ThandoHlomuka
ADMIN_PASSWORD=your-secure-password
```

---

**Last Updated:** March 24, 2026
