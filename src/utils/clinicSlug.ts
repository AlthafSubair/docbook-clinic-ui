/**
 * Resolves the clinic slug directly from the URL:
 * 1. Router path param (e.g., /:slug/login -> "test-clinic")
 * 2. URL pathname segment (e.g., /test-clinic/login -> "test-clinic")
 * 3. URL query param (e.g., ?slug=test-clinic or ?clinic=test-clinic)
 * 4. URL subdomain (e.g., test-clinic.docbook.com or test-clinic.localhost)
 */
export function resolveClinicSlug(pathSlug?: string): string | null {
  // 1. Direct path param passed from router (e.g. useParams().slug)
  if (pathSlug && pathSlug.trim() && !isReservedRoute(pathSlug)) {
    return pathSlug.trim().toLowerCase();
  }

  if (typeof window === "undefined") {
    return null;
  }

  // 2. Direct pathname inspection (e.g. /test-clinic/login)
  const segments = window.location.pathname.split("/").filter(Boolean);
  if (segments.length > 0 && !isReservedRoute(segments[0])) {
    return segments[0].toLowerCase();
  }

  // 3. Query param ?slug=... or ?clinic=...
  const searchParams = new URLSearchParams(window.location.search);
  const querySlug = searchParams.get("slug") || searchParams.get("clinic");
  if (querySlug && querySlug.trim()) {
    return querySlug.trim().toLowerCase();
  }

  // 4. Subdomain extraction (e.g., test-clinic.docbook.com or test-clinic.localhost)
  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  if (
    (parts.length >= 3 && !isReservedSubdomain(parts[0])) ||
    (parts.length === 2 && parts[1] === "localhost" && !isReservedSubdomain(parts[0]))
  ) {
    return parts[0].toLowerCase();
  }

  return null;
}

const RESERVED_ROUTES = new Set([
  "login",
  "forgot-password",
  "verify-otp",
  "reset-password",
  "patients",
  "dashboard",
  "appointments",
  "api",
]);

function isReservedRoute(val: string): boolean {
  return RESERVED_ROUTES.has(val.toLowerCase());
}

const RESERVED_SUBDOMAINS = new Set([
  "www",
  "app",
  "api",
  "admin",
  "mail",
  "staging",
  "dev",
  "clinic",
]);

function isReservedSubdomain(sub: string): boolean {
  return RESERVED_SUBDOMAINS.has(sub.toLowerCase());
}
