import { prisma } from "@/lib/prisma";
import { ok } from "@/lib/api";
import { normalizeSlug, isValidSlug } from "@/lib/slug";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("slug") ?? "";
  const slug = normalizeSlug(raw);

  const validity = isValidSlug(slug);
  if (!validity.valid) return ok({ available: false, slug, reason: validity.reason });

  const existing = await prisma.portfolio.findUnique({ where: { slug } });
  if (!existing) return ok({ available: true, slug });

  const user = await getCurrentUser();
  const isOwnSlug = user && existing.userId === user.id;
  return ok({
    available: !!isOwnSlug,
    slug,
    reason: isOwnSlug ? undefined : "That name is already taken",
  });
}
