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


// dataLoader.js

// let cachedFacilitiesData = null;
// let cachedRegionsData = {};

// export async function loadFacilitiesData() {
//     if (cachedFacilitiesData) {
//         return cachedFacilitiesData;
//     }
//     try {
//         const response = await fetch('/data/facilities.json');
//         const data = await response.json();
//         cachedFacilitiesData = data; // Cache after loading once
//         return cachedFacilitiesData;
//     } catch (error) {
//         console.error('Error loading facilities data:', error);
//         throw error;
//     }
// }

// export async function loadRegionData(region) {
//     if (cachedRegionsData[region]) {
//         return cachedRegionsData[region];
//     }
//     try {
//         const response = await fetch(`/data/${region}.geojson`);
//         const data = await response.json();
//         cachedRegionsData[region] = data; // Cache each region individually
//         return cachedRegionsData[region];
//     } catch (error) {
//         console.error(`Error loading ${region} data:`, error);
//         throw error;
//     }
// }
