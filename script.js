// 9. Dark/Light Theme Toggle
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme in localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon();
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        if (body.getAttribute('data-theme') === 'dark') {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
        updateThemeIcon();
    });
}

function updateThemeIcon() {
    if (themeToggleBtn) {
        if (body.getAttribute('data-theme') === 'dark') {
            themeToggleBtn.innerHTML = '☀️'; // Sun for light mode switch
        } else {
            themeToggleBtn.innerHTML = '🌙'; // Moon for dark mode switch
        }
    }
}

// 6. Modal Popup Logic
const bookBtns = document.querySelectorAll('.book-btn');
const modalOverlay = document.getElementById('modal-overlay');
const closeModalBtn = document.getElementById('close-modal');

if (bookBtns.length > 0 && modalOverlay && closeModalBtn) {
    bookBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modalOverlay.classList.add('active');
        });
    });

    closeModalBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
    });

    // Close on clicking outside the modal content
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });
}

// 8. Image Grid with Category Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

if (filterBtns.length > 0 && galleryItems.length > 0) {
    // Initial load: show all items if "all" is active by default
    galleryItems.forEach(item => item.classList.add('show'));

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.add('show');
                } else {
                    item.classList.remove('show');
                }
            });
        });
    });
}

// 4. Collapsible FAQ Section
const faqQuestions = document.querySelectorAll('.faq-question');

if (faqQuestions.length > 0) {
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const answer = faqItem.querySelector('.faq-answer');

            // Toggle active class
            faqItem.classList.toggle('active');

            if (faqItem.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 40 + "px"; // 40px for padding
            } else {
                answer.style.maxHeight = 0;
            }
        });
    });
}

// 5. Live Character Counter for Form
const messageInput = document.getElementById('message');
const charCounter = document.getElementById('char-counter');
const MAX_CHARS = 200;

if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
        const currentLength = messageInput.value.length;
        charCounter.textContent = `${currentLength}/${MAX_CHARS} characters`;

        if (currentLength > MAX_CHARS) {
            charCounter.style.color = 'red';
        } else {
            charCounter.style.color = 'var(--text-light)';
        }
    });
}

// 7. Currency Converter UI (Real-time fetching)
let basePriceUSD = 50; // Example: $50 per hour base price
const currencySelect = document.getElementById('currency-select');
const convertedPriceDisplay = document.getElementById('converted-price');
const turfTypeSelect = document.getElementById('turf-type');

const turfPrices = {
    'football5': 50,
    'football7': 80,
    'cricket': 100
};

if (currencySelect && convertedPriceDisplay) {
    if (turfTypeSelect) {
        turfTypeSelect.addEventListener('change', (e) => {
            basePriceUSD = turfPrices[e.target.value] || 50;
            updateCurrency();
        });
    }
    async function updateCurrency() {
        const targetCurrency = currencySelect.value;
        if (targetCurrency === 'USD') {
            convertedPriceDisplay.textContent = `$${basePriceUSD.toFixed(2)}`;
            return;
        }

        try {
            // Using a free API (exchangerate-api)
            const response = await fetch('https://open.er-api.com/v6/latest/USD');
            const data = await response.json();

            if (data && data.rates && data.rates[targetCurrency]) {
                const rate = data.rates[targetCurrency];
                const convertedPrice = (basePriceUSD * rate).toFixed(2);

                // Get currency symbol (basic implementation)
                let symbol = targetCurrency;
                if (targetCurrency === 'INR') symbol = '₹';
                else if (targetCurrency === 'EUR') symbol = '€';
                else if (targetCurrency === 'GBP') symbol = '£';

                convertedPriceDisplay.textContent = `${symbol}${convertedPrice}`;
            } else {
                convertedPriceDisplay.textContent = "Error fetching rate";
            }
        } catch (error) {
            console.error("Currency fetch error:", error);
            convertedPriceDisplay.textContent = "Error fetching rate";
        }
    }

    currencySelect.addEventListener('change', updateCurrency);
    // Initial call
    updateCurrency();
}

// --- API Integration ---
// Set API Base URL (change to your Render URL when deploying)
const API_BASE_URL = 'https://turfbooking-fqvr.onrender.com';

// 1. Submit Booking Form
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const date = document.getElementById('date').value;
        const turfType = document.getElementById('turf-type').value;
        const currency = document.getElementById('currency-select').value;
        const price = basePriceUSD; // Use the currently set base price

        try {
            const response = await fetch(`${API_BASE_URL}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, date, turfType, price, currency })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Booking Confirmed!');
                bookingForm.reset();
                document.getElementById('modal-overlay').classList.remove('active');
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Booking failed:', error);
            alert('Failed to connect to the server. Is the backend running?');
        }
    });
}

// 2. Submit Contact Form
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const message = document.getElementById('message').value;

        try {
            const response = await fetch(`${API_BASE_URL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Message sent successfully!');
                contactForm.reset();
                if (document.getElementById('char-counter')) {
                    document.getElementById('char-counter').textContent = `0/200 characters`;
                    document.getElementById('char-counter').style.color = 'var(--text-light)';
                }
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Contact failed:', error);
            alert('Failed to connect to the server. Is the backend running?');
        }
    });
}
