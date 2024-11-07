// import { MAPBOX_TOKEN } from './config.js';

// mapboxgl.accessToken = MAPBOX_TOKEN;

// // Entry function to initialize the map and its components
// document.addEventListener("DOMContentLoaded", () => {
//     initializeMap();
//     if (map) {
//         // Ensure map is defined before adding listeners
//         map.on("load", onMapLoad);
//         map.on("zoomend", toggleMarkersVisibility);
//         map.on("resize", () => map.resize());
//     } else {
//         console.error("Map is not defined. Event listeners cannot be added.");
//     }
// });


// // Constants
// const INITIAL_CENTER = [-119.0187, 35.3733];
// const INITIAL_ZOOM = 1;
// const logoUrl = './img/gtLogo.png';
// let statesWithFacilities = new Set();
// let map, geocoder, markers = [];

// // Initialize the Map
// function initializeMap() {
//     const sidebar = document.getElementById("hospital-list-sidebar");
//     map = new mapboxgl.Map({
//         container: 'map',
//         style: 'mapbox://styles/mapbox/light-v11',
//         projection: 'globe',
//         zoom: INITIAL_ZOOM,
//         center: INITIAL_CENTER,
//     });

//     map.easeTo({
//         center: INITIAL_CENTER,
//         zoom: 4,
//         duration: 3000,
//         easing: (t) => t * (2 - t)
//     });

//     map.addControl(new mapboxgl.NavigationControl());

//     map.on("load", onMapLoad);
//     map.on("zoomend", toggleMarkersVisibility);
//     map.on("resize", () => map.resize());
    
//     setupGeocoder();
//     setupSidebar(sidebar);
//     fetchFacilitiesData();
// }

// // Handle map load events and add custom layers, fog, etc.
// function onMapLoad() {
//     map.setFog({});
//     setRegionLayers(['us-states', 'uk-regions', 'canada-regions', 'aruba-region']);
// }

// // Setup geocoder toggle and functionality
// function setupGeocoder() {
//     const geocoderToggle = document.getElementById("toggle-geocoder");
//     const geocoderContainer = document.getElementById("geocoder-container");

//     geocoderToggle.addEventListener("click", (e) => {
//         e.stopPropagation();
//         toggleGeocoderVisibility(geocoderContainer, geocoderToggle);
//     });

//     document.addEventListener("click", (event) => {
//         if (!geocoderContainer.contains(event.target) && event.target !== geocoderToggle) {
//             geocoderContainer.style.display = "none";
//             geocoderToggle.style.display = "flex";
//         }
//     });
// }

// function toggleGeocoderVisibility(container, toggleButton) {
//     if (container.style.display === "none") {
//         container.style.display = "block";
//         toggleButton.style.display = "none";
//         if (!geocoder) {
//             geocoder = new MapboxGeocoder({ accessToken: mapboxgl.accessToken, mapboxgl: mapboxgl });
//             container.appendChild(geocoder.onAdd(map));
//         }
//     } else {
//         container.style.display = "none";
//         toggleButton.style.display = "flex";
//     }
// }

// // Fetch facilities data and initialize markers
// function fetchFacilitiesData() {
//     fetch('./data/facilities.json')
//         .then(response => response.json())
//         .then(facilities => {
//             facilities.forEach(({ location }) => {
//                 const stateOrRegion = location.split(', ')[1];
//                 statesWithFacilities.add(stateOrRegion);
//             });
//             addMarkers(facilities);
//             setupClusterSourceAndLayers(facilities);
//         })
//         .catch(error => {
//             console.error('Error loading facilities data:', error);
//             showError('Failed to load facility data. Please try again later.');
//         });
// }


