class SubdomainService {
  async validateSubdomain(
    slug: string,
    signal: AbortSignal
  ): Promise<{ available: boolean; slug: string }> {
    const response = await fetch(
      `/api/subdomains/slug/${encodeURIComponent(slug)}/validate`,
      {
        signal,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || "Failed to check slug");
    }

    const data = await response.json();
    return data;
  }

  async validateSocialNetwork(
    { network, username }: { network: string; username: string },
    signal: AbortSignal
  ): Promise<{ isValid: boolean; profileExists: boolean }> {
    const response = await fetch(
      `/api/social-network/validate?network=${encodeURIComponent(
        network
      )}&username=${encodeURIComponent(username)}`,
      {
        signal,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error.message || "Failed to check social network"
      );
    }

    const result = await response.json();

    return result;
  }
}

export const subdomainService = new SubdomainService();
