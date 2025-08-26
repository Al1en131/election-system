// src/app/lib/session.ts
import { NextRequest } from "next/server";
import { verifySessionToken } from "./auth";

export async function getSession(req: NextRequest) {
  const cookie = req.headers
    .get("cookie")
    ?.split("; ")
    .find(c => c.startsWith("session="));
  const token = cookie?.split("=")[1];
  if (!token) return null;

  return await verifySessionToken(token);
}
