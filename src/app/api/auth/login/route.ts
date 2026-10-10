import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api";
import { signSessionToken, SESSION_COOKIE } from "@/lib/auth";

const schema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return fail("Invalid request", 400);
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return fail("Invalid email or password", 401);

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return fail("Invalid email or password", 401);

  const token = await signSessionToken({ id: user.id, email: user.email });
  const res = ok({ success: true, user: { id: user.id, email: user.email } });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
