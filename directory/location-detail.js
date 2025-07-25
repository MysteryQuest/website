// Location Detail Page JavaScript
// Handles maps, content loading, and interactive features

let locationMap = null;
let sightingsMap = null;

// Initialize the main location map (legacy support)
function initLocationMap() {
    if (!LOCATION_DATA || !LOCATION_DATA.coordinates) {
        console.log('No coordinates available for location map');
        return;
    }

    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    locationMap = L.map('map').setView(LOCATION_DATA.coordinates, 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(locationMap);

    // Add location marker
    const locationMarker = L.marker(LOCATION_DATA.coordinates).addTo(locationMap);
    locationMarker.bindPopup(`
        <div class="location-popup">
            <h6>${LOCATION_DATA.name}</h6>
            <p><strong>Category:</strong> ${LOCATION_DATA.category.toUpperCase()}</p>
            <p><strong>Reports:</strong> ${LOCATION_DATA.events.length}</p>
            <p><strong>Services:</strong> ${LOCATION_DATA.businesses.length}</p>
        </div>
    `);

    // Add event markers
    LOCATION_DATA.events.forEach((event, index) => {
        let eventCoords = LOCATION_DATA.coordinates; // Default to location coords
        
        if (event.coordinates) {
            eventCoords = event.coordinates;
        }

        const eventMarker = L.marker(eventCoords, {
            icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        }).addTo(locationMap);

        eventMarker.bindPopup(`
            <div class="event-popup">
                <h6>${event.name || 'Unknown Event'}</h6>
                <p><strong>Type:</strong> ${event.type || 'Unknown'}</p>
                <p><strong>Description:</strong> ${event.description || 'No description available'}</p>
                ${event.date ? `<p><strong>Date:</strong> ${event.date}</p>` : ''}
            </div>
        `);
    });

    // Add business markers
    LOCATION_DATA.businesses.forEach(business => {
        const geometry = business.geometry || {};
        const location = geometry.location || {};
        
        if (location.lat && location.lng) {
            const businessMarker = L.marker([location.lat, location.lng], {
                icon: L.icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                })
            }).addTo(locationMap);

            businessMarker.bindPopup(`
                <div class="business-popup">
                    <h6>${business.name || 'Unknown Business'}</h6>
                    <p><strong>Type:</strong> ${business.keyword || 'Service'}</p>
                    <p><strong>Address:</strong> ${business.address || 'No address available'}</p>
                    ${business.rating ? `<p><strong>Rating:</strong> ${business.rating}/5</p>` : ''}
                    ${business.phone ? `<p><strong>Phone:</strong> ${business.phone}</p>` : ''}
                </div>
            `);
        }
    });
}

// Load location content (legacy support)
function loadLocationContent() {
    loadLocationDetails();
    loadSightingsList();
    loadLocalServices();
}

