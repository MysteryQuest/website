// Test JavaScript syntax from hoax.html
async function fetchMysteries() {
    try {
        const url = `test`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const data = await response.json();

        if (data.values && data.values.length > 1) {
            const headers = data.values[0];
            const rows = data.values.slice(1);
            
            let mysteries = rows
                .map((row, index) => {
                    const mystery = {};
                    headers.forEach((header, i) => {
                        mystery[header] = row[i] || '';
                    });
                    
                    Object.keys(mystery).forEach(key => {
                        if (['name', 'description', 'location', 'event_type', 'votes'].includes(key.toLowerCase())) {
                            const value = mystery[key];
                            if (value && (value.includes('{"') || value.includes('"source_credibility"') || value.includes('"primary_category"'))) {
                                console.warn(`Filtered JSON content from ${key}:`, value.substring(0, 50));
                                mystery[key] = '';
                            }
                        }
                    });
                    mystery.id = index;
                    mystery.spreadsheetRowIndex = index + 2;
                    mystery.realVotes = parseInt(mystery.votes || '0');
                    mystery.hoaxVotes = parseInt(mystery.hoax || '0');
                    return mystery;
                })
                .filter(mystery => {
                    const isHoax = mystery.real_or_hoax === 'False' || 
                                  mystery.hoax === 'true' || 
                                  mystery.hoax === '1' ||
                                  (mystery.verdict && mystery.verdict.toLowerCase().includes('hoax'));
                    
                    const hasImage = mystery.image_url && mystery.image_url.trim() !== '';
                    
                    return hasImage && isHoax;
                });

            for (let i = mysteries.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [mysteries[i], mysteries[j]] = [mysteries[j], mysteries[i]];
            }

            console.log('Would call renderCarousel()');
        }
    } catch (error) {
        console.error('Error fetching mysteries:', error);
        const container = document.getElementById("carouselItems");
        if (container) {
            container.innerHTML = '<div class="carousel-item active"><div class="text-center p-4"><h3>Unable to load mysteries</h3><p>Please try refreshing the page.</p></div></div>';
        }
    }
}

console.log('✅ JavaScript syntax validation passed');