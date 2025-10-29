/**
 * Credibility and Source Display System
 * ===================================
 * Handles displaying AI scores, user votes, and corroborating sources
 * for mystery entries across the website
 */

class CredibilityDisplaySystem {
    constructor() {
        this.initializeVotingSystem();
        this.setupSourcePopups();
    }

    /**
     * Display credibility information for a mystery entry
     */
    displayCredibilityInfo(mystery, container) {
        const credibilityContainer = document.createElement('div');
        credibilityContainer.className = 'credibility-info bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4';
        
        // Parse AI analysis data
        let aiData = {};
        try {
            aiData = mystery.ai_analysis ? JSON.parse(mystery.ai_analysis) : {};
        } catch (e) {
            console.warn('Could not parse AI analysis data:', e);
        }
        
        const aiScore = mystery.credibility_score || aiData.ai_credibility_score || 'N/A';
        const userVotes = parseInt(mystery.votes) || 0;
        const totalSources = aiData.total_sources || 0;
        const externalSources = aiData.external_sources || 0;
        const internalSources = aiData.internal_sources || 0;
        
        credibilityContainer.innerHTML = `
            <div class="credibility-header mb-3">
                <h4 class="text-lg font-semibold text-primary-blue mb-2">📊 Research Credibility</h4>
            </div>
            
            <div class="credibility-metrics grid grid-cols-3 gap-4 mb-4">
                <!-- AI Credibility Score -->
                <div class="score-item text-center">
                    <div class="score-circle ${this.getScoreColorClass(aiScore)} mx-auto mb-2">
                        <span class="score-value">${aiScore !== 'N/A' ? Math.round(aiScore) : 'N/A'}</span>
                    </div>
                    <div class="score-label text-sm text-gray-600">AI Analysis</div>
                    <div class="score-sublabel text-xs text-gray-500">Evidence-based</div>
                </div>
                
                <!-- User Votes -->
                <div class="score-item text-center">
                    <div class="vote-display">
                        <div class="vote-count text-2xl font-bold text-accent-teal">${userVotes}</div>
                        <div class="vote-buttons mt-1">
                            <button class="vote-btn vote-up" onclick="credibilitySystem.vote('${mystery.event_id}', 'up')">
                                👍
                            </button>
                            <button class="vote-btn vote-down" onclick="credibilitySystem.vote('${mystery.event_id}', 'down')">
                                👎
                            </button>
                        </div>
                    </div>
                    <div class="score-label text-sm text-gray-600">Community Score</div>
                    <div class="score-sublabel text-xs text-gray-500">User ratings</div>
                </div>
                
                <!-- Source Count -->
                <div class="score-item text-center">
                    <div class="source-count-display cursor-pointer" onclick="credibilitySystem.showSources('${mystery.event_id}')">
                        <div class="source-count text-2xl font-bold text-research-blue">${totalSources}</div>
                        <div class="source-breakdown text-xs text-gray-500">
                            ${externalSources} ext • ${internalSources} int
                        </div>
                    </div>
                    <div class="score-label text-sm text-gray-600">Corroborating Sources</div>
                    <div class="score-sublabel text-xs text-gray-500 underline cursor-pointer" onclick="credibilitySystem.showSources('${mystery.event_id}')">
                        Click to view sources
                    </div>
                </div>
            </div>
            
            <!-- Credibility Summary -->
            <div class="credibility-summary p-3 bg-white rounded border">
                <div class="summary-text text-sm text-gray-700">
                    ${this.generateCredibilitySummary(aiScore, userVotes, totalSources)}
                </div>
            </div>
        `;
        
        // Store source data for popup
        if (aiData.corroborating_sources) {
            credibilityContainer.setAttribute('data-sources', JSON.stringify(aiData.corroborating_sources));
        }
        
        container.appendChild(credibilityContainer);
    }

    /**
     * Get CSS class for score color coding
     */
    getScoreColorClass(score) {
        if (score === 'N/A') return 'score-circle-gray';
        
        const numScore = parseInt(score);
        if (numScore >= 80) return 'score-circle-green';
        if (numScore >= 60) return 'score-circle-yellow';
        if (numScore >= 40) return 'score-circle-orange';
        return 'score-circle-red';
    }

    /**
     * Generate credibility summary text
     */
    generateCredibilitySummary(aiScore, userVotes, totalSources) {
        let summary = [];
        
        // AI Score interpretation
        if (aiScore !== 'N/A') {
            const score = parseInt(aiScore);
            if (score >= 80) {
                summary.push("High credibility based on evidence analysis");
            } else if (score >= 60) {
                summary.push("Moderate credibility with some supporting evidence"); 
            } else if (score >= 40) {
                summary.push("Limited credibility, requires additional verification");
            } else {
                summary.push("Low credibility, significant doubts about claims");
            }
        }
        
        // Source count interpretation
        if (totalSources > 5) {
            summary.push(`Well-documented with ${totalSources} corroborating sources`);
        } else if (totalSources > 2) {
            summary.push(`Some documentation with ${totalSources} related sources`);
        } else if (totalSources > 0) {
            summary.push(`Limited documentation with ${totalSources} source(s)`);
        } else {
            summary.push("No corroborating sources found");
        }
        
        // User engagement
        if (userVotes > 50) {
            summary.push("High community engagement");
        } else if (userVotes > 10) {
            summary.push("Active community discussion");
        }
        
        return summary.join('. ') + '.';
    }

