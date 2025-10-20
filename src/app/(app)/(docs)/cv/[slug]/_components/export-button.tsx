"use client";

import { useState } from "react";

import { DownloadCloudIcon, type LucideIcon } from "lucide-react";

import { ButtonWithTooltip } from "@/components/shared/button-with-tooltip";
import type { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { downloadBlob } from "@/lib/download-blob";
import { exportToPdf } from "@/services/export-by-slug";

interface IDownloadProps {
  slug: string;
  fileName: string;
  icon?: LucideIcon;
  text?: string;
}

export function ExportButton({
  slug,
  fileName,
  className,
  icon: Icon = DownloadCloudIcon,
  text,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof Button> & IDownloadProps) {
  const [isLoading, setIsLoading] = useState(false);

  const downloadAsPdf = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const toastId = toast.loading("Exporting PDF...");
      const pdfBlob = await exportToPdf({ slug, format: "A4" });
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
      console.error("PDF export error:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Failed to export PDF";

      toast.error("Export failed", {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ButtonWithTooltip
      variant={variant ?? "secondary"}
      size={size ?? "icon:sm"}
      onClick={downloadAsPdf}
      disabled={isLoading}
      className={className}
      tooltipText="Download Resume"
      {...props}
    >
      <Icon />
      {text}
    </ButtonWithTooltip>
  );
}
