import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/app/lib/prisma";
import { hashPassword, createSessionToken, setSessionCookie } from "@/app/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();
  const { nim, name, program, email, password } = req.body;
  if (!nim || !name || !password)
    return res.status(400).json({ error: "Missing fields" });

  const exists = await prisma.user.findUnique({ where: { nim } });
  if (exists) return res.status(409).json({ error: "NIM already registered" });

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { nim, name, program, email, passwordHash },
  });
  const token = await createSessionToken({ id: user.id, nim: user.nim });
  setSessionCookie(res, token);
  return res.json({
    ok: true,
    user: { id: user.id, nim: user.nim, name: user.name },
  });
}
