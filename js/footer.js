/**
 * The Unverified File - Footer
 * Dynamically loads consistent footer across all pages
 */

document.addEventListener('DOMContentLoaded', function() {
    const footerHTML = `
    <footer class="bg-dark-charcoal border-t border-matrix-green/30 py-8">
        <div class="container mx-auto px-4">
            <div class="grid md:grid-cols-4 gap-8 mb-8">
                <!-- About -->
                <div>
                    <h3 class="font-orbitron font-bold text-matrix-green mb-3">The Unverified File</h3>
                    <p class="text-sm text-gray-400">
                        Evidence-based investigation of unexplained phenomena, conspiracy theories, and mysterious events.
                    </p>
                </div>

                <!-- Quick Links -->
                <div>
                    <h4 class="font-orbitron font-bold text-white mb-3">Quick Links</h4>
                    <ul class="space-y-2 text-sm">
                        <li><a href="index.html" class="text-gray-400 hover:text-matrix-green transition-colors">Home</a></li>
                        <li><a href="hoax.html" class="text-gray-400 hover:text-matrix-green transition-colors">Vote: Real or Hoax?</a></li>
                        <li><a href="detail.html" class="text-gray-400 hover:text-matrix-green transition-colors">Investigations</a></li>
                        <li><a href="map.html" class="text-gray-400 hover:text-matrix-green transition-colors">Evidence Map</a></li>
                        <li><a href="blog.html" class="text-gray-400 hover:text-matrix-green transition-colors">Project D-LOG</a></li>
                    </ul>
                </div>

                <!-- Resources -->
                <div>
                    <h4 class="font-orbitron font-bold text-white mb-3">Resources</h4>
                    <ul class="space-y-2 text-sm">
                        <li><a href="osint.html" class="text-gray-400 hover:text-matrix-green transition-colors">OSINT Toolkit</a></li>
                        <li><a href="archive.html" class="text-gray-400 hover:text-matrix-green transition-colors">D-LOG Archive</a></li>
                        <li><a href="methodology.html" class="text-gray-400 hover:text-matrix-green transition-colors">Methodology</a></li>
                        <li><a href="privacy.html" class="text-gray-400 hover:text-matrix-green transition-colors">Privacy Policy</a></li>
                    </ul>
                </div>

                <!-- Social -->
                <div>
                    <h4 class="font-orbitron font-bold text-white mb-3">Connect</h4>
                    <div class="flex space-x-4 mb-4">
                        <a href="https://www.youtube.com/channel/UCL37JaB7QLNubrW4s3xRzJQ" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-cyber-red transition-colors text-xl" aria-label="YouTube">
                            <i class="fab fa-youtube"></i>
                        </a>
                        <a href="https://www.tiktok.com/@mysteryquest01" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-matrix-green transition-colors text-xl" aria-label="TikTok">
                            <i class="fab fa-tiktok"></i>
                        </a>
                        <a href="https://buymeacoffee.com/nullrecords" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-cyber-yellow transition-colors text-xl" aria-label="Buy Me a Coffee">
                            <i class="fas fa-mug-hot"></i>
                        </a>
                    </div>
                    <div class="space-y-2">
                        <a href="https://www.youtube.com/channel/UCL37JaB7QLNubrW4s3xRzJQ?sub_confirmation=1" target="_blank" rel="noopener noreferrer" class="block text-xs bg-cyber-red text-white px-4 py-2 rounded hover:bg-cyber-red/80 transition-colors font-bold text-center">
                            <i class="fab fa-youtube mr-1"></i>SUBSCRIBE
                        </a>
                        <a href="https://buymeacoffee.com/nullrecords" target="_blank" rel="noopener noreferrer" class="block text-xs bg-cyber-yellow text-charcoal px-4 py-2 rounded hover:bg-cyber-yellow/80 transition-colors font-bold text-center">
                            <i class="fas fa-mug-hot mr-1"></i>SUPPORT US
                        </a>
                    </div>
                </div>
            </div>

            <!-- Copyright -->
            <div class="border-t border-matrix-green/30 pt-6 text-center">
                <p class="text-sm text-gray-500 font-mono">
                    © ${new Date().getFullYear()} The Unverified File. All rights reserved. | Classification: Public Domain
                </p>
                <p class="text-xs text-gray-600 mt-2">
                    Separating Conspiracy Theory from Evidence-Based Reality
                </p>
            </div>
        </div>
    </footer>
    `;
    
    // Insert footer
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        footerContainer.innerHTML = footerHTML;
    }
});
