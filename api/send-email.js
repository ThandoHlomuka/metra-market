// Vercel Serverless Function - Mailgun Email API
// This handles all email sending through Mailgun from the server side (avoids CORS issues)

// Get Mailgun credentials from environment variables ONLY - NO HARDCODED FALLBACKS
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
const MAILGUN_API_URL = MAILGUN_DOMAIN ? `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}` : null;

// Simple in-memory rate limiter (resets on serverless cold start)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20; // 20 emails per minute per IP

function getClientIP(req) {
    return req.headers['x-forwarded-for'] || 
           req.headers['x-real-ip'] || 
           req.connection.remoteAddress || 
           'unknown';
}

function checkRateLimit(ip) {
    const now = Date.now();
    const windowStart = rateLimitMap.has(ip) ? rateLimitMap.get(ip) : now;
    
    if (now - windowStart > RATE_LIMIT_WINDOW) {
        // Reset window
        rateLimitMap.set(ip, now);
        return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
    }
    
    const count = rateLimitMap.get(`${ip}:count`) || 0;
    if (count >= MAX_REQUESTS_PER_WINDOW) {
        return { allowed: false, remaining: 0, retryAfter: Math.ceil((windowStart + RATE_LIMIT_WINDOW - now) / 1000) };
    }
    
    rateLimitMap.set(`${ip}:count`, count + 1);
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - count - 1 };
}

function sanitizeHtml(html) {
    // Basic XSS protection - remove script tags and event handlers
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

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Rate limiting
    const clientIP = getClientIP(req);
    const rateLimit = checkRateLimit(clientIP);
    if (!rateLimit.allowed) {
        console.warn(`⚠️ Rate limit exceeded for IP: ${clientIP}`);
        return res.status(429).json({
            error: 'Rate limit exceeded',
            message: `Too many requests. Try again in ${rateLimit.retryAfter} seconds`,
            retryAfter: rateLimit.retryAfter
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
        const { to, subject, html, text, from, replyTo, attachments } = req.body;

        // Validate required fields
        if (!to || !subject || !html) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'to, subject, and html are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(to)) {
            return res.status(400).json({
                error: 'Invalid email address',
                message: 'The recipient email address is invalid'
            });
        }

        // Sanitize HTML content to prevent XSS
        const sanitizedHtml = sanitizeHtml(html);

        // Prepare form data for Mailgun
        const formData = new URLSearchParams();
        formData.append('from', from || `Metra Market <noreply@${MAILGUN_DOMAIN}>`);
        formData.append('to', to);
        formData.append('subject', subject);
        formData.append('html', sanitizedHtml);
        
        if (text) {
            formData.append('text', text);
        }
        
        if (replyTo) {
            formData.append('h:Reply-To', replyTo);
        }

        // Add custom headers
        formData.append('h:X-Mailgun-Tag', 'metra-market');
        formData.append('h:X-Priority', '3');

        // Send email via Mailgun API
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
            console.log('✅ Email sent successfully:', result.id);
            return res.status(200).json({ 
                success: true, 
                id: result.id,
                message: 'Email sent successfully'
            });
        } else {
            console.error('❌ Mailgun API error:', result);
            return res.status(response.status).json({ 
                success: false, 
                error: result.message || 'Failed to send email',
                details: result
            });
        }
    } catch (error) {
        console.error('❌ Email sending failed:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
}