// // Add facility markers with popup functionality
// function addMarkers(facilities) {
//     markers = facilities.map(({ ehr_system, hospital_name, location, hospital_address, longitude, latitude, parent_company }) => {
//         // Create popup content with additional note for CommonSpirit Health Headquarters
//         let popupContent = `
//             <strong>${hospital_name}</strong><br>
//             <strong style="color: #05aaff">${location}</strong><br>
//             ${parent_company ? `Parent Company: ${parent_company}<br>` : ""}
//             EHR System: <strong style="color: #0f2844">${ehr_system}</strong><br>
//             Address: ${hospital_address}
//         `;

//         // If this is the CommonSpirit Health Headquarters, add additional note and link
//         if (hospital_name === "CommonSpirit Health Headquarters") {
//             popupContent += `<br><strong style="color: #ff8502">Note:</strong> CommonSpirit Health operates over 140 hospitals across 21 states. 
//             <a href="https://www.commonspirit.org/" target="_blank" style="color: #06b4fd">Visit Website</a>`;
//         }

//         // Create a popup with the content
//         const popup = new mapboxgl.Popup({ offset: 15, closeButton: false }).setHTML(popupContent);

//         // Create a custom marker element
//         const markerElement = document.createElement('div');
//         markerElement.className = 'custom-marker';
//         markerElement.style.backgroundImage = `url(${logoUrl})`;
//         markerElement.style.width = '20px';
//         markerElement.style.height = '20px';
//         markerElement.style.borderRadius = '50%';
//         markerElement.style.backgroundSize = 'cover';

//         const marker = new mapboxgl.Marker(markerElement)
//             .setLngLat([longitude, latitude])
//             .setPopup(popup)
//             .addTo(map);

//         // Define hover behavior based on hospital name
//         if (hospital_name !== "CommonSpirit Health Headquarters") {
//             marker.getElement().addEventListener('mouseenter', () => popup.addTo(map));
//             marker.getElement().addEventListener('mouseleave', () => popup.remove());
//         } else {
//             marker.getElement().addEventListener('click', (e) => {
//                 e.stopPropagation();
//                 popup.addTo(map);
//             });
//         }

//         return marker;
//     });

//     // Initial visibility adjustment based on zoom level
//     toggleMarkersVisibility();
// }


// // Helper function to create a marker with popup
// // Function to create a marker with popup functionality and specific behavior for hospital markers
// function createMarker(hospital_name, location, ehr_system, hospital_address, longitude, latitude, parent_company) {
//     // Generate popup content with additional note for CommonSpirit Health Headquarters
//     let popupContent = `
//         <strong>${hospital_name}</strong><br>
//         <strong style="color: #05aaff">${location}</strong><br>
//         ${parent_company ? `Parent Company: ${parent_company}<br>` : ""}
//         EHR System: <strong style="color: #0f2844">${ehr_system}</strong><br>
//         Address: ${hospital_address}
//     `;

//     if (hospital_name === "CommonSpirit Health Headquarters") {
//         popupContent += `<br><strong style="color: #ff8502">Note:</strong> CommonSpirit Health operates over 140 hospitals across 21 states. 
//             <a href="https://www.commonspirit.org/" target="_blank" style="color: #06b4fd">Visit Website</a>`;
//     }

//     // Create a popup with the content
//     const popup = new mapboxgl.Popup({ offset: 15, closeButton: false }).setHTML(popupContent);

//     // Create a custom marker element
//     const markerElement = document.createElement('div');
//     markerElement.className = 'custom-marker';
//     markerElement.style.backgroundImage = `url(${logoUrl})`;
//     markerElement.style.width = '20px';
//     markerElement.style.height = '20px';
//     markerElement.style.borderRadius = '50%';
//     markerElement.style.backgroundSize = 'cover';

//     // Create and set up the marker
//     const marker = new mapboxgl.Marker(markerElement).setLngLat([longitude, latitude]).setPopup(popup);

//     // Apply specific hover/click behavior based on the hospital name
//     if (hospital_name !== "CommonSpirit Health Headquarters") {
//         // Show/hide popup on hover
//         marker.getElement().addEventListener('mouseenter', () => popup.addTo(map));
//         marker.getElement().addEventListener('mouseleave', () => popup.remove());
//     } else {
//         // For CommonSpirit Headquarters, keep popup open on click
//         marker.getElement().addEventListener('click', (e) => {
//             e.stopPropagation();
//             popup.addTo(map);
//         });
//     }

