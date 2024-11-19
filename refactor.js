// // //Imports and Mapbox Token Initialization
// // import { MAPBOX_TOKEN } from './config.js';
// // import { loadFacilitiesData } from './dataLoader.js';
// // mapboxgl.accessToken = MAPBOX_TOKEN;

// // // Map Initialization on DOMContentLoaded
// // document.addEventListener("DOMContentLoaded", () => {
// //     const sidebar = document.getElementById("hospital-list-sidebar");
// //     const sidebarHeader = document.querySelector(".sidebar-header");
// //     const backToTopButton = document.getElementById('back-to-top-button');
// //     // const minimizeButton = document.getElementById('minimize-sidebar');

// //     sidebar.addEventListener('click', (event) => {
// //         event.stopPropagation();
// //     });
// //     const gtLogo = document.querySelector('.sidebar-logo');
// //     const backButton = document.createElement('button');

// //     //set the initial view of Mapbox globe
// //     const INITIAL_CENTER = [-75.4265, 40.0428]; //The coordinates for 1235 Westlakes Drive, Suite 120, Berwyn, PA 19312, are approximately 40.06361° N latitude and 75.47156° W longitude
// //     const INITIAL_ZOOM = 1;

// //     const map = new mapboxgl.Map({
// //         container: 'map',
// //         style: 'mapbox://styles/mapbox/light-v11',
// //         projection: 'globe',
// //         zoom: INITIAL_ZOOM,
// //         center: INITIAL_CENTER,
// //     });

// //     // Adding navigation controls
// //     map.addControl(new mapboxgl.NavigationControl());
// //     // map.addControl(new mapboxgl.NavigationControl({ position: 'top-left' }));
// //     // map.scrollZoom.disable();

// //     // Variables for user interaction detection
// //     let userInteracting = false;

// //     // spin the globe smoothly when zoomed out
// //     function spinGlobe() {
// //         if (!userInteracting && map.getZoom() < 5) {
// //             const center = map.getCenter();
// //             center.lng -= 360 / 240;
// //             map.easeTo({ center, duration: 1000, easing: (n) => n });
// //         }
// //     }

// //     // Event listeners for user interaction
// //     map.on('mousedown', () => userInteracting = true);
// //     map.on('dragstart', () => userInteracting = true);
// //     map.on('moveend', () => spinGlobe());

// //     // Start the globe spinning animation
// //     spinGlobe();

// //     // Map Animation on Load to set the globe to your preferred size and center
// //     map.on('load', () => {
// //         map.easeTo({
// //             center: [-75.4265, 40.0428],
// //             // zoom: 0,
// //             zoom: 1,
// //             duration: 3000,
// //             easing: (t) => t * (2 - t)
// //         });
// //     });

// //     // Initial flags to track interaction and visibility states
// //     let hasInteracted = false;
// //     let isInitialRotation = true;

// //     //animated pulsing Dot icon
// //     const size = 50;
// //     // This implements `StyleImageInterface`
// //     // to draw a pulsing dot icon on the map.
// //     const pulsingDot = {
// //         width: size,
// //         height: size,
// //         data: new Uint8Array(size * size * 4),

// //         // When the layer is added to the map,
// //         // get the rendering context for the map canvas.

// //         onAdd: function () {
// //             const canvas = document.createElement('canvas');
// //             canvas.width = this.width;
// //             canvas.height = this.height;
// //             this.context = canvas.getContext('2d', { willReadFrequently: true });
// //             console.log('Canvas initialized with willReadFrequently:', this.context);
// //         },

// //         // Call once before every frame where the icon will be used.
// //         render: function () {
// //             const duration = 1000;
// //             const t = (performance.now() % duration) / duration;

// //             const radius = (size / 2) * 0.3;
// //             const outerRadius = (size / 2) * 0.7 * t + radius;
// //             const context = this.context;

// //             // Draw the outer circle.
// //             context.clearRect(0, 0, this.width, this.height);
// //             context.beginPath();
// //             context.arc(
// //                 this.width / 2,
// //                 this.height / 2,
// //                 outerRadius,
// //                 0,
// //                 Math.PI * 2
// //             );

// //             //Goliath colors
// //             // #ff8b1f: A vibrant orange; suitable for the outer circle or stroke.
// //             // #0f2844: A dark blue; ideal for the inner circle or border.
// //             // #ff0000: Bright red; can be used for the pulsing effect or an accent.
// //             // #ffffff: White; perfect for a border or subtle inner detail.

// //             context.fillStyle = `rgba(255, 139, 31, ${1 - t})`; // Orange (Outer Circle)
// //             context.fill();

// //             // Draw the inner circle.
// //             context.beginPath();
// //             context.arc(
// //                 this.width / 2,
// //                 this.height / 2,
// //                 radius,
// //                 0,
// //                 Math.PI * 2
// //             );
// //             context.fillStyle = '#0f2844'; // Dark Blue (Inner Circle)
// //             context.strokeStyle = '#ffffff'; // White Border
// //             // context.strokeStyle = '#ff0000'; 
// //             context.lineWidth = 2 + 4 * (1 - t);
// //             context.fill();
// //             context.stroke();

// //             // Update this image's data with data from the canvas.
// //             this.data = context.getImageData(
// //                 0,
// //                 0,
// //                 this.width,
// //                 this.height
// //             ).data;
// //             // console.log('Canvas context:', this.context); // Should not be undefined
// //             // console.log('Image data:', context.getImageData(0, 0, this.width, this.height).data); // Check if this runs


// //             // Continuously repaint the map, resulting
// //             // in the smooth animation of the dot.
// //             map.triggerRepaint();

// //             // Return `true` to let the map know that the image was updated.
// //             return true;
// //         }
// //     };

// //     map.on('load', () => {

// //         // console.log('Map loaded.');

// //         map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

// //         // console.log('Pulsing dot image added.');

// //         map.addSource('dot-point', {
// //             'type': 'geojson',
// //             'data': {
// //                 'type': 'FeatureCollection',
// //                 'features': [
// //                     {
// //                         'type': 'Feature',
// //                         'geometry': {
// //                             'type': 'Point',
// //                             'coordinates': [-75.4265, 40.0428] // icon position [lng, lat]
// //                         }
// //                     }
// //                 ]
// //             }
// //         });

// //         // console.log('Source for pulsing dot added.');

// //         map.addLayer({
// //             'id': 'layer-with-pulsing-dot',
// //             'type': 'symbol',
// //             'source': 'dot-point',
// //             'layout': {
// //                 'icon-image': 'pulsing-dot'
// //             }
// //         });
// //         // console.log('Layer for pulsing dot added.');

// //     });

// //     // Define GT logo markers for specified countries
// //     const countries = [
// //         { name: 'USA', lngLat: [-80.147085, 30.954096] }, // gt office Near by location
// //         { name: 'UK', lngLat: [-1.654816, 52.181932] },
// //         { name: 'Aruba', lngLat: [-69.952269, 12.512168] },
// //         { name: 'Canada', lngLat: [-106.728058, 57.922142] },
// //         { name: 'Italy', lngLat: [12.465363, 42.835192] },
// //     ];

// //     // Initialize GT logo markers, making them initially visible
// //     const gtLogoMarkers = countries.map(country => {
// //         const logoElement = document.createElement('div');
// //         logoElement.className = 'company-logo';
// //         logoElement.style.backgroundImage = 'url(./img/gtLogo.png)';
// //         const marker = new mapboxgl.Marker(logoElement, {
// //             rotationAlignment: 'map',
// //             offset: [0, -15],
// //         }).setLngLat(country.lngLat).addTo(map);

// //         // Set initial visibility to visible
// //         marker.getElement().style.visibility = 'visible';
// //         return marker;
// //     });

// //     // Utility function to safely set layer visibility if the layer exists
// //     function setLayerVisibility(layerId, visibility) {
// //         if (map.getLayer(layerId)) {
// //             map.setLayoutProperty(layerId, 'visibility', visibility);
// //         }
// //     }

// //     // Hide clusters on sourcedata load event to ensure they are hidden initially
// //     map.on('sourcedata', (e) => {
// //         if (!hasInteracted && e.isSourceLoaded) {
// //             // Ensure clusters remain hidden on load
// //             setLayerVisibility('clusters', 'none');
// //             setLayerVisibility('cluster-count', 'none');
// //             setLayerVisibility('unclustered-point', 'none');
// //         }
// //     });

// //     //  initial globe rotation, show GT logos, and ensure clusters are hidden
// //     function startInitialRotation() {
// //         // isInitialRotation = true;

// //         // globe animation with GT logos visible
// //         map.easeTo({
// //             center: [-75.4265, 40.0428],
// //             zoom: 1,
// //             duration: 3000,
// //             easing: (t) => t * (2 - t),
// //         });
// //     }

// //     // Function to handle first interaction, hiding GT logos and showing clusters
// //     function onFirstInteraction() {
// //         if (!hasInteracted) {
// //             hasInteracted = true;

// //             // Hide GT logos permanently after the first interaction
// //             gtLogoMarkers.forEach(marker => {
// //                 marker.getElement().style.visibility = 'hidden';
// //             });

// //             // Show clusters to follow their normal functionality
// //             setLayerVisibility('clusters', 'visible');
// //             setLayerVisibility('cluster-count', 'visible');
// //             setLayerVisibility('unclustered-point', 'visible');
// //         }
// //     }

// //     // event listeners to trigger onFirstInteraction only once
// //     map.on('mousedown', onFirstInteraction);
// //     map.on('zoom', onFirstInteraction);
// //     map.on('drag', onFirstInteraction);

// //     //initial globe rotation and GT logo display on map load
// //     map.on('load', startInitialRotation);

// //     // Debounce Function Definition
// //     function debounce(func, delay) {
// //         let timeout;
// //         return function (...args) {
// //             clearTimeout(timeout);
// //             timeout = setTimeout(() => func.apply(this, args), delay);
// //         };
// //     }

// //     // Geocoder Toggle Setup
// //     const geocoderToggle = document.getElementById("toggle-geocoder");
// //     const geocoderContainer = document.getElementById("geocoder-container");
// //     let geocoder;

// //     // Define debounced toggle function
// //     const debouncedGeocoderToggle = debounce(() => {
// //         // Toggle display for geocoder container and toggle button
// //         geocoderContainer.style.display = geocoderContainer.style.display === "none" ? "block" : "none";
// //         geocoderToggle.style.display = geocoderContainer.style.display === "none" ? "flex" : "none";

// //         // Initialize geocoder only when container is displayed
// //         if (!geocoder && geocoderContainer.style.display === "block") {
// //             geocoder = new MapboxGeocoder({
// //                 accessToken: mapboxgl.accessToken,
// //                 mapboxgl: mapboxgl,
// //                 marker: {
// //                     // color: '#ff8502' // Set GT color
// //                     color: 'red'
// //                 }
// //             });
// //             geocoderContainer.appendChild(geocoder.onAdd(map));

// //             // Use MutationObserver to detect when the input is added
// //             const observer = new MutationObserver(() => {
// //                 const geocoderInput = geocoderContainer.querySelector('input[type="text"]');
// //                 if (geocoderInput) {
// //                     geocoderInput.focus();
// //                     observer.disconnect(); // Stop observing once input is found and focused
// //                 }
// //             });

// //             // Observe changes in the geocoderContainer
// //             observer.observe(geocoderContainer, { childList: true, subtree: true });
// //         } else if (geocoderContainer.style.display === "none" && geocoder) {
// //             geocoder.onRemove();
// //             geocoder = null;
// //         }
// //     }, 300);

// //     // Event Listener for Geocoder Toggle
// //     geocoderToggle.addEventListener("click", (e) => {
// //         e.stopPropagation();
// //         debouncedGeocoderToggle();
// //     });

// //     // Outside Click Detection for Geocoder
// //     document.addEventListener("click", (event) => {
// //         if (!geocoderContainer.contains(event.target) && event.target !== geocoderToggle) {
// //             geocoderContainer.style.display = "none";
// //             geocoderToggle.style.display = "flex";
// //         }
// //     });

// //     // Check if elements are found
// //     if (!sidebar) {
// //         console.error("Sidebar element not found!");
// //     }
// //     if (!backToTopButton) {
// //         console.error("Back to Top button not found!");
// //     }

// //     // Function to toggle the back-to-top button visibility
// //     function toggleBackToTopButton() {
// //         const isCollapsed = sidebar.classList.contains('collapsed'); // Sidebar is minimized
// //         const isScrollable = sidebar.scrollHeight > sidebar.clientHeight; // Sidebar has overflow
// //         const isSmallScreen = window.innerWidth <= 480; // Check for small screens

// //         // Force recalculation of sidebar dimensions to ensure accuracy
// //         sidebar.style.height = 'auto';

// //         // Show button only if the sidebar is expanded and scrollable
// //         if (!isCollapsed && (isScrollable || isSmallScreen)) {
// //             backToTopButton.style.display = 'block';
// //         } else {
// //             backToTopButton.style.display = 'none';
// //         }
// //     }

// //     // Observer to monitor sidebar content changes for the back-to-top button
// //     const observer = new MutationObserver(toggleBackToTopButton);
// //     observer.observe(sidebar, { childList: true, subtree: true });

// //     // Event listener for back-to-top button scroll
// //     backToTopButton.addEventListener('click', () => {
// //         sidebar.scrollTo({ top: 0, behavior: "smooth" });
// //     });

// //     sidebar.addEventListener('touchstart', () => {
// //         if (!sidebar.classList.contains('collapsed')) {
// //             toggleBackToTopButton();
// //         }
// //     }, { passive: false });


// //     // Sidebar minimize/expand button logic
// //     function toggleBackToTopButton() {
// //         const isCollapsed = sidebar.classList.contains('collapsed'); // Sidebar is minimized
// //         const isScrollable = sidebar.scrollHeight > sidebar.clientHeight; // Sidebar has overflow
// //         const isSmallScreen = window.innerWidth <= 480; // Check for small screens

// //         // Always hide the button when the sidebar is collapsed
// //         if (isCollapsed) {
// //             backToTopButton.style.display = 'none';
// //             return;
// //         }

// //         // On small screens, show the button only if the sidebar is scrollable
// //         if (isSmallScreen) {
// //             if (isScrollable) {
// //                 backToTopButton.style.display = 'block';
// //             } else {
// //                 backToTopButton.style.display = 'none';
// //             }
// //             return;
// //         }

// //         // On larger screens, show the button only if the sidebar is expanded and scrollable
// //         if (isScrollable) {
// //             backToTopButton.style.display = 'block';
// //         } else {
// //             backToTopButton.style.display = 'none';
// //         }
// //     }

// //     document.getElementById('minimize-sidebar').addEventListener('click', () => {
// //         sidebar.classList.toggle('collapsed');

// //         // Reset sidebar scroll state after minimizing or reopening
// //         if (!sidebar.classList.contains('collapsed')) {
// //             sidebar.scrollTo(0, 0); // Reset to the top
// //         }

// //         // Use a delay to recalculate dimensions accurately after transition
// //         setTimeout(() => {
// //             toggleBackToTopButton();
// //         }, 200); // Match with the CSS transition duration if needed

// //         // Update the minimize icon based on sidebar state
// //         const minimizeIcon = document.getElementById('minimize-sidebar').querySelector('i');
// //         if (sidebar.classList.contains('collapsed')) {
// //             minimizeIcon.classList.remove('fa-chevron-up');
// //             minimizeIcon.classList.add('fa-chevron-down');
// //         } else {
// //             minimizeIcon.classList.remove('fa-chevron-down');
// //             minimizeIcon.classList.add('fa-chevron-up');
// //         }
// //     });

// //     sidebar.addEventListener('touchstart', (event) => {
// //         if (!sidebar.classList.contains('collapsed')) {
// //             toggleBackToTopButton();
// //         }
// //     }, { passive: false });

// //     sidebar.addEventListener('touchend', () => {
// //         toggleBackToTopButton();
// //     }, { passive: true });



// //     let sessionStartingView = null;
// //     // let previousRegionView = null;

// //     // Configure the "Back" button
// //     backButton.id = 'back-button';
// //     backButton.classList.add('round-button');
// //     backButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
// //     backButton.style.display = 'none';
// //     document.querySelector('.sidebar-header').appendChild(backButton);

// //     function resetToSessionView() {
// //         if (sessionStartingView) {
// //             const isMobile = window.innerWidth <= 780;
// //             const zoomLevel = isMobile ? sessionStartingView.zoom - 1 : sessionStartingView.zoom;

// //             map.flyTo({
// //                 center: sessionStartingView.center,
// //                 zoom: zoomLevel,
// //                 pitch: sessionStartingView.pitch,
// //                 bearing: sessionStartingView.bearing
// //             });

// //             backButton.style.display = 'none';
// //             gtLogo.style.display = 'block';
// //             sessionStartingView = null;
// //         }
// //     }

// //     backButton.addEventListener('click', resetToSessionView);

// //     //Map Resize on Load and Window Resize
// //     window.addEventListener("load", () => map.resize());
// //     map.on("load", () => setTimeout(() => map.resize(), 100));
// //     window.addEventListener("resize", () => map.resize());

// //     // Function to add geoJSON data sources to the map
// //     // function addGeoJSONSource(map, sourceId, filePath, promoteId) {
// //     //     map.addSource(sourceId, {
// //     //         type: 'geojson',
// //     //         data: filePath,
// //     //         promoteId: promoteId
// //     //     });
// //     // }


// //     // Function to add a GeoJSON source to the map
// //     function addGeoJSONSource(map, sourceId, dataUrl, promoteId) {
// //         console.log(`Attempting to add source: ${sourceId}`);
// //         if (!map.getSource(sourceId)) {
// //             map.addSource(sourceId, {
// //                 type: 'geojson',
// //                 data: dataUrl,
// //                 promoteId: promoteId,
// //             });
// //             console.log(`Source with ID "${sourceId}" added successfully.`);
// //         } else {
// //             console.warn(`Source with ID "${sourceId}" already exists. Skipping addition.`);
// //         }
// //         console.log('Current sources:', map.getStyle().sources);
// //     }

// //     // Adjust sidebar height based on content size
// //     function adjustSidebarHeight() {
// //         const sidebar = document.getElementById('hospital-list-sidebar');
// //         const hospitalList = document.getElementById('hospital-list');

// //         // Check if content fits without overflow
// //         if (hospitalList.scrollHeight <= sidebar.clientHeight) {
// //             sidebar.classList.add('auto-height');
// //         } else {
// //             sidebar.classList.remove('auto-height');
// //         }
// //     }

// //     //populateSidebar function.
// //     function populateSidebar(regionId, regionName, facilities) {
// //         console.log(`Populating sidebar for region: ${regionName} (ID: ${regionId})`);

// //         const sidebar = document.getElementById('hospital-list-sidebar');
// //         const list = document.getElementById('hospital-list');
// //         list.innerHTML = '';

// //         // Update sidebar title with the region name
// //         const title = sidebar.querySelector('h2');
// //         title.innerText = `Facilities Using Goliath's Solutions in ${regionName}`;

// //         // Remove any existing count display
// //         const existingCountDisplay = sidebar.querySelector('.count-display');
// //         if (existingCountDisplay) existingCountDisplay.remove();

// //         // Filter facilities by region
// //         const regionHospitals = facilities.filter(hospital =>
// //             hospital.location.includes(regionName) || hospital.region_id === regionId
// //         );

// //         // Calculate total facility count, accounting for multi-hospital entries
// //         const totalHospitalCount = regionHospitals.reduce((sum, hospital) =>
// //             sum + (hospital.hospital_count || 1), 0
// //         );

// //         console.log(`Found ${regionHospitals.length} hospitals in ${regionName} with a total of ${totalHospitalCount} facilities.`);

// //         // Display total facility count in the sidebar
// //         const countDisplay = document.createElement('p');
// //         countDisplay.classList.add('count-display');
// //         countDisplay.innerHTML = `Total Facilities: <span style="color: #ff8502;">${totalHospitalCount}</span>`;
// //         countDisplay.style.fontWeight = 'bold';
// //         countDisplay.style.color = '#FFFFFF';
// //         countDisplay.style.marginTop = '10px';
// //         list.before(countDisplay);

// //         // Populate sidebar list with hospitals
// //         regionHospitals.forEach(hospital => {
// //             const listItem = document.createElement('li');

// //             // Select the appropriate EHR logo based on the ehr_system value
// //             let ehrLogo;
// //             switch (hospital.ehr_system) {
// //                 case 'Cerner':
// //                     ehrLogo = '<img src="./img/cerner-logo.png" alt="Cerner logo" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 5px; border-radius: 50%;">';
// //                     break;
// //                 case 'Epic':
// //                     ehrLogo = '<img src="./img/epic-logo.png" alt="Epic logo" style="width: 20px; height: 18px; vertical-align: middle; margin-right: 5px;">';
// //                     break;
// //                 case 'Meditech':
// //                     ehrLogo = '<img src="./img/meditech-logo.png" alt="Meditech logo" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 5px; border-radius: 50%;">';
// //                     break;
// //                 default:
// //                     ehrLogo = '';
// //                     break;
// //             }

// //             listItem.innerHTML = `
// //     <i class="fas fa-hospital-symbol"></i> 
// //     <strong class="clickable-hospital" style="cursor: pointer; color: #add8e6;">
// //         ${hospital.hospital_name}
// //     </strong><br>
// //     ${hospital.parent_company ? `<strong>Parent Company:</strong> ${hospital.parent_company}<br>` : ""}
// //     ${hospital.location}<br>
// //     <div><strong>EHR System:</strong> ${ehrLogo} ${hospital.ehr_system !== "Epic" ? hospital.ehr_system : ""}</div>
// //     <div><strong>Hospital Count:</strong> ${hospital.hospital_count || 1}</div>
// // `;

// //             // Add fly-to functionality and show Back button on click
// //             listItem.querySelector('.clickable-hospital').addEventListener('click', () => {
// //                 if (!sessionStartingView) {
// //                     sessionStartingView = {
// //                         center: map.getCenter(),
// //                         zoom: map.getZoom(),
// //                         pitch: map.getPitch(),
// //                         bearing: map.getBearing()
// //                     };
// //                 }

// //                 // Hide GT logo, show back button, and fly to selected facility location
// //                 gtLogo.style.display = 'none';
// //                 backButton.style.display = 'block';

// //                 // Set a mobile-friendly zoom level
// //                 const isMobile = window.innerWidth <= 780;
// //                 const zoomLevel = isMobile ? 10 : 12;

// //                 // Fly to the selected facility location
// //                 //                     Fly-To Functionality on Facility Click
// //                 // The fly-to functionality is implemented well, creating a smooth transition to the selected hospital’s location. Setting the mobile zoom level with const zoomLevel = isMobile ? 10 : 12; makes it user-friendly across devices.
// //                 // The pitch and bearing values help in adding a sense of depth. If performance is a concern on some devices, consider testing with or without these to evaluate their impact.

