import { checkApiLimit } from "@/lib/api-limit";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the message type
type ChatCompletionRequestMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

// Instruction message for the assistant
const instructionMessage: ChatCompletionRequestMessage = {
  role: 'system',
  content: 'You are a helpful assistant.',
};

export async function POST(req: NextRequest) {
  try {
    // Clerk authentication to get the authenticated user's ID
    const { userId } = getAuth(req);

    // Log the authenticated user ID
    console.log("Authenticated User ID:", userId);

    // Check if the user is authenticated
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body to retrieve messages
    const body = await req.json();
    const { messages }: { messages: ChatCompletionRequestMessage[] } = body;

    // Log received messages for debugging
    console.log("Messages received:", messages);

    // Validate messages format
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ message: "Invalid messages format" }, { status: 400 });
    }

    // Pass the req object to checkApiLimit
    const freeTrial = await checkApiLimit(req);

    if (!freeTrial) {
      return NextResponse.json({ message: "Free trial has expired." }, { status: 403 });
    }

    // Send request to OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        instructionMessage, // Instruction for the assistant
        ...messages, // Spread user-provided messages
      ],
    });

    // Log OpenAI response for debugging
    console.log("OpenAI Response:", response);

    // Check if the response is successful and contains choices
    if (!response.choices || response.choices.length === 0) {
      return NextResponse.json({ message: "No response from assistant." }, { status: 500 });
    }

    // Extract the assistant's message content
    const assistantMessage = response.choices[0].message.content;

    // Return the assistant's message back to the client
    return NextResponse.json({ message: assistantMessage });

  } catch (error: any) {
    console.error("Error:", error);

    // Return error message to the frontend
    return NextResponse.json(
      { message: error.message || "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
