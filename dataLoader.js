// Global cache for facilities data
let cachedFacilitiesData = null;

// Fetch the facility data once and store it
export function loadFacilitiesData() {
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

// Cache objects for each GeoJSON file
let cachedUSStates = null;
let cachedUKRegions = null;
let cachedItalyRegions = null;
let cachedCanadaRegions = null;
let cachedArubaRegion = null;

async function loadGeoJSON(filePath, cache) {
    if (cache) return cache;
    try {
        const response = await fetch(filePath);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error loading GeoJSON file from ${filePath}:`, error);
        throw error;
    }
}

// Exported functions to load each specific GeoJSON file
export async function loadUSStates() {
    cachedUSStates = await loadGeoJSON('/data/us-states.geojson', cachedUSStates);
    return cachedUSStates;
}

export async function loadUKRegions() {
    cachedUKRegions = await loadGeoJSON('/data/uk-regions.geojson', cachedUKRegions);
    return cachedUKRegions;
}

export async function loadItalyRegions() {
    cachedItalyRegions = await loadGeoJSON('/data/italy-regions.geojson', cachedItalyRegions);
    return cachedItalyRegions;
}

export async function loadCanadaRegions() {
    cachedCanadaRegions = await loadGeoJSON('/data/canada-regions.geojson', cachedCanadaRegions);
    return cachedCanadaRegions;
}

export async function loadArubaRegion() {
    cachedArubaRegion = await loadGeoJSON('/data/aruba-region.geojson', cachedArubaRegion);
    return cachedArubaRegion;
}
