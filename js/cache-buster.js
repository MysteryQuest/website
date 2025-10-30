
// Cache Buster - Force refresh of Google Sheets data
// Generated: 2025-10-29 16:27:39

(function() {
    // Add timestamp to force fresh data
    const timestamp = new Date().getTime();
    
    // Function to reload page data with cache bust
    window.refreshMysteryData = function() {
        console.log('🔄 Refreshing mystery data...');
        
        // Add timestamp to any existing API calls
        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
            if (url.includes('sheets.googleapis.com')) {
                const separator = url.includes('?') ? '&' : '?';
                url += separator + 'cacheBust=' + timestamp;
                console.log('📡 Cache-busted API call:', url);
            }
            return originalFetch.apply(this, arguments);
        };
        
        // Reload the page to get fresh data
        setTimeout(() => {
            window.location.reload(true);
        }, 1000);
    };
    
    // Auto-refresh if data is older than 5 minutes
    const lastRefresh = localStorage.getItem('lastDataRefresh');
    const now = Date.now();
    
    if (!lastRefresh || (now - parseInt(lastRefresh)) > 300000) { // 5 minutes
        console.log('🔄 Auto-refreshing stale data...');
        localStorage.setItem('lastDataRefresh', now.toString());
        window.refreshMysteryData();
    }
    
    // Add refresh button to pages
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addRefreshButton);
    } else {
        addRefreshButton();
    }
    
    function addRefreshButton() {
        const refreshBtn = document.createElement('button');
        refreshBtn.innerHTML = '🔄 Refresh Images';
        refreshBtn.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            background: #007bff;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        `;
        refreshBtn.onclick = window.refreshMysteryData;
        document.body.appendChild(refreshBtn);
    }
})();
