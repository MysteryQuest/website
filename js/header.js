/**
 * The Unverified File - Navigation Header
 * Dynamically loads consistent navigation across all pages
 */

function renderSiteHeader() {
    const headerHTML = `
    <!-- Navigation -->
    <nav class="sticky top-0 z-50 bg-charcoal/95 backdrop-blur-md border-b border-matrix-green/30" aria-label="Primary navigation">
        <div class="container mx-auto px-3 sm:px-4 py-2 md:py-3">
            <div class="flex items-center justify-between gap-2 min-w-0">
                <!-- Logo -->
                <a href="index.html" class="flex items-center gap-2 md:gap-4 group min-w-0 flex-1 xl:flex-none">
                    <img src="logo.png" alt="The Unverified File" class="h-14 sm:h-16 md:h-24 xl:h-28 w-auto shrink-0 object-contain transition-transform group-hover:scale-105">
                    <div class="min-w-0">
                        <h1 class="text-base sm:text-xl md:text-2xl xl:text-3xl font-orbitron font-bold text-matrix-green matrix-glow leading-tight truncate">THE UNVERIFIED FILE</h1>
                        <p class="hidden sm:block text-[.68rem] md:text-xs text-terminal-green/70 font-mono truncate">Claims documented. Evidence linked. Unknowns visible.</p>
                    </div>
                </a>
                
                <!-- Desktop Navigation Links -->
                <div class="hidden xl:flex items-center gap-4 text-sm">
                    <a href="index.html" class="nav-link text-gray-300 hover:text-matrix-green transition-colors" data-page="home">Briefing</a>
                    <a href="case-files.html" class="nav-link text-gray-300 hover:text-matrix-green transition-colors" data-page="case-files">Case Files</a>
                    <a href="blog.html" class="nav-link text-gray-300 hover:text-matrix-green transition-colors" data-page="blog">Evidence Desk</a>
                    <a href="hoax.html" class="nav-link text-gray-300 hover:text-matrix-green transition-colors" data-page="hoax">Community Queue</a>
                    <a href="broadcasts.html" class="nav-link text-gray-300 hover:text-matrix-green transition-colors" data-page="broadcasts">Broadcasts</a>
                    <a href="methodology.html" class="nav-link text-gray-300 hover:text-matrix-green transition-colors" data-page="methodology">Methodology</a>
                    <a href="about.html" class="nav-link text-gray-300 hover:text-matrix-green transition-colors" data-page="about">About</a>
                </div>
                
                <!-- Mobile Menu Button -->
                <button id="mobile-menu-toggle" class="xl:hidden shrink-0 grid place-items-center w-12 h-12 rounded-lg border border-matrix-green/40 text-matrix-green text-xl" type="button" aria-label="Open navigation menu" aria-controls="mobile-menu" aria-expanded="false">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
            
            <!-- Mobile Menu -->
            <div id="mobile-menu" class="hidden xl:hidden mt-2 pb-3 border-t border-matrix-green/30 pt-3">
                <div class="grid grid-cols-2 gap-2">
                    <a href="index.html" class="nav-link rounded-lg px-3 py-3 text-gray-200 bg-white/5" data-page="home">Briefing</a>
                    <a href="case-files.html" class="nav-link rounded-lg px-3 py-3 text-gray-200 bg-white/5" data-page="case-files">Case Files</a>
                    <a href="blog.html" class="nav-link rounded-lg px-3 py-3 text-gray-200 bg-white/5" data-page="blog">Evidence Desk</a>
                    <a href="hoax.html" class="nav-link rounded-lg px-3 py-3 text-gray-200 bg-white/5" data-page="hoax">Community Queue</a>
                    <a href="broadcasts.html" class="nav-link rounded-lg px-3 py-3 text-gray-200 bg-white/5" data-page="broadcasts">Broadcasts</a>
                    <a href="methodology.html" class="nav-link rounded-lg px-3 py-3 text-gray-200 bg-white/5" data-page="methodology">Methodology</a>
                    <a href="about.html" class="nav-link rounded-lg px-3 py-3 text-gray-200 bg-white/5" data-page="about">About</a>
                    <a href="map.html" class="nav-link rounded-lg px-3 py-3 text-gray-200 bg-white/5" data-page="map">Evidence Map</a>
                    <a href="labs.html" class="nav-link rounded-lg px-3 py-3 text-gray-200 bg-white/5" data-page="labs">Labs</a>
                </div>
            </div>
        </div>
    </nav>
    <nav class="xl:hidden fixed bottom-0 inset-x-0 z-[1000] bg-dark-charcoal/95 backdrop-blur-lg border-t border-matrix-green/30 pb-[env(safe-area-inset-bottom)]" aria-label="Mobile app navigation">
      <div class="grid grid-cols-4">
        <a href="index.html" class="nav-link flex flex-col items-center justify-center min-h-16 gap-1 text-[.68rem] text-gray-300" data-page="home"><i class="fas fa-newspaper text-base"></i><span>Briefing</span></a>
        <a href="case-files.html" class="nav-link flex flex-col items-center justify-center min-h-16 gap-1 text-[.68rem] text-gray-300" data-page="case-files"><i class="fas fa-folder-open text-base"></i><span>Cases</span></a>
        <a href="hoax.html" class="nav-link flex flex-col items-center justify-center min-h-16 gap-1 text-[.68rem] text-gray-300" data-page="hoax"><i class="fas fa-inbox text-base"></i><span>Queue</span></a>
        <a href="map.html" class="nav-link flex flex-col items-center justify-center min-h-16 gap-1 text-[.68rem] text-gray-300" data-page="map"><i class="fas fa-map-location-dot text-base"></i><span>Map</span></a>
      </div>
    </nav>
    `;
    
    // Insert header at the beginning of body
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        headerContainer.innerHTML = headerHTML;
        
        // Set active nav item based on current page
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const page = link.getAttribute('data-page');
            if (currentPath.includes(page + '.html') || (page === 'home' && (currentPath === '/' || currentPath.includes('index.html')))) {
                link.classList.remove('text-gray-300');
                link.classList.add('text-matrix-green', 'font-semibold');
            }
        });
        
        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuToggle && mobileMenu) {
            mobileMenuToggle.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
                const open = !mobileMenu.classList.contains('hidden');
                mobileMenuToggle.setAttribute('aria-expanded', String(open));
                mobileMenuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
                mobileMenuToggle.querySelector('i').className = open ? 'fas fa-xmark' : 'fas fa-bars';
            });
        }
    }
}

