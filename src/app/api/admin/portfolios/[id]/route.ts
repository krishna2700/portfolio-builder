import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api";
import { isAdmin } from "@/lib/adminSession";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) return fail("Not authorized", 401);

  const { id } = await params;
  await prisma.portfolio.delete({ where: { id } }).catch(() => null);
  return ok({ success: true });
}
