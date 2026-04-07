/**
 * Bobgo Shipping API Proxy
 * This serverless function securely proxies requests to Bobgo API
 * without exposing the API key to the client.
 * 
 * Environment Variables Required:
 * - BOBGO_API_KEY: Your Bobgo API key
 * - BOBGO_API_URL: Bobgo API base URL (https://api.bobgo.co.za/v1)
 */

export default async function handler(req, res) {
    // Only allow POST requests for shipping calculations
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            error: 'Method not allowed',
            message: 'Only POST requests are accepted' 
        });
    }

    // Get API configuration from environment variables
    const apiKey = process.env.BOBGO_API_KEY;
    const apiUrl = process.env.BOBGO_API_URL || 'https://api.bobgo.co.za/v2';

    // Validate API key is configured
    if (!apiKey) {
        console.error('Bobgo API key not configured');
        return res.status(500).json({ 
            error: 'Shipping service unavailable',
            message: 'Bobgo API is not properly configured' 
        });
    }

    try {
        const { endpoint, ...requestBody } = req.body;

        // Validate required fields
        if (!requestBody.destination || !requestBody.parcels) {
            return res.status(400).json({ 
                error: 'Invalid request',
                message: 'Missing required fields: destination and parcels are required' 
            });
        }

        // Validate parcel data
        if (!Array.isArray(requestBody.parcels) || requestBody.parcels.length === 0) {
            return res.status(400).json({ 
                error: 'Invalid request',
                message: 'At least one parcel is required' 
            });
        }

        // Build the Bobgo API request
        const bobgoEndpoint = `${apiUrl}/${endpoint || 'couriers'}`;
        
        console.log('Proxying request to Bobgo API:', bobgoEndpoint);

        // Make request to Bobgo API
        const response = await fetch(bobgoEndpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                origin: requestBody.origin || '1335 Ingwayuma Street, Senaoane, Soweto, Gauteng, 1818',
                destination: requestBody.destination,
                parcels: requestBody.parcels.map(parcel => ({
                    weight: Math.round(parseFloat(parcel.weight) * 1000) / 1000,
                    length: Math.round(parseFloat(parcel.length)),
                    width: Math.round(parseFloat(parcel.width)),
                    height: Math.round(parseFloat(parcel.height))
                })),
                currency: requestBody.currency || 'ZAR',
                live_rates: requestBody.live_rates !== false // Default to true
            })
        });

        // Handle HTTP errors
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Bobgo API error:', response.status, errorText);
            
            return res.status(response.status).json({ 
                error: 'Bobgo API error',
                message: response.statusText,
                details: errorText
            });
        }

        // Parse and return the response
        const data = await response.json();
        
        // Validate response structure
        if (!data.couriers || !Array.isArray(data.couriers)) {
            console.warn('Invalid response from Bobgo API:', data);
            return res.status(502).json({ 
                error: 'Invalid response',
                message: 'Bobgo API returned invalid response format',
                data: data
            });
        }

        // Return ALL courier data with full service details (no filtering)
        const allCouriers = data.couriers
            .filter(c => c) // Only remove null/undefined entries
            .map((c, index) => ({
                // Courier identification
                id: c.id || c.courier_id || `courier_${index}`,
                code: c.code || c.courier_code || '',
                
                // Courier/Partner name
                name: c.name || c.courier_name || c.partner_name || 'Standard Courier',
                partner_name: c.partner_name || c.courier_name || c.name || '',
                
                // Service details
                service_type: c.service_type || c.service || 'Standard',
                service_name: c.service_name || c.service_type || c.service || 'Standard Delivery',
                
                // Pricing (service charges)
                price: parseFloat(c.price || c.amount || 0),
                amount: parseFloat(c.amount || c.price || 0),
                currency: c.currency || 'ZAR',
                base_price: parseFloat(c.base_price || c.base_amount || c.price || c.amount || 0),
                
                // Delivery timing
                delivery_time: c.delivery_time || c.transit_time || '2-5 business days',
                transit_time: c.transit_time || c.delivery_time || '',
                estimated_delivery_days: c.estimated_delivery_days || null,
                
                // Additional service details
                description: c.description || '',
                features: c.features || [],
                insurance_included: c.insurance_included || false,
                tracking_included: c.tracking_included !== false, // Default true
                signature_required: c.signature_required || false,
                
                // Raw data for debugging/extensibility
                raw: c
            }));

        console.log(`Returning ${allCouriers.length} courier options with full service details`);

        // Return successful response with ALL couriers and metadata
        return res.status(200).json({
            success: true,
            couriers: allCouriers,
            totalCouriers: allCouriers.length,
            defaultCost: allCouriers.length > 0 ? allCouriers[0].price : 0,
            origin: requestBody.origin || 'Johannesburg',
            destination: requestBody.destination,
            parcels: requestBody.parcels,
            currency: 'ZAR',
            // Include raw response for debugging if needed
            metadata: {
                bobgoResponse: {
                    quoteId: data.quote_id || data.id || '',
                    validUntil: data.valid_until || data.expires_at || '',
                    totalOptions: data.couriers.length
                }
            }
        });

    } catch (error) {
        console.error('Bobgo proxy error:', error);
        
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message || 'Failed to calculate shipping'
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
