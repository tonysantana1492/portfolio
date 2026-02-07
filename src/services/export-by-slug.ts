interface ExportError {
  error: string;
  details?: string;
}

interface ExportOptions {
  slug: string;
  format: "A4";
}

export async function exportToPdf(options: ExportOptions): Promise<Blob> {
  const response = await fetch(`/api/export/pdf?slug=${encodeURIComponent(options.slug)}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    let errorMessage = "Unknown error occurred";
    let errorDetails = "";

    try {
      const errorData: ExportError = await response.json();
      errorMessage = errorData.error || errorMessage;
      errorDetails = errorData.details || "";
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }

    const fullError = errorDetails ? `${errorMessage} - ${errorDetails}` : errorMessage;

    throw new Error(fullError);
  }

  const blob = await response.blob();

  // Validate that we got a proper PDF
  if (!blob || blob.size === 0) {
    throw new Error("Received empty PDF response");
  }

  if (blob.type !== "application/pdf") {
    throw new Error(`Expected PDF but received ${blob.type}`);
  }

  return blob;
}