//     return marker;
// }


// // Adjust marker visibility based on zoom level
// // Function to toggle visibility of markers based on zoom level
// function toggleMarkersVisibility() {
//     const zoomLevel = map.getZoom();
//     const minZoomToShowMarkers = 4;

//     markers.forEach(marker => {
//         if (zoomLevel >= minZoomToShowMarkers && !marker._map) {
//             // Add marker to map if zoom level is sufficient and it’s not already added
//             marker.addTo(map);
//         } else if (zoomLevel < minZoomToShowMarkers && marker._map) {
//             // Remove marker from map if zoom level is insufficient and it’s currently added
//             marker.remove();
//         }
//     });
// }

// // Attach toggleMarkersVisibility to map zoom events
// map.on('zoomend', toggleMarkersVisibility);


//   // Attach 'zoomend' event to adjust markers based on zoom level
//   map.on('zoomend', toggleMarkers);

//   // Initial call to set visibility based on the starting zoom level
//   toggleMarkers();



// // Setup and add cluster source and layers with interactions
// function setupClusterSourceAndLayers(facilities) {
//     // Define the GeoJSON source with clustering enabled
//     map.addSource('hospitals', {
//         type: 'geojson',
//         data: {
//             type: 'FeatureCollection',
//             features: facilities.map(facility => ({
//                 type: 'Feature',
//                 properties: { ...facility },
//                 geometry: { type: 'Point', coordinates: [facility.longitude, facility.latitude] }
//             })),
//         },
//         cluster: true,
//         clusterMaxZoom: 14,
//         clusterRadius: 80,
//     });

//     // Define clustered circle layer
//     map.addLayer({
//         id: 'clusters',
//         type: 'circle',
//         source: 'hospitals',
//         filter: ['has', 'point_count'],
//         paint: {
//             'circle-color': ['step', ['get', 'point_count'], '#ff8502', 10, '#0f2844'],
//             'circle-radius': ['step', ['get', 'point_count'], 10, 20, 15, 50, 20],
//             'circle-stroke-width': 1,
//             'circle-stroke-color': '#0f2844'
//         }
//     });

//     // Define cluster count label
//     map.addLayer({
//         id: 'cluster-count',
//         type: 'symbol',
//         source: 'hospitals',
//         filter: ['has', 'point_count'],
//         layout: {
//             'text-field': '{point_count_abbreviated}',
//             'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
//             'text-size': 14,
//             'text-anchor': 'center',
//         },
//         paint: {
//             'text-color': '#FFFFFF',
//         },
//     });

//     // Define unclustered point layer
//     map.addLayer({
//         id: 'unclustered-point',
//         type: 'circle',
//         source: 'hospitals',
//         filter: ['!', ['has', 'point_count']],
//         paint: {
//             'circle-color': '#11b4da',
//             'circle-radius': 3,
//         },
//     });

//     // Toggle visibility of unclustered points based on zoom level
//     map.on('zoom', () => {
//         map.setLayoutProperty('unclustered-point', 'visibility', map.getZoom() >= 6 ? 'visible' : 'none');
//     });

//     // Event listener for unclustered points to show popup with facility information
//     map.on('click', 'unclustered-point', (e) => {
//         const coordinates = e.features[0].geometry.coordinates.slice();
//         const { hospital_name, location, ehr_system, hospital_address } = e.features[0].properties;

//         new mapboxgl.Popup()
//             .setLngLat(coordinates)
//             .setHTML(`<strong>${hospital_name}</strong><br>${location}<br>EHR System: ${ehr_system}<br>Address: ${hospital_address}`)
//             .addTo(map);
//     });

