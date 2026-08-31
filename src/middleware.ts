import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { JWTPayload, UserRole } from "./lib/types";

const JWT_SECRET = process.env.JWT_SECRET || "vanguard_rural_routing_secret_key_2026_super_secure";
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = "vanguard_auth_token";

const roleDashboardMap: Record<string, string> = {
  citizen: "/citizen/dashboard",
  worker: "/worker/dashboard",
  volunteer: "/volunteer/dashboard",
  authority: "/authority/dashboard",
};

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(COOKIE_NAME)?.value;

    let session: JWTPayload | null = null;
    if (token) {
      try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        if (payload && payload.userId && payload.role) {
          session = payload as unknown as JWTPayload;
        }
      } catch {
        session = null;
      }
    }

    // If user is already logged in and visits /login or /signup, redirect to their role dashboard
    if (session && (pathname === "/login" || pathname === "/signup")) {
      const target = roleDashboardMap[session.role] || "/citizen/dashboard";
      return NextResponse.redirect(new URL(target, request.url));
    }

    // Protected route prefixes
    const isCitizenRoute = pathname.startsWith("/citizen");
    const isWorkerRoute = pathname.startsWith("/worker");
    const isVolunteerRoute = pathname.startsWith("/volunteer");
    const isAuthorityRoute = pathname.startsWith("/authority");

    const isProtected = isCitizenRoute || isWorkerRoute || isVolunteerRoute || isAuthorityRoute;

    if (isProtected) {
      if (!session) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Role-specific enforcement
      const userDashboard = roleDashboardMap[session.role] || "/login";

      if (isCitizenRoute && session.role !== "citizen") {
        return NextResponse.redirect(new URL(userDashboard, request.url));
      }
      if (isWorkerRoute && session.role !== "worker") {
        return NextResponse.redirect(new URL(userDashboard, request.url));
      }
      if (isVolunteerRoute && session.role !== "volunteer") {
        return NextResponse.redirect(new URL(userDashboard, request.url));
      }
      if (isAuthorityRoute && session.role !== "authority") {
        return NextResponse.redirect(new URL(userDashboard, request.url));
      }
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Middleware error:", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
