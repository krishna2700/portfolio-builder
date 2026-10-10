import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api";
import { isAdmin } from "@/lib/adminSession";

export async function GET() {
  if (!(await isAdmin())) return fail("Not authorized", 401);

  const portfolios = await prisma.portfolio.findMany({
    include: { user: { select: { email: true } }, theme: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return ok({
    portfolios: portfolios.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: (p.content as { hero?: { name?: string } })?.hero?.name ?? "",
      ownerEmail: p.user.email,
      themeName: p.theme.name,
      published: p.published,
      createdAt: p.createdAt,
    })),
  });
}
