import { type NextRequest, NextResponse } from "next/server";

import { ROOT_DOMAIN } from "@/config/app.config";

function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];

  // Validate inputs
  if (!url || !host || !hostname) {
    return null;
  }

  // Local development environment
  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    // Try to extract subdomain from the full URL
    const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
    if (fullUrlMatch?.[1]) {
      return fullUrlMatch[1];
    }

    // Fallback to host header approach
    if (hostname.includes(".localhost")) {
      const subdomain = hostname.split(".")[0];
      return subdomain && subdomain !== "localhost" ? subdomain : null;
    }

    return null;
  }

  // Production environment
  const rootDomainFormatted = ROOT_DOMAIN.split(":")[0];

  // Handle preview deployment URLs
  if (hostname.includes("---") && hostname.endsWith(".vercel.app")) {
    const parts = hostname.split("---");
    const subdomain = parts.length > 0 ? parts[0] : null;
    return subdomain && subdomain.trim() !== "" ? subdomain : null;
  }

  // Regular subdomain detection
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  if (isSubdomain) {
    const subdomain = hostname.replace(`.${rootDomainFormatted}`, "");
    return subdomain && subdomain.trim() !== "" ? subdomain : null;
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);

  // Debug logging
  if (process.env.NODE_ENV === "development") {
    console.log(
      "Middleware - pathname:",
      pathname,
      "subdomain:",
      subdomain,
      "host:",
      request.headers.get("host"),
    );
  }

  if (subdomain) {
    // Block access to admin page from subdomains
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // For the root path on a subdomain, rewrite to the subdomain page
    if (pathname.startsWith("/")) {
      const url = `/s/${subdomain}${pathname}`;

      if (process.env.NODE_ENV === "development") {
        console.log("Middleware - rewriting to:", url);
      }

      return NextResponse.rewrite(new URL(url, request.url));
    }
  }

  // On the root domain, allow normal access
  return NextResponse.next();
}

/*
 * Match all paths except for:
 * 1. /api routes
 * 2. /_next (Next.js internals)
 * 3. all root files inside /public (e.g. /favicon.ico)
 */
export const config = {
  matcher: [
    // Add specific patterns you want to match
    "/((?!api|_next/static|_next/image|favicon.ico|sw|images|.well-known).*)",
  ],
};
