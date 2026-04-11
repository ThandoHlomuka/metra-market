/**
 * BobGo Shipment Creation API Proxy
 * Creates shipments on BobGo dashboard with proper error handling
 *
 * Supported Courier Service Codes:
 * - The Courier Guy (tcg): 01/DD, ECO, ECOR, LOX, L2L, XDD, SAT, HOL
 * - Pudo (pudo): L2L, STD
 * - Dawn Wing (dawnwing): 01/DD, ECO, SAT, STD
 *
 * Shop Address: 1335 Ingwayuma Street, Senaoane, Soweto, Gauteng, 1818
 */

// Service code validation map
const VALID_SERVICE_CODES = {
    tcg: ['01', 'DD', 'ECO', 'ECOR', 'LOX', 'L2L', 'XDD', 'SAT', 'HOL'],
    pudo: ['L2L', 'STD'],
    dawnwing: ['01', 'DD', 'ECO', 'SAT', 'STD']
};

/**
 * Validate service code for a given provider
 */
function validateServiceCode(providerSlug, serviceCode) {
    const provider = providerSlug?.toLowerCase();
    if (!provider || !VALID_SERVICE_CODES[provider]) {
        console.warn(`⚠️ Unknown provider: ${providerSlug}, allowing service code: ${serviceCode}`);
        return true;
    }

    const isValid = VALID_SERVICE_CODES[provider].includes(serviceCode);
    if (!isValid) {
        console.warn(`⚠️ Invalid service code ${serviceCode} for provider ${providerSlug}`);
    }

    return isValid;
}

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
            parcels, courierCode, serviceType, serviceCode, shippingCost,
            insuranceAmount, instructions, reference, metadata,
            provider_slug, service_type, service_level_code
        } = req.body;

        // Validate required fields
        if (!recipientName || !recipientAddress || !recipientPhone) {
            return res.status(400).json({
                error: 'Missing recipient info',
                message: 'recipientName, recipientAddress, recipientPhone are required'
            });
        }
        if (!parcels?.length) {
            return res.status(400).json({ error: 'Missing parcels', message: 'At least one parcel required' });
        }

        // Determine provider and service code with proper fallbacks
        const finalProvider = provider_slug || courierCode || 'tcg';
        const finalServiceCode = service_level_code || serviceCode || service_type || serviceType || 'ECO';

        // Validate service code
        validateServiceCode(finalProvider, finalServiceCode);

        console.log(`📦 Creating shipment with provider: ${finalProvider}, service code: ${finalServiceCode}`);

        // Build request body - BobGo v2 API format
        const shipmentData = {
            order_id: orderId || orderNumber || `ORD-${Date.now()}`,
            reference: reference || invoiceNumber || orderNumber || orderId || '',
            provider_slug: finalProvider,
            service_code: finalServiceCode,
            service_type: finalServiceCode,
            service_level_code: finalServiceCode,
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
            courier_code: finalProvider,
            service_type: finalServiceCode,
            service_level_code: finalServiceCode,
            declared_value: parseFloat(insuranceAmount || 0),
            shipping_cost: parseFloat(shippingCost || 0),
            instructions: instructions || '',
            metadata: metadata || {
                platform: 'metra-market',
                order_number: orderNumber || orderId || '',
                payment_status: 'pending_payment',
                order_status: 'pending_payment',
                service_code: finalServiceCode,
                provider_slug: finalProvider
            }
        };

        console.log('📦 Creating shipment:', shipmentData.order_id);
        console.log('🚚 Provider:', finalProvider, '| Service Code:', finalServiceCode);
        console.log('📍 Destination:', recipientCity, recipientProvince);
        console.log('📦 Parcels:', parcels.length, 'Total weight:', parcels.reduce((s, p) => s + (p.weight || 1), 0), 'kg');

        // Try ONLY the primary endpoint to avoid duplicate shipments
        // Use /orders endpoint as primary (most commonly supported)
        const url = `${apiUrl}/orders`;
        console.log(`🔄 Creating shipment via POST /v2/orders...`);

        const response = await fetch(url, {
            method: 'POST',
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

        console.log(`  → POST /v2/orders: HTTP ${response.status}`, JSON.stringify(data).substring(0, 200));

        if (response.ok && (data.id || data.shipment_id || data.tracking_number || data.booking_id || data.success)) {
            console.log('✅ Shipment created successfully');
            return res.status(200).json({
                success: true,
                shipmentCreated: true,
                endpoint: 'POST /v2/orders',
                shipment: {
                    id: data.id || data.shipment_id || data.booking_id || data.tracking_number || '',
                    tracking_number: data.tracking_number || data.tracking || data.consignment_number || '',
                    status: data.status || 'created',
                    courier: data.courier || data.courier_name || data.partner_name || '',
                    created_at: data.created_at || new Date().toISOString()
                },
                bobgoResponse: data,
                message: 'Shipment created successfully'
            });
        }

        // If primary endpoint fails, return proper error instead of trying alternatives
        console.error('❌ BobGo shipment creation failed:', response.status, data);
        return res.status(502).json({
            success: false,
            shipmentCreated: false,
            error: 'BobGo API rejected shipment',
            bobgoStatus: response.status,
            bobgoResponse: data,
            message: 'Failed to create shipment on BobGo. Check BobGo dashboard for manual booking.',
            hint: 'Shipments may need to be created manually on BobGo dashboard using order reference: ' + (orderId || 'N/A')
        });

    } catch (error) {
        console.error('❌ BobGo shipment creation error:', error);
        return res.status(500).json({
            success: false,
            shipmentCreated: false,
            error: 'Internal server error',
            message: error.message
        });
    }
}

export const config = {
    api: { bodyParser: { sizeLimit: '1mb' } }
};
