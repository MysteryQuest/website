/**
 * The Unverified File - Navigation Header
 * Dynamically loads consistent navigation across all pages
 */

document.addEventListener('DOMContentLoaded', function() {
    const headerHTML = `
    <!-- Navigation -->
    <nav class="sticky top-0 z-50 bg-charcoal/95 backdrop-blur-md border-b border-matrix-green/30">
        <div class="container mx-auto px-4 py-3">
            <div class="flex items-center justify-between">
                <!-- Logo -->
                <a href="index.html" class="flex items-center space-x-4 group">
                    <img src="logo.png" alt="The Unverified File Logo" class="h-32 md:h-40 w-auto transition-transform group-hover:scale-110">
                    <div>
                        <h1 class="text-3xl md:text-4xl font-orbitron font-bold text-matrix-green matrix-glow">THE UNVERIFIED FILE</h1>
                        <p class="text-sm text-terminal-green/70 font-mono">Classification: Evidence Required</p>
                    </div>
                </a>
                
                <!-- Desktop Navigation Links -->
                <div class="hidden md:flex items-center space-x-6">
                    <a href="index.html" class="nav-link text-gray-300 hover:text-matrix-green transition-colors" data-page="home">Home</a>
                    <a href="hoax.html" class="nav-link text-gray-300 hover:text-matrix-green transition-colors" data-page="hoax">Vote: Real or Hoax?</a>
                    <a href="detail.html" class="nav-link text-gray-300 hover:text-matrix-green transition-colors" data-page="detail">Investigations</a>
                    <a href="map.html" class="nav-link text-gray-300 hover:text-matrix-green transition-colors" data-page="map">Evidence Map</a>
                    <a href="blog.html" class="nav-link text-gray-300 hover:text-matrix-green transition-colors" data-page="blog">Project D-LOG</a>
                </div>
                
                <!-- Mobile Menu Button -->
                <button id="mobile-menu-toggle" class="md:hidden text-matrix-green text-2xl">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
            
            <!-- Mobile Menu -->
            <div id="mobile-menu" class="hidden md:hidden mt-4 pb-4 border-t border-matrix-green/30 pt-4">
                <div class="flex flex-col space-y-3">
                    <a href="index.html" class="nav-link text-gray-300 hover:text-matrix-green transition-colors" data-page="home">Home</a>
                    <a href="hoax.html" class="nav-link text-gray-300 hover:text-matrix-green transition-colors" data-page="hoax">Vote: Real or Hoax?</a>
                    <a href="detail.html" class="nav-link text-gray-300 hover:text-matrix-green transition-colors" data-page="detail">Investigations</a>
                    <a href="map.html" class="nav-link text-gray-300 hover:text-matrix-green transition-colors" data-page="map">Evidence Map</a>
                    <a href="blog.html" class="nav-link text-gray-300 hover:text-matrix-green transition-colors" data-page="blog">Project D-LOG</a>
                </div>
            </div>
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
            });
        }
    }
});
