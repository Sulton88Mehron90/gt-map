//Imports and Mapbox Token Initialization
import { MAPBOX_TOKEN } from './config.js';
import { loadFacilitiesData } from './dataLoader.js';
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
    const INITIAL_CENTER = [-75.4265, 40.0428];
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

    // Variables for user interaction detection
    let userInteracting = false;

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
    map.on('moveend', () => spinGlobe());

    // Start the globe spinning animation
    spinGlobe();

    // Map Animation on Load to set the globe to your preferred size and center
    map.on('load', () => {
        map.easeTo({
            center: [-75.4265, 40.0428],
            // zoom: 0,
            zoom: 1,
            duration: 3000,
            easing: (t) => t * (2 - t)
        });
    });

    // Initial flags to track interaction and visibility states
    let hasInteracted = false;
    let isInitialRotation = true;

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

    //  initial globe rotation, show GT logos, and ensure clusters are hidden
    function startInitialRotation() {
        // isInitialRotation = true;

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
        }
    }

    // event listeners to trigger onFirstInteraction only once
    map.on('mousedown', onFirstInteraction);
    map.on('zoom', onFirstInteraction);
    map.on('drag', onFirstInteraction);

    //initial globe rotation and GT logo display on map load
    map.on('load', startInitialRotation);

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
        if (sidebar.scrollHeight > sidebar.clientHeight && !sidebar.classList.contains('collapsed')) {
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

    document.getElementById('minimize-sidebar').addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        toggleBackToTopButton();

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

    // Function to add geoJSON data sources to the map
    function addGeoJSONSource(map, sourceId, filePath, promoteId) {
        map.addSource(sourceId, {
            type: 'geojson',
            data: filePath,
            promoteId: promoteId
        });
    }

    //Map Load Event and Fog Setting
    map.on('load', () => {
        map.setFog({});

        // Use the addGeoJSONSource function to add each region's data source
        addGeoJSONSource(map, 'us-states', '/data/us-states.geojson', 'id');
        addGeoJSONSource(map, 'uk-regions', '/data/uk-regions.geojson', 'id');
        addGeoJSONSource(map, 'canada-regions', '/data/canada-regions.geojson', 'id');
        addGeoJSONSource(map, 'aruba-region', '/data/aruba-region.geojson', 'id');
        addGeoJSONSource(map, 'italy-regions', '/data/italy-regions.geojson', 'id');

        //Initialize Facilities Data and Set Variables
        let facilitiesData = [];
        const regionsWithFacilities = new Set();
        const statesWithFacilities = new Set();
        let selectedStateId = null;
        const logoUrl = './img/gtLogo.png';

        // imported loadFacilitiesData function
        loadFacilitiesData()
            .then(facilities => {

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

                facilitiesData = facilities;

                console.log("regionsWithFacilities:", Array.from(regionsWithFacilities));

                // region click events for the sidebar
                setRegionClickEvent('canada-regions', 'id', 'name');
                setRegionClickEvent('uk-regions', 'id', 'name');
                setRegionClickEvent('italy-regions', 'id', 'name');
                setRegionClickEvent('aruba-region', 'id', 'name');
                setRegionClickEvent('us-states', 'id', 'name');

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
                // show borders
                function addHoverOutlineLayer(map, layerId, sourceId) {
                    map.addLayer({
                        id: layerId,
                        type: 'line',
                        source: sourceId,
                        paint: {
                            'line-color': '#FFFFFF',
                            'line-width': [
                                'case',
                                ['boolean', ['feature-state', 'hover'], false],
                                2,
                                0.6
                            ]
                        }
                    });
                }

                // Adding hover outline layers for each region using the function
                addHoverOutlineLayer(map, 'us-states-line-hover', 'us-states');
                addHoverOutlineLayer(map, 'canada-regions-line-hover', 'canada-regions');
                addHoverOutlineLayer(map, 'aruba-region-line-hover', 'aruba-region');
                addHoverOutlineLayer(map, 'italy-regions-line-hover', 'italy-regions');
                addHoverOutlineLayer(map, 'uk-regions-line-hover', 'uk-regions');

                // show regions and states
                function addRegionLayer(map, layerId, sourceId, regionsWithFacilities) {
                    const hoverColor = '#05aaff';
                    const selectedColor = '#ff8502';

                    map.addLayer({
                        id: `${layerId}-fill`,
                        type: 'fill',
                        source: sourceId,
                        paint: {
                            'fill-color': [
                                'case',
                                // Apply selected color only if the region is in regionsWithFacilities and selected
                                ['all', ['boolean', ['feature-state', 'selected'], false], ['in', ['get', 'id'], ['literal', Array.from(regionsWithFacilities)]]], selectedColor,

                                // Apply hover color only if the region is in regionsWithFacilities and hovered
                                ['all', ['boolean', ['feature-state', 'hover'], false], ['in', ['get', 'id'], ['literal', Array.from(regionsWithFacilities)]]], hoverColor,

                                // Default color for regions without facilities
                                '#d3d3d3'
                            ],
                            'fill-opacity': 0.5
                        }
                    });
                }

                // Usage for different regions
                addRegionLayer(map, 'us-states', 'us-states', regionsWithFacilities);
                addRegionLayer(map, 'canada-regions', 'canada-regions', regionsWithFacilities);
                addRegionLayer(map, 'aruba-region', 'aruba-region', regionsWithFacilities);
                addRegionLayer(map, 'italy-regions', 'italy-regions', regionsWithFacilities);
                addRegionLayer(map, 'uk-regions', 'uk-regions', regionsWithFacilities);

                addRegionInteractions(map, 'us-states-fill', 'us-states', regionsWithFacilities);
                addRegionInteractions(map, 'canada-regions-fill', 'canada-regions', regionsWithFacilities);
                addRegionInteractions(map, 'aruba-region-fill', 'aruba-region', regionsWithFacilities);
                addRegionInteractions(map, 'italy-regions-fill', 'italy-regions', regionsWithFacilities);
                addRegionInteractions(map, 'uk-regions-fill', 'uk-regions', regionsWithFacilities);


                function addRegionInteractions(map, layerId, sourceId, regionsWithFacilities) {
                    let hoveredRegionId = null;
                    let selectedRegionId = null;

                    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
                    const hoverEvent = isTouchDevice ? 'touchstart' : 'mousemove';

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
                            '#ff8502',  // Small clusters (dark blue)
                            // '#b31919',  // Small clusters (red) 
                            10, ' #0f2844'  // Medium and large clusters (orange)
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

                    const sidebar = document.getElementById('hospital-list-sidebar');
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
<i class="fas fa-hospital-symbol"></i> 
<strong class="clickable-hospital" style="cursor: pointer; color: #add8e6;">
${hospital.hospital_name}
</strong><br>
${hospital.parent_company ? `<strong>Parent Company:</strong> ${hospital.parent_company}<br>` : ""}
${hospital.location}<br>
<strong>EHR System:</strong> ${ehrLogo} ${hospital.ehr_system !== "Epic" ? hospital.ehr_system : ""}<br>
<strong>Hospital Count:</strong> ${hospital.hospital_count}<br>
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

         // Adjust sidebar height based on content size
        function adjustSidebarHeight() {
            const sidebar = document.getElementById('hospital-list-sidebar');
            const list = document.getElementById('hospital-list');
        
            // Check if content height is less than max viewport height (80vh)
            if (list.scrollHeight < window.innerHeight * 0.8) {
                sidebar.classList.add('auto-height'); 
            } else {
                sidebar.classList.remove('auto-height');
            }
        }
        
        //populateSidebar function.
        function populateSidebar(regionId, regionName, facilities) {
            console.log(`Populating sidebar for region: ${regionName} (ID: ${regionId})`);

            const sidebar = document.getElementById('hospital-list-sidebar');
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

            console.log(`Found ${regionHospitals.length} hospitals in ${regionName} with a total of ${totalHospitalCount} facilities.`);

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
                    <strong>EHR System:</strong> ${ehrLogo} ${hospital.ehr_system || ""}
                    <strong>Hospital Count:</strong> ${hospital.hospital_count || 1}<br>
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
//                     Fly-To Functionality on Facility Click
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

        //Sets up a click event for a specified region layer.
        //On click, fetches and displays facility data in the sidebar for the clicked region.
        //@param {string} regionSource - The source layer ID for the map region.
        //@param {string} regionIdProp - The property name in geoJSON data that represents the region ID.
        //@param {string} regionNameProp - The property name in geoJSON data that represents the region name.

        function setRegionClickEvent(regionSource, regionIdProp, regionNameProp) {
            map.on('click', `${regionSource}-fill`, (e) => {
                // Capture the clicked region's ID and name properties from the geoJSON data
                const clickedRegionId = e.features[0].properties[regionIdProp];
                const regionName = e.features[0].properties[regionNameProp];
                console.log(`Region clicked: ${regionName} (ID: ${clickedRegionId})`);

                // Call loadFacilitiesData and handle the response
                loadFacilitiesData()
                    .then(facilities => {
                        // Pass the region data to populateSidebar
                        populateSidebar(clickedRegionId, regionName, facilities);
                    })
                    .catch(displayErrorMessage);
            });
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

        let hoveredPolygonId = null;
        map.on('mousemove', 'us-states-fill', (e) => {
            if (e.features.length > 0) {
                if (hoveredPolygonId !== null) {
                    map.setFeatureState({ source: 'us-states', id: hoveredPolygonId }, { hover: false });
                }
                hoveredPolygonId = e.features[0].id;
                map.setFeatureState({ source: 'us-states', id: hoveredPolygonId }, { hover: true });
            }
        });

        map.on('mouseleave', 'us-states-fill', () => {
            if (hoveredPolygonId !== null) {
                map.setFeatureState({ source: 'us-states', id: hoveredPolygonId }, { hover: false });
            }
            hoveredPolygonId = null;
        });

        // Define the closeSidebar function
        function closeSidebar() {
            sidebar.style.display = 'none';
            if (selectedStateId !== null) {
                map.setFeatureState({ source: 'us-states', id: selectedStateId }, { selected: false });
            }
            selectedStateId = null;
        }
        document.getElementById('close-sidebar').addEventListener('click', closeSidebar);


        // Fly-to buttons for navigating regions
        document.getElementById("fit-to-usa").addEventListener("click", () => {
            map.fitBounds([
                [-165.031128, 65.476793],
                [-81.131287, 26.876143]
            ]);
        });

        // Reset view button on the right side
        document.getElementById("reset-view").addEventListener("click", () => {
            map.flyTo({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM, pitch: 0 });
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

    });

});