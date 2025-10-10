import type { User } from "@/dtos/user.dto";

export class UserService {
  async authenticateWithGoogle({
    email,
  }: {
    email: string;
  }): Promise<{ user: User }> {
    const response = await fetch("/api/users/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || "Authentication failed");
    }

    const result = await response.json();
    return result.data;
  }
}

export const userService = new UserService();
