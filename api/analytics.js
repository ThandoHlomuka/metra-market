// Vercel Serverless Function - Get Analytics
// GET /api/analytics

import { db } from './config.js';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { days = '30', type } = req.query;
        const daysNum = parseInt(days);

        // Get events from database
        const events = await db.analytics.getEvents({ days: daysNum });

        // Calculate stats
        const stats = {
            totalEvents: events.length,
            visitors: new Set(events.filter(e => e.event_type === 'page_view').map(e => e.session_id)).size,
            pageViews: events.filter(e => e.event_type === 'page_view').length,
            addToCarts: events.filter(e => e.event_type === 'add_to_cart').length,
            purchases: events.filter(e => e.event_type === 'purchase').length,
            eventsByDay: {}
        };

        // Group by day
        events.forEach(event => {
            const day = new Date(event.created_at).toLocaleDateString('en-ZA');
            stats.eventsByDay[day] = (stats.eventsByDay[day] || 0) + 1;
        });

        res.status(200).json(stats);
    } catch (error) {
        console.error('Analytics fetch error:', error);
        res.status(500).json({ error: error.message });
    }
}
