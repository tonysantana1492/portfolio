"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { LinkButton } from "./link-button";
import { useTheme } from "next-themes";
import { QRCode } from "react-qrcode-logo";
import { SITE_INFO } from "@/config/site.config";
import { PROFILE } from "@/content/profile";
import { generateVCard } from "@/lib/v-card";

export type VCardQRProps = {
  size?: number;
  className?: string;
};

export function VCardQR({ size = 220, className }: VCardQRProps) {
  const { resolvedTheme } = useTheme();

  const [vcardString, setVcardString] = useState("");

  useEffect(() => {
    setVcardString(generateVCard());
  }, []);

  const firstName = PROFILE.firstName;
  const lastName = PROFILE.lastName;

  const vcfDataHref = useMemo(
    () => `data:text/vcard;charset=utf-8,${encodeURIComponent(vcardString)}`,
    [vcardString],
  );

  // biome-ignore lint/suspicious/noExplicitAny: <explanation >
  const qrDownloadRef = useRef<any>(null);

  const downloadPng = () => {
    if (!qrDownloadRef.current) return;
    qrDownloadRef.current.download("png", `vcard_${firstName}_${lastName}`);
  };

  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsQRDialogOpen(true)}
        className="cursor-pointer transition-transform hover:scale-105"
      >
        <div className={className}>
          <QRCode
            value={`${SITE_INFO.url}/vcard`}
            size={size}
            fgColor={resolvedTheme === "dark" ? "white" : "black"}
            bgColor="transparent"
            qrStyle="dots"
            eyeRadius={20}
          />
        </div>
      </button>
      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Code</DialogTitle>
            <DialogDescription>
              Scan this QR code to save the contact information to your device
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-4 py-4">
            <QRCode
              value={`${SITE_INFO.url}/vcard`}
              size={280}
              fgColor={resolvedTheme === "dark" ? "white" : "black"}
              bgColor="transparent"
              qrStyle="dots"
              eyeRadius={20}
            />

            {/* QR oculto con fondo blanco para descargar */}
            <div className="sr-only">
              <QRCode
                ref={qrDownloadRef}
                value={`${SITE_INFO.url}/vcard`}
                size={280}
                fgColor="black"
                bgColor="white"
                qrStyle="dots"
                eyeRadius={20}
              />
            </div>

            <div className="mt-3 flex items-center gap-2">
              <LinkButton
                href={vcfDataHref}
                download={`contact_${firstName}_${lastName}.vcf`}
                className="rounded-lg border px-3 py-1 text-sm"
              >
                Download vCard (.vcf)
              </LinkButton>
              <Button onClick={downloadPng} className="rounded-lg border px-3 py-1 text-sm">
                Download QR (.png)
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
