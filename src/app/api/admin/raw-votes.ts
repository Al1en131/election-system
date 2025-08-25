import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/app/lib/prisma";
import { verifySessionToken } from "@/app/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.cookies.session;
  const p = await verifySessionToken(token);
  if (!p) return res.status(401).json({ error: "auth" });
  const me = await prisma.user.findUnique({ where: { id: p.id } });
  if (!me || me.role !== "admin")
    return res.status(403).json({ error: "forbidden" });

  const { electionId } = req.query;
  if (!electionId)
    return res.status(400).json({ error: "electionId required" });
  const votes = await prisma.vote.findMany({
    where: { electionId: String(electionId) },
    orderBy: { createdAt: "asc" },
  });
  return res.json({ votes });
}
