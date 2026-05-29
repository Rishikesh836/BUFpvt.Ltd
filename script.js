// ===========================
// Smooth Scroll & Navigation
// ===========================

document.documentElement.style.scrollBehavior = 'smooth';

const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('navMenu');
const hamburger = document.getElementById('hamburger');
const navOverlay = document.getElementById('navOverlay');
const navLinks = document.querySelectorAll('.nav-link[href]');
const loansNavItem = document.getElementById('loansNavItem');
const loansDropdownToggle = document.getElementById('loansDropdownToggle');
const dropdownLinks = document.querySelectorAll('.dropdown-link');

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

function setLoansDropdown(open) {
    if (!loansNavItem || !loansDropdownToggle) return;
    loansNavItem.classList.toggle('open', open);
    loansDropdownToggle.setAttribute('aria-expanded', String(open));
}

function closeLoansDropdown() {
    setLoansDropdown(false);
}

function scrollToTarget(hash) {
    const target = document.querySelector(hash);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

hamburger.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
        closeMenu();
    } else {
        openMenu();
    }
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMenu();
        closeLoansDropdown();
    });
});

document.querySelectorAll('.nav-menu-cta a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

if (loansDropdownToggle) {
    loansDropdownToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        const isOpen = loansNavItem.classList.contains('open');
        setLoansDropdown(!isOpen);
    });
}

dropdownLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeLoansDropdown();
        closeMenu();
    });
});

document.addEventListener('click', (event) => {
    if (loansNavItem && !loansNavItem.contains(event.target)) {
        closeLoansDropdown();
    }
});

if (navOverlay) {
    navOverlay.addEventListener('click', () => {
        closeMenu();
        closeLoansDropdown();
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (navMenu.classList.contains('active')) {
        closeMenu();
    }
    closeLoansDropdown();
    closeChatbot();
});

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

    updateActiveNavLink();
});

