/**
 * PayFast Payment Processing Proxy
 * This serverless function securely creates PayFast payment requests
 * without exposing merchant credentials to the client.
 * 
 * Environment Variables Required:
 * - PAYFAST_MERCHANT_ID: Your PayFast merchant ID
 * - PAYFAST_MERCHANT_KEY: Your PayFast merchant key
 * - PAYFAST_PASSPHRASE: Your PayFast passphrase
 */

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            error: 'Method not allowed',
            message: 'Only POST requests are accepted' 
        });
    }

    // Get PayFast credentials from environment variables
    const merchantId = process.env.PAYFAST_MERCHANT_ID;
    const merchantKey = process.env.PAYFAST_MERCHANT_KEY;
    const passphrase = process.env.PAYFAST_PASSPHRASE;

    // Validate credentials are configured
    if (!merchantId || !merchantKey) {
        console.error('PayFast credentials not configured');
        return res.status(500).json({ 
            error: 'Payment service unavailable',
            message: 'Payment gateway is not properly configured' 
        });
    }

    try {
        const {
            amount,
            itemName,
            itemDescription,
            returnUrl,
            cancelUrl,
            notifyUrl,
            emailAddress,
            nameFirst,
            nameLast,
            cellNumber,
            mPaymentId
        } = req.body;

        // Validate required fields
        if (!amount || !itemName) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                message: 'amount and itemName are required' 
            });
        }

        // Validate amount is a positive number
        const paymentAmount = parseFloat(amount);
        if (isNaN(paymentAmount) || paymentAmount <= 0) {
            return res.status(400).json({ 
                error: 'Invalid amount',
                message: 'Amount must be a positive number' 
            });
        }

        // Build PayFast form data
        const payfastData = {
            merchant_id: merchantId,
            merchant_key: merchantKey,
            amount: paymentAmount.toFixed(2),
            item_name: itemName,
            item_description: itemDescription || itemName,
            return_url: returnUrl,
            cancel_url: cancelUrl,
            notify_url: notifyUrl,
            name_first: nameFirst || '',
            name_last: nameLast || '',
            email_address: emailAddress || '',
            cell_number: cellNumber || '',
            m_payment_id: mPaymentId || ''
        };

        // Add passphrase to signature if configured
        if (passphrase) {
            const paramString = Object.keys(payfastData)
                .filter(key => payfastData[key] !== '' && key !== 'notify_url')
                .sort()
                .map(key => `${key}=${encodeURIComponent(payfastData[key])}`)
                .join('&');
            
            const crypto = require('crypto');
            payfastData.signature = crypto
                .createHash('md5')
                .update(paramString + `&passphrase=${encodeURIComponent(passphrase)}`)
                .digest('hex');
        }

        // Return the form data to the client
        return res.status(200).json({ 
            success: true,
            payfastUrl: 'https://www.payfast.co.za/eng/process',
            data: payfastData
        });

    } catch (error) {
        console.error('PayFast proxy error:', error);
        
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message || 'Failed to process payment'
        });
    }
}

// Configure body size limit
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb'
        }
    }
};
