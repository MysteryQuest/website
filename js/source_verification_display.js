
/**
 * Source Verification Display System
 * Displays source verification data on detail pages
 */

class SourceVerificationDisplay {
    constructor() {
        this.sourceData = null;
        this.currentMysteryId = null;
        this.init();
    }

    async init() {
        try {
            // Load source verification data
            const response = await fetch('./js/enhanced_source_verification.json');
            if (response.ok) {
                this.sourceData = await response.json();
                console.log('✅ Source verification data loaded:', this.sourceData.total_mysteries, 'mysteries');
            }
        } catch (error) {
            console.warn('⚠️ Could not load source verification data:', error);
        }

        // Try to determine current mystery and display sources
        this.detectMysteryAndDisplay();
    }

    detectMysteryAndDisplay() {
        // Try multiple methods to get the current mystery info
        const mysteryName = this.getCurrentMysteryName();
        const mysteryLocation = this.getCurrentMysteryLocation();
        const mysteryDate = this.getCurrentMysteryDate();

        if (mysteryName) {
            const mysteryId = this.generateMysteryId(mysteryName, mysteryLocation, mysteryDate);
            this.displaySourceVerification(mysteryId);
        }
    }

    getCurrentMysteryName() {
        // Try to get mystery name from various page elements
        const selectors = [
            'h1', '.mystery-title', '.event-name', 
            '[data-mystery-name]', '.page-title'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }

        // Try to get from URL or page title
        if (document.title && document.title !== 'Mystery Quest') {
            return document.title.replace(' - Mystery Quest', '').trim();
        }

        return null;
    }

    getCurrentMysteryLocation() {
        // Try to get location from page elements
        const selectors = [
            '.mystery-location', '.location', '[data-location]',
            '.event-location'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }

        return 'Unknown';
    }

    getCurrentMysteryDate() {
        // Try to get date from page elements
        const selectors = [
            '.mystery-date', '.event-date', '[data-date]',
            '.date'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }

        return 'Unknown';
    }

    generateMysteryId(name, location, date) {
        // Generate MD5-like hash (simplified version)
        const content = `${name}_${location}_${date}`.toLowerCase();
        return this.simpleHash(content).substring(0, 16);
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(16);
    }

    displaySourceVerification(mysteryId) {
        if (!this.sourceData || !this.sourceData.mysteries) {
            return;
        }

        const mysteryData = this.sourceData.mysteries[mysteryId];
        if (!mysteryData) {
            console.log('🔍 No source verification data found for mystery ID:', mysteryId);
            return;
        }

        // Show the source verification section
        const section = document.getElementById('source-verification-section');
        if (section) {
            section.style.display = 'block';
        }

        // Update credibility info
        this.updateCredibilityDisplay(mysteryData);

        // Display sources
        this.displaySources(mysteryData.sources);

        console.log('✅ Source verification displayed for mystery:', mysteryId);
    }

    updateCredibilityDisplay(mysteryData) {
        // Update credibility rating
        const ratingElement = document.getElementById('credibility-rating');
        if (ratingElement) {
            ratingElement.textContent = this.formatCredibilityRating(mysteryData.credibility_rating);
            ratingElement.className = `badge ${this.getCredibilityBadgeClass(mysteryData.credibility_rating)}`;
        }

        // Update confidence level
        const confidenceElement = document.getElementById('confidence-level');
        if (confidenceElement) {
            const percentage = Math.round(mysteryData.confidence_level * 100);
            confidenceElement.innerHTML = `${percentage}% <div class="progress" style="width: 100px; display: inline-block;">
                <div class="progress-bar bg-info" style="width: ${percentage}%"></div>
            </div>`;
        }

        // Update total sources
        const sourcesElement = document.getElementById('total-sources');
        if (sourcesElement) {
            sourcesElement.textContent = mysteryData.total_sources;
        }

        // Update weighted score
        const scoreElement = document.getElementById('weighted-score');
        if (scoreElement) {
            scoreElement.textContent = mysteryData.weighted_score.toFixed(1);
        }

        // Update main badge
        const badgeElement = document.getElementById('credibility-badge');
        if (badgeElement) {
            badgeElement.textContent = this.formatCredibilityRating(mysteryData.credibility_rating);
            badgeElement.className = `badge ${this.getCredibilityBadgeClass(mysteryData.credibility_rating)}`;
        }
    }

    displaySources(sources) {
        const sourcesContainer = document.getElementById('sources-list');
        if (!sourcesContainer || !sources) {
            return;
        }

        sourcesContainer.innerHTML = '';

        sources.forEach((source, index) => {
            const sourceCard = document.createElement('div');
            sourceCard.className = 'col-md-6 mb-2';
            
            sourceCard.innerHTML = `
                <div class="card source-card h-100">
                    <div class="card-body p-2">
                        <h6 class="card-title mb-1">
                            <a href="${source.url}" target="_blank" rel="noopener">
                                ${this.truncateText(source.title, 50)}
                            </a>
                        </h6>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="badge badge-${this.getSourceTypeBadgeClass(source.type)}">
                                ${this.formatSourceType(source.type)}
                            </span>
                            <span class="text-muted">
                                Weight: ${source.weight}
                            </span>
                        </div>
                    </div>
                </div>
            `;

            sourcesContainer.appendChild(sourceCard);
        });
    }

    formatCredibilityRating(rating) {
        const ratings = {
            'unverified': 'Unverified',
            'single_source': 'Single Source',
            'limited_sources': 'Limited Sources',
            'multiple_sources': 'Multiple Sources',
            'documented': 'Well Documented',
            'well_documented': 'Highly Documented'
        };
        return ratings[rating] || 'Unknown';
    }

    getCredibilityBadgeClass(rating) {
        const classes = {
            'unverified': 'badge-secondary',
            'single_source': 'badge-warning',
            'limited_sources': 'badge-info',
            'multiple_sources': 'badge-primary',
            'documented': 'badge-success',
            'well_documented': 'badge-success'
        };
        return classes[rating] || 'badge-secondary';
    }

    formatSourceType(type) {
        const types = {
            'news': 'News',
            'academic': 'Academic',
            'government': 'Government',
            'historical': 'Historical',
            'library': 'Library/Archive',
            'encyclopedia': 'Encyclopedia',
            'museum': 'Museum',
            'investigative': 'Investigation',
            'documentary': 'Documentary',
            'blog': 'Blog',
            'unknown': 'Other'
        };
        return types[type] || 'Other';
    }

    getSourceTypeBadgeClass(type) {
        const classes = {
            'academic': 'success',
            'government': 'primary',
            'library': 'info',
            'historical': 'info',
            'encyclopedia': 'info',
            'news': 'warning',
            'investigative': 'secondary',
            'documentary': 'secondary',
            'museum': 'info',
            'blog': 'light',
            'unknown': 'light'
        };
        return classes[type] || 'light';
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SourceVerificationDisplay();
});