// //                 map.flyTo({
// //                     center: [hospital.longitude, hospital.latitude],
// //                     zoom: 12,
// //                     pitch: 45,
// //                     bearing: 0,
// //                     essential: true
// //                 });
// //             });

// //             list.appendChild(listItem);
// //         });

// //         // Display the sidebar only if there are hospitals to show
// //         sidebar.style.display = regionHospitals.length > 0 ? 'block' : 'none';

// //         adjustSidebarHeight();
// //     }

// //     // Define a centralized error message handler
// //     function displayErrorMessage(error) {
// //         console.error('Error loading facilities data:', error);
// //         const errorMessage = document.getElementById('error-message');
// //         if (errorMessage) {
// //             errorMessage.style.display = 'block';
// //             errorMessage.innerText = 'Failed to load facility data. Please try again later.';
// //         }
// //     }

// //     //Sets up a click event for a specified region layer.
// //     //On click, fetches and displays facility data in the sidebar for the clicked region.
// //     //@param {string} regionSource - The source layer ID for the map region.
// //     //@param {string} regionIdProp - The property name in geoJSON data that represents the region ID.
// //     //@param {string} regionNameProp - The property name in geoJSON data that represents the region name.

// //     function setRegionClickEvent(regionSource, regionIdProp, regionNameProp) {
// //         map.on('click', `${regionSource}-fill`, (e) => {
// //             const clickedRegionId = e.features[0].properties[regionIdProp];
// //             const regionName = e.features[0].properties[regionNameProp];
// //             console.log(`Region clicked: ${regionName} (ID: ${clickedRegionId})`);

// //             // Use cached facilities data if available
// //             loadFacilitiesData()
// //                 .then(facilities => {
// //                     // Filter facilities for the clicked region
// //                     const filteredFacilities = facilities.filter(facility =>
// //                         facility.region_id && facility.region_id.toUpperCase() === clickedRegionId.toUpperCase()
// //                     );

// //                     // Pass filtered facilities to populateSidebar
// //                     populateSidebar(clickedRegionId, regionName, filteredFacilities);
// //                 })
// //                 .catch(error => {
// //                     console.error('Error fetching facilities data:', error);
// //                     displayErrorMessage(error);
// //                 });
// //         });
// //     }

// //     //Map Load Event and Fog Setting
// //     map.on('load', () => {
// //         map.setFog({});

// //         // // Use the addGeoJSONSource function to add each region's data source
// //         // addGeoJSONSource(map, 'us-states', '/data/us-states.geojson', 'id');
// //         // addGeoJSONSource(map, 'uk-regions', '/data/uk-regions.geojson', 'id');
// //         // addGeoJSONSource(map, 'canada-regions', '/data/canada-regions.geojson', 'id');
// //         // addGeoJSONSource(map, 'aruba-region', '/data/aruba-region.geojson', 'id');
// //         // addGeoJSONSource(map, 'italy-regions', '/data/italy-regions.geojson', 'id');

// //         // Use the addGeoJSONSource function to add each region's data source
// //         const sources = [
// //             { id: 'us-states', url: '/data/us-states.geojson' },
// //             { id: 'uk-regions', url: '/data/uk-regions.geojson' },
// //             { id: 'canada-regions', url: '/data/canada-regions.geojson' },
// //             { id: 'aruba-region', url: '/data/aruba-region.geojson' },
// //             { id: 'italy-regions', url: '/data/italy-regions.geojson' },
// //         ];

// //         sources.forEach(({ id, url }) => {
// //             if (!map.getSource(id)) {
// //                 addGeoJSONSource(map, id, url, 'id');
// //             }
// //         });

// //         //Initialize Facilities Data and Set Variables
// //         let facilitiesData = [];
// //         const regionsWithFacilities = new Set();
// //         const statesWithFacilities = new Set();
// //         let selectedStateId = null;
// //         const logoUrl = './img/gtLogo.png';

// //         // imported loadFacilitiesData function

// //         loadFacilitiesData()
// //             .then(facilities => {
// //                 facilitiesData = facilities;

// //                 // regionsWithFacilities and statesWithFacilities sets
// //                 facilities.forEach(facility => {
// //                     const regionId = facility.region_id ? facility.region_id.toUpperCase() : null;
// //                     if (regionId) {
// //                         regionsWithFacilities.add(regionId);
// //                     }

// //                     const stateOrRegion = facility.location.split(', ')[1];
// //                     if (stateOrRegion) {
// //                         statesWithFacilities.add(stateOrRegion);
// //                     }
// //                 });

// //                 // console.log("Facilities data loaded:", facilitiesData); // Debug

// //                 console.log("regionsWithFacilities:", Array.from(regionsWithFacilities));

// //                 // Define regions dynamically
// //                 const layerRegions = [
// //                     { layerId: 'us-states', sourceId: 'us-states' },
// //                     { layerId: 'canada-regions', sourceId: 'canada-regions' },
// //                     { layerId: 'aruba-region', sourceId: 'aruba-region' },
// //                     { layerId: 'italy-regions', sourceId: 'italy-regions' },
// //                     { layerId: 'uk-regions', sourceId: 'uk-regions' },
// //                 ];
// //                 // Loop through each region to process layers and interactions
// //                 layerRegions.forEach(({ layerId, sourceId }) => {
// //                     console.log(`Processing region: ${layerId}`);

// //                     // Remove existing layers if present
// //                     if (map.getLayer(`${layerId}-fill`)) {
// //                         console.warn(`Removing existing layer: ${layerId}-fill`);
// //                         map.removeLayer(`${layerId}-fill`);
// //                     }
// //                     if (map.getLayer(`${layerId}-line-hover`)) {
// //                         console.warn(`Removing existing layer: ${layerId}-line-hover`);
// //                         map.removeLayer(`${layerId}-line-hover`);
// //                     }

// //                     // Add region layer and hover outline
// //                     addRegionLayer(map, layerId, sourceId, regionsWithFacilities);
// //                     addHoverOutlineLayer(map, `${layerId}-line-hover`, sourceId);

// //                     // Set click events and interactions
// //                     setRegionClickEvent(sourceId, 'id', 'name');
// //                     addRegionInteractions(map, `${layerId}-fill`, sourceId, regionsWithFacilities);
// //                 });


// //                 // // region click events for the sidebar
// //                 // setRegionClickEvent('canada-regions', 'id', 'name');
// //                 // setRegionClickEvent('uk-regions', 'id', 'name');
// //                 // setRegionClickEvent('italy-regions', 'id', 'name');
// //                 // setRegionClickEvent('aruba-region', 'id', 'name');
// //                 // setRegionClickEvent('us-states', 'id', 'name');

// //                 // addRegionInteractions(map, 'us-states-fill', 'us-states', regionsWithFacilities);
// //                 // addRegionInteractions(map, 'canada-regions-fill', 'canada-regions', regionsWithFacilities);
// //                 // addRegionInteractions(map, 'aruba-region-fill', 'aruba-region', regionsWithFacilities);
// //                 // addRegionInteractions(map, 'italy-regions-fill', 'italy-regions', regionsWithFacilities);
// //                 // addRegionInteractions(map, 'uk-regions-fill', 'uk-regions', regionsWithFacilities);

// //                 // // Usage for different regions
// //                 // addRegionLayer(map, 'us-states', 'us-states', regionsWithFacilities);
// //                 // addRegionLayer(map, 'canada-regions', 'canada-regions', regionsWithFacilities);
// //                 // addRegionLayer(map, 'aruba-region', 'aruba-region', regionsWithFacilities);
// //                 // addRegionLayer(map, 'italy-regions', 'italy-regions', regionsWithFacilities);
// //                 // addRegionLayer(map, 'uk-regions', 'uk-regions', regionsWithFacilities);


// //                 // markers for each facility
// //                 let markers = facilities.map(({ ehr_system, hospital_name, location, hospital_address, longitude, latitude, parent_company, hospital_count }) => {
// //                     let popupContent = `
// // // <strong>${hospital_name}</strong><br>
// // <strong style="color: #05aaff">${location}</strong><br>
// // ${parent_company ? `Parent Company: ${parent_company}<br>` : ""}
// // EHR System: <strong style="color: #0f2844">${ehr_system}</strong><br>
// // Address: ${hospital_address}<br>
// // Hospital Count: <strong>${hospital_count}</strong>
// // `;
// //                     // "note" If this is the CommonSpirit Health Headquarters
// //                     if (hospital_name === "CommonSpirit Health Headquarters") {
// //                         popupContent += `<br><strong style="color: #ff8502">Note:</strong> CommonSpirit Health operates over 140 hospitals across 21 states. 
// // <a href="https://www.commonspirit.org/" target="_blank" style="color: #06b4fd">Visit Website</a>`;
// //                     }

// //                     const popup = new mapboxgl.Popup({ offset: 15, closeButton: false })
// //                         .setHTML(popupContent);

// //                     // Create a custom marker element
// //                     const markerElement = document.createElement('div');
// //                     markerElement.className = 'custom-marker';
// //                     markerElement.style.backgroundImage = `url(${logoUrl})`;
// //                     markerElement.style.width = '20px';
// //                     markerElement.style.height = '20px';
// //                     markerElement.style.borderRadius = '50%';
// //                     markerElement.style.backgroundSize = 'cover';

// //                     const marker = new mapboxgl.Marker(markerElement)
// //                         .setLngLat([longitude, latitude])
// //                         .setPopup(popup)
// //                         .addTo(map);

// //                     // specific hover behavior based on the hospital name
// //                     if (hospital_name !== "CommonSpirit Health Headquarters") {
// //                         // Standard behavior: show/hide popup on hover
// //                         marker.getElement().addEventListener('mouseenter', () => popup.addTo(map));
// //                         marker.getElement().addEventListener('mouseleave', () => popup.remove());
// //                     } else {
// //                         // For CommonSpirit Headquarters, keep popup open on click
// //                         marker.getElement().addEventListener('click', (e) => {
// //                             e.stopPropagation();
// //                             popup.addTo(map);
// //                         });
// //                     }

// //                     return marker;
// //                 });

// //                 // show regions and states
// //                 function addRegionLayer(map, layerId, sourceId, regionsWithFacilities) {
// //                     const hoverColor = '#05aaff';
// //                     const selectedColor = '#ff8502';

// //                     if (map.getLayer(`${layerId}-fill`)) {
// //                         console.warn(`Layer with id "${layerId}-fill" already exists. Skipping addition.`);
// //                         return;
// //                     }

// //                     map.addLayer({
// //                         id: `${layerId}-fill`,
// //                         type: 'fill',
// //                         source: sourceId,
// //                         paint: {
// //                             'fill-color': [
// //                                 'case',
// //                                 // Apply selected color if the region is selected and has facilities
// //                                 ['all', ['boolean', ['feature-state', 'selected'], false], ['in', ['get', 'id'], ['literal', Array.from(regionsWithFacilities)]]], selectedColor,
// //                                 // Apply hover color if the region is hovered and has facilities
// //                                 ['all', ['boolean', ['feature-state', 'hover'], false], ['in', ['get', 'id'], ['literal', Array.from(regionsWithFacilities)]]], hoverColor,
// //                                 // Default color for regions without facilities
// //                                 '#d3d3d3'
// //                             ],
// //                             'fill-opacity': 0.5
// //                         }
// //                     });
// //                 }


// //                 function addHoverOutlineLayer(map, layerId, sourceId) {
// //                     if (map.getLayer(layerId)) {
// //                         console.warn(`Layer with id "${layerId}" already exists. Skipping addition.`);
// //                         return;
// //                     }

// //                     if (map.getLayer(`${layerId}-glow`)) {
// //                         console.warn(`Glow layer with id "${layerId}-glow" already exists. Skipping addition.`);
// //                         return;
// //                     }

// //                     map.addLayer({
// //                         id: layerId,
// //                         type: 'line',
// //                         source: sourceId,
// //                         paint: {
// //                             // 'line-color': '#FFFFFF',
// //                             // 'line-width': [
// //                             //     'case',
// //                             //     ['boolean', ['feature-state', 'hover'], false],
// //                             //     2,  // Thicker line for hover
// //                             //     0.6 // Default line width
// //                             // ]

// //                             'line-color': '#00FF00', // Bright green for better visibility
// //                             'line-width': [
// //                                 'case',
// //                                 ['boolean', ['feature-state', 'hover'], false],
// //                                 3, // Wider line width when hovered
// //                                 1  // Thinner line width when not hovered
// //                             ]
// //                         }
                       
// //                     });

// //                     map.addLayer({
// //                         id: `${layerId}-glow`,
// //                         type: 'line',
// //                         source: sourceId,
// //                         paint: {
// //                             // 'line-color': 'rgba(255, 255, 255, 0.3)', // White glow
// //                             // 'line-width': 2, // Larger width for glow effect
// //                             // 'line-blur': 2   // Blur for glow

// //                             'line-color': 'rgba(255, 0, 0, 0.6)', // Red glow with 60% opacity
// //                             'line-width': 8,                     // Larger line width for better visibility
// //                             'line-blur': 4                       // Blur for a glowing effect
// //                         }
// //                     });
// //                 }

// //                 // Define regions
// //                 // const regions = [
// //                 //     { layerId: 'us-states', sourceId: 'us-states' },
// //                 //     { layerId: 'canada-regions', sourceId: 'canada-regions' },
// //                 //     { layerId: 'aruba-region', sourceId: 'aruba-region' },
// //                 //     { layerId: 'italy-regions', sourceId: 'italy-regions' },
// //                 //     { layerId: 'uk-regions', sourceId: 'uk-regions' },
// //                 // ];

// //                 // regions.forEach(({ layerId, sourceId }) => {
// //                 //     console.log(`Processing region: ${layerId}`);
// //                 //     if (map.getLayer(`${layerId}-fill`)) {
// //                 //         console.warn(`Layer with id "${layerId}-fill" already exists. Removing before re-adding.`);
// //                 //         map.removeLayer(`${layerId}-fill`);
// //                 //     }
// //                 //     addRegionLayer(map, layerId, sourceId, regionsWithFacilities);
// //                 //     addHoverOutlineLayer(map, `${layerId}-line-hover`, sourceId);
// //                 // });


// //                 ['us-states', 'canada-regions', 'aruba-region', 'italy-regions', 'uk-regions'].forEach(region => {
// //                     console.log(`Applying styles for ${region}`);
// //                     addHoverOutlineLayer(map, `${region}-line-hover`, region);
// //                     addRegionLayer(map, region, region, regionsWithFacilities);
// //                     addRegionInteractions(map, `${region}-fill`, region, regionsWithFacilities);
// //                 });

// //                 console.log(map.getSource('us-states'));
// //                 console.log(map.getLayer('us-states-fill'));
// //                 console.log(map.getLayer('us-states-line-hover'));

// //                 console.log('Current layer order:', map.getStyle().layers.map(layer => layer.id));

// //                 console.log('Facilities Data:', facilitiesData);

// //                 addGeoJSONSource(map, 'us-states', '/data/us-states.geojson', 'id');
// //                 console.log("Sources after adding 'us-states':", map.getStyle().sources);



// //                 //Function for Zoom-Based Marker Visibility
// //                 function toggleMarkers() {
// //                     const zoomLevel = map.getZoom();
// //                     const minZoomToShowMarkers = 4;

// //                     markers.forEach(marker => {
// //                         if (zoomLevel >= minZoomToShowMarkers && !marker._map) {
// //                             marker.addTo(map);
// //                         } else if (zoomLevel < minZoomToShowMarkers && marker._map) {
// //                             marker.remove();
// //                         }
// //                     });
// //                 }

// //                 // Attach 'zoomend' event to adjust markers based on zoom level
// //                 map.on('zoomend', toggleMarkers);

// //                 // Initial call to set visibility based on the starting zoom level
// //                 toggleMarkers();

// //                 //Cluster Source and Layer Styling
// //                 // Set up cluster source for hospitals
// //                 map.addSource('hospitals', {
// //                     type: 'geojson',
// //                     data: {
// //                         type: 'FeatureCollection',
// //                         features: facilities.map(facility => ({
// //                             type: 'Feature',
// //                             properties: {
// //                                 hospital_name: facility.hospital_name,
// //                                 location: facility.location,
// //                                 ehr_system: facility.ehr_system,
// //                                 hospital_address: facility.hospital_address,
// //                                 hospital_parent_company: facility.parent_company,
// //                                 hospital_hospital_count: facility.hospital_count,
// //                             },
// //                             geometry: {
// //                                 type: 'Point',
// //                                 coordinates: [facility.longitude, facility.latitude],
// //                             }
// //                         })),
// //                     },
// //                     cluster: true,
// //                     clusterMaxZoom: 12,// To increase this value to reduce unclustered points at higher zoom levels
// //                     clusterRadius: 60,// To increase radius to group more points together in clusters
// //                 });

// //                 // Cluster layer with Goliath Technologies colors and outline for better visibility
// //                 map.addLayer({
// //                     id: 'clusters',
// //                     type: 'circle',
// //                     source: 'hospitals',
// //                     filter: ['has', 'point_count'],
// //                     paint: {
// //                         'circle-color': [
// //                             'step',
// //                             ['get', 'point_count'],
// //                             '#ff8502',  // Small clusters (dark blue)
// //                             // '#b31919',  // Small clusters (red) 
// //                             10, ' #0f2844'  // Medium and large clusters (orange)
// //                         ],
// //                         'circle-radius': [
// //                             'step',
// //                             ['get', 'point_count'],
// //                             10,   // Small clusters
// //                             20, 15, // Medium clusters
// //                             50, 20 // Large clusters (reduced size)
// //                         ],
// //                         'circle-stroke-width': 1, // Add a thin outline
// //                         'circle-stroke-color': '#0f2844' // Dark blue outline for consistency
// //                     }
// //                 });

// //                 // Cluster count layer
// //                 map.addLayer({
// //                     id: 'cluster-count',
// //                     type: 'symbol',
// //                     source: 'hospitals',
// //                     filter: ['has', 'point_count'],
// //                     layout: {
// //                         'text-field': '{point_count_abbreviated}',
// //                         'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
// //                         'text-size': 14,
// //                         'text-anchor': 'center',
// //                     },
// //                     paint: {
// //                         'text-color': '#FFFFFF',
// //                     },
// //                 });

// //                 // Unclustered point layer
// //                 map.addLayer({
// //                     id: 'unclustered-point',
// //                     type: 'circle',
// //                     source: 'hospitals',
// //                     filter: ['!', ['has', 'point_count']],
// //                     paint: {
// //                         'circle-color': '#11b4da',
// //                         'circle-radius': 3,
// //                     },
// //                 });

// //                 map.on('zoom', () => {
// //                     map.setLayoutProperty('unclustered-point', 'visibility', map.getZoom() >= 6 ? 'visible' : 'none');
// //                 });

// //                 // Click event to show facility information in popup
// //                 map.on('click', 'unclustered-point', (e) => {
// //                     const coordinates = e.features[0].geometry.coordinates.slice();
// //                     const { hospital_name, location, ehr_system, hospital_address } = e.features[0].properties;

// //                     new mapboxgl.Popup()
// //                         .setLngLat(coordinates)
// //                         .setHTML(`<strong>${hospital_name}</strong><br>${location}<br>EHR System: ${ehr_system}<br>Address: ${hospital_address}`)
// //                         .addTo(map);
// //                 });

// //                 // Cluster click event for expanding zoom level
// //                 map.on('click', 'clusters', (e) => {
// //                     const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
// //                     const clusterId = features[0].properties.cluster_id;
// //                     map.getSource('hospitals').getClusterExpansionZoom(clusterId, (err, zoom) => {
// //                         if (err) return;
// //                         map.easeTo({
// //                             center: features[0].geometry.coordinates,
// //                             zoom: zoom,
// //                         });
// //                     });
// //                 });

// //                 // Click event on state to display sidebar list of facilities
// //                 map.on('click', 'us-states-fill', (e) => {
// //                     const clickedStateId = e.features[0].properties.id;

// //                     // Check if the clicked state has facilities
// //                     if (!statesWithFacilities.has(clickedStateId)) {
// //                         // Hide sidebar if state doesn't have facilities
// //                         document.getElementById('hospital-list-sidebar').style.display = 'none';

// //                         // Deselect previously selected state if any
// //                         if (selectedStateId !== null) {
// //                             map.setFeatureState({ source: 'us-states', id: selectedStateId }, { selected: false });
// //                         }
// //                         selectedStateId = null;
// //                         return;
// //                     }

// //                     // Deselect previously selected state
// //                     if (selectedStateId !== null) {
// //                         map.setFeatureState({ source: 'us-states', id: selectedStateId }, { selected: false });
// //                     }

// //                     // Set the clicked state as selected
// //                     selectedStateId = clickedStateId;
// //                     map.setFeatureState({ source: 'us-states', id: selectedStateId }, { selected: true });

// //                     // Display facilities in the sidebar
// //                     const stateName = e.features[0].properties.name;
// //                     const stateHospitals = facilities.filter(hospital => hospital.location.includes(clickedStateId));

// //                     const sidebar = document.getElementById('hospital-list-sidebar');
// //                     const list = document.getElementById('hospital-list');
// //                     list.innerHTML = '';

// //                     // Update sidebar title with state name
// //                     const title = sidebar.querySelector('h2');
// //                     title.innerText = `Facilities Using Goliath's Solutions in ${stateName}`;

// //                     // Remove any existing count display
// //                     const existingCountDisplay = sidebar.querySelector('.count-display');
// //                     if (existingCountDisplay) existingCountDisplay.remove();

// //                     // Calculate the total facility count for the clicked state
// //                     const totalFacilityCount = stateHospitals.reduce((sum, hospital) => sum + (hospital.hospital_count || 1), 0);

// //                     // Display facility count
// //                     const countDisplay = document.createElement('p');
// //                     countDisplay.classList.add('count-display');
// //                     // countDisplay.innerHTML = `Total Facilities: <span style="color: #ff8502;">${stateHospitals.length}</span>`;

// //                     // Update the sidebar count display to show the actual number of facilities
// //                     countDisplay.innerHTML = `Total Facilities: <span style="color: #ff8502;">${totalFacilityCount}</span>`;
// //                     countDisplay.style.fontWeight = 'bold';
// //                     countDisplay.style.color = '#FFFFFF';
// //                     countDisplay.style.marginTop = '10px';
// //                     list.before(countDisplay);

// //                     if (stateHospitals.length > 0) {
// //                         stateHospitals.forEach(hospital => {
// //                             const listItem = document.createElement('li');

