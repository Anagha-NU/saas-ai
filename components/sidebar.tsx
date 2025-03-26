"use client";

import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { usePathname } from "next/navigation"; 
import { cn } from "@/lib/utils";

import {
  Code,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Settings,
} from "lucide-react";
import { FreeCounter } from "./free-counter";

// Define the font
const montserrat = Montserrat({
  weight: "600",
  subsets: ["latin"],
});

// Define the routes
const routes = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5 mr-3 text-sky-500" />,
    href: "/dashboard",
  },
  {
    label: "Conversation",
    icon: <MessageSquare className="h-5 w-5 mr-3 text-violet-500" />,
    href: "/dashboard/conversation",
  },
  {
    label: "Image Generation",
    icon: <ImageIcon className="h-5 w-5 mr-3 text-violet-500" />,
    href: "/dashboard/image-generation",
  },
  {
    label: "Code Generation",
    icon: <Code className="h-5 w-5 mr-3 text-green-700" />,
    href: "/dashboard/code-generation",
  },
  {
    label: "Settings",
    icon: <Settings className="h-5 w-5 mr-3 text-gray-700" />,
    href: "/settings",
  },
];

// Define the props interface for the Sidebar component
interface SidebarProps {
  apiLimitCount: number; // Define the expected prop type
}

// Define the Sidebar component with typed props
const Sidebar: React.FC<SidebarProps> = ({ apiLimitCount }) => {
  const pathname = usePathname(); 

  return (
    <div className="min-h-screen flex">
      <div className="w-64 flex flex-col h-full bg-[#111827] text-white">
        
        {/* Sidebar content area */}
        <div className="flex flex-col flex-grow"> 
          <Link href="/dashboard" className="flex items-center pl-3 mb-14">
            <div className="relative w-8 h-8 mr-4">
              <Image fill alt="Logo" src="/logo.png" />
            </div>
            <h1 className={`text-2xl font-bold ${montserrat.className}`}>
              Genius
            </h1>
          </Link>

          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                href={route.href}
                key={route.href}
                aria-label={route.label}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                  pathname.startsWith(route.href) // Match sub-routes
                    ? "text-white bg-white/10"
                    : "text-zinc-400"
                )}
              >
                <div className="flex items-center flex-1">
                  {route.icon}
                  {route.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        
        
      </div>
    </div>
  );
};

export default Sidebar;
