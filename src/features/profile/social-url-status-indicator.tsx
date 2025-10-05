import { AlertCircle, CheckCircle, Loader2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

interface SocialUrlStatusIndicatorProps {
  isChecking: boolean;
  isValid: boolean | null;
  error: string | null;
  profileExists?: boolean;
  socialUsername: string;
  formError?: string;
  className?: string;
}

export function SocialUrlStatusIndicator({
  isChecking,
  isValid,
  error,
  profileExists,
  socialUsername,
  formError,
  className,
}: SocialUrlStatusIndicatorProps) {
  // Don't show anything if username is too short or empty
  if (!socialUsername || socialUsername.trim().length === 0) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-xs",
          "text-muted-foreground"
        )}
      >
        <span>Only lowercase letters, numbers and hyphens</span>
      </div>
    );
  }

  // Show form validation error if present
  if (formError) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-destructive text-xs",
          className
        )}
      >
        <XCircle className="h-4 w-4" />
        <span>{formError}</span>
      </div>
    );
  }

  // Show loading state
  if (isChecking) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-muted-foreground text-xs",
          className
        )}
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Validating social profile...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-destructive text-xs",
          className
        )}
      >
        <XCircle className="h-4 w-4" />
        <span>{error}</span>
      </div>
    );
  }

  // Show invalid state
  if (isValid === false) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-destructive text-xs",
          className
        )}
      >
        <XCircle className="h-4 w-4" />
        <span>Invalid username format</span>
      </div>
    );
  }

  // Show valid state
  if (isValid === true) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-xs",
          profileExists ? "text-green-600" : "text-orange-600",
          className
        )}
      >
        {profileExists ? (
          <>
            <CheckCircle className="h-4 w-4" />
            <span>Profile found and username is valid</span>
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4" />
            <span>Username format is valid, but profile may not exist</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn("flex items-center gap-2 text-xs", "text-muted-foreground")}
    >
      <span>Only lowercase letters, numbers and hyphens</span>
    </div>
  );
}
