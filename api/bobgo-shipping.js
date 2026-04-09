/**
 * Bobgo Shipping API Proxy
 * This serverless function securely proxies requests to Bobgo API
 * without exposing the API key to the client.
 *
 * Environment Variables Required:
 * - BOBGO_API_KEY: Your Bobgo API key
 * - BOBGO_API_URL: Bobgo API base URL (https://api.bobgo.co.za/v1)
 *
 * Supported Courier Service Codes:
 * - The Courier Guy (tcg): 01/DD, ECO, ECOR, LOX, L2L, XDD, SAT, HOL
 * - Pudo (pudo): L2L (Locker-to-Locker)
 * - Dawn Wing (dawnwing): 01/DD, ECO, SAT
 */

// Service code mapping for all supported couriers
const SERVICE_CODE_MAP = {
    // The Courier Guy Service Codes
    tcg: {
        '01': { name: 'Door-to-Door Standard', description: '1-2 business days (major metros)', type: 'express' },
        'DD': { name: 'Door-to-Door', description: '1-2 business days (major metros), 2-4 days (regional)', type: 'express' },
        'ECO': { name: 'Economy Road', description: '3-5 business days', type: 'economy' },
        'ECOR': { name: 'Economy Road Return', description: '3-5 business days (with return)', type: 'economy' },
        'LOX': { name: 'Locker-to-Door', description: '2-4 business days', type: 'locker' },
        'L2L': { name: 'Locker-to-Locker', description: '1-3 business days', type: 'locker' },
        'XDD': { name: 'Cross-Border Door-to-Door', description: '3-7 business days', type: 'cross-border' },
        'SAT': { name: 'Saturday Delivery', description: 'Next Saturday delivery', type: 'special' },
        'HOL': { name: 'Holiday/After-Hours Delivery', description: 'Public holidays/weekends', type: 'special' }
    },
    // Pudo Service Codes
    pudo: {
        'L2L': { name: 'Locker-to-Locker', description: '1-3 business days', type: 'locker' },
        'STD': { name: 'Standard', description: '2-5 business days', type: 'standard' }
    },
    // Dawn Wing Service Codes
    dawnwing: {
        '01': { name: 'Door-to-Door Standard', description: '1-2 business days', type: 'express' },
        'DD': { name: 'Door-to-Door', description: '1-2 business days', type: 'express' },
        'ECO': { name: 'Economy Road', description: '3-5 business days', type: 'economy' },
        'SAT': { name: 'Saturday Delivery', description: 'Next Saturday', type: 'special' },
        'STD': { name: 'Standard', description: '2-4 business days', type: 'standard' }
    }
};

/**
 * Get service code details for a courier
 * @param {string} courierCode - The courier code (tcg, pudo, dawnwing)
 * @param {string} serviceCode - The service code (01, ECO, LOX, etc.)
 * @returns {Object} Service code details
 */
function getServiceCodeDetails(courierCode, serviceCode) {
    const courier = SERVICE_CODE_MAP[courierCode?.toLowerCase()];
    if (!courier) return null;
    return courier[serviceCode] || null;
}

export default async function handler(req, res) {
    // Allow GET for service code map, POST for shipping calculations
    if (req.method === 'GET') {
        // Return service code map
        return res.status(200).json({
            success: true,
            serviceCodes: SERVICE_CODE_MAP,
            message: 'Service code mapping for all supported couriers'
        });
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed',
            message: 'Only POST requests are accepted'
        });
    }

    // Get API configuration from environment variables
    const apiKey = (process.env.BOBGO_API_KEY || '').trim();
    const apiUrl = (process.env.BOBGO_API_URL || 'https://api.bobgo.co.za/v2').trim();

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
        // Default to /rates endpoint for shipping rate calculation
        const bobgoEndpoint = `${apiUrl}/${endpoint || 'rates'}`;

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
            .map((c, index) => {
                const courierCode = c.code || c.courier_code || c.provider_slug || '';
                const serviceCode = c.service_code || c.service_type || c.service || '';
                
                // Get service code details from mapping
                const serviceDetails = getServiceCodeDetails(courierCode, serviceCode);
                
                return {
                    // Courier identification
                    id: c.id || c.courier_id || `courier_${index}`,
                    code: courierCode,
                    provider_slug: courierCode,

                    // Courier/Partner name
                    name: c.name || c.courier_name || c.partner_name || 'Standard Courier',
                    partner_name: c.partner_name || c.courier_name || c.name || '',

                    // Service details
                    service_type: serviceCode,
                    service_code: serviceCode,
                    service_name: serviceDetails?.name || c.service_name || c.service_type || c.service || 'Standard Delivery',
                    service_description: serviceDetails?.description || c.description || '',
                    service_category: serviceDetails?.type || 'standard',

                    // Pricing (service charges)
                    price: parseFloat(c.price || c.amount || 0),
                    amount: parseFloat(c.amount || c.price || 0),
                    currency: c.currency || 'ZAR',
                    base_price: parseFloat(c.base_price || c.base_amount || c.price || c.amount || 0),

                    // Delivery timing
                    delivery_time: c.delivery_time || c.transit_time || serviceDetails?.description || '2-5 business days',
                    transit_time: c.transit_time || c.delivery_time || '',
                    estimated_delivery_days: c.estimated_delivery_days || null,

                    // Additional service details
                    description: c.description || serviceDetails?.description || '',
                    features: c.features || [],
                    insurance_included: c.insurance_included || false,
                    tracking_included: c.tracking_included !== false, // Default true
                    signature_required: c.signature_required || false,

                    // Raw data for debugging/extensibility
                    raw: c
                };
            });

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
