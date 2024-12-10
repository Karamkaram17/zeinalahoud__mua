let isNavBarOpened = false;

document.addEventListener('DOMContentLoaded', function () {
	callLogApi();
	setFooter();
	startAnimation();
});

window.addEventListener('scroll', handleScrollToTopButton);

document.getElementById('flipButton').addEventListener('click', function () {
	this.classList.add('clicked');

	// Remove the 'flip' class after the animation ends
	this.addEventListener(
		'animationend',
		() => {
			this.classList.remove('clicked');
		},
		{ once: true },
	);
});

function setFooter() {
	let date = new Date().getFullYear();
	let year = document.getElementById('year');
	year.innerHTML = date === 2024 ? '2024' : `2024 - ${date}`;
}

function handleScrollToTopButton() {
	const scrollToTopButton = document.getElementById('scrollToTopButton');
	const scrollProgress = document.getElementById('scrollProgress');
	const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
	const progress = Math.min(scrollTop / scrollHeight, 1);

	if (scrollTop > 200) {
		scrollToTopButton.classList.add('show');
	} else {
		scrollToTopButton.classList.remove('show');
	}

	scrollProgress.style.transform = `scaleY(${progress})`;
	scrollToTopButton.style.borderRadius = `${50 * (1 - progress)}%`;
}

function openNavbar() {
	isNavBarOpened = true;
}

function CustomScroll(event, id, nodelay) {
	event && event.preventDefault && event.preventDefault();
	const btn = document.getElementById('flipButton');
	if (btn && btn.click && isNavBarOpened) {
		btn.click();
		isNavBarOpened = false;
	}

	setTimeout(
		() => {
			const element = document.getElementById(id);
			let position = element.offsetTop;

			window.scrollTo({ left: 0, top: position, behavior: 'smooth' });
		},
		nodelay ? 0 : 300,
	);
}

function startAnimation() {
	const animatedElements = document.querySelectorAll('.animate__animated');

	// Create an Intersection Observer instance
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					// Add an animation class when the element comes into view
					const classList = entry.target.classList;
					classList.remove('hid');

					if (classList.contains('fadeInUp')) {
						classList.add('animate__fadeInUp');
					} else if (classList.contains('fadeIn')) {
						classList.add('animate__fadeIn');
					} else if (classList.contains('zoomIn')) {
						classList.add('animate__zoomIn');
					} else if (classList.contains('fadeInDown')) {
						classList.add('animate__fadeInDown');
					}

					observer.unobserve(entry.target); // Stop observing after animation
				}
			});
		},
		{ threshold: 0.5 }, // Adjust based on when you want the animation to trigger
	);

	// Observe each animated element
	animatedElements.forEach((element) => {
		observer.observe(element);
	});
}

async function callLogApi() {
	const now = new Date().getTime();
	const lastCall = localStorage.getItem('lastCall');
	if (lastCall) {
		const lastCallNb = Number(lastCall);
		if (now - lastCallNb < 1800000) {
			return;
		}
	}

	try {
		await fetch('https://main-server-u49f.onrender.com/api/v1/ks-solutions/logs', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(sendLogData()),
		});

		localStorage.setItem('lastCall', now.toString());
	} catch (error) {}
}

// Function to send log data to the server
function sendLogData() {
	let uuid = localStorage.getItem('uuid');

	if (!uuid) {
		uuid = generateUUID();
		localStorage.setItem('uuid', uuid);
	}

	return {
		uuid,
		screenWidth: window.screen.width,
		screenHeight: window.screen.height,
		deviceOrientation: screen.orientation.type,
		service: '6758b167f1ce4d064076b895',
	};
}

function generateUUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0,
			v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}
