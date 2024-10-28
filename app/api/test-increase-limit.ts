// app/api/test-increase-limit/route.ts
import { NextResponse } from "next/server";
import { increaseApiLimit } from "@/lib/api-limit"; // Adjust the path if necessary

export async function GET() {
    try {
        // Call the increaseApiLimit function
        const newCount = await increaseApiLimit();
        console.log("New API Limit Count after increase:", newCount); // Log the count to verify

        // Return the updated count as JSON
        return NextResponse.json({ newCount });
    } catch (error) {
        console.error("Error in test endpoint:", error); // Log any error for debugging
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
