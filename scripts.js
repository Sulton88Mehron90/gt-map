
import { MAPBOX_TOKEN } from './config.js';
import { loadFacilitiesData } from './dataLoader.js';

mapboxgl.accessToken = MAPBOX_TOKEN;

// Define hover effect functions once
function addHoverEffect(marker) {
    marker.classList.add('hover-effect');
}
function removeHoverEffect(marker) {
    marker.classList.remove('hover-effect');
}

// Initialize the map after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("hospital-list-sidebar");
    const INITIAL_CENTER = [-119.0187, 35.3733];
    const INITIAL_ZOOM = 1;

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v11',
        // style: 'mapbox://styles/mapbox/streets-v12',
        projection: 'globe',
        zoom: INITIAL_ZOOM,
        center: INITIAL_CENTER,
    });

    map.easeTo({
        center: [-119.0187, 35.3733],
        zoom: 4,
        duration: 3000,
        easing: (t) => t * (2 - t)
    });

    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    const geocoderToggle = document.getElementById("toggle-geocoder");
    const geocoderContainer = document.getElementById("geocoder-container");
    let geocoder;

    // Define debounced toggle function
    const debouncedGeocoderToggle = debounce(() => {
        geocoderContainer.style.display = geocoderContainer.style.display === "none" ? "block" : "none";
        geocoderToggle.style.display = geocoderContainer.style.display === "none" ? "flex" : "none";

        // Initializing geocoder only when container is displayed
        if (!geocoder && geocoderContainer.style.display === "block") {
            geocoder = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl,
            });
            geocoderContainer.appendChild(geocoder.onAdd(map));
        }
    }, 300);

    // debounced event listener
    geocoderToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        debouncedGeocoderToggle();
    });

    // Hide geocoder and show toggle button when clicking outside
    document.addEventListener("click", (event) => {
        if (!geocoderContainer.contains(event.target) && event.target !== geocoderToggle) {
            geocoderContainer.style.display = "none";
            geocoderToggle.style.display = "flex";
        }
    });

    // Event listeners to handle resize and ensure map fits container
    window.addEventListener("load", () => map.resize());
    map.on("load", () => setTimeout(() => map.resize(), 100));
    window.addEventListener("resize", () => map.resize());

    map.on('load', () => {
        map.setFog({});

        map.addSource('us-states', {
            type: 'geojson',
            data: '/data/us-states.geojson',
            promoteId: 'id'
        });
        map.addSource('uk-regions', {
            type: 'geojson',
            data: '/data/uk-regions.geojson',
            promoteId: 'id'
        });
        map.addSource('italy-regions', {
            type: 'geojson',
            data: '/data/italy-regions.geojson',
            promoteId: 'id'
        });
        map.addSource('canada-regions', {
            type: 'geojson',
            data: '/data/canada-regions.geojson',
            promoteId: 'id'
        });

        map.addSource('aruba-region', {
            type: 'geojson',
            data: '/data/aruba-region.geojson',
            promoteId: 'id'
        });

        let facilitiesData = [];
        let cachedFacilitiesData = null;
        const regionsWithFacilities = new Set();
        const statesWithFacilities = new Set();

        async function loadFacilitiesData() {
            if (cachedFacilitiesData) {
                return cachedFacilitiesData;
            }
            try {
                const response = await fetch('/data/facilities.json');
                const data = await response.json();
                cachedFacilitiesData = data; // Cache the data after loading it once
                return cachedFacilitiesData;
            } catch (error) {
                console.error('Error loading facilities data:', error);
                throw error;
            }
        }

        let hoveredStateId = null;
        let selectedStateId = null;
        const logoUrl = './img/gtLogo.png';

        loadFacilitiesData()
            .then(facilities => {

                // Populate regionsWithFacilities and statesWithFacilities sets
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

                console.log("regionsWithFacilities:", Array.from(regionsWithFacilities));


                facilitiesData = facilities;

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

                console.log("regionsWithFacilities:", Array.from(regionsWithFacilities));

                // Add interactions for each region
                addRegionInteractions(map, 'us-states-fill', 'us-states', regionsWithFacilities);
                addRegionInteractions(map, 'canada-regions-fill', 'canada-regions', regionsWithFacilities);
                addRegionInteractions(map, 'aruba-region-fill', 'aruba-region', regionsWithFacilities);
                addRegionInteractions(map, 'italy-regions-fill', 'italy-regions', regionsWithFacilities);
                addRegionInteractions(map, 'uk-regions-fill', 'uk-regions', regionsWithFacilities);

                // Set region click events for the sidebar
                setRegionClickEvent('canada-regions', 'id', 'name');
                setRegionClickEvent('uk-regions', 'id', 'name');
                setRegionClickEvent('italy-regions', 'id', 'name');
                setRegionClickEvent('aruba-region', 'id', 'name');

                // Add markers for each facility
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

                function addRegionInteractions(map, layerId, sourceId, regionsWithFacilities, hoverColor = '#05aaff', selectedColor = '#005bbb') {
                    let hoveredRegionId = null;
                    let selectedRegionId = null;

                    // Check if the device supports touch
                    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

                    // Define hover effect for touch and non-touch devices
                    const hoverEvent = isTouchDevice ? 'touchstart' : 'mousemove';
                    const endHoverEvent = isTouchDevice ? 'touchend' : 'mouseleave';

                    // Apply hover effect
                    const applyHover = (regionId) => {
                        if (hoveredRegionId !== null && hoveredRegionId !== selectedRegionId) {
                            map.setFeatureState({ source: sourceId, id: hoveredRegionId }, { hover: false });
                        }
                        hoveredRegionId = regionId;
                        if (hoveredRegionId !== selectedRegionId) {
                            map.setFeatureState({ source: sourceId, id: hoveredRegionId }, { hover: true });
                        }
                    };

                    // Clear hover effect
                    const clearHover = () => {
                        if (hoveredRegionId !== null && hoveredRegionId !== selectedRegionId) {
                            map.setFeatureState({ source: sourceId, id: hoveredRegionId }, { hover: false });
                        }
                        hoveredRegionId = null;
                    };

                    // Add hover event
                    map.on(hoverEvent, layerId, (e) => {
                        const regionId = e.features[0].id;

                        // Only apply hover to regions with facilities
                        if (regionsWithFacilities.has(regionId)) {
                            applyHover(regionId);
                        }
                    });

                    // Clear hover for non-touch devices on mouse leave
                    if (!isTouchDevice) {
                        map.on('mouseleave', layerId, clearHover);
                    }

                    // For touch devices, also clear hover on `touchend` and `touchcancel`
                    if (isTouchDevice) {
                        map.on('touchend', layerId, clearHover);
                        map.on('touchcancel', layerId, clearHover);
                    }

                    // Click effect
                    map.on('click', layerId, (e) => {
                        const regionId = e.features[0].id;

                        // Only allow selection on regions with facilities
                        if (regionsWithFacilities.has(regionId)) {
                            if (selectedRegionId !== null) {
                                map.setFeatureState({ source: sourceId, id: selectedRegionId }, { selected: false });
                            }
                            selectedRegionId = regionId;
                            map.setFeatureState({ source: sourceId, id: selectedRegionId }, { selected: true });

                            // Remove hover state if it's the selected region
                            if (hoveredRegionId === selectedRegionId) {
                                clearHover();
                            }
                        }
                    });

                    // Clear selection on outside click
                    map.on('click', (e) => {
                        const features = map.queryRenderedFeatures(e.point, { layers: [layerId] });

                        // If no region is clicked, clear the selection
                        if (features.length === 0 && selectedRegionId !== null) {
                            clearRegionSelection();
                        }
                    });

                    // Clear selection and hover when the sidebar closes
                    function clearRegionSelection() {
                        clearHover();
                        if (selectedRegionId !== null) {
                            map.setFeatureState({ source: sourceId, id: selectedRegionId }, { selected: false });
                            selectedRegionId = null;
                        }
                    }

                    // Attach `clearRegionSelection` to sidebar close event
                    document.getElementById('close-sidebar').addEventListener('click', clearRegionSelection);
                }


                function addRegionLayer(map, regionId, regionSource) {
                    map.addLayer({
                        id: `${regionId}-fill`,
                        type: 'fill',
                        source: regionSource,
                        paint: {
                            'fill-color': [
                                'case',
                                // Check if the region is hovered and in the regionsWithFacilities set
                                [
                                    'all',
                                    ['boolean', ['feature-state', 'hover'], false],
                                    ['in', ['get', 'id'], ['literal', Array.from(regionsWithFacilities)]]
                                ],
                                '#05aaff', // Hover color for regions with facilities

                                // Selected color if a region with facilities is clicked
                                ['boolean', ['feature-state', 'selected'], false], '#05aaff',

                                '#d3d3d3' // Default color for regions without facilities
                            ],
                            'fill-opacity': 0.5
                        }
                    });
                }

                // Usage for different regions
                addRegionLayer(map, 'us-states', 'us-states');
                addRegionLayer(map, 'canada-regions', 'canada-regions');
                addRegionLayer(map, 'aruba-region', 'aruba-region');
                addRegionLayer(map, 'italy-regions', 'italy-regions');
                addRegionLayer(map, 'uk-regions', 'uk-regions');
                addRegionInteractions(map, 'us-states-fill', 'us-states', regionsWithFacilities);
                addRegionInteractions(map, 'canada-regions-fill', 'canada-regions', regionsWithFacilities);
                addRegionInteractions(map, 'aruba-region-fill', 'aruba-region', regionsWithFacilities);
                addRegionInteractions(map, 'italy-regions-fill', 'italy-regions', regionsWithFacilities);
                addRegionInteractions(map, 'uk-regions-fill', 'uk-regions', regionsWithFacilities);

                // Toggle marker visibility based on zoom level
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
                                    // ehrLogo = '<img src="./img/epic-logo.png" alt="Epic logo" style="width: 20px; height: 18px; vertical-align: middle; margin-right: 5px;">';
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

                            // Fly to the hospital location on the map when the name is clicked
                            listItem.querySelector('.clickable-hospital').addEventListener('click', () => {
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

        // Define the clearRegionSelection function
        let hoveredRegionId = null;
        let selectedRegionId = null;

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

                // Add fly-to map functionality on click
                listItem.querySelector('.clickable-hospital').addEventListener('click', () => {
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
        }

        function setRegionClickEvent(regionSource, regionIdProp, regionNameProp) {
            map.on('click', `${regionSource}-fill`, (e) => {
                // Capture the clicked region's ID and name properties from the geoJSON data
                const clickedRegionId = e.features[0].properties[regionIdProp];
                const regionName = e.features[0].properties[regionNameProp];
                console.log(`Region clicked: ${regionName} (ID: ${clickedRegionId})`);

                // Use cached data or load facilities data once if not already loaded
                loadFacilitiesData()
                    .then(facilities => {
                        // Pass the region data to populateSidebar
                        populateSidebar(clickedRegionId, regionName, facilities);
                    })
                    .catch(error => {
                        console.error('Error loading facilities data:', error);
                        const errorMessage = document.getElementById('error-message');
                        if (errorMessage) {
                            errorMessage.style.display = 'block';
                            errorMessage.innerText = 'Failed to load facility data. Please try again later.';
                        }
                    });
            });
        };

        map.addControl(new mapboxgl.NavigationControl());
        // map.addControl(new mapboxgl.NavigationControl({ position: 'top-left' }));
        // map.scrollZoom.disable();

        let userInteracting = false;
        function spinGlobe() {
            if (!userInteracting && map.getZoom() < 5) {
                const center = map.getCenter();
                center.lng -= 360 / 240;
                map.easeTo({ center, duration: 1000, easing: (n) => n });
            }
        }

        map.on('mousedown', () => userInteracting = true);
        map.on('dragstart', () => userInteracting = true);
        map.on('moveend', () => spinGlobe());
        spinGlobe();

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
        document.getElementById("fly-to-usa").addEventListener("click", () => {
            map.flyTo({ center: [-101.714859, 39.710884], zoom: 4, pitch: 45 });
        });
        document.getElementById("fly-to-uk").addEventListener("click", () => {
            map.flyTo({ center: [360.242386, 51.633362], zoom: 4, pitch: 45 });
        });
        document.getElementById("fly-to-italy").addEventListener("click", () => {
            map.flyTo({ center: [12.563553,42.798676], zoom: 4, pitch: 45 });
        });
        document.getElementById("fly-to-canada").addEventListener("click", () => {
            map.flyTo({
                center: [-106.3468, 56.1304],
                zoom: 4,
                pitch: 30
            });

            // document.getElementById("fit-to-canad").addEventListener("click", () => {
            //     map.fitBounds([
            //         [-140.99778, 41.675105],
            //         [-52.648099, 83.23324]
            //     ]);
            // });
        document.getElementById("fly-to-aruba").addEventListener("click", () => {
            map.flyTo({ center: [-70.027, 12.5246], zoom: 5, pitch: 45 });
        });
        });
        document.getElementById("fit-to-usa").addEventListener("click", () => {
            map.fitBounds([
                [-165.031128, 65.476793],
                [-81.131287, 26.876143]
            ]);
        });

        // Reset view button on the right side (outside the sidebar)
        document.getElementById("reset-view").addEventListener("click", () => {
            map.flyTo({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM, pitch: 0 });
        });

        // Initialize drag variables
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;
        const dragThreshold = 5;
        const header = sidebar.querySelector(".sidebar-header");

        function startDrag(e) {
            startX = e.touches ? e.touches[0].clientX : e.clientX;
            startY = e.touches ? e.touches[0].clientY : e.clientY;
            const rect = sidebar.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            sidebar.classList.add("dragging");
            isDragging = false;


            document.addEventListener("mousemove", handleDrag);
            document.addEventListener("mouseup", endDrag);
            document.addEventListener("touchmove", handleDrag, { passive: false });
            document.addEventListener("touchend", endDrag);
        }

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

        function endDrag() {
            if (!isDragging) {
                header.click();
            }
            isDragging = false;
            sidebar.classList.remove("dragging");

            document.removeEventListener("mousemove", handleDrag);
            document.removeEventListener("mouseup", endDrag);
            document.removeEventListener("touchmove", handleDrag);
            document.removeEventListener("touchend", endDrag);
        }

        header.addEventListener("mousedown", startDrag);
        header.addEventListener("touchstart", startDrag, { passive: false });


        function toggleSidebarOnHover(show) {
            if (window.innerWidth <= 480) {
                sidebar.style.display = show ? 'block' : 'none';
            }
        }

        // Event listeners for hover on sidebar
        sidebar.addEventListener('mouseenter', () => toggleSidebarOnHover(true));
        sidebar.addEventListener('mouseleave', () => toggleSidebarOnHover(false));

        // Add touch events for mobile devices
        sidebar.addEventListener('touchstart', () => toggleSidebarOnHover(true));
        sidebar.addEventListener('touchend', () => toggleSidebarOnHover(false));


        // Close sidebar when the close button is clicked
        document.getElementById("close-sidebar").addEventListener('click', () => {
            sidebar.style.display = 'none';
        });

    });

    document.getElementById('minimize-sidebar').addEventListener('click', () => {
        const sidebar = document.getElementById('hospital-list-sidebar');
        sidebar.classList.toggle('collapsed');

        // Icon for minimize button based on the sidebar state
        const minimizeIcon = document.getElementById('minimize-sidebar').querySelector('i');
        if (sidebar.classList.contains('collapsed')) {
            minimizeIcon.classList.remove('fa-chevron-up');
            minimizeIcon.classList.add('fa-chevron-down');
        } else {
            minimizeIcon.classList.remove('fa-chevron-down');
            minimizeIcon.classList.add('fa-chevron-up');
        }
    });

});