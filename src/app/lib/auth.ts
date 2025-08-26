// src/app/lib/auth.ts
import { SignJWT, jwtVerify } from "jose";
import * as argon2 from "argon2";
import { NextApiResponse, NextApiRequest } from "next";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const encoder = new TextEncoder();

export async function hashPassword(password: string) {
  return argon2.hash(password);
}

export async function verifyPassword(hash: string, password: string) {
  return argon2.verify(hash, password);
}

export async function createSessionToken(payload: { id: string; nim: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encoder.encode(JWT_SECRET));
}

export async function verifySessionToken(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encoder.encode(JWT_SECRET));
    if (!payload || typeof payload !== "object" || !("id" in payload))
      return null;
    return { id: payload.id as string, nim: payload.nim as string };
  } catch (err) {
    console.error("JWT verify failed:", err);
    return null;
  }
}

// Cookie helpers
export function setSessionCookie(res: NextApiResponse, token: string) {
  res.setHeader(
    "Set-Cookie",
    `session=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}`
  );
}

export function clearSessionCookie(res: NextApiResponse) {
  res.setHeader("Set-Cookie", `session=; HttpOnly; Path=/; Max-Age=0`);
}

export async function getSessionFromRequest(req: Request) {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;

  const match = cookie.match(/session=([^;]+)/);
  if (!match) return null;

  const token = match[1];
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    if (!payload || typeof payload !== "object" || !("id" in payload)) return null;
    return { id: payload.id as string, nim: payload.nim as string };
  } catch {
    return null;
  }
}
