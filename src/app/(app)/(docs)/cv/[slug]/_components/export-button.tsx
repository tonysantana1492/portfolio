"use client";

import { useState } from "react";

import { DownloadCloudIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { downloadBlob } from "@/lib/download-blob";
import { exportToPdf } from "@/services/export-by-slug";

interface IDownloadProps {
  slug: string;
  fileName: string;
}

async function exportAndDownloadPdf({
  slug,
  fileName,
}: IDownloadProps): Promise<{
  name: string;
}> {
  const pdfBlob = await exportToPdf({ slug, format: "A4" });
  downloadBlob(pdfBlob, `${fileName}.pdf`);

  return { name: slug };
}

export function ExportButton({ slug, fileName }: IDownloadProps) {
  const [isLoading, setIsLoading] = useState(false);

  const downloadAsPdf = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const exportPromise = exportAndDownloadPdf({
        slug,
        fileName,
      });

      await toast.promise(exportPromise, {
        loading: "Exporting PDF...",
        success: () => {
          return `${fileName}.pdf has been downloaded successfully`;
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

  return (
    <Button
      variant="secondary"
      size="icon:sm"
      onClick={downloadAsPdf}
      disabled={isLoading}
    >
      <DownloadCloudIcon />
    </Button>
  );
}
