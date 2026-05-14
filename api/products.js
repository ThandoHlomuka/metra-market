import { neon } from '@neondatabase/serverless';

function getClientIP(req) {
    return req.headers['x-forwarded-for'] ||
           req.headers['x-real-ip'] ||
           req.connection?.remoteAddress ||
           'unknown';
}

const FALLBACK_ADMIN = { username: 'ThandoHlomuka', password: 'Nozibusiso89' };

function authorize(req) {
    const auth = req.headers.get('authorization') || req.headers['authorization'] || '';

    if (!auth.startsWith('Basic ')) {
        return { authorized: false, error: 'Missing or invalid authorization' };
    }

    try {
        const base64 = auth.slice(6);
        const decoded = Buffer.from(base64, 'base64').toString('utf-8');
        const colon = decoded.indexOf(':');
        if (colon === -1) return { authorized: false, error: 'Invalid authorization format' };
        const user = decoded.slice(0, colon);
        const pass = decoded.slice(colon + 1);

        const envUser = process.env.ADMIN_USERNAME;
        const envPass = process.env.ADMIN_PASSWORD;

        if (envUser && envPass && user === envUser && pass === envPass) {
            return { authorized: true };
        }
        if (user === FALLBACK_ADMIN.username && pass === FALLBACK_ADMIN.password) {
            return { authorized: true };
        }
        return { authorized: false, error: 'Invalid credentials' };
    } catch {
        return { authorized: false, error: 'Authorization error' };
    }
}

export default async function handler(req, res) {
    const origin = req.headers.origin || '';
    const allowedOrigins = [
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
        process.env.BASE_URL || null,
        'http://localhost:3000',
        'http://localhost:8080'
    ].filter(Boolean);
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const dbUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
    if (!dbUrl) {
        if (req.method === 'GET') {
            return res.status(200).json({ products: [], source: 'fallback' });
        }
        return res.status(503).json({ error: 'Database not configured. Set DATABASE_URL or NEON_DATABASE_URL.' });
    }

    try {
        const sql = neon(dbUrl);

        await sql`CREATE TABLE IF NOT EXISTS store_data (
            key VARCHAR(255) PRIMARY KEY,
            value JSONB NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`;

        if (req.method === 'GET') {
            const rows = await sql`SELECT value FROM store_data WHERE key = 'products'`;
            const products = rows.length > 0 ? rows[0].value : [];
            return res.status(200).json({ products, source: 'database' });
        }

        if (req.method === 'DELETE') {
            const auth = authorize(req);
            if (!auth.authorized) {
                return res.status(401).json({ error: auth.error || 'Unauthorized' });
            }

            const id = req.query?.id || new URL(req.url, 'http://localhost').searchParams.get('id');
            if (!id) {
                return res.status(400).json({ error: 'Product id is required' });
            }

            const rows = await sql`SELECT value FROM store_data WHERE key = 'products'`;
            let products = rows.length > 0 ? rows[0].value : [];
            const filtered = products.filter(p => String(p.id) !== String(id));
            if (filtered.length === products.length) {
                return res.status(404).json({ error: 'Product not found' });
            }
            await sql`INSERT INTO store_data (key, value, updated_at) VALUES ('products', ${JSON.stringify(filtered)}::jsonb, NOW())
                      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`;
            return res.status(200).json({ success: true, products: filtered });
        }

        if (req.method === 'POST') {
            const auth = authorize(req);
            if (!auth.authorized) {
                return res.status(401).json({ error: auth.error || 'Unauthorized' });
            }

            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            if (!body || !body.products) {
                return res.status(400).json({ error: 'Missing products array in request body' });
            }

            await sql`INSERT INTO store_data (key, value, updated_at) VALUES ('products', ${JSON.stringify(body.products)}::jsonb, NOW())
                      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`;
            return res.status(200).json({ success: true, count: body.products.length });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        const clientIP = getClientIP(req);
        console.error(`Products API error (IP: ${clientIP}):`, error.message);
        if (req.method === 'GET') {
            return res.status(200).json({ products: [], source: 'error_fallback' });
        }
        return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
}
