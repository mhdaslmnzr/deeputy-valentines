let map, userMarker, pathLine;
let watchId = null;
let currentPath = [];
let currentWaypoint = 0;

// Waypoints will be calculated relative to start position
const waypoints = [];
const waypointRadius = 5; // meters

// Initialize the walk
function startWalk() {
    // Request location permission
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(initializeMap, handleLocationError, {
            enableHighAccuracy: true
        });
    } else {
        alert("Location access is required for this experience");
    }
}

// Initialize map with user's location
function initializeMap(position) {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;

    // Calculate waypoints relative to start position
    calculateWaypoints(userLat, userLng);

    // Create map centered on user
    map = L.map('map').setView([userLat, userLng], 18);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add user marker
    userMarker = L.marker([userLat, userLng]).addTo(map);

    // Initialize path line
    pathLine = L.polyline([], {
        color: '#ff4081',
        weight: 3
    }).addTo(map);

    // Start tracking location
    startTracking();

    // Show walking screen
    showScreen('walking-screen');
}

// Calculate waypoints to form I ❤ U pattern
function calculateWaypoints(startLat, startLng) {
    // Convert meters to approximate lat/lng (rough estimation)
    const meterToLat = 0.00001;
    const meterToLng = 0.00001;

    // Clear existing waypoints
    waypoints.length = 0;

    // Add waypoints to form "I" (vertical line)
    waypoints.push([startLat, startLng]); // Start
    waypoints.push([startLat + (20 * meterToLat), startLng]); // Top of I

    // Add waypoints to form heart shape
    const heartCenter = [startLat + (30 * meterToLat), startLng + (10 * meterToLng)];
    waypoints.push([heartCenter[0] + (5 * meterToLat), heartCenter[1] - (5 * meterToLng)]); // Left curve
    waypoints.push([heartCenter[0], heartCenter[1] + (5 * meterToLng)]); // Bottom point
    waypoints.push([heartCenter[0] + (5 * meterToLat), heartCenter[1] - (5 * meterToLng)]); // Right curve

    // Add waypoints to form "U"
    waypoints.push([heartCenter[0] + (15 * meterToLat), heartCenter[1] + (10 * meterToLng)]); // Bottom of U
    waypoints.push([heartCenter[0] + (20 * meterToLat), heartCenter[1]]); // Right of U
}

// Start tracking user's location
function startTracking() {
    watchId = navigator.geolocation.watchPosition(
        updatePosition,
        handleLocationError,
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        }
    );
}

// Update user's position on map
function updatePosition(position) {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;
    const userPos = [userLat, userLng];

    // Update marker position
    userMarker.setLatLng(userPos);

    // Update path
    currentPath.push(userPos);
    pathLine.setLatLngs(currentPath);

    // Keep map centered on user
    map.setView(userPos);

    // Check distance to next waypoint
    if (currentWaypoint < waypoints.length) {
        const distance = calculateDistance(userPos, waypoints[currentWaypoint]);
        updateDistanceDisplay(distance);

        // Check if waypoint reached
        if (distance < waypointRadius) {
            waypointReached();
        }
    }
}

// Calculate distance between two points in meters
function calculateDistance(point1, point2) {
    const lat1 = point1[0];
    const lon1 = point1[1];
    const lat2 = point2[0];
    const lon2 = point2[1];

    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}

// Update distance display and progress bar
function updateDistanceDisplay(distance) {
    document.getElementById('distance').textContent = `${Math.round(distance)} meters`;
    
    // Update progress bar (assuming each segment is about 20 meters)
    const progress = Math.min(100, (1 - (distance / 20)) * 100);
    document.querySelector('.progress-fill').style.width = `${progress}%`;
}

// Handle reaching a waypoint
function waypointReached() {
    currentWaypoint++;
    
    if (currentWaypoint >= waypoints.length) {
        completeWalk();
    } else {
        // Update instruction for next waypoint
        updateWalkingInstruction();
    }
}

// Update instruction based on current waypoint
function updateWalkingInstruction() {
    const instructions = [
        "Walk forward to start the pattern...",
        "Keep going straight...",
        "Time to make a curve...",
        "You're doing great! Keep following the path...",
        "Almost there...",
        "Final stretch!"
    ];
    
    document.getElementById('current-instruction').textContent = 
        instructions[Math.min(currentWaypoint, instructions.length - 1)];
}

// Complete the walk
function completeWalk() {
    // Stop tracking
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
    }

    // Show completion screen
    showScreen('complete-screen');

    // Create final map showing the complete path
    const finalMap = L.map('final-map').setView(calculateCenter(currentPath), 18);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(finalMap);

    // Draw the complete path
    L.polyline(currentPath, {
        color: '#ff4081',
        weight: 4
    }).addTo(finalMap);

    // Animate the reveal message
    setTimeout(() => {
        document.querySelector('#complete-screen .message').textContent = 
            "Look closely... it spells I ❤️ U!";
    }, 3000);
}

// Calculate center point of path
function calculateCenter(points) {
    const lats = points.map(p => p[0]);
    const lngs = points.map(p => p[1]);
    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
    return [centerLat, centerLng];
}

// Show specific screen
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Handle location errors
function handleLocationError(error) {
    alert("Error accessing location: " + error.message);
}