/**
 * Navigation utilities for the Three.js Explorer application
 * This file contains functions to manage navigation elements across pages
 */

/**
 * Initializes the mobile sidebar for documentation pages
 * @param {string} sidebarId - The ID of the sidebar element
 * @param {string} contentId - The ID of the main content container
 * @param {string} toggleBtnId - The ID of the toggle button element (optional)
 */
function initDocumentationSidebar(sidebarId = 'sidebar', contentId = 'content', toggleBtnId = 'toggle-sidebar') {
    const sidebar = document.getElementById(sidebarId);
    const content = document.getElementById(contentId);
    let toggleBtn = document.getElementById(toggleBtnId);
    
    if (!sidebar || !content) return;
    
    // Create toggle button if it doesn't exist and we're on mobile
    if (!toggleBtn && window.innerWidth <= 768) {
        toggleBtn = document.createElement('button');
        toggleBtn.id = toggleBtnId;
        toggleBtn.className = 'toggle-sidebar';
        toggleBtn.innerHTML = '&#9776;'; // Hamburger icon
        toggleBtn.setAttribute('aria-label', 'Toggle Sidebar');
        document.body.appendChild(toggleBtn);
    }
    
    // If we have a toggle button, set up its functionality
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            
            // Change button icon based on sidebar state
            if (sidebar.classList.contains('active')) {
                toggleBtn.innerHTML = '&times;'; // X icon
            } else {
                toggleBtn.innerHTML = '&#9776;'; // Hamburger icon
            }
        });
    }
    
    // Handle sidebar link clicks - mark active and close sidebar on mobile
    const sidebarLinks = sidebar.querySelectorAll('a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Close sidebar on mobile when link is clicked
            if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                if (toggleBtn) {
                    toggleBtn.innerHTML = '&#9776;'; // Hamburger icon
                }
            }
            
            // If link is an anchor within the page, smooth scroll to the target
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Smooth scroll to target
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                    
                    // Update URL hash without jumping
                    history.pushState(null, null, href);
                }
            }
        });
    });
    
    // Highlight the current section based on scroll position
    window.addEventListener('scroll', function() {
        // Only perform this on larger screens
        if (window.innerWidth <= 768) return;
        
        // Find all section headings
        const headings = content.querySelectorAll('h1[id], h2[id], h3[id]');
        
        // Find the heading that's currently visible in the viewport
        let currentHeading = null;
        for (let i = 0; i < headings.length; i++) {
            const heading = headings[i];
            const rect = heading.getBoundingClientRect();
            
            // If the heading is visible in the top half of the viewport
            if (rect.top <= 150 && rect.bottom >= 0) {
                currentHeading = heading;
            }
        }
        
        // Update the active link in the sidebar
        if (currentHeading) {
            const headingId = currentHeading.id;
            const correspondingLink = sidebar.querySelector(`a[href="#${headingId}"]`);
            
            if (correspondingLink) {
                sidebarLinks.forEach(l => l.classList.remove('active'));
                correspondingLink.classList.add('active');
            }
        }
    });
    
    // Handle initial page load to highlight current section
    window.addEventListener('DOMContentLoaded', function() {
        // Check if URL has a hash and highlight corresponding link
        if (window.location.hash) {
            const hash = window.location.hash;
            const correspondingLink = sidebar.querySelector(`a[href="${hash}"]`);
            
            if (correspondingLink) {
                sidebarLinks.forEach(l => l.classList.remove('active'));
                correspondingLink.classList.add('active');
            }
        } else {
            // Default to first link if no hash
            const firstLink = sidebar.querySelector('a');
            if (firstLink) {
                firstLink.classList.add('active');
            }
        }
    });
}

/**
 * Checks if element is in viewport
 * @param {HTMLElement} el - The element to check
 * @returns {boolean} - True if element is in viewport
 */
function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Export functions for use in other files
export { initDocumentationSidebar, isInViewport };
