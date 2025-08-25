import { SignJWT, jwtVerify } from "jose";
import * as argon2 from "argon2";
import { NextApiResponse, NextApiRequest } from "next";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const encoder = new TextEncoder();

export async function hashPassword(password: string) {
  return argon2.hash(password);
}
export async function verifyPassword(hash: string, password: string) {
  return argon2.verify(hash, password);
}

export async function createSessionToken(payload: { id: string; nim: string }) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encoder.encode(JWT_SECRET));
  return token;
}
export async function verifySessionToken(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encoder.encode(JWT_SECRET));
    return payload as any;
  } catch {
    return null;
  }
}

// helper to set cookie
export function setSessionCookie(res: NextApiResponse, token: string) {
  // HttpOnly cookie
  res.setHeader(
    "Set-Cookie",
    `session=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}`
  );
}
export function clearSessionCookie(res: NextApiResponse) {
  res.setHeader("Set-Cookie", `session=; HttpOnly; Path=/; Max-Age=0`);
}
