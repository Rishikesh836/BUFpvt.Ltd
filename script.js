// ===========================
// Navigation
// ===========================
document.documentElement.style.scrollBehavior = 'smooth';

const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('navMenu');
const hamburger = document.getElementById('hamburger');
const navOverlay = document.getElementById('navOverlay');
const navLinks = document.querySelectorAll('a.nav-link');
const dropdown = document.getElementById('loansDropdown');
const dropdownToggle = document.getElementById('loansMenuButton');

function openMenu() {
    if (!hamburger || !navMenu) return;
    hamburger.classList.add('active');
    navMenu.classList.add('active');
    navOverlay?.classList.add('active');
    document.body.classList.add('menu-open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close navigation menu');
}

function closeMenu() {
    if (!hamburger || !navMenu) return;
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    navOverlay?.classList.remove('active');
    document.body.classList.remove('menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
}

function closeDropdown() {
    dropdown?.classList.remove('open');
    dropdownToggle?.setAttribute('aria-expanded', 'false');
}

hamburger?.addEventListener('click', () => {
    navMenu.classList.contains('active') ? closeMenu() : openMenu();
});

navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

document.querySelectorAll('.nav-menu-cta a, .loan-dropdown a').forEach(link => {
    link.addEventListener('click', () => {
        closeMenu();
        closeDropdown();
    });
});

navOverlay?.addEventListener('click', () => {
    closeMenu();
    closeDropdown();
});

dropdownToggle?.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = dropdown.classList.toggle('open');
    dropdownToggle.setAttribute('aria-expanded', String(isOpen));
});

document.addEventListener('click', (event) => {
    if (dropdown && !dropdown.contains(event.target)) {
        closeDropdown();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeMenu();
        closeDropdown();
        closeChatbot();
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && navMenu?.classList.contains('active')) {
        closeMenu();
    }
});

window.addEventListener('scroll', () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 80);
    updateActiveNavLink();
});

function updateActiveNavLink() {
    const sections = document.querySelectorAll('main section[id]');
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`a.nav-link[href="#${sectionId}"]`);
            activeLink?.classList.add('active');
        }
    });
}

// ===========================
// Hero Carousel
// ===========================
const slides = Array.from(document.querySelectorAll('[data-carousel-slide]'));
const dotsContainer = document.querySelector('[data-carousel-dots]');
let currentSlide = 0;
let carouselTimer = null;

function showSlide(index) {
    if (!slides.length) return;
    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('active', slideIndex === currentSlide);
    });

    document.querySelectorAll('[data-carousel-dot]').forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === currentSlide);
        dot.setAttribute('aria-selected', String(dotIndex === currentSlide));
    });
}

function startCarousel() {
    if (!slides.length) return;
    window.clearInterval(carouselTimer);
    carouselTimer = window.setInterval(() => showSlide(currentSlide + 1), 5000);
}

if (slides.length && dotsContainer) {
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.dataset.carouselDot = String(index);
        dot.setAttribute('aria-label', `Show slide ${index + 1}`);
        dot.setAttribute('aria-selected', String(index === 0));
        dot.addEventListener('click', () => {
            showSlide(index);
            startCarousel();
        });
        dotsContainer.appendChild(dot);
    });

    document.querySelector('[data-carousel-prev]')?.addEventListener('click', () => {
        showSlide(currentSlide - 1);
        startCarousel();
    });

    document.querySelector('[data-carousel-next]')?.addEventListener('click', () => {
        showSlide(currentSlide + 1);
        startCarousel();
    });

    showSlide(0);
    startCarousel();
}

// ===========================
// EMI Calculator
// ===========================
const loanAmount = document.getElementById('loanAmount');
const interestRate = document.getElementById('interestRate');
const tenureMonths = document.getElementById('tenureMonths');
const loanAmountOutput = document.getElementById('loanAmountOutput');
const interestRateOutput = document.getElementById('interestRateOutput');
const tenureOutput = document.getElementById('tenureOutput');
const monthlyEmi = document.getElementById('monthlyEmi');
const totalInterest = document.getElementById('totalInterest');
const totalPayable = document.getElementById('totalPayable');
const emiToggle = document.querySelector('.emi-toggle');
const emiPanel = document.getElementById('emiPanel');

const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
});

function updateEmi() {
    if (!loanAmount || !interestRate || !tenureMonths) return;
    const principal = Number(loanAmount.value);
    const annualRate = Number(interestRate.value);
    const months = Number(tenureMonths.value);
    const monthlyRate = annualRate / 12 / 100;
    const emi = monthlyRate === 0
        ? principal / months
        : principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    const payable = emi * months;
    const interest = payable - principal;

    loanAmountOutput.textContent = inrFormatter.format(principal);
    interestRateOutput.textContent = `${annualRate.toFixed(annualRate % 1 === 0 ? 0 : 1)}%`;
    tenureOutput.textContent = `${months} months`;
    monthlyEmi.textContent = inrFormatter.format(emi);
    totalInterest.textContent = inrFormatter.format(interest);
    totalPayable.textContent = inrFormatter.format(payable);
}

[loanAmount, interestRate, tenureMonths].forEach(input => {
    input?.addEventListener('input', updateEmi);
});

emiToggle?.addEventListener('click', () => {
    const isCollapsed = emiPanel.classList.toggle('collapsed');
    emiToggle.setAttribute('aria-expanded', String(!isCollapsed));
    emiToggle.querySelector('span:first-child').textContent = isCollapsed ? 'Open EMI Calculator' : 'Close EMI Calculator';
    emiToggle.querySelector('.toggle-icon').textContent = isCollapsed ? '+' : '−';
});

