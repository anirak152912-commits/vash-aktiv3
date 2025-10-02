// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

function initApp() {
    // Initialize dropdowns
    initDropdowns();
    
    // Initialize property cards interactions
    initPropertyCards();
    
    // Initialize search functionality
    initSearch();
    
    // Initialize mobile menu
    initMobileMenu();
}

function initDropdowns() {
    const dropdowns = document.querySelectorAll('.filter-dropdown, .currency-select');
    
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = this.classList.contains('open');
            
            // Close all other dropdowns
            dropdowns.forEach(d => d.classList.remove('open'));
            
            // Toggle current dropdown
            if (!isOpen) {
                this.classList.add('open');
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        dropdowns.forEach(dropdown => dropdown.classList.remove('open'));
    });
}

function initPropertyCards() {
    const propertyCards = document.querySelectorAll('.property-card');
    
    propertyCards.forEach(card => {
        // Add click handler for entire card
        card.addEventListener('click', function(e) {
            if (!e.target.closest('button') && !e.target.closest('a')) {
                const propertyId = this.dataset.propertyId;
                if (propertyId) {
                    window.location.href = `/property/${propertyId}`;
                }
            }
        });
        
        // Add favorite functionality
        const favoriteBtn = card.querySelector('.icon-btn.saved');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                this.classList.toggle('active');
                
                if (this.classList.contains('active')) {
                    showNotification('Объект добавлен в избранное');
                }
            });
        }
    });
}

function initSearch() {
    const searchInput = document.querySelector('.search-input input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        // Enter key search
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Button click search
        searchBtn.addEventListener('click', performSearch);
    }
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            // Simulate search - in real app would make API call
            showNotification(`Поиск: ${query}`);
            // window.location.href = `/search?q=${encodeURIComponent(query)}`;
        }
    }
}

function initMobileMenu() {
    // Create mobile menu toggle for small screens
    const header = document.querySelector('.header');
    if (window.innerWidth <= 768) {
        const menuToggle = document.createElement('button');
        menuToggle.className = 'mobile-menu-toggle';
        menuToggle.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        
        menuToggle.addEventListener('click', function() {
            header.classList.toggle('mobile-menu-open');
        });
        
        header.querySelector('.header__content').prepend(menuToggle);
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Utility functions
function formatPrice(price, currency = 'USD') {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: currency
    }).format(price);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initApp,
        formatPrice,
        debounce
    };
}