// //                             // Select the appropriate EHR logo based on the ehr_system value
// //                             let ehrLogo;
// //                             switch (hospital.ehr_system) {
// //                                 case 'Cerner':
// //                                     ehrLogo = '<img src="./img/cerner-logo.png" alt="Cerner logo" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 5px; border-radius: 50%;">';
// //                                     break;
// //                                 case 'Epic':
// //                                     ehrLogo = `<img src="./img/epic-logo.png" alt="Epic logo" style="width: 20px; height: 18px; vertical-align: middle; margin-right: 5px;">`;
// //                                     break;
// //                                 case 'Meditech':
// //                                     ehrLogo = '<img src="./img/meditech-logo.png" alt="Meditech logo" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 5px; border-radius: 50%;">';
// //                                     break;
// //                                 default:
// //                                     ehrLogo = '';
// //                                     break;
// //                             }

// //                             listItem.innerHTML = `
// //     <div>
// //         <i class="fas fa-hospital-symbol"></i> 
// //         <strong class="clickable-hospital" style="cursor: pointer; color: #add8e6;">
// //             ${hospital.hospital_name}
// //         </strong>
// //     </div>
// //     ${hospital.parent_company ? `<div><strong>Parent Company:</strong> ${hospital.parent_company}</div>` : ""}
// //     <div>${hospital.location}</div>
// //     <div><strong>EHR System:</strong> ${ehrLogo} ${hospital.ehr_system !== "Epic" ? hospital.ehr_system : ""}</div>
// //     <div><strong>Hospital Count:</strong> ${hospital.hospital_count || 1}</div>
// // `;
// //                             // Add a special note if this is the CommonSpirit Health Headquarters
// //                             if (hospital.hospital_name === "CommonSpirit Health Headquarters") {
// //                                 listItem.innerHTML += `<br><strong style="color: #ff8502;">Note:</strong> CommonSpirit Health operates over 140 hospitals across 21 states. 
// // <a href="https://www.commonspirit.org/" target="_blank" style="color: #06b4fd;">Visit Website</a>`;
// //                             }

// //                             list.appendChild(listItem);
// //                         });

// //                         sidebar.style.display = 'block';
// //                     } else {
// //                         sidebar.style.display = 'none';
// //                     }

// //                 });

// //             })
// //             .catch(error => {
// //                 console.error('Error loading facilities data:', error);
// //                 const errorMessage = document.getElementById('error-message');
// //                 errorMessage.style.display = 'block';
// //                 errorMessage.innerText = 'Failed to load facility data. Please try again later.';
// //             });

// //         function addRegionInteractions(map, layerId, sourceId, regionsWithFacilities) {
// //             let hoveredRegionId = null;
// //             let selectedRegionId = null;

// //             const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
// //             const hoverEvent = isTouchDevice ? 'touchstart' : 'mousemove';

// //             // Apply hover effect only to regions with facilities
// //             const applyHover = (regionId) => {
// //                 if (hoveredRegionId !== null && hoveredRegionId !== selectedRegionId) {
// //                     map.setFeatureState({ source: sourceId, id: hoveredRegionId }, { hover: false });
// //                 }
// //                 hoveredRegionId = regionId;
// //                 if (hoveredRegionId !== selectedRegionId) {
// //                     map.setFeatureState({ source: sourceId, id: hoveredRegionId }, { hover: true });
// //                 }
// //             };

// //             const clearHover = () => {
// //                 if (hoveredRegionId !== null && hoveredRegionId !== selectedRegionId) {
// //                     map.setFeatureState({ source: sourceId, id: hoveredRegionId }, { hover: false });
// //                 }
// //                 hoveredRegionId = null;
// //             };

// //             // Debounced hover function for non-touch devices
// //             const debouncedHover = debounce((e) => {
// //                 const regionId = e.features[0].id;
// //                 if (regionsWithFacilities.has(regionId)) {
// //                     applyHover(regionId);
// //                 }
// //             }, 50); // 50ms debounce delay


// //             // Tap-to-Hover functionality for touch devices
// //             if (isTouchDevice) {
// //                 map.on('touchstart', layerId, (e) => {
// //                     const regionId = e.features[0].id;

// //                     if (regionsWithFacilities.has(regionId)) {
// //                         if (hoveredRegionId === regionId) {
// //                             // If already hovered, treat it as a click
// //                             selectRegion(regionId);
// //                         } else {
// //                             // Otherwise, just apply hover effect
// //                             applyHover(regionId);
// //                         }
// //                     }
// //                 });

// //                 map.on('touchend', layerId, clearHover);
// //                 map.on('touchcancel', layerId, clearHover);
// //             }

// //             // Regular hover for non-touch devices
// //             map.on(hoverEvent, layerId, (e) => {
// //                 const regionId = e.features[0].id;
// //                 if (regionsWithFacilities.has(regionId)) {
// //                     applyHover(regionId);
// //                 }
// //             });

// //             // Clear hover effect on mouse leave for non-touch devices
// //             if (!isTouchDevice) {
// //                 map.on('mouseleave', layerId, clearHover);
// //             }

// //             // Function to select a region
// //             function selectRegion(regionId) {
// //                 clearRegionSelection(); // Clear previous selection

// //                 selectedRegionId = regionId;
// //                 map.setFeatureState({ source: sourceId, id: selectedRegionId }, { selected: true });

// //                 // Update sidebar for the new selection
// //                 updateSidebarForRegion(regionId);
// //             }

// //             // Handle selection on click
// //             map.on('click', layerId, (e) => {
// //                 const regionId = e.features[0].id;
// //                 if (regionsWithFacilities.has(regionId)) {
// //                     selectRegion(regionId);
// //                 }
// //             });

// //             // Clear selection when clicking outside
// //             map.on('click', (e) => {
// //                 const features = map.queryRenderedFeatures(e.point, { layers: [layerId] });
// //                 if (features.length === 0) {
// //                     clearRegionSelection();
// //                 }
// //             });

// //             // Clear selection and hover states when the sidebar is closed
// //             function clearRegionSelection() {
// //                 clearHover();
// //                 if (selectedRegionId !== null) {
// //                     map.setFeatureState({ source: sourceId, id: selectedRegionId }, { selected: false });
// //                     selectedRegionId = null;
// //                 }
// //             }

// //             // Attach clear function to sidebar close
// //             document.getElementById('close-sidebar').addEventListener('click', clearRegionSelection);

// //             // Placeholder function to update sidebar content based on region selection
// //             function updateSidebarForRegion(regionId) {
// //                 // Logic to show content for the selected region in the sidebar
// //             }
// //         }

// //         // let hoveredPolygonId = null;
// //         // map.on('mousemove', 'us-states-fill', (e) => {
// //         //     if (e.features.length > 0) {
// //         //         if (hoveredPolygonId !== null) {
// //         //             map.setFeatureState({ source: 'us-states', id: hoveredPolygonId }, { hover: false });
// //         //         }
// //         //         hoveredPolygonId = e.features[0].id;
// //         //         map.setFeatureState({ source: 'us-states', id: hoveredPolygonId }, { hover: true });
// //         //     }
// //         // });

// //         // map.on('mouseleave', 'us-states-fill', () => {
// //         //     if (hoveredPolygonId !== null) {
// //         //         map.setFeatureState({ source: 'us-states', id: hoveredPolygonId }, { hover: false });
// //         //     }
// //         //     hoveredPolygonId = null;
// //         // });

// //         // Define the closeSidebar function
// //         function closeSidebar() {
// //             sidebar.style.display = 'none';
// //             if (selectedStateId !== null) {
// //                 map.setFeatureState({ source: 'us-states', id: selectedStateId }, { selected: false });
// //             }
// //             selectedStateId = null;
// //         }
// //         document.getElementById('close-sidebar').addEventListener('click', closeSidebar);


// //         // Fly-to buttons for navigating regions
// //         document.getElementById("fit-to-usa").addEventListener("click", () => {
// //             map.fitBounds([
// //                 [-165.031128, 65.476793],
// //                 [-81.131287, 26.876143]
// //             ]);
// //         });

// //         // Reset view button on the right side
// //         document.getElementById("reset-view").addEventListener("click", () => {
// //             map.flyTo({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM, pitch: 0 });
// //         });

// //         const regions = {
// //             usa: { center: [-101.714859, 39.710884], zoom: 4, pitch: 45 },
// //             uk: { center: [360.242386, 51.633362], zoom: 4, pitch: 45 },
// //             italy: { center: [12.563553, 42.798676], zoom: 4, pitch: 45 },
// //             canada: { center: [-106.3468, 56.1304], zoom: 4, pitch: 30 },
// //             aruba: { center: [-70.027, 12.5246], zoom: 7, pitch: 45 }
// //         };

// //         function flyToRegion(region) {
// //             const { center, zoom, pitch } = regions[region];
// //             map.flyTo({ center, zoom, pitch });
// //         }

// //         //Attaching event listeners
// //         document.getElementById("fly-to-usa").addEventListener("click", () => flyToRegion('usa'));
// //         document.getElementById("fly-to-uk").addEventListener("click", () => flyToRegion('uk'));
// //         document.getElementById("fly-to-italy").addEventListener("click", () => flyToRegion('italy'));
// //         document.getElementById("fly-to-canada").addEventListener("click", () => flyToRegion('canada'));
// //         document.getElementById("fly-to-aruba").addEventListener("click", () => flyToRegion('aruba'));

// //         // Drag Initialization and Threshold Handling
// //         let isDragging = false;
// //         let startX, startY, initialLeft, initialTop;
// //         const dragThreshold = 5;

// //         // Start Drag Function
// //         function startDrag(e) {
// //             startX = e.touches ? e.touches[0].clientX : e.clientX;
// //             startY = e.touches ? e.touches[0].clientY : e.clientY;
// //             const rect = sidebar.getBoundingClientRect();
// //             initialLeft = rect.left;
// //             initialTop = rect.top;
// //             sidebar.classList.add("dragging");
// //             sidebarHeader.classList.add("grabbing");

// //             isDragging = false;

// //             document.addEventListener("mousemove", handleDrag);
// //             document.addEventListener("mouseup", endDrag);
// //             document.addEventListener("touchmove", handleDrag, { passive: false });
// //             document.addEventListener("touchend", endDrag);
// //         }

// //         // Drag Handling Function
// //         function handleDrag(e) {
// //             const currentX = e.touches ? e.touches[0].clientX : e.clientX;
// //             const currentY = e.touches ? e.touches[0].clientY : e.clientY;
// //             const dx = currentX - startX;
// //             const dy = currentY - startY;

// //             if (!isDragging && Math.abs(dx) + Math.abs(dy) > dragThreshold) {
// //                 isDragging = true;
// //             }

// //             if (isDragging) {
// //                 e.preventDefault();
// //                 sidebar.style.left = `${Math.min(Math.max(0, initialLeft + dx), window.innerWidth - sidebar.offsetWidth)}px`;
// //                 sidebar.style.top = `${Math.min(Math.max(0, initialTop + dy), window.innerHeight - sidebar.offsetHeight)}px`;
// //             }
// //         }

// //         // End Drag Function
// //         function endDrag() {
// //             isDragging = false;
// //             sidebar.classList.remove("dragging");
// //             sidebarHeader.classList.remove("grabbing");

// //             document.removeEventListener("mousemove", handleDrag);
// //             document.removeEventListener("mouseup", endDrag);
// //             document.removeEventListener("touchmove", handleDrag);
// //             document.removeEventListener("touchend", endDrag);
// //         }

// //         // Attach Event Listeners
// //         sidebarHeader.addEventListener("mousedown", startDrag);
// //         sidebarHeader.addEventListener("touchstart", startDrag, { passive: false });

// //         // Adjust Sidebar Visibility Based on Screen Size
// //         function toggleSidebarOnHover(show) {
// //             // Only toggle visibility on small screens (e.g., max-width of 480px)
// //             if (window.innerWidth <= 480) {
// //                 sidebar.style.display = show ? 'block' : 'none';
// //             }
// //         }

// //         // Show sidebar on touch or mouse enter for small screens
// //         sidebar.addEventListener('mouseenter', () => toggleSidebarOnHover(true));
// //         sidebar.addEventListener('touchstart', () => toggleSidebarOnHover(true));

// //         // Remove hiding behavior on `mouseleave` and `touchend`
// //         sidebar.removeEventListener('mouseleave', () => toggleSidebarOnHover(false));
// //         sidebar.removeEventListener('touchend', () => toggleSidebarOnHover(false));

// //         // Close sidebar only when the close button is clicked
// //         document.getElementById("close-sidebar").addEventListener('click', () => {
// //             sidebar.style.display = 'none';
// //         });


// //     })

// // });



// //from november 17.

// //Imports and Mapbox Token Initialization
// import { MAPBOX_TOKEN } from './config.js';
// import { loadFacilitiesData } from './dataLoader.js';
// // import debounce from 'lodash.debounce';
// mapboxgl.accessToken = MAPBOX_TOKEN;

// // Map Initialization on DOMContentLoaded
// document.addEventListener("DOMContentLoaded", () => {
//     const sidebar = document.getElementById("hospital-list-sidebar");
//     const sidebarHeader = document.querySelector(".sidebar-header");
//     const backToTopButton = document.getElementById('back-to-top-button');
//     // const minimizeButton = document.getElementById('minimize-sidebar');

//     sidebar.addEventListener('click', (event) => {
//         event.stopPropagation();
//     });
//     const gtLogo = document.querySelector('.sidebar-logo');
//     const backButton = document.createElement('button');

//     //set the initial view of Mapbox globe
//     const INITIAL_CENTER = [-75.4265, 40.0428]; //The coordinates for 1235 Westlakes Drive, Suite 120, Berwyn, PA 19312, are approximately 40.06361° N latitude and 75.47156° W longitude
//     const INITIAL_ZOOM = 1;

//     const map = new mapboxgl.Map({
//         container: 'map',
//         style: 'mapbox://styles/mapbox/light-v11',
//         projection: 'globe',
//         zoom: INITIAL_ZOOM,
//         center: INITIAL_CENTER,
//     });

//     // Adding navigation controls
//     map.addControl(new mapboxgl.NavigationControl());
//     // map.addControl(new mapboxgl.NavigationControl({ position: 'top-left' }));
//     // map.scrollZoom.disable();

//     // Variables for user interaction detection
//     let userInteracting = false;

//     // spin the globe smoothly when zoomed out
//     function spinGlobe() {
//         if (!userInteracting && map.getZoom() < 5) {
//             const center = map.getCenter();
//             center.lng -= 360 / 240;
//             map.easeTo({ center, duration: 1000, easing: (n) => n });
//         }
//     }

//     // Event listeners for user interaction
//     map.on('mousedown', () => userInteracting = true);
//     map.on('dragstart', () => userInteracting = true);
//     // map.on('moveend', () => spinGlobe());

//     map.on('moveend', () => {
//         spinGlobe(); // 
//         updateMarkers();
//         // console.log('Markers Data:', markersData); // Verify markersData is populated
//     });
    

//     // Start the globe spinning animation
//     spinGlobe();

//     // Map Animation on Load to set the globe to your preferred size and center
//     map.on('load', () => {
//         map.easeTo({
//             center: [-75.4265, 40.0428],
//             // zoom: 0,
//             zoom: 1,
//             duration: 3000,
//             easing: (t) => t * (2 - t)
//         });
//     });

//     // Initial flags to track interaction and visibility states
//     let hasInteracted = false;
//     let isInitialRotation = true;

//     //animated pulsing Dot icon
//     const size = 50;
//     // This implements `StyleImageInterface`
//     // to draw a pulsing dot icon on the map.
//     const pulsingDot = {
//         width: size,
//         height: size,
//         data: new Uint8Array(size * size * 4),

//         // When the layer is added to the map,
//         // get the rendering context for the map canvas.

//         onAdd: function () {
//             const canvas = document.createElement('canvas');
//             canvas.width = this.width;
//             canvas.height = this.height;
//             this.context = canvas.getContext('2d', { willReadFrequently: true });
//             // console.log('Canvas initialized with willReadFrequently:', this.context);
//         },

//         // Call once before every frame where the icon will be used.
//         render: function () {
//             const duration = 1000;
//             const t = (performance.now() % duration) / duration;

//             const radius = (size / 2) * 0.3;
//             const outerRadius = (size / 2) * 0.7 * t + radius;
//             const context = this.context;

//             // Draw the outer circle.
//             context.clearRect(0, 0, this.width, this.height);
//             context.beginPath();
//             context.arc(
//                 this.width / 2,
//                 this.height / 2,
//                 outerRadius,
//                 0,
//                 Math.PI * 2
//             );

//             //Goliath colors
//             // #ff8b1f: A vibrant orange; suitable for the outer circle or stroke.
//             // #0f2844: A dark blue; ideal for the inner circle or border.
//             // #ff0000: Bright red; can be used for the pulsing effect or an accent.
//             // #ffffff: White; perfect for a border or subtle inner detail.

//             context.fillStyle = `rgba(255, 139, 31, ${1 - t})`; // Orange (Outer Circle)
//             context.fill();

//             // Draw the inner circle.
//             context.beginPath();
//             context.arc(
//                 this.width / 2,
//                 this.height / 2,
//                 radius,
//                 0,
//                 Math.PI * 2
//             );
//             context.fillStyle = '#0f2844'; // Dark Blue (Inner Circle)
//             context.strokeStyle = '#ffffff'; // White Border
//             // context.strokeStyle = '#ff0000'; 
//             context.lineWidth = 2 + 4 * (1 - t);
//             context.fill();
//             context.stroke();

//             // Update this image's data with data from the canvas.
//             this.data = context.getImageData(
//                 0,
//                 0,
//                 this.width,
//                 this.height
//             ).data;
//             // console.log('Canvas context:', this.context); // Should not be undefined
//             // console.log('Image data:', context.getImageData(0, 0, this.width, this.height).data); // Check if this runs


//             // Continuously repaint the map, resulting
//             // in the smooth animation of the dot.
//             map.triggerRepaint();

//             // Return `true` to let the map know that the image was updated.
//             return true;
//         }
//     };

//     map.on('load', () => {

//         // console.log('Map loaded.');

//         map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

//         // console.log('Pulsing dot image added.');

//         map.addSource('dot-point', {
//             'type': 'geojson',
//             'data': {
//                 'type': 'FeatureCollection',
//                 'features': [
//                     {
//                         'type': 'Feature',
//                         'geometry': {
//                             'type': 'Point',
//                             'coordinates': [-75.4265, 40.0428] // icon position [lng, lat]
//                         }
//                     }
//                 ]
//             }
//         });

//         // console.log('Source for pulsing dot added.');

//         map.addLayer({
//             'id': 'layer-with-pulsing-dot',
//             'type': 'symbol',
//             'source': 'dot-point',
//             'layout': {
//                 'icon-image': 'pulsing-dot'
//             }
//         });
//         // console.log('Layer for pulsing dot added.');

//     });

//     // Define GT logo markers for specified countries
//     const countries = [
//         { name: 'USA', lngLat: [-80.147085, 30.954096] }, // gt office Near by location
//         { name: 'UK', lngLat: [-1.654816, 52.181932] },
//         { name: 'Aruba', lngLat: [-69.952269, 12.512168] },
//         { name: 'Canada', lngLat: [-106.728058, 57.922142] },
//         { name: 'Italy', lngLat: [12.465363, 42.835192] },
//     ];

//     // Initialize GT logo markers, making them initially visible
//     const gtLogoMarkers = countries.map(country => {
//         const logoElement = document.createElement('div');
//         logoElement.className = 'company-logo';
//         logoElement.style.backgroundImage = 'url(./img/gtLogo.png)';
//         const marker = new mapboxgl.Marker(logoElement, {
//             rotationAlignment: 'map',
//             offset: [0, -15],
//         }).setLngLat(country.lngLat).addTo(map);

//         // Set initial visibility to visible
//         marker.getElement().style.visibility = 'visible';
//         return marker;
//     });

//     // Utility function to safely set layer visibility if the layer exists
//     function setLayerVisibility(layerId, visibility) {
//         if (map.getLayer(layerId)) {
//             map.setLayoutProperty(layerId, 'visibility', visibility);
//         }
//     }

//     // Hide clusters on sourcedata load event to ensure they are hidden initially
//     map.on('sourcedata', (e) => {
//         if (!hasInteracted && e.isSourceLoaded) {
//             // Ensure clusters remain hidden on load
//             setLayerVisibility('clusters', 'none');
//             setLayerVisibility('cluster-count', 'none');
//             setLayerVisibility('unclustered-point', 'none');
//         }
//     });

//     //  initial globe rotation, show GT logos, and ensure clusters are hidden
//     function startInitialRotation() {
//         // isInitialRotation = true;

//         // globe animation with GT logos visible
//         map.easeTo({
//             center: [-75.4265, 40.0428],
//             zoom: 1,
//             duration: 3000,
//             easing: (t) => t * (2 - t),
//         });
//     }

//     // Function to handle first interaction, hiding GT logos and showing clusters
//     function onFirstInteraction() {
//         if (!hasInteracted) {
//             hasInteracted = true;

//             // Hide GT logos permanently after the first interaction
//             gtLogoMarkers.forEach(marker => {
//                 marker.getElement().style.visibility = 'hidden';
//             });

//             // Show clusters to follow their normal functionality
//             setLayerVisibility('clusters', 'visible');
//             setLayerVisibility('cluster-count', 'visible');
//             setLayerVisibility('unclustered-point', 'visible');
//         }
//     }

//     // event listeners to trigger onFirstInteraction only once
//     map.on('mousedown', onFirstInteraction);
//     map.on('zoom', onFirstInteraction);
//     map.on('drag', onFirstInteraction);

//     //initial globe rotation and GT logo display on map load
//     map.on('load', startInitialRotation);

//     // Debounce Function Definition
//     function debounce(func, delay) {
//         let timeout;
//         return function (...args) {
//             clearTimeout(timeout);
//             timeout = setTimeout(() => func.apply(this, args), delay);
//         };
//     }

//     // Geocoder Toggle Setup
//     const geocoderToggle = document.getElementById("toggle-geocoder");
//     const geocoderContainer = document.getElementById("geocoder-container");
//     let geocoder;

//     // Define debounced toggle function
//     const debouncedGeocoderToggle = debounce(() => {
//         // Toggle display for geocoder container and toggle button
//         geocoderContainer.style.display = geocoderContainer.style.display === "none" ? "block" : "none";
//         geocoderToggle.style.display = geocoderContainer.style.display === "none" ? "flex" : "none";

//         // Initialize geocoder only when container is displayed
//         if (!geocoder && geocoderContainer.style.display === "block") {
//             geocoder = new MapboxGeocoder({
//                 accessToken: mapboxgl.accessToken,
//                 mapboxgl: mapboxgl,
//                 marker: {
//                     // color: '#ff8502' // Set GT color
//                     color: 'red'
//                 }
//             });
//             geocoderContainer.appendChild(geocoder.onAdd(map));

