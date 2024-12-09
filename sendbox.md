
//GT colors

            background-color:#ff8502;
            background-color:#0f2844;
            background-color:#ffa849;
//netflix colors

 background-color: #4CAF50; 
 //background hower

 background-color: #45a049;
 background: linear-gradient(145deg, #ff5656, #d32626);


This HTML and JavaScript code is a highly detailed implementation for an interactive map application using Mapbox GL JS. The primary features and functionality include:

Map Initialization:

Centers on specific coordinates, with custom styling and zoom levels.
Uses Mapbox for map visuals, icons, and the overall map experience.
UI Elements:

Includes a draggable, collapsible sidebar to display hospital information.
Several buttons are positioned on the map for functionality such as "fly to" the UK or USA, "fit" the view to regions, and resetting the map view.
A toggle button to show/hide the geocoder (search field), and an error message display if data fails to load.
Data Fetching and Display:

Fetches hospital location data from a JSON file, displaying it via markers on the map.
Uses popups with details like the hospital name, parent company, EHR system, and address.
Sidebar lists hospitals in selected states, showing counts and additional details.
Map Interactivity:

Clustered markers show hospitals based on zoom level, with the number of hospitals within each cluster displayed.
Hover and click effects are used on the states and markers.
Clicking on the map markers displays more detailed information in popups.
Sidebar Dragging and Positioning:

Sidebar can be dragged, resized based on viewport size, and dynamically repositions itself to stay within the screen limits.
Responsive Design:

CSS media queries adjust styles for various screen sizes, enhancing mobile usability.
Sidebar and button sizes adjust for smaller screens.
This layout allows for a visually engaging and interactive experience, particularly useful for showcasing locations using Goliath’s solutions. The code is extensive but could be modularized into smaller components (if applied in frameworks like React) to increase readability and maintainability.


England: This includes approximate boundary coordinates to cover the area within the geographic limits of England.
Scotland: Includes approximate coordinates to capture the shape of Scotland.
Wales: Contains coordinates for Wales’s outline.
Northern Ireland: Uses coordinates that outline Northern Ireland.


Ontario: Provided as you initially defined it.
Quebec: Covers the eastern part of Canada.
Alberta: Includes approximate boundaries for Alberta, from the southern border with the USA up to the northern border.
British Columbia: Extends from the Pacific Ocean to Alberta’s border.
Manitoba: Spans from the eastern edge of Ontario to the western edge shared with Saskatchewan.


//nov7


import { MAPBOX_TOKEN } from './config.js';

mapboxgl.accessToken = MAPBOX_TOKEN;

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

    const geocoderToggle = document.getElementById("toggle-geocoder");
    const geocoderContainer = document.getElementById("geocoder-container");
    let geocoder;

    geocoderToggle.addEventListener("click", (e) => {
        e.stopPropagation();

        // Toggle geocoder visibility
        if (geocoderContainer.style.display === "none") {
            geocoderContainer.style.display = "block";
            geocoderToggle.style.display = "none";

            if (!geocoder) {
                geocoder = new MapboxGeocoder({
                    accessToken: mapboxgl.accessToken,
                    mapboxgl: mapboxgl,
                });
                geocoderContainer.appendChild(geocoder.onAdd(map));
            }
        } else {
            geocoderContainer.style.display = "none";
            geocoderToggle.style.display = "flex";
        }
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

        // Add data sources for UK, Canada, and Aruba regions

        // Add the UK regions data source
        map.addSource('uk-regions', {
            type: 'geojson',
            data: '/data/uk-regions.geojson',
            promoteId: 'id'
        });

        // Add the Canada regions data source
        map.addSource('canada-regions', {
            type: 'geojson',
            data: '/data/canada-regions.geojson',
            promoteId: 'id'
        });

        // Add the Aruba region data source
        map.addSource('aruba-region', {
            type: 'geojson',
            data: '/data/aruba-region.geojson',
            promoteId: 'id'
        });

        // Function to add a region layer with both fill and line layers
        function addRegionLayer(sourceName) {
            // Fill layer for region
            // map.addLayer({
            //     id: `${sourceName}-fill`,
            //     type: 'fill',
            //     source: sourceName,
            //     paint: {
            //         'fill-color': [
            //             'case',
            //             ['boolean', ['feature-state', 'hover'], false], '#05aaff', // Hover color
            //             ['boolean', ['feature-state', 'selected'], false], '#05aaff', // Selected color
            //             '#d3d3d3'  // Default color
            //         ],
            //         'fill-opacity': 0.5
            //     }
            // });

            map.addLayer({
                id: `${sourceName}-fill`,
                type: 'fill',
                source: sourceName,
                paint: {
                    'fill-color': [
                        'match',
                        ['get', 'region'],
                        'USA', '#ff0000',
                        'UK', '#0000ff',
                        'Canada', '#00ff00',
                        'Aruba', '#ffff00',
                        '#d3d3d3' // Default color
                    ],
                    'fill-opacity': 0.4
                }
            });


            // Line layer for region border
            map.addLayer({
                id: `${sourceName}-line-hover`,
                type: 'line',
                source: sourceName,
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

        // Add region layers for each data source
        addRegionLayer('uk-regions');
        addRegionLayer('canada-regions');
        addRegionLayer('aruba-region');

        // Ensure each region layer is set up with this function, e.g.:
        setRegionClickEvent('canada-regions', 'id', 'name');
        setRegionClickEvent('uk-regions', 'id', 'name');
        setRegionClickEvent('aruba-region', 'id', 'name');

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

            // const regionHospitals = facilities.filter(hospital => {
            //     const { location } = hospital;

            //     // Check for specific Canadian region or Nunavut
            //     return (
            //         (location.includes(regionName) || location.includes(regionId))
            //     );
            // });

            const regionHospitals = facilities.filter(hospital => hospital.location.includes(regionName) || hospital.region_id === regionId);

            console.log("Region Hospitals:", regionHospitals);

            console.log(`Found ${regionHospitals.length} hospitals in ${regionName}.`);

            // Display facility count
            const countDisplay = document.createElement('p');
            countDisplay.classList.add('count-display');
            countDisplay.innerHTML = `Total Facilities: <span style="color: #ff8502;">${regionHospitals.length}</span>`;
            countDisplay.style.fontWeight = 'bold';
            countDisplay.style.color = '#FFFFFF';
            countDisplay.style.marginTop = '10px';
            list.before(countDisplay);

            // Populate sidebar list with hospitals
            regionHospitals.forEach(hospital => {
                const listItem = document.createElement('li');

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
            <strong>EHR System:</strong> ${ehrLogo} ${hospital.ehr_system !== "Epic" ? hospital.ehr_system : ""}
        `;

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

            // Display the sidebar only if there is data
            sidebar.style.display = regionHospitals.length > 0 ? 'block' : 'none';
        }

        // Function to add region click events for non-USA regions
        function setRegionClickEvent(regionSource, regionIdProp, regionNameProp) {
            map.on('click', `${regionSource}-fill`, (e) => {
                const clickedRegionId = e.features[0].properties[regionIdProp];
                const regionName = e.features[0].properties[regionNameProp];
                console.log(`Region clicked: ${regionName} (ID: ${clickedRegionId})`);

                // Fetch facilities data and populate sidebar
                fetch('./data/facilities.json')
                    .then(response => response.json())
                    .then(facilities => populateSidebar(clickedRegionId, regionName, facilities))
                    .catch(error => console.error('Error loading facilities data:', error));
            });
        }

        // Hover outline on target states
        map.addLayer({
            id: 'us-states-line-hover',
            type: 'line',
            source: 'us-states',
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

        let hoveredStateId = null;
        let selectedStateId = null;

        // Hover effect
        map.on('mousemove', 'us-states-fill', (e) => {
            if (hoveredStateId !== null && hoveredStateId !== selectedStateId) {
                map.setFeatureState({ source: 'us-states', id: hoveredStateId }, { hover: false });
            }
            hoveredStateId = e.features[0].id;

            // Only set hover if it’s not the selected state
            if (hoveredStateId !== selectedStateId) {
                map.setFeatureState({ source: 'us-states', id: hoveredStateId }, { hover: true });
            }
        });

        map.on('mouseleave', 'us-states-fill', () => {
            // Reset hover only if the state isn’t selected
            if (hoveredStateId !== null && hoveredStateId !== selectedStateId) {
                map.setFeatureState({ source: 'us-states', id: hoveredStateId }, { hover: false });
            }
            hoveredStateId = null;
        });

        // Click effect
        map.on('click', 'us-states-fill', (e) => {
            // To remove selected color from previous state if it exists
            if (selectedStateId !== null) {
                map.setFeatureState({ source: 'us-states', id: selectedStateId }, { selected: false });
            }

            selectedStateId = e.features[0].id;
            map.setFeatureState({ source: 'us-states', id: selectedStateId }, { selected: true });
        });

        const logoUrl = './img/gtLogo.png';
        let statesWithFacilities = new Set();

        fetch('./data/facilities.json')
            .then(response => response.json())
            .then(facilities => {
                // Generating a unique list of states with facilities
                facilities.forEach(facility => {

                    const stateOrRegion = facility.location.split(', ')[1];
                    statesWithFacilities.add(stateOrRegion);
                });

                // Add markers for each facility

                let markers = facilities.map(({ ehr_system, hospital_name, location, hospital_address, longitude, latitude, parent_company }) => {
                    let popupContent = `
        <strong>${hospital_name}</strong><br>
        <strong style="color: #05aaff">${location}</strong><br>
        ${parent_company ? `Parent Company: ${parent_company}<br>` : ""}
        EHR System: <strong style="color: #0f2844">${ehr_system}</strong><br>
        Address: ${hospital_address}
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

                    // Apply specific hover behavior based on the hospital name
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


                map.addLayer({
                    id: 'us-states-fill',
                    type: 'fill',
                    source: 'us-states',
                    paint: {
                        'fill-color': [
                            'case',
                            // Check if the state is hovered and in the statesWithFacilities set
                            [
                                'all',
                                ['boolean', ['feature-state', 'hover'], false],
                                ['in', ['get', 'id'], ['literal', Array.from(statesWithFacilities)]]
                            ],
                            '#05aaff', // Hover color for states with facilities
                
                            // Selected color if a state with facilities is clicked
                            ['boolean', ['feature-state', 'selected'], false], '#05aaff',
                
                            '#d3d3d3' // Default color for states without facilities
                        ],
                        'fill-opacity': 0.5
                    }
                });
                

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

                    // Display facility count
                    const countDisplay = document.createElement('p');
                    countDisplay.classList.add('count-display');
                    countDisplay.innerHTML = `Total Facilities: <span style="color: #ff8502;">${stateHospitals.length}</span>`;
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
    <strong>EHR System:</strong> ${ehrLogo} ${hospital.ehr_system !== "Epic" ? hospital.ehr_system : ""}
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
        document.getElementById("fly-to-uk").addEventListener("click", () => {
            map.flyTo({ center: [360.242386, 51.633362], zoom: 4, pitch: 45 });
        });
        document.getElementById("fly-to-canada").addEventListener("click", () => {
            map.flyTo({
                center: [-106.3468, 56.1304],
                zoom: 4,
                pitch: 30
            });

            // document.getElementById("fit-to-canada").addEventListener("click", () => {
            //     map.fitBounds([
            //         [-140.99778, 41.675105],
            //         [-52.648099, 83.23324]
            //     ]);
            // });

        });
        document.getElementById("fly-to-usa").addEventListener("click", () => {
            map.flyTo({ center: [-101.714859, 39.710884], zoom: 4, pitch: 45 });
        });

        document.getElementById("fit-to-usa").addEventListener("click", () => {
            map.fitBounds([
                [-165.031128, 65.476793],
                [-81.131287, 26.876143]
            ]);
        });

        document.getElementById("fly-to-aruba").addEventListener("click", () => {
            map.flyTo({ center: [-70.027, 12.5246], zoom: 5, pitch: 45 });
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

        // const toggleThemeButton = document.getElementById("toggle-theme");

        // toggleThemeButton.addEventListener("click", () => {

        //     sidebar.classList.toggle("dark-text");
        // });

        // Function to toggle sidebar based on screen size and hover state

        function toggleSidebarOnHover(show) {
            if (window.innerWidth <= 480) {
                sidebar.style.display = show ? 'block' : 'none';
            }
        }

        // Add event listeners for hover on the sidebar
        sidebar.addEventListener('mouseenter', () => toggleSidebarOnHover(true));
        sidebar.addEventListener('mouseleave', () => toggleSidebarOnHover(false));

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


The main colors of the United States flag, along with their hex codes, are:

Old Glory Blue: #3C3B6E (the blue background behind the stars)
White: #FFFFFF (the stars and alternating white stripes)
Old Glory Red: #B22234 (the red stripes)
These colors symbolize vigilance and perseverance (blue), purity and innocence (white), and valor and bravery (red).

The main colors of Aruba's flag, along with their hex codes, are:

Light Blue: #0092D1 (representing the sky and the sea around Aruba)
Yellow: #FDB913 (representing Aruba's abundance of sunshine)
White: #FFFFFF (the white outlines, symbolizing peace and honesty)
Red: #EF3340 (the star, symbolizing Aruba's unique position and the red soil)
The flag prominently features a red star with a white outline on a light blue background with two narrow yellow horizontal stripes.

The main colors of Canada’s national flag, along with their hex codes, are:

Red: #FF0000
White: #FFFFFF
The red symbolizes strength and bravery, and the white represents peace and honesty, featuring the distinctive red maple leaf in the center.

The main colors of the United Kingdom's Union Jack flag, along with their hex codes, are:

Dark Blue: #00247D
Red: #CF142B
White: #FFFFFF
These colors represent the combined flags of England, Scotland, and Ireland, which together form the iconic Union Jack.

The hex codes for Italy's national colors are:

Green: #008C45
White: #FFFFFF
Red: #CD212A, #f50101
These colors together form the Italian tricolor flag and are widely recognized as symbols of the nation.

Italy’s main colors, prominently seen in its national flag, are:

Green – Symbolizing hope and the country's lush landscapes.
White – Representing peace and the snowy Alps.
Red – Signifying courage and the bloodshed for Italy's independence and unification.
These colors are widely used in Italian cultural, sports, and government symbols, with green, white, and red also known as the Tricolore.


//below has A11 but need refactoring.

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Goliath Technologies Map</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <link rel="icon" href="./img/gtLogo.png" type="image/png">
    <link href="https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
    <script src="https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.js"></script>
    <script
        src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.3/mapbox-gl-geocoder.min.js"></script>
    <link rel="stylesheet"
        href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.3/mapbox-gl-geocoder.css"
        type="text/css">
</head>

<body>

    <div id="error-message" style="display: none; color: red; text-align: center; margin-top: 10px;"></div>

    <div id="hospital-list-sidebar" style="display: none;" role="complementary" aria-label="Hospital Locations Sidebar">
        <div class="sidebar-header">
            <a href="https://goliathtechnologies.com/" target="_blank" id="home-logo" aria-label="Goliath Technologies Homepage">
                <img src="./img/gtLogo.png" alt="Goliath Technologies Logo">
            </a>            
            <div class="button-group">
                <button id="minimize-sidebar" aria-label="Minimize Sidebar" class="round-button">
                    <i class="fas fa-chevron-up" aria-hidden="true"></i>
                </button>
                <button id="close-sidebar" aria-label="Close Sidebar" class="round-button">
                    <i class="fas fa-times" aria-hidden="true"></i>
                </button>
            </div>
        </div>
        <h2>Current Locations Using Goliath's Solutions</h2>
        <ul id="hospital-list"></ul>
    </div>
    
    <div id="map" role="application" aria-label="Interactive Map Displaying Locations"></div>
    

    <div class="mapbox-button-group">
        <!-- <button id="fly-to-usa" class="fly-to-button fly-to-usa"></button> -->
        <div class="flip-button" id="fly-to-usa" role="button" aria-label="Fly to USA">
            <span class="flip-front"></span>
            <span class="flip-back">USA</span>
        </div>

        <!-- <button id="fly-to-uk" class="fly-to-button fly-to-uk"></button> -->
        <div class="flip-button" id="fly-to-uk" role="button" aria-label="Fly to UK">
            <span class="flip-front"></span>
            <span class="flip-back">UK</span>
        </div>

        <!-- <button id="fly-to-italy" class="fly-to-button fly-to-italy"></button> -->
        <div class="flip-button" id="fly-to-italy" role="button" aria-label="Fly to Italy">
            <span class="flip-front"></span>
            <span class="flip-back">ITLY</span>
        </div>

        <!-- <button id="fly-to-canada" class="fly-to-button fly-to-canada"></button> -->
        <div class="flip-button" id="fly-to-canada" role="button" aria-label="Fly to Canada">
            <span class="flip-front"></span>
            <span class="flip-back">CAN</span>
        </div>

        <!-- <button id="fly-to-aruba" class="fly-to-button fly-to-aruba"></button> -->
        <div class="flip-button" id="fly-to-aruba" role="button" aria-label="Fly to Aruba">
            <span class="flip-front"></span>
            <span class="flip-back">ARB</span>
        </div>

        <button id="fit-to-usa" class="fit-to-button fit-to-usa" aria-label="Fit to USA View"></button>

<button id="reset-view" aria-label="Reset Map View">
    <i class="fas fa-sync-alt" aria-hidden="true"></i>
</button>

<button id="toggle-geocoder" aria-label="Search Location">
    <i class="fas fa-search" aria-hidden="true"></i>
</button>

    </div>

    <!-- Map container -->
    //<div id="map"></div>


    <a href="https://goliathtechnologies.com/" target="_blank" id="home-logo">
        <img src="./img/goliath-logo.png" alt="Goliath Technologies Logo">
    </a>

    <!-- <script type="module" src="refactor.js"></script> -->
    <script type="module" src="scripts.js"></script>
</body>

</html>

//golden function.
//The sidebar is closed.
//Another region is clicked, showing a different list in the sidebar.
//A click occurs outside any selectable region.

  function addRegionInteractions(map, layerId, sourceId, regionsWithFacilities, hoverColor = '#05aaff', selectedColor = '#005bbb') {
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
                
                    // Hover behavior for touch and non-touch devices
                    map.on(hoverEvent, layerId, (e) => {
                        const regionId = e.features[0].id;
                        if (regionsWithFacilities.has(regionId)) {
                            applyHover(regionId);
                        }
                    });
                
                    if (!isTouchDevice) {
                        map.on('mouseleave', layerId, clearHover);
                    } else {
                        map.on('touchend', layerId, clearHover);
                        map.on('touchcancel', layerId, clearHover);
                    }
                
                    // Click event to select region and update sidebar, clearing any previous selection
                    map.on('click', layerId, (e) => {
                        const regionId = e.features[0].id;
                
                        // Only proceed if the region has facilities
                        if (regionsWithFacilities.has(regionId)) {
                            clearRegionSelection(); // Clear any existing selection before applying the new one
                
                            // Set the new selected region
                            selectedRegionId = regionId;
                            map.setFeatureState({ source: sourceId, id: selectedRegionId }, { selected: true });
                
                            // Update the sidebar content for the new region
                            updateSidebarForRegion(regionId);
                        }
                    });
                
                    // Clear selection when clicking outside any region
                    map.on('click', (e) => {
                        const features = map.queryRenderedFeatures(e.point, { layers: [layerId] });
                        if (features.length === 0) {
                            clearRegionSelection();
                        }
                    });
                
                    // Clear selection and hover when the sidebar is closed
                    function clearRegionSelection() {
                        clearHover(); // Clear any hover effect
                        if (selectedRegionId !== null) {
                            map.setFeatureState({ source: sourceId, id: selectedRegionId }, { selected: false });
                            selectedRegionId = null;
                        }
                    }
                
                    // Attach the clear function to the sidebar close event
                    document.getElementById('close-sidebar').addEventListener('click', clearRegionSelection);
                
                    // Placeholder function to update sidebar content based on region selection
                    function updateSidebarForRegion(regionId) {
                        // Implement logic to show content for the selected region in the sidebar
                    }
                }
                
                         // function addRegionLayer(map, regionId, regionSource) {
                //     map.addLayer({
                //         id: `${regionId}-fill`,
                //         type: 'fill',
                //         source: regionSource,
                //         paint: {
                //             'fill-color': [
                //                 'case',
                //                 // Check if the region is hovered and in the regionsWithFacilities set
                //                 [
                //                     'all',
                //                     ['boolean', ['feature-state', 'hover'], false],
                //                     ['in', ['get', 'id'], ['literal', Array.from(regionsWithFacilities)]]
                //                 ],
                //                 '#05aaff', // Hover color for regions with facilities

                //                 // Selected color if a region with facilities is clicked
                //                 ['boolean', ['feature-state', 'selected'], false], '#05aaff',

                //                 '#d3d3d3' // Default color for regions without facilities
                //             ],
                //             'fill-opacity': 0.5
                //         }
                //     });
                // }       




                november 13

                // Track if the user has interacted with the map
let hasInteracted = false;
let isInitialRotation = true;  // New flag to manage initial rotation

// Define GT logo markers for specified countries
const countries = [
    { name: 'USA', lngLat: [-75.4265, 40.0428] },
    { name: 'UK', lngLat: [-0.1276, 51.5074] },
    { name: 'Aruba', lngLat: [-69.9683, 12.5211] },
    { name: 'Canada', lngLat: [-106.3468, 56.1304] },
    { name: 'Italy', lngLat: [12.5674, 41.8719] },
];

// Initialize GT logo markers, making them initially visible
const gtLogoMarkers = countries.map(country => {
    const logoElement = document.createElement('div');
    logoElement.className = 'company-logo';
    logoElement.style.backgroundImage = 'url(./img/gtLogo.png)';
    const marker = new mapboxgl.Marker(logoElement, {
        rotationAlignment: 'map',
        offset: [0, -10],
    }).setLngLat(country.lngLat).addTo(map);

    // Show GT logos initially on page load
    marker.getElement().style.visibility = 'visible';
    return marker;
});

// Utility function to safely set layer visibility if the layer exists
function setLayerVisibility(layerId, visibility) {
    if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', visibility);
    }
}

// Hide clusters during initial load
map.on('load', () => {
    setLayerVisibility('clusters', 'none');
    setLayerVisibility('cluster-count', 'none');
    setLayerVisibility('unclustered-point', 'none');
});

// Function to hide GT logos and make clusters visible after user interaction
function onFirstInteraction() {
    if (!hasInteracted) {
        hasInteracted = true;
        isInitialRotation = false;  // End initial rotation state
        
        // Hide GT logos after the first interaction
        gtLogoMarkers.forEach(marker => {
            const element = marker.getElement();
            element.style.visibility = 'hidden';
        });

        // Show clusters and allow them to follow existing functionality
        setLayerVisibility('clusters', 'visible');
        setLayerVisibility('cluster-count', 'visible');
        setLayerVisibility('unclustered-point', 'visible');
    }
}

// Initial rotation: Hide clusters while rotating, show GT logos
map.on('move', () => {
    if (isInitialRotation && !hasInteracted) {
        // Hide clusters during initial rotation
        setLayerVisibility('clusters', 'none');
        setLayerVisibility('cluster-count', 'none');
        setLayerVisibility('unclustered-point', 'none');

        // Ensure GT logos are visible
        gtLogoMarkers.forEach(marker => {
            const element = marker.getElement();
            element.style.visibility = 'visible';
        });
    }
});

map.on('moveend', () => {
    if (isInitialRotation && !hasInteracted) {
        // Re-hide clusters after initial rotation
        setLayerVisibility('clusters', 'none');
        setLayerVisibility('cluster-count', 'none');
        setLayerVisibility('unclustered-point', 'none');
    }
});

// Attach interaction event listeners to trigger onFirstInteraction only once
map.on('mousedown', onFirstInteraction);
map.on('zoom', onFirstInteraction);
map.on('drag', onFirstInteraction);



//Goliath colors
// #ff8b1f: A vibrant orange; suitable for the outer circle or stroke.
// #0f2844: A dark blue; ideal for the inner circle or border.
// #ff0000: Bright red; can be used for the pulsing effect or an accent.
// #ffffff: White; perfect for a border or subtle inner detail.

            // context.fillStyle = `rgba(255, 0, 0, ${1 - t})`; // Outer circle (red)
            //context.fillStyle = 'rgba(0, 255, 0, 1)'; // Inner circle (green)
            //context.strokeStyle = 'rgba(0, 0, 255, 1)'; // Stroke (blue)




                    // show borders
                    // function addHoverOutlineLayer(map, layerId, sourceId) {
                    //     if (map.getLayer(layerId)) {
                    //         console.warn(`Layer with id "${layerId}" already exists. Skipping addition.`);
                    //         return;
                    //     }
                    //     map.addLayer({
                    //         id: layerId,
                    //         type: 'line',
                    //         source: sourceId,
                    //         paint: {
                    //             'line-color': '#FFFFFF',
                    //             'line-width': [
                    //                 'case',
                    //                 ['boolean', ['feature-state', 'hover'], false],
                    //                 2,
                    //                 0.6
                    //             ]
                    //         }
                    //     });
                    // }

                    // function addGlowEffect(map, layerId, sourceId) {
                    //     if (map.getLayer(layerId)) {
                    //         console.warn(`Layer with id "${layerId}" already exists. Skipping addition.`);
                    //         return;
                    //     }

                    //     map.addLayer({
                    //         id: `${layerId}-glow`,
                    //         type: 'line',
                    //         source: sourceId,
                    //         paint: {
                    //             'line-color': 'rgba(255, 255, 255, 0.3)', // White glow with low opacity
                    //             'line-width': 8, // Slightly larger to act as an outer glow
                    //             'line-blur': 2 // Blur to create a glow effect
                    //         }
                    //     });
                    // }

                    // Uses a light blue color
                    // function addHoverOutlineLayer(map, layerId, sourceId) {
                    //     map.addLayer({
                    //         id: layerId,
                    //         type: 'line',
                    //         source: sourceId,
                    //         paint: {
                    //             // Set a soft, slightly translucent color for a pleasant effect
                    //             'line-color': [
                    //                 'case',
                    //                 ['boolean', ['feature-state', 'hover'], false],
                    //                 '#FFFFFF', // White for hovered state
                    //                 'rgba(173, 216, 230, 0.6)' // Light blue for default (non-hovered) state
                    //             ],
                    //             // Increase default width slightly for better visibility
                    //             'line-width': [
                    //                 'case',
                    //                 ['boolean', ['feature-state', 'hover'], false],
                    //                 2,  // Width on hover
                    //                 1.2 // Default width for non-hovered state
                    //             ],
                    //             // Optional: Add blur effect to make borders softer
                    //             'line-blur': 0.5
                    //         }
                    //     });
                    // }

