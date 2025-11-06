import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;
  const userRole = token?.role as string | undefined;

  // If the user is authenticated and tries to access login or register, redirect based on role
  if (token && (pathname === "/login" || pathname === "/register")) {
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL("/shop", req.url));
    }
  }

  // Dashboard is only for admins
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/shop", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/shop/:path*", "/login", "/register"],
};
