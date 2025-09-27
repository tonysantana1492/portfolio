interface ExportError {
  error: string;
}

interface ExportOptions {
  slug: string;
  format: "A4";
}

export async function exportToPdf(options: ExportOptions): Promise<Blob> {
  const response = await fetch("/api/export/pdf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    let errorMessage = "Unknown error occurred";

    try {
      const errorData: ExportError = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }

    throw new Error(errorMessage);
  }

  return response.blob();
}
