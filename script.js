// Track the currently viewed destination for booking reference
let currentDestination = null;
let currentUser = null;

// Initialize user session on page load
function initializeUserSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateNavbarForLoggedInUser();
    }
}

// Helper to get random duration text
function getRandomDuration() {
    const durations = ["2N/3D", "3N/4D", "4N/5D"];
    return durations[Math.floor(Math.random() * durations.length)];
}

// Data for Destinations - Updated Prices to Rupees
const destinations = [
    { id: 1, name: "Goa", country: "India", region: "Asia", desc: "Sunny beaches and vibrant nightlife", price: "₹3,500", rating: 4.8, img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop" },
    { id: 2, name: "Paris", country: "France", region: "Europe", desc: "City of lights, art, and romance", price: "₹10,000", rating: 4.9, img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop" },
    { id: 3, name: "Bali", country: "Indonesia", region: "Asia", desc: "Tropical paradise with lush jungles", price: "₹5,500", rating: 4.7, img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop" },
    { id: 4, name: "Tokyo", country: "Japan", region: "Asia", desc: "Neon lights and historic temples", price: "₹8,500", rating: 4.9, img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop" },
    { id: 5, name: "Ooty", country: "India", region: "Asia", desc: "Serene hill station in the Nilgiris", price: "₹2,800", rating: 4.6, img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop" },
    { id: 6, name: "New York", country: "USA", region: "North America", desc: "The city that never sleeps", price: "₹12,500", rating: 4.8, img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800&auto=format&fit=crop" },
    { id: 7, name: "Kerala", country: "India", region: "Asia", desc: "Peaceful backwaters and nature", price: "₹4,200", rating: 4.9, img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop" },
    { id: 8, name: "Dubai", country: "UAE", region: "Asia", desc: "Luxury shopping and modern architecture", price: "₹9,000", rating: 4.7, img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop" },
    { id: 9, name: "Manali", country: "India", region: "Asia", desc: "Snow-capped peaks and valleys", price: "₹3,200", rating: 4.5, img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&auto=format&fit=crop" },
    { id: 10, name: "Singapore", country: "Singapore", region: "Asia", desc: "Clean, green, and futuristic", price: "₹10,500", rating: 4.8, img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=800&auto=format&fit=crop" },
    { id: 11, name: "Jaipur", country: "India", region: "Asia", desc: "The famous Pink City and forts", price: "₹3,800", rating: 4.6, img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop" },
    { id: 12, name: "Leh Ladakh", country: "India", region: "Asia", desc: "Breathtaking rugged landscapes", price: "₹5,000", rating: 4.9, img: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=800&auto=format&fit=crop" }
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

// Initiate booking from Packages section
function initiatePackageBooking(destName) {
    const destSelect = document.getElementById('booking-destination');
    
    // Check if option exists in select, if not, create it
    let optionExists = Array.from(destSelect.options).some(opt => opt.value === destName);
    if (!optionExists) {
        const newOption = new Option(destName, destName);
        destSelect.add(newOption);
    }
    
    destSelect.value = destName;
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

// Logic for Explore Page Search Bar
let currentRegionFilter = 'All Regions';

function handleExploreSearch() {
    const searchInput = document.getElementById('explore-search-location').value.toLowerCase().trim();
    showExploreSearchSuggestions(searchInput, currentRegionFilter);
    filterAndDisplayDestinations(searchInput, currentRegionFilter);
}

// Show search suggestions in permanent grid
function showExploreSearchSuggestions(searchInput, region) {
    let filtered = destinations;

    // Filter by region if not "All Regions"
    if (region !== 'All Regions') {
        filtered = filtered.filter(d => d.region === region);
    }

    // Filter by search term
    if (searchInput) {
        filtered = filtered.filter(d => 
            d.name.toLowerCase().includes(searchInput) || 
            d.country.toLowerCase().includes(searchInput) ||
            d.desc.toLowerCase().includes(searchInput)
        );
    }

    const placesGrid = document.getElementById('places-grid');
    if (!placesGrid) return;

    if (filtered.length > 0) {
        const suggestionsList = filtered.map(dest => `
            <button type="button" onclick="viewDestination(${dest.id});" class="p-3 bg-gray-50 border border-gray-200 hover:border-brand hover:bg-brand/5 rounded-lg transition text-left">
                <img src="${dest.img}" alt="${dest.name}" class="w-full aspect-square rounded object-cover mb-2">
                <p class="font-medium text-gray-900 text-sm truncate">${dest.name}</p>
                <p class="text-xs text-gray-500 truncate">${dest.country}</p>
                <p class="text-xs font-semibold text-brand mt-1">${dest.price}</p>
            </button>
        `).join('');
        
        placesGrid.innerHTML = suggestionsList;
    } else if (searchInput) {
        placesGrid.innerHTML = '<div class="col-span-full text-center py-8 text-gray-500">No places found matching "' + searchInput + '"</div>';
    } else {
        placesGrid.innerHTML = '';
    }
}

function filterByRegion(region) {
    currentRegionFilter = region;
    const searchInput = document.getElementById('explore-search-location').value.toLowerCase().trim();
    filterAndDisplayDestinations(searchInput, region);
    
    // Show place suggestions for the selected region
    showRegionPlaceSuggestions(region);
    
    // Update button styles
    const regionButtons = document.querySelectorAll('.region-filter-btn');
    regionButtons.forEach(btn => {
        if (btn.getAttribute('data-region') === region) {
            btn.classList.remove('text-gray-600', 'border-gray-200');
            btn.classList.add('bg-gray-900', 'text-white', 'border-gray-900');
        } else {
            btn.classList.remove('bg-gray-900', 'text-white', 'border-gray-900');
            btn.classList.add('text-gray-600', 'border-gray-200');
        }
    });
}

function showRegionPlaceSuggestions(region) {
    // This function is no longer needed but kept for compatibility
    // Places are now shown in the permanent grid below
    // Just update the grid when region changes
    showExploreSearchSuggestions('', region);
}

function filterAndDisplayDestinations(searchInput, region) {
    let filtered = destinations;

    // Filter by search term
    if (searchInput) {
        filtered = filtered.filter(d => 
            d.name.toLowerCase().includes(searchInput) || 
            d.country.toLowerCase().includes(searchInput) ||
            d.desc.toLowerCase().includes(searchInput)
        );
    }

    // Filter by region
    if (region !== 'All Regions') {
        filtered = filtered.filter(d => d.region === region);
    }

    // Update the grid with filtered results
    const allGrid = document.getElementById('all-destinations-grid');
    if (filtered.length > 0) {
        allGrid.innerHTML = filtered.map(generateDestinationCard).join('');
    } else {
        const message = searchInput && region !== 'All Regions' 
            ? `No destinations found in ${region} matching "${searchInput}".`
            : searchInput
            ? `No destinations found matching "${searchInput}".`
            : `No destinations found in ${region}.`;
        allGrid.innerHTML = '<div class="col-span-full text-center py-12"><p class="text-gray-500 text-lg">' + message + '</p></div>';
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
                    <button onclick="initiatePackageBooking('${pkg.dest}')" class="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-lg font-medium transition-colors">
                        Book Now
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

    // Populate Explore Search Datalist
    const exploreDatalist = document.getElementById('explore-locations-datalist');
    if (exploreDatalist) {
        exploreDatalist.innerHTML = destinations.map(d => `<option value="${d.name}, ${d.country}">`).join('');
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

    // Load profile data if navigating to profile page
    if (pageId === 'profile') {
        loadProfile();
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

// Login Handler
function handleLogin(e) {
    e.preventDefault();
    const form = document.getElementById('form-login');
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Check if user exists
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const user = allUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateNavbarForLoggedInUser();
        
        // Send login confirmation email
        sendEmail(user.email, user.name, 'Login Successful', `Welcome back, ${user.name}! You successfully logged in to HPY Moments.`);
        
        alert('Logged in successfully!');
        navigateTo('home');
    } else {
        alert('Invalid email or password');
    }
}

// Signup Handler
function handleSignup(e) {
    e.preventDefault();
    const form = document.getElementById('form-signup');
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    
    if (!name || !email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Check if user already exists
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    if (allUsers.find(u => u.email === email)) {
        alert('Email already registered');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        joinedDate: new Date().toLocaleDateString(),
        bookings: []
    };
    
    allUsers.push(newUser);
    localStorage.setItem('allUsers', JSON.stringify(allUsers));
    
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    updateNavbarForLoggedInUser();
    
    // Send signup confirmation email
    sendEmail(email, name, 'Welcome to HPY Moments', `Hello ${name},\n\nThank you for signing up! Your account has been created successfully. Start exploring amazing destinations now!`);
    
    alert('Account created successfully!');
    navigateTo('home');
}

// Logout Handler
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        location.reload();
    }
}

// Update Navbar for Logged In User
function updateNavbarForLoggedInUser() {
    const authButtons = document.getElementById('auth-buttons');
    const profileButtons = document.getElementById('profile-buttons');
    const mobileAuthButtons = document.getElementById('mobile-auth-buttons');
    const mobileProfileButtons = document.getElementById('mobile-profile-buttons');
    
    if (currentUser) {
        if(authButtons) authButtons.classList.add('hidden');
        if(profileButtons) profileButtons.classList.remove('hidden');
        const deskName = document.getElementById('user-name-nav');
        if(deskName) deskName.textContent = currentUser.name;
        
        if(mobileAuthButtons) {
            mobileAuthButtons.classList.add('hidden');
            mobileAuthButtons.classList.remove('flex');
        }
        
        if(mobileProfileButtons) {
            mobileProfileButtons.classList.remove('hidden');
            mobileProfileButtons.classList.add('flex');
        }
        const mobName = document.getElementById('mobile-user-name-nav');
        if(mobName) mobName.textContent = currentUser.name;
    } else {
        if(authButtons) authButtons.classList.remove('hidden');
        if(profileButtons) profileButtons.classList.add('hidden');
        
        if(mobileAuthButtons) {
            mobileAuthButtons.classList.remove('hidden');
            mobileAuthButtons.classList.add('flex');
        }
        if(mobileProfileButtons) {
            mobileProfileButtons.classList.add('hidden');
            mobileProfileButtons.classList.remove('flex');
        }
    }
}

// Load Profile
function loadProfile() {
    if (!currentUser) {
        alert('Please login first');
        navigateTo('auth', 'login');
        return;
    }
    
    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-email').textContent = currentUser.email;
    document.getElementById('profile-full-name').textContent = currentUser.name;
    document.getElementById('profile-account-email').textContent = currentUser.email;
    document.getElementById('profile-joined').textContent = currentUser.joinedDate;
    
    // Display bookings
    const bookingsContainer = document.getElementById('profile-all-bookings');
    if (currentUser.bookings && currentUser.bookings.length > 0) {
        bookingsContainer.innerHTML = currentUser.bookings.map(booking => `
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 class="font-bold text-lg text-dark">${booking.destination}</h4>
                <p class="text-gray-600 text-sm">Check-in: ${booking.checkInDate}</p>
                <p class="text-gray-600 text-sm">Travelers: ${booking.travelers}</p>
                <p class="text-brand font-semibold">Transport: ${booking.transport}</p>
                <p class="text-gray-700 mt-2"><strong>Booked by:</strong> ${booking.name}</p>
            </div>
        `).join('');
    } else {
        bookingsContainer.innerHTML = '<p class="text-gray-500">No bookings found</p>';
    }
}

// Send Email Function
function sendEmail(toEmail, userName, subject, message) {
    const emailData = {
        email: toEmail,
        subject: subject,
        message: `${message}\n\n---\nUser: ${userName}\nEmail: ${toEmail}\n\nThis is an automated email from HPY Moments Travel Website.`
    };
    
    console.log('📧 Sending email to:', toEmail);
    console.log('Email subject:', subject);
    
    // Use form-encoded data (FormSubmit.co requirement)
    const formData = new FormData();
    formData.append('email', toEmail);
    formData.append('subject', subject);
    formData.append('message', emailData.message);
    formData.append('user_name', userName);
    
    fetch('https://formsubmit.co/aakash121767@gmail.com', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('✅ Email response status:', response.status);
        if (response.ok) {
            console.log('✅ Email sent successfully to', toEmail);
            alert('✅ Email sent successfully!');
        } else {
            console.warn('⚠️ Email API returned status:', response.status);
        }
        return response.text();
    })
    .then(text => {
        console.log('📧 API Response:', text);
    })
    .catch(err => {
        console.error('❌ Email sending error:', err);
        console.log('Email data that was attempted:', emailData);
        alert('⚠️ Email service error - please check console for details');
    });
}

// Send Email to Admin (Your Email Address)
function sendEmailToAdmin(adminEmail, userName, subject, message, bookingData) {
    console.log('📧 Sending booking confirmation to admin...');
    console.log('To: aakash121767@gmail.com');
    console.log('Subject:', subject);
    console.log('Booking ID:', bookingData.id);
    
    // Use form-encoded data (FormSubmit.co requirement)
    const formData = new FormData();
    formData.append('email', userName);
    formData.append('user_email', bookingData.email);
    formData.append('user_name', userName);
    formData.append('subject', subject);
    formData.append('booking_information', message);
    formData.append('booking_id', bookingData.id);
    formData.append('destination', bookingData.destination);
    formData.append('travelers', bookingData.travelers);
    formData.append('transport', bookingData.transport);
    formData.append('checkin_date', bookingData.checkInDate);
    
    // Send to admin email
    fetch('https://formsubmit.co/aakash121767@gmail.com', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('📨 FormSubmit response status:', response.status);
        if (response.ok) {
            console.log('✅ BOOKING EMAIL SENT SUCCESSFULLY!');
            console.log('   To: aakash121767@gmail.com');
            console.log('   Booking ID:', bookingData.id);
            console.log('   Destination:', bookingData.destination);
            alert('✅ Booking confirmed! Confirmation email has been sent to aakash121767@gmail.com');
        } else {
            console.warn('⚠️ FormSubmit returned status:', response.status);
            alert('⚠️ Email service returned: ' + response.status);
        }
        return response.text();
    })
    .then(text => {
        console.log('📧 Full API Response:', text);
    })
    .catch(err => {
        console.error('❌ BOOKING EMAIL FAILED:', err);
        console.log('Booking data (saved locally):', bookingData);
        console.log('Message that was attempted to send:', message);
        alert('⚠️ Email service unavailable - booking saved but email may not have been sent');
    });
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
    
    if (!currentUser) {
        alert('Please login first to complete booking');
        navigateTo('auth', 'login');
        return;
    }
    
    const form = document.getElementById('booking-form');
    const fullName = form.querySelector('input[name="fullName"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();
    const phone = form.querySelector('input[name="phone"]').value.trim();
    const destination = form.querySelector('select[name="destination"]').value.trim();
    const checkInDate = form.querySelector('input[name="checkInDate"]').value.trim();
    const travelers = form.querySelector('input[name="travelers"]').value.trim();
    const transportMode = form.querySelector('select[name="transport"]').value.trim();
    
    // Validate all fields
    if (!fullName || !email || !phone || !destination || !checkInDate || !travelers || !transportMode) {
        showErrorNotification('❌ Please fill in all booking details');
        return;
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
        showErrorNotification('❌ Please enter a valid email address');
        return;
    }
    
    // Validate phone format
    if (!isValidIndianPhone(phone)) {
        showErrorNotification('❌ Please enter a valid 10-digit phone number');
        return;
    }
    
    // Calculate Amount
    let amount = 0;
    let match = destinations.find(d => d.name === destination);
    if (!match) {
        match = packages.find(p => p.dest === destination);
    }
    if (match) {
        amount = parseInt(match.price.replace('₹', '').replace(/,/g, ''));
    } else {
        amount = 5000; // default fallback amount
    }
    amount = amount * parseInt(travelers);
    
    // Store booking data for payment processing
    window.bookingData = {
        name: fullName,
        email: email,
        phone: phone,
        travelers: travelers,
        packageName: destination,
        amount: amount,
        transport: transportMode,
        checkInDate: checkInDate,
        timestamp: new Date().toLocaleDateString('en-IN')
    };
    
    // Populate payment page with booking summary
    document.getElementById('pay-package-name').textContent = destination;
    document.getElementById('pay-passenger-name').textContent = fullName;
    document.getElementById('pay-travelers').textContent = travelers;
    document.getElementById('pay-total-amount').textContent = '₹' + amount.toLocaleString('en-IN');
    
    // Navigate to payment view
    navigateTo('payment');
}

/**
 * Updates the total booking price based on selected destination and travelers
 * This function is called when destination or travelers change
 */
function updateBookingPrice() {
    const destination = document.getElementById('booking-destination').value;
    const travelers = parseInt(document.getElementById('booking-travelers').value) || 1;
    
    if (!destination) {
        document.getElementById('booking-total-price').textContent = '₹0';
        document.getElementById('booking-price-breakdown').textContent = 'Select a destination';
        return;
    }
    
    // Find destination or package
    let match = destinations.find(d => d.name === destination);
    if (!match) {
        match = packages.find(p => p.dest === destination);
    }
    
    if (match) {
        const basePrice = parseInt(match.price.replace('₹', '').replace(/,/g, ''));
        const totalPrice = basePrice * travelers;
        
        document.getElementById('booking-total-price').textContent = '₹' + totalPrice.toLocaleString('en-IN');
        document.getElementById('booking-price-breakdown').textContent = `₹${basePrice.toLocaleString()} × ${travelers} traveler${travelers > 1 ? 's' : ''}`;
    }
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
    // ===== BOOKING FORM LISTENERS =====
    // Update price when destination changes
    const destSelect = document.getElementById('booking-destination');
    if (destSelect) {
        destSelect.addEventListener('change', updateBookingPrice);
    }
    
    // Update price when travelers changes
    const travelersInput = document.getElementById('booking-travelers');
    if (travelersInput) {
        travelersInput.addEventListener('change', updateBookingPrice);
        travelersInput.addEventListener('input', updateBookingPrice);
    }
    
    // ===== HOME SEARCH LISTENERS =====
    const searchInput = document.getElementById('search-location');
    if(searchInput) {
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleHomeSearch();
            }
        });
    }
    
    // ===== EXPLORE SEARCH LISTENERS =====
    const exploreSearchInput = document.getElementById('explore-search-location');
    if(exploreSearchInput) {
        // Show all places initially
        showExploreSearchSuggestions('', currentRegionFilter);
        
        // Trigger on input for real-time filtering
        exploreSearchInput.addEventListener('input', function (e) {
            handleExploreSearch();
        });
        
        // Trigger when datalist option is selected
        exploreSearchInput.addEventListener('change', function (e) {
            const selectedValue = this.value.trim();
            if (selectedValue) {
                // Find matching destination by name or "Name, Country" format
                const match = destinations.find(d => 
                    selectedValue.includes(d.name) && selectedValue.includes(d.country)
                );
                if (match) {
                    viewDestination(match.id);
                    this.value = ''; // Clear search after selection
                    showExploreSearchSuggestions('', currentRegionFilter);
                }
            }
        });
        
        // Also trigger on Enter key
        exploreSearchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleExploreSearch();
            }
        });
    }
    
    // ===== REGION FILTER LISTENERS =====
    const regionButtons = document.querySelectorAll('.region-filter-btn');
    regionButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const region = this.getAttribute('data-region');
            // Clear search input when clicking region
            const searchInput = document.getElementById('explore-search-location');
            if (searchInput) {
                searchInput.value = '';
            }
            filterByRegion(region);
            // Refresh the permanent places grid
            showExploreSearchSuggestions('', region);
        });
    });
    
    // ===== INITIALIZE EVERYTHING =====
    initializeUserSession();
    updateNavbarForLoggedInUser();
    initData();
    navigateTo('home');
});

// ==========================================
// PAYMENT SYSTEM FUNCTIONS (Razorpay)
// ==========================================

/**
 * Opens the booking modal and populates it with package details
 * @param {string} packageName - Name of the selected package
 * @param {string} price - Price of the package (formatted string like "₹75,000")
 * @param {number} packageId - ID of the package
 */
function openBookingModal(packageName, price, packageId) {
    // Store current package for later use
    window.currentPackage = {
        name: packageName,
        price: price.replace('₹', '').replace(/,/g, ''), // Extract numeric value
        id: packageId
    };
    
    // Populate modal with package information
    document.getElementById('modal-package-name').textContent = packageName;
    document.getElementById('modal-package-price').textContent = price;
    document.getElementById('booking-travelers').value = 1; // Reset to 1
    
    // Update total price on load
    updateTotalPrice();
    
    // Show the modal
    document.getElementById('booking-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
}

/**
 * Closes the booking modal
 */
function closeBookingModal() {
    document.getElementById('booking-modal').classList.add('hidden');
    document.body.style.overflow = 'auto'; // Restore scroll
    // Reset form
    const form = document.getElementById('payment-booking-form');
    if (form) form.reset();
}

/**
 * Updates the total price based on number of travelers
 */
function updateTotalPrice() {
    const travelers = parseInt(document.getElementById('booking-travelers').value) || 1;
    const basePrice = parseInt(window.currentPackage.price);
    const totalPrice = basePrice * travelers;
    
    document.getElementById('modal-total-price').textContent = '₹' + totalPrice.toLocaleString();
    window.currentPackage.totalPrice = totalPrice;
}

/**
 * Handles the booking form submission
 * Validates form data and navigates to payment page
 */
function handlePaymentBooking(e) {
    e.preventDefault();
    
    // Check if user is logged in
    if (!currentUser) {
        alert('Please login first to proceed with booking');
        closeBookingModal();
        navigateTo('auth', 'login');
        return;
    }
    
    // Get form values
    const name = document.getElementById('booking-name').value.trim();
    const email = document.getElementById('booking-email').value.trim();
    const phone = document.getElementById('booking-phone').value.trim();
    const travelers = document.getElementById('booking-travelers').value.trim();
    const termsAccepted = document.getElementById('terms-checkbox').checked;
    
    // Validate form
    if (!name || !email || !phone || !travelers) {
        alert('Please fill in all fields');
        return;
    }
    
    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
        alert('Please enter a valid 10-digit phone number');
        return;
    }
    
    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Check terms acceptance
    if (!termsAccepted) {
        alert('Please accept the terms and conditions');
        return;
    }
    
    // Store booking details globally for payment processing
    window.bookingData = {
        name: name,
        email: email,
        phone: phone,
        travelers: travelers,
        packageName: window.currentPackage.name,
        amount: window.currentPackage.totalPrice,
        timestamp: new Date()
    };
    
    // Close modal and show payment page
    closeBookingModal();
    
    // Populate payment page with booking summary
    document.getElementById('pay-package-name').textContent = window.bookingData.packageName;
    document.getElementById('pay-passenger-name').textContent = window.bookingData.name;
    document.getElementById('pay-travelers').textContent = window.bookingData.travelers;
    document.getElementById('pay-total-amount').textContent = '₹' + window.bookingData.amount.toLocaleString();
    
    // Navigate to payment view
    navigateTo('payment');
}

/**
 * Initiates Fake Payment Process
 * Simulates a payment request with loading state and realistic delay
 * @param {Event} event - The form submit event
 */
function initiateRazorpayPayment(event) {
    // Prevent form default submission
    if (event) event.preventDefault();
    
    // Validate booking data exists
    if (!window.bookingData || !window.bookingData.amount) {
        alert('❌ Booking details are missing. Please go back and try again.');
        return;
    }
    
    // Get the button element
    const payButton = document.querySelector('button[onclick="initiateRazorpayPayment(event)"]') 
                      || event.target.closest('button')
                      || event.target;
    
    if (!payButton) {
        console.warn('⚠️ Could not find pay button element');
        return;
    }
    
    // Store original button content
    const originalHTML = payButton.innerHTML;
    const originalDisabledState = payButton.disabled;
    
    // Change button to loading state
    payButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Processing Payment...';
    payButton.disabled = true;
    
    // Simulate payment processing for 2.5 seconds
    setTimeout(() => {
        // Generate fake payment ID (realistic format)
        const fakePaymentId = 'pay_mock_' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        // Create mock Razorpay response
        const mockResponse = {
            razorpay_payment_id: fakePaymentId,
            razorpay_order_id: 'order_' + Date.now(),
            razorpay_signature: 'mock_signature_' + Math.random().toString(36).substr(2, 5)
        };
        
        console.log('✅ Fake payment processed:', mockResponse);
        
        // Reset button to original state
        payButton.innerHTML = originalHTML;
        payButton.disabled = originalDisabledState;
        
        // Handle the successful payment
        handleRazorpaySuccess(mockResponse);
        
    }, 2500); // 2.5 second delay to simulate network request
}

/**
 * Handles successful Razorpay payment
 * Generates booking ID, saves data to localStorage, sends confirmation email
 * @param {object} response - Razorpay payment response containing transaction details
 */
function handleRazorpaySuccess(response) {
    // Generate unique booking ID
    const bookingId = 'BK' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Create complete booking record
    const bookingRecord = {
        bookingId: bookingId,
        packageName: window.bookingData.packageName,
        destination: window.bookingData.packageName,
        name: window.bookingData.name,
        email: window.bookingData.email,
        phone: window.bookingData.phone,
        travelers: window.bookingData.travelers,
        amount: window.bookingData.amount,
        transport: window.bookingData.transport || 'flight',
        checkInDate: window.bookingData.checkInDate || new Date().toLocaleDateString(),
        paymentId: response.razorpay_payment_id,
        paymentSignature: response.razorpay_signature,
        paymentStatus: 'completed',
        bookingDate: new Date().toLocaleDateString('en-IN'),
        bookingTime: new Date().toLocaleTimeString('en-IN')
    };
    
    // Save booking to localStorage
    const allBookings = JSON.parse(localStorage.getItem('allBookings') || '[]');
    allBookings.push(bookingRecord);
    localStorage.setItem('allBookings', JSON.stringify(allBookings));
    
    // Save to current user's bookings
    if (currentUser) {
        currentUser.bookings = currentUser.bookings || [];
        currentUser.bookings.push(bookingRecord);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update in allUsers list
        const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
        const userIndex = allUsers.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            allUsers[userIndex] = currentUser;
            localStorage.setItem('allUsers', JSON.stringify(allUsers));
        }
    }
    
    // Send payment confirmation email to user
    const confirmationMessage = `
Congratulations! Your booking is confirmed.

=== BOOKING CONFIRMATION ===
Booking ID: ${bookingId}
Package: ${bookingRecord.packageName}
Travelers: ${bookingRecord.travelers}
Total Amount: ₹${bookingRecord.amount}
Payment ID: ${response.razorpay_payment_id}
Status: Payment Successful

=== TRAVELER DETAILS ===
Name: ${bookingRecord.name}
Email: ${bookingRecord.email}
Phone: ${bookingRecord.phone}

Booking Date: ${bookingRecord.bookingDate}
Booking Time: ${bookingRecord.bookingTime}

Thank you for booking with HPY Moments! 
Your payment has been successfully processed.

Keep this booking ID safe for your records.
    `;
    
    sendEmail(
        bookingRecord.email,
        bookingRecord.name,
        '✅ Booking Confirmed - HPY Moments',
        confirmationMessage
    );
    
    // Send notification to admin
    sendEmailToAdmin(
        'aakash121767@gmail.com',
        currentUser ? currentUser.name : bookingRecord.name,
        '🎉 New Payment Booking - ' + bookingId,
        `New booking received with payment!\n\nBooking ID: ${bookingId}\nPackage: ${bookingRecord.packageName}\nAmount: ₹${bookingRecord.amount}\nPayment ID: ${response.razorpay_payment_id}`,
        bookingRecord
    );
    
    // Populate success page if elements exist
    const successBookingId = document.getElementById('success-booking-id');
    if (successBookingId) successBookingId.textContent = bookingId;
    
    const successPackageName = document.getElementById('success-package-name');
    if (successPackageName) successPackageName.textContent = bookingRecord.packageName;

    // Show booking success view
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) bookingForm.classList.add('hidden');
    
    const bookingSuccess = document.getElementById('booking-success');
    if (bookingSuccess) bookingSuccess.classList.remove('hidden');
    
    // Store for WhatsApp sharing
    window.successBooking = bookingRecord;
    
    console.log('✅ Payment successful! Booking ID:', bookingId);
    console.log('📧 Confirmation emails sent');
    console.log('💾 Booking saved to localStorage');
    
    // Navigate to booking view to display the "Booking Completed" success message
    navigateTo('booking');
}

// All Razorpay-related error handling is now integrated into initiateRazorpayPayment()


/**
 * Retries the payment process
 * Goes back to payment page to allow user to retry payment
 */
function retryPayment() {
    if (window.failedBooking) {
        window.bookingData = window.failedBooking;
        navigateTo('payment');
    } else {
        alert('No previous booking found. Please start a new booking.');
        navigateTo('packages');
    }
}

/**
 * Shares booking confirmation on WhatsApp
 * Generates WhatsApp message with booking details and opens WhatsApp share dialog
 */
function shareOnWhatsApp() {
    if (!window.successBooking) {
        alert('No booking to share');
        return;
    }
    
    const booking = window.successBooking;
    
    // Create WhatsApp message
    const whatsappMessage = `🎉 *Booking Confirmed!* 🎉

*Booking Details:*
📝 Booking ID: ${booking.bookingId}
✈️ Package: ${booking.packageName}
👥 Travelers: ${booking.travelers}
💰 Amount: ₹${booking.amount}

*Passenger Details:*
👤 Name: ${booking.name}
📧 Email: ${booking.email}
📱 Phone: ${booking.phone}

📅 Booking Date: ${booking.bookingDate}

Thank you for booking with HPY Moments! 🌍`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // Generate WhatsApp share URL
    const whatsappURL = `https://wa.me/?text=${encodedMessage}`;
    
    // Open WhatsApp (works on desktop and mobile)
    window.open(whatsappURL, '_blank');
    
    console.log('📲 Opening WhatsApp with booking details...');
}

/**
 * Copies booking ID to clipboard
 * Shows success message after copying
 */
function copyBookingId() {
    const bookingId = document.getElementById('success-booking-id').textContent;
    
    // Create temporary input element to copy from
    const tempInput = document.createElement('input');
    tempInput.value = bookingId;
    document.body.appendChild(tempInput);
    
    // Select and copy
    tempInput.select();
    document.execCommand('copy');
    
    // Remove temporary element
    document.body.removeChild(tempInput);
    
    // Show feedback
    const copyBtn = event.target;
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '✓ Copied!';
    copyBtn.classList.add('bg-green-500');
    copyBtn.classList.remove('bg-brand');
    
    // Revert after 2 seconds
    setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.classList.remove('bg-green-500');
        copyBtn.classList.add('bg-brand');
    }, 2000);
    
    console.log('📋 Booking ID copied:', bookingId);
}

