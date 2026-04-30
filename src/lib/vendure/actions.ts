import {query} from './api';
import {GetActiveCustomerQuery} from './queries';
import {getActiveChannelCached} from './cached';
import {cache} from "react";
import {readFragment} from "@/graphql";
import {ActiveCustomerFragment} from "@/lib/vendure/fragments";
import {getAuthToken} from "@/lib/auth";


export const getActiveCustomer = cache(async () => {
    try {
        const token = await getAuthToken();
        const result = await query(GetActiveCustomerQuery, undefined, {
            token
        });
        return readFragment(ActiveCustomerFragment, result.data.activeCustomer);
    } catch (error) {
        // Gracefully handle API errors during build (e.g., missing env vars or cookies() not available)
        // This is expected during static generation
        if ((error as any)?.digest === 'DYNAMIC_SERVER_USAGE' || (error as any)?.message?.includes('cookies')) {
            return null;
        }
        console.warn('Failed to fetch active customer:', error);
        return null;
    }
})

export const getActiveChannel = getActiveChannelCached;
