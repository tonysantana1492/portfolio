class SubdomainService {
  async validateSubdomain(slug: string, signal: AbortSignal) {
    const response = await fetch(
      `/api/subdomains/slug/${encodeURIComponent(slug)}/validate`,
      {
        signal,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to check slug");
    }

    const data = await response.json();
    return data;
  }
}

export const subdomainService = new SubdomainService();
