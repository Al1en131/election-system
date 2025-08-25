import type { NextApiRequest, NextApiResponse } from "next";
import { verifySessionToken } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.cookies.session;
  const payload = await verifySessionToken(token);
  if (!payload) return res.json({ user: null });
  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  return res.json({
    user: user
      ? { id: user.id, nim: user.nim, name: user.name, role: user.role }
      : null,
  });
}
