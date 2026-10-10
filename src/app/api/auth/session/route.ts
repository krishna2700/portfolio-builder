import { ok, fail } from "@/lib/api";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return fail("Not authenticated", 401);

  const portfolio = await prisma.portfolio.findUnique({
    where: { userId: user.id },
    select: { slug: true, published: true },
  });

  return ok({ user, portfolio });
}