//             // Use MutationObserver to detect when the input is added
//             const observer = new MutationObserver(() => {
//                 const geocoderInput = geocoderContainer.querySelector('input[type="text"]');
//                 if (geocoderInput) {
//                     geocoderInput.focus();
//                     observer.disconnect(); // Stop observing once input is found and focused
//                 }
//             });

//             // Observe changes in the geocoderContainer
//             observer.observe(geocoderContainer, { childList: true, subtree: true });
//         } else if (geocoderContainer.style.display === "none" && geocoder) {
//             geocoder.onRemove();
//             geocoder = null;
//         }
//     }, 300);

//     // Event Listener for Geocoder Toggle
//     geocoderToggle.addEventListener("click", (e) => {
//         e.stopPropagation();
//         debouncedGeocoderToggle();
//     });

//     // Outside Click Detection for Geocoder
//     document.addEventListener("click", (event) => {
//         if (!geocoderContainer.contains(event.target) && event.target !== geocoderToggle) {
//             geocoderContainer.style.display = "none";
//             geocoderToggle.style.display = "flex";
//         }
//     });

//     // Check if elements are found
//     if (!sidebar) {
//         console.error("Sidebar element not found!");
//     }
//     if (!backToTopButton) {
//         console.error("Back to Top button not found!");
//     }

//     // Function to toggle the back-to-top button visibility
//     function toggleBackToTopButton() {
//         const isCollapsed = sidebar.classList.contains('collapsed'); // Sidebar is minimized
//         const isScrollable = sidebar.scrollHeight > sidebar.clientHeight; // Sidebar has overflow
//         const isSmallScreen = window.innerWidth <= 480; // Check for small screens

//         // Force recalculation of sidebar dimensions to ensure accuracy
//         sidebar.style.height = 'auto';

//         // Show button only if the sidebar is expanded and scrollable
//         if (!isCollapsed && (isScrollable || isSmallScreen)) {
//             backToTopButton.style.display = 'block';
//         } else {
//             backToTopButton.style.display = 'none';
//         }
//     }

//     // Observer to monitor sidebar content changes for the back-to-top button
//     const observer = new MutationObserver(toggleBackToTopButton);
//     observer.observe(sidebar, { childList: true, subtree: true });

//     // Event listener for back-to-top button scroll
//     backToTopButton.addEventListener('click', () => {
//         sidebar.scrollTo({ top: 0, behavior: "smooth" });
//     });

//     sidebar.addEventListener('touchstart', () => {
//         if (!sidebar.classList.contains('collapsed')) {
//             toggleBackToTopButton();
//         }
//     }, { passive: false });


//     // Sidebar minimize/expand button logic
//     function toggleBackToTopButton() {
//         const isCollapsed = sidebar.classList.contains('collapsed'); // Sidebar is minimized
//         const isScrollable = sidebar.scrollHeight > sidebar.clientHeight; // Sidebar has overflow
//         const isSmallScreen = window.innerWidth <= 480; // Check for small screens

//         // Always hide the button when the sidebar is collapsed
//         if (isCollapsed) {
//             backToTopButton.style.display = 'none';
//             return;
//         }

//         // On small screens, show the button only if the sidebar is scrollable
//         if (isSmallScreen) {
//             if (isScrollable) {
//                 backToTopButton.style.display = 'block';
//             } else {
//                 backToTopButton.style.display = 'none';
//             }
//             return;
//         }

//         // On larger screens, show the button only if the sidebar is expanded and scrollable
//         if (isScrollable) {
//             backToTopButton.style.display = 'block';
//         } else {
//             backToTopButton.style.display = 'none';
//         }
//     }

//     document.getElementById('minimize-sidebar').addEventListener('click', () => {
//         sidebar.classList.toggle('collapsed');

//         // Reset sidebar scroll state after minimizing or reopening
//         if (!sidebar.classList.contains('collapsed')) {
//             sidebar.scrollTo(0, 0); // Reset to the top
//         }

//         // Use a delay to recalculate dimensions accurately after transition
//         setTimeout(() => {
//             toggleBackToTopButton();
//         }, 200); // Match with the CSS transition duration if needed

//         // Update the minimize icon based on sidebar state
//         const minimizeIcon = document.getElementById('minimize-sidebar').querySelector('i');
//         if (sidebar.classList.contains('collapsed')) {
//             minimizeIcon.classList.remove('fa-chevron-up');
//             minimizeIcon.classList.add('fa-chevron-down');
//         } else {
//             minimizeIcon.classList.remove('fa-chevron-down');
//             minimizeIcon.classList.add('fa-chevron-up');
//         }
//     });

//     sidebar.addEventListener('touchstart', (event) => {
//         if (!sidebar.classList.contains('collapsed')) {
//             toggleBackToTopButton();
//         }
//     }, { passive: false });

//     sidebar.addEventListener('touchend', () => {
//         toggleBackToTopButton();
//     }, { passive: true });

//     let sessionStartingView = null;
//     // let previousRegionView = null;

//     // Configure the "Back" button
//     backButton.id = 'back-button';
//     backButton.classList.add('round-button');
//     backButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
//     backButton.style.display = 'none';
//     document.querySelector('.sidebar-header').appendChild(backButton);

//     function resetToSessionView() {
//         if (sessionStartingView) {
//             const isMobile = window.innerWidth <= 780;
//             const zoomLevel = isMobile ? sessionStartingView.zoom - 1 : sessionStartingView.zoom;

//             map.flyTo({
//                 center: sessionStartingView.center,
//                 zoom: zoomLevel,
//                 pitch: sessionStartingView.pitch,
//                 bearing: sessionStartingView.bearing
//             });

//             backButton.style.display = 'none';
//             gtLogo.style.display = 'block';
//             sessionStartingView = null;
//         }
//     }

//     backButton.addEventListener('click', resetToSessionView);

//     //Map Resize on Load and Window Resize
//     window.addEventListener("load", () => map.resize());
//     map.on("load", () => setTimeout(() => map.resize(), 100));
//     window.addEventListener("resize", () => map.resize());

//     // Function to add a GeoJSON source to the map
//     function addGeoJSONSource(map, sourceId, dataUrl, promoteId) {
//         console.log(`Attempting to add source: ${sourceId}`);
//         if (!map.getSource(sourceId)) {
//             map.addSource(sourceId, {
//                 type: 'geojson',
//                 data: dataUrl,
//                 promoteId: promoteId,
//             });
//             console.log(`Source with ID "${sourceId}" added successfully.`);
//         } else {
//             console.warn(`Source with ID "${sourceId}" already exists. Skipping addition.`);
//         }
//         console.log('Current sources:', map.getStyle().sources);
//     }

//     // Adjust sidebar height based on content size
//     function adjustSidebarHeight() {
//         // const sidebar = document.getElementById('hospital-list-sidebar');
//         const hospitalList = document.getElementById('hospital-list');

//         // Check if content fits without overflow
//         if (hospitalList.scrollHeight <= sidebar.clientHeight) {
//             sidebar.classList.add('auto-height');
//         } else {
//             sidebar.classList.remove('auto-height');
//         }
//     }

//     //populateSidebar function.
//     function populateSidebar(regionId, regionName, facilities) {
//         // console.log(`Populating sidebar for region: ${regionName} (ID: ${regionId})`);

//         // const sidebar = document.getElementById('hospital-list-sidebar');
//         const list = document.getElementById('hospital-list');
//         list.innerHTML = '';

//         // Update sidebar title with the region name
//         const title = sidebar.querySelector('h2');
//         title.innerText = `Facilities Using Goliath's Solutions in ${regionName}`;

//         // Remove any existing count display
//         const existingCountDisplay = sidebar.querySelector('.count-display');
//         if (existingCountDisplay) existingCountDisplay.remove();

//         // Filter facilities by region
//         const regionHospitals = facilities.filter(hospital =>
//             hospital.location.includes(regionName) || hospital.region_id === regionId
//         );

//         // Calculate total facility count, accounting for multi-hospital entries
//         const totalHospitalCount = regionHospitals.reduce((sum, hospital) =>
//             sum + (hospital.hospital_count || 1), 0
//         );

//         // console.log(`Found ${regionHospitals.length} hospitals in ${regionName} with a total of ${totalHospitalCount} facilities.`);

//         // Display total facility count in the sidebar
//         const countDisplay = document.createElement('p');
//         countDisplay.classList.add('count-display');
//         countDisplay.innerHTML = `Total Facilities: <span style="color: #ff8502;">${totalHospitalCount}</span>`;
//         countDisplay.style.fontWeight = 'bold';
//         countDisplay.style.color = '#FFFFFF';
//         countDisplay.style.marginTop = '10px';
//         list.before(countDisplay);

//         // Populate sidebar list with hospitals
//         regionHospitals.forEach(hospital => {
//             const listItem = document.createElement('li');

//             // Select the appropriate EHR logo based on the ehr_system value
//             let ehrLogo;
//             switch (hospital.ehr_system) {
//                 case 'Cerner':
//                     ehrLogo = '<img src="./img/cerner-logo.png" alt="Cerner logo" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 5px; border-radius: 50%;">';
//                     break;
//                 case 'Epic':
//                     ehrLogo = '<img src="./img/epic-logo.png" alt="Epic logo" style="width: 20px; height: 18px; vertical-align: middle; margin-right: 5px;">';
//                     break;
//                 case 'Meditech':
//                     ehrLogo = '<img src="./img/meditech-logo.png" alt="Meditech logo" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 5px; border-radius: 50%;">';
//                     break;
//                 default:
//                     ehrLogo = '';
//                     break;
//             }

//             listItem.innerHTML = `
//     <i class="fas fa-hospital-symbol"></i> 
//     <strong class="clickable-hospital" style="cursor: pointer; color: #add8e6;">
//         ${hospital.hospital_name}
//     </strong><br>
//     ${hospital.parent_company ? `<strong>Parent Company:</strong> ${hospital.parent_company}<br>` : ""}
//     ${hospital.location}<br>
//     <div><strong>EHR System:</strong> ${ehrLogo} ${hospital.ehr_system !== "Epic" ? hospital.ehr_system : ""}</div>
//     <div><strong>Hospital Count:</strong> ${hospital.hospital_count || 1}</div>
// `;

//             // Add fly-to functionality and show Back button on click
//             listItem.querySelector('.clickable-hospital').addEventListener('click', () => {
//                 if (!sessionStartingView) {
//                     sessionStartingView = {
//                         center: map.getCenter(),
//                         zoom: map.getZoom(),
//                         pitch: map.getPitch(),
//                         bearing: map.getBearing()
//                     };
//                 }

//                 // Hide GT logo, show back button, and fly to selected facility location
//                 gtLogo.style.display = 'none';
//                 backButton.style.display = 'block';

//                 // Set a mobile-friendly zoom level
//                 const isMobile = window.innerWidth <= 780;
//                 const zoomLevel = isMobile ? 10 : 12;

//                 // Fly to the selected facility location
//                 // Fly-To Functionality on Facility Click
//                 // The fly-to functionality is implemented well, creating a smooth transition to the selected hospital’s location. Setting the mobile zoom level with const zoomLevel = isMobile ? 10 : 12; makes it user-friendly across devices.
//                 // The pitch and bearing values help in adding a sense of depth. If performance is a concern on some devices, consider testing with or without these to evaluate their impact.

//                 map.flyTo({
//                     center: [hospital.longitude, hospital.latitude],
//                     zoom: 12,
//                     pitch: 45,
//                     bearing: 0,
//                     essential: true
//                 });
//             });

//             list.appendChild(listItem);
//         });

//         // Display the sidebar only if there are hospitals to show
//         sidebar.style.display = regionHospitals.length > 0 ? 'block' : 'none';

//         adjustSidebarHeight();
//     }

//     // Define a centralized error message handler
//     function displayErrorMessage(error) {
//         console.error('Error loading facilities data:', error);
//         const errorMessage = document.getElementById('error-message');
//         if (errorMessage) {
//             errorMessage.style.display = 'block';
//             errorMessage.innerText = 'Failed to load facility data. Please try again later.';
//         }
//     }

//     //Sets up a click event for a specified region layer.
//     //On click, fetches and displays facility data in the sidebar for the clicked region.
//     //@param {string} regionSource - The source layer ID for the map region.
//     //@param {string} regionIdProp - The property name in geoJSON data that represents the region ID.
//     //@param {string} regionNameProp - The property name in geoJSON data that represents the region name.

//     function setRegionClickEvent(regionSource, regionIdProp, regionNameProp) {
//         map.on('click', `${regionSource}-fill`, (e) => {
//             const clickedRegionId = e.features[0].properties[regionIdProp];
//             const regionName = e.features[0].properties[regionNameProp];
//             // console.log(`Region clicked: ${regionName} (ID: ${clickedRegionId})`);

//             // Use cached facilities data if available
//             loadFacilitiesData()
//                 .then(facilities => {
//                     // Filter facilities for the clicked region
//                     const filteredFacilities = facilities.filter(facility =>
//                         facility.region_id && facility.region_id.toUpperCase() === clickedRegionId.toUpperCase()
//                     );

//                     // Pass filtered facilities to populateSidebar
//                     populateSidebar(clickedRegionId, regionName, filteredFacilities);
//                 })
//                 .catch(error => {
//                     console.error('Error fetching facilities data:', error);
//                     displayErrorMessage(error);
//                 });
//         });
//     }

// // Global variables for markers
// let markers = [];
// let markersData = [];


// // Debounce utility function to limit execution frequency
// function debounce(func, delay) {
//     let timeout;
//     return function (...args) {
//         clearTimeout(timeout);
//         timeout = setTimeout(() => func.apply(this, args), delay);
//     };
// }

// //Dynamic Sizing Example
// function adjustMarkerSize(zoomLevel) {
//     const size = Math.max(15, Math.min(30, zoomLevel * 4)); 
//     document.querySelectorAll('.custom-marker').forEach(marker => {
//         marker.style.width = `${size}px`;
//         marker.style.height = `${size}px`;
//     });
//     console.log(`Adjusted marker size to: ${size}px at zoom level ${zoomLevel}`);
// }


// // Create a custom marker with a popup
// function createCustomMarker(lng, lat, popupContent) {
//     // Create a custom marker element
//     const markerElement = document.createElement('div');
//     markerElement.className = 'custom-marker company-logo sidebar-logo';
//     markerElement.style.width = '30px';
//     markerElement.style.height = '30px';
//     markerElement.style.backgroundImage = `url('./img/gtLogo.png')`; 
//     markerElement.style.backgroundSize = '70%'; 
//     markerElement.style.backgroundRepeat = 'no-repeat';
//     markerElement.style.backgroundPosition = 'center';
//     markerElement.style.borderRadius = '50%'; 
//     markerElement.style.transform = 'rotate(-50deg)'; 
//     markerElement.style.transition = 'visibility 0.3s ease, transform 1s linear, opacity 0.3s ease, box-shadow 0.3s ease';
//     markerElement.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.15)'; 

//     // Add a popup to the marker
//     const popup = new mapboxgl.Popup({ offset: 15 }).setHTML(popupContent);

//     return new mapboxgl.Marker(markerElement)
//         .setLngLat([lng, lat])
//         .setPopup(popup);
// }

// // markers dynamically based on map bounds
// function updateMarkers() {
//     // console.log('updateMarkers called');

//     // Check if markersData is available
//     if (!markersData || markersData.length === 0) {
//         // console.warn('Markers Data is empty. Skipping updateMarkers.');
//         return;
//     }


//     //map bounds dynamically adjust to visible markers or clusters
// //     const bounds = new mapboxgl.LngLatBounds();
// // markers.forEach(marker => {
// //     bounds.extend(marker.getLngLat());
// // });
// // map.fitBounds(bounds, { padding: 20 });


//     const bounds = map.getBounds();
//     if (!bounds || !bounds._sw || !bounds._ne) {
//         console.error('Invalid map bounds:', bounds);
//         return;
//     }

//     // console.log('Map Bounds:', bounds);


//     // Remove existing markers from the map
//     markers.forEach(marker => marker.remove());
//     markers = []; // Clear the markers array

//     // Deduplicate markersData
//     const uniqueMarkers = markersData.filter(
//         (marker, index, self) =>
//             index === self.findIndex(m => m.lng === marker.lng && m.lat === marker.lat)
//     );

//     // console.log(`Total Markers Data: ${markersData.length}`);
//     // console.log(`Markers added: ${markers.length}`);
//     // console.log(`Unique Markers to Add: ${uniqueMarkers.length}`);

//     //Add Map Layer Visibility Toggling
//     // function toggleRegionVisibility(regionId, visible) {
//     //     const visibility = visible ? 'visible' : 'none';
//     //     if (map.getLayer(regionId)) {
//     //         map.setLayoutProperty(regionId, 'visibility', visibility);
//     //     }
//     // }
    

//     // Add markers within visible bounds
//     uniqueMarkers.forEach(markerData => {
//         const { lng, lat, popupContent } = markerData;

//         if (bounds.contains([lng, lat])) {
//             // console.log(`Adding marker at: ${lng}, ${lat}`);
//             const marker = createCustomMarker(lng, lat, popupContent).addTo(map);
//             markers.push(marker);
//         }
//     });

//     // console.log(`Markers added: ${markers.length}`);
// }

// // Debounce updateMarkers for better performance
// const debouncedUpdateMarkers = debounce(updateMarkers, 300);


//     //Map Load Event and Fog Setting
//     map.on('load', () => {
//         map.setFog({});

//         // addGeoJSONSource function to add each region's data source
//         const sources = [
//             { id: 'us-states', url: '/data/us-states.geojson' },
//             { id: 'uk-regions', url: '/data/uk-regions.geojson' },
//             { id: 'canada-regions', url: '/data/canada-regions.geojson' },
//             { id: 'aruba-region', url: '/data/aruba-region.geojson' },
//             { id: 'italy-regions', url: '/data/italy-regions.geojson' },
//         ];

//         sources.forEach(({ id, url }) => {
//             if (!map.getSource(id)) {
//                 addGeoJSONSource(map, id, url, 'id');
//             }
//         });

//         //Initialize Facilities Data and Set Variables
//         let facilitiesData = [];
//         const regionsWithFacilities = new Set();
//         const statesWithFacilities = new Set();
//         let selectedStateId = null;
//         const logoUrl = './img/gtLogo.png';


//         // imported loadFacilitiesData function  
//         loadFacilitiesData()
//             .then(facilities => {
//                 facilitiesData = facilities;

//                 // regionsWithFacilities and statesWithFacilities sets
//                 facilities.forEach(facility => {
//                     const regionId = facility.region_id ? facility.region_id.toUpperCase() : null;
//                     if (regionId) {
//                         regionsWithFacilities.add(regionId);
//                     }

//                     const stateOrRegion = facility.location.split(', ')[1];
//                     if (stateOrRegion) {
//                         statesWithFacilities.add(stateOrRegion);
//                     }
//                 });

//                 console.log("Facilities data loaded:", facilitiesData); // Debug

//                  ///

//  //Display a single 'G' marker per state where Goliath Technologies has a customer.
//  // Function to create a marker with the company logo
// function createGMarker() {
//     const div = document.createElement('div');
//     div.className = 'g-marker';
//     return div;
// }
// //Dynamic Logo per Facility
// // function createGMarker(logoUrl) {
// //     const div = document.createElement('div');
// //     div.className = 'g-marker';
// //     div.style.backgroundImage = `url(${logoUrl})`;
// //     return div;
// // }

// // facilitiesData.forEach(facility => {
// //     const marker = new mapboxgl.Marker({ 
// //         element: createGMarker(facility.logoUrl) 
// //     })
// //     .setLngLat([facility.longitude, facility.latitude])
// //     .addTo(map);
// // });



// // Function to get state center dynamically based on main_facility
// function getStateCenterCoordinates(stateId, facilitiesData) {
//     const mainFacility = facilitiesData.find(
//         facility => facility.region_id === stateId && facility.main_facility
//     );

//     if (mainFacility) {
//         return [mainFacility.longitude, mainFacility.latitude];
//     }

//     console.warn(`No main facility found for state: ${stateId}`);
//     return null;
// }
// function placeStateMarkers(facilitiesData, map) {
//     const statesWithCustomers = Array.from(
//         new Set(facilitiesData.map(facility => facility.region_id))
//     );

//     const bounds = new mapboxgl.LngLatBounds();

//     statesWithCustomers.forEach(state => {
//         const stateCenter = getStateCenterCoordinates(state, facilitiesData);
//         if (stateCenter) {
//             const marker = new mapboxgl.Marker({ element: createGMarker() })
//                 .setLngLat(stateCenter)
//                 .addTo(map);

//             bounds.extend(stateCenter);
//         } else {
//             console.warn(`No center found for state: ${state}`);
//         }
//     });

//     if (statesWithCustomers.length > 0) {
//         map.fitBounds(bounds, { padding: 20 });
//     }
// }

// // Example: Fetch data and call the function
// loadFacilitiesData().then(facilitiesData => {
//     placeStateMarkers(facilitiesData, map);
// });
 
//  ///


//                 // console.log("regionsWithFacilities:", Array.from(regionsWithFacilities));

//                 // console.log('Locations in data:', facilitiesData.map(f => f.location));


//                 // Define regions dynamically
//                 const layerRegions = [
//                     { layerId: 'us-states', sourceId: 'us-states' },
//                     { layerId: 'canada-regions', sourceId: 'canada-regions' },
//                     { layerId: 'aruba-region', sourceId: 'aruba-region' },
//                     { layerId: 'italy-regions', sourceId: 'italy-regions' },
//                     { layerId: 'uk-regions', sourceId: 'uk-regions' },
//                 ];
//                 // Loop through each region to process layers and interactions
//                 layerRegions.forEach(({ layerId, sourceId }) => {
//                     // console.log(`Processing region: ${layerId}`);

//                     // Remove existing layers if present
//                     if (map.getLayer(`${layerId}-fill`)) {
//                         console.warn(`Removing existing layer: ${layerId}-fill`);
//                         map.removeLayer(`${layerId}-fill`);
//                     }
//                     if (map.getLayer(`${layerId}-line-hover`)) {
//                         console.warn(`Removing existing layer: ${layerId}-line-hover`);
//                         map.removeLayer(`${layerId}-line-hover`);
//                     }

//                     // Add region layer and hover outline
//                     addRegionLayer(map, layerId, sourceId, regionsWithFacilities);
//                     addHoverOutlineLayer(map, `${layerId}-line-hover`, sourceId);

//                     // Set click events and interactions
//                     setRegionClickEvent(sourceId, 'id', 'name');
//                     addRegionInteractions(map, `${layerId}-fill`, sourceId, regionsWithFacilities);
//                 });

