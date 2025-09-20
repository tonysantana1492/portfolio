import { formatPhone } from "@/lib/libphonenumber";

export function encodeEmail(email: string) {
  return btoa(email);
}

export function decodeEmail(email: string) {
  return atob(email);
}

export function encodePhoneNumber(phone: string) {
  return btoa(phone);
}

export function decodePhoneNumber(phone: string) {
  return atob(phone);
}

export function formatPhoneNumber(phone: string) {
  return formatPhone(phone);
}
