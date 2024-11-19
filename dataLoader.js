// Global cache for facilities data
let cachedFacilitiesData = null;

// Fetch the facilities data once and store it in cache
export function loadFacilitiesData() {

    //Validate facility data before using it

    if (cachedFacilitiesData) return Promise.resolve(cachedFacilitiesData);
    return fetch('./data/facilities.json')
        .then(response => response.json())
        .then(data => {
            cachedFacilitiesData = data;
            return cachedFacilitiesData;
        })
        .catch(error => {
            console.error('Error loading facilities data:', error);
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                errorMessage.style.display = 'block';
                errorMessage.innerText = 'Failed to load facility data. Please try again later.';
            }
        });
}

// Centralized cache to hold all loaded GeoJSON data
const geoJSONCache = {};

// Define file paths for each region in a central object
const geoJSONPaths = {
    usStates: '/data/us-states.geojson',
    ukRegions: '/data/uk-regions.geojson',
    italyRegions: '/data/italy-regions.geojson',
    canadaRegions: '/data/canada-regions.geojson',
    arubaRegion: '/data/aruba-region.geojson'
};

// Generalized function to load and cache GeoJSON data for any region
async function loadGeoJSON(regionKey) {
    // Return cached data if it already exists
    if (geoJSONCache[regionKey]) return geoJSONCache[regionKey];

    // Fetch and cache the GeoJSON data if not cached yet
    try {
        const response = await fetch(geoJSONPaths[regionKey]);
        if (!response.ok) throw new Error(`Failed to load GeoJSON for ${regionKey}`);
        
        const data = await response.json();
        geoJSONCache[regionKey] = data; // Cache the data
        return data;
    } catch (error) {
        console.error(`Error loading GeoJSON for ${regionKey}:`, error);
        throw error; // Re-throw the error for upstream handling
    }
}

// Exported functions for each specific region, with lazy loading
export const loadUSStates = () => loadGeoJSON('usStates');
export const loadUKRegions = () => loadGeoJSON('ukRegions');
export const loadItalyRegions = () => loadGeoJSON('italyRegions');
export const loadCanadaRegions = () => loadGeoJSON('canadaRegions');
export const loadArubaRegion = () => loadGeoJSON('arubaRegion');


// // Global cache for facilities data
// let cachedFacilitiesData = null;

// // Validate a single facility object
// function validateFacility(facility) {
//     if (
//         typeof facility.ehr_system !== 'string' ||
//         typeof facility.hospital_name !== 'string' ||
//         typeof facility.location !== 'string' ||
//         typeof facility.hospital_address !== 'string' ||
//         typeof facility.latitude !== 'number' ||
//         typeof facility.longitude !== 'number' ||
//         (facility.parent_company && typeof facility.parent_company !== 'string') ||
//         (facility.hospital_count && typeof facility.hospital_count !== 'number') ||
//         (facility.region_id && typeof facility.region_id !== 'string')
//     ) {
//         console.error("Invalid facility:", facility);
//         return false;
//     }
//     return true;
// }

// // Fetch the facilities data once and store it in cache
// export function loadFacilitiesData() {
//     if (cachedFacilitiesData) return Promise.resolve(cachedFacilitiesData);

//     return fetch('./data/facilities.json')
//         .then(response => response.json())
//         .then(data => {
//             if (!Array.isArray(data) || data.some(facility => !validateFacility(facility))) {
//                 throw new Error("Invalid facilities data structure");
//             }
//             cachedFacilitiesData = data;
//             return cachedFacilitiesData;
//         })
//         .catch(error => {
//             console.error('Error loading facilities data:', error);
//             const errorMessage = document.getElementById('error-message');
//             if (errorMessage) {
//                 errorMessage.style.display = 'block';
//                 errorMessage.innerText = 'Failed to load facility data. Please try again later.';
//             }
//             throw error; // Re-throw for upstream handling
//         });
// }
