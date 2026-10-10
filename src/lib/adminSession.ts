import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminToken } from "@/lib/adminAuth";

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}
