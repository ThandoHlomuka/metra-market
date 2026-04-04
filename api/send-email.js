// Vercel Serverless Function - Mailgun Email API
// This handles all email sending through Mailgun from the server side (avoids CORS issues)

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY || '[MAILGUN_API_KEY]';
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || 'mg.metramarket.co.za';
const MAILGUN_API_URL = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}`;

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Check if Mailgun is configured
    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
        return res.status(500).json({ 
            error: 'Mailgun not configured',
            message: 'Please set MAILGUN_API_KEY and MAILGUN_DOMAIN environment variables'
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

        // Prepare form data for Mailgun
        const formData = new URLSearchParams();
        formData.append('from', from || `Metra Market <noreply@${MAILGUN_DOMAIN}>`);
        formData.append('to', to);
        formData.append('subject', subject);
        formData.append('html', html);
        
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