updateEmi();

// ===========================
// FAQ Accordion
// ===========================
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!isExpanded));
    });
});

// ===========================
// Chatbot
// ===========================
const chatbot = document.getElementById('chatbot');
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotForm = document.getElementById('chatbotForm');
const chatbotText = document.getElementById('chatbotText');

const botKnowledge = {
    school: 'School Improvement Loans are for affordable private school proprietors, especially schools charging roughly \u20B9500-\u20B93,000/month. Typical use cases include classrooms, labs, toilets, ICT equipment, and furniture. Average ticket: \u20B923 lakhs. NBFC rates are usually 10.5-15%, and public sector bank options may be 8-10.5% where eligible.',
    student: 'For domestic student loans, we help compare public banks, private banks, NBFCs, and fintechs. Domestic rates typically range from 8-13%. Overseas education loans can go up to \u20B91.5 Cr, with NBFC rates around 10.5-15% and private banks around 9.5-13%. Processing can range from 7-45 days by lender type.',
    fee: 'Parent Fee Financing is designed for families earning about \u20B915,000-\u20B940,000/month who want to convert school fees into manageable EMIs. Fintech/NBFC-style rates are often 12-18%, depending on profile, school partnership, amount, and tenure.',
    skills: 'Vocational & Skills Loans support NSDC-partnered short courses, usually \u20B912,000-\u20B940,000. They are suited to working professionals and graduates reskilling in data science, computing, advanced manufacturing, and similar employability-linked programs.',
    rates: 'Indicative ranges: public sector banks 8-10.5%, private banks 9.5-13%, NBFCs 10.5-15%, fintechs 12-18%. Your final rate depends on product, borrower profile, institution, co-applicant, and lender policy.',
    processing: 'Indicative processing times: public sector banks 30-45 days, private banks 20-30 days, NBFCs 7-15 days, fintech platforms 1-3 days. School Improvement offers can be faster when cashflow documents are complete.',
    vidyalaxmi: 'PM Vidyalaxmi supports meritorious students admitted to eligible Quality Higher Education Institutions. It enables collateral-free, guarantor-free education loans, and students with annual family income up to \u20B98 lakhs may receive 3% interest subvention on loans up to \u20B910 lakhs. A counsellor can help confirm whether your institution qualifies.',
    counsellor: 'I can connect you with an Education Finance Relationship Manager (EFRM). Please share your loan type, city/state, loan amount, and whether you are a student, parent, or school operator. For complex cases, field counselling is the best next step.'
};

function openChatbot(topic) {
    chatbot?.classList.add('open');
    chatbotToggle?.setAttribute('aria-expanded', 'true');
    if (topic) sendBotTopic(topic);
}

function closeChatbot() {
    chatbot?.classList.remove('open');
    chatbotToggle?.setAttribute('aria-expanded', 'false');
}

function addChatMessage(message, type = 'bot') {
    if (!chatbotMessages) return;
    const bubble = document.createElement('div');
    bubble.className = type === 'user' ? 'user-message' : 'bot-message';
    bubble.textContent = message;
    chatbotMessages.appendChild(bubble);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function sendBotTopic(topic) {
    addChatMessage(botKnowledge[topic] || botKnowledge.counsellor, 'bot');
}

function resolveBotResponse(message) {
    const text = message.toLowerCase();
    if (text.includes('vidya') || text.includes('subvention') || text.includes('scheme')) return botKnowledge.vidyalaxmi;
    if (text.includes('rate') || text.includes('interest') || text.includes('emi')) return botKnowledge.rates;
    if (text.includes('time') || text.includes('approval') || text.includes('process')) return botKnowledge.processing;
    if (text.includes('school') || text.includes('infrastructure') || text.includes('proprietor')) return botKnowledge.school;
    if (text.includes('parent') || text.includes('fee')) return botKnowledge.fee;
    if (text.includes('overseas') || text.includes('abroad') || text.includes('student')) return botKnowledge.student;
    if (text.includes('skill') || text.includes('vocational') || text.includes('nsdc')) return botKnowledge.skills;
    if (text.includes('counsellor') || text.includes('counselor') || text.includes('agent') || text.includes('efrm')) return botKnowledge.counsellor;
    return 'I can help with loan types, eligibility, interest ranges, processing timelines, PM Vidyalaxmi, and EFRM counselling. Choose a quick reply or tell me which loan you are exploring.';
}

chatbotToggle?.addEventListener('click', () => {
    chatbot?.classList.contains('open') ? closeChatbot() : openChatbot();
});

chatbotClose?.addEventListener('click', closeChatbot);

document.querySelectorAll('[data-chat-topic]').forEach(button => {
    button.addEventListener('click', () => {
        addChatMessage(button.textContent.trim(), 'user');
        sendBotTopic(button.dataset.chatTopic);
    });
});

document.querySelectorAll('[data-chat-intent]').forEach(button => {
    button.addEventListener('click', () => openChatbot(button.dataset.chatIntent));
});

chatbotForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = chatbotText.value.trim();
    if (!message) return;
    addChatMessage(message, 'user');
    addChatMessage(resolveBotResponse(message), 'bot');
    chatbotText.value = '';
});

// ===========================
// Animation observer
// ===========================
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

    document.querySelectorAll('.section-header, .product-card, .who-card, .physital-card, .image-stat-card, .faq-item, .loan-info-card, .loan-feature-card, .loan-step-card, .loan-eligibility-card, .cta-card, .feature-box, .footer-col').forEach(element => {
        observer.observe(element);
    });
}

document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', (event) => event.preventDefault());
});

updateActiveNavLink();
