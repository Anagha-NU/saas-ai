// app/(dashboard)/api-limit-fetcher.tsx

import { NextRequest } from "next/server"; // Import NextRequest
import { getApiLimitCount } from "@/lib/api-limit";

// Fetch API limit count on server-side
const ApiLimitFetcher = async (req: NextRequest) => {
  const apiLimitCount = await getApiLimitCount(req); // Pass req as an argument
  return apiLimitCount; // Return the fetched count
};

// If this function is not used in a component context, export as default
export default ApiLimitFetcher;
