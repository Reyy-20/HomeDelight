// Carousel functionality
class Carousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.carousel-slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.carousel-btn.prev');
        this.nextBtn = document.querySelector('.carousel-btn.next');
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = null;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.startAutoPlay();
        this.updateSlide();
    }
    
    bindEvents() {
        // Previous button
        this.prevBtn.addEventListener('click', () => {
            this.prevSlide();
        });
        
        // Next button
        this.nextBtn.addEventListener('click', () => {
            this.nextSlide();
        });
        
        // Dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
        
        // Pause autoplay on hover
        const carouselContainer = document.querySelector('.carousel-container');
        carouselContainer.addEventListener('mouseenter', () => {
            this.stopAutoPlay();
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlide();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlide();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlide();
    }
    
    updateSlide() {
        // Remove active class from all slides and dots
        this.slides.forEach(slide => {
            slide.classList.remove('active', 'prev');
        });
        
        this.dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Add active class to current slide and dot
        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');
        
        // Add prev class to previous slide for smooth transition
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.slides[prevIndex].classList.add('prev');
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// Scroll Animation Observer
class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll('.featured-products, .categories-section, .product-card, .category-card');
        this.init();
    }
    
    init() {
        this.createObserver();
        this.observeElements();
    }
    
    createObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
    }
    
    observeElements() {
        this.animatedElements.forEach(element => {
            this.observer.observe(element);
        });
    }
}

// Smooth scrolling for navigation
class SmoothScrolling {
    constructor() {
        this.init();
    }
    
    init() {
        // Add smooth scrolling to all internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Search functionality
class Search {
    constructor() {
        this.searchInput = document.querySelector('.search-bar input');
        this.searchBtn = document.querySelector('.search-btn');
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        this.searchBtn.addEventListener('click', () => {
            this.performSearch();
        });
        
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });
    }
    
    performSearch() {
        const query = this.searchInput.value.trim();
        if (query) {
            // Add search animation
            this.searchBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.searchBtn.style.transform = 'scale(1)';
            }, 150);
            
            // Here you would typically send the search query to your backend
            console.log('Searching for:', query);
            
            // For demo purposes, show an alert
            alert(`Buscando: ${query}`);
        }
    }
}

// Interactive elements
class InteractiveElements {
    constructor() {
        this.init();
    }
    
    init() {
        this.addButtonAnimations();
        this.addHoverEffects();
        this.addCountdownTimer();
    }
    
    addButtonAnimations() {
        // Add click animations to all buttons
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }
    
    addHoverEffects() {
        // Add hover effects to product cards
        document.querySelectorAll('.product-card, .category-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    addCountdownTimer() {
        const timeBoxes = document.querySelectorAll('.time-box');
        if (timeBoxes.length === 0) return;
        
        let hours = 10;
        let minutes = 11;
        let seconds = 26;
        
        setInterval(() => {
            seconds--;
            if (seconds < 0) {
                seconds = 59;
                minutes--;
                if (minutes < 0) {
                    minutes = 59;
                    hours--;
                    if (hours < 0) {
                        hours = 23; // Reset to 23 hours
                    }
                }
            }
            
            timeBoxes[0].textContent = hours.toString().padStart(2, '0');
            timeBoxes[1].textContent = minutes.toString().padStart(2, '0');
            timeBoxes[2].textContent = seconds.toString().padStart(2, '0');
        }, 1000);
    }
}

// Mobile menu functionality
class MobileMenu {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.nav = document.querySelector('.nav');
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        this.hamburger.addEventListener('click', () => {
            this.toggleMenu();
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.nav.contains(e.target) && !this.hamburger.contains(e.target)) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        this.nav.classList.toggle('mobile-open');
        this.hamburger.classList.toggle('active');
    }
    
    closeMenu() {
        this.nav.classList.remove('mobile-open');
        this.hamburger.classList.remove('active');
    }
}

// Performance optimization
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.lazyLoadImages();
        this.debounceScrollEvents();
    }
    
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    debounceScrollEvents() {
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                // Handle scroll events here if needed
            }, 100);
        });
    }
}

// Navigation links functionality
class NavigationLinks {
    constructor() {
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        // Store icon (dashboard)
        const storeLink = document.querySelector('a[href="dashboard.html"]');
        if (storeLink) {
            storeLink.addEventListener('click', (e) => {
                // Add click animation
                e.target.closest('.nav-icon-link').style.transform = 'scale(0.95)';
                setTimeout(() => {
                    e.target.closest('.nav-icon-link').style.transform = 'scale(1)';
                }, 150);
                
                // Show notification
                if (window.HomeDelight) {
                    window.HomeDelight.showNotification('Redirigiendo al Dashboard...', 'info');
                }
            });
        }
        
        // User icon (business login)
        const userLink = document.querySelector('a[href="business-login.html"]');
        if (userLink) {
            userLink.addEventListener('click', (e) => {
                // Add click animation
                e.target.closest('.nav-icon-link').style.transform = 'scale(0.95)';
                setTimeout(() => {
                    e.target.closest('.nav-icon-link').style.transform = 'scale(1)';
                }, 150);
                
                // Show notification
                if (window.HomeDelight) {
                    window.HomeDelight.showNotification('Redirigiendo al Login de Negocios...', 'info');
                }
            });
        }
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize carousel
    new Carousel();
    
    // Initialize scroll animations
    new ScrollAnimations();
    
    // Initialize smooth scrolling
    new SmoothScrolling();
    
    // Initialize search functionality
    new Search();
    
    // Initialize interactive elements
    new InteractiveElements();
    
    // Initialize mobile menu
    new MobileMenu();
    
    // Initialize performance optimizations
    new PerformanceOptimizer();
    
    // Initialize navigation links
    new NavigationLinks();
    
    // Add loading animation
    document.body.classList.add('loaded');
    
    console.log('HomeDelight website initialized successfully!');
});

// Add some additional utility functions
window.HomeDelight = {
    // Utility function to show notifications
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
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
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    },
    
    // Utility function to format prices
    formatPrice: function(price) {
        return new Intl.NumberFormat('es-PA', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    }
}; 