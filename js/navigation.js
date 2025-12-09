/**
 * Navigation Manager - Legacy compatibility wrapper
 * This file is kept for backward compatibility but now delegates to header.js and footer.js
 * New pages should use header.js and footer.js directly
 */

// For pages that don't have header-container and footer-container divs yet,
// we'll add them automatically
document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    
    // Check if header container exists
    if (!document.getElementById('header-container')) {
        const headerDiv = document.createElement('div');
        headerDiv.id = 'header-container';
        body.insertBefore(headerDiv, body.firstChild);
    }
    
    // Check if footer container exists
    if (!document.getElementById('footer-container')) {
        const footerDiv = document.createElement('div');
        footerDiv.id = 'footer-container';
        body.appendChild(footerDiv);
    }
});
