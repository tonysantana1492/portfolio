export function downloadBlob(blob: Blob, filename: string, revokeUrl: boolean = true): string {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);

  if (revokeUrl) {
    URL.revokeObjectURL(url);
  }

  return url;
}
