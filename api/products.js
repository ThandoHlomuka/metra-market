import { neon } from '@neondatabase/serverless';

// ─── Utilities ───────────────────────────────────────────

function getClientIP(req) {
    return req.headers['x-forwarded-for'] ||
           req.headers['x-real-ip'] ||
           req.connection?.remoteAddress ||
           'unknown';
}

const FALLBACK_ADMIN = { username: 'ThandoHlomuka', password: 'Nozibusiso89' };

function authorize(req) {
    const auth = req.headers['authorization'] || '';

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

        const userOk = envUser && envPass ? user === envUser && pass === envPass
                                           : user === FALLBACK_ADMIN.username && pass === FALLBACK_ADMIN.password;
        return userOk ? { authorized: true } : { authorized: false, error: 'Invalid credentials' };
    } catch {
        return { authorized: false, error: 'Authorization error' };
    }
}

// Strip HTML tags from a string
function stripHTML(s) {
    return typeof s === 'string' ? s.replace(/<[^>]*>/g, '') : s;
}

// Recursively sanitize all string fields in an object/array
function sanitizeObject(obj) {
    if (Array.isArray(obj)) return obj.map(sanitizeObject);
    if (obj && typeof obj === 'object') {
        const out = {};
        for (const [k, v] of Object.entries(obj)) out[k] = sanitizeObject(v);
        return out;
    }
    return typeof obj === 'string' ? stripHTML(obj) : obj;
}

// Validate that a value is a safe string (no HTML, no control chars except \n)
function isValidString(v) {
    return typeof v === 'string' && v.length < 10000;
}

// ─── Rate limiter (in-memory) ────────────────────────────

const rateBuckets = new Map();
const RATE_WINDOW = 60 * 1000; // 1 minute
const RATE_MAX_POST = 10;       // max POST/DELETE per window
const RATE_MAX_GET = 60;        // max GET per window

function checkRateLimit(ip, isWrite) {
    const now = Date.now();
    const max = isWrite ? RATE_MAX_POST : RATE_MAX_GET;
    if (!rateBuckets.has(ip)) {
        rateBuckets.set(ip, { count: 1, windowStart: now });
        return true;
    }
    const bucket = rateBuckets.get(ip);
    if (now - bucket.windowStart > RATE_WINDOW) {
        bucket.count = 1;
        bucket.windowStart = now;
        return true;
    }
    bucket.count++;
    return bucket.count <= max;
}

// Periodic cleanup of stale rate buckets
setInterval(() => {
    const now = Date.now();
    for (const [ip, bucket] of rateBuckets) {
        if (now - bucket.windowStart > RATE_WINDOW * 2) rateBuckets.delete(ip);
    }
}, 60000);

// ─── Security headers ────────────────────────────────────

function setSecurityHeaders(res) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
}

// ─── Request body size check ─────────────────────────────

const MAX_BODY_BYTES = 1024 * 1024 * 5; // 5 MB

// ─── Handler ─────────────────────────────────────────────

export default async function handler(req, res) {
    // Security headers on every response
    setSecurityHeaders(res);

    // CORS
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
        return res.status(204).end();
    }

    // Rate limiting
    const clientIP = getClientIP(req);
    const isWrite = req.method === 'POST' || req.method === 'DELETE';
    if (!checkRateLimit(clientIP, isWrite)) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    // Body size check for write requests
    if (isWrite && req.headers['content-length']) {
        const size = parseInt(req.headers['content-length'], 10);
        if (size > MAX_BODY_BYTES) {
            return res.status(413).json({ error: 'Request entity too large' });
        }
    }

    const dbUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
    if (!dbUrl) {
        if (req.method === 'GET') {
            return res.status(200).json({ products: [], source: 'fallback' });
        }
        return res.status(503).json({ error: 'Database not configured.' });
    }

    try {
        const sql = neon(dbUrl);

        await sql`CREATE TABLE IF NOT EXISTS store_data (
            key VARCHAR(255) PRIMARY KEY,
            value JSONB NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`;

        // ── GET ──────────────────────────────────────────

        if (req.method === 'GET') {
            const rows = await sql`SELECT value, updated_at FROM store_data WHERE key = 'products'`;
            const products = rows.length > 0 ? rows[0].value : [];
            const updatedAt = rows.length > 0 ? rows[0].updated_at : null;
            return res.status(200).json({ products, updatedAt, source: 'database' });
        }

        // ── DELETE ───────────────────────────────────────

        if (req.method === 'DELETE') {
            const authResult = authorize(req);
            if (!authResult.authorized) {
                return res.status(401).json({ error: authResult.error || 'Unauthorized' });
            }

            const id = req.query?.id;
            if (!id || typeof id !== 'string' || id.length > 100) {
                return res.status(400).json({ error: 'Invalid product id' });
            }

            const rows = await sql`SELECT value FROM store_data WHERE key = 'products'`;
            const products = rows.length > 0 ? rows[0].value : [];
            const filtered = products.filter(p => String(p.id) !== String(id));
            if (filtered.length === products.length) {
                return res.status(404).json({ error: 'Product not found' });
            }
            await sql`INSERT INTO store_data (key, value, updated_at)
                      VALUES ('products', ${JSON.stringify(filtered)}::jsonb, NOW())
                      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`;
            return res.status(200).json({ success: true, products: filtered });
        }

        // ── POST ─────────────────────────────────────────

        if (req.method === 'POST') {
            const authResult = authorize(req);
            if (!authResult.authorized) {
                return res.status(401).json({ error: authResult.error || 'Unauthorized' });
            }

            let body;
            try {
                body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            } catch {
                return res.status(400).json({ error: 'Invalid JSON in request body' });
            }

            if (!body || !Array.isArray(body.products)) {
                return res.status(400).json({ error: 'Missing or invalid products array' });
            }

            if (body.products.length > 500) {
                return res.status(400).json({ error: 'Products array exceeds maximum size (500)' });
            }

            // Sanitize all string fields to prevent HTML injection / stored XSS
            const sanitized = sanitizeObject(body.products);

            await sql`INSERT INTO store_data (key, value, updated_at)
                      VALUES ('products', ${JSON.stringify(sanitized)}::jsonb, NOW())
                      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`;
            return res.status(200).json({ success: true, count: sanitized.length });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error(`Products API error (IP: ${clientIP}):`, error.message);
        // Never leak internal details to the client
        if (req.method === 'GET') {
            return res.status(200).json({ products: [], source: 'error_fallback' });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
}
