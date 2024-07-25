// middleware.js

// Import necessary modules
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Define URL matcher configurations
export const config = {
  matcher: [
    "/dashboard/user/:path*",
    "/dashboard/admin/:path*",
    "/api/user/:path*",
    "/api/admin/:path*",
  ],
};

// Define middleware function using withAuth
export default withAuth(
  async function middleware(req) {
    // Extract URL path and user role from token
    const url = req.nextUrl.pathname;
    const userRole = req?.nextauth?.token?.user?.role;

    // Redirect if user tries to access admin routes without admin role
    if (url?.includes("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    // Additional configurations for withAuth
    callbacks: {
      authorized: ({ token }) => {
        // Ensure there is a valid token for authorization
        if (!token) {
          return false; // Deny access if no token
        }
        return true; // Allow access if token exists
      },
    },
  }
);
