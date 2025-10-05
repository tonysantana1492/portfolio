import { CheckCircle, Loader2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

interface UsernameStatusIndicatorProps {
  isChecking: boolean;
  isAvailable: boolean | null;
  error: string | null;
  username: string;
  formError?: string;
}

export function UsernameStatusIndicator({
  isChecking,
  isAvailable,
  error,
  username,
  formError,
}: UsernameStatusIndicatorProps) {
  const baseClasses = "flex items-center gap-2 text-xs";

  // Form errors have priority over availability checks
  if (formError) {
    return (
      <div className={cn(baseClasses, "text-destructive")}>
        <XCircle className="h-4 w-4" />
        <span>{formError}</span>
      </div>
    );
  }

  if (!username || username.length < 3)
    return (
      <div className={cn(baseClasses, "text-muted-foreground")}>
        <span>Only lowercase letters, numbers and hyphens</span>
      </div>
    );

  if (isChecking) {
    return (
      <div className={cn(baseClasses, "text-muted-foreground")}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Checking availability...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn(baseClasses, "text-destructive")}>
        <XCircle className="h-4 w-4" />
        <span>{error}</span>
      </div>
    );
  }

  if (isAvailable === true) {
    return (
      <div className={cn(baseClasses, "text-green-600")}>
        <CheckCircle className="h-4 w-4" />
        <span>{username}.lets0.com is available!</span>
      </div>
    );
  }

  if (isAvailable === false) {
    return (
      <div className={cn(baseClasses, "text-destructive")}>
        <XCircle className="h-4 w-4" />
        <span>{username}.lets0.com is already taken</span>
      </div>
    );
  }

  return (
    <div className={cn(baseClasses, "text-muted-foreground")}>
      <span>Only lowercase letters, numbers and hyphens</span>
    </div>
  );
}
