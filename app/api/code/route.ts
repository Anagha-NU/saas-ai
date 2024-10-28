import { checkApiLimit } from "@/lib/api-limit";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the message type manually
type ChatCompletionRequestMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

// Example instruction message
const instructionMessage: ChatCompletionRequestMessage = {
  role: 'system',
  content: 'You are a helpful assistant.'
};

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
    const { messages }: { messages: ChatCompletionRequestMessage[] } = body;

    // Log the received messages for debugging
    console.log("Messages received:", messages);

    // Validate that messages were received and formatted correctly
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new NextResponse("Invalid messages format", { status: 400 });
    }

    // Pass the req object to checkApiLimit
    const freeTrial = await checkApiLimit(req);

    if (!freeTrial) {
      return new NextResponse("Free trial has expired.", { status: 403 });
    } else {
      // Send request to OpenAI API
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          instructionMessage, // Use the actual instruction message here
          ...messages // Spread user-provided messages
        ],
      });

      // Log the OpenAI API response for debugging
      console.log("OpenAI Response:", response);

      // Return the response from OpenAI to the client
      return NextResponse.json({ message: response.choices[0].message });
    }

  } catch (error: any) {
    // Log the error in the terminal for debugging
    console.error("CODE_ERROR", error);

    // Return the error message to the frontend for better debugging
    return new NextResponse(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
