import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Remove trailing slash for all paths except root
  if (url.pathname !== "/" && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.slice(0, -1);
    return NextResponse.redirect(url, 301);
  }

  // Ensure www redirect to non-www
  if (url.hostname.startsWith("www.")) {
    url.hostname = url.hostname.slice(4);
    return NextResponse.redirect(url, 301);
  }

  // Handle duplicate URLs with query parameters
  if (
    url.searchParams.has("fbclid") ||
    url.searchParams.has("gclid") ||
    url.searchParams.has("utm_source")
  ) {
    // Remove tracking parameters and redirect
    const cleanUrl = new URL(url.pathname, url.origin);
    return NextResponse.redirect(cleanUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sw.js (service worker)
     * - manifest.webmanifest (PWA manifest)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest|images/).*)",
  ],
};