function enablePwaShell() {
    const head = document.head;
    if (!document.querySelector('link[rel="manifest"]')) {
        const manifest = document.createElement('link'); manifest.rel = 'manifest'; manifest.href = 'manifest.webmanifest'; head.appendChild(manifest);
    }
    const metas = [
        ['theme-color', '#0f0f0f'], ['mobile-web-app-capable', 'yes'],
        ['apple-mobile-web-app-capable', 'yes'], ['apple-mobile-web-app-status-bar-style', 'black-translucent'],
        ['apple-mobile-web-app-title', 'Unverified File']
    ];
    metas.forEach(([name, content]) => { if (!document.querySelector(`meta[name="${name}"]`)) { const meta=document.createElement('meta'); meta.name=name; meta.content=content; head.appendChild(meta); } });
    if (!document.querySelector('link[rel="apple-touch-icon"]')) { const icon=document.createElement('link'); icon.rel='apple-touch-icon'; icon.href='icon-180.png'; head.appendChild(icon); }
    if ('serviceWorker' in navigator && location.protocol === 'https:') window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}), { once: true });
}

// Scripts normally load before DOMContentLoaded, but cached/deferred article
// assets can arrive afterward. Render immediately when the DOM is already ready.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderSiteHeader, { once: true });
} else {
    renderSiteHeader();
}
enablePwaShell();
