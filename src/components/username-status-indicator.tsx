import { CheckCircle, Loader2, XCircle } from "lucide-react";

interface UsernameStatusIndicatorProps {
  isChecking: boolean;
  isAvailable: boolean | null;
  error: string | null;
  username: string;
}

export function UsernameStatusIndicator({
  isChecking,
  isAvailable,
  error,
  username,
}: UsernameStatusIndicatorProps) {
  if (!username || username.length < 3)
    return <span>Only lowercase letters, numbers and hyphens</span>;

  const baseClasses = "flex items-center gap-2 text-sm";

  if (isChecking) {
    return (
      <div className={`${baseClasses} text-muted-foreground`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Checking availability...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${baseClasses} text-destructive`}>
        <XCircle className="h-4 w-4" />
        <span>{error}</span>
      </div>
    );
  }

  if (isAvailable === true) {
    return (
      <div className={`${baseClasses} text-green-600`}>
        <CheckCircle className="h-4 w-4" />
        <span>{username}.lets0.com is available!</span>
      </div>
    );
  }

  if (isAvailable === false) {
    return (
      <div className={`${baseClasses} text-destructive`}>
        <XCircle className="h-4 w-4" />
        <span>{username}.lets0.com is already taken</span>
      </div>
    );
  }

  return <span>Only lowercase letters, numbers and hyphens</span>;
}
