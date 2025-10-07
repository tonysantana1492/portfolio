import type { GoogleUserData } from "@/components/auth/auth-popup";

export class UserService {
  async authenticateWithGoogle(googleUserData: GoogleUserData) {
    const response = await fetch("/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ googleUserData }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Authentication failed");
    }

    const data = await response.json();
    return data;
  }
}

export const userService = new UserService();
