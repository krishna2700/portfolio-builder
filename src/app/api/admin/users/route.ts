import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api";
import { isAdmin } from "@/lib/adminSession";

export async function GET() {
  if (!(await isAdmin())) return fail("Not authorized", 401);

  const users = await prisma.user.findMany({
    include: { portfolio: { select: { slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  return ok({
    users: users.map((u) => ({
      id: u.id,
      email: u.email,
      createdAt: u.createdAt,
      portfolioSlug: u.portfolio?.slug ?? null,
    })),
  });
}