/**
 * Cancels payment and goes back to packages
 */
function cancelPayment() {
    window.bookingData = null;
    window.currentPackage = null;
    navigateTo('packages');
}

// ==========================================
// EMAIL & UTILITY FUNCTIONS
// ==========================================

/**
 * Sends email notification using EmailJS or AlertBox (fallback)
 * In production, integrate with EmailJS for real email functionality
 * @param {string} email - Recipient email address
 * @param {string} name - Recipient name
 * @param {string} subject - Email subject
 * @param {string} message - Email body message
 */
function sendEmail(email, name, subject, message) {
    console.log('📧 Email Function Called');
    console.log('To:', email);
    console.log('Subject:', subject);
    console.log('Message:', message);
    alert(`📧 Confirmation email sent to ${email}!\n\n${subject}\n\n${message}`);
}

/**
 * Sends admin notification email
 * @param {string} adminEmail - Admin email address
 * @param {string} userName - User name for context
 * @param {string} subject - Email subject
 * @param {string} message - Email body
 * @param {object} bookingRecord - Complete booking details
 */
function sendEmailToAdmin(adminEmail, userName, subject, message, bookingRecord) {
    console.log('📧 Admin Notification Email');
    console.log('To:', adminEmail);
    console.log('User:', userName);
    console.log('Details:', bookingRecord);
    
    // OPTION 1: EmailJS
    /*
    emailjs.send('service_xxxxxxx', 'template_admin', {
        admin_email: adminEmail,
        subject: subject,
        message: message,
        booking_data: JSON.stringify(bookingRecord)
    });
    */
    
    // OPTION 2: Backend API
    /*
    fetch('https://your-backend.com/notify-admin', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({adminEmail, userName, subject, message, bookingRecord})
    });
    */
    
    // Fallback: Just log it
}

