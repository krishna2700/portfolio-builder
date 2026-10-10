import { z } from "zod";
import { ok, fail } from "@/lib/api";
import { signAdminToken, ADMIN_SESSION_COOKIE } from "@/lib/adminAuth";

const schema = z.object({ email: z.string(), password: z.string() });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return fail("Invalid request", 400);

  const { email, password } = parsed.data;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword || email !== adminEmail || password !== adminPassword) {
    return fail("Invalid credentials", 401);
  }

  const token = await signAdminToken(email);
  const res = ok({ success: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
