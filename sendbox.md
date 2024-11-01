<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Guides</title>
    <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no">
    <link href="https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600&family=Roboto:wght@400&display=swap"
        rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">


    <script src="https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.js"></script>
    <style>
        html,
        body {
            margin: 0;
            padding: 0;
            height: 100%;
            font-family: Arial, sans-serif;
            color: #333;
        }

        #map {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
        }

        .mapboxgl-ctrl-top-right {
            position: absolute;
            top: 10px;
            right: 10px;
        }

        .mapbox-button-group {
            position: absolute;
            top: 150px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 1px;
            z-index: 10;
        }

        .mapbox-button-group button {
            /* background: linear-gradient(145deg, #ff5656, #d32626); */
            color: #ffff;
            border: none;
            border-radius: 8px;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease-in-out;
        }

        .mapbox-button-group button:hover {
            transform: scale(1.1);
            background: linear-gradient(145deg, #ff4343, #b31919);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
        }

        #container {
            display: flex;
            flex-direction: row-reverse;
            height: 100%;
            z-index: 5;
        }

        button {
            width: 100%;
            padding: 8px 0;
            margin: 10px 0;
            background-color: #4CAF50;
            color: #fff;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        button:hover {
            background-color: #45a049;
        }

        #hospital-list-sidebar {
            /* font-family: 'Roboto', sans-serif; */
            font-family: 'Open Sans', sans-serif;
            /* Clean and professional */
            position: absolute;
            left: 0;
            top: 0;
            width: 260px;
            height: 100%;
            max-height: 400px;
            /* background: linear-gradient(145deg, rgba(255, 86, 86, 0.85), rgba(211, 38, 38, 0.85)); */
            background: linear-gradient(145deg, #0f2844, #1c3a5c);
            border-radius: 12px;
            /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); */
            box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.4);
            padding: 20px;
            overflow-y: auto;
            z-index: 10;
            color: white;
            /* color: black; */
            cursor: grab;
            /* transition: all 0.3s ease;
            transition: color 0.2s ease, left 0.1s ease, top 0.1s ease; */
            transition: transform 0.3s ease-in-out;
            transform: translateX(0);
        }

        #hospital-list-sidebar:hover {
            box-shadow: 0 6px 14px rgba(0, 0, 0, 0.4);
        }

        #hospital-list-sidebar.hidden {
            transform: translateX(-100%);
        }

        #hospital-list-sidebar h2 {
            /* font-family: 'Poppins', sans-serif;  */
            font-family: 'Open Sans', sans-serif;
            font-size: 1.4rem;
            font-weight: 600;
            color: #ffffff;
            /* margin-bottom: 15px; */
            margin-top: 5px;
            margin-bottom: 10px;
            text-align: center;
            border-bottom: 2px solid rgba(255, 255, 255, 0.2);
            padding-bottom: 8px;
            letter-spacing: 0.5px;

        }


        #hospital-list-sidebar p.count-display {
            font-size: 1rem;
            color: #f5eaea;
            text-align: center;
            font-weight: 500;
            margin-top: 10px;
            margin-bottom: 10px;
        }

        #hospital-list {
            list-style-type: none;
            padding: 0;
            margin: 0;
            font-size: 0.9rem;
        }

        #hospital-list li {
            margin: 10px 0;
            padding: 10px;
            background-color: rgba(255, 255, 255, 0.15);
            border-radius: 8px;
            line-height: 1.4;
            font-size: 0.95rem;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
            /* transition: background-color 0.3s; */
            transition: background-color 0.3s, transform 0.2s;
        }

        #hospital-list li:hover {
            /* background-color: rgba(255, 255, 255, 0.25); */
            background-color: rgba(255, 255, 255, 0.2);
            transform: scale(1.02);
        }

        #hospital-list-sidebar.collapsed {
            width: 50px;
            overflow: hidden;
            transition: width 0.3s;
        }


        #hospital-list li:hover::after {
            content: 'More details available';
            color: #fff;
            font-size: 0.75rem;
            position: absolute;
            right: 10px;
            bottom: 10px;
        }


        #hospital-list-sidebar::-webkit-scrollbar {
            width: 6px;
        }

        #hospital-list-sidebar::-webkit-scrollbar-thumb {
            background: #ff8502;
            border-radius: 10px;
        }


        /* Header container for close and theme toggle buttons */
        .sidebar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            width: 100%;
        }

        /* Close button */
        #close-sidebar {
            background-color: #333;
            /* Dark background */
            color: #fff;
            /* Light icon color */
            border: none;
            border-radius: 50%;
            /* Rounded shape */
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            /* Positioned within header */
            z-index: 20;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            transition: background-color 0.3s ease;
            margin-right: 10px;
            /* Adds space between the buttons */
        }

        #close-sidebar:hover {
            background-color: #555;
            /* Slightly lighter on hover */
        }

        #close-sidebar i {
            font-size: 12px;
        }

        /* Theme toggle button */
        .theme-toggle-btn {
            background-color: #333;
            color: #fff;
            border: none;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            z-index: 20;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            transition: background-color 0.3s ease;
        }

        /* Button hover effect for theme toggle */
        .theme-toggle-btn:hover {
            background-color: #555;
        }

        /* Dark text style for the sidebar */
        .dark-text {
            color: #333 !important;
        }

        .dark-text h2,
        .dark-text p.count-display {
            color: #333 !important;
        }

        .custom-marker {
            background-repeat: no-repeat;
            background-position: center;
            cursor: default;
        }

        /* Responsive Styles */

        @media (max-width: 768px) {
            #hospital-list-sidebar {
                width: 80%;
                top: auto;
                left: 7.5%;
                max-height: 60vh;
                padding: 15px;
                position: fixed;
                bottom: 0;
                overflow-y: auto;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }

            #hospital-list li {
                font-size: 0.85rem;
            }

            #close-sidebar {
                padding: 5px;
                font-size: 0.85rem;
            }

            .sidebar-header {
                justify-content: space-evenly;
            }

            #container {
                flex-direction: column;
            }

            button {
                font-size: 12px;
                padding: 6px 0;
            }
        }

        @media (max-width: 480px) {
            #hospital-list-sidebar {
                width: 90%;
                left: 5%;
                max-height: 50vh;
                padding: 10px;
                bottom: 0;
            }

            #hospital-list li {
                font-size: 0.8rem;
                padding: 5px;
            }

            #close-sidebar {
                padding: 4px;
                font-size: 0.8rem;
            }

            #close-sidebar,
            .theme-toggle-btn {
                width: 30px;
                height: 30px;
            }

            button {
                margin: 5px 0;
            }

            #hospital-list li {
                font-size: 12px;
                padding: 5px;
            }
        }
    </style>
