import { getAuth } from "@clerk/nextjs/server"; // Correct import
import { NextRequest } from "next/server"; // Import NextRequest
import prismadb from "@/lib/prismadb";
import { MAX_FREE_COUNTS } from "@/constants";

// Function to increase the API limit count
export const increaseApiLimit = async (req: NextRequest): Promise<number> => {
    const { userId } = getAuth(req); // Get authenticated user ID
    console.log("Authenticated user ID:", userId); // Log userId

    if (!userId) {
        throw new Error("User not authenticated");
    }

    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: { userId }
    });

    let newCount = 1;

    if (userApiLimit) {
        newCount = userApiLimit.count + 1;
        await prismadb.userApiLimit.update({
            where: { userId },
            data: { count: newCount },
        }).catch(err => console.error("Update error:", err)); // Log update error
    } else {
        await prismadb.userApiLimit.create({
            data: { userId, count: newCount },
        }).catch(err => console.error("Create error:", err)); // Log create error
    }

    console.log("New API Limit Count:", newCount); // Log updated count
    return newCount;
};

// Function to check the current API limit
export const checkApiLimit = async (req: NextRequest): Promise<boolean> => {
    const { userId } = getAuth(req); // Use getAuth(req) to retrieve user ID

    if (!userId) {
        return false; // User not authenticated
    }

    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: { userId }
    });

    return !userApiLimit || userApiLimit.count < MAX_FREE_COUNTS; // Check if within limit
};

// Function to get the current API limit count
export const getApiLimitCount = async (req: NextRequest): Promise<number | null> => {
    const { userId } = getAuth(req); // Get authenticated user ID

    if (!userId) {
        return null; // or throw an error if you prefer
    }

    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: { userId }
    });

    return userApiLimit ? userApiLimit.count : null; // Return the count or null if not found
};
