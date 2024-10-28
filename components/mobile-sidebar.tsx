import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";

// Define the props interface
interface MobileSidebarProps {
  apiLimitCount: number; // Prop to receive the API limit count
}

const MobileSidebar = ({ apiLimitCount }: MobileSidebarProps) => {
  // Manage client-side rendering
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        {/* Pass apiLimitCount to Sidebar */}
        <Sidebar apiLimitCount={apiLimitCount} />
        <div className="p-4">API Limit: {apiLimitCount}</div> {/* Display apiLimitCount */}
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
