import { NextResponse } from "next/server";

import { PROFILE } from "@/content/profile";

export async function POST() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock scraped data
    const mockProfile = PROFILE;

    return NextResponse.json(mockProfile);
  } catch {
    return NextResponse.json(
      { error: "Error processing LinkedIn profile" },
      { status: 500 }
    );
  }
}
