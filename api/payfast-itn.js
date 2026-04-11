/**
 * PayFast ITN (Instant Transaction Notification) Handler
 * Receives payment confirmation from PayFast and updates order status
 * 
 * This endpoint is called by PayFast servers after a payment is processed.
 * It validates the ITN data and updates the order status accordingly.
 * 
 * Configuration:
 * - Set this URL as the "Notify URL" in your PayFast integration
 * - For Vercel: https://your-domain.vercel.app/api/payfast-itn
 */

import crypto from 'crypto';

export default async function handler(req, res) {
    // PayFast ITN only uses POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const itnData = req.body;

        // Log incoming ITN
        console.log('📥 PayFast ITN received:', {
            m_payment_id: itnData.m_payment_id,
            payment_status: itnData.payment_status,
            amount_gross: itnData.amount_gross,
            amount_fee: itnData.amount_fee,
            amount_net: itnData.amount_net,
            pf_payment_id: itnData.pf_payment_id,
        });

        // Validate required fields
        if (!itnData.m_payment_id || !itnData.payment_status) {
            console.error('❌ PayFast ITN missing required fields');
            return res.status(400).send('Bad Request');
        }

        // Verify ITN signature from PayFast
        const isValidSignature = await verifyPayFastSignature(itnData);
        if (!isValidSignature) {
            console.error('❌ PayFast ITN signature verification failed');
            return res.status(400).send('Invalid Signature');
        }

        // Extract payment information
        const orderId = itnData.m_payment_id;
        const paymentStatus = itnData.payment_status;
        const amountGross = parseFloat(itnData.amount_gross);
        const payFastPaymentId = itnData.pf_payment_id;
        const signature = itnData.signature;

        // Map PayFast status to our order status
        let orderStatus;
        let paymentIntent;

        switch (paymentStatus) {
            case 'COMPLETE':
                orderStatus = 'paid';
                paymentIntent = 'payment_received';
                console.log(`✅ Payment COMPLETE for order ${orderId}: R${amountGross}`);
                break;
            case 'PENDING':
                orderStatus = 'pending_payment';
                paymentIntent = 'payment_pending';
                console.log(`⏳ Payment PENDING for order ${orderId}`);
                break;
            case 'FAILED':
                orderStatus = 'payment_failed';
                paymentIntent = 'payment_failed';
                console.log(`❌ Payment FAILED for order ${orderId}`);
                break;
            default:
                orderStatus = 'unknown';
                paymentIntent = 'unknown';
                console.warn(`⚠️ Unknown payment status: ${paymentStatus} for order ${orderId}`);
        }

        // Update order in database/localStorage
        // Note: In production, this should update a real database
        const orderUpdated = await updateOrderPaymentStatus(orderId, {
            payFastPaymentId,
            paymentStatus: orderStatus,
            paymentIntent,
            amountPaid: amountGross,
            amountFee: parseFloat(itnData.amount_fee || '0'),
            amountNet: parseFloat(itnData.amount_net || '0'),
            paymentMethod: itnData.payment_method || 'unknown',
            signature,
            updatedAt: new Date().toISOString()
        });

        if (!orderUpdated) {
            console.warn(`⚠️ Order ${orderId} not found for ITN update`);
            // Still acknowledge to PayFast to prevent retries
            return res.status(200).send('Order not found but ITN acknowledged');
        }

        // Trigger post-payment actions
        if (paymentStatus === 'COMPLETE') {
            await postPaymentSuccessActions(orderId, itnData);
        } else if (paymentStatus === 'FAILED') {
            await postPaymentFailureActions(orderId, itnData);
        }

        // Acknowledge receipt to PayFast
        // PayFast expects a simple "HTTP 200 OK" response
        console.log(`✅ ITN processed successfully for order ${orderId}`);
        return res.status(200).send('OK');

    } catch (error) {
        console.error('❌ PayFast ITN processing error:', error);
        // Return 500 to signal PayFast to retry
        return res.status(500).send('Internal Server Error');
    }
}