// Load location details into the page
function loadLocationDetails() {
    const locationDetails = document.getElementById('locationDetails');
    if (!locationDetails || !LOCATION_DATA) return;

    const category = LOCATION_DATA.category;
    const categoryNames = {
        'ufo': 'UFO Sightings',
        'paranormal': 'Paranormal Activity',
        'historical': 'Historical Mysteries',
        'cryptid': 'Cryptid Encounters',
        'conspiracy': 'Conspiracy Investigations'
    };

    const categoryDisplay = categoryNames[category] || 'Mystery';
    const businessCount = LOCATION_DATA.businesses.length;
    const eventCount = LOCATION_DATA.events.length;

    locationDetails.innerHTML = `
        <div class="location-header">
            <div class="row">
                <div class="col-md-8">
                    <h1 class="location-title">${LOCATION_DATA.name}</h1>
                    <p class="location-description">${LOCATION_DATA.metadata.page_description || ''}</p>
                </div>
                <div class="col-md-4">
                    <div class="location-stats">
                        <div class="stat-item">
                            <span class="stat-number">${eventCount}</span>
                            <span class="stat-label">Recent Reports</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${businessCount}</span>
                            <span class="stat-label">Local Services</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-badge ${category}">${category.toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Load sightings list
function loadSightingsList() {
    const sightingsList = document.getElementById('sightingsList');
    if (!sightingsList || !LOCATION_DATA) return;

    if (LOCATION_DATA.events.length === 0) {
        sightingsList.innerHTML = '<p class="no-sightings">No recent sightings reported for this location.</p>';
        return;
    }

    const sightingsHtml = LOCATION_DATA.events.map(event => {
        const eventDate = event.date || 'Unknown date';
        const eventName = event.name || 'Unnamed Event';
        const eventType = event.type || 'Unknown Type';
        const eventDescription = event.description || 'No description available';

        return `
            <div class="sighting-item">
                <div class="sighting-header">
                    <h5 class="sighting-name">${eventName}</h5>
                    <span class="sighting-type">${eventType}</span>
                </div>
                <p class="sighting-description">${eventDescription}</p>
                <div class="sighting-meta">
                    <span class="sighting-date">${eventDate}</span>
                    <span class="sighting-category">${event.category || 'unknown'}</span>
                </div>
            </div>
        `;
    }).join('');

    sightingsList.innerHTML = sightingsHtml;
}

// Load local services
function loadLocalServices() {
    const localServices = document.getElementById('localServices');
    if (!localServices || !LOCATION_DATA) return;

    if (LOCATION_DATA.businesses.length === 0) {
        localServices.innerHTML = '<p class="no-services">No local services found for this location.</p>';
        return;
    }

    const servicesHtml = LOCATION_DATA.businesses.map(business => {
        const businessName = business.name || 'Unknown Business';
        const businessType = business.keyword || 'Service';
        const businessAddress = business.address || 'No address available';
        const businessRating = business.rating || null;
        const businessPhone = business.phone || null;
        const businessWebsite = business.website || null;

        return `
            <div class="service-item">
                <div class="service-header">
                    <h6 class="service-name">${businessName}</h6>
                    ${businessRating ? `<span class="service-rating">⭐ ${businessRating}</span>` : ''}
                </div>
                <p class="service-type">${businessType}</p>
                <p class="service-address">${businessAddress}</p>
                <div class="service-contact">
                    ${businessPhone ? `<span class="service-phone">📞 ${businessPhone}</span>` : ''}
                    ${businessWebsite ? `<a href="${businessWebsite}" target="_blank" class="service-website">🌐 Website</a>` : ''}
                </div>
            </div>
        `;
    }).join('');

    localServices.innerHTML = servicesHtml;
}

// Search functionality
function searchLocation() {
    const searchInput = document.getElementById('locationSearch');
    if (!searchInput) return;

    const query = searchInput.value.toLowerCase().trim();
    
    if (!query) {
        // Reset display
        loadSightingsList();
        loadLocalServices();
        return;
    }

    // Filter events
    const filteredEvents = LOCATION_DATA.events.filter(event => {
        return (event.name && event.name.toLowerCase().includes(query)) ||
               (event.description && event.description.toLowerCase().includes(query)) ||
               (event.type && event.type.toLowerCase().includes(query));
    });

    // Filter businesses
    const filteredBusinesses = LOCATION_DATA.businesses.filter(business => {
        return (business.name && business.name.toLowerCase().includes(query)) ||
               (business.keyword && business.keyword.toLowerCase().includes(query)) ||
               (business.address && business.address.toLowerCase().includes(query));
    });

    // Update displays with filtered results
    displayFilteredSightings(filteredEvents);
    displayFilteredServices(filteredBusinesses);
}

function displayFilteredSightings(events) {
    const sightingsList = document.getElementById('sightingsList');
    if (!sightingsList) return;

    if (events.length === 0) {
        sightingsList.innerHTML = '<p class="no-sightings">No sightings match your search.</p>';
        return;
    }

    const sightingsHtml = events.map(event => {
        const eventDate = event.date || 'Unknown date';
        const eventName = event.name || 'Unnamed Event';
        const eventType = event.type || 'Unknown Type';
        const eventDescription = event.description || 'No description available';

        return `
            <div class="sighting-item">
                <div class="sighting-header">
                    <h5 class="sighting-name">${eventName}</h5>
                    <span class="sighting-type">${eventType}</span>
                </div>
                <p class="sighting-description">${eventDescription}</p>
                <div class="sighting-meta">
                    <span class="sighting-date">${eventDate}</span>
                    <span class="sighting-category">${event.category || 'unknown'}</span>
                </div>
            </div>
        `;
    }).join('');

    sightingsList.innerHTML = sightingsHtml;
}

function displayFilteredServices(businesses) {
    const localServices = document.getElementById('localServices');
    if (!localServices) return;

    if (businesses.length === 0) {
        localServices.innerHTML = '<p class="no-services">No services match your search.</p>';
        return;
    }

    const servicesHtml = businesses.map(business => {
        const businessName = business.name || 'Unknown Business';
        const businessType = business.keyword || 'Service';
        const businessAddress = business.address || 'No address available';
        const businessRating = business.rating || null;
        const businessPhone = business.phone || null;
        const businessWebsite = business.website || null;

        return `
            <div class="service-item">
                <div class="service-header">
                    <h6 class="service-name">${businessName}</h6>
                    ${businessRating ? `<span class="service-rating">⭐ ${businessRating}</span>` : ''}
                </div>
                <p class="service-type">${businessType}</p>
                <p class="service-address">${businessAddress}</p>
                <div class="service-contact">
                    ${businessPhone ? `<span class="service-phone">📞 ${businessPhone}</span>` : ''}
                    ${businessWebsite ? `<a href="${businessWebsite}" target="_blank" class="service-website">🌐 Website</a>` : ''}
                </div>
            </div>
        `;
    }).join('');

    localServices.innerHTML = servicesHtml;
}

// Category filter functionality
function filterByCategory(category) {
    if (!LOCATION_DATA) return;

    let filteredEvents = LOCATION_DATA.events;
    let filteredBusinesses = LOCATION_DATA.businesses;

    if (category && category !== 'all') {
        filteredEvents = LOCATION_DATA.events.filter(event => 
            event.category === category
        );
        
        // For businesses, filter by keyword or type
        filteredBusinesses = LOCATION_DATA.businesses.filter(business => {
            const businessType = business.keyword || business.type || '';
            return businessType.toLowerCase().includes(category.toLowerCase());
        });
    }

    displayFilteredSightings(filteredEvents);
    displayFilteredServices(filteredBusinesses);
}

// Sort functionality
function sortSightings(sortBy) {
    if (!LOCATION_DATA) return;

    let sortedEvents = [...LOCATION_DATA.events];

    switch (sortBy) {
        case 'date':
            sortedEvents.sort((a, b) => {
                const dateA = new Date(a.date || '1970-01-01');
                const dateB = new Date(b.date || '1970-01-01');
                return dateB - dateA; // Most recent first
            });
            break;
        case 'name':
            sortedEvents.sort((a, b) => {
                const nameA = a.name || '';
                const nameB = b.name || '';
                return nameA.localeCompare(nameB);
            });
            break;
        case 'type':
            sortedEvents.sort((a, b) => {
                const typeA = a.type || '';
                const typeB = b.type || '';
                return typeA.localeCompare(typeB);
            });
            break;
        default:
            // No sorting
            break;
    }

    displayFilteredSightings(sortedEvents);
}

// Export functions for use in other scripts
function exportLocationData() {
    if (!LOCATION_DATA) return null;
    
    return {
        name: LOCATION_DATA.name,
        category: LOCATION_DATA.category,
        coordinates: LOCATION_DATA.coordinates,
        events: LOCATION_DATA.events,
        businesses: LOCATION_DATA.businesses,
        stats: LOCATION_DATA.stats
    };
}

// Report new sighting functionality
function reportSighting() {
    // Redirect to main map with location pre-filled
    const locationName = LOCATION_DATA ? LOCATION_DATA.name : '';
    const coords = LOCATION_DATA ? LOCATION_DATA.coordinates : null;
    
    let mapUrl = '/map.html#submitAMystery';
    
    if (locationName) {
        mapUrl += `&location=${encodeURIComponent(locationName)}`;
    }
    
    if (coords) {
        mapUrl += `&lat=${coords[0]}&lng=${coords[1]}`;
    }
    
    window.location.href = mapUrl;
}

// Print functionality
function printLocation() {
    window.print();
}

// Share functionality
function shareLocation() {
    if (navigator.share) {
        navigator.share({
            title: `${LOCATION_DATA.name} - Mystery Quest`,
            text: `Check out this mysterious location: ${LOCATION_DATA.name}`,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Location URL copied to clipboard!');
        });
    }
}

// Utility functions
function formatDate(dateString) {
    if (!dateString) return 'Unknown date';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (e) {
        return dateString;
    }
}

function truncateText(text, maxLength = 150) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for search
    const searchInput = document.getElementById('locationSearch');
    if (searchInput) {
        searchInput.addEventListener('input', searchLocation);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchLocation();
            }
        });
    }

    // Add event listeners for filters and sorting
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filterByCategory(this.value);
        });
    }

    const sortSelect = document.getElementById('sortSightings');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortSightings(this.value);
        });
    }

    // Add event listeners for action buttons
    const reportButton = document.getElementById('reportSighting');
    if (reportButton) {
        reportButton.addEventListener('click', reportSighting);
    }

    const printButton = document.getElementById('printLocation');
    if (printButton) {
        printButton.addEventListener('click', printLocation);
    }

    const shareButton = document.getElementById('shareLocation');
    if (shareButton) {
        shareButton.addEventListener('click', shareLocation);
    }

    // Initialize content if LOCATION_DATA exists
    if (typeof LOCATION_DATA !== 'undefined') {
        console.log('Location data loaded:', LOCATION_DATA.name);
        
        // The new HTML generator handles most initialization
        // This is for legacy support
        if (document.getElementById('locationDetails')) {
            loadLocationContent();
        }
    }
});

// Handle responsive map resizing
window.addEventListener('resize', function() {
    if (locationMap) {
        locationMap.invalidateSize();
    }
    if (sightingsMap) {
        sightingsMap.invalidateSize();
    }
});

// Export for global access
window.LocationDetail = {
    initLocationMap,
    loadLocationContent,
    searchLocation,
    filterByCategory,
    sortSightings,
    exportLocationData,
    reportSighting,
    printLocation,
    shareLocation
};