/**
 * Mailgun Email API Proxy
 * Serverless function for sending emails via Mailgun
 * 
 * Usage:
 * POST /api/mailgun
 * Body: { to, subject, html, text?, template? }
 */

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = (process.env.MAILGUN_API_KEY || '').trim();
    const domain = (process.env.MAILGUN_DOMAIN || 'mg.metramarket.co.za').trim();

    if (!apiKey || !domain) {
        return res.status(500).json({
            error: 'Service unavailable',
            message: 'Mailgun not configured. Add MAILGUN_API_KEY and MAILGUN_DOMAIN to environment variables.'
        });
    }

    try {
        const { to, subject, html, text = '', template = 'default' } = req.body;

        // Validate required fields
        if (!to || !subject || !html) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'to, subject, and html are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(to)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Invalid email address format'
            });
        }

        // Use URLSearchParams instead of FormData (works in Node.js/Vercel)
        const formData = new URLSearchParams();
        formData.append('from', `Metra Market <noreply@${domain}>`);
        formData.append('to', to);
        formData.append('subject', subject);
        formData.append('html', html);
        if (text) {
            formData.append('text', text);
        }

        const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`api:${apiKey}`).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData.toString()
        });

        const result = await response.json();

        if (response.ok) {
            console.log('✅ Email sent via Mailgun:', result.id);
            return res.status(200).json({
                success: true,
                messageId: result.id,
                message: 'Email sent successfully'
            });
        } else {
            console.error('❌ Mailgun error:', result);
            return res.status(502).json({
                success: false,
                error: result.message || 'Failed to send email',
                mailgunError: result
            });
        }

    } catch (error) {
        console.error('❌ Mailgun request failed:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb'
        }
    }
};
