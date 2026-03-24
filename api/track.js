// Vercel Serverless Function - Track Analytics Event
// POST /api/track

import { db } from './config.js';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { eventType, userId, sessionId, pageUrl, metadata } = req.body;

        if (!eventType) {
            return res.status(400).json({ error: 'eventType is required' });
        }

        const eventData = {
            event_type: eventType,
            user_id: userId || null,
            session_id: sessionId || null,
            page_url: pageUrl || null,
            metadata: metadata || {},
            created_at: new Date().toISOString()
        };

        // Track event in database
        await db.analytics.track(eventData);

        // Also track in localStorage for offline/fallback
        if (typeof localStorage !== 'undefined') {
            const events = JSON.parse(localStorage.getItem('metraAnalytics') || '[]');
            events.push(eventData);
            localStorage.setItem('metraAnalytics', JSON.stringify(events));
        }

        res.status(200).json({ success: true, message: 'Event tracked' });
    } catch (error) {
        console.error('Analytics tracking error:', error);
        
        // Fallback to localStorage
        if (typeof localStorage !== 'undefined') {
            const events = JSON.parse(localStorage.getItem('metraAnalytics') || '[]');
            events.push(req.body);
            localStorage.setItem('metraAnalytics', JSON.stringify(events));
        }

        res.status(500).json({ error: error.message });
    }
}
