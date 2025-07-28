/**
 * Navigation Manager - Inline Header/Footer System
 * Provides consistent navigation across all pages using inline HTML
 */

class NavigationManager {
    constructor() {
        this.currentPage = this.detectCurrentPage();
        this.init();
    }

    detectCurrentPage() {
        const path = window.location.pathname;
        if (path === '/' || path.includes('index.html')) return 'home';
        if (path.includes('map.html')) return 'map';
        if (path.includes('/directory')) return 'directory';
        if (path.includes('hoax.html')) return 'hoax';
        return '';
    }

    getHeaderHTML() {
        // Detect if we're in a subdirectory to adjust paths
        const isSubdirectory = window.location.pathname.includes('/directory/') || 
                              window.location.pathname.split('/').length > 2;
        const logoPath = isSubdirectory ? '/logo.png' : 'logo.png';
        
        return `
        <!-- Shared Navigation Header -->
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div class="container-fluid position-relative">
                <!-- Large Badge-Style Logo -->
                <a class="navbar-brand logo-badge" href="/">
                    <div class="logo-container">
                        <img src="${logoPath}" alt="Mystery Quest Logo" class="logo-image">
                        <span class="brand-text">Mystery Quest</span>
                    </div>
                </a>
                
                <!-- Google Translate Element -->
                <div id="google_translate_element" class="d-none d-lg-block me-3"></div>
                
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item">
                            <a class="nav-link" href="/" data-page="home">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/map.html#submitAMystery">Submit a Mystery</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/map.html" data-page="map">Mystery Map</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/directory/" data-page="directory">Directory</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/hoax.html" data-page="hoax">Is it a Hoax?</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link youtube-btn" href="https://www.youtube.com/channel/UCL37JaB7QLNubrW4s3xRzJQ" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" style="vertical-align:middle;margin-right:6px;" viewBox="0 0 24 24">
                                    <path fill="#fff" d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.117C19.237 3.5 12 3.5 12 3.5s-7.237 0-9.391.569A2.994 2.994 0 0 0 .502 6.186C0 8.342 0 12 0 12s0 3.658.502 5.814a2.994 2.994 0 0 0 2.107 2.117C4.763 20.5 12 20.5 12 20.5s7.237 0 9.391-.569a2.994 2.994 0 0 0 2.107-2.117C24 15.658 24 12 24 12s0-3.658-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                                YouTube Investigations
                            </a>
                        </li>
                        <!-- Mobile Google Translate -->
                        <li class="nav-item d-lg-none">
                            <div id="google_translate_element_mobile" class="mt-2"></div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        `;
    }

    getFooterHTML() {
        return `
        <!-- Shared Footer -->
        <footer class="bg-dark text-light py-5 mt-5">
            <div class="container">
                <div class="row">
                    <div class="col-lg-4 col-md-6 mb-4">
                        <h5 class="footer-title">Mystery Quest</h5>
                        <p class="footer-text">Investigating the unexplained, one mystery at a time. Join our community of truth-seekers and explore the world's most fascinating enigmas.</p>
                        <div class="social-links">
                            <a href="https://www.youtube.com/channel/UCL37JaB7QLNubrW4s3xRzJQ" target="_blank" class="social-link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.117C19.237 3.5 12 3.5 12 3.5s-7.237 0-9.391.569A2.994 2.994 0 0 0 .502 6.186C0 8.342 0 12 0 12s0 3.658.502 5.814a2.994 2.994 0 0 0 2.107 2.117C4.763 20.5 12 20.5 12 20.5s7.237 0 9.391-.569a2.994 2.994 0 0 0 2.107-2.117C24 15.658 24 12 24 12s0-3.658-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                    
                    <div class="col-lg-2 col-md-6 mb-4">
                        <h6 class="footer-section-title">Explore</h6>
                        <ul class="footer-links">
                            <li><a href="/">Home</a></li>
                            <li><a href="/map.html">Mystery Map</a></li>
                            <li><a href="/directory/">Directory</a></li>
                            <li><a href="/hoax.html">Is it a Hoax?</a></li>
                        </ul>
                    </div>
                    
                    <div class="col-lg-3 col-md-6 mb-4">
                        <h6 class="footer-section-title">Get Involved</h6>
                        <ul class="footer-links">
                            <li><a href="/map.html#submitAMystery">Submit a Mystery</a></li>
                            <li><a href="https://www.youtube.com/channel/UCL37JaB7QLNubrW4s3xRzJQ" target="_blank">YouTube Channel</a></li>
                            <li><a href="#contact">Contact Us</a></li>
                        </ul>
                    </div>
                    
                    <div class="col-lg-3 col-md-6 mb-4">
                        <h6 class="footer-section-title">Latest Updates</h6>
                        <p class="footer-text small">Stay tuned for new mystery investigations and community discoveries. Check our YouTube channel for the latest video content.</p>
                        <div class="mt-3">
                            <small class="text-muted">
                                © 2025 Mystery Quest. All rights reserved.<br>
                                Exploring the unexplained since 2024.
                            </small>
                        </div>
                    </div>
                </div>
                
                <hr class="footer-divider">
                
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <p class="footer-copyright mb-0">
                            &copy; 2025 Mystery Quest. All rights reserved.
                        </p>
                    </div>
                    <div class="col-md-6 text-end">
                        <small class="text-muted">
                            Made with 🔍 for mystery enthusiasts worldwide
                        </small>
                    </div>
                </div>
            </div>
        </footer>
        `;
    }

