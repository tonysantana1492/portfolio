"use client";

import { Chrome, Lock, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AuthPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess: ({ email }: { email: string }) => void;
}

export function AuthPopup({
  open,
  onOpenChange,
  onAuthSuccess,
}: AuthPopupProps) {
  const googleAuth = async () => {
    onAuthSuccess({ email: "tonysantana1492@gmail.com" });
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

          <Button onClick={googleAuth} className="h-12 w-full" size="lg">
            <Chrome className="mr-2 h-5 w-5" />
          </Button>

          <p className="text-center text-muted-foreground text-xs">
            By continuing, you accept our terms and conditions
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
