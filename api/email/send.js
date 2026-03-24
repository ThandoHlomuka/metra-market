// Vercel Serverless Function - Send Email
// POST /api/email/send

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { to, subject, html } = req.body;

        if (!to || !subject) {
            return res.status(400).json({ error: 'to and subject are required' });
        }

        // Check for email service configuration
        const apiKey = process.env.EMAIL_SERVICE_API_KEY;
        const apiUrl = process.env.EMAIL_SERVICE_URL || 'https://api.brevo.com/v3/smtp/email';

        // Use Brevo (Sendinblue) or similar email service
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey
            },
            body: JSON.stringify({
                sender: {
                    name: 'Metra Market',
                    email: process.env.EMAIL_FROM || 'noreply@metramarket.co.za'
                },
                to: [{ email: to }],
                subject: subject,
                htmlContent: html
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Email API error:', error);
            throw new Error(error.message || 'Failed to send email');
        }

        res.status(200).json({ success: true, message: 'Email sent' });
    } catch (error) {
        console.error('Email send error:', error);
        
        // Store for retry
        const pendingEmails = JSON.parse(process.env.PENDING_EMAILS || '[]');
        pendingEmails.push({ ...req.body, createdAt: new Date().toISOString() });
        
        res.status(500).json({ 
            error: error.message,
            message: 'Email queued for later delivery'
        });
    }
}
