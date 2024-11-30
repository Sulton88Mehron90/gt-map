/**
 * Cache Management for Local Storage
 */

// Fetch data from URL and cache it in localStorage
export async function fetchAndCache(url, key) {
    try {
        const cachedData = localStorage.getItem(key);
        if (cachedData) {
            try {
                console.log(`Cache hit: ${key}`);
                return JSON.parse(cachedData).data;
            } catch (e) {
                console.error(`Invalid cache data for ${key}. Clearing it.`, e);
                localStorage.removeItem(key);
            }
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);

        const data = await response.json();
        try {
            localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
            console.log(`Cache set: ${key}`);
        } catch (error) {
            console.error(`Failed to cache data for ${key}:`, error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error(`Error fetching or caching ${key}:`, error);
        throw error;
    }
}

// Retrieve cached data
export function getCachedData(key) {
    const cached = localStorage.getItem(key);
    if (!cached) {
        console.log(`Cache miss: ${key}`);
        return null;
    }
    try {
        console.log(`Cache retrieved: ${key}`);
        return JSON.parse(cached).data;
    } catch (e) {
        console.error(`Failed to parse cache for ${key}. Clearing it.`, e);
        localStorage.removeItem(key);
        return null;
    }
}

// Check if cache is stale (older than maxAgeInHours)
export function isCacheStale(key, maxAgeInHours = 24) {
    const cached = localStorage.getItem(key);
    if (!cached) return true;

    try {
        const { timestamp } = JSON.parse(cached);
        const age = (Date.now() - timestamp) / (1000 * 60 * 60); // Age in hours
        const isStale = age > maxAgeInHours;
        console.log(`Cache ${key} is ${isStale ? 'stale' : 'fresh'}`);
        return isStale;
    } catch (e) {
        console.error(`Failed to check staleness for ${key}. Clearing it.`, e);
        localStorage.removeItem(key);
        return true;
    }
}

// Clear all cached data
export function clearCache() {
    localStorage.clear();
    console.log('All cache cleared');
}

// Remove a specific cached item
export function removeCacheItem(key) {
    localStorage.removeItem(key);
    console.log(`Cache removed: ${key}`);
}

// Pre-cache all files in the /data directory
export async function preCacheFiles(files, maxAgeInHours = 24) {
    for (const { url, key } of files) {
        try {
            if (isCacheStale(key, maxAgeInHours)) {
                console.log(`Fetching and caching: ${key}`);
                await fetchAndCache(url, key);
            } else {
                console.log(`Skipping fetch for fresh cache: ${key}`);
            }
        } catch (error) {
            console.error(`Failed to cache file: ${key} from ${url}`, error);
        }
    }
}
