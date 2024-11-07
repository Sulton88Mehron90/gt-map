// dataLoader.js

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
