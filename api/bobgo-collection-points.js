/**
 * Bobgo Collection Points API Proxy
 * This serverless function securely fetches collection points from Bobgo API
 * without exposing the API key to the client.
 * 
 * Shop Address (Primary Collection Point):
 * 1335 Ingwayuma Street, Senaoane, Soweto, Gauteng, 1818
 */

export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ 
            error: 'Method not allowed',
            message: 'Only GET/POST requests are accepted' 
        });
    }

    // Get API configuration from environment variables
    const apiKey = process.env.BOBGO_API_KEY;
    const apiUrl = process.env.BOBGO_API_URL || 'https://api.bobgo.co.za/v2';

    // Validate API key is configured
    if (!apiKey) {
        console.error('Bobgo API key not configured');
        return res.status(500).json({ 
            error: 'Service unavailable',
            message: 'Bobgo API is not properly configured' 
        });
    }

    try {
        const bobgoEndpoint = `${apiUrl}/collection-points`;
        
        console.log('Fetching collection points from:', bobgoEndpoint);

        // Make request to Bobgo API
        const response = await fetch(bobgoEndpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        // Handle HTTP errors
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Bobgo API error:', response.status, errorText);
            
            return res.status(response.status).json({ 
                error: 'Bobgo API error',
                message: response.statusText
            });
        }

        // Parse and return the response
        const data = await response.json();
        
        console.log('Collection points fetched successfully');

        // Return successful response
        return res.status(200).json({ 
            success: true,
            points: data.points || data.collection_points || data.data || [],
            count: (data.points || data.collection_points || data.data || []).length
        });

    } catch (error) {
        console.error('Collection points proxy error:', error);
        
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message || 'Failed to fetch collection points'
        });
    }
}
