// import { checkApiLimit } from "@/lib/api-limit";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

import { increaseApiLimit,checkApiLimit } from "@/lib/api-limit";

// Initialize OpenAI with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Clerk Authentication to get the authenticated user's ID
    const { userId } = getAuth(req);
    console.log("Authenticated User ID:", userId); // Log the userId

    // Check if the user is authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Parse the body of the request
    const body = await req.json();
    const { prompt, amount, resolution } = body;

    // Validate that the required data is provided
    if (!prompt || !amount || !resolution) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check the API limit
    const freeTrial = await checkApiLimit(req); // Ensure to pass the req object

    if (!freeTrial) {
      return new NextResponse("Free trial has expired.", { status: 403 });
    }

    // Send the request to the OpenAI API for image generation
    const response = await openai.images.generate({
      prompt: prompt,
      n: parseInt(amount, 10), // Convert amount to a number
      size: resolution, // Use the resolution
    });

    // Log the OpenAI API response for debugging
    console.log("OpenAI Response:", response);

    await increaseApiLimit(req);

    // Check if response contains data and extract the image URLs
    const imageUrls = response.data?.map((image: { url?: string }) => ({
      url: image.url || "", // Fallback to an empty string if url is undefined
    })) || []; // Fallback to an empty array if data is not defined

    // Return the generated image URLs to the client
    return NextResponse.json(imageUrls);

  } catch (error: any) {
    // Log the error in the terminal for debugging
    console.error("IMAGE_GENERATION_ERROR", error);

    // Return the error message to the frontend for better debugging
    return new NextResponse(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
