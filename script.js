// Track the currently viewed destination for booking reference
let currentDestination = null;

// Helper to get random duration text
function getRandomDuration() {
    const durations = ["2N/3D", "3N/4D", "4N/5D"];
    return durations[Math.floor(Math.random() * durations.length)];
}

// Data for Destinations - Updated Prices to Rupees
const destinations = [
    { id: 1, name: "Goa", country: "India", desc: "Sunny beaches and vibrant nightlife", price: "₹3,500", rating: 4.8, img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop" },
    { id: 2, name: "Paris", country: "France", desc: "City of lights, art, and romance", price: "₹10,000", rating: 4.9, img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop" },
    { id: 3, name: "Bali", country: "Indonesia", desc: "Tropical paradise with lush jungles", price: "₹5,500", rating: 4.7, img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop" },
    { id: 4, name: "Tokyo", country: "Japan", desc: "Neon lights and historic temples", price: "₹8,500", rating: 4.9, img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop" },
    { id: 5, name: "Ooty", country: "India", desc: "Serene hill station in the Nilgiris", price: "₹2,800", rating: 4.6, img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=800&auto=format&fit=crop" },
    { id: 6, name: "New York", country: "USA", desc: "The city that never sleeps", price: "₹12,500", rating: 4.8, img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800&auto=format&fit=crop" },
    { id: 7, name: "Kerala", country: "India", desc: "Peaceful backwaters and nature", price: "₹4,200", rating: 4.9, img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop" },
    { id: 8, name: "Dubai", country: "UAE", desc: "Luxury shopping and modern architecture", price: "₹9,000", rating: 4.7, img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop" },
    { id: 9, name: "Manali", country: "India", desc: "Snow-capped peaks and valleys", price: "₹3,200", rating: 4.5, img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&auto=format&fit=crop" },
    { id: 10, name: "Singapore", country: "Singapore", desc: "Clean, green, and futuristic", price: "₹10,500", rating: 4.8, img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=800&auto=format&fit=crop" },
    { id: 11, name: "Jaipur", country: "India", desc: "The famous Pink City and forts", price: "₹3,800", rating: 4.6, img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop" },
    { id: 12, name: "Leh Ladakh", country: "India", desc: "Breathtaking rugged landscapes", price: "₹5,000", rating: 4.9, img: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=800&auto=format&fit=crop" }
];

// Add random duration to destinations so it stays consistent per load
destinations.forEach(d => {
    d.duration = getRandomDuration();
});

// Data for Packages
const packages = [
    { id: 1, dest: "Bali Getaway", location: "Bali, Indonesia", duration: "7 Days / 6 Nights", price: "₹75,000", rating: 4.9, reviews: 124, img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop", features: ["Flights included", "Luxury Resort", "Daily Breakfast", "Guided Tours"] },
    { id: 2, dest: "European Highlights", location: "France, Italy, Swiss", duration: "14 Days / 13 Nights", price: "₹2,10,000", rating: 4.8, reviews: 89, img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1000&auto=format&fit=crop", features: ["Inter-city Train", "4-Star Hotels", "City Passes", "English Guide"] },
    { id: 3, dest: "Himalayan Expedition", location: "Manali & Leh, India", duration: "10 Days / 9 Nights", price: "₹48,000", rating: 4.7, reviews: 210, img: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1000&auto=format&fit=crop", features: ["4x4 Transport", "Campsites", "Trekking Gear", "All Meals"] },
    { id: 4, dest: "Maldives Honeymoon", location: "Maldives", duration: "5 Days / 4 Nights", price: "₹1,55,000", rating: 5.0, reviews: 56, img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1000&auto=format&fit=crop", features: ["Water Villa", "Seaplane Transfer", "Spa Session", "Candlelight Dinner"] }
];

// Logic to toggle heart icon
function toggleHeart(event, btn) {
    event.stopPropagation();
    const icon = btn.querySelector('i');
    
    if (icon.classList.contains('fa-regular')) {
        icon.classList.remove('fa-regular', 'text-white');
        icon.classList.add('fa-solid', 'text-brand');
    } else {
        icon.classList.remove('fa-solid', 'text-brand');
        icon.classList.add('fa-regular', 'text-white');
    }
}

// Logic to Open Destination Details
function viewDestination(id) {
    const dest = destinations.find(d => d.id === id);
    if (!dest) return;
    
    currentDestination = dest; // Store current selected destination

    // Populate the destination detail view
    document.getElementById('detail-img').src = dest.img;
    document.getElementById('detail-title').textContent = dest.name;
    document.getElementById('detail-location').textContent = dest.country;
    document.getElementById('detail-price').textContent = dest.price;
    document.getElementById('detail-duration-label').textContent = `per trip (${dest.duration})`;
    document.getElementById('detail-box-price').textContent = `${dest.price} (${dest.duration})`;
    document.getElementById('detail-rating').textContent = dest.rating;
    
    // Generate description
    const detailedDesc = `${dest.desc}. This stunning location provides the perfect balance of adventure and relaxation for your ${dest.duration} stay. Immerse yourself in the local culture, enjoy world-class amenities, and make memories that will last a lifetime. Highly rated by travelers from around the globe.`;
    document.getElementById('detail-desc').textContent = detailedDesc;

    // Clear previous reservation date entries
    document.getElementById('detail-checkin').value = "";
    document.getElementById('detail-checkout').value = "";
    document.getElementById('detail-guests').value = "1";

    // Navigate to the view
    navigateTo('destination-detail');
}

// Validate and initiate booking from the Destination Detail page
function initiateBooking() {
    if (!currentDestination) {
        navigateTo('booking');
        return;
    }

    const checkin = document.getElementById('detail-checkin').value;
    const checkout = document.getElementById('detail-checkout').value;
    const guests = document.getElementById('detail-guests').value;

    // Quick validation for dates
    if (!checkin || !checkout) {
        alert("Please select both a Check-in and Check-out date before reserving.");
        return;
    }

    if (new Date(checkout) <= new Date(checkin)) {
        alert("Check-out date must be after Check-in date.");
        return;
    }

    // Populate the Booking Form
    const destSelect = document.getElementById('booking-destination');
    
    // Check if option exists in select, if not, create it
    let optionExists = Array.from(destSelect.options).some(opt => opt.value === currentDestination.name);
    if (!optionExists) {
        const newOption = new Option(`${currentDestination.name}, ${currentDestination.country}`, currentDestination.name);
        destSelect.add(newOption);
    }
    
    destSelect.value = currentDestination.name;
    document.getElementById('booking-date').value = checkin;
    document.getElementById('booking-travelers').value = guests;

    // Finally, go to the booking view
    navigateTo('booking');
}

// Logic for Home Page Search Bar
function handleHomeSearch() {
    const searchInput = document.getElementById('search-location').value.toLowerCase().trim();
    
    if (!searchInput) {
        // If empty, just go to destinations page
        navigateTo('destinations');
        return;
    }

    // Find matching destination
    const match = destinations.find(d => 
        d.name.toLowerCase().includes(searchInput) || 
        d.country.toLowerCase().includes(searchInput) ||
        `${d.name}, ${d.country}`.toLowerCase() === searchInput
    );

    if (match) {
        viewDestination(match.id);
    } else {
        // Not found fallback
        alert(`No precise match found for "${searchInput}". Try exploring our top destinations!`);
        navigateTo('destinations');
    }
}

// Utility: Generate Destination Card HTML
function generateDestinationCard(dest) {
    return `
        <div class="group cursor-pointer flex flex-col h-full fade-in-up" onclick="viewDestination(${dest.id})">
            <div class="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-xl mb-3">
                <img src="${dest.img}" alt="${dest.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out">
                <button onclick="toggleHeart(event, this)" class="absolute top-3 right-3 text-white hover:text-brand transition-colors p-1.5 z-10 drop-shadow-md rounded-full bg-black/10 hover:bg-white/20">
                    <i class="fa-regular fa-heart text-xl transition-all duration-300"></i>
                </button>
            </div>
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="font-bold text-dark text-lg leading-tight">${dest.name}, ${dest.country}</h3>
                    <p class="text-gray-500 text-sm mt-1 truncate w-48">${dest.desc}</p>
                </div>
                <div class="flex items-center text-sm font-medium">
                    <i class="fa-solid fa-star text-sm text-brand mr-1"></i> ${dest.rating}
                </div>
            </div>
            <div class="mt-2 text-dark font-medium">
                <span class="font-bold">${dest.price}</span> <span class="text-gray-500 font-normal ml-1">(${dest.duration})</span>
            </div>
        </div>
    `;
}

// Utility: Generate Package Card HTML
function generatePackageCard(pkg) {
    const featuresHtml = pkg.features.map(f => `<div class="flex items-center text-sm text-gray-600"><i class="fa-solid fa-check text-green-500 mr-2"></i> ${f}</div>`).join('');
    return `
        <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row fade-in-up">
            <div class="w-full md:w-2/5 h-64 md:h-auto relative overflow-hidden group">
                <img src="${pkg.img}" alt="${pkg.dest}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                <div class="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    <i class="fa-regular fa-clock text-brand mr-1"></i> ${pkg.duration}
                </div>
            </div>
            <div class="p-6 md:p-8 w-full md:w-3/5 flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <p class="text-sm text-brand font-bold uppercase tracking-wide mb-1">${pkg.location}</p>
                            <h3 class="text-2xl font-bold text-dark mb-2">${pkg.dest}</h3>
                        </div>
                        <div class="bg-brand/10 text-brand px-2 py-1 rounded flex items-center font-bold">
                            <i class="fa-solid fa-star text-xs mr-1"></i> ${pkg.rating}
                        </div>
                    </div>
                    <p class="text-sm text-gray-500 mb-6">(${pkg.reviews} verified reviews)</p>
                    
                    <div class="grid grid-cols-2 gap-y-3 gap-x-4 mb-6">
                        ${featuresHtml}
                    </div>
                </div>
                
                <div class="border-t border-gray-100 pt-6 flex justify-between items-center mt-auto">
                    <div>
                        <p class="text-sm text-gray-500">Starting from</p>
                        <p class="text-2xl font-bold text-dark">${pkg.price}</p>
                    </div>
                    <button onclick="navigateTo('booking')" class="bg-dark hover:bg-black text-white px-6 py-3 rounded-lg font-medium transition-colors">
                        Book Package
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Initialize Data rendering
function initData() {
    // Populate Home Search Datalist
    const datalist = document.getElementById('locations-datalist');
    if (datalist) {
        datalist.innerHTML = destinations.map(d => `<option value="${d.name}, ${d.country}">`).join('');
    }

    // Render Home Featured Destinations (first 8)
    const homeGrid = document.getElementById('home-destinations-grid');
    if(homeGrid) homeGrid.innerHTML = destinations.slice(0, 8).map(generateDestinationCard).join('');

    // Render All Destinations Grid
    const allGrid = document.getElementById('all-destinations-grid');
    if(allGrid) allGrid.innerHTML = destinations.map(generateDestinationCard).join('');

    // Render Packages
    const pkgsList = document.getElementById('packages-list');
    if(pkgsList) pkgsList.innerHTML = packages.map(generatePackageCard).join('');
    
    // Re-initialize intersection observers for newly added elements
    setupScrollAnimations();
}

// SPA Navigation Logic
function navigateTo(pageId, extraParam = null) {
    // Hide all sections
    const sections = document.querySelectorAll('.view-section');
    sections.forEach(sec => {
        sec.classList.remove('active');
        sec.style.display = 'none';
    });

    // Show target section
    const target = document.getElementById(pageId + '-view');
    if (target) {
        target.style.display = 'block';
        // Small delay to allow display block to apply before opacity transition
        setTimeout(() => target.classList.add('active'), 50);
    }

    // Update Navbar Active State (Desktop)
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.classList.remove('text-dark', 'font-bold');
        link.classList.add('text-gray-500', 'font-medium');
        // Use data-target to match the current page
        if (link.getAttribute('data-target') === pageId) {
            link.classList.remove('text-gray-500', 'font-medium');
            link.classList.add('text-dark', 'font-bold');
        }
    });

    // Handle special auth logic (switch mode based on Login or Signup button)
    if (pageId === 'auth' && extraParam) {
        switchAuthMode(extraParam);
    }

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Trigger animation for the new page
    setTimeout(setupScrollAnimations, 100);
}

// Auth Form Toggle Logic
function switchAuthMode(mode) {
    const btnLogin = document.getElementById('btn-login');
    const btnSignup = document.getElementById('btn-signup');
    const formLogin = document.getElementById('form-login');
    const formSignup = document.getElementById('form-signup');
    const title = document.getElementById('auth-title');
    const subtitle = document.getElementById('auth-subtitle');

    if (mode === 'login') {
        btnLogin.className = 'w-1/2 py-2.5 text-sm font-bold rounded-lg bg-white shadow-sm text-dark transition-all duration-300';
        btnSignup.className = 'w-1/2 py-2.5 text-sm font-bold rounded-lg text-gray-500 hover:text-dark transition-all duration-300';
        formLogin.classList.remove('hidden');
        formSignup.classList.add('hidden');
        title.textContent = 'Welcome Back';
        subtitle.textContent = 'Log in to continue your adventure.';
    } else if (mode === 'signup') {
        btnSignup.className = 'w-1/2 py-2.5 text-sm font-bold rounded-lg bg-white shadow-sm text-dark transition-all duration-300';
        btnLogin.className = 'w-1/2 py-2.5 text-sm font-bold rounded-lg text-gray-500 hover:text-dark transition-all duration-300';
        formSignup.classList.remove('hidden');
        formLogin.classList.add('hidden');
        title.textContent = 'Join TravelStay';
        subtitle.textContent = 'Create an account to start exploring.';
    }
}

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', toggleMobileMenu);

function toggleMobileMenu() {
    mobileMenu.classList.toggle('hidden');
    const icon = mobileMenuBtn.querySelector('i');
    if(mobileMenu.classList.contains('hidden')) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    } else {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
    }
}

// Booking Form Handling
function handleBooking(e) {
    e.preventDefault();
    document.getElementById('booking-form').classList.add('hidden');
    document.getElementById('booking-success').classList.remove('hidden');
}

function resetBooking() {
    document.getElementById('booking-form').reset();
    document.getElementById('booking-form').classList.remove('hidden');
    document.getElementById('booking-success').classList.add('hidden');
}

// Scroll Animations (Intersection Observer)
function setupScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => observer.observe(el));
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 20) {
        nav.classList.add('shadow-sm');
    } else {
        nav.classList.remove('shadow-sm');
    }
});

// Add event listener to search input to capture "Enter" key press
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-location');
    if(searchInput) {
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleHomeSearch();
            }
        });
    }
    initData();
    navigateTo('home');
});
