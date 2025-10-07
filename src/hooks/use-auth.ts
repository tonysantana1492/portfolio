"use client";

import { useState } from "react";

import { toast } from "sonner";

import type { GoogleUserData } from "@/components/auth/auth-popup";
import type { User } from "@/dtos/user.dto";
import { userService } from "@/services/user.service";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const authenticateWithGoogle = async (
    googleUserData: GoogleUserData,
  ): Promise<User | null> => {
    setIsLoading(true);

    try {
      const data = await userService.authenticateWithGoogle(googleUserData);

      if (data.success && data.user) {
        setUser(data.user);
        return data.user;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Authentication failed. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    toast.success("Session closed successfully");
  };

  return {
    user,
    isLoading,
    authenticateWithGoogle,
    logout,
    isAuthenticated: !!user,
  };
}
