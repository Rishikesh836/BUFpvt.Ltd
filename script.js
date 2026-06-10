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
    link.addEventListener('click', (event) => {
        const productKey = link.dataset.productKey;
        const linkTarget = link.getAttribute('href') || '';
        if (productKey && linkTarget.startsWith('#')) {
            event.preventDefault();
            showProductDetail(productKey, true);
        }
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
    const trackedElements = document.querySelectorAll('section[id], .product-detail-view[id], .product-card[id], #emi-calculator');
    const scrollPosition = window.scrollY + 140;
    const loanIds = new Set([
        'products',
        'product-detail',
        'loan-application'
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
// Single Product Detail View
// ===========================

const productCatalog = {
    edufinance: {
        colorClass: 'product-card-blue',
        number: '01',
        status: 'Active vertical',
        title: 'Bharat Uday Edufinance',
        subtitle: 'Edufinance Products',
        audience: 'Building a connected education finance ecosystem through a strong phygital model that combines digital capability with deep on-ground reach.',
        amount: 'Schools | Parents | Learners',
        timeline: 'Application support available',
        image: 'assets/generated/student-loan.png',
        alt: 'Learners and institutions supported through Edufinance',
        highlights: [
            'School infrastructure and development support',
            'Parent and fee enablement pathways',
            'Higher education and skills financing products'
        ],
        applyLabel: 'Apply for Edufinance',
        applyType: 'School Loan',
        heroCard: {
            badge: 'EDUCATION FINANCE',
            titleMain: 'EduFinance',
            titleAccent: 'Loan',
            accentColor: '#7B6CF6',
            tags: [
                { label: 'Student', cls: 'pht-teal' },
                { label: 'School',  cls: 'pht-green' },
                { label: 'Parent',  cls: 'pht-amber' }
            ],
            desc: 'Empowering dreams through education financing.',
            subcards: [
                { icon: '&#127891;', iconCls: 'phsi-teal',  titleCls: 'phst-teal',  title: 'For Students', desc: 'Fund your higher education dreams' },
                { icon: '&#127979;', iconCls: 'phsi-green', titleCls: 'phst-green', title: 'For Schools',   desc: 'Support growth and better learning' },
                { icon: '&#128106;', iconCls: 'phsi-amber', titleCls: 'phst-amber', title: 'For Parents',  desc: "Plan and finance your child's future" }
            ]
        }
    },
    microfinance: {
        colorClass: 'product-card-green',
        number: '02',
        status: 'Coming soon',
        title: 'Bharat Uday Micro',
        subtitle: 'Microfinance',
        audience: 'Expanding financial inclusion through accessible, community-driven lending solutions designed to empower underserved segments.',
        amount: 'Community-focused access',
        timeline: 'Future vertical',
        image: 'assets/generated/fee-finance.png',
        alt: 'Community finance discussion',
        highlights: [
            'Accessible and community-focused lending',
            'Designed for financial inclusion pathways',
            'Placeholder vertical for future rollout'
        ],
        applyLabel: 'Coming Soon',
        comingSoon: true,
        heroCard: {
            badge: 'MICROFINANCE',
            titleMain: 'Microfinance',
            titleAccent: 'Loan',
            accentColor: '#22c55e',
            tags: [
                { label: 'Individual',  cls: 'pht-teal' },
                { label: 'Community',   cls: 'pht-green' },
                { label: 'Group',       cls: 'pht-amber' }
            ],
            desc: 'Expanding financial inclusion through accessible, community-driven lending.',
            subcards: [
                { icon: '&#128100;', iconCls: 'phsi-teal',  titleCls: 'phst-teal',  title: 'For Individuals', desc: 'Access personal microloans' },
                { icon: '&#127968;', iconCls: 'phsi-green', titleCls: 'phst-green', title: 'For Communities', desc: 'Build stronger local economies' },
                { icon: '&#128101;', iconCls: 'phsi-amber', titleCls: 'phst-amber', title: 'For Groups',      desc: 'Joint liability group lending' }
            ]
        }
    },
    msme: {
        colorClass: 'product-card-navy',
        number: '03',
        status: 'Coming soon',
        title: 'Bharat Uday MSME',
        subtitle: 'MSME & Enterprise Finance',
        audience: 'Enabling sustainable business growth with tailored financial solutions across every stage of enterprise expansion.',
        amount: 'Enterprise pathways',
        timeline: 'Future vertical',
        image: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=900&q=80',
        alt: 'Manufacturing workspace for enterprise growth',
        highlights: [
            'Growth support for MSME and enterprise needs',
            'Structured products for different expansion stages',
            'Placeholder vertical for future rollout'
        ],
        applyLabel: 'Coming Soon',
        comingSoon: true,
        heroCard: {
            badge: 'MSME & ENTERPRISE',
            titleMain: 'MSME & Enterprise',
            titleAccent: 'Finance',
            accentColor: '#3b82f6',
            tags: [
                { label: 'MSME',       cls: 'pht-teal' },
                { label: 'Enterprise', cls: 'pht-green' },
                { label: 'Business',   cls: 'pht-amber' }
            ],
            desc: 'Enabling sustainable business growth with tailored financial solutions.',
            subcards: [
                { icon: '&#128295;', iconCls: 'phsi-teal',  titleCls: 'phst-teal',  title: 'For MSMEs',      desc: 'Kick-start your micro business' },
                { icon: '&#127981;', iconCls: 'phsi-green', titleCls: 'phst-green', title: 'For Enterprise', desc: 'Scale your enterprise operations' },
                { icon: '&#128200;', iconCls: 'phsi-amber', titleCls: 'phst-amber', title: 'For Business',   desc: 'Drive medium-scale expansion' }
            ]
        }
    },
    secured: {
        colorClass: 'product-card-blue',
        number: '04',
        status: 'Coming soon',
        title: 'Bharat Uday Secured',
        subtitle: 'Secured Credit',
        audience: 'Unlocking financial potential through structured asset-backed lending solutions built on stability and trust.',
        amount: 'Asset-backed pathways',
        timeline: 'Future vertical',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80',
        alt: 'Home model representing secured credit',
        highlights: [
            'Asset-backed credit pathways',
            'Designed for larger financial opportunities',
            'Placeholder vertical for future rollout'
        ],
        applyLabel: 'Coming Soon',
        comingSoon: true,
        heroCard: {
            badge: 'SECURED CREDIT',
            titleMain: 'Secured',
            titleAccent: 'Credit',
            accentColor: '#f59e0b',
            tags: [
                { label: 'Home',     cls: 'pht-teal' },
                { label: 'Business', cls: 'pht-green' },
                { label: 'Property', cls: 'pht-amber' }
            ],
            desc: 'Unlocking financial potential through structured asset-backed lending solutions.',
            subcards: [
                { icon: '&#127968;', iconCls: 'phsi-teal',  titleCls: 'phst-teal',  title: 'Home Loan',     desc: 'Finance your dream home' },
                { icon: '&#128188;', iconCls: 'phsi-green', titleCls: 'phst-green', title: 'Business Loan', desc: 'Secure capital for growth' },
                { icon: '&#127959;', iconCls: 'phsi-amber', titleCls: 'phst-amber', title: 'Property Loan', desc: 'Leverage your property assets' }
            ]
        }
    },
    healthcare: {
        colorClass: 'product-card-orange',
        number: '05',
        status: 'Coming soon',
        title: 'Bharat Uday Healthcare',
        subtitle: 'Healthcare Finance',
        audience: 'Enhancing access to healthcare through timely and flexible financial solutions supporting medical and wellness needs.',
        amount: 'Healthcare access',
        timeline: 'Future vertical',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80',
        alt: 'Healthcare corridor and wellness facility',
        highlights: [
            'Support for medical needs and wellness goals',
            'Designed for timely healthcare access',
            'Placeholder vertical for future rollout'
        ],
        applyLabel: 'Coming Soon',
        comingSoon: true,
        heroCard: {
            badge: 'HEALTHCARE FINANCE',
            titleMain: 'Healthcare',
            titleAccent: 'Finance',
            accentColor: '#f43f5e',
            tags: [
                { label: 'Patient',  cls: 'pht-teal' },
                { label: 'Hospital', cls: 'pht-green' },
                { label: 'Wellness', cls: 'pht-amber' }
            ],
            desc: 'Enhancing access to healthcare through timely and flexible financial solutions.',
            subcards: [
                { icon: '&#128137;', iconCls: 'phsi-teal',  titleCls: 'phst-teal',  title: 'For Patients',  desc: 'Cover medical expenses easily' },
                { icon: '&#127973;', iconCls: 'phsi-green', titleCls: 'phst-green', title: 'For Hospitals', desc: 'Support healthcare infrastructure' },
                { icon: '&#128138;', iconCls: 'phsi-amber', titleCls: 'phst-amber', title: 'For Wellness',  desc: 'Fund wellness and preventive care' }
            ]
        }
    },
    'school-improvement': {
        colorClass: 'product-card-blue',
        number: '01',
        status: 'Applications open',
        title: 'School Improvement Loan',
        subtitle: 'Infrastructure Upgrades',
        audience: 'For school owners building better learning environments.',
        amount: 'Up to ₹25 Lakhs',
        timeline: '7-15 day disbursal after sanction',
        image: 'assets/generated/school-improvement.png',
        alt: 'Students learning in an improved classroom',
        highlights: [
            'Classrooms, labs, equipment, furniture, and learning materials',
            'Water, bathrooms, sanitation, and safety improvements',
            'Cashflow-based underwriting with practical collateral options'
        ],
        applyLabel: 'Apply for School Loan',
        applyType: 'School Loan'
    },
    'school-fee': {
        colorClass: 'product-card-gold',
        number: '02',
        status: 'Applications open',
        title: 'School Fee Loan',
        subtitle: 'Flexible Education Loans',
        audience: 'For parents managing term fees so children stay in school.',
        amount: '₹5,000 - ₹20,000',
        timeline: '48-72 hour movement after documents',
        image: 'assets/generated/fee-finance.png',
        alt: 'Parent and child reviewing school fee documents',
        highlights: [
            'Helps prevent fee-driven dropouts',
            'Minimal documentation with flexible EMI options',
            'Designed for mid-year or term-wise fee needs'
        ],
        applyLabel: 'Apply for School Loan',
        applyType: 'School Loan'
    },
    student: {
        colorClass: 'product-card-navy',
        number: '03',
        status: 'Applications open',
        title: 'Student Loan',
        subtitle: 'Higher Education Funding',
        audience: 'For domestic higher education across India.',
        amount: 'Up to ₹40 Lakhs',
        timeline: 'Moratorium available for eligible cases',
        image: 'assets/generated/student-loan.png',
        alt: 'Students walking on a college campus',
        highlights: [
            'Supports recognized colleges, universities, and professional programs',
            'Competitive rates with eligible co-applicant',
            'End-to-end digital application support'
        ],
        applyLabel: 'Apply for College Loan',
        applyType: 'College Loan'
    },
    overseas: {
        colorClass: 'product-card-navy',
        number: 'OS',
        status: 'Applications open',
        title: 'Overseas Education Loan',
        subtitle: 'Study-Abroad Financing',
        audience: 'For study-abroad aspirants across leading education destinations.',
        amount: 'Up to ₹80 Lakhs',
        timeline: 'Subject to admission, visa, and credit assessment',
        image: 'assets/generated/student-loan.png',
        alt: 'Students on a modern college campus',
        highlights: [
            'USA, UK, Canada, Australia, Germany, Ireland, and other destinations',
            'Collateral-free options for select cases',
            'Visa-letter, forex, and counselling ecosystem support'
        ],
        applyLabel: 'Apply for College Loan',
        applyType: 'College Loan'
    },
    vocational: {
        colorClass: 'product-card-orange',
        number: '04',
        status: 'Applications open',
        title: 'Vocational & Skills Loan',
        subtitle: 'Skills & Training Support',
        audience: 'For short-duration skill, certification, and employability courses.',
        amount: '₹12,000 - ₹40,000',
        timeline: '3-day approval for eligible programs',
        image: 'assets/generated/skills-loan.png',
        alt: 'Learners in a vocational skills workshop',
        highlights: [
            'Supports eligible skilling and training partners',
            'Useful for IT, healthcare, manufacturing, and practical programs',
            'Placement-linked repayment options for eligible courses'
        ],
        applyLabel: 'Apply for Course Loan',
        applyType: 'Course Loan'
    },
    'school-growth': {
        colorClass: 'product-card-green',
        number: '05',
        status: 'Expression of interest open',
        title: 'School Growth Program',
        subtitle: 'Leadership & Development',
        audience: 'For affordable private schools ready to improve learning outcomes.',
        amount: '3-year partnership',
        timeline: 'Capital | Capability | Community',
        image: 'assets/generated/school-growth.png',
        alt: 'School leaders and teachers planning growth',
        highlights: [
            'Annual growth plans and milestone reviews',
            'Teacher and leader development',
            'Peer school networks and outcome monitoring beyond capital'
        ],
        applyLabel: 'Apply for School Loan',
        applyType: 'School Loan'
    }
};

const productDetailView = document.querySelector('[data-product-detail]');
const productDetailImage = document.getElementById('productDetailImage');
const productDetailNumber = document.getElementById('productDetailNumber');
const productHeroCard = document.getElementById('productHeroCard');
const productHeroBadgeText = document.getElementById('productHeroBadgeText');
const productHeroTitleMain = document.getElementById('productHeroTitleMain');
const productHeroTitleAccent = document.getElementById('productHeroTitleAccent');
const productHeroTags = document.getElementById('productHeroTags');
const productHeroDesc = document.getElementById('productHeroDesc');
const productHeroSubcards = document.getElementById('productHeroSubcards');

function updateHeroCard(product) {
    if (!productHeroCard || !product.heroCard) return;
    const c = product.heroCard;
    productHeroCard.style.setProperty('--hero-accent', c.accentColor);
    productHeroBadgeText.textContent = c.badge;
    productHeroTitleMain.textContent = c.titleMain;
    productHeroTitleAccent.textContent = c.titleAccent;
    productHeroTags.innerHTML = c.tags.map(t =>
        `<span class="product-hero-tag ${t.cls}">${t.label}</span>`
    ).join('');
    productHeroDesc.textContent = c.desc;
    productHeroSubcards.innerHTML = c.subcards.map(s =>
        `<div class="product-hero-subcard">
            <div class="product-hero-subcard-icon ${s.iconCls}">${s.icon}</div>
            <span class="product-hero-subcard-title ${s.titleCls}">${s.title}</span>
            <p>${s.desc}</p>
        </div>`
    ).join('');
}
const productDetailStatus = document.getElementById('productDetailStatus');
const productDetailTitle = document.getElementById('productDetailTitle');
const productDetailSubtitle = document.getElementById('productDetailSubtitle');
const productDetailFor = document.getElementById('productDetailFor');
const productDetailAmount = document.getElementById('productDetailAmount');
const productDetailTimeline = document.getElementById('productDetailTimeline');
const productDetailList = document.getElementById('productDetailList');
const productApplyButton = document.getElementById('productApplyButton');
const loanApplicationSection = document.getElementById('loan-application');
const productColorClasses = ['product-card-blue', 'product-card-gold', 'product-card-navy', 'product-card-orange', 'product-card-green'];

function updateApplyTriggerState() {
    const isApplicationOpen = Boolean(loanApplicationSection && !loanApplicationSection.hidden);
    document.querySelectorAll('[data-apply-loan]').forEach(trigger => {
        trigger.setAttribute('aria-controls', 'loan-application');
        trigger.setAttribute('aria-expanded', String(isApplicationOpen));
    });
}

function setLoanApplicationOpen(isOpen, shouldScroll = false) {
    if (!loanApplicationSection) return;
    loanApplicationSection.hidden = !isOpen;
    loanApplicationSection.setAttribute('aria-hidden', String(!isOpen));
    updateApplyTriggerState();

    if (isOpen && shouldScroll) {
        requestAnimationFrame(() => scrollToTarget('#loan-application'));
    }
}

function syncApplyTriggers(product) {
    if (!product.applyType) return;
    document.querySelectorAll('[data-apply-loan]').forEach(trigger => {
        trigger.dataset.applyLoan = product.applyType;
    });
    updateApplyTriggerState();
}

function showProductDetail(productKey, shouldScroll = false) {
    const product = productCatalog[productKey];
    if (!product || !productDetailView) return;

    productDetailView.classList.remove(...productColorClasses);
    productDetailView.classList.add(product.colorClass);
    productDetailView.dataset.productKey = productKey;

    if (productDetailImage) { productDetailImage.src = product.image; productDetailImage.alt = product.alt; }
    if (productDetailNumber) productDetailNumber.textContent = product.number;
    productDetailStatus.textContent = product.status;
    productDetailTitle.textContent = product.title;
    productDetailSubtitle.textContent = product.subtitle;
    productDetailFor.textContent = product.audience;
    productDetailAmount.textContent = product.amount;
    productDetailTimeline.textContent = product.timeline;
    if (productApplyButton) {
        productApplyButton.textContent = product.applyLabel;
        productApplyButton.classList.toggle('btn-disabled', Boolean(product.comingSoon));
        const hasApplicationForm = Boolean(document.getElementById('loanApplicationForm'));
        if (product.comingSoon) {
            productApplyButton.href = '#product-detail';
            productApplyButton.removeAttribute('data-apply-loan');
            productApplyButton.setAttribute('aria-disabled', 'true');
            setLoanApplicationOpen(false);
        } else if (hasApplicationForm) {
            productApplyButton.href = '#loan-application';
            productApplyButton.dataset.applyLoan = product.applyType;
            productApplyButton.removeAttribute('aria-disabled');
            syncApplyTriggers(product);
        } else {
            productApplyButton.href = `loan-detail.html?product=${productKey}#loan-application`;
            delete productApplyButton.dataset.applyLoan;
            productApplyButton.removeAttribute('aria-disabled');
        }
    }

    updateHeroCard(product);

    productDetailList.replaceChildren();
    product.highlights.forEach(highlight => {
        const item = document.createElement('li');
        item.textContent = highlight;
        productDetailList.appendChild(item);
    });

    if (shouldScroll) {
        setLoanApplicationOpen(false);
        scrollToTarget('#product-detail');
    }
}

if (productDetailView) {
    const initialProductKey = new URLSearchParams(window.location.search).get('product');
    if (initialProductKey && productCatalog[initialProductKey]) {
        showProductDetail(initialProductKey, false);
    } else {
        showProductDetail(productDetailView.dataset.productKey || 'edufinance', false);
    }
}

document.querySelectorAll('[data-product-key]').forEach(trigger => {
    if (trigger.classList.contains('dropdown-link') || trigger.classList.contains('product-slide')) return;
    trigger.addEventListener('click', (event) => {
        const linkTarget = trigger.getAttribute('href') || '';
        if (linkTarget && !linkTarget.startsWith('#')) return;
        event.preventDefault();
        showProductDetail(trigger.dataset.productKey, true);
    });
});

// ===========================
// Unified Email-Only Loan Application
// ===========================

const clientEmail = 'info@bharatudayfinserve.in';
const loanApplicationForm = document.getElementById('loanApplicationForm');
const applicationLoanType = document.getElementById('applicationLoanType');
const applicationDynamicFields = document.getElementById('applicationDynamicFields');
const applicantPhone = document.getElementById('applicantPhone');
const applicantEmail = document.getElementById('applicantEmail');
const applicationSubmitFrame = document.getElementById('applicationSubmitFrame');
const applicationSubmitStatus = document.getElementById('applicationSubmitStatus');
const applicationSubmitSubject = document.getElementById('applicationSubmitSubject');
const applicationReplyEmail = document.getElementById('applicationReplyEmail');

const applicationFieldSets = {
    'School Loan': [
        { id: 'schoolName', label: 'School Name', name: 'School Name', type: 'text' },
        { id: 'courseName', label: 'Course Name', name: 'Course Name', type: 'text' },
        { id: 'feeAmount', label: 'Fee Amount', name: 'Fee Amount', type: 'number' },
        { id: 'loanAmountRequired', label: 'Loan Amount Required', name: 'Loan Amount Required', type: 'number' },
        { id: 'numberOfTerms', label: 'Number of Terms (Years)', name: 'Number of Terms', type: 'number', min: 1, max: 10, placeholder: '1-10 years' }
    ],
    'College Loan': [
        { id: 'collegeName', label: 'College / University Name', name: 'College / University Name', type: 'text' },
        { id: 'courseName', label: 'Course Name', name: 'Course Name', type: 'text' },
        { id: 'feeAmount', label: 'Fee Amount', name: 'Fee Amount', type: 'number' },
        { id: 'loanAmountRequired', label: 'Loan Amount Required', name: 'Loan Amount Required', type: 'number' },
        { id: 'numberOfTerms', label: 'Number of Terms (Years)', name: 'Number of Terms', type: 'number', min: 1, max: 10, placeholder: '1-10 years' }
    ],
    'Course Loan': [
        { id: 'trainingProvider', label: 'Training Institute / Course Provider', name: 'Training Institute / Course Provider', type: 'text' },
        { id: 'courseName', label: 'Course Name', name: 'Course Name', type: 'text' },
        { id: 'feeAmount', label: 'Course Fee Amount', name: 'Course Fee Amount', type: 'number' },
        { id: 'loanAmountRequired', label: 'Loan Amount Required', name: 'Loan Amount Required', type: 'number' },
        { id: 'numberOfTerms', label: 'Number of Terms (Years)', name: 'Number of Terms', type: 'number', min: 1, max: 5, placeholder: '1-5 years' }
    ]
};

function createApplicationField(field) {
    const label = document.createElement('label');
    label.className = 'form-field';
    label.setAttribute('for', field.id);

    const labelText = document.createElement('span');
    labelText.textContent = field.label;

    const input = document.createElement('input');
    input.id = field.id;
    input.name = field.name;
    input.type = field.type;
    input.required = true;
    if (field.placeholder) input.placeholder = field.placeholder;

    if (field.type === 'number') {
        input.min = String(field.min ?? 0);
        input.max = field.max ? String(field.max) : '';
        input.step = '1';
        input.inputMode = 'numeric';
        input.addEventListener('keydown', (event) => {
            if (['e', 'E', '+', '-', '.'].includes(event.key)) {
                event.preventDefault();
            }
        });
        input.addEventListener('input', () => {
            input.value = input.value.replace(/\D/g, '');
            if (field.max && Number(input.value) > field.max) {
                input.value = String(field.max);
            }
        });
    }

    label.append(labelText, input);
    return label;
}

function renderApplicationFields(loanType) {
    if (!applicationDynamicFields) return;
    const fields = applicationFieldSets[loanType] || applicationFieldSets['School Loan'];
    applicationDynamicFields.replaceChildren(...fields.map(createApplicationField));
}

function setApplicationLoanType(loanType, shouldScroll = false) {
    if (!applicationLoanType) return;
    applicationLoanType.value = applicationFieldSets[loanType] ? loanType : 'School Loan';
    renderApplicationFields(applicationLoanType.value);

    if (shouldScroll) {
        setLoanApplicationOpen(true, true);
    }
}

if (applicationLoanType) {
    applicationLoanType.addEventListener('change', () => {
        renderApplicationFields(applicationLoanType.value);
    });
    renderApplicationFields(applicationLoanType.value);

    const activeProduct = productDetailView ? productCatalog[productDetailView.dataset.productKey] : null;
    if (activeProduct) {
        setApplicationLoanType(activeProduct.applyType, false);
    }
}

if (loanApplicationSection) {
    const activeProduct = productDetailView ? productCatalog[productDetailView.dataset.productKey] : null;
    const shouldOpenApplication = window.location.hash === '#loan-application' && !(activeProduct && activeProduct.comingSoon);
    setLoanApplicationOpen(shouldOpenApplication, shouldOpenApplication);
}

document.addEventListener('click', (event) => {
    const applyTrigger = event.target.closest('[data-apply-loan]');
    if (!applyTrigger) return;
    event.preventDefault();
    closeMenu();
    closeLoansDropdown();
    setApplicationLoanType(applyTrigger.dataset.applyLoan || 'School Loan', true);
});

if (applicantPhone) {
    applicantPhone.addEventListener('input', () => {
        applicantPhone.value = applicantPhone.value.replace(/\D/g, '').slice(0, 10);
    });
}

let applicationSubmitStarted = false;

if (loanApplicationForm) {
    loanApplicationForm.addEventListener('submit', () => {
        const formData = new FormData(loanApplicationForm);
        const loanType = formData.get('Loan Type') || 'Loan';

        if (applicationSubmitSubject) {
            applicationSubmitSubject.value = `BUFL ${loanType} Application`;
        }
        if (applicationReplyEmail && applicantEmail) {
            applicationReplyEmail.value = applicantEmail.value;
        }
        if (applicationSubmitStatus) {
            applicationSubmitStatus.textContent = 'Sending application...';
        }
        applicationSubmitStarted = true;
    });
}

if (applicationSubmitFrame) {
    applicationSubmitFrame.addEventListener('load', () => {
        if (!applicationSubmitStarted || !applicationSubmitStatus) return;
        applicationSubmitStatus.textContent = 'Application submitted. Our team will contact you shortly.';
        applicationSubmitStarted = false;
        if (loanApplicationForm) {
            loanApplicationForm.reset();
            renderApplicationFields(applicationLoanType ? applicationLoanType.value : 'School Loan');
        }
    });
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
            const slideLink = slide.dataset.slideLink || '';
            if (slideLink && !slideLink.startsWith('#')) {
                window.location.href = slideLink;
            } else if (slide.dataset.productKey && productDetailView) {
                showProductDetail(slide.dataset.productKey, true);
            } else {
                scrollToTarget(slideLink);
            }
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
    '.section-header, .product-detail-view, .loan-application, .director-card, .eligibility-column, .feature-box, .footer-col, .data-card, .cta-card, .identity-card, .vision-card, .mission-card, .flow-card, .growth-step, .why-visual, .emi-calculator'
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

// ===========================
// Accordion Functionality
// ===========================

const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach((item, index) => {
    const header = item.querySelector('.accordion-header');
    
    if (index === 0) {
        item.classList.add('active');
    }
    
    if (header) {
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            accordionItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            if (!isActive) {
                item.classList.add('active');
            }
        });
    }
});

updateActiveNavLink();

console.log('Bharat Uday Finserve website loaded successfully!');
