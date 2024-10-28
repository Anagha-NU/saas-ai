// app/(dashboard)/api-limit-fetcher.tsx

import { getApiLimitCount } from "@/lib/api-limit";

// Fetch API limit count on server-side
const ApiLimitFetcher = async () => {
    const apiLimitCount = await getApiLimitCount();
    return apiLimitCount; // Return the fetched count
};

// If this function is not used in a component context, export as default
export default ApiLimitFetcher;
