"use client";

import { useMemo, useRef } from "react";

import { useTheme } from "next-themes";
import { QRCode } from "react-qrcode-logo";

import { getSiteInfo } from "@/config/site.config";
import type { Profile } from "@/dtos/profile.dto";
import { generateVCard } from "@/lib/v-card";

export type VCardQRProps = {
  profile: Profile;
  size?: number;
  showDownloadButtons?: boolean;
};

export function VCardQR({
  profile,
  size = 220,
  className,
  showDownloadButtons = true,
}: React.ComponentProps<"div"> & VCardQRProps) {
  const { resolvedTheme } = useTheme();

  const siteInfo = getSiteInfo(profile);
  const vcardString = generateVCard(profile);
  const firstName = profile.firstName;
  const lastName = profile.lastName;

  const vcfDataHref = useMemo(
    () => `data:text/vcard;charset=utf-8,${encodeURIComponent(vcardString)}`,
    [vcardString]
  );

  const svgRef = useRef<SVGSVGElement | null>(null);

  const downloadPng = () => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const xml = new XMLSerializer().serializeToString(svg);
    const svg64 = window.btoa(unescape(encodeURIComponent(xml)));
    const image64 = `data:image/svg+xml;base64,${svg64}`;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);

      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = `vcard_${firstName}_${lastName}.png`;
      a.click();
    };
    img.src = image64;
  };

  return (
    <div className={className}>
      <QRCode
        value={`${siteInfo.url}/vcard`}
        size={size}
        fgColor={resolvedTheme === "dark" ? "white" : "black"}
        bgColor="transparent"
        qrStyle="dots"
        eyeRadius={20}
      />

      {showDownloadButtons && (
        <div className="mt-3 flex items-center gap-2">
          <a
            href={vcfDataHref}
            download={`contact_${firstName}_${lastName}.vcf`}
            className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
          >
            Download vCard (.vcf)
          </a>
          <button
            type="button"
            onClick={downloadPng}
            className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
          >
            Download QR (.png)
          </button>
        </div>
      )}
    </div>
  );
}
