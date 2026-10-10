import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.AUTH_JWT_SECRET || "dev-only-secret-change-in-production"
);

const ISSUER = "portfolio-builder";
const AUDIENCE = "portfolio-builder-users";
export const SESSION_COOKIE = "session";

export type SessionUser = {
  id: string;
  email: string;
};

export async function signSessionToken(user: SessionUser): Promise<string> {
  return await new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    const user = payload.user as SessionUser | undefined;
    if (!user?.id || !user?.email) return null;
    return user;
  } catch {
    return null;
  }
}
