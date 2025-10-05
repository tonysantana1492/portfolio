import { type NextRequest, NextResponse } from "next/server";

export async function middleware(_request: NextRequest) {
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
    "/((?!api|_next/static|_next/image|favicon.ico|sw|images|.well-known|manifest.webmanifest).*)",
  ],
};
