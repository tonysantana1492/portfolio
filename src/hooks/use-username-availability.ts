import { useCallback, useEffect, useRef, useState } from "react";

interface UsernameAvailabilityResult {
  isChecking: boolean;
  isAvailable: boolean | null;
  error: string | null;
}

export function useUsernameAvailability(username: string, delay = 500) {
  const [state, setState] = useState<UsernameAvailabilityResult>({
    isChecking: false,
    isAvailable: null,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkUsername = useCallback(async (usernameToCheck: string) => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!usernameToCheck || usernameToCheck.length < 3) {
      setState({
        isChecking: false,
        isAvailable: null,
        error: null,
      });
      return;
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    setState((prev) => ({
      ...prev,
      isChecking: true,
      error: null,
    }));

    try {
      const response = await fetch(
        `/api/username/check?username=${encodeURIComponent(usernameToCheck)}`,
        {
          signal: abortControllerRef.current.signal,
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to check username");
      }

      const data = await response.json();

      setState({
        isChecking: false,
        isAvailable: data.available,
        error: null,
      });
    } catch (error) {
      // Don't update state if request was aborted
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      setState({
        isChecking: false,
        isAvailable: null,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }, []);

  const debouncedCheckUsername = useCallback(
    (usernameToCheck: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        checkUsername(usernameToCheck);
      }, delay);
    },
    [checkUsername, delay],
  );

  useEffect(() => {
    debouncedCheckUsername(username);

    // Cleanup function to abort any pending requests and clear timeout
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [username, debouncedCheckUsername]);

  return state;
}
