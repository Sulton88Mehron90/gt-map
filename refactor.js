// Add inland water layer to color rivers and lakes
//     map.addLayer({
//         id: 'water-inland',
//         type: 'fill',
//         source: 'composite', // default source in Mapbox styles
//         'source-layer': 'water', // layer name from Mapbox's default style
//         filter: ['==', 'class', 'river'], // only rivers, lakes, or inland water bodies
//         paint: {
//             'fill-color': '#0077be', // blue color for inland water
//             'fill-opacity': 0.6
//         }
//     });


// Constants and initial map setup

import { MAPBOX_TOKEN } from './config.js';

mapboxgl.accessToken = MAPBOX_TOKEN;
const INITIAL_CENTER = [-119.0187, 35.3733];
const INITIAL_ZOOM = 1;

document.addEventListener("DOMContentLoaded", () => {
    
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v11',
        projection: 'globe',
        zoom: INITIAL_ZOOM,
        center: INITIAL_CENTER,
    });

    map.on("load", () => {
        map.setFog({});
        map.easeTo({ center: INITIAL_CENTER, zoom: 4, duration: 3000, easing: t => t * (2 - t) });
        
        addMapControls(map);
        initializeRegions(map);
        initializeGeocoder(map);
        loadFacilities(map);
        handleFlyToButtons(map);
        enableSidebarDragging();
    });
});

// Function to add map controls and resize handling
function addMapControls(map) {
    map.addControl(new mapboxgl.NavigationControl());
    window.addEventListener("resize", () => map.resize());
}

// Functions for region setup
function initializeRegions(map) {
    map.addSource('us-states', { type: 'geojson', data: '/data/us-states.geojson', promoteId: 'id' });
    map.addSource('uk-regions', { type: 'geojson', data: '/data/uk-regions.geojson', promoteId: 'id' });
    map.addSource('canada-regions', { type: 'geojson', data: '/data/canada-regions.geojson', promoteId: 'id' });
    map.addSource('aruba-region', { type: 'geojson', data: '/data/aruba-region.geojson', promoteId: 'id' });

    // Add fill and line layers for each region
    ['us-states', 'uk-regions', 'canada-regions', 'aruba-region'].forEach(source => addRegionLayer(map, source));
}

// Function to add a region layer with both fill and line styles
function addRegionLayer(map, sourceName) {
    map.addLayer({
        id: `${sourceName}-fill`,
        type: 'fill',
        source: sourceName,
        paint: {
            'fill-color': '#d3d3d3', // Default color
            'fill-opacity': 0.4
        }
    });
    map.addLayer({
        id: `${sourceName}-line-hover`,
        type: 'line',
        source: sourceName,
        paint: {
            'line-color': '#FFFFFF',
            'line-width': 0.6
        }
    });
}

// Geocoder setup with toggle visibility
function initializeGeocoder(map) {
    const geocoderContainer = document.getElementById("geocoder-container");
    const geocoderToggle = document.getElementById("toggle-geocoder");
    let geocoder;

    geocoderToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!geocoder) {
            geocoder = new MapboxGeocoder({ accessToken: mapboxgl.accessToken, mapboxgl: mapboxgl });
            geocoderContainer.appendChild(geocoder.onAdd(map));
        }
        geocoderContainer.style.display = geocoderContainer.style.display === "block" ? "none" : "block";
        geocoderToggle.style.display = geocoderToggle.style.display === "flex" ? "none" : "flex";
    });
}

// Function to load facility markers with clustering and popup functionality
function loadFacilities(map) {
    fetch('./data/facilities.json')
        .then(response => response.json())
        .then(facilities => {
            const features = facilities.map(facility => ({
                type: 'Feature',
                properties: facility,
                geometry: { type: 'Point', coordinates: [facility.longitude, facility.latitude] }
            }));

            map.addSource('hospitals', {
                type: 'geojson',
                data: { type: 'FeatureCollection', features },
                cluster: true,
                clusterMaxZoom: 14,
                clusterRadius: 80,
            });

            addClusterLayers(map);
            addMarkers(map, features);
        })
        .catch(error => console.error('Error loading facilities data:', error));
}

// Function to add cluster layers
function addClusterLayers(map) {
    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'hospitals',
        filter: ['has', 'point_count'],
        paint: {
            'circle-color': ['step', ['get', 'point_count'], '#ff8502', 10, '#0f2844'],
            'circle-radius': ['step', ['get', 'point_count'], 10, 20, 15, 50, 20],
            'circle-stroke-width': 1,
            'circle-stroke-color': '#0f2844',
        },
    });

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
        paint: { 'text-color': '#FFFFFF' },
    });
}

// Function to add individual facility markers with popups
function addMarkers(map, features) {
    features.forEach(facility => {
        const popup = new mapboxgl.Popup({ offset: 15, closeButton: false })
            .setHTML(`
                <strong>${facility.properties.hospital_name}</strong><br>
                Location: ${facility.properties.location}<br>
                EHR System: ${facility.properties.ehr_system}
            `);

        const marker = new mapboxgl.Marker()
            .setLngLat(facility.geometry.coordinates)
            .setPopup(popup)
            .addTo(map);

        // Hover effect for the marker popup
        marker.getElement().addEventListener('mouseenter', () => popup.addTo(map));
        marker.getElement().addEventListener('mouseleave', () => popup.remove());
    });
}

// Fly-to functionality for navigation buttons
function handleFlyToButtons(map) {
    document.getElementById("fly-to-uk").addEventListener("click", () => map.flyTo({ center: [360.242386, 51.633362], zoom: 4 }));
    document.getElementById("fly-to-canada").addEventListener("click", () => map.flyTo({ center: [-106.3468, 56.1304], zoom: 4 }));
    document.getElementById("fly-to-usa").addEventListener("click", () => map.flyTo({ center: [-101.714859, 39.710884], zoom: 4 }));
    document.getElementById("fly-to-aruba").addEventListener("click", () => map.flyTo({ center: [-70.027, 12.5246], zoom: 5 }));
    document.getElementById("reset-view").addEventListener("click", () => map.flyTo({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM }));
}

// Sidebar drag-and-drop functionality
function enableSidebarDragging() {
    const sidebar = document.getElementById("hospital-list-sidebar");
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    sidebar.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = sidebar.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            sidebar.style.left = `${initialLeft + e.clientX - startX}px`;
            sidebar.style.top = `${initialTop + e.clientY - startY}px`;
        }
    });

    document.addEventListener("mouseup", () => isDragging = false);
}