    async init() {
        // Load header and footer using inline HTML
        this.loadInlineComponents();
        
        // Initialize page-specific features
        this.setActiveNavigation();
        this.initializeGoogleTranslate();
        this.adjustBodyPadding();
        this.addComponentStyles();
    }

    loadInlineComponents() {
        // Load header
        const headerElement = document.getElementById('dynamic-header');
        if (headerElement) {
            headerElement.innerHTML = this.getHeaderHTML();
        }

        // Load footer
        const footerElement = document.getElementById('dynamic-footer');
        if (footerElement) {
            footerElement.innerHTML = this.getFooterHTML();
        }
    }

    setActiveNavigation() {
        // Wait a bit for DOM to update
        setTimeout(() => {
            const navLinks = document.querySelectorAll('.nav-link[data-page]');
            navLinks.forEach(link => {
                if (link.dataset.page === this.currentPage) {
                    link.classList.add('active');
                }
            });
        }, 100);
    }

    adjustBodyPadding() {
        // Add padding-top to account for fixed navbar
        setTimeout(() => {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                const navbarHeight = navbar.offsetHeight;
                document.body.style.paddingTop = navbarHeight + 'px';
            }
        }, 100);
    }

    addComponentStyles() {
        // Add styles for header and footer components
        const styles = `
        <style>
        .navbar-brand .brand-text {
            font-family: 'Orbitron', monospace;
            font-weight: 700;
            color: #00ffff !important;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }

        .youtube-btn {
            background: #ff0000 !important;
            color: #fff !important;
            border-radius: 4px;
            font-weight: bold;
            margin-left: 10px;
            padding: 8px 16px !important;
            display: flex;
            align-items: center;
            transition: background 0.2s, box-shadow 0.2s;
            box-shadow: 0 2px 8px rgba(255,0,0,0.10);
            border: none !important;
        }

        .youtube-btn:hover, .youtube-btn:focus {
            background: #cc0000 !important;
            color: #fff !important;
            text-decoration: none !important;
            box-shadow: 0 4px 16px rgba(255,0,0,0.18);
        }

        #google_translate_element, #google_translate_element_mobile {
            margin-right: 10px;
        }

        /* Google Translate Dark Theme Styling */
        .goog-te-gadget {
            font-family: 'Inter', sans-serif !important;
            font-size: 13px !important;
            color: #ffffff !important;
        }

        .goog-te-gadget-simple {
            background-color: rgba(40, 40, 50, 0.9) !important;
            border: 1px solid rgba(0, 255, 255, 0.3) !important;
            padding: 8px 12px !important;
            border-radius: 6px !important;
            color: #ffffff !important;
            transition: all 0.3s ease !important;
        }

        .goog-te-gadget-simple:hover {
            background-color: rgba(0, 255, 255, 0.1) !important;
            border-color: rgba(0, 255, 255, 0.5) !important;
            box-shadow: 0 2px 8px rgba(0, 255, 255, 0.2) !important;
        }

        .goog-te-gadget-simple .goog-te-menu-value {
            color: #ffffff !important;
            font-weight: 500 !important;
        }

        .goog-te-gadget-simple .goog-te-menu-value:hover {
            text-decoration: none !important;
            color: #ffffff !important;
        }

        .goog-te-gadget-simple .goog-te-menu-value span {
            color: #ffffff !important;
        }

        .goog-te-gadget-simple .goog-te-menu-value span:first-child {
            color: #ffffff !important;
            font-weight: 600 !important;
        }

        .goog-te-gadget-simple .goog-te-menu-value span:last-child {
            color: #e0e0e0 !important;
        }

        /* Additional Google Translate text styling */
        .goog-te-gadget .goog-te-combo {
            background-color: rgba(40, 40, 50, 0.9) !important;
            border: 1px solid rgba(0, 255, 255, 0.3) !important;
            color: #ffffff !important;
            border-radius: 4px !important;
            padding: 4px 8px !important;
        }

        .goog-te-gadget .goog-te-combo option {
            background-color: #2a2a3a !important;
            color: #ffffff !important;
        }

        /* Ensure all Google Translate text is white */
        .goog-te-gadget, .goog-te-gadget * {
            color: #ffffff !important;
        }

        .goog-te-gadget a {
            color: #ffffff !important;
            text-decoration: none !important;
        }

        .goog-te-gadget a:hover {
            color: #00ffff !important;
        }

        /* Hide Google logo and branding */
        .goog-te-gadget-icon {
            display: none !important;
        }

        /* Hide Google Translate banner that appears at top */
        .goog-te-banner-frame {
            display: none !important;
        }

        .goog-te-ftab {
            display: none !important;
        }

        /* Fix body positioning when Google Translate is active */
        body {
            top: 0 !important;
            position: static !important;
        }

        /* Style the translate dropdown menu */
        .goog-te-menu-frame {
            border-radius: 8px !important;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5) !important;
        }

        .goog-te-menu2 {
            background-color: #1a1a2e !important;
            border: 1px solid rgba(0, 255, 255, 0.3) !important;
            border-radius: 8px !important;
        }

        .goog-te-menu2-item div {
            color: #ffffff !important;
            background-color: transparent !important;
            padding: 8px 12px !important;
        }

        .goog-te-menu2-item:hover div {
            background-color: rgba(0, 255, 255, 0.1) !important;
            color: #00ffff !important;
        }

        .goog-te-menu2-item-selected div {
            background-color: rgba(0, 255, 255, 0.2) !important;
            color: #00ffff !important;
        }

        /* Force white text on all Google Translate components */
        .VIpgJd-ZVi9od-xl07Ob-lTBxed {
            color: #ffffff !important;
        }

        .goog-te-gadget-simple .VIpgJd-ZVi9od-xl07Ob-lTBxed {
            color: #ffffff !important;
            background: none !important;
            border: none !important;
        }

        /* Target the specific translate text elements */
        .goog-te-menu-value span[style] {
            color: #ffffff !important;
        }

        /* Additional fallback for visibility */
        #google_translate_element, #google_translate_element_mobile {
            filter: brightness(1.2) contrast(1.1);
        }

        .nav-link.active {
            color: #00ffff !important;
            font-weight: bold;
        }

        .footer-title {
            font-family: 'Orbitron', monospace;
            font-weight: 700;
            color: #00ffff;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
            margin-bottom: 1rem;
        }

        .footer-section-title {
            color: #ffffff;
            font-weight: 600;
            margin-bottom: 1rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 0.9rem;
        }

        .footer-text {
            color: #b8b8b8;
            line-height: 1.6;
            font-size: 0.95rem;
        }

        .footer-links {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .footer-links li {
            margin-bottom: 8px;
        }

        .footer-links a {
            color: #b8b8b8;
            text-decoration: none;
            transition: color 0.3s ease;
            font-size: 0.9rem;
        }

        .footer-links a:hover {
            color: #00ffff;
            text-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
        }

        .social-links {
            margin-top: 1rem;
        }

        .social-link {
            display: inline-block;
            width: 40px;
            height: 40px;
            background: #333;
            color: #fff;
            text-align: center;
            line-height: 40px;
            border-radius: 50%;
            margin-right: 10px;
            transition: all 0.3s ease;
            text-decoration: none;
        }

        .social-link:hover {
            background: #ff0000;
            color: #fff;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(255, 0, 0, 0.3);
        }

        .footer-divider {
            border-color: #333;
            margin: 2rem 0 1rem 0;
        }

        .footer-copyright {
            color: #888;
            font-size: 0.9rem;
        }

        @media (max-width: 768px) {
            .youtube-btn {
                margin-left: 0;
                margin-top: 10px;
                justify-content: center;
            }
            
            #google_translate_element_mobile {
                margin-right: 0;
                margin-top: 5px !important;
            }

            .col-md-6.text-end {
                text-align: start !important;
                margin-top: 1rem;
            }
        }
        </style>
        `;
        
        // Only add styles once
        if (!document.getElementById('navigation-styles')) {
            const styleElement = document.createElement('div');
            styleElement.id = 'navigation-styles';
            styleElement.innerHTML = styles;
            document.head.appendChild(styleElement);
        }
    }

    initializeGoogleTranslate() {
        // Initialize Google Translate if not already loaded
        if (typeof google === 'undefined' || !google.translate) {
            this.loadGoogleTranslateScript();
        } else {
            this.setupTranslateElements();
        }
    }

    loadGoogleTranslateScript() {
        if (document.getElementById('google-translate-script')) return;

        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.head.appendChild(script);

        // Set up global callback
        window.googleTranslateElementInit = () => this.setupTranslateElements();
    }

    setupTranslateElements() {
        setTimeout(() => {
            if (typeof google !== 'undefined' && google.translate) {
                // Desktop translate element
                const desktopElement = document.getElementById('google_translate_element');
                if (desktopElement && !desktopElement.querySelector('.skiptranslate')) {
                    new google.translate.TranslateElement({
                        pageLanguage: 'en',
                        includedLanguages: 'en,es,fr,de,it,pt,ja,ko,zh,ru,ar',
                        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                        autoDisplay: false
                    }, 'google_translate_element');
                }

                // Mobile translate element
                const mobileElement = document.getElementById('google_translate_element_mobile');
                if (mobileElement && !mobileElement.querySelector('.skiptranslate')) {
                    new google.translate.TranslateElement({
                        pageLanguage: 'en',
                        includedLanguages: 'en,es,fr,de,it,pt,ja,ko,zh,ru,ar',
                        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                        autoDisplay: false
                    }, 'google_translate_element_mobile');
                }
            }
        }, 500);
    }

    // Utility method for pages to call when they need to refresh navigation
    static refresh() {
        const manager = new NavigationManager();
        return manager;
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new NavigationManager();
});

// Global utility function
window.NavigationManager = NavigationManager;
