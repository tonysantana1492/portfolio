"use client";

import { useState } from "react";

import { DownloadCloudIcon, type LucideIcon } from "lucide-react";

import { ButtonWithTooltip } from "@/components/shared/button-with-tooltip";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { downloadBlob } from "@/lib/download-blob";
import { exportToPdf } from "@/services/export-by-slug";

interface IDownloadProps {
  slug: string;
  fileName: string;
  icon?: LucideIcon;
  text?: string;
  tooltipText?: string;
}

export function ExportButton({
  slug,
  fileName,
  className,
  tooltipText,
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

      // Make sure we have a slug
      if (!slug) {
        throw new Error("No document slug provided");
      }

      // const pdfBlob = await exportToPdf({ slug, format: "A4" });

      // if (!pdfBlob || pdfBlob.size === 0) {
      //   throw new Error("Generated PDF is empty");
      // }

      // const url = downloadBlob(pdfBlob, `${fileName}.pdf`, false);

      const element = document.createElement("a");
      element.href = `/tony-santana.pdf`;
      element.download = `${fileName}.pdf`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      const url = element.href;

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

  if (tooltipText) {
    return (
      <ButtonWithTooltip
        variant={variant ?? "secondary"}
        size={size ?? "icon:sm"}
        onClick={downloadAsPdf}
        disabled={isLoading}
        className={className}
        tooltipText={tooltipText}
        {...props}
        aria-label="Export as PDF"
      >
        <Icon />
        {text}
      </ButtonWithTooltip>
    );
  }

  return (
    <Button
      variant={variant ?? "secondary"}
      onClick={downloadAsPdf}
      disabled={isLoading}
      className={className}
      size={size}
      {...props}
    >
      <Icon />
      {text}
    </Button>
  );
}
