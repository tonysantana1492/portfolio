"use client";

import { useState } from "react";

import { DownloadCloudIcon } from "lucide-react";

import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/sonner";

// Types for better type safety
interface ExportResponse {
  url: string;
}

interface ExportError {
  error: string;
}

interface ExportOptions {
  slug: string;
  format: "A4";
}

// Service functions for PDF export
async function exportToPdf(options: ExportOptions): Promise<Blob> {
  const response = await fetch("/api/export/pdf", {
    method: "GET",
    // headers: {
    //   "Content-Type": "application/json",
    // },
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

// Service functions for Word export
async function exportToWord(options: ExportOptions): Promise<ExportResponse> {
  const response = await fetch("/api/export/word", {
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

  return response.json();
}

function downloadFile(url: string, filename: string): void {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function exportAndDownloadPdf(slug: string): Promise<{ name: string }> {
  const pdfBlob = await exportToPdf({ slug, format: "A4" });
  downloadBlob(pdfBlob, `${slug}.pdf`);

  return { name: slug };
}

async function exportAndDownloadWord(slug: string): Promise<{ name: string }> {
  const exportData = await exportToWord({ slug, format: "A4" });
  downloadFile(exportData.url, `${slug}.docx`);

  return { name: slug };
}

export function ExportButton({ slug }: { slug: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const downloadAsPdf = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const exportPromise = exportAndDownloadPdf(slug);

      await toast.promise(exportPromise, {
        loading: "Exporting PDF...",
        success: (data) => {
          return `${data.name}.pdf has been downloaded successfully`;
        },
        error: (error) => {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to export PDF";
          return `Export failed: ${errorMessage}`;
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadAsWord = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const exportPromise = exportAndDownloadWord(slug);

      await toast.promise(exportPromise, {
        loading: "Exporting Word...",
        success: (data) => {
          return `${data.name}.docx has been downloaded successfully`;
        },
        error: (error) => {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to export Word";
          return `Export failed: ${errorMessage}`;
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon:sm">
          <DownloadCloudIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
        <DropdownMenuItem onClick={downloadAsPdf} disabled={isLoading}>
          <Icons.pdf />
          Pdf
        </DropdownMenuItem>
        <DropdownMenuItem onClick={downloadAsWord} disabled={isLoading}>
          <Icons.pdf />
          Word
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
