import { useCallback, useEffect, useRef, useState } from "react";

import { subdomainService } from "@/services/subdomain.service";

interface SocialUrlValidationResult {
  isChecking: boolean;
  isValid: boolean | null;
  error: string | null;
  profileExists?: boolean;
}

export function useSocialUrlValidation(
  socialNetwork: string,
  socialUsername: string,
  delay = 800
) {
  const [state, setState] = useState<SocialUrlValidationResult>({
    isChecking: false,
    isValid: null,
    error: null,
    profileExists: undefined,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const validateSocialUrl = useCallback(
    async (network: string, username: string) => {
      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      if (!network || !username || username.trim().length === 0) {
        setState({
          isChecking: false,
          isValid: null,
          error: null,
          profileExists: undefined,
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
        const { isValid, profileExists } =
          await subdomainService.validateSocialNetwork(
            { network, username },
            abortControllerRef.current.signal
          );

        setState({
          isChecking: false,
          isValid,
          error: null,
          profileExists,
        });
      } catch (error) {
        // Don't update state if request was aborted
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setState({
          isChecking: false,
          isValid: false,
          error: error instanceof Error ? error.message : "Unknown error",
          profileExists: undefined,
        });
      }
    },
    []
  );

  const debouncedValidateSocialUrl = useCallback(
    (network: string, username: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        validateSocialUrl(network, username);
      }, delay);
    },
    [validateSocialUrl, delay]
  );

  useEffect(() => {
    debouncedValidateSocialUrl(socialNetwork, socialUsername);

    // Cleanup function to abort any pending requests and clear timeout
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [socialNetwork, socialUsername, debouncedValidateSocialUrl]);

  return state;
}
