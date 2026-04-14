// Vercel Serverless Function - Batch Email API
// Sends multiple emails for bulk notifications

// Get Mailgun credentials from environment variables ONLY - NO HARDCODED FALLBACKS
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
const MAILGUN_API_URL = MAILGUN_DOMAIN ? `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}` : null;

// Rate limiter for batch emails
const batchRateLimitMap = new Map();
const BATCH_RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_BATCH_REQUESTS_PER_WINDOW = 5; // 5 batch requests per minute

function getClientIP(req) {
    return req.headers['x-forwarded-for'] || 
           req.headers['x-real-ip'] || 
           req.connection.remoteAddress || 
           'unknown';
}

function checkBatchRateLimit(ip) {
    const now = Date.now();
    const windowStart = batchRateLimitMap.has(ip) ? batchRateLimitMap.get(ip) : now;
    
    if (now - windowStart > BATCH_RATE_LIMIT_WINDOW) {
        batchRateLimitMap.set(ip, now);
        batchRateLimitMap.set(`${ip}:count`, 0);
        return { allowed: true, remaining: MAX_BATCH_REQUESTS_PER_WINDOW };
    }
    
    const count = batchRateLimitMap.get(`${ip}:count`) || 0;
    if (count >= MAX_BATCH_REQUESTS_PER_WINDOW) {
        return { allowed: false, retryAfter: Math.ceil((windowStart + BATCH_RATE_LIMIT_WINDOW - now) / 1000) };
    }
    
    batchRateLimitMap.set(`${ip}:count`, count + 1);
    return { allowed: true, remaining: MAX_BATCH_REQUESTS_PER_WINDOW - count - 1 };
}

function sanitizeHtml(html) {
    if (!html) return '';
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        .replace(/on\w+\s*=\s*\S+/gi, '');
}

export default async function handler(req, res) {
    // Set CORS headers
    const allowedOrigins = [
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
        'http://localhost:3000',
        'http://localhost:8080'
    ].filter(Boolean);
    
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Rate limiting
    const clientIP = getClientIP(req);
    const rateLimit = checkBatchRateLimit(clientIP);
    if (!rateLimit.allowed) {
        console.warn(`⚠️ Batch email rate limit exceeded for IP: ${clientIP}`);
        return res.status(429).json({
            error: 'Rate limit exceeded',
            message: `Too many batch requests. Try again in ${rateLimit.retryAfter} seconds`
        });
    }

    // Check if Mailgun is configured
    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
        console.error('Mailgun credentials not configured');
        return res.status(500).json({
            error: 'Mailgun not configured',
            message: 'Please set MAILGUN_API_KEY and MAILGUN_DOMAIN environment variables in Vercel dashboard'
        });
    }

    try {
        const { emails, subject, html, text, from } = req.body;

        if (!emails || !Array.isArray(emails) || emails.length === 0) {
            return res.status(400).json({ 
                error: 'Missing emails array',
                message: 'emails array is required'
            });
        }

        // Limit batch size to prevent timeout
        if (emails.length > 100) {
            return res.status(400).json({ 
                error: 'Too many emails',
                message: 'Maximum 100 emails per batch'
            });
        }

        const results = [];
        let successCount = 0;
        let failureCount = 0;

        // Send emails sequentially to avoid rate limiting
        for (const email of emails) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.to)) {
                results.push({ 
                    to: email.to, 
                    success: false, 
                    error: 'Invalid email address' 
                });
                failureCount++;
                continue;
            }

            const formData = new URLSearchParams();
            formData.append('from', from || `Metra Market <noreply@${MAILGUN_DOMAIN}>`);
            formData.append('to', email.to);
            formData.append('subject', email.subject || subject);
            formData.append('html', email.html || html);
            
            if (email.text || text) {
                formData.append('text', email.text || text);
            }

            formData.append('h:X-Mailgun-Tag', 'bulk-notification');

            try {
                const response = await fetch(`${MAILGUN_API_URL}/messages`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formData.toString()
                });

                const result = await response.json();

                if (response.ok) {
                    results.push({ to: email.to, success: true, id: result.id });
                    successCount++;
                } else {
                    results.push({ to: email.to, success: false, error: result.message });
                    failureCount++;
                }
            } catch (error) {
                results.push({ to: email.to, success: false, error: error.message });
                failureCount++;
            }

            // Small delay to prevent rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return res.status(200).json({ 
            success: true,
            total: emails.length,
            successCount,
            failureCount,
            results
        });
    } catch (error) {
        console.error('Batch email failed:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
}
