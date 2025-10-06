// utils/navigateToSubdomain.ts
"use client";

type Options = {
  preservePath?: boolean; // if you want to keep the path /path?query#hash
};

export function navigateToSubdomain(subdomain: string, opts: Options = {}) {
  const { preservePath = false } = opts;
  if (typeof window === "undefined") return;

  const { protocol, hostname, port, pathname, search, hash } = window.location;

  const envRoot = process.env.NEXT_PUBLIC_ROOT_DOMAIN?.trim();

  const isLocal =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);

  let targetHost: string;
  let targetPort = "";

  if (envRoot) {
    targetHost = `${subdomain}.${envRoot}`;
  } else if (isLocal) {
    targetHost = `${subdomain}.localhost`;
    targetPort = port ? `:${port}` : "";
  } else {
    const parts = hostname.split(".");
    const base = parts.slice(-2).join(".");
    targetHost = `${subdomain}.${base}`;
  }

  const suffix = preservePath ? `${pathname}${search}${hash}` : "/";
  const url = `${protocol}//${targetHost}${targetPort}${suffix}`;

  window.location.assign(url);
}
