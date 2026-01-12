/**
 * Zeina Lahoud MUA Website
 * Modern, responsive JavaScript functionality
 */

// ============================================
// DOM Elements
// ============================================
const navbar = document.getElementById('navv');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const scrollToTopButton = document.getElementById('scrollToTopButton');
const progressCircle = document.querySelector('.progress-ring-circle');
const sliderContainer = document.getElementById('sliderContainer');
const sliderDotsContainer = document.getElementById('sliderDots');

// ============================================
// State
// ============================================
let currentSlide = 0;
let slideInterval = null;
let isMenuOpen = false;
const slides = sliderContainer ? sliderContainer.querySelectorAll('.slide') : [];
const totalSlides = slides.length;

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
	populateContent();
	initializeYear();
	initializeScrollAnimations();
	initializeSlider();
	initializeNavbarScroll();
	callLogApi();
});

// ============================================
// Populate Content from SERVICE_DATA
// ============================================

/**
 * Populate all page content from SERVICE_DATA
 */
function populateContent() {
	const data = SERVICE_DATA;

	// Helper function to safely set text content
	const setText = (selector, value) => {
		const el = document.querySelector(selector);
		if (el && value) el.textContent = value;
	};

	// Helper function to safely set innerHTML
	const setHTML = (selector, value) => {
		const el = document.querySelector(selector);
		if (el && value) el.innerHTML = value;
	};

	// Helper function to safely set attribute
	const setAttr = (selector, attr, value) => {
		const el = document.querySelector(selector);
		if (el && value) el.setAttribute(attr, value);
	};

	// Helper function to safely set href
	const setHref = (selector, value) => {
		const elements = document.querySelectorAll(selector);
		elements.forEach((el) => {
			if (el && value) el.setAttribute('href', value);
		});
	};

	// Helper function to safely set image src
	const setImg = (selector, value) => {
		const el = document.querySelector(selector);
		if (el && value) el.setAttribute('src', value);
	};

	// Brand
	setText('.brand-name', data.brand_name);
	setText('.footer-name', data.brand_name);

	// Hero Section
	setText('.hero-badge', data.hero_badge);
	setHTML(
		'.hero-title',
		`${data.main_title.split(' ').slice(0, -1).join(' ')} <span class="highlight">${data.main_title.split(' ').slice(-1)[0]}</span>`,
	);
	setText('.hero-subtitle', data.main_subtitle);

	// About Section
	setText('#about .section-label', data.about_label);
	setHTML('#about .section-title', data.about_title.replace(', ', ',<br>'));
	setHTML('.about-text', data.about_content.replace('Make Up Forever', '<strong>Make Up Forever</strong>'));
	setImg('.about-image img', data.about_img);

	// Stats
	const statNumbers = document.querySelectorAll('.stat-number');
	const statLabels = document.querySelectorAll('.stat-label');
	if (statNumbers[0]) statNumbers[0].textContent = data.stat_1_number;
	if (statNumbers[1]) statNumbers[1].textContent = data.stat_2_number;
	if (statNumbers[2]) statNumbers[2].textContent = data.stat_3_number;
	if (statLabels[0]) statLabels[0].textContent = data.stat_1_label;
	if (statLabels[1]) statLabels[1].textContent = data.stat_2_label;
	if (statLabels[2]) statLabels[2].textContent = data.stat_3_label;

	// Services Section
	setText('#services .section-label', data.services_label);
	setText('#services .section-title', data.services_title);
	setText('#services .section-description', data.services_subtitle);

	const serviceTitles = document.querySelectorAll('.service-title');
	const serviceDescs = document.querySelectorAll('.service-description');
	if (serviceTitles[0]) serviceTitles[0].textContent = data.service_1_title;
	if (serviceTitles[1]) serviceTitles[1].textContent = data.service_2_title;
	if (serviceTitles[2]) serviceTitles[2].textContent = data.service_3_title;
	if (serviceDescs[0]) serviceDescs[0].textContent = data.service_1_description;
	if (serviceDescs[1]) serviceDescs[1].textContent = data.service_2_description;
	if (serviceDescs[2]) serviceDescs[2].textContent = data.service_3_description;

	// Portfolio Section
	setText('#clients .section-label', data.portfolio_label);
	setText('#clients .section-title', data.portfolio_title);
	setText('#clients .section-description', data.portfolio_subtitle);

	const slides = document.querySelectorAll('.slide img');
	if (slides[0] && data.clients_1_img) slides[0].src = data.clients_1_img;
	if (slides[1] && data.clients_2_img) slides[1].src = data.clients_2_img;
	if (slides[2] && data.clients_3_img) slides[2].src = data.clients_3_img;
	if (slides[3] && data.clients_4_img) slides[3].src = data.clients_4_img;

	// Pricing Section
	setText('#price-list .section-label', data.pricing_label);
	setText('#price-list .section-title', data.pricing_title);
	setText('#price-list .section-description', data.pricing_subtitle);
	setImg('.pricing-image', data.price_list_img);
	setAttr('.btn-download', 'href', data.price_list_download);

	// Contact Section
	setText('.contact-info .section-label', data.contact_label);
	setHTML('.contact-info .section-title', data.contact_title.replace(' Something', '<br>Something'));
	setText('.contact-text', data.contact_text);

	const contactItems = document.querySelectorAll('.contact-item span');
	if (contactItems[0]) contactItems[0].textContent = data.location;
	if (contactItems[1]) contactItems[1].textContent = data.phone;

	// Social Links
	setHref('.contact-btn.whatsapp', data.whatsapp_url);
	setHref('.contact-btn.instagram', data.instagram_url);
	setHref('.footer-social a[aria-label="WhatsApp"]', data.whatsapp_url);
	setHref('.footer-social a[aria-label="Instagram"]', data.instagram_url);
}

