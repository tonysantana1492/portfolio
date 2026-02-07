import Link from "next/link";

import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
          <WifiOff className="h-10 w-10 text-orange-600 dark:text-orange-400" />
        </div>

        <h1 className="mb-4 font-bold text-2xl">You're Offline</h1>

        <p className="mb-8 max-w-md text-muted-foreground">
          It looks like you've lost your internet connection. You can still browse previously
          visited pages while offline.
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 font-medium text-primary-foreground text-sm hover:bg-primary/90"
          >
            Go to Homepage
          </Link>

          <p className="text-muted-foreground text-sm">
            You'll be automatically redirected when your connection is restored.
          </p>
        </div>
      </div>
    </div>
  );
}
