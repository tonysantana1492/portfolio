import { PROFILE } from "@/content/profile";
import { jsonError, jsonOk } from "@/lib/http";

export async function POST() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock scraped data
    const mockProfile = PROFILE;

    return jsonOk({ data: mockProfile });
  } catch {
    return jsonError({
      message: "Error processing LinkedIn profile",
      status: 500,
    });
  }
}