//     // Event listener for clusters to zoom in and expand when clicked
//     map.on('click', 'clusters', (e) => {
//         const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
//         const clusterId = features[0].properties.cluster_id;
//         map.getSource('hospitals').getClusterExpansionZoom(clusterId, (err, zoom) => {
//             if (err) return;
//             map.easeTo({
//                 center: features[0].geometry.coordinates,
//                 zoom: zoom,
//             });
//         });
//     });
// }


   
// // Sidebar setup for displaying facilities
// function setupSidebar(sidebar) {
//     sidebar.addEventListener('click', () => toggleSidebarVisibility());
//     document.getElementById('minimize-sidebar').addEventListener('click', () => toggleSidebar(sidebar));
// }

// // Set region layers on the map
// function setRegionLayers(regionIds) {
//     regionIds.forEach(id => {
//         map.addSource(id, { type: 'geojson', data: `/data/${id}.geojson`, promoteId: 'id' });
//         map.addLayer({ id: `${id}-fill`, type: 'fill', source: id, paint: { 'fill-color': '#05aaff', 'fill-opacity': 0.5 } });
//         map.addLayer({ id: `${id}-border`, type: 'line', source: id, paint: { 'line-color': '#FFFFFF', 'line-width': 1 } });
//     });
// }

// // Sidebar toggling visibility
// function toggleSidebar(sidebar) {
//     sidebar.classList.toggle('collapsed');
//     const minimizeIcon = document.getElementById('minimize-sidebar').querySelector('i');
//     if (sidebar.classList.contains('collapsed')) {
//         minimizeIcon.classList.remove('fa-chevron-up');
//         minimizeIcon.classList.add('fa-chevron-down');
//     } else {
//         minimizeIcon.classList.remove('fa-chevron-down');
//         minimizeIcon.classList.add('fa-chevron-up');
//     }
// }

// function showError(message) {
//     const errorMessage = document.getElementById('error-message');
//     errorMessage.style.display = 'block';
//     errorMessage.innerText = message;
// }

// function getPopupContent(hospital_name, location, ehr_system, hospital_address, parent_company) {
//     return `
//         <strong>${hospital_name}</strong><br>
//         <strong style="color: #05aaff">${location}</strong><br>
//         ${parent_company ? `Parent Company: ${parent_company}<br>` : ""}
//         EHR System: <strong style="color: #0f2844">${ehr_system}</strong><br>
//         Address: ${hospital_address}
//     `;
// }


// map.addControl(new mapboxgl.NavigationControl());
//         // map.addControl(new mapboxgl.NavigationControl({ position: 'top-left' }));
//         // map.scrollZoom.disable();

//         let userInteracting = false;
//         function spinGlobe() {
//             if (!userInteracting && map.getZoom() < 5) {
//                 const center = map.getCenter();
//                 center.lng -= 360 / 240;
//                 map.easeTo({ center, duration: 1000, easing: (n) => n });
//             }
//         }

//         map.on('mousedown', () => userInteracting = true);
//         map.on('dragstart', () => userInteracting = true);
//         map.on('moveend', () => spinGlobe());
//         spinGlobe();

//         let hoveredPolygonId = null;
//         map.on('mousemove', 'us-states-fill', (e) => {
//             if (e.features.length > 0) {
//                 if (hoveredPolygonId !== null) {
//                     map.setFeatureState({ source: 'us-states', id: hoveredPolygonId }, { hover: false });
//                 }
//                 hoveredPolygonId = e.features[0].id;
//                 map.setFeatureState({ source: 'us-states', id: hoveredPolygonId }, { hover: true });
//             }
//         });

//         map.on('mouseleave', 'us-states-fill', () => {
//             if (hoveredPolygonId !== null) {
//                 map.setFeatureState({ source: 'us-states', id: hoveredPolygonId }, { hover: false });
//             }
//             hoveredPolygonId = null;
//         });

//         // Define the closeSidebar function
//         function closeSidebar() {
//             sidebar.style.display = 'none';
//             if (selectedStateId !== null) {
//                 map.setFeatureState({ source: 'us-states', id: selectedStateId }, { selected: false });
//             }
//             selectedStateId = null;
//         }
//         document.getElementById('close-sidebar').addEventListener('click', closeSidebar);