// ============================================
// Navigation Functions
// ============================================

/**
 * Toggle mobile menu
 */
function toggleMenu() {
	isMenuOpen = !isMenuOpen;
	menuToggle.classList.toggle('active', isMenuOpen);
	navMenu.classList.toggle('active', isMenuOpen);
	document.body.style.overflow = isMenuOpen ? 'hidden' : '';
}

/**
 * Close mobile menu
 */
function closeMenu() {
	if (isMenuOpen) {
		isMenuOpen = false;
		menuToggle.classList.remove('active');
		navMenu.classList.remove('active');
		document.body.style.overflow = '';
	}
}

/**
 * Custom smooth scroll to element
 */
function CustomScroll(event, id, nodelay = false) {
	if (event && event.preventDefault) {
		event.preventDefault();
	}

	closeMenu();

	setTimeout(
		() => {
			const element = document.getElementById(id);
			if (element) {
				const offset = navbar.offsetHeight;
				const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
				const offsetPosition = elementPosition - offset;

				window.scrollTo({
					top: offsetPosition,
					behavior: 'smooth',
				});
			}
		},
		nodelay ? 0 : 150,
	);
}

/**
 * Initialize navbar scroll behavior
 */
function initializeNavbarScroll() {
	let lastScroll = 0;

	window.addEventListener(
		'scroll',
		() => {
			const currentScroll = window.pageYOffset;

			// Add scrolled class
			if (currentScroll > 50) {
				navbar.classList.add('scrolled');
			} else {
				navbar.classList.remove('scrolled');
			}

			lastScroll = currentScroll;

			// Update scroll to top button
			updateScrollToTopButton();
		},
		{ passive: true },
	);
}

// ============================================
// Scroll to Top Button
// ============================================

/**
 * Update scroll to top button visibility and progress
 */
function updateScrollToTopButton() {
	const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
	const progress = Math.min(scrollTop / scrollHeight, 1);

	// Show/hide button
	if (scrollTop > 300) {
		scrollToTopButton.classList.add('show');
	} else {
		scrollToTopButton.classList.remove('show');
	}

	// Update progress circle
	if (progressCircle) {
		const circumference = 138.23; // 2 * PI * 22 (radius)
		const offset = circumference * (1 - progress);
		progressCircle.style.strokeDashoffset = offset;
	}
}

// ============================================
// Slider Functions
// ============================================

/**
 * Initialize the portfolio slider
 */
