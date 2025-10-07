import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Mapping of social networks to their validation patterns
const SOCIAL_VALIDATION_PATTERNS = {
  "https://linkedin.com/in/": {
    pattern: /^[a-zA-Z0-9-]+$/,
    minLength: 3,
    maxLength: 100,
    invalidChars: /[<>:"/|?*\s]/,
  },
  "https://github.com/": {
    pattern: /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/,
    minLength: 1,
    maxLength: 39,
    invalidChars: /^-|-$|--/,
  },
  "https://twitter.com/": {
    pattern: /^[a-zA-Z0-9_]+$/,
    minLength: 1,
    maxLength: 15,
    invalidChars: /^_|_$/,
  },
  "https://x.com/": {
    pattern: /^[a-zA-Z0-9_]+$/,
    minLength: 1,
    maxLength: 15,
    invalidChars: /^_|_$/,
  },
  "https://instagram.com/": {
    pattern: /^[a-zA-Z0-9._]+$/,
    minLength: 1,
    maxLength: 30,
    invalidChars: /^\.|\.$|\.{2,}/,
  },
  "https://facebook.com/": {
    pattern: /^[a-zA-Z0-9.]+$/,
    minLength: 5,
    maxLength: 50,
    invalidChars: /^\.|\.$|\.{2,}/,
  },
  "https://youtube.com/": {
    pattern: /^[a-zA-Z0-9_-]+$/,
    minLength: 1,
    maxLength: 100,
    invalidChars: /^-|_$|-$/,
  },
  "https://dribbble.com/": {
    pattern: /^[a-zA-Z0-9_-]+$/,
    minLength: 1,
    maxLength: 20,
    invalidChars: /^[_-]|[_-]$/,
  },
  "https://behance.net/": {
    pattern: /^[a-zA-Z0-9_-]+$/,
    minLength: 1,
    maxLength: 30,
    invalidChars: /^[_-]|[_-]$/,
  },
  "https://medium.com/@": {
    pattern: /^[a-zA-Z0-9._-]+$/,
    minLength: 1,
    maxLength: 50,
    invalidChars: /^[._-]|[._-]$|[._-]{2,}/,
  },
  "https://dev.to/": {
    pattern: /^[a-zA-Z0-9_]+$/,
    minLength: 2,
    maxLength: 30,
    invalidChars: /^_|_$/,
  },
};

// Reserved usernames that are not allowed
const RESERVED_USERNAMES = [
  "admin",
  "api",
  "www",
  "mail",
  "ftp",
  "support",
  "help",
  "info",
  "contact",
  "about",
  "privacy",
  "terms",
  "blog",
  "news",
  "events",
  "careers",
  "jobs",
  "legal",
  "security",
  "dev",
  "test",
  "staging",
  "demo",
  "beta",
  "alpha",
  "null",
  "undefined",
  "error",
  "404",
  "403",
  "500",
  "home",
  "index",
  "login",
  "logout",
  "signup",
  "signin",
  "register",
  "dashboard",
  "settings",
  "profile",
  "account",
  "user",
  "users",
  "me",
  "self",
];

function validateUsername(
  network: string,
  username: string,
): {
  isValid: boolean;
  error?: string;
} {
  const config =
    SOCIAL_VALIDATION_PATTERNS[
      network as keyof typeof SOCIAL_VALIDATION_PATTERNS
    ];

  if (!config) {
    return { isValid: false, error: "Unsupported social network" };
  }

  // Check if username is reserved
  if (RESERVED_USERNAMES.includes(username.toLowerCase())) {
    return { isValid: false, error: "This username is reserved" };
  }

  // Check length
  if (username.length < config.minLength) {
    return {
      isValid: false,
      error: `Username must be at least ${config.minLength} characters`,
    };
  }

  if (username.length > config.maxLength) {
    return {
      isValid: false,
      error: `Username must be less than ${config.maxLength} characters`,
    };
  }

  // Check pattern
  if (!config.pattern.test(username)) {
    return {
      isValid: false,
      error: "Username contains invalid characters",
    };
  }

  // Check invalid character patterns
  if (config.invalidChars?.test(username)) {
    return {
      isValid: false,
      error: "Username format is not valid",
    };
  }

  return { isValid: true };
}

// Function to check if profile exists (basic check)
async function checkProfileExists(
  network: string,
  username: string,
): Promise<boolean> {
  // Note: This is a simplified check. In a real application, you might want to:
  // 1. Make actual HTTP requests to check if the profile exists
  // 2. Cache results to avoid rate limiting
  // 3. Handle different response codes from each platform

  try {
    const fullUrl = network + username;

    // For now, we'll do a basic HEAD request to check if the URL is accessible
    // This is just a basic implementation - you might want to enhance this
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 second timeout

    const response = await fetch(fullUrl, {
      method: "HEAD",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ProfileValidator/1.0)",
      },
    });

    clearTimeout(timeoutId);

    // Most social platforms return 200 for existing profiles and 404 for non-existing ones
    return response.status === 200;
  } catch {
    // If we can't check (CORS, network error, etc.), we'll assume it might exist
    // This is conservative approach to avoid false negatives
    return true;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const network = searchParams.get("network");
    const username = searchParams.get("username");

    if (!network || !username) {
      return NextResponse.json(
        { error: "Network and username are required" },
        { status: 400 },
      );
    }

    // Validate username format
    const validation = validateUsername(network, username);

    if (!validation.isValid) {
      return NextResponse.json({
        isValid: false,
        error: validation.error,
        profileExists: false,
      });
    }

    // Check if profile exists (optional - can be disabled if causing issues)
    let profileExists = false;
    try {
      profileExists = await checkProfileExists(network, username);
    } catch (error) {
      // If we can't check profile existence, we'll still return that the format is valid
      console.warn("Could not check profile existence:", error);
    }

    return NextResponse.json({
      isValid: true,
      profileExists,
      network,
      username,
    });
  } catch (error) {
    console.error("Social URL validation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
