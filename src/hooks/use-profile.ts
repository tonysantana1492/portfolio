import { useEffect, useState } from "react";

import type { IProfile } from "@/content/profile";
import { PROFILE } from "@/content/profile"; // Fallback

interface UseProfileReturn {
  profile: IProfile | null;
  loading: boolean;
  error: string | null;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/profile");

        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }

        const profileData = await response.json();
        setProfile(profileData);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        // Fallback to static PROFILE if there's an error
        setProfile(PROFILE);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  return { profile, loading, error };
}
