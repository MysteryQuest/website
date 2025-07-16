// directory/directory-main.js
const GOOGLE_SHEETS_API_KEY = 'AIzaSyDWYze9-dP4ptq-4vxZVBOCW-Uo9wC7KhQ';
const SPREADSHEET_ID = '1fJIP4P3Gbm71OKgG_EnIDZ-7nBRoMJOuxvkc2tnC_LQ';
const SHEET_NAME = 'Sheet1';

// UFO-specific location data with businesses and services
const UFO_LOCATIONS = {
    'roswell-nm': {
        name: 'Roswell, New Mexico',
        state: 'New Mexico',
        coordinates: [33.3943, -104.5230],
        description: 'Home of the famous 1947 UFO crash incident. The most iconic UFO location in America.',
        keywords: ['roswell ufo crash', 'roswell alien', 'roswell nm ufo museum', 'ufo crash site roswell'],
        sightingCount: 45,
        lastSighting: '2024-11-15',
        image: 'https://example.com/roswell.jpg',
        businesses: [
            {
                name: 'International UFO Museum',
                type: 'Museum',
                description: 'World-famous UFO museum featuring the 1947 incident',
                address: '114 N Main St, Roswell, NM',
                website: 'https://www.roswellufomuseum.com',
                phone: '(575) 625-9495'
            },
            {
                name: 'Roswell UFO Tours',
                type: 'Tour Guide',
                description: 'Guided tours of crash sites and alien locations',
                address: 'Downtown Roswell, NM',
                website: 'https://roswellufotours.com',
                phone: '(575) 555-0123'
            },
            {
                name: 'Alien Zone Area 51',
                type: 'Gift Shop',
                description: 'UFO-themed souvenirs and alien merchandise',
                address: '404 N Main St, Roswell, NM',
                website: null,
                phone: '(575) 555-0456'
            }
        ]
    },
    'phoenix-az': {
        name: 'Phoenix, Arizona',
        state: 'Arizona',
        coordinates: [33.4484, -112.0740],
        description: 'Site of the famous Phoenix Lights incident in 1997. Recent UFO activity reported regularly.',
        keywords: ['phoenix lights ufo', 'arizona ufo sightings', 'phoenix az aliens', 'recent ufo sightings arizona'],
        sightingCount: 87,
        lastSighting: '2024-12-20',
        image: 'https://example.com/phoenix.jpg',
        businesses: [
            {
                name: 'Arizona UFO Investigation Team',
                type: 'Investigator',
                description: 'Professional UFO researchers and investigators',
                address: 'Phoenix Metro Area, AZ',
                website: 'https://azufoinvestigation.com',
                phone: '(602) 555-0789'
            },
            {
                name: 'Desert Sky UFO Tours',
                type: 'Tour Guide',
                description: 'Night sky UFO watching tours in the Sonoran Desert',
                address: 'Phoenix, AZ',
                website: 'https://desertskyufotours.com',
                phone: '(602) 555-0321'
            }
        ]
    },
    'area51-nv': {
        name: 'Area 51, Nevada',
        state: 'Nevada',
        coordinates: [37.2431, -115.7930],
        description: 'Top secret military installation. The most mysterious UFO location in the world.',
        keywords: ['area 51 ufo', 'nevada alien base', 'area 51 tours', 'extraterrestrial highway nevada'],
        sightingCount: 156,
        lastSighting: '2024-12-18',
        image: 'https://example.com/area51.jpg',
        businesses: [
            {
                name: 'Little A\'Le\'Inn',
                type: 'Hotel/Restaurant',
                description: 'Famous UFO-themed motel and restaurant near Area 51',
                address: 'Rachel, NV',
                website: 'https://littlealeinn.com',
                phone: '(775) 729-2515'
            },
            {
                name: 'Area 51 Research Center',
                type: 'Investigator',
                description: 'UFO research facility and gift shop',
                address: 'Rachel, NV',
                website: null,
                phone: '(775) 555-0147'
            }
        ]
    }
};

let allUFOData = [];
let filteredData = [];

async function loadUFOData() {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}?key=${GOOGLE_SHEETS_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.values && data.values.length > 1) {
            const headers = data.values[0];
            const rows = data.values.slice(1);

            allUFOData = rows.map((row, index) => {
                const entry = {};
                headers.forEach((header, i) => {
                    entry[header] = row[i] || '';
                });
                return entry;
            }).filter(entry => 
                entry.event_type && 
                entry.event_type.toLowerCase().includes('ufo') ||
                entry.name && (
                    entry.name.toLowerCase().includes('ufo') ||
                    entry.name.toLowerCase().includes('alien') ||
                    entry.name.toLowerCase().includes('flying saucer') ||
                    entry.name.toLowerCase().includes('extraterrestrial')
                )
            );

            filteredData = [...allUFOData];
            renderLocations();
            renderServices();
        }
    } catch (error) {
        console.error('Error loading UFO data:', error);
    }
}

