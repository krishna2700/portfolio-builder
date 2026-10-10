import { prisma } from "@/lib/prisma";
import { ok } from "@/lib/api";

export async function GET() {
  const themes = await prisma.theme.findMany({ orderBy: { order: "asc" } });
  return ok({ themes });
}