</head>

<body>

    <div id="error-message" style="display: none; color: red; text-align: center; margin-top: 10px;">
        <!-- Error message display-->
    </div>
    <div id="hospital-list-sidebar" style="display: none;">
        <div class="sidebar-header">
            <button id="close-sidebar" aria-label="Close Sidebar" class="close-btn">
                <i class="fas fa-times"></i>
            </button>
            <button id="toggle-theme" aria-label="Toggle Theme" class="theme-toggle-btn">
                <i class="fas fa-adjust"></i>
            </button>
        </div>
        <h2>Current Locations Using Goliath’s Solutions</h2>
        <ul id="hospital-list"></ul>
    </div>

    <div class="mapbox-button-group">
        <button id="fly-to-uk">UK</button>
        <button id="fly-to-usa">USA</button>
        <button id="fit-to-uk">Fit UK</button>
        <button id="fit-to-usa">Fit USA</button>
        <button id="reset-view"><i class="fas fa-sync-alt"></i></button>
    </div>

    <div id="map"></div>
    </div>
    <script>
        const sidebar = document.getElementById("hospital-list-sidebar");
        const INITIAL_CENTER = [-119.0187, 35.3733];
        const INITIAL_ZOOM = 1;
        mapboxgl.accessToken = 'pk.eyJ1IjoibmFuYWpvbjY2IiwiYSI6ImNtMnJxMmZtNTAwYWcyc3B1bGtzdjR5NTkifQ.5aPfUP-w8DUsBpaqVgjG9A';

        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/light-v11',
            projection: 'globe',
            zoom: INITIAL_ZOOM,
            center: INITIAL_CENTER
        });

        map.easeTo({
            center: [-119.0187, 35.3733],
            zoom: 6,
            duration: 3000,
            easing: (t) => t * (2 - t)
        });

        map.on('load', () => {
            map.setFog({});

            map.addSource('us-states', {
                type: 'geojson',
                data: '/data/us-states.geojson',
                promoteId: 'id'
            });

            map.addLayer({
                id: 'us-states-fill',
                type: 'fill',
                source: 'us-states',
                paint: {
                    'fill-color': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false], '#05aaff', // Hover color
                        ['boolean', ['feature-state', 'selected'], false], '#05aaff', // Click color
                        [
                            'match', ['get', 'id'],
                            'CA', '#d3d3d3', // Default color per state
                            'TX', '#d3d3d3',
                            'NY', '#d3d3d3',
                            'FL', '#d3d3d3',
                            '#d3d3d3'  // Default color for non-target states
                        ]
                    ],
                    'fill-opacity': 0.5
                }
            });

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
                // Remove selected color from previous state if it exists
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
                        const state = facility.location.split(', ')[1];
                        statesWithFacilities.add(state);
                    });

                    // Add markers for each facility
                    const markers = facilities.map(({ ehr_system, hospital_name, location, hospital_address, longitude, latitude, color }) => {
                        const popup = new mapboxgl.Popup({ offset: 15, closeButton: false })
                            .setHTML(`<strong>${hospital_name}</strong><br>${location}<br>EHR System: ${ehr_system}<br>Address: ${hospital_address}`);

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

                        // Event listeners for hover to show/hide popup
                        marker.getElement().addEventListener('mouseenter', () => popup.addTo(map));
                        marker.getElement().addEventListener('mouseleave', () => popup.remove());

                        // Additional event listener for touch devices (show popup on tap)
                        marker.getElement().addEventListener('click', (e) => {
                            e.stopPropagation(); // Prevent sidebar from opening
                            popup.addTo(map);
                        });

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

                    // Optional: Initial call to set visibility based on the starting zoom level
                    toggleMarkers();

                    // map.on('move', toggleMarkers);
                    // map.on('zoom', toggleMarkers);

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
                                },
                                geometry: {
                                    type: 'Point',
                                    coordinates: [facility.longitude, facility.latitude],
                                }
                            })),
                        },
                        cluster: true,
                        clusterMaxZoom: 14,// Increase this value to reduce unclustered points at higher zoom levels
                        clusterRadius: 80,// Increase radius to group more points together in clusters
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
                            selectedStateId = null; // Clear the selection
                            return; // Exit function if no facilities in the state
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
                        list.innerHTML = ''; // Clear previous list

                        // Update sidebar title with state name
                        const title = sidebar.querySelector('h2');
                        title.innerText = `Facilities Using Goliath's Solutions in ${stateName}`;

                        // Remove any existing count display
                        const existingCountDisplay = sidebar.querySelector('.count-display');
                        if (existingCountDisplay) existingCountDisplay.remove();

                        // Display facility count
                        const countDisplay = document.createElement('p');
                        countDisplay.classList.add('count-display');
                        countDisplay.innerText = `Total Facilities: ${stateHospitals.length}`;
                        countDisplay.style.fontWeight = 'bold';
                        countDisplay.style.color = '#FFFFFF';
                        countDisplay.style.marginTop = '10px';
                        list.before(countDisplay);

                        // Show facilities in the sidebar if the state has data
                        if (stateHospitals.length > 0) {
                            stateHospitals.forEach(hospital => {
                                const listItem = document.createElement('li');
                                listItem.innerHTML = `<i class="fas fa-hospital-symbol"></i> <strong>${hospital.hospital_name}</strong><br>${hospital.location}<br>EHR System: ${hospital.ehr_system}`;

                                list.appendChild(listItem);

                                // Conditional background color based on the EHR system
                                listItem.style.backgroundColor = hospital.ehr_system === 'SystemA' ? '#ff8502' : '#0f2844';

                                list.appendChild(listItem);
                            });
                            sidebar.style.display = 'block'; // Show sidebar only if data exists
                        } else {
                            sidebar.style.display = 'none'; // Hide sidebar if no facilities
                        }
                    });

                })
                // .catch(error => console.error('Error loading facilities data:', error));

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


            document.getElementById("fly-to-uk").addEventListener("click", () => {
                map.flyTo({ center: [360.242386, 51.633362], zoom: 4, pitch: 45 });
            });

            document.getElementById("fly-to-usa").addEventListener("click", () => {
                map.flyTo({ center: [-101.714859, 39.710884], zoom: 4, pitch: 45 });
            });

            document.getElementById("fit-to-uk").addEventListener("click", () => {
                map.fitBounds([
                    [355.216141, 56.551914],
                    [357.263718, 51.059092]
                ]);
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

            let isDragging = false;
            let offsetX, offsetY;

            sidebar.addEventListener("mousedown", (e) => {
                isDragging = true;
                offsetX = e.clientX - sidebar.offsetLeft;
                offsetY = e.clientY - sidebar.offsetTop;
                sidebar.classList.add("dragging");
            });

            document.addEventListener("mousemove", (e) => {
                if (isDragging) {
                    sidebar.style.left = `${e.clientX - offsetX}px`;
                    sidebar.style.top = `${e.clientY - offsetY}px`;
                }
            });

            document.addEventListener("mouseup", () => {
                isDragging = false;
                sidebar.classList.remove("dragging");
                constrainToViewport(sidebar);
            });

            function constrainToViewport(element) {
                const rect = element.getBoundingClientRect();
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;

                // Constrain the sidebar within the viewport bounds
                if (rect.left < 0) element.style.left = "0px";
                if (rect.top < 0) element.style.top = "0px";
                if (rect.right > windowWidth) element.style.left = `${windowWidth - rect.width}px`;
                if (rect.bottom > windowHeight) element.style.top = `${windowHeight - rect.height}px`;
            }

            const toggleThemeButton = document.getElementById("toggle-theme");

            toggleThemeButton.addEventListener("click", () => {

                sidebar.classList.toggle("dark-text");
            });

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
    </script>
</body>

</html>

//with solid background on the sidebar with gt colors

//fly to in the sidebar. lol



