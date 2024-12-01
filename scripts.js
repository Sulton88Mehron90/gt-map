// Imports and Mapbox Token Initialization
import { MAPBOX_TOKEN } from './config.js';
import { loadFacilitiesData } from './data/dataLoader.js';
import { centerStateMarkerLocation } from './data/centerStateMarkerLocation.js';
import { fetchAndCache, getCachedData, isCacheStale, preCacheFiles, clearCache } from './cache.js';

(async () => {
    // List of files to cache (including JSON, GeoJSON, and JS files)
    const filesToCache = [
        { url: './data/facilities.json', key: 'facilities' },
        { url: './data/us-states.geojson', key: 'usStates' },
        { url: './data/uk-regions.geojson', key: 'ukRegions' },
        { url: './data/italy-regions.geojson', key: 'italyRegions' },
        { url: './data/canada-regions.geojson', key: 'canadaRegions' },
        { url: './data/aruba-region.geojson', key: 'arubaRegion' }
    ];

    try {
        // Pre-cache all files with a 24-hour expiry
        await preCacheFiles(filesToCache, 24);

        // cached data
        const facilities = getCachedData('facilities');
        console.log('Cached facilities:', facilities);

        // Checking if the 'facilities' cache is stale (older than 24 hours)
        const isStale = isCacheStale('facilities', 24);
        console.log('Is facilities cache stale?', isStale);

        // Clear cache when user completes their session
        window.addEventListener('beforeunload', clearCache);
    } catch (error) {
        console.error('Error during initialization:', error);
    }
})();

mapboxgl.accessToken = MAPBOX_TOKEN;

// Constants for Map Configuration
const INITIAL_CENTER = [-75.4265, 40.0428]; // Initial center (Berwyn, PA)
const INITIAL_ZOOM = 1;
const USA_CENTER = [-98.5795, 39.8283];
const USA_ZOOM = getInitialZoom();
let spinnerVisible = false;
let globeSpinning = true;

// Centralized error message handler with dynamic error code
export function displayErrorMessage(error, context = "An unexpected error occurred") {
    console.log('displayErrorMessage called with:', error, context);

    // Hide spinner if active
    hideSpinner();

    // Hide main content
    const mapContainer = document.getElementById('map');
    const sidebar = document.getElementById('hospital-list-sidebar');
    const buttonGroup = document.querySelector('.mapbox-button-group');

    if (mapContainer) mapContainer.style.display = 'none';
    if (sidebar) sidebar.style.display = 'none';
    if (buttonGroup) buttonGroup.style.display = 'none';

    // Display error page
    const errorPage = document.getElementById('error-page');
    const errorCodeLabel = document.querySelector('#error-number .error-code-label');
    const errorCodeNumber = document.querySelector('#error-number .error-code-number');

    if (errorPage) {
        errorPage.style.display = 'block';

        // Set error code dynamically
        if (errorCodeLabel) {
            errorCodeLabel.innerText = "Error Code:";
        }

        if (errorCodeNumber) {
            if (error.response && error.response.status) {
                errorCodeNumber.innerText = error.response.status;
            } else if (error.code) {
                errorCodeNumber.innerText = error.code;
            } else {
                errorCodeNumber.innerText = "Unknown";
            }
        }

        // Add a random fact about Goliath Technologies
        const goliathInformativeFacts = [
            "Goliath Technologies leverages AI and automation to help IT professionals proactively troubleshoot and resolve performance issues before they impact users.",
            "Goliath Technologies ensures clinicians have seamless access to EHR systems like Epic, Cerner, Allscripts, and MEDITECH, so they can focus on patient care.",
            "Goliath Technologies provides end-user experience monitoring for hybrid multi-cloud environments, helping IT professionals manage performance across complex infrastructures.",
            "Trusted by industry leaders like Oracle Health, Google, and Children's National, Goliath Technologies provides cutting-edge solutions for performance monitoring.",
            "Vitaly Petrovsky from Maimonides Medical Center praises Goliath for providing end-to-end visibility and resolving performance issues in complex Citrix setups.",
        ];

        const randomFact = goliathInformativeFacts[Math.floor(Math.random() * goliathInformativeFacts.length)];
        const refFactContainer = document.getElementById('goliath-fact');
        if (refFactContainer) refFactContainer.innerText = randomFact;
    }
}

// Debug mode flag
const DEBUG_MODE = true; // Set to false in production

// Logging utility function
function log(message, level = 'info') {
    if (DEBUG_MODE || level === 'warn') {
        console[level](message);
    }
}

// Initial zoom based on screen width
function getInitialZoom() {
    if (window.innerWidth <= 480) return 2;
    if (window.innerWidth <= 768) return 3;
    return 4;
}

// Spinner Functions
function showSpinner() {
    if (!spinnerVisible) {
        // console.log('Spinner shown');
        document.getElementById('loading-spinner').style.display = 'block';
        spinnerVisible = true;
    }
}

function hideSpinner() {
    if (spinnerVisible) {
        // console.log('Spinner hidden');
        document.getElementById('loading-spinner').style.display = 'none';
        spinnerVisible = false;
    }
}

// Variables for Interaction States
let selectedRegionId = null;
let hoveredRegionId = null;
let facilitiesData = [];
let locationMarkers = [];

