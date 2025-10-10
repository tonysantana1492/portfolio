"use client";

import { useState } from "react";

import { toast } from "sonner";

import type { User } from "@/dtos/user.dto";
import { userService } from "@/services/user.service";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const authenticateWithGoogle = async ({
    email,
  }: {
    email: string;
  }): Promise<User | null> => {
    setIsLoading(true);
    const data = await userService.authenticateWithGoogle({ email });
    setIsLoading(false);

    if (data.user) {
      setUser(data.user);
      return data.user;
    }

    return null;
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
