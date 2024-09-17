// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabase } from "./lib/supabaseClient"; // Import supabase client

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  // Bypass middleware for paths like "/login" or "/register"
  if (pathname.startsWith("/") || pathname.startsWith("/register")) {
    return res;
  }

  try {
    // Check session (authenticated user)
    const { data: session } = await supabase.auth.getSession();

    if (!session?.session) {
      // If no session, redirect to login page
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  } catch (error) {
    console.error("Error checking authentication: ", error);
    // Optionally redirect to an error page or logout in case of unexpected error
  }

  return res; // Allow access if session exists
}

export const config = {
  matcher: ["/", "/dashboard/:path*"], // Specify routes to protect
};