//         // Fly-to buttons for navigating regions
//         document.getElementById("fly-to-uk").addEventListener("click", () => {
//             map.flyTo({ center: [360.242386, 51.633362], zoom: 4, pitch: 45 });
//         });
//         document.getElementById("fly-to-canada").addEventListener("click", () => {
//             map.flyTo({
//                 center: [-106.3468, 56.1304],
//                 zoom: 4,
//                 pitch: 30
//             });

   
//         });
//         document.getElementById("fly-to-usa").addEventListener("click", () => {
//             map.flyTo({ center: [-101.714859, 39.710884], zoom: 4, pitch: 45 });
//         });

//         document.getElementById("fit-to-usa").addEventListener("click", () => {
//             map.fitBounds([
//                 [-165.031128, 65.476793],
//                 [-81.131287, 26.876143]
//             ]);
//         });

//         document.getElementById("fly-to-aruba").addEventListener("click", () => {
//             map.flyTo({ center: [-70.027, 12.5246], zoom: 5, pitch: 45 });
//         });

//         // Reset view button on the right side (outside the sidebar)
//         document.getElementById("reset-view").addEventListener("click", () => {
//             map.flyTo({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM, pitch: 0 });
//         });

//         // Initialize drag variables
//         let isDragging = false;
//         let startX, startY, initialLeft, initialTop;
//         const dragThreshold = 5;
//         const header = sidebar.querySelector(".sidebar-header");

//         function startDrag(e) {
//             startX = e.touches ? e.touches[0].clientX : e.clientX;
//             startY = e.touches ? e.touches[0].clientY : e.clientY;
//             const rect = sidebar.getBoundingClientRect();
//             initialLeft = rect.left;
//             initialTop = rect.top;
//             sidebar.classList.add("dragging");
//             isDragging = false;

  
//             document.addEventListener("mousemove", handleDrag);
//             document.addEventListener("mouseup", endDrag);
//             document.addEventListener("touchmove", handleDrag, { passive: false });
//             document.addEventListener("touchend", endDrag);
//         }

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

//         function endDrag() {
//             if (!isDragging) {
//                 header.click();
//             }
//             isDragging = false;
//             sidebar.classList.remove("dragging");

//             document.removeEventListener("mousemove", handleDrag);
//             document.removeEventListener("mouseup", endDrag);
//             document.removeEventListener("touchmove", handleDrag);
//             document.removeEventListener("touchend", endDrag);
//         }

//         header.addEventListener("mousedown", startDrag);
//         header.addEventListener("touchstart", startDrag, { passive: false });

        

//         function toggleSidebarOnHover(show) {
//             if (window.innerWidth <= 480) {
//                 sidebar.style.display = show ? 'block' : 'none';
//             }
//         }

//         // Add event listeners for hover on the sidebar
//         sidebar.addEventListener('mouseenter', () => toggleSidebarOnHover(true));
//         sidebar.addEventListener('mouseleave', () => toggleSidebarOnHover(false));

//         // Close sidebar when the close button is clicked
//         document.getElementById("close-sidebar").addEventListener('click', () => {
//             sidebar.style.display = 'none';
//         });


//     document.getElementById('minimize-sidebar').addEventListener('click', () => {
//         const sidebar = document.getElementById('hospital-list-sidebar');
//         sidebar.classList.toggle('collapsed');

//         // Icon for minimize button based on the sidebar state
//         const minimizeIcon = document.getElementById('minimize-sidebar').querySelector('i');
//         if (sidebar.classList.contains('collapsed')) {
//             minimizeIcon.classList.remove('fa-chevron-up');
//             minimizeIcon.classList.add('fa-chevron-down');
//         } else {
//             minimizeIcon.classList.remove('fa-chevron-down');
//             minimizeIcon.classList.add('fa-chevron-up');
//         }
//     });



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