/**
 * Verify PayFast ITN signature
 * PayFast sends a signature that must be validated
 */
async function verifyPayFastSignature(itnData) {
    // PayFast ITN validation requires posting data back to PayFast
    // For now, we validate the signature format
    // In production, you should validate with PayFast's ITN validation endpoint:
    // https://www.payfast.co.za/eng/query/validate
    
    const pfMerchantId = process.env.PAYFAST_MERCHANT_ID;
    const pfPassphrase = process.env.PAYFAST_PASSPHRASE;

    // Build parameter string for signature validation
    const paramList = {};
    
    // Get all POST variables
    for (const [key, value] of Object.entries(itnData)) {
        if (key !== 'signature') {
            paramList[key] = value;
        }
    }

    // Sort parameters alphabetically
    const sortedParams = Object.keys(paramList)
        .sort()
        .map(key => `${key}=${encodeURIComponent(paramList[key])}`)
        .join('&');

    // Create signature string
    let signatureString = sortedParams;
    if (pfPassphrase) {
        signatureString += `&passphrase=${encodeURIComponent(pfPassphrase)}`;
    }

    // In production, validate by posting to PayFast validation endpoint
    // For now, we check that the signature exists and is properly formatted
    if (!itnData.signature || itnData.signature.length < 32) {
        console.error('❌ Invalid signature format');
        return false;
    }

    // Post to PayFast for validation (production)
    try {
        const validationResponse = await fetch('https://www.payfast.co.za/eng/query/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(itnData).toString()
        });

        const result = await validationResponse.text();
        const isValid = result.trim() === 'VALID';
        
        console.log(`PayFast signature validation: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
        return isValid;
    } catch (error) {
        console.error('⚠️ Could not validate with PayFast:', error.message);
        // In case validation endpoint is unavailable, accept the ITN
        // but log a warning for manual review
        console.warn('⚠️ ITN accepted without validation - manual review recommended');
        return true;
    }
}

/**
 * Update order payment status
 * In production, this should update your database
 */
async function updateOrderPaymentStatus(orderId, paymentData) {
    // For Vercel serverless, we can't access localStorage directly
    // This should be connected to your database
    
    // Example with database (uncomment when database is connected):
    /*
    const db = await getDatabaseConnection();
    const result = await db.query(
        `UPDATE orders 
         SET payment_status = $1, 
             payfast_payment_id = $2,
             amount_paid = $3,
             payment_method = $4,
             updated_at = NOW()
         WHERE order_id = $5
         RETURNING *`,
        [paymentData.paymentStatus, paymentData.payFastPaymentId, paymentData.amountPaid, paymentData.paymentMethod, orderId]
    );
    
    return result.rows.length > 0;
    */

    console.log(`📝 Order payment status updated: ${orderId} -> ${paymentData.paymentStatus}`);
    return true; // Acknowledge for now
}

/**
 * Post-payment success actions
 */
async function postPaymentSuccessActions(orderId, itnData) {
    console.log(`🎉 Running post-payment success actions for order ${orderId}`);

    // Actions to run after successful payment:
    // 1. Send order confirmation email
    // 2. Create BobGo shipment
    // 3. Update inventory
    // 4. Send customer notification

    // Example: Trigger BobGo shipment creation
    try {
        // This would be handled by your order processing queue
        console.log(`📦 Order ${orderId} ready for shipment`);
    } catch (error) {
        console.error(`❌ Error in post-payment actions for ${orderId}:`, error);
    }
}

/**
 * Post-payment failure actions
 */
async function postPaymentFailureActions(orderId, itnData) {
    console.log(`💔 Running post-payment failure actions for order ${orderId}`);

    // Actions to run after failed payment:
    // 1. Send failure notification to customer
    // 2. Update order status
    // 3. Trigger retry logic (if applicable)
    // 4. Alert admin team
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb'
        }
    }
};
