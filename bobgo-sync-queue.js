/**
 * BobGo Shipment Sync Queue
 * Handles failed shipment synchronization with retry mechanism
 * Stores failed shipments in localStorage and retries them automatically
 */

(function() {
    'use strict';

    const PENDING_SHIPMENTS_KEY = 'metraPendingShipments';
    const FAILED_SHIPMENTS_KEY = 'metraFailedShipments';
    const MAX_RETRY_ATTEMPTS = 5;
    const RETRY_INTERVAL_MS = 30000; // 30 seconds between retries

    /**
     * Add a shipment to the pending sync queue
     */
    function addToPendingQueue(shipmentData) {
        try {
            const pending = JSON.parse(localStorage.getItem(PENDING_SHIPMENTS_KEY) || '[]');
            
            const queueItem = {
                id: 'pending_' + Date.now(),
                orderId: shipmentData.orderId,
                shipmentData: shipmentData,
                attempts: 0,
                maxAttempts: MAX_RETRY_ATTEMPTS,
                createdAt: new Date().toISOString(),
                lastAttempt: null,
                status: 'pending'
            };
            
            pending.push(queueItem);
            localStorage.setItem(PENDING_SHIPMENTS_KEY, JSON.stringify(pending));
            
            console.log('📦 Added to pending queue:', queueItem.id);
            return queueItem;
        } catch(e) {
            console.error('Error adding to pending queue:', e);
        }
    }

    /**
     * Move a shipment from pending to failed
     */
    function moveToFailed(pendingItem, error) {
        try {
            const failed = JSON.parse(localStorage.getItem(FAILED_SHIPMENTS_KEY) || '[]');
            
            const failedItem = {
                ...pendingItem,
                status: 'failed',
                error: error?.message || 'Unknown error',
                failedAt: new Date().toISOString()
            };
            
            failed.push(failedItem);
            localStorage.setItem(FAILED_SHIPMENTS_KEY, JSON.stringify(failed));
            
            console.log('❌ Moved to failed queue:', pendingItem.id);
        } catch(e) {
            console.error('Error moving to failed queue:', e);
        }
    }

    /**
     * Remove a shipment from the pending queue (after successful sync)
     */
    function removeFromPending(queueId) {
        try {
            const pending = JSON.parse(localStorage.getItem(PENDING_SHIPMENTS_KEY) || '[]');
            const filtered = pending.filter(item => item.id !== queueId);
            localStorage.setItem(PENDING_SHIPMENTS_KEY, JSON.stringify(filtered));
        } catch(e) {
            console.error('Error removing from pending queue:', e);
        }
    }

    /**
     * Get all pending shipments
     */
    function getPendingShipments() {
        try {
            return JSON.parse(localStorage.getItem(PENDING_SHIPMENTS_KEY) || '[]');
        } catch(e) {
            console.error('Error getting pending shipments:', e);
            return [];
        }
    }

    /**
     * Get all failed shipments
     */
    function getFailedShipments() {
        try {
            return JSON.parse(localStorage.getItem(FAILED_SHIPMENTS_KEY) || '[]');
        } catch(e) {
            console.error('Error getting failed shipments:', e);
            return [];
        }
    }

    /**
     * Process pending shipments - attempt to sync with BobGo
     */
    async function processPendingQueue() {
        const pending = getPendingShipments();
        if (pending.length === 0) return;

        console.log(`🔄 Processing ${pending.length} pending shipment(s)...`);

        for (const item of pending) {
            // Skip if max attempts reached
            if (item.attempts >= item.maxAttempts) {
                moveToFailed(item, new Error('Max retry attempts reached'));
                removeFromPending(item.id);
                continue;
            }

            // Skip if too soon since last attempt
            if (item.lastAttempt) {
                const timeSinceLastAttempt = Date.now() - new Date(item.lastAttempt).getTime();
                if (timeSinceLastAttempt < RETRY_INTERVAL_MS) {
                    continue;
                }
            }

            // Attempt to create shipment
            item.attempts++;
            item.lastAttempt = new Date().toISOString();
            item.status = 'syncing';
            
            try {
                const response = await fetch('/api/bobgo-create-shipment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item.shipmentData)
                });

                const data = await response.json();

                if (data.shipmentCreated && data.shipment) {
                    // Success! Update order with tracking info
                    updateOrderWithTracking(item.shipmentData.orderId, data.shipment);
                    removeFromPending(item.id);
                    console.log('✅ Synced shipment:', item.id);
                } else {
                    // Failed - update status for next retry
                    item.status = 'pending';
                    item.lastError = data.message || 'Unknown error';
                    savePendingUpdate(item);
                }
            } catch(err) {
                console.error('❌ Error syncing shipment:', item.id, err);
                item.status = 'pending';
                item.lastError = err.message;
                savePendingUpdate(item);
            }
        }
    }

    /**
     * Update pending item in localStorage
     */
    function savePendingUpdate(item) {
        try {
            const pending = getPendingShipments();
            const index = pending.findIndex(p => p.id === item.id);
            if (index !== -1) {
                pending[index] = item;
                localStorage.setItem(PENDING_SHIPMENTS_KEY, JSON.stringify(pending));
            }
        } catch(e) {
            console.error('Error saving pending update:', e);
        }
    }

    /**
     * Update order in localStorage with BobGo tracking info
     */
    function updateOrderWithTracking(orderId, shipment) {
        try {
            const orders = JSON.parse(localStorage.getItem('metraOrders') || '[]');
            const orderIndex = orders.findIndex(o => o.id === orderId);
            
            if (orderIndex !== -1) {
                orders[orderIndex].bobgoShipment = shipment;
                orders[orderIndex].bobgoTrackingNumber = shipment.tracking_number || '';
                orders[orderIndex].bobgoShipmentId = shipment.id || '';
                orders[orderIndex].shipmentStatus = shipment.status || 'created';
                orders[orderIndex].bobgoSyncedAt = new Date().toISOString();
                
                localStorage.setItem('metraOrders', JSON.stringify(orders));
                console.log('📝 Updated order with tracking:', orderId);
            }
        } catch(e) {
            console.error('Error updating order with tracking:', e);
        }
    }

    /**
     * Retry a specific failed shipment
     */
    async function retryFailedShipment(queueId) {
        const failed = getFailedShipments();
        const item = failed.find(f => f.id === queueId);
        
        if (!item) {
            console.error('Failed shipment not found:', queueId);
            return false;
        }

        try {
            // Move back to pending queue
            const pendingItem = {
                ...item,
                status: 'pending',
                attempts: 0,
                lastAttempt: null,
                error: null
            };
            
            // Remove from failed
            const updatedFailed = failed.filter(f => f.id !== queueId);
            localStorage.setItem(FAILED_SHIPMENTS_KEY, JSON.stringify(updatedFailed));
            
            // Add to pending
            const pending = getPendingShipments();
            pending.push(pendingItem);
            localStorage.setItem(PENDING_SHIPMENTS_KEY, JSON.stringify(pending));
            
            // Process immediately
            await processPendingQueue();
            
            return true;
        } catch(e) {
            console.error('Error retrying failed shipment:', e);
            return false;
        }
    }

    /**
     * Clear all failed shipments
     */
    function clearFailedShipments() {
        localStorage.removeItem(FAILED_SHIPMENTS_KEY);
        console.log('🗑️ Cleared failed shipments');
    }

    /**
     * Get queue statistics
     */
    function getQueueStats() {
        const pending = getPendingShipments();
        const failed = getFailedShipments();
        
        return {
            pending: pending.length,
            failed: failed.length,
            totalAttempts: pending.reduce((sum, p) => sum + p.attempts, 0)
        };
    }

    // Auto-process pending queue on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => processPendingQueue(), 5000); // Wait 5 seconds after page load
        });
    } else {
        setTimeout(() => processPendingQueue(), 5000);
    }

    // Process every 60 seconds
    setInterval(() => processPendingQueue(), 60000);

    // Expose API to window
    window.bobgoSyncQueue = {
        addToQueue: addToPendingQueue,
        getPending: getPendingShipments,
        getFailed: getFailedShipments,
        retryFailed: retryFailedShipment,
        clearFailed: clearFailedShipments,
        getStats: getQueueStats,
        processNow: processPendingQueue
    };

})();
