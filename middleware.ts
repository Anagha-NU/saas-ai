import { NextResponse, NextRequest } from 'next/server';
import { clerkMiddleware } from "@clerk/nextjs/server";

// Define public routes
const publicRoutes = ["/", "/sign-in", "/sign-up", "/about", "/contact"];

// Check if a path is public
const isPublicRoute = (path: string) => {
  return publicRoutes.includes(path);
};

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { pathname } = req.nextUrl;

  // Check if the route is public
  if (!isPublicRoute(pathname)) {
    const user = await auth(); // Await the auth call to get user/session information

    // If there's no user, redirect to the sign-in page
    if (!user) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }
  
  // If the user is authenticated or the route is public, allow the request to proceed
  return NextResponse.next(); // Ensure this is included to allow the request to continue
});

// Configuration for the matcher
export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/api/(.*)', // Ensure all API routes are matched
  ],
};
