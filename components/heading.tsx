import { cn } from "@/lib/utils";  // Utility for className conditionals
import { ReactElement } from "react";  // Import ReactElement type for typing the props

interface HeadingProps {
  title: string;
  description: string;
  icon: React.ElementType;  // Accepts a Lucide icon or any other React component
  iconColor?: string;
  bgColor?: string;
}

export const Heading = ({
  title,
  description,
  icon: Icon,  // This is the icon component passed in
  iconColor = "text-black",  // Default color if no iconColor is provided
  bgColor = "bg-gray-100",   // Default background color
}: HeadingProps): ReactElement => {
  return (
    <div className="px-4 lg:px-8 flex items-center gap-x-3 mb-8">
      {/* Icon container with background color */}
      <div className={cn("p-2 w-fit rounded-md", bgColor)}>
        {/* Render the passed icon component with dynamic className */}
        <Icon className={cn("w-10 h-10", iconColor)} />
      </div>
      <div>
        {/* Title */}
        <h2 className="text-3xl font-bold">
          {title}
        </h2>
        {/* Description */}
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
};