// Map Initialization on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    showSpinner();

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v11',
        projection: 'globe',
        center: USA_CENTER,
        zoom: USA_ZOOM,
    });

    // Spin the Globe
    function spinGlobe() {
        if (globeSpinning && map) {
            const center = map.getCenter();
            if (center) {
                center.lng -= 360 / 80;
                // map.easeTo({ center, duration: 1000, easing: (t) => t }); // Faster and smoother spin
            }
        }
    }

    // Start spinning immediately
    const spinInterval = setInterval(() => {
        if (globeSpinning) spinGlobe();
    }, 50);

    // Transition to the USA map after 1 second of spinning
    setTimeout(() => {
        globeSpinning = false;
        clearInterval(spinInterval);
        map.flyTo({
            center: USA_CENTER,
            zoom: USA_ZOOM,
            duration: 1500,
            essential: true,
            easing: (t) => t * (2 - t),
        });
    }, 1000);

    // Stop spinning if the user interacts with the map
    ['mousedown', 'dragstart', 'touchstart'].forEach(event => {
        map.on(event, () => {
            globeSpinning = false;
            clearInterval(spinInterval);
        });
    });

    // Map navigation controls (zoom and rotate)
    map.addControl(new mapboxgl.NavigationControl());
    map.scrollZoom.disable();

    //Variables that hold references to DOM elements
    const sidebar = document.getElementById("hospital-list-sidebar");
    const sidebarHeader = document.querySelector(".sidebar-header");
    const backToTopButton = document.getElementById('back-to-top-button');

    sidebar.addEventListener('click', (event) => {
        event.stopPropagation();
    });
    const gtLogo = document.querySelector('.sidebar-logo');
    const backButton = document.createElement('button');

    // Global variable
    // Interaction State Variables:
    let userInteracting = false;
    let hasInteracted = false;
    //Markers and Data Management:
    let markers = [];
    let markersData = [];
    let markersDataReady = false;
    //Facility and Region Tracking:
    const regionsWithFacilities = new Set();
    const statesWithFacilities = new Set();
    //Selection and Region Tracking:
    let selectedStateId = null;
    // const logoUrl = './img/gtLogo.png';
    let currentRegion = 'usa';
    //Geographic Bounds:
    const contiguousUSABounds = [
        [-124.848974, 24.396308],
        [-66.93457, 49.384358],
    ];
    let sessionStartingView = null;
    // Tracks the last action performed (reset or fit-to-USA)
    let lastAction = null;

    // clearRegionSelection()// this is just to show the spinner to Ted

    // Toggle visibility for elements (markers or layers)
    function toggleVisibility(layerIds, visibility) {
        layerIds.forEach(layerId => {
            if (map.getLayer(layerId)) {
                map.setLayoutProperty(layerId, 'visibility', visibility);
            }
        });
    }

    // Trigger spinGlobe only under certain conditions
    setTimeout(() => {
        if (!userInteracting && !hasInteracted) spinGlobe();
    }, 5000);

    // Event listeners for user interaction
    map.on('mousedown', () => {
        userInteracting = true;
        hasInteracted = true;
    });
    map.on('dragstart', () => {
        userInteracting = true;
        hasInteracted = true;
    });
    map.on('moveend', () => {
        userInteracting = false;

        if (!hasInteracted) {
            spinGlobe();
        }

        updateMarkers();
    });

    // Function to manage visibility explicitly
    function setLayerVisibility(layerId, visibility) {
        if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, 'visibility', visibility);
        }
    }

    function startInitialRotation() {
        map.easeTo({
            center: INITIAL_CENTER,
            zoom: INITIAL_ZOOM,
            duration: 3000,
            easing: (t) => t * (2 - t),
        });
    }
    // GT logo markers for countries
    const countries = [
        { name: 'USA', lngLat: [-80.147085, 30.954096] }, // gt office Near by location
        { name: 'UK', lngLat: [-1.654816, 52.181932] },
        { name: 'Aruba', lngLat: [-69.952269, 12.512168] },
        { name: 'Canada', lngLat: [-106.728058, 57.922142] },
        { name: 'Italy', lngLat: [12.465363, 42.835192] },
    ];

    // GT logo markers, making them initially visible
    const gtLogoMarkers = countries.map(country => {
        const logoElement = document.createElement('div');
        logoElement.className = 'company-logo';
        logoElement.style.backgroundImage = 'url(./img/gtLogo.png)';
        const marker = new mapboxgl.Marker(logoElement, {
            rotationAlignment: 'map',
            offset: [0, -15],
        }).setLngLat(country.lngLat).addTo(map);

        // Set initial visibility
        marker.getElement().style.visibility = 'visible';
        return marker;
    });

    // Hide clusters on sourcedata load event to ensure they are hidden initially
    map.on('sourcedata', (e) => {
        if (!hasInteracted && e.isSourceLoaded) {
            setLayerVisibility('clusters', 'none');
            setLayerVisibility('cluster-count', 'none');
            setLayerVisibility('unclustered-point', 'none');
            setLayerVisibility('state-markers', 'none');
        }
    });

    function manageGTLogosVisibility(visible) {
        gtLogoMarkers.forEach(marker => {
            const element = marker.getElement();
            element.style.visibility = visible ? 'visible' : 'hidden';

            if (!visible && marker._map) {
                marker.remove();
            } else if (visible && !marker._map) {
                marker.addTo(map);
            }
        });

        // console.log(visible ? 'GT logos shown.' : 'GT logos hidden.');
    }

    function onUserInteraction(eventType) {
        if (!hasInteracted) {
            hasInteracted = true;
            // console.log(`User started interaction: ${eventType}`);
        }

        userInteracting = true;

        manageGTLogosVisibility(false);

        // Show clusters if zoom threshold is met
        if (eventType === 'zoom' && map.getZoom() >= 6) {
            toggleVisibility(['clusters', 'cluster-count', 'unclustered-point'], 'visible');
        }
    }

    ['mousedown', 'dragstart', 'zoomstart', 'touchstart', 'click'].forEach(event => {
        map.on(event, () => {
            onUserInteraction(event);
        });
    });

    // GT logos are also hidden when using buttons
    document.querySelectorAll('.region-button').forEach(button => {
        button.addEventListener('click', () => {
            onUserInteraction('button');
        });
    });

    // Debounce Function Definition
    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Geocoder Toggle Setup
    const geocoderToggle = document.getElementById("toggle-geocoder");
    const geocoderContainer = document.getElementById("geocoder-container");
    let geocoder;
    // Debounced toggle function
    const debouncedGeocoderToggle = debounce(() => {
        geocoderContainer.style.display = geocoderContainer.style.display === "none" ? "block" : "none";
        geocoderToggle.style.display = geocoderContainer.style.display === "none" ? "flex" : "none";
        // Initialize geocoder only when container is displayed
        if (!geocoder && geocoderContainer.style.display === "block") {
            geocoder = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl
            });
            geocoderContainer.appendChild(geocoder.onAdd(map));

            // Add MutationObserver to detect input addition
            const observer = new MutationObserver(() => {
                const geocoderInput = geocoderContainer.querySelector('input[type="text"]');
                if (geocoderInput) {
                    geocoderInput.focus(); // Focus the input to show the caret
                    observer.disconnect();
                }
            });
            // Observe changes in the geocoderContainer
            observer.observe(geocoderContainer, { childList: true, subtree: true });
        } else if (geocoderContainer.style.display === "none" && geocoder) {
            geocoder.onRemove();
            geocoder = null;
        }
    }, 300);
    // Event Listener for Geocoder Toggle
    geocoderToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        debouncedGeocoderToggle();
    });

    // Outside Click Detection for Geocoder
    document.addEventListener("click", (event) => {
        if (!geocoderContainer.contains(event.target) && event.target !== geocoderToggle) {
            geocoderContainer.style.display = "none";
            geocoderToggle.style.display = "flex";
        }
    });

    // Check if elements are found
    if (!sidebar) {
        console.error("Sidebar element not found!");
    }
    if (!backToTopButton) {
        console.error("Back to Top button not found!");
    }

    function toggleBackToTopButton() {
        const isCollapsed = sidebar.classList.contains("collapsed");
        const isScrollable = sidebar.scrollHeight > sidebar.clientHeight;
        const isSmallScreen = window.innerWidth <= 480;

        // Show button only if the sidebar is not collapsed and has scrollable content
        if (!isCollapsed && (isScrollable || isSmallScreen)) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    }

    // Observer to monitor sidebar content changes for the back-to-top button
    const observer = new MutationObserver(toggleBackToTopButton);
    observer.observe(sidebar, { childList: true, subtree: true });

    // Event listener for back-to-top button scroll
    backToTopButton.addEventListener('click', () => {
        sidebar.scrollTo({ top: 0, behavior: "smooth" });
    });

    sidebar.addEventListener('touchstart', () => {
        if (!sidebar.classList.contains('collapsed')) {
            toggleBackToTopButton();
        }
    }, { passive: false });

    document.getElementById('minimize-sidebar').addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');

        // Reset sidebar scroll state after minimizing or reopening
        if (!sidebar.classList.contains('collapsed')) {
            sidebar.scrollTo(0, 0); // Reset to the top
        }

        // delay to recalculate dimensions accurately after transition
        setTimeout(() => {
            toggleBackToTopButton();
        }, 200);

        // minimize icon based on sidebar state
        const minimizeIcon = document.getElementById('minimize-sidebar').querySelector('i');
        if (sidebar.classList.contains('collapsed')) {
            minimizeIcon.classList.remove('fa-chevron-up');
            minimizeIcon.classList.add('fa-chevron-down');
        } else {
            minimizeIcon.classList.remove('fa-chevron-down');
            minimizeIcon.classList.add('fa-chevron-up');
        }

        // Event listener for sidebar minimize/expand button
        const minimizeButton = document.getElementById("minimize-sidebar");
        if (minimizeButton) {
            minimizeButton.addEventListener("click", () => {
                sidebar.classList.toggle("collapsed");
                toggleBackToTopButton(); // Ensure the button visibility is updated
            });
        }

    });

    // Event listener for touchstart on the sidebar (for mobile)
    sidebar.addEventListener(
        "touchstart",
        () => {
            if (!sidebar.classList.contains("collapsed")) {
                toggleBackToTopButton();
            }
        },
        { passive: true }
    );

    // Event listener for touchend on the sidebar
    sidebar.addEventListener(
        "touchend",
        () => {
            toggleBackToTopButton();
        },
        { passive: true }
    );

    //Recalculate button visibility on window resize
    window.addEventListener("resize", toggleBackToTopButton);

    // Ensure the button visibility is set correctly on load
    toggleBackToTopButton();

    //"Back" button
    backButton.id = 'back-button';
    backButton.classList.add('round-button');
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
    backButton.style.display = 'none';
    document.querySelector('.sidebar-header').appendChild(backButton);

    //Map Resize on Load and Window Resize
    window.addEventListener("load", () => map.resize());
    map.on("load", () => setTimeout(() => map.resize(), 100));
    window.addEventListener("resize", () => map.resize());

    // Function to add a GeoJSON source to the map
    function addGeoJSONSource(map, sourceId, dataUrl, promoteId) {
        // console.log(`Attempting to add source: ${sourceId}`);
        if (!map.getSource(sourceId)) {
            map.addSource(sourceId, {
                type: 'geojson',
                data: dataUrl,
                promoteId: promoteId,
            });

            //console.log(`Source with ID "${sourceId}" added successfully.`);
        }
        // else {
        //     console.warn(`Source with ID "${sourceId}" already exists. Skipping addition.`);
        // }
        // console.log('Current sources:', map.getStyle().sources);
    }

    // Adjusting sidebar height based on content size
    function adjustSidebarHeight() {
        const hospitalList = document.getElementById('hospital-list');

        // Check if content fits without overflow
        if (hospitalList.scrollHeight <= sidebar.clientHeight) {
            sidebar.classList.add('auto-height');
        } else {
            sidebar.classList.remove('auto-height');
        }
    }

    //populate the sidebar function
    function populateSidebar(regionId, regionName, facilities) {
        const list = document.getElementById('hospital-list');
        list.innerHTML = '';

        const title = sidebar.querySelector('h2');
        title.innerHTML = `Facilities Using Goliath's Solutions in <span style="color: #ff8502;">${regionName}</span>`;

        const existingCountDisplay = sidebar.querySelector('.count-display');
        if (existingCountDisplay) existingCountDisplay.remove();

        // Filter facilities by region
        const regionHospitals = facilities.filter(hospital =>
            hospital.location.includes(regionName) || hospital.region_id === regionId
        );

        // Use a Map to group hospitals by parent_company
        const uniqueHealthSystems = new Map();
        let totalHospitalCount = 0;

        regionHospitals.forEach(hospital => {
            const parentCompany = hospital.parent_company || hospital.hospital_name;

            // Accumulate count for all hospitals under the same parent company
            if (uniqueHealthSystems.has(parentCompany)) {
                const existing = uniqueHealthSystems.get(parentCompany);
                existing.hospital_count += hospital.hospital_count || 1;
            } else {
                uniqueHealthSystems.set(parentCompany, {
                    ...hospital,
                    hospital_count: hospital.hospital_count || 1, // Initialize count
                });
            }

            // Accumulate total hospital count
            totalHospitalCount += hospital.hospital_count || 1;
        });

        // Display total facility count in the sidebar
        const countDisplay = document.createElement('p');
        countDisplay.classList.add('count-display');
        countDisplay.innerHTML = `Total Facilities: <span style="color: #ff8502;">${totalHospitalCount}</span>`;
        countDisplay.style.fontWeight = 'bold';
        countDisplay.style.color = '#FFFFFF';
        countDisplay.style.marginTop = '10px';
        list.before(countDisplay);

        // Populate the sidebar with one hospital per health system
        uniqueHealthSystems.forEach(hospital => {
            const listItem = document.createElement('li');

            let ehrLogo;
            switch (hospital.ehr_system) {
                case 'Cerner':
                case 'Cerner-ITWorks':
                    ehrLogo = '<img src="./img/cerner-logo.png" alt="Cerner logo" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 5px; border-radius: 50%;">';
                    break;
                case 'Epic':
                    ehrLogo = '<img src="./img/epic-logo.png" alt="Epic logo" style="width: 20px; height: 18px; vertical-align: middle; margin-right: 5px;">';
                    break;
                case 'Meditech':
                    ehrLogo = '<img src="./img/meditech-logo.png" alt="Meditech logo" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 5px; border-radius: 50%;">';
                    break;
                default:
                    ehrLogo = '';
                    break;
            }

            listItem.innerHTML = `
            <i class="fas fa-hospital-symbol"></i> 
            <strong class="clickable-hospital" style="cursor: pointer; color: #add8e6;">
                ${hospital.hospital_name}
            </strong><br>
            ${hospital.parent_company ? `<strong>Parent Company:</strong> ${hospital.parent_company}<br>` : ""}
            ${hospital.location}<br>
            <div><strong>EHR System:</strong> ${ehrLogo} ${hospital.ehr_system !== "Epic" ? hospital.ehr_system : ""}</div>
            <div><strong>Hospital Count:</strong> ${hospital.hospital_count || 1}</div>
            `;

            listItem.querySelector('.clickable-hospital').addEventListener('click', () => {
                if (!sessionStartingView) {
                    sessionStartingView = {
                        center: map.getCenter(),
                        zoom: map.getZoom(),
                        pitch: map.getPitch(),
                        bearing: map.getBearing(),
                    };
                }

                // Fly to the hospital's location
                map.flyTo({
                    center: [hospital.longitude, hospital.latitude],
                    zoom: 12,
                    pitch: 45,
                    bearing: 0,
                    essential: true,
                    duration: 2000,
                    easing: (t) => t * (2 - t),
                });

                // Show the back button and hide the home logo
                backButton.style.display = 'block';
                gtLogo.style.display = 'none'; // Ensure home logo is hidden
            });

            list.appendChild(listItem);
        });

        sidebar.style.display = uniqueHealthSystems.size > 0 ? 'block' : 'none';
        adjustSidebarHeight();

        // Back button logic
        backButton.addEventListener('click', () => {
            if (sessionStartingView) {
                map.flyTo({
                    center: sessionStartingView.center,
                    zoom: sessionStartingView.zoom,
                    pitch: sessionStartingView.pitch,
                    bearing: sessionStartingView.bearing,
                    essential: true,
                    duration: 2000,
                    easing: (t) => t * (2 - t),
                });
            }

            // Hide the back button and show the home logo again
            backButton.style.display = 'none';
            gtLogo.style.display = 'block'; // Ensure home logo reappears
        });
    }

    // Debounce utility function to limit execution frequency 
    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Dynamic Sizing
    function adjustMarkerSize(zoomLevel) {
        // Scale marker size more conservatively
        const size = Math.max(6, Math.min(20, zoomLevel * 3));
        document.querySelectorAll('.custom-marker').forEach(marker => {
            marker.style.width = `${size}px`;
            marker.style.height = `${size}px`;
        });
        console.log(`Adjusted marker size to: ${size}px at zoom level ${zoomLevel}`);
    }

    function createCustomMarker(lng, lat, popupContent, regionId) {
        // Create a custom marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker company-logo sidebar-logo';
        markerElement.style.width = '12px';
        markerElement.style.height = '12px';
        markerElement.style.backgroundImage = `url('./img/gtLogo.png')`;
        // markerElement.style.backgroundImage = `url('./img/blueDot')`;
        markerElement.style.backgroundSize = '50%';
        markerElement.style.backgroundRepeat = 'no-repeat';
        markerElement.style.backgroundPosition = 'center';
        markerElement.style.borderRadius = '50%';
        markerElement.setAttribute('data-region-id', regionId);

        // console.log(`createCustomMarker created with data-region-id: ${regionId}`);

        // Create a popup and attach it to the marker
        const popup = new mapboxgl.Popup({ offset: 15 }).setHTML(popupContent);

        // Create the marker without adding it to the map
        const marker = new mapboxgl.Marker(markerElement)
            .setLngLat([lng, lat])
            .setPopup(popup);

        // Store the marker in the global array
        locationMarkers.push(marker);

        return marker;
    }

    // Debounce utility function
    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Original updateMarkers function
    function updateMarkers() {
        if (!markersDataReady) {
            // console.warn('Markers data is not ready yet. Skipping updateMarkers.');
            return;
        }

        // console.log('updateMarkers called');

        // Check if markersData is available
        if (!markersData || markersData.length === 0) {
            console.warn('Markers Data is empty. Skipping updateMarkers.');
            return;
        }

        const bounds = map.getBounds();
        if (!bounds || !bounds._sw || !bounds._ne) {
            // console.error('Invalid map bounds:', bounds);
            return;
        }

        // console.log('Map Bounds:', bounds);

        // Remove existing markers from the map
        markers.forEach(marker => marker.remove());
        markers = [];

        // Deduplicate markersData
        const uniqueMarkers = markersData.filter(
            (marker, index, self) =>
                index === self.findIndex(m => m.lng === marker.lng && m.lat === marker.lat)
        );

        // console.log(`Total Markers Data: ${markersData.length}`);
        // console.log(`Markers added: ${markers.length}`);
        // console.log(`Unique Markers to Add: ${uniqueMarkers.length}`);

        // Add markers within visible bounds
        uniqueMarkers.forEach(markerData => {
            const { lng, lat, popupContent } = markerData;

            if (bounds.contains([lng, lat])) {
                // console.log(`Adding marker at: ${lng}, ${lat}`);
                const marker = createCustomMarker(lng, lat, popupContent).addTo(map);
                markers.push(marker);
            }
        });

        // console.log(`Markers added: ${markers.length}`);
    }

    // Debounce the `updateMarkers` function
    const debouncedUpdateMarkers = debounce(updateMarkers, 300);

    // Map events now use the debounced version of `updateMarkers`
    map.on('zoomend', debouncedUpdateMarkers);
    map.on('moveend', debouncedUpdateMarkers);

    const regionZoomThresholds = {
        usa: 4,
        uk: 5,
        italy: 6,
        canada: 3,
        aruba: 10,
        reset: 1,
        fitToUSA: 3,
    };

    function updateMarkerVisibility(region, zoomLevel) {

        const markerZoomThreshold = regionZoomThresholds[region] || 4;
        if (zoomLevel <= markerZoomThreshold) {
            toggleVisibility(['state-markers'], 'visible');
            toggleVisibility(['location-markers', 'clusters', 'unclustered-point', 'cluster-count'], 'none');
        } else {
            toggleVisibility(['state-markers'], 'none');
            toggleVisibility(['location-markers'], 'visible');
        }
    }

    // reset the map view based on the previously stored session view
    function resetToSessionView() {
        if (sessionStartingView) {
            // Validate that the stored region matches the current region
            if (sessionStartingView.region === currentRegion) {
                const isMobile = window.innerWidth <= 780;

                // Handle reset and fit-to-USA actions with their specific thresholds
                const zoomThreshold =
                    lastAction === 'reset' ? regionZoomThresholds.reset :
                        lastAction === 'fitToUSA' ? regionZoomThresholds.fitToUSA :
                            regionZoomThresholds[currentRegion] || 4;

                const zoomLevel = Math.max(
                    isMobile ? sessionStartingView.zoom - 1 : sessionStartingView.zoom,
                    zoomThreshold
                );

                if (lastAction === 'fitToUSA') {
                    console.log('Returning to Fit-to-USA view...');
                    map.fitBounds([
                        [-165.031128, 65.476793],
                        [-81.131287, 26.876143],
                    ], {
                        padding: 20,
                        maxZoom: zoomThreshold,
                        duration: 2000,
                    });
                } else if (lastAction === 'reset') {
                    console.log('Returning to Reset view...');
                    map.flyTo({
                        center: INITIAL_CENTER,
                        zoom: zoomThreshold,
                        pitch: 0,
                        bearing: 0,
                        duration: 2000,
                    });
                } else if (currentRegion === 'usa' && window.innerWidth <= 480) {
                    // Adjust to contiguous USA bounds for small screens
                    map.fitBounds(contiguousUSABounds, {
                        padding: 20,
                        maxZoom: 4.5,
                        duration: 2000,
                    });
                } else {
                    // Fly to the sessionStartingView
                    map.flyTo({
                        center: sessionStartingView.center,
                        zoom: zoomLevel,
                        pitch: sessionStartingView.pitch,
                        bearing: sessionStartingView.bearing,
                        duration: 2000,
                    });
                }

                // Adjust marker visibility dynamically
                if (window.innerWidth <= 480) {
                    const visibility = zoomLevel >= 4 ? 'visible' : 'none';
                    toggleVisibility(['location-markers'], visibility);
                    console.log(`Location markers visibility set to: ${visibility} for zoom level ${zoomLevel}`);
                } else {
                    updateMarkerVisibility(currentRegion, zoomLevel);
                }

                adjustMarkerSize(zoomLevel);
            } else {
                // Reset to the current region if the stored region doesn't match
                console.warn('Stored region does not match the current region. Resetting to the current region.');
                flyToRegion(currentRegion);
            }
        } else {
            // Handle cases where no previous session view is stored
            console.warn('No previous view stored in sessionStartingView. Resetting to current region.');

            if (lastAction === 'fitToUSA') {
                console.log('Returning to Fit-to-USA view...');
                map.fitBounds([
                    [-165.031128, 65.476793],
                    [-81.131287, 26.876143],
                ], {
                    padding: 20,
                    maxZoom: regionZoomThresholds.fitToUSA,
                    duration: 2000,
                });
            } else if (lastAction === 'reset') {
                console.log('Returning to Reset view...');
                map.flyTo({
                    center: INITIAL_CENTER,
                    zoom: regionZoomThresholds.reset,
                    pitch: 0,
                    bearing: 0,
                    duration: 2000,
                });
            } else {
                flyToRegion(currentRegion || 'usa');
            }
        }
    }

    backButton.addEventListener('click', resetToSessionView);

    // Regions
    const regions = {
        usa: { center: [-101.714859, 40.710884], zoom: 4, pitch: 0 },
        uk: { center: [360.242386, 51.633362], zoom: 4, pitch: 15 },
        italy: { center: [12.563553, 42.798676], zoom: 4, pitch: 45 },
        canada: { center: [-106.3468, 56.1304], zoom: 3, pitch: 0 },
        aruba: { center: [-70.027, 12.5246], zoom: 10, pitch: 45 }
    };

    // flyToRegion function
    function flyToRegion(region) {
        if (!regions[region]) {
            console.error(`Region "${region}" is not defined.`);
            return;
        }

        const { center, zoom, pitch } = regions[region];

        // Define bounds for regions (only if applicable)
        const regionBounds = {
            usa: [
                [-124.848974, 24.396308], // Southwest corner
                [-66.93457, 49.384358],  // Northeast corner
            ],
            uk: [
                [-10.854492, 49.823809], // Southwest corner
                [1.762496, 58.635],      // Northeast corner
            ],
            italy: [
                [6.6272658, 35.2889616], // Southwest corner
                [18.784474, 47.0921462], // Northeast corner
            ],
            canada: [
                [-141.003, 41.675],      // Southwest corner
                [-52.648, 83.23324],     // Northeast corner
            ],
            aruba: [
                [-70.062056, 12.406293], // Southwest corner
                [-69.876820, 12.623324], // Northeast corner
            ],
        };

        // Check for small screens and adjust bounds for regions
        if (window.innerWidth <= 480 && regionBounds[region]) {
            map.fitBounds(regionBounds[region], {
                padding: 20,   // Smaller padding for small screens
                maxZoom: 4.5,  // Adjust zoom level for small screens
                duration: 2000,
            });
        } else {
            // Default flyTo logic for non-small screens or regions without bounds
            map.flyTo({
                center,
                zoom,
                pitch,
                bearing: 0,
                duration: 2000,
                easing: (t) => t * (2 - t),
            });
        }

        //current region
        currentRegion = region;

        // Adjust marker visibility based on zoom threshold
        const markerZoomThreshold = currentRegion === 'usa' ? 4 : 5;
        const currentZoom = map.getZoom();

        if (currentZoom <= markerZoomThreshold) {
            toggleVisibility(['state-markers'], 'visible');
            toggleVisibility(['location-markers', 'clusters', 'unclustered-point', 'cluster-count'], 'none');
        } else {
            toggleVisibility(['state-markers'], 'none');
        }

        // Explicitly show markers for Canada on small screens
        if (region === 'canada' && window.innerWidth <= 480) {
            toggleVisibility(['location-markers'], 'visible');
        }

        // Highlight active button
        document.querySelectorAll(".region-button").forEach(button => button.classList.remove("active"));
        document.getElementById(`fly-to-${region}`).classList.add("active");
    }
    //function handles the click event on a region (state) and adjusts the map accordingly.
    function handleStateClick(clickedRegionId, facilitiesData) {
        console.log(`Clicked Region ID: ${clickedRegionId}`);

        // Store the current view if not already stored
        if (!sessionStartingView) {
            sessionStartingView = {
                center: map.getCenter(),
                zoom: map.getZoom(),
                pitch: map.getPitch(),
                bearing: map.getBearing(),
                region: currentRegion,
            };
        }

        // Check if the clicked region has facilities
        const stateFacilities = facilitiesData.filter(facility => facility.region_id === clickedRegionId);
        if (!stateFacilities.length) {
            console.warn(`Region "${clickedRegionId}" does not have facilities.`);
            return;
        }

        // Show only location markers for the clicked region
        locationMarkers.forEach(marker => {
            const markerRegionId = marker.getElement().getAttribute('data-region-id');
            if (markerRegionId === clickedRegionId && !marker._map) {
                marker.addTo(map);
            } else if (markerRegionId !== clickedRegionId && marker._map) {
                marker.remove();
            }
        });

        // Custom zoom levels for specific regions
        const regionZoomLevels = {
            AW: 10,
            IT: 6,
            ENG: 8,
            CAN: 3,
            default: 6,
        };
        const customZoom = regionZoomLevels[clickedRegionId] || regionZoomLevels.default;

        // Zoom into the bounds of the region
        const stateBounds = new mapboxgl.LngLatBounds();
        stateFacilities.forEach(facility => {
            if (facility.longitude && facility.latitude) {
                stateBounds.extend([facility.longitude, facility.latitude]);
            } else {
                console.warn(`Skipping facility with missing coordinates:`, facility);
            }
        });

        map.fitBounds(stateBounds, {
            padding: 50,
            maxZoom: customZoom,
            duration: 2000,
        });

        backButton.style.display = 'block';
    }

    Object.keys(regions).forEach(region => {
        document.getElementById(`fly-to-${region}`).addEventListener("click", () => flyToRegion(region));
    });

    // zoom warning visibility and tooltip
    function manageZoomWarning() {
        const zoomLevel = map.getZoom();
        const isSmallScreen = window.innerWidth <= 480;
        const zoomThreshold = 5;

        const zoomWarning = document.getElementById('zoom-warning');
        if (!zoomWarning) return;

        if (isSmallScreen && zoomLevel < zoomThreshold) {
            zoomWarning.style.display = 'block';
        } else {
            zoomWarning.style.display = 'none';
        }
    }

    // hover tooltip logic
    const zoomWarningIcon = document.getElementById('zoom-warning-icon');
    const zoomTooltip = document.getElementById('zoom-tooltip');

    if (zoomWarningIcon) {
        zoomWarningIcon.addEventListener('mouseenter', () => {
            if (zoomTooltip) zoomTooltip.style.display = 'block';
        });

        zoomWarningIcon.addEventListener('mouseleave', () => {
            if (zoomTooltip) zoomTooltip.style.display = 'none';
        });
    }

    map.on('zoomend', manageZoomWarning);

    //responsible for attaching a click event to a specific region layer on the map.  
    function setRegionClickEvent(regionSource, regionIdProp, regionNameProp) {
        map.on('click', (e) => {
            const features = map.queryRenderedFeatures(e.point, { layers: [`${regionSource}-fill`] });

            if (features.length > 0) {
                const clickedRegionId = features[0].properties[regionIdProp];
                const regionName = features[0].properties[regionNameProp];

                if (!regionsWithFacilities.has(clickedRegionId)) {
                    log(`Region "${regionName}" with ID ${clickedRegionId} does not have facilities.`, 'warn');

                    const sidebar = document.getElementById('hospital-list-sidebar');
                    if (sidebar) sidebar.style.display = 'none';

                    toggleVisibility(['state-markers'], 'visible');
                    toggleVisibility(['location-markers', 'clusters', 'cluster-count', 'unclustered-point'], 'none');

                    const regionZoomLevels = {
                        AW: 10,
                        IT: 6,
                        ENG: 8,
                        CAN: 3,
                        default: 4,
                    };
                    const customZoom = regionZoomLevels[clickedRegionId] || regionZoomLevels.default;

                    map.flyTo({
                        center: map.getCenter(),
                        zoom: customZoom,
                        duration: 2000,
                        essential: true,
                        easing: (t) => t * (2 - t),
                    });

                    return;
                }

                loadFacilitiesData()
                    .then(facilities => {
                        showSpinner();
                        log(`Loading facilities for region: ${clickedRegionId}`, 'info');

                        handleStateClick(clickedRegionId, facilities);
                        populateSidebar(
                            clickedRegionId,
                            regionName,
                            facilities.filter(facility => facility.region_id === clickedRegionId)
                        );
                    })
                    .catch(error => {
                        log('Error fetching facilities data:', 'warn');
                        log(error, 'warn');
                        displayErrorMessage(error);
                    })
                    .finally(() => {
                        hideSpinner();
                    });
            } else {
                log('Clicked outside any region or state.', 'warn');

                const sidebar = document.getElementById('hospital-list-sidebar');
                if (sidebar) sidebar.style.display = 'none';

                toggleVisibility(['state-markers'], 'visible');
                toggleVisibility(['location-markers', 'clusters', 'cluster-count', 'unclustered-point'], 'none');

                const regionZoomLevels = {
                    usa: 4,
                    uk: 5,
                    italy: 6,
                    canada: 3,
                    aruba: 10,
                };
                const defaultZoom = regionZoomLevels[currentRegion] || 4;

                map.flyTo({
                    center: regions[currentRegion]?.center || map.getCenter(),
                    zoom: defaultZoom,
                    duration: 2000,
                    essential: true,
                    easing: (t) => t * (2 - t),
                });
            }
        });
    }

    //the initialization point for actions and event handlers that require the map to be fully loaded. 
    map.on('load', () => {
        showSpinner();
        // log('Map fully loaded', 'info');
        map.setFog({});

        //US map view is centered even if the globe was spinning or reset
        globeSpinning = false; // Ensure globe stops spinning after initial load
        let isFirstLoad = true;

        if (isFirstLoad) {
            log('First map load: Flying to USA view', 'info');
            map.flyTo({
                center: USA_CENTER,
                zoom: USA_ZOOM,
                duration: 1500,
            });
            isFirstLoad = false;
        } else {
            log('Subsequent load: Preserving current map view', 'info');
        }
        // Add GeoJSON sources
        const sources = [
            { id: 'us-states', url: '/data/us-states.geojson' },
            { id: 'uk-regions', url: '/data/uk-regions.geojson' },
            { id: 'canada-regions', url: '/data/canada-regions.geojson' },
            { id: 'aruba-region', url: '/data/aruba-region.geojson' },
            { id: 'italy-regions', url: '/data/italy-regions.geojson' },
        ];

        sources.forEach(({ id, url }) => {
            if (!map.getSource(id)) {
                addGeoJSONSource(map, id, url, 'id');
            }
        });

        // Start globe rotation
        startInitialRotation();

        // Explicitly set visibility for initial layers
        setTimeout(() => {
            setLayerVisibility('state-markers', 'visible');
            setLayerVisibility('location-markers', 'none');
            setLayerVisibility('clusters', 'none');
            setLayerVisibility('cluster-count', 'none');
            setLayerVisibility('unclustered-point', 'none');
        }, 0);

        map.on('idle', () => {
            const currentZoom = map.getZoom();

            // Ensure currentRegion has a valid value
            if (!currentRegion) {
                console.warn('currentRegion is not defined; defaulting to "usa".');
                currentRegion = 'usa';
            }

            // Default threshold for state marker visibility
            let markerZoomThreshold = 3;

            // Threshold based on the active region
            switch (currentRegion) {
                case 'usa':
                    markerZoomThreshold = 4.5;
                    break;
                case 'uk':
                    markerZoomThreshold = 5;
                    break;
                case 'italy':
                    markerZoomThreshold = 6;
                    break;
                case 'aruba':
                    markerZoomThreshold = 10;
                    break;
                case 'canada':
                    markerZoomThreshold = 7;
                    break;
                default:
                    console.warn(`No zoom threshold defined for region: ${currentRegion}`);
                    markerZoomThreshold = 3;
            }

            // Initialize zoom warning visibility and tooltip logic
            manageZoomWarning();

            // Adjust visibility based on zoom level and thresholds
            if (currentZoom <= 3) {
                setLayerVisibility('state-markers', 'visible');
                setLayerVisibility('location-markers', 'none');
                setLayerVisibility('clusters', 'none');
                setLayerVisibility('cluster-count', 'none');
                setLayerVisibility('unclustered-point', 'none');
            } else if (currentZoom <= markerZoomThreshold) {
                toggleVisibility(['state-markers'], 'visible');
                toggleVisibility(['location-markers', 'clusters', 'unclustered-point', 'cluster-count'], 'none');
            } else {
                toggleVisibility(['state-markers'], 'none');
                toggleVisibility(['location-markers', 'clusters', 'unclustered-point', 'cluster-count'], 'visible');
            }
        });

        // imported loadFacilitiesData function
        loadFacilitiesData()
            .then(facilities => {
                addFacilityMarkersWithOffsets(map, facilities);
                // console.log("Facilities data loaded:", facilities);
                updateMarkers();

                facilitiesData = facilities;

                // regionsWithFacilities and statesWithFacilities sets
                facilities.forEach(facility => {
                    const regionId = facility.region_id ? facility.region_id.toUpperCase() : null;
                    if (regionId) {
                        regionsWithFacilities.add(regionId);
                        // console.log("regionsWithFacilities:", Array.from(regionsWithFacilities));
                    }

                    const stateOrRegion = facility.location.split(', ')[1];
                    if (stateOrRegion) {
                        statesWithFacilities.add(stateOrRegion);
                    }
                });

                // console.log("Facilities data loaded:", facilitiesData); 
                // console.log("regionsWithFacilities:", Array.from(regionsWithFacilities));
                // console.log('Locations in data:', facilitiesData.map(f => f.location));

                // Define regions dynamically
                const layerRegions = [
                    { layerId: 'us-states', sourceId: 'us-states' },
                    { layerId: 'canada-regions', sourceId: 'canada-regions' },
                    { layerId: 'aruba-region', sourceId: 'aruba-region' },
                    { layerId: 'italy-regions', sourceId: 'italy-regions' },
                    { layerId: 'uk-regions', sourceId: 'uk-regions' },
                ];

                // Loop through each region to process layers and interactions
                layerRegions.forEach(({ layerId, sourceId }) => {
                    // console.log(`Processing region: ${layerId}`);

                    // Remove existing layers if present
                    if (map.getLayer(`${layerId}-fill`)) {
                        console.warn(`Removing existing layer: ${layerId}-fill`);
                        map.removeLayer(`${layerId}-fill`);
                    }
                    if (map.getLayer(`${layerId}-line-hover`)) {
                        console.warn(`Removing existing layer: ${layerId}-line-hover`);
                        map.removeLayer(`${layerId}-line-hover`);
                    }

                    // Add region layer and hover outline
                    addRegionLayer(map, layerId, sourceId, regionsWithFacilities);
                    addHoverOutlineLayer(map, `${layerId}-line-hover`, sourceId);
                    addRegionInteractions(map, `${layerId}-fill`, sourceId, regionsWithFacilities);

                    // Set click events and interactions
                    setRegionClickEvent(sourceId, 'id', 'name');
                });

                // Populate markersData
                markersData = facilities.map(facility => ({
                    lng: facility.longitude,
                    lat: facility.latitude,
                    popupContent: `
                <strong>${facility.hospital_name}</strong><br>
                ${facility.location}<br>
                ${facility.parent_company ? `Parent Company: ${facility.parent_company}<br>` : ""}
                EHR System: ${facility.ehr_system}<br>
                Address: ${facility.hospital_address}
            `,
                    regionId: facility.region_id,
                }));

                // console.log(`Markers Data Populated: ${markersData.length}`);
                markersDataReady = true;
                // console.log('Markers Data Populated:', markersData);

                function addFacilityMarkersWithOffsets(map, facilities, offsetFactor = 0.002) {
                    facilities.forEach(({ longitude, latitude, hospital_name, location, region_id }, index) => {
                        if (!longitude || !latitude) {
                            console.error(`Missing coordinates for facility: ${hospital_name}`);
                            return;
                        }

                        const offsetLng = (index % 10) * offsetFactor;
                        const offsetLat = (index % 5) * offsetFactor;

                        const marker = createCustomMarker(
                            longitude + offsetLng,
                            latitude + offsetLat,
                            `<strong>${hospital_name}</strong><br>${location}`,
                            region_id
                        );

                        marker.addTo(map);
                    });
                }

                // Initial render of markers
                updateMarkers();

                // Add GT logo markers
                gtLogoMarkers.forEach(marker => {
                    marker.getElement().style.visibility = 'visible';
                });

                // Load custom marker image for state markers
                map.loadImage('./img/gtLogo.png', (error, image) => {
                    if (error) {
                        console.error('Error loading image:', error);
                        return;
                    }

                    // Add state marker image
                    if (!map.hasImage('custom-marker')) {
                        map.addImage('custom-marker', image, { sdf: false });
                    }

                    // Filter state marker locations to include only those with facilities
                    const filteredStateMarkers = centerStateMarkerLocation.filter(location =>
                        facilitiesData.some(facility => facility.region_id === location.region_id)
                    );

                    // Add state markers source
                    map.addSource('state-markers', {
                        type: 'geojson',
                        data: {
                            type: 'FeatureCollection',
                            features: filteredStateMarkers.map(location => ({
                                type: 'Feature',
                                properties: {
                                    region_id: location.region_id,
                                    name: location.name,
                                },
                                geometry: {
                                    type: 'Point',
                                    coordinates: location.lngLat,
                                },
                            })),
                        },
                    });

                    // Layer for the state "G" markers
                    map.addLayer({
                        id: 'state-markers',
                        type: 'symbol',
                        source: 'state-markers',
                        layout: {
                            'icon-image': 'custom-marker',
                            'icon-size': 0.08,
                            'visibility': 'visible',
                        },
                    });

                    // Add source and layer for location markers

                    map.addSource('location-markers', {
                        type: 'geojson',
                        data: {
                            type: 'FeatureCollection',
                            features: facilitiesData.map(facility => ({
                                type: 'Feature',
                                properties: {
                                    region_id: facility.region_id,
                                    hospital_name: facility.hospital_name,
                                    parent_company: facility.parent_company,
                                    ehr_system: facility.ehr_system,
                                    location: facility.location
                                },
                                geometry: {
                                    type: 'Point',
                                    coordinates: [facility.longitude, facility.latitude]
                                }
                            }))
                        }
                    });

                    map.addLayer({
                        id: 'location-markers',
                        type: 'circle',
                        source: 'location-markers',
                        paint: {
                            'circle-color': 'rgba(0, 0, 0, 0)',
                            'circle-radius': 0
                        },
                        layout: {
                            'visibility': 'visible'
                        }
                    });

                    // Handle state marker clicks
                    map.on('click', 'state-markers', (e) => {
                        const clickedStateId = e.features[0].properties.region_id;

                        handleStateClick(clickedStateId, facilitiesData);
                    });


                    map.on('click', (e) => {
                        const features = map.queryRenderedFeatures(e.point, { layers: ['state-markers'] });
                        if (!features.length) {
                            locationMarkers.forEach(marker => marker.remove());
                            // Hide sidebar and back button
                            sidebar.style.display = 'none';
                            backButton.style.display = 'none';
                        }
                    });

                })

                // markers for each facility
                let markers = facilities.map(facility => {
                    const {
                        ehr_system,
                        hospital_name,
                        location,
                        hospital_address,
                        longitude,
                        latitude,
                        parent_company,
                        hospital_count,
                        region_id
                    } = facility;

                    // console.log(`Facility Region ID: ${region_id}`); // Debug

                    let popupContent = `
    <strong>${hospital_name}</strong><br>
    <strong style="color: #05aaff">${location}</strong><br>
    ${parent_company ? `Parent Company: ${parent_company}<br>` : ""}
    EHR System: <strong style="color: #0f2844">${ehr_system}</strong><br>
    Address: ${hospital_address}<br>
    Hospital Count: <strong>${hospital_count}</strong>
    `;

                    // "note" If this is the CommonSpirit Health Headquarters
                    if (hospital_name === "CommonSpirit Health Headquarters") {
                        popupContent += `<br><strong style="color: #ff8502">Note:</strong> CommonSpirit Health operates over 140 hospitals across 21 states. 
        <a href="https://www.commonspirit.org/" target="_blank" style="color: #06b4fd">Visit Website</a>`;
                    }

                    const popup = new mapboxgl.Popup({ offset: 15, closeButton: false })
                        .setHTML(popupContent);

                    // Create a custom marker element
                    const markerElement = document.createElement('div');
                    markerElement.className = 'custom-marker';
                    // markerElement.style.backgroundImage = `url('./img/redDot.png')`;
                    // markerElement.style.backgroundImage = `url('./img/orangeDot.png')`;
                    markerElement.style.backgroundImage = `url('./img/gtLogo.png')`;
                    markerElement.style.width = '12px';
                    markerElement.style.height = '12px';
                    markerElement.style.borderRadius = '50%';
                    markerElement.style.backgroundSize = 'cover';
                    markerElement.setAttribute('data-region-id', region_id);

                    // console.log(`under markers created with data-region-id: ${region_id}`);

                    // Set data-region-id attribute
                    markerElement.setAttribute('data-region-id', region_id);
                    // console.log(`Marker created with data-region-id: ${region_id}`); // Debug

                    const marker = new mapboxgl.Marker(markerElement)
                        .setLngLat([longitude, latitude])
                        .setPopup(popup)
                        .addTo(map);

                    // Specific hover behavior based on the hospital name
                    if (hospital_name !== "CommonSpirit Health Headquarters") {
                        // Standard behavior: show/hide popup on hover
                        marker.getElement().addEventListener('mouseenter', () => popup.addTo(map));
                        marker.getElement().addEventListener('mouseleave', () => popup.remove());
                    } else {
                        // For CommonSpirit Headquarters, keep popup open on click
                        marker.getElement().addEventListener('click', (e) => {
                            e.stopPropagation();
                            popup.addTo(map);
                        });
                    }

                    // Add marker to the global array for control
                    locationMarkers.push(marker);

                    return marker;
                });

                //Function for Zoom-Based Marker Visibility
                function toggleMarkers() {
                    const zoomLevel = map.getZoom();
                    const minZoomToShowMarkers = 5.8;

                    markers.forEach(marker => {
                        if (zoomLevel >= minZoomToShowMarkers && !marker._map) {
                            marker.addTo(map);
                        } else if (zoomLevel < minZoomToShowMarkers && marker._map) {
                            marker.remove();
                        }
                    });
                }

                // Attach 'zoomend' event to adjust markers based on zoom level
                map.on('zoomend', toggleMarkers);

                // Initial call to set visibility based on the starting zoom level
                toggleMarkers();

                map.on('zoomend', () => {
                    const zoomLevel = map.getZoom();
                    adjustMarkerSize(zoomLevel);

                    if (window.innerWidth <= 480 && currentRegion === 'canada') {
                        const visibility = zoomLevel >= 5 ? 'visible' : 'none';
                        toggleVisibility(['location-markers'], visibility);
                        // console.log(`Canada markers visibility set to: ${visibility} at zoom level ${zoomLevel}`);
                    } else {
                        toggleMarkers();
                    }
                });

                // show regions and states
                function addRegionLayer(map, layerId, sourceId, regionsWithFacilities) {
                    const hoverColor = '#05aaff';
                    const selectedColor = '#6E7F80'; //disaturated blue
                    // const selectedColor = '#A2C4A5'; //Muted Green
                    // const selectedColor = '#F8F9FA' //gray
                    // const selectedColor = '#05aaff' 

                    if (map.getLayer(`${layerId}-fill`)) {
                        // console.warn(`Layer with id "${layerId}-fill" already exists. Skipping addition.`);
                        return;
                    }

                    map.addLayer({
                        id: `${layerId}-fill`,
                        type: 'fill',
                        source: sourceId,
                        paint: {
                            'fill-color': [
                                'case',
                                // Apply selected color if the region is selected and has facilities
                                ['all', ['boolean', ['feature-state', 'selected'], false], ['in', ['get', 'id'], ['literal', Array.from(regionsWithFacilities)]]], selectedColor,
                                // Apply hover color if the region is hovered and has facilities
                                ['all', ['boolean', ['feature-state', 'hover'], false], ['in', ['get', 'id'], ['literal', Array.from(regionsWithFacilities)]]], hoverColor,
                                // Default color for regions without facilities
                                '#d3d3d3'
                            ],
                            'fill-opacity': [
                                'case',
                                // Increase transparency for selected regions
                                ['boolean', ['feature-state', 'selected'], false], 0.1, // 30% opacity for selected regions
                                ['boolean', ['feature-state', 'hover'], false], 0.6, // 60% opacity for hovered regions
                                0.8
                            ]
                        }
                    });
                }

                function addHoverOutlineLayer(map, layerId, sourceId) {
                    if (map.getLayer(layerId)) {
                        // console.warn(`Layer with id "${layerId}" already exists. Skipping addition.`);
                        return;
                    }

                    if (map.getLayer(`${layerId}-glow`)) {
                        console.warn(`Glow layer with id "${layerId}-glow" already exists. Skipping addition.`);
                        return;
                    }

                    map.addLayer({
                        id: layerId,
                        type: 'line',
                        source: sourceId,
                        paint: {
                            'line-color': '#FFFFFF',
                            'line-width': [
                                'case',
                                ['boolean', ['feature-state', 'hover'], false],
                                2,  // Thicker line for hover
                                0.6 // Default line width
                            ]

                            // 'line-color': '#00FF00', // Bright green for better visibility
                            // 'line-width': [
                            //     'case',
                            //     ['boolean', ['feature-state', 'hover'], false],
                            //     3, // Wider line width when hovered
                            //     1  // Thinner line width when not hovered
                            // ]
                        }
                    });

                    map.addLayer({
                        id: `${layerId}-glow`,
                        type: 'line',
                        source: sourceId,
                        paint: {
                            'line-color': 'rgba(255, 255, 255, 0.3)', // White glow
                            'line-width': 2, // Larger width for glow effect
                            'line-blur': 2   // Blur for glow

                            // 'line-color': 'rgba(255, 0, 0, 0.6)', // Red glow with 60% opacity
                            // 'line-width': 8,                     // Larger line width for better visibility
                            // 'line-blur': 4                       // Blur for a glowing effect
                        }
                    });
                }

                ['us-states', 'canada-regions', 'aruba-region', 'italy-regions', 'uk-regions'].forEach(region => {
                    // console.log(`Applying styles for ${region}`);
                    addHoverOutlineLayer(map, `${region}-line-hover`, region);
                    addRegionLayer(map, region, region, regionsWithFacilities);
                    addRegionInteractions(map, `${region}-fill`, region, regionsWithFacilities);
                });

                // console.log('Current layer order:', map.getStyle().layers.map(layer => layer.id));
                // addGeoJSONSource(map, 'us-states', '/data/us-states.geojson', 'id');
                // console.log("Sources after adding 'us-states':", map.getStyle().sources);

                //Cluster Source and Layer Styling
                // Set up cluster source for hospitals
                map.addSource('hospitals', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: facilities.map(facility => ({
                            type: 'Feature',
                            properties: {
                                hospital_name: facility.hospital_name,
                                location: facility.location,
                                ehr_system: facility.ehr_system,
                                hospital_address: facility.hospital_address,
                                hospital_parent_company: facility.parent_company,
                                hospital_hospital_count: facility.hospital_count,
                            },
                            geometry: {
                                type: 'Point',
                                coordinates: [facility.longitude, facility.latitude],
                            }
                        })),
                    },
                    cluster: true,
                    clusterMaxZoom: 15,// To increase this value to reduce unclustered points at higher zoom levels
                    clusterRadius: 80,// To increase radius to group more points together in clusters
                });

                // Cluster layer with Goliath Technologies colors and outline for better visibility
                map.addLayer({
                    id: 'clusters',
                    type: 'circle',
                    source: 'hospitals',
                    filter: ['has', 'point_count'],
                    paint: {
                        'circle-color': [
                            'step',
                            ['get', 'point_count'],
                            '#ff8502',  // Small clusters (orange)
                            // '#b31919',  // Small clusters (red) 
                            10, ' #ff8502',  // Medium clusters (dark blue)
                            50, '#0f2844'   // Large clusters
                        ],
                        'circle-radius': [
                            'step',
                            ['get', 'point_count'],
                            10,   // Small clusters
                            20, 15, // Medium clusters
                            50, 20 // Large clusters (reduced size)
                        ],
                        'circle-stroke-width': 1, // Add a thin outline
                        'circle-stroke-color': '#0f2844' // Dark blue outline for consistency
                    },

                    layout: {
                        'visibility': 'none' // Initially hidden
                    }
                });

                // Cluster count layer
                map.addLayer({
                    id: 'cluster-count',
                    type: 'symbol',
                    source: 'hospitals',
                    filter: ['has', 'point_count'],
                    layout: {
                        'text-field': '{point_count_abbreviated}',
                        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                        'text-size': 14,
                        'text-anchor': 'center',
                        'visibility': 'none' // Initially hidden
                    },
                    paint: {
                        'text-color': '#FFFFFF',
                    },
                });

                // Unclustered point layer
                map.addLayer({
                    id: 'unclustered-point',
                    type: 'circle',
                    source: 'hospitals',
                    filter: ['!', ['has', 'point_count']],
                    paint: {
                        'circle-color': '#11b4da',
                        'circle-radius': 3,
                    },
                    layout: {
                        'visibility': 'none'
                    }
                });

                // Click event to show facility information in popup
                map.on('click', 'unclustered-point', (e) => {
                    const coordinates = e.features[0].geometry.coordinates.slice();
                    const { hospital_name, location, ehr_system, hospital_address } = e.features[0].properties;

                    new mapboxgl.Popup()
                        .setLngLat(coordinates)
                        .setHTML(`<strong>${hospital_name}</strong><br>${location}<br>EHR System: ${ehr_system}<br>Address: ${hospital_address}`)
                        .addTo(map);
                });

                // Handle cluster click to expand zoom level
                map.on('click', 'clusters', (e) => {
                    const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
                    const clusterId = features[0].properties.cluster_id;
                    map.getSource('hospitals').getClusterExpansionZoom(clusterId, (err, zoom) => {
                        if (err) return;
                        map.easeTo({
                            center: features[0].geometry.coordinates,
                            zoom: zoom
                        });
                    });
                });

                // Handle clicks on states/regions dynamically
                ['us-states', 'canada-regions', 'aruba-region', 'italy-regions', 'uk-regions'].forEach(layerId => {
                    map.on('click', `${layerId}-fill`, (e) => {
                        const clickedRegionId = e.features[0].properties.id;
                        const clickedRegionName = e.features[0].properties.name;

                        // Deselect all previously selected regions
                        ['us-states', 'canada-regions', 'aruba-region', 'italy-regions', 'uk-regions'].forEach(clearLayerId => {
                            if (selectedRegionId) {
                                map.setFeatureState({ source: clearLayerId, id: selectedRegionId }, { selected: false });
                            }
                        });

                        // Check if the clicked region has facilities
                        if (!regionsWithFacilities.has(clickedRegionId)) {
                            console.warn(`Region "${clickedRegionName}" with ID ${clickedRegionId} does not have facilities.`);
                            // Hide the sidebar and reset the selected region ID
                            document.getElementById('hospital-list-sidebar').style.display = 'none';
                            selectedRegionId = null;
                            return;
                        }

                        // Set the clicked region as selected
                        selectedRegionId = clickedRegionId;
                        map.setFeatureState({ source: layerId, id: selectedRegionId }, { selected: true });

                        // Load and display facilities for the selected region
                        const regionFacilities = facilitiesData.filter(facility => facility.region_id === clickedRegionId);

                        const list = document.getElementById('hospital-list');
                        list.innerHTML = '';

                        // Update sidebar title
                        const title = sidebar.querySelector('h2');
                        title.innerText = `Facilities Using Goliath's Solutions in ${clickedRegionName}`;

                        // Remove existing count display and calculate total
                        const existingCountDisplay = sidebar.querySelector('.count-display');
                        if (existingCountDisplay) existingCountDisplay.remove();

                        const totalFacilityCount = regionFacilities.reduce(
                            (sum, facility) => sum + (facility.hospital_count || 1),
                            0
                        );

                        // Display facility count
                        const countDisplay = document.createElement('p');
                        countDisplay.classList.add('count-display');
                        countDisplay.innerHTML = `Total Facilities: <span style="color: #ff8502;">${totalFacilityCount}</span>`;
                        countDisplay.style.fontWeight = 'bold';
                        countDisplay.style.color = '#FFFFFF';
                        countDisplay.style.marginTop = '10px';
                        list.before(countDisplay);

                        // Populate sidebar with facilities
                        regionFacilities.forEach(facility => {
                            const listItem = document.createElement('li');
                            let ehrLogo;
                            switch (facility.ehr_system) {
                                case 'Cerner':
                                    ehrLogo = '<img src="./img/cerner-logo.png" alt="Cerner logo" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 5px; border-radius: 50%;">';
                                    break;
                                case 'Epic':
                                    ehrLogo = '<img src="./img/epic-logo.png" alt="Epic logo" style="width: 20px; height: 18px; vertical-align: middle; margin-right: 5px;">';
                                    break;
                                case 'Meditech':
                                    ehrLogo = '<img src="./img/meditech-logo.png" alt="Meditech logo" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 5px; border-radius: 50%;">';
                                    break;
                                default:
                                    ehrLogo = '';
                            }

                            listItem.innerHTML = `
                <div>
                    <i class="fas fa-hospital-symbol"></i> 
                    <strong class="clickable-hospital" style="cursor: pointer; color: #add8e6;">
                        ${facility.hospital_name}
                    </strong>
                </div>
                ${facility.parent_company ? `<div><strong>Parent Company:</strong> ${facility.parent_company}</div>` : ""}
                <div>${facility.location}</div>
                <div><strong>EHR System:</strong> ${ehrLogo} ${facility.ehr_system !== "Epic" ? facility.ehr_system : ""}</div>
                <div><strong>Hospital Count:</strong> ${facility.hospital_count || 1}</div>
            `;
                            list.appendChild(listItem);
                        });

                        // Show sidebar
                        if (regionFacilities.length > 0) {
                            sidebar.style.display = 'block';
                        } else {
                            sidebar.style.display = 'none';
                        }
                    });
                });

            })
            .catch(error => {
                // Log error and display error message
                console.error('Error loading facilities data:', error);
                displayErrorMessage(error);
            })
            .finally(() => {
                hideSpinner();
            });

        //This function captures the function's role in configuring hover, click, and selection interactions for regions.
        function addRegionInteractions(map, layerId, sourceId, regionsWithFacilities) {
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const hoverEvent = isTouchDevice ? 'touchstart' : 'mousemove';

            // Apply hover effect
            const applyHover = (regionId) => {
                if (hoveredRegionId && hoveredRegionId !== selectedRegionId) {
                    map.setFeatureState({ source: sourceId, id: hoveredRegionId }, { hover: false });
                }
                hoveredRegionId = regionId;
                if (hoveredRegionId !== selectedRegionId) {
                    map.setFeatureState({ source: sourceId, id: hoveredRegionId }, { hover: true });
                }
            };

            // Clear hover effect
            const clearHover = () => {
                if (hoveredRegionId && hoveredRegionId !== selectedRegionId) {
                    map.setFeatureState({ source: sourceId, id: hoveredRegionId }, { hover: false });
                }
                hoveredRegionId = null;
            };

            // Clear region selection
            const clearRegionSelection = () => {

                if (!selectedRegionId && !hoveredRegionId) {
                    console.log('No region currently selected or hovered. Skipping clear.');
                    return;
                }

                console.log('Clearing region selection and hover');
                const regionSources = ['us-states', 'canada-regions', 'aruba-region', 'italy-regions', 'uk-regions'];

                regionSources.forEach((regionSource) => {
                    if (selectedRegionId) {
                        map.setFeatureState({ source: regionSource, id: selectedRegionId }, { selected: false });
                    }
                    if (hoveredRegionId) {
                        map.setFeatureState({ source: regionSource, id: hoveredRegionId }, { hover: false });
                    }
                });

                selectedRegionId = null;
                hoveredRegionId = null;
            };

            // Select a region
            const selectRegion = (regionId) => {
                if (regionId === selectedRegionId) {
                    console.log(`Region ${regionId} already selected. Skipping.`);
                    return;
                }
                clearRegionSelection();
                selectedRegionId = regionId;
                map.setFeatureState({ source: sourceId, id: selectedRegionId }, { selected: true });
                console.log(`Region ${regionId} selected.`);
                updateSidebarForRegion(regionId);
            };

            // Update sidebar with selected region information
            const updateSidebarForRegion = (regionId) => {
                console.log(`Updating sidebar for region: ${regionId}`);
                const sidebar = document.getElementById('hospital-list-sidebar');
                const title = sidebar.querySelector('h2');
                title.innerText = `Facilities in Region ${regionId}`;

                // Add logic to populate facilities in the sidebar
                const list = document.getElementById('hospital-list');
                list.innerHTML = ''; // Clear existing entries

                const facilitiesInRegion = facilitiesData.filter(
                    (facility) => facility.region_id === regionId
                );

                facilitiesInRegion.forEach((facility) => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${facility.hospital_name} (${facility.location})`;
                    list.appendChild(listItem);
                });

                if (facilitiesInRegion.length > 0) {
                    sidebar.style.display = 'block';
                } else {
                    sidebar.style.display = 'none';
                }
            };

            // Attach hover interactions
            if (!map.getLayer(layerId)) {
                console.warn(`Layer ${layerId} does not exist. Skipping interaction setup.`);
                return;
            }

            map.on(hoverEvent, layerId, (e) => {
                const regionId = e.features[0].id;
                applyHover(regionId);
            });

            map.on('mouseleave', layerId, clearHover);

            // Attach click interactions
            map.on('click', layerId, (e) => {
                const regionId = e.features[0].id;

                if (regionsWithFacilities.has(regionId)) {
                    console.log(`Clicked Region ID: ${regionId}`);
                    selectRegion(regionId);
                } else {
                    console.warn(`Clicked region "${regionId}" does not have facilities.`);
                }
            });

            // Sidebar Close Button. Attach clear interactions to sidebar close button
            const closeSidebarButton = document.getElementById('close-sidebar');
            if (closeSidebarButton && !closeSidebarButton.hasAttribute('data-listener-attached')) {
                closeSidebarButton.setAttribute('data-listener-attached', 'true');
                closeSidebarButton.addEventListener('click', () => {
                    // sidebar.style.display = 'none';
                    console.log('Sidebar closed. Clearing selection and hover.');
                    clearRegionSelection();
                    resetToSessionView();
                });
            }

            // Reset Button
            const resetButton = document.getElementById('reset-view');
            if (resetButton && !resetButton.hasAttribute('data-listener-attached')) {
                resetButton.setAttribute('data-listener-attached', 'true');
                resetButton.addEventListener('click', () => {
                    console.log('Reset button clicked.');
                    clearRegionSelection();
                    resetToSessionView()
                    closeSidebar()
                    lastAction = 'reset'; // Track reset action
                    map.flyTo({
                        center: INITIAL_CENTER,
                        zoom: INITIAL_ZOOM,
                        pitch: 0,
                        bearing: 0,
                        duration: 1000,
                    });
                });
            }

            map.on('zoomstart', clearHover);
        }

        // Fit-to-USA Button
        document.getElementById('fit-to-usa').addEventListener('click', () => {
            console.log('Fit-to-USA button clicked.');
            resetToSessionView()
            closeSidebar()
            lastAction = 'fitToUSA';
            map.fitBounds([
                [-165.031128, 65.476793],
                [-81.131287, 26.876143],
            ]);
        });

        //hide the sidebar and update the state of the map
        function closeSidebar() {
            sidebar.style.display = 'none';
            if (selectedStateId !== null) {
                map.setFeatureState({ source: 'us-states', id: selectedStateId }, { selected: false });
            }
            selectedStateId = null;
        }
        document.getElementById('close-sidebar').addEventListener('click', closeSidebar);

        //drag-and-drop functionality for an element
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;
        const dragThreshold = 5;

        // Start Drag Function
        function startDrag(e) {
            startX = e.touches ? e.touches[0].clientX : e.clientX;
            startY = e.touches ? e.touches[0].clientY : e.clientY;
            const rect = sidebar.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            sidebar.classList.add("dragging");
            sidebarHeader.classList.add("grabbing");

            isDragging = false;

            document.addEventListener("mousemove", handleDrag);
            document.addEventListener("mouseup", endDrag);
            document.addEventListener("touchmove", handleDrag, { passive: false });
            document.addEventListener("touchend", endDrag);
        }

        // Drag Handling Function
        function handleDrag(e) {
            const currentX = e.touches ? e.touches[0].clientX : e.clientX;
            const currentY = e.touches ? e.touches[0].clientY : e.clientY;
            const dx = currentX - startX;
            const dy = currentY - startY;

            if (!isDragging && Math.abs(dx) + Math.abs(dy) > dragThreshold) {
                isDragging = true;
            }

            if (isDragging) {
                e.preventDefault();
                sidebar.style.left = `${Math.min(Math.max(0, initialLeft + dx), window.innerWidth - sidebar.offsetWidth)}px`;
                sidebar.style.top = `${Math.min(Math.max(0, initialTop + dy), window.innerHeight - sidebar.offsetHeight)}px`;
            }
        }

        // End Drag Function
        function endDrag() {
            isDragging = false;
            sidebar.classList.remove("dragging");
            sidebarHeader.classList.remove("grabbing");

            document.removeEventListener("mousemove", handleDrag);
            document.removeEventListener("mouseup", endDrag);
            document.removeEventListener("touchmove", handleDrag);
            document.removeEventListener("touchend", endDrag);
        }

        // Attach Event Listeners
        sidebarHeader.addEventListener("mousedown", startDrag);
        sidebarHeader.addEventListener("touchstart", startDrag, { passive: false });

        // Adjust Sidebar Visibility Based on Screen Size
        function toggleSidebarOnHover(show) {
            // Only toggle visibility on small screens (e.g., max-width of 480px)
            if (window.innerWidth <= 480) {
                sidebar.style.display = show ? 'block' : 'none';
            }
        }

        // Show sidebar on touch or mouse enter for small screens
        sidebar.addEventListener('mouseenter', () => toggleSidebarOnHover(true));
        sidebar.addEventListener('touchstart', () => toggleSidebarOnHover(true));

        // Remove hiding behavior on `mouseleave` and `touchend`
        sidebar.removeEventListener('mouseleave', () => toggleSidebarOnHover(false));
        sidebar.removeEventListener('touchend', () => toggleSidebarOnHover(false));

        // Close sidebar only when the close button is clicked
        document.getElementById("close-sidebar").addEventListener('click', () => {
            sidebar.style.display = 'none';
        });
    })
});