import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return fail("Not authenticated", 401);

  const portfolio = await prisma.portfolio.findUnique({
    where: { userId: user.id },
    include: { theme: true },
  });

  return ok({ portfolio });
}
