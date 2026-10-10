import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api";
import { getCurrentUser } from "@/lib/session";
import { normalizeSlug, isValidSlug } from "@/lib/slug";
import { PortfolioContentSchema } from "@/lib/content";

const createSchema = z.object({
  slug: z.string(),
  themeId: z.string(),
  content: PortfolioContentSchema,
  photoUrl: z.string().optional(),
  resumeUrl: z.string().optional(),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return fail("Not authenticated", 401);

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) return fail("Invalid request", 400, parsed.error.flatten());

  const slug = normalizeSlug(parsed.data.slug);
  const validity = isValidSlug(slug);
  if (!validity.valid) return fail(validity.reason ?? "Invalid name", 400);

  const theme = await prisma.theme.findUnique({ where: { id: parsed.data.themeId } });
  if (!theme) return fail("Unknown theme", 400);

  const existingForSlug = await prisma.portfolio.findUnique({ where: { slug } });
  if (existingForSlug && existingForSlug.userId !== user.id) {
    return fail("That name is already taken", 409);
  }

  const portfolio = await prisma.portfolio.upsert({
    where: { userId: user.id },
    update: {
      slug,
      themeId: theme.id,
      content: parsed.data.content,
      photoUrl: parsed.data.photoUrl,
      resumeUrl: parsed.data.resumeUrl,
    },
    create: {
      userId: user.id,
      slug,
      themeId: theme.id,
      content: parsed.data.content,
      photoUrl: parsed.data.photoUrl,
      resumeUrl: parsed.data.resumeUrl,
    },
  });

  return ok({ success: true, slug: portfolio.slug });
}

const updateSchema = createSchema.partial({ slug: true, themeId: true });

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) return fail("Not authenticated", 401);

  const existing = await prisma.portfolio.findUnique({ where: { userId: user.id } });
  if (!existing) return fail("No portfolio yet — create one first", 404);

  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) return fail("Invalid request", 400, parsed.error.flatten());

  let slug = existing.slug;
  if (parsed.data.slug) {
    slug = normalizeSlug(parsed.data.slug);
    const validity = isValidSlug(slug);
    if (!validity.valid) return fail(validity.reason ?? "Invalid name", 400);
    const clash = await prisma.portfolio.findUnique({ where: { slug } });
    if (clash && clash.userId !== user.id) return fail("That name is already taken", 409);
  }

  const portfolio = await prisma.portfolio.update({
    where: { userId: user.id },
    data: {
      slug,
      ...(parsed.data.themeId ? { themeId: parsed.data.themeId } : {}),
      ...(parsed.data.content ? { content: parsed.data.content } : {}),
      ...(parsed.data.photoUrl !== undefined ? { photoUrl: parsed.data.photoUrl } : {}),
      ...(parsed.data.resumeUrl !== undefined ? { resumeUrl: parsed.data.resumeUrl } : {}),
    },
  });

  return ok({ success: true, slug: portfolio.slug });
}