/**
 * Saves booking data to Google Sheets via Apps Script webhook
 * Setup instructions: See RAZORPAY_INTEGRATION_GUIDE.md
 * @param {object} bookingRecord - Complete booking details to save
 */
function saveBookingToGoogleSheets(bookingRecord) {
    // Google Apps Script deployment URL (replace with your own)
    const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/d/{deploymentId}/usercontent/';
    
    // Only proceed if URL is configured
    if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL.includes('{')) {
        console.log('⚠️ Google Sheets webhook not configured. Skipping.');
        return;
    }
    
    // Send POST request to Google Apps Script
    fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(bookingRecord)
    })
    .then(() => console.log('✅ Booking saved to Google Sheets'))
    .catch(error => console.error('❌ Google Sheets error:', error));
}

/**
 * Generates and displays loading animation
 * @param {string} message - Loading message to display
 */
function showLoadingAnimation(message = 'Processing your payment...') {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'payment-loading-overlay';
    loadingOverlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50';
    loadingOverlay.innerHTML = `
        <div class="bg-white rounded-2xl p-8 text-center shadow-2xl animate-fadeIn max-w-sm">
            <div class="mb-4">
                <div class="inline-block">
                    <div class="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
            <h3 class="text-lg font-bold text-dark mb-2">${message}</h3>
            <p class="text-gray-500 text-sm">Please wait while we process your payment securely.</p>
        </div>
    `;
    document.body.appendChild(loadingOverlay);
    return loadingOverlay;
}

/**
 * Hides loading animation
 */
function hideLoadingAnimation() {
    const overlay = document.getElementById('payment-loading-overlay');
    if (overlay) {
        overlay.remove();
    }
}

/**
 * Shows success notification with animation
 * @param {string} message - Success message
 * @param {number} duration - Duration to show (ms)
 */
function showSuccessNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slideIn z-50 flex items-center gap-2';
    notification.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('animate-slideOut');
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

/**
 * Shows error notification with animation
 * @param {string} message - Error message
 * @param {number} duration - Duration to show (ms)
 */
function showErrorNotification(message, duration = 4000) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-6 right-6 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slideIn z-50 flex items-center gap-2';
    notification.innerHTML = `<i class="fa-solid fa-exclamation-circle"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('animate-slideOut');
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

/**
 * Validates Indian phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
function isValidIndianPhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/; // Indian numbers start with 6-9
    return phoneRegex.test(phone.replace(/\D/g, ''));
}

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

