"use client"; // Mark as client component

import { ClerkProvider, RedirectToSignIn } from "@clerk/nextjs"; // Import ClerkProvider
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [apiLimitCount, setApiLimitCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiLimitCount = async () => {
      try {
        const response = await fetch("/api/limit"); // Fetch from your API route
        if (!response.ok) {
          const errorData = await response.json(); // Attempt to get error details
          throw new Error(
            `Failed to fetch API limit count: ${
              errorData.error || "Unknown error"
            }`
          );
        }
        const data = await response.json();
        setApiLimitCount(data.apiLimitCount); // Set the count from API response
      } catch (err: any) {
        console.error("Error fetching API limit count:", err);
        setError(err.message || "Failed to fetch API limit count"); // Capture the error message
      } finally {
        setLoading(false);
      }
    };

    fetchApiLimitCount(); // Call the function to fetch API limit count
  }, []);

  return (
    <ClerkProvider dynamic>
      <div className="h-full relative">
        {/* Sidebar (only visible on larger screens) */}
        <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-gray-900">
          {loading ? (
            <p className="text-white">Loading...</p> // Loading message styled
          ) : error ? (
            <p className="text-red-500">{error}</p> // Display error message
          ) : (
            // Pass apiLimitCount prop to Sidebar
            <Sidebar apiLimitCount={apiLimitCount} />
          )}
        </div>
        {/* Main content area */}
        <main className="md:pl-72">
          <Navbar />
          {children}
        </main>
      </div>
    </ClerkProvider>
  );
};

export default DashboardLayout;
