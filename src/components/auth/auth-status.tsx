"use client";

import Image from "next/image";

import { LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function AuthStatus() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center gap-3 rounded-lg border bg-background/95 p-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            {user?.picture ? (
              <Image
                src={user.picture}
                alt={user.name}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <User className="h-4 w-4" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{user?.name}</span>
            <span className="text-muted-foreground text-xs">{user?.email}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="h-8 w-8 p-0"
          title="Cerrar sesión"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
