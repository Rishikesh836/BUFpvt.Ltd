// ===========================
// Smooth Scroll & Navigation
// ===========================

// Set smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Navbar elements
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('navMenu');
const hamburger = document.getElementById('hamburger');
const navOverlay = document.getElementById('navOverlay');
const navLinks = document.querySelectorAll('.nav-link');

function openMenu() {
    hamburger.classList.add('active');
    navMenu.classList.add('active');
    if (navOverlay) navOverlay.classList.add('active');
    document.body.classList.add('menu-open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close navigation menu');
}

function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
    document.body.classList.remove('menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
}

// Hamburger toggle
hamburger.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
        closeMenu();
    } else {
        openMenu();
    }
});

// Close menu when any link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close menu when the inner "Apply Now" CTA inside drawer is clicked
document.querySelectorAll('.nav-menu-cta a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close menu when overlay is tapped
if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
}

// Close menu on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMenu();
    }
});

// Close menu if window resizes to desktop width
window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && navMenu.classList.contains('active')) {
        closeMenu();
    }
});

// ===========================
// Navbar Scroll State
// ===========================

window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    updateActiveNavLink();
});

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

// ===========================
// IntersectionObserver for Animations
// ===========================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all section headers
const sectionHeaders = document.querySelectorAll('.section-header');
sectionHeaders.forEach(header => {
    observer.observe(header);
});

// Observe all product cards
const productCards = document.querySelectorAll('.product-card');
productCards.forEach(card => {
    observer.observe(card);
});

// Observe director cards
const directorCards = document.querySelectorAll('.director-card');
directorCards.forEach(card => {
    observer.observe(card);
});

// Observe eligibility columns
const eligibilityColumns = document.querySelectorAll('.eligibility-column');
eligibilityColumns.forEach(col => {
    observer.observe(col);
});

// Observe feature boxes
const featureBoxes = document.querySelectorAll('.feature-box');
featureBoxes.forEach(box => {
    observer.observe(box);
});

// Observe footer columns
const footerCols = document.querySelectorAll('.footer-col');
footerCols.forEach(col => {
    observer.observe(col);
});

// Observe new section cards
document.querySelectorAll('.growth-card, .network-card, .data-card, .cta-card').forEach(el => {
    observer.observe(el);
});


// ===========================
// Prevent default for anchor links that are just placeholders
// ===========================

document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
    });
});

// ===========================
// Initialize
// ===========================

// Call on page load to set initial active link
updateActiveNavLink();

console.log('Bharat Uday Finserve website loaded successfully!');
