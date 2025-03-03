// Middleware for route protection
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { AUTH_COOKIE_NAME } from "@/lib/cookies"

// Define public paths that don't require authentication
const publicPaths = ["/", "/login", "/signup"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is a dashboard path
  const isDashboardPath = pathname.startsWith("/dashboard")

  // Get the authentication token from cookies
  const authToken = request.cookies.get(AUTH_COOKIE_NAME)?.value

  // If trying to access dashboard without auth, redirect to login
  if (isDashboardPath && !authToken) {
    const url = new URL("/login", request.url)
    url.searchParams.set("from", pathname)
    return NextResponse.redirect(url)
  }

  // If authenticated and trying to access login/signup, redirect to dashboard
  if (authToken && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard/repository/documentrepo", request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