function updateActiveNavLink() {
    const trackedElements = document.querySelectorAll('section[id], .product-card[id], .overseas-loan-panel[id], #emi-calculator');
    const scrollPosition = window.scrollY + 140;
    const loanIds = new Set([
        'products',
        'school-improvement-loan',
        'school-fee-loan',
        'student-loan',
        'overseas-education-loan',
        'vocational-skills-loan',
        'school-growth-product'
    ]);
    let activeId = '';

    trackedElements.forEach(element => {
        const elementTop = element.offsetTop;
        const elementHeight = element.offsetHeight || element.clientHeight;
        const elementId = element.getAttribute('id');

        if (scrollPosition >= elementTop && scrollPosition < elementTop + elementHeight) {
            activeId = elementId;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    if (loansDropdownToggle) {
        loansDropdownToggle.classList.remove('active');
    }

    const activeLink = document.querySelector(`.nav-link[href="#${activeId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    if (loansDropdownToggle && loanIds.has(activeId)) {
        loansDropdownToggle.classList.add('active');
    }
}

// ===========================
// Product Banner Carousel
// ===========================

const slider = document.querySelector('[data-product-slider]');

if (slider) {
    const slides = Array.from(slider.querySelectorAll('.product-slide'));
    const dots = Array.from(slider.querySelectorAll('.slider-dot'));
    const prevButton = slider.querySelector('[data-slider-prev]');
    const nextButton = slider.querySelector('[data-slider-next]');
    let currentSlide = 0;
    let sliderTimer;

    function showSlide(index) {
        currentSlide = (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === currentSlide;
            slide.classList.toggle('is-active', isActive);
            slide.setAttribute('aria-hidden', String(!isActive));
        });

        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle('is-active', dotIndex === currentSlide);
        });
    }

    function startSlider() {
        window.clearInterval(sliderTimer);
        sliderTimer = window.setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);
    }

    function moveSlider(index) {
        showSlide(index);
        startSlider();
    }

    prevButton.addEventListener('click', (event) => {
        event.stopPropagation();
        moveSlider(currentSlide - 1);
    });

    nextButton.addEventListener('click', (event) => {
        event.stopPropagation();
        moveSlider(currentSlide + 1);
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (event) => {
            event.stopPropagation();
            moveSlider(Number(dot.dataset.slideTo));
        });
    });

    slides.forEach(slide => {
        slide.addEventListener('click', () => {
            scrollToTarget(slide.dataset.slideLink);
        });
    });

    slider.addEventListener('mouseenter', () => window.clearInterval(sliderTimer));
    slider.addEventListener('mouseleave', startSlider);
    slider.addEventListener('focusin', () => window.clearInterval(sliderTimer));
    slider.addEventListener('focusout', startSlider);

    showSlide(0);
    startSlider();
}

// ===========================
// EMI Calculator
// ===========================

const amountRange = document.getElementById('loanAmountRange');
const amountInput = document.getElementById('loanAmount');
const interestRateInput = document.getElementById('interestRate');
const tenureInput = document.getElementById('loanTenure');
const tenureUnitInputs = document.querySelectorAll('input[name="tenureUnit"]');
const monthlyEmi = document.getElementById('monthlyEmi');
const totalInterest = document.getElementById('totalInterest');
const totalPayable = document.getElementById('totalPayable');
const principalBar = document.getElementById('principalBar');
const interestBar = document.getElementById('interestBar');

const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
});

function getTenureUnit() {
    const checkedUnit = document.querySelector('input[name="tenureUnit"]:checked');
    return checkedUnit ? checkedUnit.value : 'years';
}

function getTenureInMonths() {
    const tenure = Math.max(Number(tenureInput.value) || 1, 1);
    return getTenureUnit() === 'years' ? tenure * 12 : tenure;
}

function calculateEmi() {
    if (!amountInput || !interestRateInput || !tenureInput) return;

    const principal = Math.max(Number(amountInput.value) || 0, 0);
    const annualRate = Math.max(Number(interestRateInput.value) || 0, 0);
    const months = Math.max(getTenureInMonths(), 1);
    const monthlyRate = annualRate / 12 / 100;
    let emi;

    if (monthlyRate === 0) {
        emi = principal / months;
    } else {
        const growthFactor = Math.pow(1 + monthlyRate, months);
        emi = principal * monthlyRate * growthFactor / (growthFactor - 1);
    }

    const payable = emi * months;
    const interest = Math.max(payable - principal, 0);
    const principalShare = payable > 0 ? Math.max(Math.min((principal / payable) * 100, 100), 0) : 100;
    const interestShare = Math.max(100 - principalShare, 0);

    monthlyEmi.textContent = currencyFormatter.format(emi || 0);
    totalInterest.textContent = currencyFormatter.format(interest || 0);
    totalPayable.textContent = currencyFormatter.format(payable || 0);
    principalBar.style.width = `${principalShare}%`;
    interestBar.style.width = `${interestShare}%`;
}

if (amountRange && amountInput) {
    amountRange.addEventListener('input', () => {
        amountInput.value = amountRange.value;
        calculateEmi();
    });

    amountInput.addEventListener('input', () => {
        const min = Number(amountInput.min);
        const max = Number(amountInput.max);
        const value = Math.max(Math.min(Number(amountInput.value) || min, max), min);
        amountRange.value = value;
        calculateEmi();
    });
}

if (interestRateInput) {
    interestRateInput.addEventListener('input', calculateEmi);
}

if (tenureInput) {
    tenureInput.addEventListener('input', calculateEmi);
}

let previousTenureUnit = getTenureUnit();
tenureUnitInputs.forEach(input => {
    input.addEventListener('change', () => {
        const currentValue = Math.max(Number(tenureInput.value) || 1, 1);
        const nextUnit = getTenureUnit();

        if (previousTenureUnit === 'years' && nextUnit === 'months') {
            tenureInput.max = 360;
            tenureInput.value = Math.min(currentValue * 12, 360);
        } else if (previousTenureUnit === 'months' && nextUnit === 'years') {
            tenureInput.max = 30;
            tenureInput.value = Math.max(Math.round(currentValue / 12), 1);
        }

        previousTenureUnit = nextUnit;
        calculateEmi();
    });
});

calculateEmi();

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

document.querySelectorAll(
    '.section-header, .product-card, .director-card, .eligibility-column, .feature-box, .footer-col, .data-card, .cta-card, .identity-card, .vision-card, .mission-card, .flow-card, .overseas-loan-panel, .emi-calculator, .faq-item, .phystal-layout'
).forEach(element => {
    observer.observe(element);
});

// ===========================
// Rule-Based Chatbot
// ===========================

const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotReplies = document.getElementById('chatbotReplies');
let chatbotStarted = false;

const chatTopics = {
    eligibility: {
        label: 'Loan eligibility',
        answer: 'Schools can apply for improvement capital and the School Growth Program. Parents can apply for school fee finance. Students with confirmed admission can apply for student or overseas education loans. Skill learners can apply through eligible training programs.'
    },
    process: {
        label: 'Application process',
        answer: 'The process is simple: choose a product, share basic details, submit KYC and income or fee documents, complete BUFL verification, review the offer, and receive disbursal after sanction.'
    },
    products: {
        label: 'Product information',
        answer: 'BUFL supports five pillars: School Improvement Loan, School Fee Loan, Student Loan, Vocational & Skills Loan, and School Growth Program. Overseas Education Loan is available for study-abroad aspirants under higher education finance.'
    },
    rates: {
        label: 'Rates & terms',
        answer: 'Interest rates, fees, moratorium, and tenure depend on the borrower profile, product type, amount, institution, and credit assessment. The full repayment schedule is shared before sanction.'
    },
    contact: {
        label: 'Request callback',
        answer: 'You can request a callback through the Apply Now section, email info@bharatudayfinserve.in, or call 1800-200-UDAY (8329), Monday to Saturday, 9 AM to 6 PM.'
    },
    start: {
        label: 'Back to topics',
        answer: 'What would you like to know about BUFL?'
    }
};

const rootChatOptions = ['eligibility', 'process', 'products', 'rates', 'contact'];

function addChatMessage(text, sender) {
    if (!chatbotMessages) return;
    const message = document.createElement('div');
    message.className = `chat-message ${sender}`;
    message.textContent = text;
    chatbotMessages.appendChild(message);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function renderChatReplies(options) {
    if (!chatbotReplies) return;
    chatbotReplies.innerHTML = '';

    options.forEach(key => {
        const topic = chatTopics[key];
        if (!topic) return;
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = topic.label;
        button.dataset.topic = key;
        chatbotReplies.appendChild(button);
    });
}

function answerChatTopic(key) {
    const topic = chatTopics[key];
    if (!topic) return;

    if (key !== 'start') {
        addChatMessage(topic.label, 'user');
    }

    addChatMessage(topic.answer, 'bot');
    renderChatReplies(key === 'start' ? rootChatOptions : ['start', ...rootChatOptions.filter(option => option !== key)]);
}

function openChatbot() {
    if (!chatbotWindow || !chatbotToggle) return;
    chatbotWindow.classList.add('open');
    chatbotWindow.setAttribute('aria-hidden', 'false');
    chatbotToggle.setAttribute('aria-expanded', 'true');

    if (!chatbotStarted) {
        chatbotStarted = true;
        addChatMessage('Hi, I am BUFL Help. Choose a topic and I will show a quick answer.', 'bot');
        renderChatReplies(rootChatOptions);
    }
}

function closeChatbot() {
    if (!chatbotWindow || !chatbotToggle) return;
    chatbotWindow.classList.remove('open');
    chatbotWindow.setAttribute('aria-hidden', 'true');
    chatbotToggle.setAttribute('aria-expanded', 'false');
}

if (chatbotToggle) {
    chatbotToggle.addEventListener('click', () => {
        if (chatbotWindow.classList.contains('open')) {
            closeChatbot();
        } else {
            openChatbot();
        }
    });
}

if (chatbotClose) {
    chatbotClose.addEventListener('click', closeChatbot);
}

if (chatbotReplies) {
    chatbotReplies.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-topic]');
        if (!button) return;
        answerChatTopic(button.dataset.topic);
    });
}

// ===========================
// Prevent default for placeholder links
// ===========================

document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
    });
});

updateActiveNavLink();

console.log('Bharat Uday Finserve website loaded successfully!');