function renderLocations() {
    const featuredContainer = document.getElementById('featuredLocations');
    const gridContainer = document.getElementById('locationsGrid');
    
    // Group UFO data by location
    const locationGroups = groupByLocation(filteredData);
    
    // Combine with predefined location data
    const combinedLocations = Object.keys(UFO_LOCATIONS).map(key => {
        const staticData = UFO_LOCATIONS[key];
        const dynamicData = locationGroups[staticData.name] || [];
        
        return {
            ...staticData,
            slug: key,
            sightings: dynamicData,
            sightingCount: dynamicData.length || staticData.sightingCount
        };
    });

    // Sort by sighting count for featured locations
    const featuredLocations = combinedLocations
        .sort((a, b) => b.sightingCount - a.sightingCount)
        .slice(0, 3);

    // Render featured locations
    featuredContainer.innerHTML = featuredLocations.map(location => createLocationCard(location, true)).join('');
    
    // Render all locations
    gridContainer.innerHTML = combinedLocations.map(location => createLocationCard(location, false)).join('');
}

function groupByLocation(data) {
    const groups = {};
    data.forEach(entry => {
        const location = entry.location || 'Unknown';
        if (!groups[location]) {
            groups[location] = [];
        }
        groups[location].push(entry);
    });
    return groups;
}

function createLocationCard(location, isFeatured) {
    const cardClass = isFeatured ? 'col-md-4' : 'col-md-6 col-lg-4';
    const recentSightings = location.sightings ? location.sightings.slice(0, 3) : [];
    
    return `
        <div class="${cardClass}">
            <div class="location-card">
                <div class="location-image" style="background-image: url('${location.image || 'https://via.placeholder.com/400x200?text=UFO+Location'}')">
                    <div class="location-badge">${location.sightingCount} Sightings</div>
                </div>
                <div class="location-content">
                    <h3 class="location-title">${location.name}</h3>
                    <div class="location-meta">
                        <span class="sighting-count">${location.sightingCount} UFO Events</span>
                        <span>Last: ${location.lastSighting || 'Unknown'}</span>
                    </div>
                    <p class="location-description">${location.description}</p>
                    
                    ${location.businesses ? `
                        <div class="services-list">
                            ${location.businesses.slice(0, 3).map(business => 
                                `<span class="service-tag">${business.type}</span>`
                            ).join('')}
                        </div>
                    ` : ''}
                    
                    <div class="location-actions">
                        <a href="location.html?slug=${location.slug}" class="btn-explore">Explore UFOs</a>
                        <a href="location.html?slug=${location.slug}#services" class="btn-services">Find Services</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderServices() {
    const toursContainer = document.getElementById('ufoTours');
    const investigatorsContainer = document.getElementById('ufoInvestigators');
    const hotelsContainer = document.getElementById('ufoHotels');

    const allBusinesses = Object.values(UFO_LOCATIONS).flatMap(location => location.businesses || []);
    
    const tours = allBusinesses.filter(b => b.type.includes('Tour'));
    const investigators = allBusinesses.filter(b => b.type.includes('Investigator'));
    const hotels = allBusinesses.filter(b => b.type.includes('Hotel') || b.type.includes('Restaurant'));

    toursContainer.innerHTML = tours.map(createServiceItem).join('');
    investigatorsContainer.innerHTML = investigators.map(createServiceItem).join('');
    hotelsContainer.innerHTML = hotels.map(createServiceItem).join('');
}

function createServiceItem(business) {
    return `
        <div class="service-item">
            <div class="service-name">${business.name}</div>
            <div class="service-description">${business.description}</div>
            <div class="service-location">${business.address}</div>
            ${business.website ? `<a href="${business.website}" target="_blank" class="btn btn-sm btn-outline-primary mt-2">Visit Website</a>` : ''}
        </div>
    `;
}

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    loadUFOData();
    
    const locationSearch = document.getElementById('locationSearch');
    const timeFilter = document.getElementById('timeFilter');
    
    locationSearch.addEventListener('input', filterLocations);
    timeFilter.addEventListener('change', filterLocations);
});

function filterLocations() {
    const searchTerm = document.getElementById('locationSearch').value.toLowerCase();
    const timeFilter = document.getElementById('timeFilter').value;
    
    // Filter the data based on search criteria
    filteredData = allUFOData.filter(entry => {
        const matchesLocation = !searchTerm || 
            entry.location?.toLowerCase().includes(searchTerm) ||
            entry.name?.toLowerCase().includes(searchTerm);
            
        const matchesTime = !timeFilter || filterByTime(entry.date, timeFilter);
        
        return matchesLocation && matchesTime;
    });
    
    renderLocations();
}

function filterByTime(date, filter) {
    if (!date) return true;
    
    const entryYear = new Date(date).getFullYear();
    const currentYear = new Date().getFullYear();
    
    switch(filter) {
        case 'recent': return entryYear >= 2020;
        case 'modern': return entryYear >= 1990 && entryYear < 2020;
        case 'classic': return entryYear >= 1950 && entryYear < 1990;
        case 'historical': return entryYear < 1950;
        default: return true;
    }
}

// Generate SEO-optimized URLs
function generateSEOUrl(location, type = 'sightings') {
    const baseKeywords = {
        'sightings': 'ufo-sightings',
        'tours': 'ufo-tours', 
        'hotels': 'ufo-hotels',
        'investigators': 'ufo-investigators'
    };
    
    const locationSlug = location.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-');
        
    return `${baseKeywords[type]}-${locationSlug}`;
}