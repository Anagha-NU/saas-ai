import {
    Avatar,
    AvatarFallback,
    AvatarImage
  } from "@/components/ui/avatar";
  import { useUser } from "@clerk/nextjs";
  
  export const UserAvatar = () => {
    const { user } = useUser();
  
    // Use imageUrl instead of profileImageUrl
    const profileImageUrl = user?.imageUrl;
  
    return (
      <Avatar className="h-8 w-8">
        {profileImageUrl ? (
          <AvatarImage src={profileImageUrl} />
        ) : (
          <AvatarFallback>
            {user?.firstName?.charAt(0)}
            {user?.lastName?.charAt(0)}
          </AvatarFallback>
        )}
      </Avatar>
    );
  };
