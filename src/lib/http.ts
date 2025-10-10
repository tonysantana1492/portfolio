import { NextResponse } from "next/server";

export function jsonOk<T>({
  data,
  status,
}: {
  data: T;
  status?: number | ResponseInit;
}) {
  const initObj =
    typeof status === "number" ? { status } : status ?? { status: 200 };
  return NextResponse.json({ ok: true, ...(data as object) }, initObj);
}

export function jsonError({
  message,
  detail,
  status = 400,
  type = "about:blank",
}: {
  message: string;
  detail?: unknown;
  status?: number;
  type?: string;
}) {
  return NextResponse.json(
    { ok: false, error: { type, message, status, detail } },
    { status }
  );
}
