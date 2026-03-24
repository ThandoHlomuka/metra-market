# Neon Database Schema for Metra Market

## Setup Instructions

### 1. Create Neon Account
1. Go to [neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project

### 2. Get Connection String
1. In your Neon dashboard, click **Connect**
2. Copy the **Connection string** (looks like: `postgresql://user:password@host.neon.tech/dbname`)

### 3. Run Schema Migration
Copy the SQL below and run it in the Neon SQL Editor

### 4. Add to Vercel
Add this environment variable in Vercel:
```
NEON_DATABASE_URL=your-connection-string
```

---

## Database Schema

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255),
    phone VARCHAR(50),
    password VARCHAR(255) NOT NULL,
    provider VARCHAR(50) DEFAULT 'email',
    picture TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}',
    
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    full_description TEXT,
    icon VARCHAR(50),
    sku VARCHAR(100) UNIQUE,
    tags TEXT[],
    specs TEXT[],
    stock INTEGER DEFAULT -1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    items JSONB NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    shipping DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    invoice_delivery VARCHAR(50) DEFAULT 'email',
    status VARCHAR(50) DEFAULT 'processing',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id BIGSERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    order_id BIGINT REFERENCES orders(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    items JSONB NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    shipping DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'paid',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    page_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Password resets table
CREATE TABLE IF NOT EXISTS password_resets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Email queue table (for failed emails)
CREATE TABLE IF NOT EXISTS email_queue (
    id BIGSERIAL PRIMARY KEY,
    to_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    html_content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    attempts INTEGER DEFAULT 0,
    last_attempt_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_last_active ON users(last_active);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_analytics_event_type ON analytics(event_type);
CREATE INDEX idx_analytics_created_at ON analytics(created_at);
CREATE INDEX idx_analytics_user_id ON analytics(user_id);
CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_email_queue_status ON email_queue(status);

-- Insert default products
INSERT INTO products (name, price, description, icon, sku, tags, specs, full_description) VALUES
('Wireless Headphones', 1199.99, 'Premium noise-canceling wireless headphones', '🎧', 'WH-001', 
 ARRAY['Audio', 'Wireless', 'Premium'], 
 ARRAY['40mm drivers', 'Bluetooth 5.2', '40hr battery', 'Fast charging', 'Foldable design'],
 'Experience superior sound quality with our Premium Wireless Headphones. Featuring advanced noise-canceling technology, 40-hour battery life, and ultra-comfortable memory foam ear cushions.'),
('Smart Watch', 2999.99, 'Feature-rich smartwatch with health tracking', '⌚', 'SW-002',
 ARRAY['Wearables', 'Fitness', 'Smart'],
 ARRAY['1.4 AMOLED', 'Heart rate monitor', 'GPS', '5ATM water resistant', '7-day battery'],
 'Stay connected and track your fitness goals with our advanced Smart Watch. Features heart rate monitoring, GPS tracking, sleep analysis, and 7-day battery life.'),
('Laptop Stand', 749.99, 'Ergonomic aluminum laptop stand', '💻', 'LS-003',
 ARRAY['Office', 'Ergonomic', 'Accessories'],
 ARRAY['Aluminum alloy', '6 height adjustments', 'Supports 17 inch', 'Anti-slip pads', 'Foldable'],
 'Improve your posture and workspace ergonomics with our premium aluminum laptop stand. Features 6 adjustable heights and supports up to 17-inch laptops.'),
('Mechanical Keyboard', 1949.99, 'RGB mechanical gaming keyboard', '⌨️', 'MK-004',
 ARRAY['Gaming', 'RGB', 'Mechanical'],
 ARRAY['Cherry MX Red switches', 'RGB backlighting', 'Aluminum frame', 'N-key rollover', 'Detachable cable'],
 'Dominate your games with our premium mechanical keyboard featuring Cherry MX switches, customizable RGB lighting, and aircraft-grade aluminum frame.'),
('Wireless Mouse', 899.99, 'Precision wireless gaming mouse', '🖱️', 'WM-005',
 ARRAY['Gaming', 'Wireless', 'Precision'],
 ARRAY['25K DPI sensor', '68g ultra-light', '80hr battery', 'Wireless 2.4GHz', '6 programmable buttons'],
 'Experience pixel-perfect precision with our ultra-lightweight wireless gaming mouse. Features a 25K DPI sensor, 68g weight, and 80-hour battery life.'),
('USB-C Hub', 599.99, '7-in-1 USB-C hub with HDMI', '🔌', 'UH-006',
 ARRAY['Connectivity', 'USB-C', 'Adapter'],
 ARRAY['4K HDMI output', '3x USB 3.0', 'SD/microSD readers', '100W PD', 'Aluminum body'],
 'Expand your connectivity with our premium 7-in-1 USB-C hub. Features 4K HDMI output, 3x USB 3.0 ports, SD/microSD card readers, and 100W power delivery.'),
('Portable Speaker', 1349.99, 'Waterproof Bluetooth speaker', '🔊', 'PS-007',
 ARRAY['Audio', 'Portable', 'Waterproof'],
 ARRAY['360° sound', '24hr battery', 'IPX7 waterproof', 'Bluetooth 5.0', 'Built-in mic'],
 'Take your music anywhere with our waterproof Bluetooth speaker. Features 360° sound, 24-hour battery life, and IPX7 water resistance.'),
('Phone Case', 374.99, 'Premium leather phone case', '📱', 'PC-008',
 ARRAY['Accessories', 'Leather', 'Protection'],
 ARRAY['Genuine leather', 'Card slots', 'Magnetic closure', 'Precise cutouts', 'Wireless charging compatible'],
 'Protect your phone in style with our premium genuine leather case. Features card slots, magnetic closure, and precise cutouts.');

-- Create function to update last_active timestamp
CREATE OR REPLACE FUNCTION update_last_active()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_active = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating last_active
CREATE TRIGGER trg_update_last_active
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_last_active();

-- Create function to clean expired sessions
CREATE OR REPLACE FUNCTION clean_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM sessions WHERE expires_at < NOW();
    DELETE FROM password_resets WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Grant permissions (adjust as needed)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO neon_superuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO neon_superuser;
```

---

## Environment Variables for Vercel

Add these to your Vercel project:

```bash
# Database
NEON_DATABASE_URL=postgresql://user:password@host.neon.tech/dbname

# Email Service (Brevo/Sendinblue or similar)
EMAIL_SERVICE_API_KEY=your-email-api-key
EMAIL_SERVICE_URL=https://api.brevo.com/v3/smtp/email
EMAIL_FROM=noreply@metramarket.co.za
ADMIN_EMAIL=admin@metramarket.co.za

# Base URL
BASE_URL=https://your-domain.vercel.app
```

---

## Testing Connection

After setup, test the connection:

```sql
-- Check tables
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check products
SELECT COUNT(*) FROM products;

-- Test insert
INSERT INTO users (name, email, username, password) 
VALUES ('Test User', 'test@test.com', 'test@test.com', 'test123');
```

---

**Last Updated:** March 24, 2026
**Version:** 1.8.0
