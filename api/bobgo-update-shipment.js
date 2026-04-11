/**
 * BobGo Shipment Status Update API Proxy
 * Updates the payment/order status of an existing shipment on BobGo dashboard
 *
 * Supports status transitions:
 * - pending_payment → paid → processing → shipped → delivered
 * - pending_payment → cancelled
 * - pending_payment → refunded
 */

export default async function handler(req, res) {
    if (req.method !== 'POST' && req.method !== 'PUT') {
        return res.status(405).json({
            error: 'Method not allowed',
            message: 'Only POST/PUT requests are accepted'
        });
    }

    const apiKey = (process.env.BOBGO_API_KEY || '').trim();
    const apiUrl = (process.env.BOBGO_API_URL || 'https://api.bobgo.co.za/v2').trim();

    if (!apiKey) {
        return res.status(500).json({
            error: 'Service unavailable',
            message: 'BobGo API not configured'
        });
    }

    try {
        const {
            shipmentId,
            orderId,
            trackingNumber,
            paymentStatus,
            orderStatus,
            notes
        } = req.body;

        if (!shipmentId && !orderId) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'shipmentId or orderId is required'
            });
        }

        if (!paymentStatus && !orderStatus) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'paymentStatus or orderStatus is required'
            });
        }

        // Build the update payload
        const updateData = {
            metadata: {
                payment_status: paymentStatus || 'unknown',
                order_status: orderStatus || 'unknown',
                updated_at: new Date().toISOString(),
                notes: notes || ''
            }
        };

        console.log(`Updating shipment ${shipmentId || orderId} status:`, updateData);

        // Try to update the shipment via BobGo API
        const bobgoUrl = shipmentId
            ? `${apiUrl}/shipments/${shipmentId}`
            : `${apiUrl}/shipments?order_id=${orderId}`;

        const response = await fetch(bobgoUrl, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        let responseData;
        try {
            responseData = await response.json();
        } catch (e) {
            responseData = { raw_response: await response.text() };
        }

        if (!response.ok) {
            console.error('BobGo status update error:', response.status, responseData);

            // Return proper error status instead of 200
            return res.status(502).json({
                success: false,
                error: responseData.message || response.statusText,
                bobgoStatus: response.status,
                message: 'Failed to update shipment status on BobGo',
                data: { shipmentId, orderId, paymentStatus, orderStatus }
            });
        }

        console.log('Shipment status updated successfully:', responseData);

        return res.status(200).json({
            success: true,
            bobgoUpdate: true,
            shipment: responseData,
            data: { shipmentId, orderId, paymentStatus, orderStatus }
        });

    } catch (error) {
        console.error('BobGo status update proxy error:', error);

        // Return proper 500 error instead of 200
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
