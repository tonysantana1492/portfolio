import {
  AsYouType,
  isValidPhoneNumber,
  parsePhoneNumber,
} from "libphonenumber-js/min";

export function formatPhone(
  input: string,
  defaultCountry: import("libphonenumber-js").CountryCode = "US",
  style: "international" | "national" | "e164" = "international",
): string {
  try {
    const p = parsePhoneNumber(input, defaultCountry);
    if (!p) return input.trim();
    switch (style) {
      case "national":
        return p.formatNational();
      case "e164":
        return p.number; // E.164 canonical
      default:
        return p.formatInternational();
    }
  } catch {
    return input.trim();
  }
}

export { isValidPhoneNumber, AsYouType };
