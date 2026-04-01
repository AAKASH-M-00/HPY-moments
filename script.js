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
    
    if (currentUser) {
        authButtons.classList.add('hidden');
        profileButtons.classList.remove('hidden');
        document.getElementById('user-name-nav').textContent = currentUser.name;
    } else {
        authButtons.classList.remove('hidden');
        profileButtons.classList.add('hidden');
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
    
    if (!fullName || !email || !phone || !destination || !checkInDate || !travelers || !transportMode) {
        alert('Please fill in all booking details');
        return;
    }
    
    // Create booking object
    const booking = {
        id: Date.now(),
        name: fullName,
        email: email,
        phone: phone,
        destination: destination,
        checkInDate: checkInDate,
        travelers: travelers,
        transport: transportMode,
        bookingDate: new Date().toLocaleDateString()
    };
    
    // Save booking to current user
    currentUser.bookings = currentUser.bookings || [];
    currentUser.bookings.push(booking);
    
    // Update user in localStorage
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const userIndex = allUsers.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        allUsers[userIndex] = currentUser;
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
    }
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Send booking confirmation email to YOUR address (aakash121767@gmail.com)
    const bookingMessage = `New Booking Received!\n\n=== BOOKING DETAILS ===\n\nLoggedIn User:\n- Name: ${currentUser.name}\n- Email: ${currentUser.email}\n\n=== TRAVELER INFORMATION ===\n- Full Name: ${fullName}\n- Email: ${email}\n- Phone: ${phone}\n\n=== TRIP DETAILS ===\n- Destination: ${destination}\n- Check-in Date: ${checkInDate}\n- Number of Travelers: ${travelers}\n- Transport Mode: ${transportMode}\n- Booking Date: ${new Date().toLocaleDateString()}\n\n=== CONFIRMATION ===\nBooking ID: ${booking.id}\nThank you!\n\nHP Moments Travel Website`;
    
    // Send to your email address
    sendEmailToAdmin('aakash121767@gmail.com', currentUser.name, 'New Booking Confirmation', bookingMessage, booking);
    
    // Show success message
    document.getElementById('booking-form').classList.add('hidden');
    document.getElementById('booking-success').classList.remove('hidden');
    
    // Log booking data for verification
    console.log('✅ Booking Submitted:', booking);
    console.log('📧 Email sent to: aakash121767@gmail.com');
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
    
    // Add event listener for Explore page search bar
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
    
    // Add event listeners for region filter buttons
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
    
    initializeUserSession();
    updateNavbarForLoggedInUser();
    initData();
    navigateTo('home');
});