    /**
     * Handle user voting
     */
    async vote(eventId, direction) {
        try {
            // In a real implementation, this would make an API call
            console.log(`Voting ${direction} for event ${eventId}`);
            
            // Update UI optimistically
            const voteElement = document.querySelector(`[data-event-id="${eventId}"] .vote-count`);
            if (voteElement) {
                let currentVotes = parseInt(voteElement.textContent) || 0;
                currentVotes += direction === 'up' ? 1 : -1;
                voteElement.textContent = Math.max(0, currentVotes);
            }
            
            // Show feedback
            this.showNotification(`Vote recorded! Thank you for your feedback.`, 'success');
            
        } catch (error) {
            console.error('Error voting:', error);
            this.showNotification('Error recording vote. Please try again.', 'error');
        }
    }

    /**
     * Show sources popup
     */
    showSources(eventId) {
        const credibilityElement = document.querySelector(`[data-event-id="${eventId}"] .credibility-info`);
        if (!credibilityElement) return;
        
        const sourcesData = credibilityElement.getAttribute('data-sources');
        if (!sourcesData) {
            this.showNotification('No source data available', 'info');
            return;
        }
        
        let sources = [];
        try {
            sources = JSON.parse(sourcesData);
        } catch (e) {
            console.error('Error parsing sources data:', e);
            return;
        }
        
        this.createSourcesPopup(sources);
    }

    /**
     * Create and display sources popup
     */
    createSourcesPopup(sources) {
        // Remove any existing popup
        const existingPopup = document.getElementById('sources-popup');
        if (existingPopup) {
            existingPopup.remove();
        }
        
        const popup = document.createElement('div');
        popup.id = 'sources-popup';
        popup.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        
        const externalSources = sources.filter(s => !s.is_internal);
        const internalSources = sources.filter(s => s.is_internal);
        
        popup.innerHTML = `
            <div class="bg-white rounded-lg max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                <div class="popup-header p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 class="text-xl font-bold text-primary-blue">📚 Corroborating Sources</h3>
                    <button onclick="document.getElementById('sources-popup').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">×</button>
                </div>
                
                <div class="popup-content p-6 overflow-y-auto">
                    ${externalSources.length > 0 ? `
                        <div class="source-section mb-6">
                            <h4 class="text-lg font-semibold text-research-blue mb-3">🌐 External Sources (${externalSources.length})</h4>
                            <div class="source-list space-y-3">
                                ${externalSources.map(source => this.renderSourceItem(source)).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${internalSources.length > 0 ? `
                        <div class="source-section">
                            <h4 class="text-lg font-semibold text-accent-teal mb-3">🏠 Internal Sources (${internalSources.length})</h4>
                            <div class="source-list space-y-3">
                                ${internalSources.map(source => this.renderSourceItem(source)).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${sources.length === 0 ? `
                        <div class="no-sources text-center py-8 text-gray-500">
                            <div class="text-4xl mb-4">🔍</div>
                            <div class="text-lg">No corroborating sources found</div>
                            <div class="text-sm mt-2">This doesn't necessarily mean the information is inaccurate</div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="popup-footer p-4 border-t border-gray-200 bg-gray-50 text-center">
                    <div class="text-sm text-gray-600">
                        Sources are automatically collected and analyzed. 
                        <strong>Always verify information independently.</strong>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Close popup when clicking outside
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.remove();
            }
        });
    }

    /**
     * Render individual source item
     */
    renderSourceItem(source) {
        const credibilityBadge = this.getCredibilityBadge(source.credibility);
        const isExternal = !source.is_internal;
        
        return `
            <div class="source-item p-4 border border-gray-200 rounded-lg hover:border-primary-blue transition-colors">
                <div class="source-header flex justify-between items-start mb-2">
                    <div class="source-title">
                        <a href="${source.url}" target="${isExternal ? '_blank' : '_self'}" 
                           class="text-primary-blue hover:text-primary-navy font-medium">
                            ${source.title}
                            ${isExternal ? ' 🔗' : ''}
                        </a>
                    </div>
                    ${credibilityBadge}
                </div>
                
                <div class="source-meta flex items-center gap-4 text-sm text-gray-600">
                    <span class="source-name">${source.source}</span>
                    ${source.date ? `<span class="source-date">${source.date}</span>` : ''}
                    ${source.similarity_score ? `<span class="similarity-score">Similarity: ${source.similarity_score}%</span>` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Get credibility badge HTML
     */
    getCredibilityBadge(credibility) {
        const badges = {
            'high': '<span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">High Credibility</span>',
            'medium': '<span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Medium Credibility</span>',
            'low': '<span class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Low Credibility</span>',
            'internal': '<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Internal Source</span>'
        };
        
        return badges[credibility] || badges['medium'];
    }

    /**
     * Initialize voting system
     */
    initializeVotingSystem() {
        // Add voting styles
        const style = document.createElement('style');
        style.textContent = `
            .score-circle {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 18px;
                color: white;
            }
            
            .score-circle-green { background: #22c55e; }
            .score-circle-yellow { background: #eab308; }
            .score-circle-orange { background: #f97316; }
            .score-circle-red { background: #ef4444; }
            .score-circle-gray { background: #6b7280; }
            
            .vote-btn {
                background: none;
                border: 1px solid #d1d5db;
                border-radius: 4px;
                padding: 4px 8px;
                margin: 0 2px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .vote-btn:hover {
                background: #f3f4f6;
                transform: scale(1.1);
            }
            
            .source-count-display:hover {
                transform: scale(1.05);
                transition: transform 0.2s;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Setup source popup system
     */
    setupSourcePopups() {
        // No additional setup needed for now
    }

    /**
     * Show notification to user
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
            type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
            type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
            'bg-blue-100 text-blue-800 border border-blue-200'
        }`;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the credibility system
const credibilitySystem = new CredibilityDisplaySystem();

// Export for use in other scripts
window.credibilitySystem = credibilitySystem;