function initializeSlider() {
	if (!sliderContainer || totalSlides === 0) return;

	// Create dots
	for (let i = 0; i < totalSlides; i++) {
		const dot = document.createElement('div');
		dot.classList.add('slider-dot');
		if (i === 0) dot.classList.add('active');
		dot.addEventListener('click', () => goToSlide(i));
		sliderDotsContainer.appendChild(dot);
	}

	// Start auto-play
	startSliderAutoPlay();

	// Pause on hover
	sliderContainer.addEventListener('mouseenter', stopSliderAutoPlay);
	sliderContainer.addEventListener('mouseleave', startSliderAutoPlay);

	// Touch support
	let touchStartX = 0;
	let touchEndX = 0;

	sliderContainer.addEventListener(
		'touchstart',
		(e) => {
			touchStartX = e.changedTouches[0].screenX;
		},
		{ passive: true },
	);

	sliderContainer.addEventListener(
		'touchend',
		(e) => {
			touchEndX = e.changedTouches[0].screenX;
			handleSwipe();
		},
		{ passive: true },
	);

	function handleSwipe() {
		const diff = touchStartX - touchEndX;
		if (Math.abs(diff) > 50) {
			if (diff > 0) {
				changeSlide(1);
			} else {
				changeSlide(-1);
			}
		}
	}
}

/**
 * Change slide by direction
 */
function changeSlide(direction) {
	goToSlide(currentSlide + direction);
}

/**
 * Go to specific slide
 */
function goToSlide(index) {
	// Handle wrap-around
	if (index < 0) index = totalSlides - 1;
	if (index >= totalSlides) index = 0;

	// Update slides
	slides.forEach((slide, i) => {
		slide.classList.toggle('active', i === index);
	});

	// Update dots
	const dots = sliderDotsContainer.querySelectorAll('.slider-dot');
	dots.forEach((dot, i) => {
		dot.classList.toggle('active', i === index);
	});

	currentSlide = index;
}

/**
 * Start slider auto-play
 */
function startSliderAutoPlay() {
	stopSliderAutoPlay();
	slideInterval = setInterval(() => {
		changeSlide(1);
	}, 5000);
}

/**
 * Stop slider auto-play
 */
function stopSliderAutoPlay() {
	if (slideInterval) {
		clearInterval(slideInterval);
		slideInterval = null;
	}
}

// ============================================
// Animation Functions
// ============================================

/**
 * Initialize scroll-triggered animations
 */
function initializeScrollAnimations() {
	const animatedElements = document.querySelectorAll('.animate-on-scroll');

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('animated');
					observer.unobserve(entry.target);
				}
			});
		},
		{
			threshold: 0.1,
			rootMargin: '0px 0px -50px 0px',
		},
	);

	animatedElements.forEach((element) => {
		observer.observe(element);
	});
}

// ============================================
// Utility Functions
// ============================================

/**
 * Set the current year in the footer
 */
function initializeYear() {
	const yearElement = document.getElementById('year');
	if (yearElement) {
		const currentYear = new Date().getFullYear();
		yearElement.textContent = currentYear === 2024 ? '2024' : `2024 - ${currentYear}`;
	}
}

/**
 * Log API call for analytics
 */
async function callLogApi() {
	try {
		const params = new URLSearchParams(window.location.search);
		const queryParams = {};
		for (const [key, value] of params.entries()) {
			queryParams[key] = value;
		}

		const payload = {
			uuid: localStorage.getItem('uuid'),
			screenWidth: window.screen.width,
			screenHeight: window.screen.height,
			deviceOrientation: screen.orientation?.type || 'unknown',
			service: SERVICE_DATA.serviceId,
			platform: navigator.platform || 'unknown',
			language: navigator.language || 'unknown',
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			queryParams,
			locationHref: location.href,
		};

		const response = await fetch('https://main-server-u49f.onrender.com/api/v1/ks-solutions/logs', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});

		const uuid = await response.text();
		localStorage.setItem('uuid', uuid);
	} catch (error) {
		// Silently fail for analytics
	}
}

// ============================================
// Keyboard Navigation
// ============================================
document.addEventListener('keydown', (e) => {
	// Close menu on Escape
	if (e.key === 'Escape' && isMenuOpen) {
		closeMenu();
	}

	// Slider keyboard navigation
	if (document.activeElement === sliderContainer || document.activeElement.closest('.portfolio-slider')) {
		if (e.key === 'ArrowLeft') {
			changeSlide(-1);
		} else if (e.key === 'ArrowRight') {
			changeSlide(1);
		}
	}
});

// ============================================
// Performance Optimizations
// ============================================

// Debounce function for scroll events
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

// Preload images for smoother slider experience
function preloadImages() {
	const images = document.querySelectorAll('.slide img');
	images.forEach((img) => {
		if (img.dataset.src) {
			const preloadImg = new Image();
			preloadImg.src = img.dataset.src;
		}
	});
}

// Initialize preloading after page load
window.addEventListener('load', preloadImages);
