/**
 * Analytics Tracking Module
 * Integrates Google Analytics and Microsoft Clarity
 * Loads tracking scripts dynamically based on admin configuration
 */

(function() {
    'use strict';

    const TRACKING_CONFIG_KEY = 'metraTrackingConfig';

    /**
     * Load tracking configuration from localStorage
     */
    function getTrackingConfig() {
        try {
            const config = localStorage.getItem(TRACKING_CONFIG_KEY);
            return config ? JSON.parse(config) : {
                googleAnalyticsId: '',
                clarityProjectId: '',
                enabled: false
            };
        } catch(e) {
            console.error('Error loading tracking config:', e);
            return { googleAnalyticsId: '', clarityProjectId: '', enabled: false };
        }
    }

    /**
     * Initialize Google Analytics (GA4)
     */
    function initGoogleAnalytics(measurementId) {
        if (!measurementId) return;

        // Prevent double initialization
        if (window.dataLayer && window.dataLayer._gaInitialized) return;

        window.dataLayer = window.dataLayer || [];
        window.dataLayer._gaInitialized = true;

        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', measurementId, {
            'send_page_view': true,
            'custom_map': {
                'dimension1': 'user_type',
                'dimension2': 'customer_id'
            }
        });

        // Load GA script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(script);

        console.log('✅ Google Analytics initialized:', measurementId);
    }

    /**
     * Initialize Microsoft Clarity
     */
    function initClarity(projectId) {
        if (!projectId) return;

        // Prevent double initialization
        if (window.clarity && window.clarity._initialized) return;

        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            c[a]._initialized = true;
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", projectId);

        console.log('✅ Microsoft Clarity initialized:', projectId);
    }

    /**
     * Track page view manually (useful for SPAs)
     */
    function trackPageView(pagePath, pageTitle) {
        const config = getTrackingConfig();
        if (!config.enabled) return;

        // Google Analytics page view
        if (config.googleAnalyticsId && window.gtag) {
            gtag('event', 'page_view', {
                page_title: pageTitle || document.title,
                page_location: window.location.href,
                page_path: pagePath || window.location.pathname
            });
        }
    }

    /**
     * Track custom event
     */
    function trackEvent(eventName, params = {}) {
        const config = getTrackingConfig();
        if (!config.enabled) return;

        // Google Analytics event
        if (config.googleAnalyticsId && window.gtag) {
            gtag('event', eventName, params);
        }

        // Also track in local analytics
        if (window.trackEvent) {
            window.trackEvent(eventName, params);
        }
    }

    /**
     * Set user properties for tracking
     */
    function setUserProperties(properties) {
        const config = getTrackingConfig();
        if (!config.enabled) return;

        if (config.googleAnalyticsId && window.gtag) {
            gtag('set', 'user_properties', properties);
        }

        // Microsoft Clarity user properties
        if (config.clarityProjectId && window.clarity) {
            clarity('set', 'userdata', properties);
        }
    }

    /**
     * Identify user (for logged-in users)
     */
    function identifyUser(userId, userName, userEmail) {
        const config = getTrackingConfig();
        if (!config.enabled) return;

        // Google Analytics user ID
        if (config.googleAnalyticsId && window.gtag) {
            gtag('set', { user_id: userId });
            gtag('set', 'user_properties', {
                user_name: userName,
                user_email: userEmail
            });
        }

        // Microsoft Clarity identity
        if (config.clarityProjectId && window.clarity) {
            clarity('identify', userId, userName, userEmail);
        }
    }

    /**
     * Track e-commerce purchase
     */
    function trackPurchase(order) {
        const config = getTrackingConfig();
        if (!config.enabled) return;

        const items = (order.items || []).map(item => ({
            item_id: item.id,
            item_name: item.name,
            price: item.price,
            quantity: item.quantity || 1
        }));

        // Google Analytics purchase event
        if (config.googleAnalyticsId && window.gtag) {
            gtag('event', 'purchase', {
                transaction_id: order.id,
                value: order.total,
                currency: 'ZAR',
                items: items
            });
        }

        // Microsoft Clarity purchase
        if (config.clarityProjectId && window.clarity) {
            clarity('event', 'purchase', {
                orderId: order.id,
                total: order.total,
                items: items.length
            });
        }
    }

    /**
     * Initialize all tracking scripts based on configuration
     */
    function initTracking() {
        const config = getTrackingConfig();
        if (!config.enabled) {
            console.log('ℹ️ Tracking disabled in configuration');
            return;
        }

        if (config.googleAnalyticsId) {
            initGoogleAnalytics(config.googleAnalyticsId);
        }

        if (config.clarityProjectId) {
            initClarity(config.clarityProjectId);
        }
    }

    /**
     * Save tracking configuration
     */
    function saveTrackingConfig(config) {
        localStorage.setItem(TRACKING_CONFIG_KEY, JSON.stringify(config));
        console.log('✅ Tracking config saved');
    }

    // Auto-initialize on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTracking);
    } else {
        initTracking();
    }

    // Expose API to window
    window.metraTracking = {
        init: initTracking,
        getConfig: getTrackingConfig,
        saveConfig: saveTrackingConfig,
        trackPageView: trackPageView,
        trackEvent: trackEvent,
        setUserProperties: setUserProperties,
        identifyUser: identifyUser,
        trackPurchase: trackPurchase
    };

})();
