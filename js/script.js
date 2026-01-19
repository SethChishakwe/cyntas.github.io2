// js/script.js - Complete Functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeBurgerMenu();
    initializeSmoothScrolling();
    initializeFormValidation();
    initializeURLParameters();
    initializeScrollEffects();
    initializeAnimations();
    initializeEventListeners();
});

// ===== BURGER MENU FUNCTIONALITY =====
function initializeBurgerMenu() {
    const burgerButton = document.querySelector('.menu-toggle');
    const overlay = document.querySelector('.menu-overlay');
    const navLinks = document.querySelector('.nav-links');
    
    if (!burgerButton || !overlay || !navLinks) return;
    
    burgerButton.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    overlay.addEventListener('click', closeMobileMenu);
    
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && navLinks.classList.contains('active')) {
            if (!e.target.closest('.nav-container') && !e.target.closest('.nav-links')) {
                closeMobileMenu();
            }
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
    
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.menu-toggle');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    if (!navLinks || !menuToggle || !menuOverlay) return;
    
    const isActive = navLinks.classList.contains('active');
    
    if (isActive) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

function openMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.menu-toggle');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    if (!navLinks || !menuToggle || !menuOverlay) return;
    
    navLinks.classList.add('active');
    menuToggle.classList.add('active');
    menuOverlay.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.menu-toggle');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    if (!navLinks || !menuToggle || !menuOverlay) return;
    
    navLinks.classList.remove('active');
    menuToggle.classList.remove('active');
    menuOverlay.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#') && href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    closeMobileMenu();
                    
                    const headerHeight = document.querySelector('nav')?.offsetHeight || 72;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = targetPosition - headerHeight;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    history.pushState(null, null, href);
                }
            }
        });
    });
}

// ===== FORM VALIDATION =====
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            } else {
                // Show success message
                const successDiv = document.createElement('div');
                successDiv.className = 'success-message';
                successDiv.textContent = 'Thank you! Your registration has been submitted successfully. We will contact you shortly.';
                successDiv.style.marginTop = '2rem';
                
                const formContainer = form.closest('.registration-form') || form.parentElement;
                formContainer.appendChild(successDiv);
                
                // Scroll to success message
                setTimeout(() => {
                    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
                
                // Clear form after 5 seconds
                setTimeout(() => {
                    form.reset();
                    successDiv.style.opacity = '0';
                    successDiv.style.transition = 'opacity 0.5s ease';
                    setTimeout(() => successDiv.remove(), 500);
                }, 5000);
            }
        });
        
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    const existingErrors = form.querySelectorAll('.field-error');
    existingErrors.forEach(error => error.remove());
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = 'Please fill in all required fields marked with *.';
        errorDiv.style.marginBottom = '1.5rem';
        
        if (form.firstChild) {
            form.insertBefore(errorDiv, form.firstChild);
        } else {
            form.appendChild(errorDiv);
        }
        
        const firstError = form.querySelector('.field-error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    return isValid;
}