//                 // markers for each facility
//                 let markers = facilities.map(({ ehr_system, hospital_name, location, hospital_address, longitude, latitude, parent_company, hospital_count }) => {
//                     let popupContent = `
// <strong>${hospital_name}</strong><br>
// <strong style="color: #05aaff">${location}</strong><br>
// ${parent_company ? `Parent Company: ${parent_company}<br>` : ""}
// EHR System: <strong style="color: #0f2844">${ehr_system}</strong><br>
// Address: ${hospital_address}<br>
// Hospital Count: <strong>${hospital_count}</strong>
// `;
//                     // "note" If this is the CommonSpirit Health Headquarters
//                     if (hospital_name === "CommonSpirit Health Headquarters") {
//                         popupContent += `<br><strong style="color: #ff8502">Note:</strong> CommonSpirit Health operates over 140 hospitals across 21 states. 
// <a href="https://www.commonspirit.org/" target="_blank" style="color: #06b4fd">Visit Website</a>`;
//                     }

//                     const popup = new mapboxgl.Popup({ offset: 15, closeButton: false })
//                         .setHTML(popupContent);

//                     // Create a custom marker element
//                     const markerElement = document.createElement('div');
//                     markerElement.className = 'custom-marker';
//                     markerElement.style.backgroundImage = `url(${logoUrl})`;
//                     markerElement.style.width = '30px';
//                     markerElement.style.height = '30px';
//                     markerElement.style.borderRadius = '50%';
//                     markerElement.style.backgroundSize = 'cover';

//                     const marker = new mapboxgl.Marker(markerElement)
//                         .setLngLat([longitude, latitude])
//                         .setPopup(popup)
//                         .addTo(map);

//                     // specific hover behavior based on the hospital name
//                     if (hospital_name !== "CommonSpirit Health Headquarters") {
//                         // Standard behavior: show/hide popup on hover
//                         marker.getElement().addEventListener('mouseenter', () => popup.addTo(map));
//                         marker.getElement().addEventListener('mouseleave', () => popup.remove());
//                     } else {
//                         // For CommonSpirit Headquarters, keep popup open on click
//                         marker.getElement().addEventListener('click', (e) => {
//                             e.stopPropagation();
//                             popup.addTo(map);
//                         });
//                     }

//                     return marker;
//                 });

//                 // show regions and states
//                 function addRegionLayer(map, layerId, sourceId, regionsWithFacilities) {
//                     const hoverColor = '#05aaff';
//                     const selectedColor = '#ff8502';

//                     if (map.getLayer(`${layerId}-fill`)) {
//                         console.warn(`Layer with id "${layerId}-fill" already exists. Skipping addition.`);
//                         return;
//                     }

//                     map.addLayer({
//                         id: `${layerId}-fill`,
//                         type: 'fill',
//                         source: sourceId,
//                         paint: {
//                             'fill-color': [
//                                 'case',
//                                 // Apply selected color if the region is selected and has facilities
//                                 ['all', ['boolean', ['feature-state', 'selected'], false], ['in', ['get', 'id'], ['literal', Array.from(regionsWithFacilities)]]], selectedColor,
//                                 // Apply hover color if the region is hovered and has facilities
//                                 ['all', ['boolean', ['feature-state', 'hover'], false], ['in', ['get', 'id'], ['literal', Array.from(regionsWithFacilities)]]], hoverColor,
//                                 // Default color for regions without facilities
//                                 '#d3d3d3'
//                             ],
//                             'fill-opacity': 0.5
//                         }
//                     });
//                 }


//                 function addHoverOutlineLayer(map, layerId, sourceId) {
//                     if (map.getLayer(layerId)) {
//                         console.warn(`Layer with id "${layerId}" already exists. Skipping addition.`);
//                         return;
//                     }

//                     if (map.getLayer(`${layerId}-glow`)) {
//                         console.warn(`Glow layer with id "${layerId}-glow" already exists. Skipping addition.`);
//                         return;
//                     }

//                     map.addLayer({
//                         id: layerId,
//                         type: 'line',
//                         source: sourceId,
//                         paint: {
//                             'line-color': '#FFFFFF',
//                             'line-width': [
//                                 'case',
//                                 ['boolean', ['feature-state', 'hover'], false],
//                                 2,  // Thicker line for hover
//                                 0.6 // Default line width
//                             ]

//                             // 'line-color': '#00FF00', // Bright green for better visibility
//                             // 'line-width': [
//                             //     'case',
//                             //     ['boolean', ['feature-state', 'hover'], false],
//                             //     3, // Wider line width when hovered
//                             //     1  // Thinner line width when not hovered
//                             // ]
//                         }
//                     });

//                     map.addLayer({
//                         id: `${layerId}-glow`,
//                         type: 'line',
//                         source: sourceId,
//                         paint: {
//                             'line-color': 'rgba(255, 255, 255, 0.3)', // White glow
//                             'line-width': 2, // Larger width for glow effect
//                             'line-blur': 2   // Blur for glow

//                             // 'line-color': 'rgba(255, 0, 0, 0.6)', // Red glow with 60% opacity
//                             // 'line-width': 8,                     // Larger line width for better visibility
//                             // 'line-blur': 4                       // Blur for a glowing effect
//                         }
//                     });
//                 }

//                 ['us-states', 'canada-regions', 'aruba-region', 'italy-regions', 'uk-regions'].forEach(region => {
//                     console.log(`Applying styles for ${region}`);
//                     addHoverOutlineLayer(map, `${region}-line-hover`, region);
//                     addRegionLayer(map, region, region, regionsWithFacilities);
//                     addRegionInteractions(map, `${region}-fill`, region, regionsWithFacilities);
//                 });

//                 // console.log(map.getSource('us-states'));
//                 // console.log(map.getLayer('us-states-fill'));
//                 // console.log(map.getLayer('us-states-line-hover'));

//                 // console.log('Current layer order:', map.getStyle().layers.map(layer => layer.id));
                

//                 addGeoJSONSource(map, 'us-states', '/data/us-states.geojson', 'id');
//                 // console.log("Sources after adding 'us-states':", map.getStyle().sources);
                

//                 //Function for Zoom-Based Marker Visibility
//                 function toggleMarkers() {
//                     const zoomLevel = map.getZoom();
//                     const minZoomToShowMarkers = 4;

//                     markers.forEach(marker => {
//                         if (zoomLevel >= minZoomToShowMarkers && !marker._map) {
//                             marker.addTo(map);
//                         } else if (zoomLevel < minZoomToShowMarkers && marker._map) {
//                             marker.remove();
//                         }
//                     });
//                 }

//                 // Attach 'zoomend' event to adjust markers based on zoom level
//                 map.on('zoomend', toggleMarkers);

//                 // Initial call to set visibility based on the starting zoom level
//                 toggleMarkers();

//                 //Cluster Source and Layer Styling
//                 // Set up cluster source for hospitals
//                 map.addSource('hospitals', {
//                     type: 'geojson',
//                     data: {
//                         type: 'FeatureCollection',
//                         features: facilities.map(facility => ({
//                             type: 'Feature',
//                             properties: {
//                                 hospital_name: facility.hospital_name,
//                                 location: facility.location,
//                                 ehr_system: facility.ehr_system,
//                                 hospital_address: facility.hospital_address,
//                                 hospital_parent_company: facility.parent_company,
//                                 hospital_hospital_count: facility.hospital_count,
//                             },
//                             geometry: {
//                                 type: 'Point',
//                                 coordinates: [facility.longitude, facility.latitude],
//                             }
//                         })),
//                     },
//                     cluster: true,
//                     clusterMaxZoom: 14,// To increase this value to reduce unclustered points at higher zoom levels
//                     clusterRadius: 30,// To increase radius to group more points together in clusters
//                 });

//                 // Cluster layer with Goliath Technologies colors and outline for better visibility
//                 map.addLayer({
//                     id: 'clusters',
//                     type: 'circle',
//                     source: 'hospitals',
//                     filter: ['has', 'point_count'],
//                     paint: {
//                         'circle-color': [
//                             'step',
//                             ['get', 'point_count'],
//                             '#ff8502',  // Small clusters (orange)
//                             // '#b31919',  // Small clusters (red) 
//                             10, ' #0f2844',  // Medium clusters (dark blue)
//                             50, '#b31919'   // Large clusters
//                         ],
//                         'circle-radius': [
//                             'step',
//                             ['get', 'point_count'],
//                             10,   // Small clusters
//                             20, 15, // Medium clusters
//                             50, 20 // Large clusters (reduced size)
//                         ],
//                         'circle-stroke-width': 1, // Add a thin outline
//                         'circle-stroke-color': '#0f2844' // Dark blue outline for consistency
//                     }
//                 });

//                 // Cluster count layer
//                 map.addLayer({
//                     id: 'cluster-count',
//                     type: 'symbol',
//                     source: 'hospitals',
//                     filter: ['has', 'point_count'],
//                     layout: {
//                         'text-field': '{point_count_abbreviated}',
//                         'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
//                         'text-size': 14,
//                         'text-anchor': 'center',
//                     },
//                     paint: {
//                         'text-color': '#FFFFFF',
//                     },
//                 });

//                 // Unclustered point layer
//                 map.addLayer({
//                     id: 'unclustered-point',
//                     type: 'circle',
//                     source: 'hospitals',
//                     filter: ['!', ['has', 'point_count']],
//                     paint: {
//                         'circle-color': '#11b4da',
//                         'circle-radius': 3,
//                     },
//                 });

//                 map.on('zoom', () => {
//                     map.setLayoutProperty('unclustered-point', 'visibility', map.getZoom() >= 6 ? 'visible' : 'none');
//                 });

//                 // Click event to show facility information in popup
//                 map.on('click', 'unclustered-point', (e) => {
//                     const coordinates = e.features[0].geometry.coordinates.slice();
//                     const { hospital_name, location, ehr_system, hospital_address } = e.features[0].properties;

//                     new mapboxgl.Popup()
//                         .setLngLat(coordinates)
//                         .setHTML(`<strong>${hospital_name}</strong><br>${location}<br>EHR System: ${ehr_system}<br>Address: ${hospital_address}`)
//                         .addTo(map);
//                 });

//                 // Cluster click event for expanding zoom level
//                 map.on('click', 'clusters', (e) => {
//                     const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
//                     const clusterId = features[0].properties.cluster_id;
//                     map.getSource('hospitals').getClusterExpansionZoom(clusterId, (err, zoom) => {
//                         if (err) return;
//                         map.easeTo({
//                             center: features[0].geometry.coordinates,
//                             zoom: zoom,
//                         });
//                     });
//                 });

//                 // Click event on state to display sidebar list of facilities
//                 map.on('click', 'us-states-fill', (e) => {
//                     const clickedStateId = e.features[0].properties.id;

//                     // Check if the clicked state has facilities
//                     if (!statesWithFacilities.has(clickedStateId)) {
//                         // Hide sidebar if state doesn't have facilities
//                         document.getElementById('hospital-list-sidebar').style.display = 'none';

//                         // Deselect previously selected state if any
//                         if (selectedStateId !== null) {
//                             map.setFeatureState({ source: 'us-states', id: selectedStateId }, { selected: false });
//                         }
//                         selectedStateId = null;
//                         return;
//                     }

//                     // Deselect previously selected state
//                     if (selectedStateId !== null) {
//                         map.setFeatureState({ source: 'us-states', id: selectedStateId }, { selected: false });
//                     }

//                     // Set the clicked state as selected
//                     selectedStateId = clickedStateId;
//                     map.setFeatureState({ source: 'us-states', id: selectedStateId }, { selected: true });

//                     // Display facilities in the sidebar
//                     const stateName = e.features[0].properties.name;
//                     const stateHospitals = facilities.filter(hospital => hospital.location.includes(clickedStateId));

//                     // const sidebar = document.getElementById('hospital-list-sidebar');
//                     const list = document.getElementById('hospital-list');
//                     list.innerHTML = '';

//                     // Update sidebar title with state name
//                     const title = sidebar.querySelector('h2');
//                     title.innerText = `Facilities Using Goliath's Solutions in ${stateName}`;

//                     // Remove any existing count display
//                     const existingCountDisplay = sidebar.querySelector('.count-display');
//                     if (existingCountDisplay) existingCountDisplay.remove();

//                     // Calculate the total facility count for the clicked state
//                     const totalFacilityCount = stateHospitals.reduce((sum, hospital) => sum + (hospital.hospital_count || 1), 0);

//                     // Display facility count
//                     const countDisplay = document.createElement('p');
//                     countDisplay.classList.add('count-display');
//                     // countDisplay.innerHTML = `Total Facilities: <span style="color: #ff8502;">${stateHospitals.length}</span>`;

//                     // Update the sidebar count display to show the actual number of facilities
//                     countDisplay.innerHTML = `Total Facilities: <span style="color: #ff8502;">${totalFacilityCount}</span>`;
//                     countDisplay.style.fontWeight = 'bold';
//                     countDisplay.style.color = '#FFFFFF';
//                     countDisplay.style.marginTop = '10px';
//                     list.before(countDisplay);

//                     if (stateHospitals.length > 0) {
//                         stateHospitals.forEach(hospital => {
//                             const listItem = document.createElement('li');

//                             // Select the appropriate EHR logo based on the ehr_system value
//                             let ehrLogo;
//                             switch (hospital.ehr_system) {
//                                 case 'Cerner':
//                                     ehrLogo = '<img src="./img/cerner-logo.png" alt="Cerner logo" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 5px; border-radius: 50%;">';
//                                     break;
//                                 case 'Epic':
//                                     ehrLogo = `<img src="./img/epic-logo.png" alt="Epic logo" style="width: 20px; height: 18px; vertical-align: middle; margin-right: 5px;">`;
//                                     break;
//                                 case 'Meditech':
//                                     ehrLogo = '<img src="./img/meditech-logo.png" alt="Meditech logo" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 5px; border-radius: 50%;">';
//                                     break;
//                                 default:
//                                     ehrLogo = '';
//                                     break;
//                             }

//                             listItem.innerHTML = `
//     <div>
//         <i class="fas fa-hospital-symbol"></i> 
//         <strong class="clickable-hospital" style="cursor: pointer; color: #add8e6;">
//             ${hospital.hospital_name}
//         </strong>
//     </div>
//     ${hospital.parent_company ? `<div><strong>Parent Company:</strong> ${hospital.parent_company}</div>` : ""}
//     <div>${hospital.location}</div>
//     <div><strong>EHR System:</strong> ${ehrLogo} ${hospital.ehr_system !== "Epic" ? hospital.ehr_system : ""}</div>
//     <div><strong>Hospital Count:</strong> ${hospital.hospital_count || 1}</div>
// `;
//                             // Add a special note if this is the CommonSpirit Health Headquarters
//                             if (hospital.hospital_name === "CommonSpirit Health Headquarters") {
//                                 listItem.innerHTML += `<br><strong style="color: #ff8502;">Note:</strong> CommonSpirit Health operates over 140 hospitals across 21 states. 
// <a href="https://www.commonspirit.org/" target="_blank" style="color: #06b4fd;">Visit Website</a>`;
//                             }

//                             list.appendChild(listItem);
//                         });

//                         sidebar.style.display = 'block';
//                     } else {
//                         sidebar.style.display = 'none';
//                     }

//                 });
                
// // Fetch and populate markersData
// loadFacilitiesData()
//     .then(facilities => {
//         // Populate markersData
//         markersData = facilities.map(facility => ({
//             lng: facility.longitude,
//             lat: facility.latitude,
//             popupContent: `
//                 <strong>${facility.hospital_name}</strong><br>
//                 ${facility.location}<br>
//                 ${facility.parent_company ? `Parent Company: ${facility.parent_company}<br>` : ""}
//                 EHR System: ${facility.ehr_system}<br>
//                 Address: ${facility.hospital_address}
//             `
//         }));

//         console.log(`Markers Data Populated: ${markersData.length}`);

//           // debounced updateMarkers to map events
//         map.on('moveend', debouncedUpdateMarkers);
//         map.on('zoomend', () => {
//             debouncedUpdateMarkers();
//             adjustMarkerSize(map.getZoom());
//         });

//         // map.on('zoomend', () => {
//         //     console.log('Zoom Level:', map.getZoom());
//         //     console.log('Map Bounds:', map.getBounds());
//         // });        

// // Handle map reset or view changes
// map.on('reset', () => {
//     adjustMarkerSize(map.getZoom());
// });

//         // Adjust markers on reset
//         map.on('reset', () => adjustMarkerSize(map.getZoom()));

//         // Initial render of markers
//         updateMarkers();

//     })
//             .catch(error => {
//                 console.error('Error loading facilities data:', error);
//                 const errorMessage = document.getElementById('error-message');
//                 errorMessage.style.display = 'block';
//                 errorMessage.innerText = 'Failed to load facility data. Please try again later.';
//             });
//         })

// // layers behavior and reset button
//             function addRegionInteractions(map, layerId, sourceId, regionsWithFacilities) {
//                 let hoveredRegionId = null;
//                 let selectedRegionId = null;
    
//                 const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
//                 const hoverEvent = isTouchDevice ? 'touchstart' : 'mousemove';


//                 // Add reset button functionality inside
//     document.getElementById("reset-view").addEventListener("click", () => {
//         // Reset the map view
//         map.flyTo({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM, pitch: 0 });

//         // Clear any selected regions
//         clearRegionSelection();
//         closeSidebar() 
//     });
    
//                 // Apply hover effect only to regions with facilities
//                 const applyHover = (regionId) => {
//                     if (hoveredRegionId !== null && hoveredRegionId !== selectedRegionId) {
//                         map.setFeatureState({ source: sourceId, id: hoveredRegionId }, { hover: false });
//                     }
//                     hoveredRegionId = regionId;
//                     if (hoveredRegionId !== selectedRegionId) {
//                         map.setFeatureState({ source: sourceId, id: hoveredRegionId }, { hover: true });
//                     }
//                 };
    
//                 const clearHover = () => {
//                     if (hoveredRegionId !== null && hoveredRegionId !== selectedRegionId) {
//                         map.setFeatureState({ source: sourceId, id: hoveredRegionId }, { hover: false });
//                     }
//                     hoveredRegionId = null;
//                 };
    
//                 // Debounced hover function for non-touch devices
//                 const debouncedHover = debounce((e) => {
//                     const regionId = e.features[0].id;
//                     if (regionsWithFacilities.has(regionId)) {
//                         applyHover(regionId);
//                     }
//                 }, 50); // 50ms debounce delay
    
    
//                 // Tap-to-Hover functionality for touch devices
//                 if (isTouchDevice) {
//                     map.on('touchstart', layerId, (e) => {
//                         const regionId = e.features[0].id;
    
//                         if (regionsWithFacilities.has(regionId)) {
//                             if (hoveredRegionId === regionId) {
//                                 // If already hovered, treat it as a click
//                                 selectRegion(regionId);
//                             } else {
//                                 // Otherwise, just apply hover effect
//                                 applyHover(regionId);
//                             }
//                         }
//                     });
    
//                     map.on('touchend', layerId, clearHover);
//                     map.on('touchcancel', layerId, clearHover);
//                 }
    
//                 // Regular hover for non-touch devices
//                 map.on(hoverEvent, layerId, (e) => {
//                     const regionId = e.features[0].id;
//                     if (regionsWithFacilities.has(regionId)) {
//                         applyHover(regionId);
//                     }
//                 });
    
//                 // Clear hover effect on mouse leave for non-touch devices
//                 if (!isTouchDevice) {
//                     map.on('mouseleave', layerId, clearHover);
//                 }
    
//                 // Function to select a region
//                 function selectRegion(regionId) {
//                     clearRegionSelection(); // Clear previous selection
    
//                     selectedRegionId = regionId;
//                     map.setFeatureState({ source: sourceId, id: selectedRegionId }, { selected: true });
    
//                     // Update sidebar for the new selection
//                     updateSidebarForRegion(regionId);
//                 }
    
//                 // Handle selection on click
//                 map.on('click', layerId, (e) => {
//                     const regionId = e.features[0].id;
//                     if (regionsWithFacilities.has(regionId)) {
//                         selectRegion(regionId);
//                     }
//                 });
    
//                 // Clear selection when clicking outside
//                 map.on('click', (e) => {
//                     const features = map.queryRenderedFeatures(e.point, { layers: [layerId] });
//                     if (features.length === 0) {
//                         clearRegionSelection();
//                     }
//                 });
    
//                 // Clear selection and hover states when the sidebar is closed
//                 function clearRegionSelection() {
//                     clearHover();
//                     if (selectedRegionId !== null) {
//                         map.setFeatureState({ source: sourceId, id: selectedRegionId }, { selected: false });
//                         selectedRegionId = null;
//                     }
//                 }
    
//                 // Attach clear function to sidebar close
//                 document.getElementById('close-sidebar').addEventListener('click', clearRegionSelection);
    
//                 // Placeholder function to update sidebar content based on region selection
//                 function updateSidebarForRegion(regionId) {
//                     // Logic to show content for the selected region in the sidebar
//                 }
//             }

//         // Define the closeSidebar function
//         function closeSidebar() {
//             sidebar.style.display = 'none';
//             if (selectedStateId !== null) {
//                 map.setFeatureState({ source: 'us-states', id: selectedStateId }, { selected: false });
//             }
//             selectedStateId = null;
//         }
//         document.getElementById('close-sidebar').addEventListener('click', closeSidebar);
        
//         // Reset view button
//         // document.getElementById("reset-view").addEventListener("click", () => {
//         //     map.flyTo({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM, pitch: 0 });
//         // });

//         // Fly-to buttons for navigating regions
//         document.getElementById("fit-to-usa").addEventListener("click", () => {
//             map.fitBounds([
//                 [-165.031128, 65.476793],
//                 [-81.131287, 26.876143]
//             ]);
//         });

//         const regions = {
//             usa: { center: [-101.714859, 39.710884], zoom: 4, pitch: 45 },
//             uk: { center: [360.242386, 51.633362], zoom: 4, pitch: 45 },
//             italy: { center: [12.563553, 42.798676], zoom: 4, pitch: 45 },
//             canada: { center: [-106.3468, 56.1304], zoom: 4, pitch: 30 },
//             aruba: { center: [-70.027, 12.5246], zoom: 7, pitch: 45 }
//         };

//         function flyToRegion(region) {
//             const { center, zoom, pitch } = regions[region];
//             map.flyTo({ center, zoom, pitch });
//         }

//         //Attaching event listeners
//         document.getElementById("fly-to-usa").addEventListener("click", () => flyToRegion('usa'));
//         document.getElementById("fly-to-uk").addEventListener("click", () => flyToRegion('uk'));
//         document.getElementById("fly-to-italy").addEventListener("click", () => flyToRegion('italy'));
//         document.getElementById("fly-to-canada").addEventListener("click", () => flyToRegion('canada'));
//         document.getElementById("fly-to-aruba").addEventListener("click", () => flyToRegion('aruba'));

//         // Drag Initialization and Threshold Handling
//         let isDragging = false;
//         let startX, startY, initialLeft, initialTop;
//         const dragThreshold = 5;

