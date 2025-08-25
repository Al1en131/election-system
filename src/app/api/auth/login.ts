import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/app/lib/prisma";
import {
  verifyPassword,
  createSessionToken,
  setSessionCookie,
} from "@/app/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();
  const { nim, password } = req.body;
  if (!nim || !password) return res.status(400).json({ error: "Missing" });

  const user = await prisma.user.findUnique({ where: { nim } });
  if (!user || !user.passwordHash)
    return res.status(401).json({ error: "Invalid credentials" });
  const ok = await verifyPassword(user.passwordHash, password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = await createSessionToken({ id: user.id, nim: user.nim });
  setSessionCookie(res, token);
  return res.json({ ok: true });
}
