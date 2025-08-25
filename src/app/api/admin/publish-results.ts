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

  const { electionId, tally } = req.body;
  if (!electionId || !tally) return res.status(400).json({ error: "missing" });

  // store results in a simple table or as JSON column in election (quick way:)
  await prisma.election.update({
    where: { id: electionId },
    data: {
      /* store JSON string or add results model */
    },
  });
  // For simplicity, we assume you store results elsewhere; here just respond success
  return res.json({ ok: true });
}
