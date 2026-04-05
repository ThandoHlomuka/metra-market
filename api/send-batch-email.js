// Vercel Serverless Function - Batch Email API
// Sends multiple emails for bulk notifications

// Get Mailgun credentials from environment variables ONLY - NO HARDCODED FALLBACKS
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
const MAILGUN_API_URL = MAILGUN_DOMAIN ? `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}` : null;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
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