//         // Start Drag Function
//         function startDrag(e) {
//             startX = e.touches ? e.touches[0].clientX : e.clientX;
//             startY = e.touches ? e.touches[0].clientY : e.clientY;
//             const rect = sidebar.getBoundingClientRect();
//             initialLeft = rect.left;
//             initialTop = rect.top;
//             sidebar.classList.add("dragging");
//             sidebarHeader.classList.add("grabbing");

//             isDragging = false;

//             document.addEventListener("mousemove", handleDrag);
//             document.addEventListener("mouseup", endDrag);
//             document.addEventListener("touchmove", handleDrag, { passive: false });
//             document.addEventListener("touchend", endDrag);
//         }

//         // Drag Handling Function
//         function handleDrag(e) {
//             const currentX = e.touches ? e.touches[0].clientX : e.clientX;
//             const currentY = e.touches ? e.touches[0].clientY : e.clientY;
//             const dx = currentX - startX;
//             const dy = currentY - startY;

//             if (!isDragging && Math.abs(dx) + Math.abs(dy) > dragThreshold) {
//                 isDragging = true;
//             }

//             if (isDragging) {
//                 e.preventDefault();
//                 sidebar.style.left = `${Math.min(Math.max(0, initialLeft + dx), window.innerWidth - sidebar.offsetWidth)}px`;
//                 sidebar.style.top = `${Math.min(Math.max(0, initialTop + dy), window.innerHeight - sidebar.offsetHeight)}px`;
//             }
//         }

//         // End Drag Function
//         function endDrag() {
//             isDragging = false;
//             sidebar.classList.remove("dragging");
//             sidebarHeader.classList.remove("grabbing");

//             document.removeEventListener("mousemove", handleDrag);
//             document.removeEventListener("mouseup", endDrag);
//             document.removeEventListener("touchmove", handleDrag);
//             document.removeEventListener("touchend", endDrag);
//         }

//         // Attach Event Listeners
//         sidebarHeader.addEventListener("mousedown", startDrag);
//         sidebarHeader.addEventListener("touchstart", startDrag, { passive: false });

//         // Adjust Sidebar Visibility Based on Screen Size
//         function toggleSidebarOnHover(show) {
//             // Only toggle visibility on small screens (e.g., max-width of 480px)
//             if (window.innerWidth <= 480) {
//                 sidebar.style.display = show ? 'block' : 'none';
//             }
//         }

//         // Show sidebar on touch or mouse enter for small screens
//         sidebar.addEventListener('mouseenter', () => toggleSidebarOnHover(true));
//         sidebar.addEventListener('touchstart', () => toggleSidebarOnHover(true));

//         // Remove hiding behavior on `mouseleave` and `touchend`
//         sidebar.removeEventListener('mouseleave', () => toggleSidebarOnHover(false));
//         sidebar.removeEventListener('touchend', () => toggleSidebarOnHover(false));

//         // Close sidebar only when the close button is clicked
//         document.getElementById("close-sidebar").addEventListener('click', () => {
//             sidebar.style.display = 'none';
//         });
//     })
// });


//Imports and Mapbox Token Initialization
import { MAPBOX_TOKEN } from './config.js';
import { loadFacilitiesData } from './dataLoader.js';
// import debounce from 'lodash.debounce';
mapboxgl.accessToken = MAPBOX_TOKEN;

