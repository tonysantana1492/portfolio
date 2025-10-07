"use client";

import { useState } from "react";

import { DownloadCloudIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { downloadBlob } from "@/lib/download-blob";
import { profileService } from "@/services/profile.service";

interface IDownloadProps {
  slug: string;
  fileName: string;
}

export function ExportButton({ slug, fileName }: IDownloadProps) {
  const [isLoading, setIsLoading] = useState(false);

  const downloadAsPdf = async () => {
    if (isLoading) return;

    setIsLoading(true);

    const toastId = toast.loading("Exporting PDF...");

    try {
      const pdfBlob = await profileService.exportToPdf({ slug, format: "A4" });
      const url = downloadBlob(pdfBlob, `${fileName}.pdf`, false);

      toast.success(`${fileName}.pdf has been downloaded successfully`, {
        id: toastId,
      });

      toast.success("PDF ready and downloaded", {
        id: toastId,
        description: fileName,
        action: {
          label: "Open PDF",
          onClick: () => {
            const win = window.open(url, "_blank", "noopener,noreferrer");
            if (!win) {
              const link = document.createElement("a");
              link.href = url;
              link.target = "_blank";
              document.body.appendChild(link);
              link.click();
              link.remove();
            }
          },
        },
        onDismiss: () => URL.revokeObjectURL(url),
      });

      setTimeout(() => URL.revokeObjectURL(url), 1000 * 60 * 1);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to export PDF";
      return `Export failed: ${errorMessage}`;
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
