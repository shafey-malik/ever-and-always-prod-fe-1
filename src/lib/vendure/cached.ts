import {cache} from 'react';
import {query} from './api';
import {GetActiveChannelQuery, GetAvailableCountriesQuery, GetTopCollectionsQuery} from './queries';

/**
 * Get the active channel with caching enabled.
 * Channel configuration rarely changes, so we cache it for 1 hour.
 */
export const getActiveChannelCached = cache(async () => {
    const result = await query(GetActiveChannelQuery);
    return result.data.activeChannel;
});

/**
 * Get available countries with caching enabled.
 * Countries list never changes, so we cache it with max duration.
 */
export const getAvailableCountriesCached = cache(async () => {
    const result = await query(GetAvailableCountriesQuery);
    return result.data.availableCountries || [];
});

/**
 * Get top-level collections with caching enabled.
 * Collections rarely change, so we cache them for 1 day.
 */
export const getTopCollections = cache(async () => {
    const result = await query(GetTopCollectionsQuery);
    return result.data.collections.items;
});
