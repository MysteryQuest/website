/**
 * Mystery Quest Client-Side Opt-Out Manager
 * For static websites hosted on GitHub Pages
 */

class MysteryQuestOptOutManager {
    constructor() {
        this.localStorageKey = 'mysteryquest_optouts';
        this.remoteOptOutsUrl = '/opt-outs.json';
        this.formEndpoint = 'https://formspree.io/f/xgvwlkqr'; // Replace with your form service
    }

    /**
     * Check if an email is opted out (client-side check only)
     */
    async isOptedOut(email) {
        if (!email) return false;
        
        const normalizedEmail = email.toLowerCase().trim();
        
        // Check local storage first
        const localOptOuts = this.getLocalOptOuts();
        if (localOptOuts.includes(normalizedEmail)) {
            return true;
        }
        
        // Check remote JSON file (if accessible)
        try {
            const response = await fetch(this.remoteOptOutsUrl);
            if (response.ok) {
                const remoteOptOuts = await response.json();
                return remoteOptOuts.some(record => 
                    record.email && record.email.toLowerCase() === normalizedEmail
                );
            }
        } catch (error) {
            console.warn('Could not check remote opt-outs:', error);
        }
        
        return false;
    }

    /**
     * Add email to local opt-out list
     */
    addOptOut(email) {
        if (!email) return false;
        
        const normalizedEmail = email.toLowerCase().trim();
        const optOuts = this.getLocalOptOuts();
        
        if (!optOuts.includes(normalizedEmail)) {
            optOuts.push(normalizedEmail);
            this.saveLocalOptOuts(optOuts);
        }
        
        return true;
    }

    /**
     * Generate secure opt-out URL
     */
    generateOptOutUrl(email, baseUrl = 'https://mystiqst.com') {
        if (!email) return '';
        
        // Generate a simple token based on email and timestamp
        const timestamp = Math.floor(Date.now() / 1000);
        const tokenString = `${email}:${timestamp}:mystery_quest_opt_out`;
        
        // Simple hash function (for demo - use better crypto in production)
        let hash = 0;
        for (let i = 0; i < tokenString.length; i++) {
            const char = tokenString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        
        const token = Math.abs(hash).toString(16).substring(0, 16);
        
        return `${baseUrl}/opt-out.html?email=${encodeURIComponent(email)}&token=${token}`;
    }

    /**
     * Submit opt-out via form service
     */
    async submitOptOut(email, token, userAgent = '') {
        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('token', token);
            formData.append('timestamp', new Date().toISOString());
            formData.append('type', 'opt-out');
            formData.append('user_agent', userAgent || navigator.userAgent);
            formData.append('_subject', `Mystery Quest Opt-Out: ${email}`);
            
            const response = await fetch(this.formEndpoint, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            return response.ok;
        } catch (error) {
            console.error('Form submission failed:', error);
            return false;
        }
    }

    /**
     * Get locally stored opt-outs
     */
    getLocalOptOuts() {
        try {
            return JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
        } catch (error) {
            console.error('Local storage error:', error);
            return [];
        }
    }

    /**
     * Save opt-outs to local storage
     */
    saveLocalOptOuts(optOuts) {
        try {
            localStorage.setItem(this.localStorageKey, JSON.stringify(optOuts));
            return true;
        } catch (error) {
            console.error('Local storage save error:', error);
            return false;
        }
    }

    /**
     * Get opt-out statistics
     */
    getStats() {
        const localOptOuts = this.getLocalOptOuts();
        return {
            total_local_optouts: localOptOuts.length,
            local_optouts: localOptOuts
        };
    }

    /**
     * Check if outreach should be sent to an email list
     * Returns filtered list excluding opted-out emails
     */
    async filterOptedOutEmails(emailList) {
        if (!Array.isArray(emailList)) return [];
        
        const filteredEmails = [];
        
        for (const email of emailList) {
            const isOptedOut = await this.isOptedOut(email);
            if (!isOptedOut) {
                filteredEmails.push(email);
            } else {
                console.log(`Skipping opted-out email: ${email}`);
            }
        }
        
        return filteredEmails;
    }
}

// Global instance
window.MysteryQuestOptOuts = new MysteryQuestOptOutManager();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MysteryQuestOptOutManager;
}

// Usage examples:
/*

// Check if email is opted out
const isOptedOut = await MysteryQuestOptOuts.isOptedOut('user@example.com');

// Generate opt-out URL for emails
const optOutUrl = MysteryQuestOptOuts.generateOptOutUrl('user@example.com');

// Add email to local opt-out list
MysteryQuestOptOuts.addOptOut('spam@example.com');

// Filter email list before sending
const safeEmails = await MysteryQuestOptOuts.filterOptedOutEmails([
    'user1@example.com', 
    'user2@example.com'
]);

// Get statistics
const stats = MysteryQuestOptOuts.getStats();

*/
