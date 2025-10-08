"use client";

import { useState } from "react";

import { Chrome, Lock, User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { UserCreate } from "@/dtos/user.dto";

interface AuthPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess: (userData: UserCreate) => void;
}

export function AuthPopup({
  open,
  onOpenChange,
  onAuthSuccess,
}: AuthPopupProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const simulateGoogleAuth = async () => {
    setIsAuthenticating(true);

    try {
      // Simulate authentication delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate data that Google Auth normally returns
      const mockGoogleUserData: UserCreate = {
        email: "user@example.com",
        name: "John Doe",
        picture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
        verified: true,
        googleId: "google-id-1234567890",
      };

      // Call the callback with user data
      onAuthSuccess(mockGoogleUserData);

      // Close the popup
      onOpenChange(false);
    } catch (error) {
      toast.error("Authentication error. Please try again.");
      console.error("Authentication error:", error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Authentication Required
          </DialogTitle>
          <DialogDescription>
            To create your profile, you need to authenticate with your Google
            account. This allows us to verify your identity and personalize your
            experience.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-4">
            <User className="h-8 w-8 text-muted-foreground" />
            <div className="flex-1">
              <h4 className="font-medium">Secure Data</h4>
              <p className="text-muted-foreground text-sm">
                We only use your basic information to create your profile
              </p>
            </div>
          </div>

          <Button
            onClick={simulateGoogleAuth}
            disabled={isAuthenticating}
            className="h-12 w-full"
            size="lg"
          >
            <Chrome className="mr-2 h-5 w-5" />
            {isAuthenticating ? "Authenticating..." : "Continue with Google"}
          </Button>

          <p className="text-center text-muted-foreground text-xs">
            By continuing, you accept our terms and conditions
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