// Map Initialization on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("hospital-list-sidebar");
    const sidebarHeader = document.querySelector(".sidebar-header");
    const backToTopButton = document.getElementById('back-to-top-button');
    // const minimizeButton = document.getElementById('minimize-sidebar');

    sidebar.addEventListener('click', (event) => {
        event.stopPropagation();
    });
    const gtLogo = document.querySelector('.sidebar-logo');
    const backButton = document.createElement('button');

    //set the initial view of Mapbox globe
    const INITIAL_CENTER = [-75.4265, 40.0428]; //The coordinates for 1235 Westlakes Drive, Suite 120, Berwyn, PA 19312, are approximately 40.06361° N latitude and 75.47156° W longitude
    const INITIAL_ZOOM = 1;

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v11',
        projection: 'globe',
        zoom: INITIAL_ZOOM,
        center: INITIAL_CENTER,
    });

    // Adding navigation controls
    map.addControl(new mapboxgl.NavigationControl());
    // map.addControl(new mapboxgl.NavigationControl({ position: 'top-left' }));
    // map.scrollZoom.disable();

    // Variables    
    let userInteracting = false;
    let hasInteracted = false;
    let isInitialRotation = true;
    let hoveredRegionId = null;
    let selectedRegionId = null;

    // Global variables for markers
    let stateRegionMarkers = [];
    let markers = []; // To store Mapbox markers
    let markersData = []; // To store marker data from facilities
    let markersDataReady = false; // Flag to indicate markersData readiness

    // spin the globe smoothly when zoomed out
    function spinGlobe() {
        if (!userInteracting && map.getZoom() < 5) {
            const center = map.getCenter();
            center.lng -= 360 / 240;
            map.easeTo({ center, duration: 1000, easing: (n) => n });
        }
    }

    // Event listeners for user interaction
    map.on('mousedown', () => userInteracting = true);
    map.on('dragstart', () => userInteracting = true);
    // map.on('moveend', () => spinGlobe());

    map.on('moveend', () => {
        spinGlobe(); // 
        updateMarkers();
        // console.log('Markers Data:', markersData); // Verify markersData is populated
    });

    // Start the globe spinning animation
    spinGlobe();

    // Map Animation on Load to set the globe to your preferred size and center
    map.on('load', () => {
        console.log('Map loaded');
        map.easeTo({
            center: [-75.4265, 40.0428],
            // zoom: 0,
            zoom: 1,
            duration: 3000,
            easing: (t) => t * (2 - t)
        });
    });

    //animated pulsing Dot icon
    const size = 50;
    // This implements `StyleImageInterface`
    // to draw a pulsing dot icon on the map.
    const pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        // When the layer is added to the map,
        // get the rendering context for the map canvas.

        onAdd: function () {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext('2d', { willReadFrequently: true });
            // console.log('Canvas initialized with willReadFrequently:', this.context);
        },

        // Call once before every frame where the icon will be used.
        render: function () {
            const duration = 1000;
            const t = (performance.now() % duration) / duration;

            const radius = (size / 2) * 0.3;
            const outerRadius = (size / 2) * 0.7 * t + radius;
            const context = this.context;

            // Draw the outer circle.
            context.clearRect(0, 0, this.width, this.height);
            context.beginPath();
            context.arc(
                this.width / 2,
                this.height / 2,
                outerRadius,
                0,
                Math.PI * 2
            );

            //Goliath colors
            // #ff8b1f: A vibrant orange; suitable for the outer circle or stroke.
            // #0f2844: A dark blue; ideal for the inner circle or border.
            // #ff0000: Bright red; can be used for the pulsing effect or an accent.
            // #ffffff: White; perfect for a border or subtle inner detail.

            context.fillStyle = `rgba(255, 139, 31, ${1 - t})`; // Orange (Outer Circle)
            context.fill();

            // Draw the inner circle.
            context.beginPath();
            context.arc(
                this.width / 2,
                this.height / 2,
                radius,
                0,
                Math.PI * 2
            );
            context.fillStyle = '#0f2844'; // Dark Blue (Inner Circle)
            context.strokeStyle = '#ffffff'; // White Border
            // context.strokeStyle = '#ff0000'; 
            context.lineWidth = 2 + 4 * (1 - t);
            context.fill();
            context.stroke();

            // Update this image's data with data from the canvas.
            this.data = context.getImageData(
                0,
                0,
                this.width,
                this.height
            ).data;
            // console.log('Canvas context:', this.context); // Should not be undefined
            // console.log('Image data:', context.getImageData(0, 0, this.width, this.height).data); // Check if this runs


            // Continuously repaint the map, resulting
            // in the smooth animation of the dot.
            map.triggerRepaint();

            // Return `true` to let the map know that the image was updated.
            return true;
        }
    };

    map.on('load', () => {

        // console.log('Map loaded.');

        map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

        // console.log('Pulsing dot image added.');

        map.addSource('dot-point', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': [
                    {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [-75.4265, 40.0428] // icon position [lng, lat]
                        }
                    }
                ]
            }
        });

        // console.log('Source for pulsing dot added.');

        map.addLayer({
            'id': 'layer-with-pulsing-dot',
            'type': 'symbol',
            'source': 'dot-point',
            'layout': {
                'icon-image': 'pulsing-dot'
            }
        });
        // console.log('Layer for pulsing dot added.');

    });

    // Define GT logo markers for specified countries
    const countries = [
        { name: 'USA', lngLat: [-80.147085, 30.954096] }, // gt office Near by location
        { name: 'UK', lngLat: [-1.654816, 52.181932] },
        { name: 'Aruba', lngLat: [-69.952269, 12.512168] },
        { name: 'Canada', lngLat: [-106.728058, 57.922142] },
        { name: 'Italy', lngLat: [12.465363, 42.835192] },
    ];

    // Initialize GT logo markers, making them initially visible
    const gtLogoMarkers = countries.map(country => {
        const logoElement = document.createElement('div');
        logoElement.className = 'company-logo';
        logoElement.style.backgroundImage = 'url(./img/gtLogo.png)';
        const marker = new mapboxgl.Marker(logoElement, {
            rotationAlignment: 'map',
            offset: [0, -15],
        }).setLngLat(country.lngLat).addTo(map);

        // Set initial visibility to visible
        marker.getElement().style.visibility = 'visible';
        return marker;
    });

    // Utility function to safely set layer visibility if the layer exists
    function setLayerVisibility(layerId, visibility) {
        if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, 'visibility', visibility);
        }
    }

    // Hide clusters on sourcedata load event to ensure they are hidden initially
    map.on('sourcedata', (e) => {
        if (!hasInteracted && e.isSourceLoaded) {
            // Ensure clusters remain hidden on load
            setLayerVisibility('clusters', 'none');
            setLayerVisibility('cluster-count', 'none');
            setLayerVisibility('unclustered-point', 'none');
        }
    });

    // Initial globe rotation, show GT logos, and ensure clusters are hidden
    function startInitialRotation() {
        // globe animation with GT logos visible
        map.easeTo({
            center: [-75.4265, 40.0428],
            zoom: 1,
            duration: 3000,
            easing: (t) => t * (2 - t),
        });
    }

    // Function to handle first interaction, hiding GT logos and showing clusters

    function onFirstInteraction() {
        if (!hasInteracted) {
            hasInteracted = true;

            // Hide GT logos permanently after the first interaction
            gtLogoMarkers.forEach(marker => {
                marker.getElement().style.visibility = 'hidden';
            });

            // Show clusters to follow their normal functionality
            setLayerVisibility('clusters', 'visible');
            setLayerVisibility('cluster-count', 'visible');
            setLayerVisibility('unclustered-point', 'visible');

            // Show state/region markers after the first interaction
            stateRegionMarkers.forEach(marker => {
                marker.getElement().style.visibility = 'visible'; 
            });

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

            // Use MutationObserver to detect when the input is added
            const observer = new MutationObserver(() => {
                const geocoderInput = geocoderContainer.querySelector('input[type="text"]');
                if (geocoderInput) {
                    geocoderInput.focus();
                    observer.disconnect(); // Stop observing once input is found and focused
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

    // Function to toggle the back-to-top button visibility
    function toggleBackToTopButton() {
        const isCollapsed = sidebar.classList.contains('collapsed'); // Sidebar is minimized
        const isScrollable = sidebar.scrollHeight > sidebar.clientHeight; // Sidebar has overflow
        const isSmallScreen = window.innerWidth <= 480; // Check for small screens

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
        const isCollapsed = sidebar.classList.contains('collapsed'); // Sidebar is minimized
        const isScrollable = sidebar.scrollHeight > sidebar.clientHeight; // Sidebar has overflow
        const isSmallScreen = window.innerWidth <= 480; // Check for small screens

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

        // Use a delay to recalculate dimensions accurately after transition
        setTimeout(() => {
            toggleBackToTopButton();
        }, 200); // Match with the CSS transition duration if needed

        // Update the minimize icon based on sidebar state
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
    // let previousRegionView = null;

    // Configure the "Back" button
    backButton.id = 'back-button';
    backButton.classList.add('round-button');
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
    backButton.style.display = 'none';
    document.querySelector('.sidebar-header').appendChild(backButton);

    function resetToSessionView() {
        if (sessionStartingView) {
            const isMobile = window.innerWidth <= 780;
            const zoomLevel = isMobile ? sessionStartingView.zoom - 1 : sessionStartingView.zoom;

            map.flyTo({
                center: sessionStartingView.center,
                zoom: zoomLevel,
                pitch: sessionStartingView.pitch,
                bearing: sessionStartingView.bearing
            });

            backButton.style.display = 'none';
            gtLogo.style.display = 'block';
            sessionStartingView = null;
        }
    }

    backButton.addEventListener('click', resetToSessionView);

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
            //     console.log(`Source with ID "${sourceId}" added successfully.`);
        }
        // else {
        //     console.warn(`Source with ID "${sourceId}" already exists. Skipping addition.`);
        // }
        // console.log('Current sources:', map.getStyle().sources);
    }

    // Adjust sidebar height based on content size
    function adjustSidebarHeight() {
        // const sidebar = document.getElementById('hospital-list-sidebar');
        const hospitalList = document.getElementById('hospital-list');

        // Check if content fits without overflow
        if (hospitalList.scrollHeight <= sidebar.clientHeight) {
            sidebar.classList.add('auto-height');
        } else {
            sidebar.classList.remove('auto-height');
        }
    }

    //populateSidebar function.
    function populateSidebar(regionId, regionName, facilities) {
        // console.log(`Populating sidebar for region: ${regionName} (ID: ${regionId})`);

        // const sidebar = document.getElementById('hospital-list-sidebar');
        const list = document.getElementById('hospital-list');
        list.innerHTML = '';

        // Update sidebar title with the region name
        const title = sidebar.querySelector('h2');
        title.innerText = `Facilities Using Goliath's Solutions in ${regionName}`;

        // Remove any existing count display
        const existingCountDisplay = sidebar.querySelector('.count-display');
        if (existingCountDisplay) existingCountDisplay.remove();

        // Filter facilities by region
        const regionHospitals = facilities.filter(hospital =>
            hospital.location.includes(regionName) || hospital.region_id === regionId
        );

        // Calculate total facility count, accounting for multi-hospital entries
        const totalHospitalCount = regionHospitals.reduce((sum, hospital) =>
            sum + (hospital.hospital_count || 1), 0
        );

        // console.log(`Found ${regionHospitals.length} hospitals in ${regionName} with a total of ${totalHospitalCount} facilities.`);

        // Display total facility count in the sidebar
        const countDisplay = document.createElement('p');
        countDisplay.classList.add('count-display');
        countDisplay.innerHTML = `Total Facilities: <span style="color: #ff8502;">${totalHospitalCount}</span>`;
        countDisplay.style.fontWeight = 'bold';
        countDisplay.style.color = '#FFFFFF';
        countDisplay.style.marginTop = '10px';
        list.before(countDisplay);

        // Populate sidebar list with hospitals
        regionHospitals.forEach(hospital => {
            const listItem = document.createElement('li');

            // Select the appropriate EHR logo based on the ehr_system value
            let ehrLogo;
            switch (hospital.ehr_system) {
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

            // Add fly-to functionality and show Back button on click
            listItem.querySelector('.clickable-hospital').addEventListener('click', () => {
                if (!sessionStartingView) {
                    sessionStartingView = {
                        center: map.getCenter(),
                        zoom: map.getZoom(),
                        pitch: map.getPitch(),
                        bearing: map.getBearing()
                    };
                }

                // Hide GT logo, show back button, and fly to selected facility location
                gtLogo.style.display = 'none';
                backButton.style.display = 'block';

                // Set a mobile-friendly zoom level
                const isMobile = window.innerWidth <= 780;
                const zoomLevel = isMobile ? 10 : 12;

                // Fly to the selected facility location
                // Fly-To Functionality on Facility Click
                // The fly-to functionality is implemented well, creating a smooth transition to the selected hospital’s location. Setting the mobile zoom level with const zoomLevel = isMobile ? 10 : 12; makes it user-friendly across devices.
                // The pitch and bearing values help in adding a sense of depth. If performance is a concern on some devices, consider testing with or without these to evaluate their impact.

                map.flyTo({
                    center: [hospital.longitude, hospital.latitude],
                    zoom: 12,
                    pitch: 45,
                    bearing: 0,
                    essential: true
                });
            });

            list.appendChild(listItem);
        });

        // Display the sidebar only if there are hospitals to show
        sidebar.style.display = regionHospitals.length > 0 ? 'block' : 'none';

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

    //Sets up a click event for a specified region layer.
    //On click, fetches and displays facility data in the sidebar for the clicked region.
    //@param {string} regionSource - The source layer ID for the map region.
    //@param {string} regionIdProp - The property name in geoJSON data that represents the region ID.
    //@param {string} regionNameProp - The property name in geoJSON data that represents the region name.

    function setRegionClickEvent(regionSource, regionIdProp, regionNameProp) {
        map.on('click', `${regionSource}-fill`, (e) => {
            const clickedRegionId = e.features[0].properties[regionIdProp];
            const regionName = e.features[0].properties[regionNameProp];
            // console.log(`Region clicked: ${regionName} (ID: ${clickedRegionId})`);

            // Use cached facilities data if available
            loadFacilitiesData()
                .then(facilities => {
                    // Filter facilities for the clicked region
                    const filteredFacilities = facilities.filter(facility =>
                        facility.region_id && facility.region_id.toUpperCase() === clickedRegionId.toUpperCase()
                    );

                    // Pass filtered facilities to populateSidebar
                    populateSidebar(clickedRegionId, regionName, filteredFacilities);
                })
                .catch(error => {
                    console.error('Error fetching facilities data:', error);
                    displayErrorMessage(error);
                });
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

    //Dynamic Sizing Example
    function adjustMarkerSize(zoomLevel) {
        const size = Math.max(15, Math.min(30, zoomLevel * 4));
        document.querySelectorAll('.custom-marker').forEach(marker => {
            marker.style.width = `${size}px`;
            marker.style.height = `${size}px`;
        });
        // console.log(`Adjusted marker size to: ${size}px at zoom level ${zoomLevel}`);
    }

    // Create a custom marker with a popup
    function createCustomMarker(lng, lat, popupContent) {
        // Create a custom marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker company-logo sidebar-logo';
        markerElement.style.width = '30px';
        markerElement.style.height = '30px';
        markerElement.style.backgroundImage = `url('./img/gtLogo.png')`;
        markerElement.style.backgroundSize = '70%';
        markerElement.style.backgroundRepeat = 'no-repeat';
        markerElement.style.backgroundPosition = 'center';
        markerElement.style.borderRadius = '50%';
        markerElement.style.transform = 'rotate(-50deg)';
        markerElement.style.transition = 'visibility 0.3s ease, transform 1s linear, opacity 0.3s ease, box-shadow 0.3s ease';
        markerElement.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.15)';

        // Add a popup to the marker
        const popup = new mapboxgl.Popup({ offset: 15 }).setHTML(popupContent);

        return new mapboxgl.Marker(markerElement)
            .setLngLat([lng, lat])
            .setPopup(popup);
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
            console.error('Invalid map bounds:', bounds);
            return;
        }

        // console.log('Map Bounds:', bounds);


        // Remove existing markers from the map
        markers.forEach(marker => marker.remove());
        markers = []; // Clear the markers array

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
    const debouncedUpdateMarkers = debounce(updateMarkers, 300);

    //Map Load Event and Fog Setting
    map.on('load', () => {
        map.setFog({});

        // addGeoJSONSource function to add each region's data source
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
        map.on('load', () => {
            console.log('Map fully loaded');
        
            startInitialRotation(); // Start the initial rotation
        
            if (markersDataReady) {
                placeStateMarkers(markersData, map); // Place state markers
            } else {
                console.warn('Markers data not ready at map load');
            }
        });
        
        //Initialize Facilities Data and Set Variables
        let facilitiesData = [];
        const regionsWithFacilities = new Set();
        const statesWithFacilities = new Set();
        let selectedStateId = null;
        const logoUrl = './img/gtLogo.png';


        // imported loadFacilitiesData function  
        loadFacilitiesData()
            .then(facilities => {
                // console.log("Facilities data loaded:", facilities);
                // Feature 1: Process regions and states
                facilitiesData = facilities;

                // regionsWithFacilities and statesWithFacilities sets
                facilities.forEach(facility => {
                    const regionId = facility.region_id ? facility.region_id.toUpperCase() : null;
                    if (regionId) {
                        regionsWithFacilities.add(regionId);
                    }

                    const stateOrRegion = facility.location.split(', ')[1];
                    if (stateOrRegion) {
                        statesWithFacilities.add(stateOrRegion);
                    }
                });

                // console.log("Facilities data loaded:", facilitiesData); // Debug


                // console.log("regionsWithFacilities:", Array.from(regionsWithFacilities));

                console.log('Locations in data:', facilitiesData.map(f => f.location));

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

               // Place State/Region markers
            placeStateMarkers(facilitiesData, map);

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
            `
                }));

                // console.log(`Markers Data Populated: ${markersData.length}`);
                markersDataReady = true;
                // console.log('Markers Data Populated:', markersData);


                // Initial render of markers
                updateMarkers();


                // debounced updateMarkers to map events
                map.on('moveend', debouncedUpdateMarkers);
                map.on('zoomend', () => {
                    debouncedUpdateMarkers();
                    adjustMarkerSize(map.getZoom());
                    // console.log('Zoom Level:', map.getZoom());
                    // console.log('Map Bounds:', map.getBounds());
                });

                // Handle map reset or view changes
                map.on('reset', () => {
                    adjustMarkerSize(map.getZoom());
                });

                // Adjust markers on reset
                map.on('reset', () => adjustMarkerSize(map.getZoom()));

                // Feature 3: Place state/region markers
                placeStateMarkers(facilities, map);

                // Feature 4: Add GT logo markers
                gtLogoMarkers.forEach(marker => {
                    marker.getElement().style.visibility = 'visible';
                });

                // Add regions dynamically for interactivity
    layerRegions.forEach(({ layerId, sourceId }) => {
        addRegionLayer(map, layerId, sourceId, regionsWithFacilities);
        addHoverOutlineLayer(map, `${layerId}-line-hover`, sourceId);
        setRegionClickEvent(sourceId, 'id', 'name');
        addRegionInteractions(map, `${layerId}-fill`, sourceId, regionsWithFacilities);
    });

    // Set up GT logo markers
    gtLogoMarkers.forEach(marker => marker.getElement().style.visibility = 'visible');


                //Dynamic Logo per Facility
                // function createGMarker(logoUrl) {
                //     const div = document.createElement('div');
                //     div.className = 'g-marker';
                //     div.style.backgroundImage = `url(${logoUrl})`;
                //     return div;
                // }

                // facilitiesData.forEach(facility => {
                //     const marker = new mapboxgl.Marker({ 
                //         element: createGMarer(facility.logoUrl) 
                //     })
                //     .setLngLat([facility.longitude, facility.latitude])
                //     .addTo(map);
                // });

                // Function to create a marker with the company logo
                function createGMarker() {
                    const div = document.createElement('div');
                    div.className = 'g-marker';
                    return div;
                }

                // Function to get state center dynamically based on main_facility
                function getStateCenterCoordinates(stateId, facilitiesData) {
                    const mainFacility = facilitiesData.find(
                        facility => facility.region_id === stateId && facility.main_facility
                    );

                    if (mainFacility) {
                        return [mainFacility.longitude, mainFacility.latitude];
                    }

                    console.warn(`No main facility found for state: ${stateId}`);
                    return null;
                }

                // Place state/region markers on the map
                // function placeStateMarkers(facilitiesData, map) {
                //     const statesWithCustomers = Array.from(
                //         new Set(facilitiesData.map(facility => facility.region_id))
                //     );

                //     const bounds = new mapboxgl.LngLatBounds();

                //     statesWithCustomers.forEach(state => {
                //         const stateCenter = getStateCenterCoordinates(state, facilitiesData);
                //         if (stateCenter) {
                //             const marker = new mapboxgl.Marker({ element: createGMarker() })
                //                 .setLngLat(stateCenter)
                //                 .addTo(map);

                //             marker.getElement().style.visibility = 'hidden'; // Initially hidden
                //             stateRegionMarkers.push(marker); // Store marker for later visibility toggle

                //             // console.log(`Marker added for state at: ${stateCenter}`);
                //             bounds.extend(stateCenter);
                //         } else {
                //             console.warn(`No center found for state: ${state}`);
                //         }
                //     });

                //     if (statesWithCustomers.length > 0) {
                //         map.fitBounds(bounds, { padding: 20 });
                //     }
                // }


                function placeStateMarkers(facilitiesData, map) {
                    const statesWithCustomers = Array.from(
                        new Set(facilitiesData.map(facility => facility.region_id))
                    );
                
                    const bounds = new mapboxgl.LngLatBounds();
                
                    statesWithCustomers.forEach(state => {
                        const stateCenter = getStateCenterCoordinates(state, facilitiesData);
                        if (stateCenter) {
                            const marker = new mapboxgl.Marker({ element: createGMarker() })
                                .setLngLat(stateCenter)
                                .addTo(map);
                
                            marker.getElement().style.visibility = 'hidden'; // Initially hidden
                            stateRegionMarkers.push(marker);
                            bounds.extend(stateCenter);
                        } else {
                            console.warn(`No center found for state: ${state}`);
                        }
                    });
                
                    // Only fit bounds after user interaction
                    if (hasInteracted && statesWithCustomers.length > 0) {
                        map.fitBounds(bounds, { padding: 20 });
                    }
                }
                

                ///

                // markers for each facility
                let markers = facilities.map(({ ehr_system, hospital_name, location, hospital_address, longitude, latitude, parent_company, hospital_count }) => {
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
                    markerElement.style.backgroundImage = `url(${logoUrl})`;
                    markerElement.style.width = '30px';
                    markerElement.style.height = '30px';
                    markerElement.style.borderRadius = '50%';
                    markerElement.style.backgroundSize = 'cover';

                    const marker = new mapboxgl.Marker(markerElement)
                        .setLngLat([longitude, latitude])
                        .setPopup(popup)
                        .addTo(map);

                    // specific hover behavior based on the hospital name
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

                    return marker;
                });

                // show regions and states
                function addRegionLayer(map, layerId, sourceId, regionsWithFacilities) {
                    const hoverColor = '#05aaff';
                    const selectedColor = '#ff8502';

                    if (map.getLayer(`${layerId}-fill`)) {
                        console.warn(`Layer with id "${layerId}-fill" already exists. Skipping addition.`);
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
                        console.warn(`Layer with id "${layerId}" already exists. Skipping addition.`);
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

                // console.log(map.getSource('us-states'));
                // console.log(map.getLayer('us-states-fill'));
                // console.log(map.getLayer('us-states-line-hover'));

                // console.log('Current layer order:', map.getStyle().layers.map(layer => layer.id));


                // addGeoJSONSource(map, 'us-states', '/data/us-states.geojson', 'id');
                // console.log("Sources after adding 'us-states':", map.getStyle().sources);


                //Function for Zoom-Based Marker Visibility
                function toggleMarkers() {
                    const zoomLevel = map.getZoom();
                    const minZoomToShowMarkers = 4;

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
                    clusterMaxZoom: 14,// To increase this value to reduce unclustered points at higher zoom levels
                    clusterRadius: 30,// To increase radius to group more points together in clusters
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
                            10, ' #0f2844',  // Medium clusters (dark blue)
                            50, '#b31919'   // Large clusters
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
                });

                map.on('zoom', () => {
                    map.setLayoutProperty('unclustered-point', 'visibility', map.getZoom() >= 6 ? 'visible' : 'none');
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

                // Cluster click event for expanding zoom level
                map.on('click', 'clusters', (e) => {
                    const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
                    const clusterId = features[0].properties.cluster_id;
                    map.getSource('hospitals').getClusterExpansionZoom(clusterId, (err, zoom) => {
                        if (err) return;
                        map.easeTo({
                            center: features[0].geometry.coordinates,
                            zoom: zoom,
                        });
                    });
                });

                // Click event on state to display sidebar list of facilities
                map.on('click', 'us-states-fill', (e) => {
                    const clickedStateId = e.features[0].properties.id;

                    // Check if the clicked state has facilities
                    if (!statesWithFacilities.has(clickedStateId)) {
                        // Hide sidebar if state doesn't have facilities
                        document.getElementById('hospital-list-sidebar').style.display = 'none';

                        // Deselect previously selected state if any
                        if (selectedStateId !== null) {
                            map.setFeatureState({ source: 'us-states', id: selectedStateId }, { selected: false });
                        }
                        selectedStateId = null;
                        return;
                    }

                    // Deselect previously selected state
                    if (selectedStateId !== null) {
                        map.setFeatureState({ source: 'us-states', id: selectedStateId }, { selected: false });
                    }

                    // Set the clicked state as selected
                    selectedStateId = clickedStateId;
                    map.setFeatureState({ source: 'us-states', id: selectedStateId }, { selected: true });

                    // Display facilities in the sidebar
                    const stateName = e.features[0].properties.name;
                    const stateHospitals = facilities.filter(hospital => hospital.location.includes(clickedStateId));

                    // const sidebar = document.getElementById('hospital-list-sidebar');
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



        // layers behavior and reset button
        function addRegionInteractions(map, layerId, sourceId, regionsWithFacilities) {
            // let hoveredRegionId = null;
            // let selectedRegionId = null;

            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const hoverEvent = isTouchDevice ? 'touchstart' : 'mousemove';


            // Add reset button functionality inside
            document.getElementById("reset-view").addEventListener("click", () => {
                // Reset the map view
                map.flyTo({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM, pitch: 0 });

                // Clear any selected regions
                clearRegionSelection();
                closeSidebar()
            });

            // Apply hover effect only to regions with facilities
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

            // Debounced hover function for non-touch devices
            const debouncedHover = debounce((e) => {
                const regionId = e.features[0].id;
                if (regionsWithFacilities.has(regionId)) {
                    applyHover(regionId);
                }
            }, 50); // 50ms debounce delay


            // Tap-to-Hover functionality for touch devices
            if (isTouchDevice) {
                map.on('touchstart', layerId, (e) => {
                    const regionId = e.features[0].id;

                    if (regionsWithFacilities.has(regionId)) {
                        if (hoveredRegionId === regionId) {
                            // If already hovered, treat it as a click
                            selectRegion(regionId);
                        } else {
                            // Otherwise, just apply hover effect
                            applyHover(regionId);
                        }
                    }
                });

                map.on('touchend', layerId, clearHover);
                map.on('touchcancel', layerId, clearHover);
            }

            // Regular hover for non-touch devices
            map.on(hoverEvent, layerId, (e) => {
                const regionId = e.features[0].id;
                if (regionsWithFacilities.has(regionId)) {
                    applyHover(regionId);
                }
            });

            // Clear hover effect on mouse leave for non-touch devices
            if (!isTouchDevice) {
                map.on('mouseleave', layerId, clearHover);
            }

            // Function to select a region
            function selectRegion(regionId) {
                clearRegionSelection(); // Clear previous selection

                selectedRegionId = regionId;
                map.setFeatureState({ source: sourceId, id: selectedRegionId }, { selected: true });

                // Update sidebar for the new selection
                updateSidebarForRegion(regionId);
            }

            // Handle selection on click
            map.on('click', layerId, (e) => {
                const regionId = e.features[0].id;
                if (regionsWithFacilities.has(regionId)) {
                    selectRegion(regionId);
                }
            });

            // Clear selection when clicking outside
            map.on('click', (e) => {
                const features = map.queryRenderedFeatures(e.point, { layers: [layerId] });
                if (features.length === 0) {
                    clearRegionSelection();
                }
            });

            // Clear selection and hover states when the sidebar is closed
            function clearRegionSelection() {
                clearHover();
                if (selectedRegionId !== null) {
                    map.setFeatureState({ source: sourceId, id: selectedRegionId }, { selected: false });
                    selectedRegionId = null;
                }
            }

            // Attach clear function to sidebar close
            document.getElementById('close-sidebar').addEventListener('click', clearRegionSelection);

            // Placeholder function to update sidebar content based on region selection
            function updateSidebarForRegion(regionId) {
                // Logic to show content for the selected region in the sidebar
            }
        }

        // Define the closeSidebar function
        function closeSidebar() {
            sidebar.style.display = 'none';
            if (selectedStateId !== null) {
                map.setFeatureState({ source: 'us-states', id: selectedStateId }, { selected: false });
            }
            selectedStateId = null;
        }
        document.getElementById('close-sidebar').addEventListener('click', closeSidebar);

        // Reset view button
        // document.getElementById("reset-view").addEventListener("click", () => {
        //     map.flyTo({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM, pitch: 0 });
        // });

        // Fly-to buttons for navigating regions
        document.getElementById("fit-to-usa").addEventListener("click", () => {
            map.fitBounds([
                [-165.031128, 65.476793],
                [-81.131287, 26.876143]
            ]);
        });

        const regions = {
            usa: { center: [-101.714859, 39.710884], zoom: 4, pitch: 45 },
            uk: { center: [360.242386, 51.633362], zoom: 4, pitch: 45 },
            italy: { center: [12.563553, 42.798676], zoom: 4, pitch: 45 },
            canada: { center: [-106.3468, 56.1304], zoom: 4, pitch: 30 },
            aruba: { center: [-70.027, 12.5246], zoom: 7, pitch: 45 }
        };

        function flyToRegion(region) {
            const { center, zoom, pitch } = regions[region];
            map.flyTo({ center, zoom, pitch });
        }

        //Attaching event listeners
        document.getElementById("fly-to-usa").addEventListener("click", () => flyToRegion('usa'));
        document.getElementById("fly-to-uk").addEventListener("click", () => flyToRegion('uk'));
        document.getElementById("fly-to-italy").addEventListener("click", () => flyToRegion('italy'));
        document.getElementById("fly-to-canada").addEventListener("click", () => flyToRegion('canada'));
        document.getElementById("fly-to-aruba").addEventListener("click", () => flyToRegion('aruba'));

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



// this works
//Imports and Mapbox Token Initialization
import { MAPBOX_TOKEN } from './config.js';
import { loadFacilitiesData } from './dataLoader.js';
// import debounce from 'lodash.debounce';
mapboxgl.accessToken = MAPBOX_TOKEN;

// Map Initialization on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("hospital-list-sidebar");
    const sidebarHeader = document.querySelector(".sidebar-header");
    const backToTopButton = document.getElementById('back-to-top-button');
    // const minimizeButton = document.getElementById('minimize-sidebar');

    sidebar.addEventListener('click', (event) => {
        event.stopPropagation();
    });
    const gtLogo = document.querySelector('.sidebar-logo');
    const backButton = document.createElement('button');

    //set the initial view of Mapbox globe
    const INITIAL_CENTER = [-75.4265, 40.0428]; //The coordinates for 1235 Westlakes Drive, Suite 120, Berwyn, PA 19312, are approximately 40.06361° N latitude and 75.47156° W longitude
    const INITIAL_ZOOM = 1;

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v11',
        projection: 'globe',
        zoom: INITIAL_ZOOM,
        center: INITIAL_CENTER,
    });

    // Adding navigation controls
    map.addControl(new mapboxgl.NavigationControl());
    // map.addControl(new mapboxgl.NavigationControl({ position: 'top-left' }));
    // map.scrollZoom.disable();

    // Variables    
    let userInteracting = false;
    let hasInteracted = false;
    // let isInitialRotation = true;
    let hoveredRegionId = null;
    let selectedRegionId = null;

    // Global variables for markers
    let stateRegionMarkers = [];
    let markers = []; // To store Mapbox markers
    let markersData = []; // To store marker data from facilities
    let markersDataReady = false; // Flag to indicate markersData readiness

    // spin the globe smoothly when zoomed out
    function spinGlobe() {
        if (!userInteracting && map.getZoom() < 5) {
            const center = map.getCenter();
            center.lng -= 360 / 240;
            map.easeTo({ center, duration: 1000, easing: (n) => n });
        }
    }

    // Event listeners for user interaction
    map.on('mousedown', () => userInteracting = true);
    map.on('dragstart', () => userInteracting = true);
    // map.on('moveend', () => spinGlobe());

    map.on('moveend', () => {
        spinGlobe(); // 
        updateMarkers();
        // console.log('Markers Data:', markersData); // Verify markersData is populated
    });

    // Start the globe spinning animation
    spinGlobe();

    // Map Animation on Load to set the globe to your preferred size and center
    map.on('load', () => {
        console.log('Map loaded');
        map.easeTo({
            center: [-75.4265, 40.0428],
            // zoom: 0,
            zoom: 1,
            duration: 3000,
            easing: (t) => t * (2 - t)
        });
    });

    //animated pulsing Dot icon
    const size = 50;
    // This implements `StyleImageInterface`
    // to draw a pulsing dot icon on the map.
    const pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        // When the layer is added to the map,
        // get the rendering context for the map canvas.

        onAdd: function () {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext('2d', { willReadFrequently: true });
            // console.log('Canvas initialized with willReadFrequently:', this.context);
        },

        // Call once before every frame where the icon will be used.
        render: function () {
            const duration = 1000;
            const t = (performance.now() % duration) / duration;

            const radius = (size / 2) * 0.3;
            const outerRadius = (size / 2) * 0.7 * t + radius;
            const context = this.context;

            // Draw the outer circle.
            context.clearRect(0, 0, this.width, this.height);
            context.beginPath();
            context.arc(
                this.width / 2,
                this.height / 2,
                outerRadius,
                0,
                Math.PI * 2
            );

            //Goliath colors
            // #ff8b1f: A vibrant orange; suitable for the outer circle or stroke.
            // #0f2844: A dark blue; ideal for the inner circle or border.
            // #ff0000: Bright red; can be used for the pulsing effect or an accent.
            // #ffffff: White; perfect for a border or subtle inner detail.

            context.fillStyle = `rgba(255, 139, 31, ${1 - t})`; // Orange (Outer Circle)
            context.fill();

            // Draw the inner circle.
            context.beginPath();
            context.arc(
                this.width / 2,
                this.height / 2,
                radius,
                0,
                Math.PI * 2
            );
            context.fillStyle = '#0f2844'; // Dark Blue (Inner Circle)
            context.strokeStyle = '#ffffff'; // White Border
            // context.strokeStyle = '#ff0000'; 
            context.lineWidth = 2 + 4 * (1 - t);
            context.fill();
            context.stroke();

            // Update this image's data with data from the canvas.
            this.data = context.getImageData(
                0,
                0,
                this.width,
                this.height
            ).data;
            // console.log('Canvas context:', this.context); // Should not be undefined
            // console.log('Image data:', context.getImageData(0, 0, this.width, this.height).data); // Check if this runs


            // Continuously repaint the map, resulting
            // in the smooth animation of the dot.
            map.triggerRepaint();

            // Return `true` to let the map know that the image was updated.
            return true;
        }
    };

    map.on('load', () => {

        // console.log('Map loaded.');

        map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

        // console.log('Pulsing dot image added.');

        map.addSource('dot-point', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': [
                    {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [-75.4265, 40.0428] // icon position [lng, lat]
                        }
                    }
                ]
            }
        });

        // console.log('Source for pulsing dot added.');

        map.addLayer({
            'id': 'layer-with-pulsing-dot',
            'type': 'symbol',
            'source': 'dot-point',
            'layout': {
                'icon-image': 'pulsing-dot'
            }
        });
        // console.log('Layer for pulsing dot added.');

    });

    // Define GT logo markers for specified countries
    const countries = [
        { name: 'USA', lngLat: [-80.147085, 30.954096] }, // gt office Near by location
        { name: 'UK', lngLat: [-1.654816, 52.181932] },
        { name: 'Aruba', lngLat: [-69.952269, 12.512168] },
        { name: 'Canada', lngLat: [-106.728058, 57.922142] },
        { name: 'Italy', lngLat: [12.465363, 42.835192] },
    ];

    // Initialize GT logo markers, making them initially visible
    const gtLogoMarkers = countries.map(country => {
        const logoElement = document.createElement('div');
        logoElement.className = 'company-logo';
        logoElement.style.backgroundImage = 'url(./img/gtLogo.png)';
        const marker = new mapboxgl.Marker(logoElement, {
            rotationAlignment: 'map',
            offset: [0, -15],
        }).setLngLat(country.lngLat).addTo(map);

        // Set initial visibility to visible
        marker.getElement().style.visibility = 'visible';
        return marker;
    });

    // Utility function to safely set layer visibility if the layer exists
    function setLayerVisibility(layerId, visibility) {
        if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, 'visibility', visibility);
        }
    }

    // Hide clusters on sourcedata load event to ensure they are hidden initially
    map.on('sourcedata', (e) => {
        if (!hasInteracted && e.isSourceLoaded) {
            // Ensure clusters remain hidden on load
            setLayerVisibility('clusters', 'none');
            setLayerVisibility('cluster-count', 'none');
            setLayerVisibility('unclustered-point', 'none');
        }
    });

    // Initial globe rotation, show GT logos, and ensure clusters are hidden
    function startInitialRotation() {
        // globe animation with GT logos visible
        map.easeTo({
            center: [-75.4265, 40.0428],
            zoom: 1,
            duration: 3000,
            easing: (t) => t * (2 - t),
        });
    }

    // Function to handle first interaction, hiding GT logos and showing clusters

    function onFirstInteraction() {
        if (!hasInteracted) {
            hasInteracted = true;

            // Hide GT logos permanently after the first interaction
            gtLogoMarkers.forEach(marker => {
                marker.getElement().style.visibility = 'hidden';
            });

            // Show clusters to follow their normal functionality
            setLayerVisibility('clusters', 'visible');
            setLayerVisibility('cluster-count', 'visible');
            setLayerVisibility('unclustered-point', 'visible');

            // Show state/region markers after the first interaction
            stateRegionMarkers.forEach(marker => {
                marker.getElement().style.visibility = 'visible'; 
            });

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

            // Use MutationObserver to detect when the input is added
            const observer = new MutationObserver(() => {
                const geocoderInput = geocoderContainer.querySelector('input[type="text"]');
                if (geocoderInput) {
                    geocoderInput.focus();
                    observer.disconnect(); // Stop observing once input is found and focused
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

    // Function to toggle the back-to-top button visibility
    function toggleBackToTopButton() {
        const isCollapsed = sidebar.classList.contains('collapsed'); // Sidebar is minimized
        const isScrollable = sidebar.scrollHeight > sidebar.clientHeight; // Sidebar has overflow
        const isSmallScreen = window.innerWidth <= 480; // Check for small screens

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
        const isCollapsed = sidebar.classList.contains('collapsed'); // Sidebar is minimized
        const isScrollable = sidebar.scrollHeight > sidebar.clientHeight; // Sidebar has overflow
        const isSmallScreen = window.innerWidth <= 480; // Check for small screens

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

        // Use a delay to recalculate dimensions accurately after transition
        setTimeout(() => {
            toggleBackToTopButton();
        }, 200); // Match with the CSS transition duration if needed

        // Update the minimize icon based on sidebar state
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
    // let previousRegionView = null;

    // Configure the "Back" button
    backButton.id = 'back-button';
    backButton.classList.add('round-button');
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
    backButton.style.display = 'none';
    document.querySelector('.sidebar-header').appendChild(backButton);

    function resetToSessionView() {
        if (sessionStartingView) {
            const isMobile = window.innerWidth <= 780;
            const zoomLevel = isMobile ? sessionStartingView.zoom - 1 : sessionStartingView.zoom;

            map.flyTo({
                center: sessionStartingView.center,
                zoom: zoomLevel,
                pitch: sessionStartingView.pitch,
                bearing: sessionStartingView.bearing
            });

            backButton.style.display = 'none';
            gtLogo.style.display = 'block';
            sessionStartingView = null;
        }
    }

    backButton.addEventListener('click', resetToSessionView);

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
            //     console.log(`Source with ID "${sourceId}" added successfully.`);
        }
        // else {
        //     console.warn(`Source with ID "${sourceId}" already exists. Skipping addition.`);
        // }
        // console.log('Current sources:', map.getStyle().sources);
    }

    // Adjust sidebar height based on content size
    function adjustSidebarHeight() {
        // const sidebar = document.getElementById('hospital-list-sidebar');
        const hospitalList = document.getElementById('hospital-list');

        // Check if content fits without overflow
        if (hospitalList.scrollHeight <= sidebar.clientHeight) {
            sidebar.classList.add('auto-height');
        } else {
            sidebar.classList.remove('auto-height');
        }
    }

    //populateSidebar function.
    function populateSidebar(regionId, regionName, facilities) {
        // console.log(`Populating sidebar for region: ${regionName} (ID: ${regionId})`);

        // const sidebar = document.getElementById('hospital-list-sidebar');
        const list = document.getElementById('hospital-list');
        list.innerHTML = '';

        // Update sidebar title with the region name
        const title = sidebar.querySelector('h2');
        title.innerText = `Facilities Using Goliath's Solutions in ${regionName}`;

        // Remove any existing count display
        const existingCountDisplay = sidebar.querySelector('.count-display');
        if (existingCountDisplay) existingCountDisplay.remove();

        // Filter facilities by region
        const regionHospitals = facilities.filter(hospital =>
            hospital.location.includes(regionName) || hospital.region_id === regionId
        );

        // Calculate total facility count, accounting for multi-hospital entries
        const totalHospitalCount = regionHospitals.reduce((sum, hospital) =>
            sum + (hospital.hospital_count || 1), 0
        );

        // console.log(`Found ${regionHospitals.length} hospitals in ${regionName} with a total of ${totalHospitalCount} facilities.`);

        // Display total facility count in the sidebar
        const countDisplay = document.createElement('p');
        countDisplay.classList.add('count-display');
        countDisplay.innerHTML = `Total Facilities: <span style="color: #ff8502;">${totalHospitalCount}</span>`;
        countDisplay.style.fontWeight = 'bold';
        countDisplay.style.color = '#FFFFFF';
        countDisplay.style.marginTop = '10px';
        list.before(countDisplay);

        // Populate sidebar list with hospitals
        regionHospitals.forEach(hospital => {
            const listItem = document.createElement('li');

            // Select the appropriate EHR logo based on the ehr_system value
            let ehrLogo;
            switch (hospital.ehr_system) {
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

            // Add fly-to functionality and show Back button on click
            listItem.querySelector('.clickable-hospital').addEventListener('click', () => {
                if (!sessionStartingView) {
                    sessionStartingView = {
                        center: map.getCenter(),
                        zoom: map.getZoom(),
                        pitch: map.getPitch(),
                        bearing: map.getBearing()
                    };
                }

                // Hide GT logo, show back button, and fly to selected facility location
                gtLogo.style.display = 'none';
                backButton.style.display = 'block';

                // Set a mobile-friendly zoom level
                const isMobile = window.innerWidth <= 780;
                const zoomLevel = isMobile ? 10 : 12;

                // Fly to the selected facility location
                // Fly-To Functionality on Facility Click
                // The fly-to functionality is implemented well, creating a smooth transition to the selected hospital’s location. Setting the mobile zoom level with const zoomLevel = isMobile ? 10 : 12; makes it user-friendly across devices.
                // The pitch and bearing values help in adding a sense of depth. If performance is a concern on some devices, consider testing with or without these to evaluate their impact.

                map.flyTo({
                    center: [hospital.longitude, hospital.latitude],
                    zoom: 12,
                    pitch: 45,
                    bearing: 0,
                    essential: true
                });
            });

            list.appendChild(listItem);
        });

        // Display the sidebar only if there are hospitals to show
        sidebar.style.display = regionHospitals.length > 0 ? 'block' : 'none';

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

    //Sets up a click event for a specified region layer.
    //On click, fetches and displays facility data in the sidebar for the clicked region.
    //@param {string} regionSource - The source layer ID for the map region.
    //@param {string} regionIdProp - The property name in geoJSON data that represents the region ID.
    //@param {string} regionNameProp - The property name in geoJSON data that represents the region name.

    function setRegionClickEvent(regionSource, regionIdProp, regionNameProp) {
        map.on('click', `${regionSource}-fill`, (e) => {
            const clickedRegionId = e.features[0].properties[regionIdProp];
            const regionName = e.features[0].properties[regionNameProp];
            // console.log(`Region clicked: ${regionName} (ID: ${clickedRegionId})`);

            // Use cached facilities data if available
            loadFacilitiesData()
                .then(facilities => {
                    // Filter facilities for the clicked region
                    const filteredFacilities = facilities.filter(facility =>
                        facility.region_id && facility.region_id.toUpperCase() === clickedRegionId.toUpperCase()
                    );

                    // Pass filtered facilities to populateSidebar
                    populateSidebar(clickedRegionId, regionName, filteredFacilities);
                })
                .catch(error => {
                    console.error('Error fetching facilities data:', error);
                    displayErrorMessage(error);
                });
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

    //Dynamic Sizing Example
    function adjustMarkerSize(zoomLevel) {
        const size = Math.max(15, Math.min(30, zoomLevel * 4));
        document.querySelectorAll('.custom-marker').forEach(marker => {
            marker.style.width = `${size}px`;
            marker.style.height = `${size}px`;
        });
        // console.log(`Adjusted marker size to: ${size}px at zoom level ${zoomLevel}`);
    }

    // Create a custom marker with a popup
    function createCustomMarker(lng, lat, popupContent) {
        // Create a custom marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker company-logo sidebar-logo';
        markerElement.style.width = '20px';
        markerElement.style.height = '20px';
        markerElement.style.backgroundImage = `url('./img/gtLogo.png')`;
        markerElement.style.backgroundSize = '50%';
        markerElement.style.backgroundRepeat = 'no-repeat';
        markerElement.style.backgroundPosition = 'center';
        markerElement.style.borderRadius = '50%';
        markerElement.style.transform = 'rotate(-50deg)';
        markerElement.style.transition = 'visibility 0.3s ease, transform 1s linear, opacity 0.3s ease, box-shadow 0.3s ease';
        markerElement.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.15)';

        // Add a popup to the marker
        const popup = new mapboxgl.Popup({ offset: 15 }).setHTML(popupContent);

        return new mapboxgl.Marker(markerElement)
            .setLngLat([lng, lat])
            .setPopup(popup);
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
            console.error('Invalid map bounds:', bounds);
            return;
        }

        // console.log('Map Bounds:', bounds);


        // Remove existing markers from the map
        markers.forEach(marker => marker.remove());
        markers = []; // Clear the markers array

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
    const debouncedUpdateMarkers = debounce(updateMarkers, 300);

    //Map Load Event and Fog Setting
    map.on('load', () => {
        map.setFog({});

        // addGeoJSONSource function to add each region's data source
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
        map.on('load', () => {
            console.log('Map fully loaded');
        
            startInitialRotation(); // Start the initial rotation
        
            if (markersDataReady) {
                placeStateMarkers(markersData, map); // Place state markers
            } else {
                console.warn('Markers data not ready at map load');
            }
        });
        
        //Initialize Facilities Data and Set Variables
        let facilitiesData = [];
        const regionsWithFacilities = new Set();
        const statesWithFacilities = new Set();
        let selectedStateId = null;
        const logoUrl = './img/gtLogo.png';


        // imported loadFacilitiesData function  
        loadFacilitiesData()
            .then(facilities => {
                // console.log("Facilities data loaded:", facilities);
                // Feature 1: Process regions and states
                facilitiesData = facilities;

                // regionsWithFacilities and statesWithFacilities sets
                facilities.forEach(facility => {
                    const regionId = facility.region_id ? facility.region_id.toUpperCase() : null;
                    if (regionId) {
                        regionsWithFacilities.add(regionId);
                    }

                    const stateOrRegion = facility.location.split(', ')[1];
                    if (stateOrRegion) {
                        statesWithFacilities.add(stateOrRegion);
                    }
                });

                // console.log("Facilities data loaded:", facilitiesData); // Debug


                // console.log("regionsWithFacilities:", Array.from(regionsWithFacilities));

                console.log('Locations in data:', facilitiesData.map(f => f.location));

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

               // Place State/Region markers
            placeStateMarkers(facilitiesData, map);

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
            `
                }));

                // console.log(`Markers Data Populated: ${markersData.length}`);
                markersDataReady = true;
                // console.log('Markers Data Populated:', markersData);


                // Initial render of markers
                updateMarkers();


                // debounced updateMarkers to map events
                map.on('moveend', debouncedUpdateMarkers);
                map.on('zoomend', () => {
                    debouncedUpdateMarkers();
                    adjustMarkerSize(map.getZoom());
                    // console.log('Zoom Level:', map.getZoom());
                    // console.log('Map Bounds:', map.getBounds());
                });

                // Handle map reset or view changes
                map.on('reset', () => {
                    adjustMarkerSize(map.getZoom());
                });

                // Adjust markers on reset
                map.on('reset', () => adjustMarkerSize(map.getZoom()));

                // Feature 3: Place state/region markers
                placeStateMarkers(facilities, map);

                // Feature 4: Add GT logo markers
                gtLogoMarkers.forEach(marker => {
                    marker.getElement().style.visibility = 'visible';
                });

    //             // Add regions dynamically for interactivity
    // layerRegions.forEach(({ layerId, sourceId }) => {
    //     addRegionLayer(map, layerId, sourceId, regionsWithFacilities);
    //     addHoverOutlineLayer(map, `${layerId}-line-hover`, sourceId);
    //     setRegionClickEvent(sourceId, 'id', 'name');
    //     addRegionInteractions(map, `${layerId}-fill`, sourceId, regionsWithFacilities);
    // });

    // Set up GT logo markers
    gtLogoMarkers.forEach(marker => marker.getElement().style.visibility = 'visible');


                //Dynamic Logo per Facility
                // function createGMarker(logoUrl) {
                //     const div = document.createElement('div');
                //     div.className = 'g-marker';
                //     div.style.backgroundImage = `url(${logoUrl})`;
                //     return div;
                // }

                // facilitiesData.forEach(facility => {
                //     const marker = new mapboxgl.Marker({ 
                //         element: createGMarer(facility.logoUrl) 
                //     })
                //     .setLngLat([facility.longitude, facility.latitude])
                //     .addTo(map);
                // });

                // Function to create a marker with the company logo
                function createGMarker() {
                    const div = document.createElement('div');
                    div.className = 'g-marker';
                    return div;
                }

                // Function to get state center dynamically based on main_facility
                function getStateCenterCoordinates(stateId, facilitiesData) {
                    const mainFacility = facilitiesData.find(
                        facility => facility.region_id === stateId && facility.main_facility
                    );

                    if (mainFacility) {
                        return [mainFacility.longitude, mainFacility.latitude];
                    }

                    console.warn(`No main facility found for state: ${stateId}`);
                    return null;
                }

                // Place state/region markers on the map
                // function placeStateMarkers(facilitiesData, map) {
                //     const statesWithCustomers = Array.from(
                //         new Set(facilitiesData.map(facility => facility.region_id))
                //     );

                //     const bounds = new mapboxgl.LngLatBounds();

                //     statesWithCustomers.forEach(state => {
                //         const stateCenter = getStateCenterCoordinates(state, facilitiesData);
                //         if (stateCenter) {
                //             const marker = new mapboxgl.Marker({ element: createGMarker() })
                //                 .setLngLat(stateCenter)
                //                 .addTo(map);

                //             marker.getElement().style.visibility = 'hidden'; // Initially hidden
                //             stateRegionMarkers.push(marker); // Store marker for later visibility toggle

                //             // console.log(`Marker added for state at: ${stateCenter}`);
                //             bounds.extend(stateCenter);
                //         } else {
                //             console.warn(`No center found for state: ${state}`);
                //         }
                //     });

                //     if (statesWithCustomers.length > 0) {
                //         map.fitBounds(bounds, { padding: 20 });
                //     }
                // }


                function placeStateMarkers(facilitiesData, map) {
                    const statesWithCustomers = Array.from(
                        new Set(facilitiesData.map(facility => facility.region_id))
                    );
                
                    const bounds = new mapboxgl.LngLatBounds();
                
                    statesWithCustomers.forEach(state => {
                        const stateCenter = getStateCenterCoordinates(state, facilitiesData);
                        if (stateCenter) {
                            const marker = new mapboxgl.Marker({ element: createGMarker() })
                                .setLngLat(stateCenter)
                                .addTo(map);
                
                            marker.getElement().style.visibility = 'hidden'; // Initially hidden
                            stateRegionMarkers.push(marker);
                            bounds.extend(stateCenter);
                        } else {
                            console.warn(`No center found for state: ${state}`);
                        }
                    });
                
                    // Only fit bounds after user interaction
                    if (hasInteracted && statesWithCustomers.length > 0) {
                        map.fitBounds(bounds, { padding: 20 });
                    }
                }          

                // markers for each facility
                let markers = facilities.map(({ ehr_system, hospital_name, location, hospital_address, longitude, latitude, parent_company, hospital_count }) => {
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
                    markerElement.style.backgroundImage = `url(${logoUrl})`;
                    markerElement.style.width = '20px';
                    markerElement.style.height = '20px';
                    markerElement.style.borderRadius = '50%';
                    markerElement.style.backgroundSize = 'cover';

                    const marker = new mapboxgl.Marker(markerElement)
                        .setLngLat([longitude, latitude])
                        .setPopup(popup)
                        .addTo(map);

                    // specific hover behavior based on the hospital name
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

                    return marker;
                });

                // show regions and states
                function addRegionLayer(map, layerId, sourceId, regionsWithFacilities) {
                    const hoverColor = '#05aaff';
                    const selectedColor = '#ff8502';

                    if (map.getLayer(`${layerId}-fill`)) {
                        console.warn(`Layer with id "${layerId}-fill" already exists. Skipping addition.`);
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
                        console.warn(`Layer with id "${layerId}" already exists. Skipping addition.`);
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

                // console.log(map.getSource('us-states'));
                // console.log(map.getLayer('us-states-fill'));
                // console.log(map.getLayer('us-states-line-hover'));

                // console.log('Current layer order:', map.getStyle().layers.map(layer => layer.id));


                // addGeoJSONSource(map, 'us-states', '/data/us-states.geojson', 'id');
                // console.log("Sources after adding 'us-states':", map.getStyle().sources);


                //Function for Zoom-Based Marker Visibility
                function toggleMarkers() {
                    const zoomLevel = map.getZoom();
                    const minZoomToShowMarkers = 4;

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
                    clusterMaxZoom: 14,// To increase this value to reduce unclustered points at higher zoom levels
                    clusterRadius: 30,// To increase radius to group more points together in clusters
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
                            10, ' #0f2844',  // Medium clusters (dark blue)
                            50, '#b31919'   // Large clusters
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
                });

                map.on('zoom', () => {
                    map.setLayoutProperty('unclustered-point', 'visibility', map.getZoom() >= 6 ? 'visible' : 'none');
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

                // Cluster click event for expanding zoom level
                map.on('click', 'clusters', (e) => {
                    const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
                    const clusterId = features[0].properties.cluster_id;
                    map.getSource('hospitals').getClusterExpansionZoom(clusterId, (err, zoom) => {
                        if (err) return;
                        map.easeTo({
                            center: features[0].geometry.coordinates,
                            zoom: zoom,
                        });
                    });
                });

                // Click event on state to display sidebar list of facilities
                map.on('click', 'us-states-fill', (e) => {
                    const clickedStateId = e.features[0].properties.id;

                    // Check if the clicked state has facilities
                    if (!statesWithFacilities.has(clickedStateId)) {
                        // Hide sidebar if state doesn't have facilities
                        document.getElementById('hospital-list-sidebar').style.display = 'none';

                        // Deselect previously selected state if any
                        if (selectedStateId !== null) {
                            map.setFeatureState({ source: 'us-states', id: selectedStateId }, { selected: false });
                        }
                        selectedStateId = null;
                        return;
                    }

                    // Deselect previously selected state
                    if (selectedStateId !== null) {
                        map.setFeatureState({ source: 'us-states', id: selectedStateId }, { selected: false });
                    }

                    // Set the clicked state as selected
                    selectedStateId = clickedStateId;
                    map.setFeatureState({ source: 'us-states', id: selectedStateId }, { selected: true });

                    // Display facilities in the sidebar
                    const stateName = e.features[0].properties.name;
                    const stateHospitals = facilities.filter(hospital => hospital.location.includes(clickedStateId));

                    // const sidebar = document.getElementById('hospital-list-sidebar');
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



//  // layers behavior and reset button
//  function addRegionInteractions(map, layerId, sourceId, regionsWithFacilities) {
//     let hoveredRegionId = null;
//     let selectedRegionId = null;

//     const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
//     const hoverEvent = isTouchDevice ? 'touchstart' : 'mousemove';


//     // Add reset button functionality inside
// document.getElementById("reset-view").addEventListener("click", () => {
// // Reset the map view
// map.flyTo({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM, pitch: 0 });

// // Clear any selected regions
// clearRegionSelection();
// closeSidebar() 
// });

//     // Apply hover effect only to regions with facilities
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

//     // Debounced hover function for non-touch devices
//     const debouncedHover = debounce((e) => {
//         const regionId = e.features[0].id;
//         if (regionsWithFacilities.has(regionId)) {
//             applyHover(regionId);
//         }
//     }, 50); // 50ms debounce delay


//     // Tap-to-Hover functionality for touch devices
//     if (isTouchDevice) {
//         map.on('touchstart', layerId, (e) => {
//             const regionId = e.features[0].id;

//             if (regionsWithFacilities.has(regionId)) {
//                 if (hoveredRegionId === regionId) {
//                     // If already hovered, treat it as a click
//                     selectRegion(regionId);
//                 } else {
//                     // Otherwise, just apply hover effect
//                     applyHover(regionId);
//                 }
//             }
//         });

//         map.on('touchend', layerId, clearHover);
//         map.on('touchcancel', layerId, clearHover);
//     }

//     // Regular hover for non-touch devices
//     map.on(hoverEvent, layerId, (e) => {
//         const regionId = e.features[0].id;
//         // if (regionsWithFacilities.has(regionId)) {
//         //     applyHover(regionId);
//         // }
//         applyHover(regionId);
//     });

//     // Clear hover effect on mouse leave for non-touch devices
//     if (!isTouchDevice) {
//         map.on('mouseleave', layerId, clearHover);
//     }

//     // Function to select a region
//     function selectRegion(regionId) {
//         clearRegionSelection(); // Clear previous selection

//         selectedRegionId = regionId;
//         map.setFeatureState({ source: sourceId, id: selectedRegionId }, { selected: true });

//         // Update sidebar for the new selection
//         updateSidebarForRegion(regionId);
//     }

//     // Handle selection on click
//     map.on('click', layerId, (e) => {
//         const regionId = e.features[0].id;
//         if (regionsWithFacilities.has(regionId)) {
//             selectRegion(regionId);
//         }
//     });

//     // Clear selection when clicking outside
//     map.on('click', (e) => {
//         const features = map.queryRenderedFeatures(e.point, { layers: [layerId] });
//         if (features.length === 0) {
//             clearRegionSelection();
//         }
//     });

//     // Clear selection and hover states when the sidebar is closed
//     function clearRegionSelection() {
//         clearHover();
//         if (selectedRegionId !== null) {
//             map.setFeatureState({ source: sourceId, id: selectedRegionId }, { selected: false });
//             selectedRegionId = null;
//         }
//     }

//     // Attach clear function to sidebar close
//     document.getElementById('close-sidebar').addEventListener('click', clearRegionSelection);

//     // Placeholder function to update sidebar content based on region selection
//     function updateSidebarForRegion(regionId) {
//         // Logic to show content for the selected region in the sidebar
//     }
// }


function addRegionInteractions(map, layerId, sourceId, regionsWithFacilities) {
    let hoveredRegionId = null;
    let selectedRegionId = null;
    let locationMarkers = []; // Store individual location markers

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const hoverEvent = isTouchDevice ? 'touchstart' : 'mousemove';

    // Reset button functionality
    document.getElementById("reset-view").addEventListener("click", () => {
        map.flyTo({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM, pitch: 0 });
        clearRegionSelection();
        closeSidebar();
    });

    // Apply hover effect only to regions with facilities
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

    // Tap-to-Hover functionality for touch devices
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
    }

    // Hover for non-touch devices
    map.on(hoverEvent, layerId, (e) => {
        const regionId = e.features[0].id;
        applyHover(regionId);
    });

    if (!isTouchDevice) {
        map.on('mouseleave', layerId, clearHover);
    }

    // Function to select a region
    function selectRegion(regionId) {
        clearRegionSelection(); // Clear previous selection

        selectedRegionId = regionId;
        map.setFeatureState({ source: sourceId, id: selectedRegionId }, { selected: true });

        // Fetch locations for the selected region
        const locationsInRegion = facilities.filter(facility => facility.region_id === regionId);

        // Add markers for each location
        locationsInRegion.forEach(location => {
            const marker = new mapboxgl.Marker({ color: '#ff8502' }) // Customize marker color
                .setLngLat([location.longitude, location.latitude])
                .addTo(map);
            locationMarkers.push(marker); // Store marker for later removal
        });

        updateSidebarForRegion(regionId); // Update sidebar
    }

    // Clear selection when clicking outside
    map.on('click', (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: [layerId] });
        if (features.length === 0) {
            clearRegionSelection();
        }
    });

    // Function to clear selection and markers
    function clearRegionSelection() {
        clearHover();

        if (selectedRegionId !== null) {
            map.setFeatureState({ source: sourceId, id: selectedRegionId }, { selected: false });
            selectedRegionId = null;
        }

        // Remove all location markers
        locationMarkers.forEach(marker => marker.remove());
        locationMarkers = [];
    }

    // Attach clearRegionSelection to sidebar close button
    document.getElementById('close-sidebar').addEventListener('click', () => {
        clearRegionSelection();
        closeSidebar();
    });

    // Prevent markers from showing on zoom
    map.on('zoom', () => {
        // No action required on zoom - markers are controlled via selectRegion
    });

    // Placeholder function for updating the sidebar
    function updateSidebarForRegion(regionId) {
        // Logic to display region-specific details in the sidebar
    }
}



        // Define the closeSidebar function
        function closeSidebar() {
            sidebar.style.display = 'none';
            if (selectedStateId !== null) {
                map.setFeatureState({ source: 'us-states', id: selectedStateId }, { selected: false });
            }
            selectedStateId = null;
        }
        document.getElementById('close-sidebar').addEventListener('click', closeSidebar);
        

        // Reset view button
        // document.getElementById("reset-view").addEventListener("click", () => {
        //     map.flyTo({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM, pitch: 0 });
        // });

        // Fly-to buttons for navigating regions
        document.getElementById("fit-to-usa").addEventListener("click", () => {
            map.fitBounds([
                [-165.031128, 65.476793],
                [-81.131287, 26.876143]
            ]);
        });

        const regions = {
            usa: { center: [-101.714859, 39.710884], zoom: 4, pitch: 45 },
            uk: { center: [360.242386, 51.633362], zoom: 4, pitch: 45 },
            italy: { center: [12.563553, 42.798676], zoom: 4, pitch: 45 },
            canada: { center: [-106.3468, 56.1304], zoom: 4, pitch: 30 },
            aruba: { center: [-70.027, 12.5246], zoom: 7, pitch: 45 }
        };

        function flyToRegion(region) {
            const { center, zoom, pitch } = regions[region];
            map.flyTo({ center, zoom, pitch });
        }

        //Attaching event listeners
        document.getElementById("fly-to-usa").addEventListener("click", () => flyToRegion('usa'));
        document.getElementById("fly-to-uk").addEventListener("click", () => flyToRegion('uk'));
        document.getElementById("fly-to-italy").addEventListener("click", () => flyToRegion('italy'));
        document.getElementById("fly-to-canada").addEventListener("click", () => flyToRegion('canada'));
        document.getElementById("fly-to-aruba").addEventListener("click", () => flyToRegion('aruba'));

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