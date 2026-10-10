import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.AUTH_JWT_SECRET || "dev-only-secret-change-in-production"
);

const ISSUER = "portfolio-builder-admin";
const AUDIENCE = "portfolio-builder-admin";
export const ADMIN_SESSION_COOKIE = "admin_session";

export async function signAdminToken(email: string): Promise<string> {
  return await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secret, { issuer: ISSUER, audience: AUDIENCE });
    return true;
  } catch {
    return false;
  }
}
