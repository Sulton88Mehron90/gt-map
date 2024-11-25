// Imports and Mapbox Token Initialization
import { MAPBOX_TOKEN } from './config.js';
import { loadFacilitiesData } from './data/dataLoader.js';
import { centerStateMarkerLocation } from './data/centerStateMarkerLocation.js';
mapboxgl.accessToken = MAPBOX_TOKEN;

// Constants
const INITIAL_CENTER = [-75.4265, 40.0428]; // Coordinates for Berwyn, PA
const INITIAL_ZOOM = 1;

// Map Initialization on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("hospital-list-sidebar");
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v11',
        projection: 'globe',
        zoom: INITIAL_ZOOM,
        center: INITIAL_CENTER,
    });

    const sidebarHeader = document.querySelector(".sidebar-header");
    const backToTopButton = document.getElementById('back-to-top-button');

    sidebar.addEventListener('click', (event) => {
        event.stopPropagation();
    });
    const gtLogo = document.querySelector('.sidebar-logo');
    const backButton = document.createElement('button');

    // map navigation controls
    map.addControl(new mapboxgl.NavigationControl());
    // map.scrollZoom.disable();

    // Global variables
    let userInteracting = false;
    let hasInteracted = false;
    let hoveredRegionId = null;
    let selectedRegionId = null;
    let locationMarkers = [];
    let markers = [];
    let markersData = [];
    let markersDataReady = false;
    let facilitiesData = [];
    const regionsWithFacilities = new Set();
    const statesWithFacilities = new Set();
    let selectedStateId = null;
    const logoUrl = './img/gtLogo.png';
    let currentRegion = 'usa';

    // Toggle visibility for elements (markers or layers)
    function toggleVisibility(layerIds, visibility) {
        layerIds.forEach(layerId => {
            if (map.getLayer(layerId)) {
                map.setLayoutProperty(layerId, 'visibility', visibility);
            }
        });
    }

    function spinGlobe() {
        if (!userInteracting && map.getZoom() < 5) {
            const center = map.getCenter();
            center.lng -= 360 / 240;
            map.easeTo({ center, duration: 1000, easing: (n) => n });
        }
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

        // Only spin the globe if the user hasn't interacted
        if (!hasInteracted) {
            spinGlobe();
        }

        // Update markers after the map moves
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

    // Function to handle first interaction, hiding GT logos and showing clusters
    function onFirstInteraction() {
        if (!hasInteracted) {
            hasInteracted = true;

            // Hide GT logos permanently after the first interaction
            gtLogoMarkers.forEach(marker => {
                marker.getElement().style.visibility = 'hidden';
            });

            // Clusters become visible after zoom or interaction
            if (map.getZoom() >= 6) {
                setLayerVisibility('clusters', 'visible');
                setLayerVisibility('cluster-count', 'visible');
                setLayerVisibility('unclustered-point', 'visible');
            }
        }
    }

    //Event listeners to trigger onFirstInteraction only once
    map.on('mousedown', onFirstInteraction);
    map.on('zoom', onFirstInteraction);
    map.on('drag', onFirstInteraction);

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

    // Define debounced toggle function
    const debouncedGeocoderToggle = debounce(() => {
        // Toggle display for geocoder container and toggle button
        geocoderContainer.style.display = geocoderContainer.style.display === "none" ? "block" : "none";
        geocoderToggle.style.display = geocoderContainer.style.display === "none" ? "flex" : "none";

        // Initialize geocoder only when container is displayed
        if (!geocoder && geocoderContainer.style.display === "block") {
            geocoder = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl,
                marker: {
                    // color: '#ff8502' // Set GT color
                    color: 'red'
                }
            });

            geocoderContainer.appendChild(geocoder.onAdd(map));

            // MutationObserver to detect when the input is added
            const observer = new MutationObserver(() => {
                const geocoderInput = geocoderContainer.querySelector('input[type="text"]');
                if (geocoderInput) {
                    geocoderInput.focus();
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

    // toggle the back-to-top button visibility
    function toggleBackToTopButton() {
        const isCollapsed = sidebar.classList.contains('collapsed');
        const isScrollable = sidebar.scrollHeight > sidebar.clientHeight;
        const isSmallScreen = window.innerWidth <= 480;

        // Force recalculation of sidebar dimensions to ensure accuracy
        sidebar.style.height = 'auto';

        // Show button only if the sidebar is expanded and scrollable
        if (!isCollapsed && (isScrollable || isSmallScreen)) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
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

    // Sidebar minimize/expand button logic
    function toggleBackToTopButton() {
        const isCollapsed = sidebar.classList.contains('collapsed');
        const isScrollable = sidebar.scrollHeight > sidebar.clientHeight;
        const isSmallScreen = window.innerWidth <= 480;

        // Always hide the button when the sidebar is collapsed
        if (isCollapsed) {
            backToTopButton.style.display = 'none';
            return;
        }

        // On small screens, show the button only if the sidebar is scrollable
        if (isSmallScreen) {
            if (isScrollable) {
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';
            }
            return;
        }

        // On larger screens, show the button only if the sidebar is expanded and scrollable
        if (isScrollable) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    }

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
    });

    sidebar.addEventListener('touchstart', (event) => {
        if (!sidebar.classList.contains('collapsed')) {
            toggleBackToTopButton();
        }
    }, { passive: false });

    sidebar.addEventListener('touchend', () => {
        toggleBackToTopButton();
    }, { passive: true });

    let sessionStartingView = null;

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

    function populateSidebar(regionId, regionName, facilities) {
        const list = document.getElementById('hospital-list');
        list.innerHTML = '';

        const title = sidebar.querySelector('h2');
        title.innerText = `Facilities Using Goliath's Solutions in ${regionName}`;

        const existingCountDisplay = sidebar.querySelector('.count-display');
        if (existingCountDisplay) existingCountDisplay.remove();

        // Filter facilities by region
        const regionHospitals = facilities.filter(hospital =>
            hospital.location.includes(regionName) || hospital.region_id === regionId
        );

        // Use a Map to group hospitals by parent_company
        const uniqueHealthSystems = new Map();
        let totalHospitalCount = 0; // Initialize total count

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

                map.flyTo({
                    center: [hospital.longitude, hospital.latitude],
                    zoom: 12,
                    pitch: 45,
                    bearing: 0,
                    essential: true,
                    duration: 2000,
                    easing: (t) => t * (2 - t),
                });

                backButton.style.display = 'block';
            });

            list.appendChild(listItem);
        });

        sidebar.style.display = uniqueHealthSystems.size > 0 ? 'block' : 'none';
        adjustSidebarHeight();
    }

    // Define a centralized error message handler
    function displayErrorMessage(error) {
        console.error('Error loading facilities data:', error);
        const errorMessage = document.getElementById('error-message');
        if (errorMessage) {
            errorMessage.style.display = 'block';
            errorMessage.innerText = 'Failed to load facility data. Please try again later.';
        }
    }

    // Debounce utility function to limit execution frequency
    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    //Dynamic Sizing
    function adjustMarkerSize(zoomLevel) {
        // Scale marker size more conservatively
        const size = Math.max(6, Math.min(20, zoomLevel * 3));
        document.querySelectorAll('.custom-marker').forEach(marker => {
            marker.style.width = `${size}px`;
            marker.style.height = `${size}px`;
        });
        console.log(`Adjusted marker size to: ${size}px at zoom level ${zoomLevel}`);
    }

    // Custom marker creation with a popup. offset with this function.
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
        // markerElement.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.8)';
        // markerElement.style.boxShadow = '4px 4px 10px rgba(0, 0, 0, 0.5)'; // Larger, softer shadow
        // markerElement.style.boxShadow = '0px 0px 6px rgba(0, 0, 0, 1)';    // Glow effect

        // console.log(`createCustomMarker created with data-region-id: ${regionId}`);
        //regionId....?
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

    // markers dynamically based on map bounds
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

    // Debounce updateMarkers for better performance
    // const debouncedUpdateMarkers = debounce(updateMarkers, 300);

    // Fly-to buttons for navigating regions
    document.getElementById("fit-to-usa").addEventListener("click", () => {
        map.fitBounds([
            [-165.031128, 65.476793],
            [-81.131287, 26.876143]
        ]);
    });

    function updateMarkerVisibility(region, zoomLevel) {
        const regionZoomThresholds = {
            usa: 4,
            uk: 5,
            italy: 6,
            canada: 3,
            aruba: 10,
        };

        const markerZoomThreshold = regionZoomThresholds[region] || 4;
        if (zoomLevel <= markerZoomThreshold) {
            toggleVisibility(['state-markers'], 'visible');
            toggleVisibility(['location-markers', 'clusters', 'unclustered-point', 'cluster-count'], 'none');
        } else {
            toggleVisibility(['state-markers'], 'none');
            toggleVisibility(['location-markers'], 'visible');
        }
    }

    const regionZoomThresholds = {
        usa: 4,
        uk: 5,
        italy: 6,
        canada: 3,
        aruba: 10,
    };

    function resetToSessionView() {
        if (sessionStartingView) {
            const isMobile = window.innerWidth <= 780;
            const zoomThreshold = regionZoomThresholds[currentRegion] || 4;
            const zoomLevel = Math.max(
                isMobile ? sessionStartingView.zoom - 1 : sessionStartingView.zoom,
                zoomThreshold
            );

            // Fly to the sessionStartingView
            map.flyTo({
                center: sessionStartingView.center,
                zoom: zoomLevel,
                pitch: sessionStartingView.pitch,
                bearing: sessionStartingView.bearing,
                duration: 2000,
            });

            // Adjust marker size and visibility
            adjustMarkerSize(zoomLevel);
            updateMarkerVisibility(currentRegion, zoomLevel);

            // Hide back button and reset session view
            backButton.style.display = 'none';
            sessionStartingView = null;
        } else {
            console.warn('No previous view stored in sessionStartingView. Resetting to current region.');
            if (currentRegion) {
                flyToRegion(currentRegion);
            } else {
                flyToRegion('usa');
            }
        }
    }

    backButton.addEventListener('click', resetToSessionView);

    const sidebarCloseButton = document.getElementById('close-sidebar');
    if (sidebarCloseButton) {
        sidebarCloseButton.addEventListener('click', () => {
            sidebar.style.display = 'none';
            resetToSessionView();
        });
    } else {
        console.warn('Sidebar close button not found.');
    }

    // regions
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
        map.flyTo({
            center,
            zoom,
            pitch,
            bearing: 0,
            duration: 2000,
            easing: (t) => t * (2 - t),
        });

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

        // Highlight active button
        document.querySelectorAll(".region-button").forEach(button => button.classList.remove("active"));
        document.getElementById(`fly-to-${region}`).classList.add("active");
    }

    // handleStateClick
    function handleStateClick(clickedRegionId, facilitiesData) {
        console.log(`Clicked Region ID: ${clickedRegionId}`);

        // Store the current view if not already stored
        if (!sessionStartingView) {
            sessionStartingView = {
                center: map.getCenter(),
                zoom: map.getZoom(),
                pitch: map.getPitch(),
                bearing: map.getBearing(),
            };
            console.log('Stored session view:', sessionStartingView);
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

        // Filter facilities for the clicked state
        const stateFacilities = facilitiesData.filter(facility => facility.region_id === clickedRegionId);

        // Handle case where no facilities are found or empty clicks
        map.on('click', (e) => {
            const features = map.queryRenderedFeatures(e.point, { layers: ['state-markers'] });

            if (!features.length) {
                console.warn('Empty click detected: No region or facility clicked.');

                // Reset to the view of the current region using flyToRegion
                if (currentRegion) {
                    flyToRegion(currentRegion);
                } else {
                    flyToRegion('usa'); // Default to USA if no currentRegion is set
                }
                return;
            }

            // Proceed with regular region click handling
            const clickedRegionId = features[0].properties.region_id;
            handleStateClick(clickedRegionId, facilitiesData);
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

        // Zoom into the bounds of the state
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

    // Sets up a click event for a specified region layer.
    // On click, fetches and displays facility data in the sidebar for the clicked region.

    function setRegionClickEvent(regionSource, regionIdProp, regionNameProp) {
        map.on('click', `${regionSource}-fill`, (e) => {
            const clickedRegionId = e.features[0].properties[regionIdProp];
            const regionName = e.features[0].properties[regionNameProp];

            // Check if the clicked region has facilities
            if (!regionsWithFacilities.has(clickedRegionId)) {
                console.warn(`Region "${regionName}" with ID ${clickedRegionId} does not have facilities. Ignoring click.`);

                // Close the sidebar if it is open
                const sidebar = document.getElementById('hospital-list-sidebar');
                if (sidebar) {
                    sidebar.style.display = 'none';
                }

                return;
            }

            // Proceed with facility-related behavior
            console.log(`Region clicked: ${regionName} (ID: ${clickedRegionId})`);

            // Fetch facilities data
            loadFacilitiesData()
                .then(facilities => {
                    // Call handleStateClick to add markers and zoom into the state
                    handleStateClick(clickedRegionId, facilities);

                    // Update the sidebar with facility details for the selected state
                    populateSidebar(
                        clickedRegionId,
                        regionName,
                        facilities.filter(facility => facility.region_id === clickedRegionId)
                    );
                })
                .catch(error => {
                    console.error('Error fetching facilities data:', error);
                });
        });
    }

    map.on('load', () => {
        // console.log('Map fully loaded');
        map.setFog({});

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

        // Idle event to recheck visibility after rotation
        map.on('idle', () => {
            if (map.getZoom() <= 3) {
                setLayerVisibility('state-markers', 'visible');
                setLayerVisibility('location-markers', 'none');
                setLayerVisibility('clusters', 'none');
                setLayerVisibility('cluster-count', 'none');
                setLayerVisibility('unclustered-point', 'none');
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
                        console.log("regionsWithFacilities:", Array.from(regionsWithFacilities));
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

                    // Set click events and interactions
                    setRegionClickEvent(sourceId, 'id', 'name');
                    addRegionInteractions(map, `${layerId}-fill`, sourceId, regionsWithFacilities);
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
                                markerZoomThreshold = 9;
                                break;
                            case 'canada':
                                markerZoomThreshold = 7;
                                break;
                            default:
                                console.warn(`No zoom threshold defined for region: ${currentRegion}`);
                                markerZoomThreshold = 3;
                        }

                        // Toggle visibility based on zoom level
                        if (currentZoom <= markerZoomThreshold) {
                            toggleVisibility(['state-markers'], 'visible');
                            toggleVisibility(['location-markers', 'clusters', 'unclustered-point', 'cluster-count'], 'none');
                        } else {
                            toggleVisibility(['state-markers'], 'none');
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
                            // Clear all markers
                            locationMarkers.forEach(marker => marker.remove());

                            // // Reset to default view
                            // setLayerVisibility('state-markers', 'visible');
                            // map.flyTo({
                            //     center: INITIAL_CENTER,
                            //     zoom: INITIAL_ZOOM,
                            //     pitch: 0,
                            //     bearing: 0,
                            // });

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
                    // markerElement.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.8)';
                    // markerElement.style.boxShadow = '4px 4px 10px rgba(0, 0, 0, 0.5)'; // Larger, softer shadow
                    // markerElement.style.boxShadow = '0px 0px 6px rgba(0, 0, 0, 1)';    // Glow effect

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

                //show regions and states
                function addRegionLayer(map, layerId, sourceId, regionsWithFacilities) {
                    const hoverColor = '#05aaff';
                    const selectedColor = '#ff8502';

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
                            'fill-opacity': 0.5
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

                // Marker size adjustment based on zoom
                map.on('zoomend', () => {
                    const zoomLevel = map.getZoom();
                    adjustMarkerSize(zoomLevel);
                    toggleMarkers();
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


                // Click event on state to display sidebar list of facilities
                map.on('click', '${layerId}-fill', (e) => {
                    const clickedStateId = e.features[0].properties.id;

                    // Check if the clicked state has facilities
                    if (!statesWithFacilities.has(clickedStateId)) {
                        // Hide sidebar if state doesn't have facilities
                        document.getElementById('hospital-list-sidebar').style.display = 'none';

                        // Deselect previously selected state if any
                        if (selectedStateId !== null) {
                            // map.setFeatureState({ source: '{ layerId, sourceId }', id: selectedStateId }, { selected: false }); 

                            ///source: 'us-states', id: selectedStateId

                            map.setFeatureState({ source: '{ sourceId }', id: selectedStateId }, { selected: false });
                        }
                        selectedStateId = null;
                        return;
                    }

                    // Deselect previously selected state
                    if (selectedStateId !== null) {
                        map.setFeatureState({ source: '{ layerId, sourceId }', id: selectedStateId }, { selected: false });
                    }

                    // Set the clicked state as selected
                    selectedStateId = clickedStateId;
                    map.setFeatureState({ source: '{ layerId, sourceId }', id: selectedStateId }, { selected: true });

                    // Display facilities in the sidebar
                    const stateName = e.features[0].properties.name;
                    const stateHospitals = facilities.filter(hospital => hospital.location.includes(clickedStateId));

                    const list = document.getElementById('hospital-list');
                    list.innerHTML = '';

                    // Update sidebar title with state name
                    const title = sidebar.querySelector('h2');
                    title.innerText = `Facilities Using Goliath's Solutions in ${stateName}`;

                    // Remove any existing count display
                    const existingCountDisplay = sidebar.querySelector('.count-display');
                    if (existingCountDisplay) existingCountDisplay.remove();

                    // Calculate the total facility count for the clicked state
                    const totalFacilityCount = stateHospitals.reduce((sum, hospital) => sum + (hospital.hospital_count || 1), 0);

                    // Display facility count
                    const countDisplay = document.createElement('p');
                    countDisplay.classList.add('count-display');
                    // countDisplay.innerHTML = `Total Facilities: <span style="color: #ff8502;">${stateHospitals.length}</span>`;

                    // Update the sidebar count display to show the actual number of facilities
                    countDisplay.innerHTML = `Total Facilities: <span style="color: #ff8502;">${totalFacilityCount}</span>`;
                    countDisplay.style.fontWeight = 'bold';
                    countDisplay.style.color = '#FFFFFF';
                    countDisplay.style.marginTop = '10px';
                    list.before(countDisplay);

                    if (stateHospitals.length > 0) {
                        stateHospitals.forEach(hospital => {
                            const listItem = document.createElement('li');

                            // Select the appropriate EHR logo based on the ehr_system value
                            let ehrLogo;
                            switch (hospital.ehr_system) {
                                case 'Cerner':
                                    ehrLogo = '<img src="./img/cerner-logo.png" alt="Cerner logo" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 5px; border-radius: 50%;">';
                                    break;
                                case 'Epic':
                                    ehrLogo = `<img src="./img/epic-logo.png" alt="Epic logo" style="width: 20px; height: 18px; vertical-align: middle; margin-right: 5px;">`;
                                    break;
                                case 'Meditech':
                                    ehrLogo = '<img src="./img/meditech-logo.png" alt="Meditech logo" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 5px; border-radius: 50%;">';
                                    break;
                                default:
                                    ehrLogo = '';
                                    break;
                            }

                            listItem.innerHTML = `
    <div>
        <i class="fas fa-hospital-symbol"></i> 
        <strong class="clickable-hospital" style="cursor: pointer; color: #add8e6;">
            ${hospital.hospital_name}
        </strong>
    </div>
    ${hospital.parent_company ? `<div><strong>Parent Company:</strong> ${hospital.parent_company}</div>` : ""}
    <div>${hospital.location}</div>
    <div><strong>EHR System:</strong> ${ehrLogo} ${hospital.ehr_system !== "Epic" ? hospital.ehr_system : ""}</div>
    <div><strong>Hospital Count:</strong> ${hospital.hospital_count || 1}</div>
`;
                            // Add a special note if this is the CommonSpirit Health Headquarters
                            if (hospital.hospital_name === "CommonSpirit Health Headquarters") {
                                listItem.innerHTML += `<br><strong style="color: #ff8502;">Note:</strong> CommonSpirit Health operates over 140 hospitals across 21 states. 
<a href="https://www.commonspirit.org/" target="_blank" style="color: #06b4fd;">Visit Website</a>`;
                            }

                            list.appendChild(listItem);
                        });

                        sidebar.style.display = 'block';
                    } else {
                        sidebar.style.display = 'none';
                    }
                });
            })
            .catch(error => {
                console.error('Error loading facilities data:', error);
                const errorMessage = document.getElementById('error-message');
                errorMessage.style.display = 'block';
                errorMessage.innerText = 'Failed to load facility data. Please try again later.';
            });

        function addRegionInteractions(map, layerId, sourceId, regionsWithFacilities) {
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const hoverEvent = isTouchDevice ? 'touchstart' : 'mousemove';

            // Applying hover effect only to regions with facilities
            const applyHover = (regionId) => {
                if (hoveredRegionId !== null && hoveredRegionId !== selectedRegionId) {
                    map.setFeatureState({ source: sourceId, id: hoveredRegionId }, { hover: false });
                }
                hoveredRegionId = regionId;
                if (hoveredRegionId !== selectedRegionId) {
                    map.setFeatureState({ source: sourceId, id: hoveredRegionId }, { hover: true });
                }
            };

            const clearHover = () => {
                if (hoveredRegionId !== null && hoveredRegionId !== selectedRegionId) {
                    map.setFeatureState({ source: sourceId, id: hoveredRegionId }, { hover: false });
                }
                hoveredRegionId = null;
            };

            // Touch and hover interactions
            if (isTouchDevice) {
                map.on('touchstart', layerId, (e) => {
                    const regionId = e.features[0].id;
                    if (regionsWithFacilities.has(regionId)) {
                        if (hoveredRegionId === regionId) {
                            selectRegion(regionId);
                        } else {
                            applyHover(regionId);
                        }
                    }
                });

                map.on('touchend', layerId, clearHover);
                map.on('touchcancel', layerId, clearHover);
            } else {
                map.on(hoverEvent, layerId, (e) => {
                    const regionId = e.features[0].id;
                    applyHover(regionId);
                });

                map.on('mouseleave', layerId, clearHover);
            }

            // Function to select a region
            function selectRegion(regionId) {
                clearRegionSelection();

                selectedRegionId = regionId;
                map.setFeatureState({ source: sourceId, id: selectedRegionId }, { selected: true });

                const facilitiesInRegion = facilities.filter(facility => facility.region_id === regionId);

                facilitiesInRegion.forEach(location => {
                    const marker = new mapboxgl.Marker({ color: '#ff8502' })
                        .setLngLat([location.longitude, location.latitude])
                        .addTo(map);
                    locationMarkers.push(marker);
                });

                updateSidebarForRegion(regionId);
            }

            // Clear selection when clicking outside regions
            map.on('click', (e) => {
                const features = map.queryRenderedFeatures(e.point, { layers: [layerId] });
                if (features.length === 0) {
                    clearRegionSelection();
                }
            });

            // Clear region selection and markers
            function clearRegionSelection() {
                clearHover();

                if (selectedRegionId !== null) {
                    map.setFeatureState({ source: sourceId, id: selectedRegionId }, { selected: false });
                    selectedRegionId = null;
                }

                locationMarkers.forEach(marker => marker.remove());
            }

            // Attach clearRegionSelection to sidebar close button
            document.getElementById('close-sidebar').addEventListener('click', () => {
                clearRegionSelection();
                closeSidebar();
            });

            // Reset Button Functionality
            const resetButton = document.getElementById("reset-view");
            resetButton.addEventListener("click", () => {
                clearRegionSelection();
                closeSidebar();
                map.flyTo({
                    center: INITIAL_CENTER,
                    zoom: INITIAL_ZOOM,
                    pitch: 0,
                    bearing: 0,
                    duration: 1000
                });
            });
        }

        // function addRegionInteractions(map, layerId, sourceId, regionsWithFacilities) {
        //     const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        //     const hoverEvent = isTouchDevice ? 'touchstart' : 'mousemove';

        //     // Applying hover effect only to regions with facilities
        //     const applyHover = (regionId) => {
        //         if (hoveredRegionId !== null && hoveredRegionId !== selectedRegionId) {
        //             map.setFeatureState({ source: sourceId, id: hoveredRegionId }, { hover: false });
        //         }
        //         hoveredRegionId = regionId;
        //         if (hoveredRegionId !== selectedRegionId) {
        //             map.setFeatureState({ source: sourceId, id: hoveredRegionId }, { hover: true });
        //         }
        //     };

        //     const clearHover = () => {
        //         if (hoveredRegionId !== null && hoveredRegionId !== selectedRegionId) {
        //             map.setFeatureState({ source: sourceId, id: hoveredRegionId }, { hover: false });
        //         }
        //         hoveredRegionId = null;
        //     };

        //     // Touch and hover interactions
        //     if (isTouchDevice) {
        //         map.on('touchstart', layerId, (e) => {
        //             const regionId = e.features[0].id;
        //             if (regionsWithFacilities.has(regionId)) {
        //                 if (hoveredRegionId === regionId) {
        //                     selectRegion(regionId);
        //                 } else {
        //                     applyHover(regionId);
        //                 }
        //             }
        //         });

        //         map.on('touchend', layerId, clearHover);
        //         map.on('touchcancel', layerId, clearHover);
        //     } else {
        //         map.on(hoverEvent, layerId, (e) => {
        //             const regionId = e.features[0].id;
        //             applyHover(regionId);
        //         });

        //         map.on('mouseleave', layerId, clearHover);
        //     }

        //     // Function to select a region
        //     function selectRegion(regionId) {
        //         clearRegionSelection();

        //         selectedRegionId = regionId;
        //         map.setFeatureState({ source: sourceId, id: selectedRegionId }, { selected: true });

        //         // Populate the sidebar for the selected region
        //         loadFacilitiesData()
        //             .then((facilities) => {
        //                 const regionName = map.queryRenderedFeatures({ layers: [layerId] })
        //                     .find((feature) => feature.properties.id === regionId)?.properties.name;
        //                 if (regionName) {
        //                     populateSidebar(regionId, regionName, facilities);
        //                 }
        //             })
        //             .catch((error) => {
        //                 console.error('Error loading facilities data:', error);
        //             });
        //     }

        //     // Clear selection when clicking outside regions
        //     map.on('click', (e) => {
        //         const features = map.queryRenderedFeatures(e.point, { layers: [layerId] });
        //         if (features.length === 0) {
        //             clearRegionSelection();
        //         }
        //     });

        //     // Clear region selection and markers
        //     function clearRegionSelection() {
        //         clearHover();

        //         if (selectedRegionId !== null) {
        //             map.setFeatureState({ source: sourceId, id: selectedRegionId }, { selected: false });
        //             selectedRegionId = null;
        //         }

        //         locationMarkers.forEach(marker => marker.remove());
        //         locationMarkers = [];
        //     }

        //     // Attach clearRegionSelection to sidebar close button
        //     document.getElementById('close-sidebar').addEventListener('click', () => {
        //         clearRegionSelection();
        //         closeSidebar();
        //     });

        //     // Reset Button Functionality
        //     const resetButton = document.getElementById("reset-view");
        //     resetButton.addEventListener("click", () => {
        //         clearRegionSelection();
        //         closeSidebar();
        //         map.flyTo({
        //             center: INITIAL_CENTER,
        //             zoom: INITIAL_ZOOM,
        //             pitch: 0,
        //             bearing: 0,
        //             duration: 1000,
        //         });
        //     });
        // }

        function closeSidebar() {
            sidebar.style.display = 'none';
            if (selectedStateId !== null) {
                map.setFeatureState({ source: 'us-states', id: selectedStateId }, { selected: false });
            }
            selectedStateId = null;
        }
        document.getElementById('close-sidebar').addEventListener('click', closeSidebar);

        // Drag Initialization and Threshold Handling
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