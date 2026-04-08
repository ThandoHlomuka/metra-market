/**
 * BobGo Shipment Creation API Proxy
 * Tries multiple BobGo API endpoints to create shipments
 * Logs detailed request/response data for debugging
 *
 * Shop Address: 1335 Ingwayuma Street, Senaoane, Soweto, Gauteng, 1818
 */

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = (process.env.BOBGO_API_KEY || '').trim();
    const apiUrl = (process.env.BOBGO_API_URL || 'https://api.bobgo.co.za/v2').trim();

    if (!apiKey) {
        console.error('❌ BobGo API key NOT configured');
        return res.status(500).json({
            error: 'Shipping service unavailable',
            message: 'BobGo API key is not configured in Vercel environment variables',
            hint: 'Add BOBGO_API_KEY to Vercel Dashboard → Settings → Environment Variables'
        });
    }

    try {
        const {
            orderId, orderNumber, invoiceNumber,
            senderName, senderPhone, senderEmail, senderAddress,
            senderCity, senderProvince, senderPostalCode,
            recipientName, recipientPhone, recipientEmail,
            recipientAddress, recipientCity, recipientProvince, recipientPostalCode,
            parcels, courierCode, serviceType, shippingCost,
            insuranceAmount, instructions, reference, metadata
        } = req.body;

        // Validate
        if (!recipientName || !recipientAddress || !recipientPhone) {
            return res.status(400).json({
                error: 'Missing recipient info',
                message: 'recipientName, recipientAddress, recipientPhone are required'
            });
        }
        if (!parcels?.length) {
            return res.status(400).json({ error: 'Missing parcels', message: 'At least one parcel required' });
        }

        // Build request body - BobGo v2 API format
        const shipmentData = {
            order_id: orderId || orderNumber || `ORD-${Date.now()}`,
            reference: reference || invoiceNumber || orderNumber || orderId || '',
            provider_slug: 'tcg',
            collection_address: {
                name: senderName || 'Metra Market',
                phone: senderPhone || '+27111234567',
                email: senderEmail || 'support@metramarket.co.za',
                address: senderAddress || '1335 Ingwayuma Street',
                suburb: 'Senaoane',
                city: senderCity || 'Soweto',
                province: senderProvince || 'Gauteng',
                postal_code: senderPostalCode || '1818',
                country: 'ZA'
            },
            delivery_address: {
                name: recipientName,
                phone: recipientPhone,
                email: recipientEmail || 'customer@example.com',
                address: recipientAddress,
                suburb: '',
                city: recipientCity || '',
                province: recipientProvince || '',
                postal_code: recipientPostalCode || '',
                country: 'ZA'
            },
            sender: {
                name: senderName || 'Metra Market',
                phone: senderPhone || '+27111234567',
                email: senderEmail || 'support@metramarket.co.za',
                address: senderAddress || '1335 Ingwayuma Street',
                suburb: 'Senaoane',
                city: senderCity || 'Soweto',
                province: senderProvince || 'Gauteng',
                postal_code: senderPostalCode || '1818',
                country: 'ZA'
            },
            recipient: {
                name: recipientName,
                phone: recipientPhone,
                email: recipientEmail || 'customer@example.com',
                address: recipientAddress,
                city: recipientCity || '',
                province: recipientProvince || '',
                postal_code: recipientPostalCode || '',
                country: 'ZA'
            },
            parcels: parcels.map(p => ({
                weight: Math.round(parseFloat(p.weight || 1) * 1000) / 1000,
                length: Math.round(parseFloat(p.length) || 30),
                width: Math.round(parseFloat(p.width) || 20),
                height: Math.round(parseFloat(p.height) || 15),
                description: p.description || 'E-commerce goods',
                value: parseFloat(p.value || 0)
            })),
            courier_code: courierCode || '',
            service_type: serviceType || 'standard',
            service_level_code: serviceType || 'standard',
            declared_value: parseFloat(insuranceAmount || 0),
            shipping_cost: parseFloat(shippingCost || 0),
            instructions: instructions || '',
            metadata: metadata || {
                platform: 'metra-market',
                order_number: orderNumber || orderId || '',
                payment_status: 'pending_payment',
                order_status: 'pending_payment'
            }
        };

        console.log('📦 Creating shipment:', shipmentData.order_id);
        console.log('📍 Destination:', recipientCity, recipientProvince);
        console.log('📦 Parcels:', parcels.length, 'Total weight:', parcels.reduce((s, p) => s + (p.weight || 1), 0), 'kg');

        // Try multiple possible BobGo v2 API endpoints
        const possibleEndpoints = [
            { path: '/shipments', method: 'POST', label: 'POST /v2/shipments' },
            { path: '/orders', method: 'POST', label: 'POST /v2/orders' }
        ];

        let lastError = null;
        let lastResponse = null;
        let successEndpoint = null;

        for (const endpoint of possibleEndpoints) {
            try {
                const url = `${apiUrl}${endpoint.path}`;
                console.log(`🔄 Trying ${endpoint.label}...`);

                const response = await fetch(url, {
                    method: endpoint.method,
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                        'User-Agent': 'MetraMarket/1.0'
                    },
                    body: JSON.stringify(shipmentData)
                });

                let data;
                try {
                    data = await response.json();
                } catch (e) {
                    const text = await response.text();
                    data = { raw: text };
                }

                console.log(`  → ${endpoint.label}: HTTP ${response.status}`, JSON.stringify(data).substring(0, 200));

                if (response.ok && (data.id || data.shipment_id || data.tracking_number || data.booking_id || data.success)) {
                    // Success!
                    successEndpoint = endpoint.label;
                    lastResponse = { ...data, _endpoint: endpoint.label };
                    break;
                }

                lastError = data;
                lastResponse = data;
            } catch (err) {
                console.log(`  → ${endpoint.label}: FAILED - ${err.message}`);
                lastError = err.message;
            }
        }

        if (successEndpoint && lastResponse) {
            console.log(`✅ Shipment created via ${successEndpoint}`);
            return res.status(200).json({
                success: true,
                shipmentCreated: true,
                endpoint: successEndpoint,
                shipment: {
                    id: lastResponse.id || lastResponse.shipment_id || lastResponse.booking_id || lastResponse.tracking_number || '',
                    tracking_number: lastResponse.tracking_number || lastResponse.tracking || lastResponse.consignment_number || '',
                    status: lastResponse.status || 'created',
                    courier: lastResponse.courier || lastResponse.courier_name || lastResponse.partner_name || '',
                    created_at: lastResponse.created_at || new Date().toISOString()
                },
                bobgoResponse: lastResponse,
                message: `Shipment created via ${successEndpoint}`
            });
        }

        // All endpoints failed
        console.error('❌ All BobGo endpoints failed');
        return res.status(200).json({
            success: false,
            shipmentCreated: false,
            error: 'All BobGo shipment endpoints failed',
            attemptedEndpoints: possibleEndpoints.map(e => e.label),
            lastError: lastError,
            lastResponse: lastResponse,
            message: 'BobGo API does not support shipment creation with known endpoints. Check BobGo dashboard for manual booking.',
            hint: 'Shipments may need to be created manually on BobGo dashboard using order reference: ' + (orderId || 'N/A')
        });

    } catch (error) {
        console.error('❌ BobGo shipment creation error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message,
            shipmentCreated: false
        });
    }
}

export const config = {
    api: { bodyParser: { sizeLimit: '1mb' } }
};
