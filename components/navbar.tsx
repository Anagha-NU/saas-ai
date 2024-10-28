"use client";

import { UserButton } from "@clerk/nextjs";
import MobileSidebar from "@/components/mobile-sidebar";
import { useEffect, useState } from "react";

const Navbar = () => {
    const [apiLimitCount, setApiLimitCount] = useState<number | null>(null);

    useEffect(() => {
        const fetchApiLimitCount = async () => {
            try {
                const response = await fetch('/api/limit'); // Call the API route
                const data = await response.json();
                setApiLimitCount(data.apiLimitCount); // Update state with fetched data
            } catch (error) {
                console.error("Failed to fetch API limit count:", error);
            }
        };

        fetchApiLimitCount(); // Invoke the data fetching function
    }, []);

    return (
        <div className="flex items-center p-4">
            <MobileSidebar apiLimitCount={apiLimitCount !== null ? apiLimitCount : 0} />
            <div className="flex w-full justify-end">
                <UserButton afterSignOutUrl="/" />
            </div>
      
        </div>
    );
};

export default Navbar;