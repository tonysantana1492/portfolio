"use client";

import { useState } from "react";

import { toast } from "sonner";

import type { GoogleUserData } from "@/components/auth/auth-popup";

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  verified: boolean;
  createdAt: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const authenticateWithGoogle = async (
    googleUserData: GoogleUserData
  ): Promise<User | null> => {
    setIsLoading(true);

    try {
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

      if (data.success && data.user) {
        setUser(data.user);
        toast.success("¡Usuario autenticado y creado exitosamente!");
        return data.user;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Error en la autenticación. Inténtalo de nuevo.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    toast.success("Sesión cerrada exitosamente");
  };

  return {
    user,
    isLoading,
    authenticateWithGoogle,
    logout,
    isAuthenticated: !!user,
  };
}
