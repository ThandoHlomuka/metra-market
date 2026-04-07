/**
 * Bobgo Shipment Creation API Proxy
 * This serverless function securely creates shipments on Bobgo's dashboard
 * without exposing the API key to the client.
 * 
 * Shop Address (Primary Collection/Origin):
 * 1335 Ingwayuma Street, Senaoane, Soweto, Gauteng, 1818
 * 
 * Bobgo API Documentation: https://api-docs.bob.co.za/bobgo
 * Endpoint: POST /v1/shipments
 */

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed',
            message: 'Only POST requests are accepted for shipment creation'
        });
    }

    // Get API configuration from environment variables
    const apiKey = process.env.BOBGO_API_KEY;
    const apiUrl = process.env.BOBGO_API_URL || 'https://api.bobgo.co.za/v1';

    // Validate API key is configured
    if (!apiKey) {
        console.error('Bobgo API key not configured for shipment creation');
        return res.status(500).json({
            error: 'Shipping service unavailable',
            message: 'Bobgo API is not properly configured'
        });
    }

    try {
        const {
            // Order reference
            orderId,
            orderNumber,
            invoiceNumber,
            
            // Sender/Shop details (origin)
            senderName,
            senderPhone,
            senderEmail,
            senderAddress,
            senderCity,
            senderProvince,
            senderPostalCode,
            
            // Recipient/Customer details (destination)
            recipientName,
            recipientPhone,
            recipientEmail,
            recipientAddress,
            recipientCity,
            recipientProvince,
            recipientPostalCode,
            
            // Parcel details
            parcels,
            
            // Courier/Service selection
            courierCode,
            serviceType,
            shippingCost,
            
            // Additional options
            insuranceAmount,
            instructions,
            reference
        } = req.body;

        // Validate required fields
        if (!recipientName || !recipientAddress || !recipientPhone) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'Missing required recipient fields: name, address, phone are required'
            });
        }

        if (!parcels || !Array.isArray(parcels) || parcels.length === 0) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'At least one parcel is required'
            });
        }

        // Build Bobgo shipment request body
        // Based on BobGo API structure for shipment creation
        const shipmentData = {
            // Order reference - appears on Bobgo dashboard
            order_id: orderId || orderNumber || `ORD-${Date.now()}`,
            reference: reference || invoiceNumber || orderNumber || orderId || '',
            
            // Sender details (your shop)
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
            
            // Recipient details (customer)
            recipient: {
                name: recipientName,
                phone: recipientPhone,
                email: recipientEmail || '',
                address: recipientAddress,
                city: recipientCity || '',
                province: recipientProvince || '',
                postal_code: recipientPostalCode || '',
                country: 'ZA'
            },
            
            // Parcel details
            parcels: parcels.map(parcel => ({
                weight: Math.round(parseFloat(parcel.weight) * 1000) / 1000, // kg, rounded to 3 decimals
                length: Math.round(parseFloat(parcel.length) || 30), // cm
                width: Math.round(parseFloat(parcel.width) || 20), // cm
                height: Math.round(parseFloat(parcel.height) || 15), // cm
                description: parcel.description || 'E-commerce goods',
                value: parseFloat(parcel.value || 0) // for insurance
            })),
            
            // Courier service selection (if pre-selected)
            courier_code: courierCode || '',
            service_type: serviceType || 'standard',
            
            // Financial
            declared_value: parseFloat(insuranceAmount || 0),
            shipping_cost: parseFloat(shippingCost || 0),
            
            // Additional options
            instructions: instructions || '',
            
            // Metadata for Bobgo dashboard
            metadata: {
                platform: 'metra-market',
                order_number: orderNumber || orderId || '',
                invoice_number: invoiceNumber || '',
                payment_status: 'pending_payment',
                order_status: 'pending_payment',
                customer_email: recipientEmail || '',
                customer_phone: recipientPhone || ''
            }
        };

        console.log('Creating shipment on Bobgo:', shipmentData.order_id);

        // Make request to Bobgo API to create shipment
        const response = await fetch(`${apiUrl}/shipments`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(shipmentData)
        });

        // Parse response
        let responseData;
        try {
            responseData = await response.json();
        } catch (e) {
            const errorText = await response.text();
            console.error('Bobgo API non-JSON response:', errorText);
            responseData = { raw_response: errorText };
        }

        // Handle HTTP errors
        if (!response.ok) {
            console.error('Bobgo shipment creation error:', response.status, responseData);
            
            return res.status(response.status).json({
                error: 'Bobgo API error',
                message: responseData.message || response.statusText,
                details: responseData,
                // Still return success to client so order is saved even if Bobgo fails
                shipmentCreated: false
            });
        }

        console.log('Shipment created successfully on Bobgo:', responseData);

        // Return successful response with shipment details
        return res.status(200).json({
            success: true,
            shipmentCreated: true,
            shipment: {
                id: responseData.id || responseData.shipment_id || responseData.tracking_number || '',
                tracking_number: responseData.tracking_number || responseData.tracking || '',
                status: responseData.status || 'created',
                courier: responseData.courier || responseData.courier_name || '',
                created_at: responseData.created_at || new Date().toISOString()
            },
            bobgoResponse: responseData,
            message: 'Shipment created successfully on Bobgo dashboard'
        });

    } catch (error) {
        console.error('Bobgo shipment creation proxy error:', error);

        return res.status(500).json({
            error: 'Internal server error',
            message: error.message || 'Failed to create shipment',
            shipmentCreated: false
        });
    }
}

// Disable body size limit to allow large requests
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb'
        }
    }
};