function validateField(field) {
    if (!field.hasAttribute('required')) return true;
    
    let isValid = true;
    let errorMessage = '';
    
    if (!field.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required.';
    } else if (field.type === 'email' && !isValidEmail(field.value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address.';
    } else if (field.type === 'tel' && !isValidPhone(field.value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number.';
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '0.3rem';
    errorDiv.style.fontWeight = '500';
    
    field.style.borderColor = '#dc3545';
    field.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    
    field.style.borderColor = '';
    field.style.boxShadow = '';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// ===== URL PARAMETERS =====
function initializeURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    const interest = urlParams.get('interest');
    if (interest) {
        const selectElement = document.getElementById('interest_area');
        if (selectElement) {
            const valueMap = {
                'agriculture': 'Agriculture',
                'renewable': 'Renewable Energy',
                'business': 'Small Business',
                'property': 'Property Development',
                'commercial_agriculture': 'Commercial Agriculture',
                'industrial': 'Industrial Development'
            };
            
            if (valueMap[interest]) {
                selectElement.value = valueMap[interest];
            }
        }
    }
    
    const workshop = urlParams.get('workshop');
    if (workshop) {
        const selectElement = document.getElementById('workshop_type');
        if (selectElement) {
            const valueMap = {
                'basic': 'Basic Financial Literacy - $15',
                'agriculture': 'Agricultural Investment Basics - $25',
                'advanced': 'Advanced Investment Strategies - $50'
            };
            
            if (valueMap[workshop]) {
                selectElement.value = valueMap[workshop];
            }
        }
    }
    
    const type = urlParams.get('type');
    if (type === 'diaspora') {
        const levelSelect = document.getElementById('investment_level');
        if (levelSelect) {
            levelSelect.value = 'Diaspora ($1,000+)';
        }
    }
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        if (!nav) return;
        
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(0,0,0,0.95)';
            nav.style.backdropFilter = 'blur(10px)';
        } else {
            nav.style.background = '#000';
            nav.style.backdropFilter = 'none';
        }
        
        if (window.scrollY > 10) {
            nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.boxShadow = 'none';
        }
        
        // Back to top button
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    });
    
    window.dispatchEvent(new Event('scroll'));
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Animate numbers
    const animateNumbers = () => {
        const statElements = document.querySelectorAll('.stat-number');
        
        statElements.forEach(stat => {
            if (isElementInViewport(stat)) {
                const finalValue = parseFloat(stat.getAttribute('data-target'));
                if (!stat.hasAttribute('data-animated') && !isNaN(finalValue)) {
                    animateValue(stat, 0, finalValue, 1500);
                    stat.setAttribute('data-animated', 'true');
                }
            }
        });
    };
    
    const isElementInViewport = (el) => {
        if (!el) return false;
        
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        return (
            rect.top <= windowHeight * 0.85 &&
            rect.bottom >= 0
        );
    };
    
    const animateValue = (element, start, end, duration) => {
        if (!element) return;
        
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const value = start + (end - start) * easeOutQuart;
            
            if (element.classList.contains('stat-number')) {
                if (element.textContent.includes('%')) {
                    element.textContent = value.toFixed(1) + '%';
                } else {
                    element.textContent = Math.floor(value).toLocaleString();
                }
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        
        window.requestAnimationFrame(step);
    };
    
    window.addEventListener('scroll', animateNumbers);
    setTimeout(animateNumbers, 500);
    
    // Intersection Observer
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        document.querySelectorAll('.about-card, .service-card, .investment-card, .workshop-card').forEach(card => {
            observer.observe(card);
        });
    }
}

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });
    
    // Back to top button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Card hover effects
    document.querySelectorAll('.about-card, .service-card, .investment-card, .workshop-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (this.classList.contains('service-card')) {
                this.style.transform = 'translateY(-8px)';
            } else {
                this.style.transform = 'translateY(-5px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Select focus effects
    document.querySelectorAll('select').forEach(select => {
        select.addEventListener('focus', function() {
            this.parentElement.style.zIndex = '10';
        });
        
        select.addEventListener('blur', function() {
            this.parentElement.style.zIndex = '1';
        });
    });
    
    // Handle form success/error messages
    const successMessage = document.querySelector('.success-message');
    const errorMessage = document.querySelector('.error-message');
    
    if (successMessage) {
        setTimeout(() => {
            successMessage.style.opacity = '0';
            successMessage.style.transition = 'opacity 0.5s ease';
            setTimeout(() => successMessage.remove(), 500);
        }, 5000);
    }
    
    if (errorMessage) {
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            position: absolute;
            right: 10px;
            top: 10px;
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            color: inherit;
        `;
        closeBtn.addEventListener('click', () => errorMessage.remove());
        errorMessage.style.position = 'relative';
        errorMessage.appendChild(closeBtn);
    }
}

// ===== HELPER FUNCTIONS =====
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

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleMobileMenu,
        closeMobileMenu,
        validateForm,
        validateField
    };
}