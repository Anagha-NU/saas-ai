import { NextRequest } from 'next/server'; // Import NextRequest
import { getApiLimitCount, increaseApiLimit } from '@/lib/api-limit';

// Handle GET requests to fetch the API limit count
export async function GET(req: NextRequest) { // Accept NextRequest
  try {
    const apiLimitCount = await getApiLimitCount(req); // Pass req to getApiLimitCount
    return new Response(JSON.stringify({ apiLimitCount }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching API limit count:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch API limit count" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Handle POST requests to increase the API limit count
export async function POST(req: NextRequest) { // Accept NextRequest
  try {
    const apiLimitCount = await increaseApiLimit(req); // Pass req to increaseApiLimit
    return new Response(JSON.stringify({ apiLimitCount }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error increasing API limit count:", error);
    return new Response(
      JSON.stringify({ error: "Failed to increase API limit count" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
