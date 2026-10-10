const RESERVED = new Set([
  "api",
  "admin",
  "dashboard",
  "onboarding",
  "login",
  "signup",
  "logout",
  "about",
  "settings",
  "themes",
  "pricing",
  "privacy",
  "terms",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "_next",
  "public",
  "assets",
  "static",
]);

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{1,30}[a-z0-9])?$/;

export function normalizeSlug(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isValidSlug(slug: string): { valid: boolean; reason?: string } {
  if (slug.length < 3) return { valid: false, reason: "Must be at least 3 characters" };
  if (slug.length > 32) return { valid: false, reason: "Must be 32 characters or fewer" };
  if (!SLUG_RE.test(slug)) {
    return {
      valid: false,
      reason: "Only lowercase letters, numbers, and hyphens (not at the start/end)",
    };
  }
  if (RESERVED.has(slug)) return { valid: false, reason: "That name is reserved" };
  return { valid: true };
}
