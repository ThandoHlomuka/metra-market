/**
 * BobGo API Debug/Health Check Endpoint
 * Tests all possible BobGo API endpoints and reports which ones work
 * 
 * Usage: GET /api/bobgo-debug
 */

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'GET only' });
    }

    const apiKey = process.env.BOBGO_API_KEY;
    const apiUrl = process.env.BOBGO_API_URL || 'https://api.bobgo.co.za/v2';
    const results = [];

    if (!apiKey) {
        return res.status(200).json({
            status: 'ERROR',
            message: 'BOBGO_API_KEY not configured in Vercel environment variables',
            hint: 'Go to Vercel Dashboard → metra-market → Settings → Environment Variables → Add BOBGO_API_KEY'
        });
    }

    // Test endpoints
    const tests = [
        { method: 'POST', path: '/couriers', label: 'Courier Rates (confirmed working)', body: { origin: 'Johannesburg', destination: 'Cape Town', parcels: [{ weight: 1, length: 30, width: 20, height: 15 }], currency: 'ZAR', live_rates: false } },
        { method: 'GET', path: '/collection-points', label: 'Collection Points', body: null },
        { method: 'POST', path: '/shipments', label: 'Create Shipment', body: { order_id: 'TEST-001', reference: 'debug-test', sender: { name: 'Test', phone: '+27111111111', email: 'test@test.com', address: 'Test St', suburb: 'Test', city: 'Test', province: 'Gauteng', postal_code: '0001', country: 'ZA' }, recipient: { name: 'Test User', phone: '+27222222222', email: 'user@test.com', address: 'Test Ave', city: 'Test', province: 'Gauteng', postal_code: '0002', country: 'ZA' }, parcels: [{ weight: 1, length: 30, width: 20, height: 15, description: 'Test', value: 100 }], courier_code: '', service_type: 'standard', declared_value: 0, shipping_cost: 0, instructions: 'Debug test' } },
        { method: 'POST', path: '/bookings', label: 'Create Booking', body: { reference: 'debug-test', items: [{ description: 'Test', quantity: 1, value: 100 }] } },
        { method: 'POST', path: '/orders', label: 'Create Order', body: { reference: 'debug-test', items: [{ description: 'Test', quantity: 1 }] } },
        { method: 'POST', path: '/consignments', label: 'Create Consignment', body: { reference: 'debug-test', parcels: [{ weight: 1 }] } },
        { method: 'GET', path: '/health', label: 'Health Check', body: null },
        { method: 'GET', path: '/status', label: 'Status', body: null }
    ];

    for (const test of tests) {
        try {
            const url = `${apiUrl}${test.path}`;
            const options = {
                method: test.method,
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'MetraMarket/1.0 (Debug)'
                }
            };
            if (test.body && test.method === 'POST') {
                options.body = JSON.stringify(test.body);
            }

            const response = await fetch(url, options);
            let data;
            try { data = await response.json(); } catch(e) { data = { raw: await response.text() }; }

            results.push({
                endpoint: `${test.method} ${test.path}`,
                label: test.label,
                status: response.status,
                ok: response.ok,
                hasData: !!(data.id || data.success || data.couriers || data.points || data.tracking_number || data.shipment_id || data.booking_id),
                response: JSON.stringify(data).substring(0, 300)
            });
        } catch (err) {
            results.push({
                endpoint: `${test.method} ${test.path}`,
                label: test.label,
                status: 'ERROR',
                ok: false,
                error: err.message
            });
        }
    }

    const workingEndpoints = results.filter(r => r.ok && r.hasData);
    const accessibleEndpoints = results.filter(r => r.ok);

    res.status(200).json({
        api_url: apiUrl,
        api_key_configured: !!apiKey,
        api_key_preview: apiKey.substring(0, 8) + '...' + apiKey.substring(apiKey.length - 4),
        tests_run: results.length,
        working_endpoints: workingEndpoints.map(e => e.endpoint),
        accessible_endpoints: accessibleEndpoints.map(e => e.endpoint),
        results: results
    });
}
