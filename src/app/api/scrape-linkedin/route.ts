import { NextResponse } from "next/server";

import { PROFILE } from "@/content/profile";

export async function POST() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Extract username from LinkedIn URL
    // const usernameMatch = linkedinUrl.match(/linkedin\.com\/in\/([^/]+)/);
    // const linkedinUsername = usernameMatch ? usernameMatch[1] : "user";

    // Mock scraped data
    const mockProfile = PROFILE;

    return NextResponse.json(mockProfile);
  } catch {
    return NextResponse.json(
      { error: "Error processing LinkedIn profile" },
      { status: 500 },
    );
  }
}
