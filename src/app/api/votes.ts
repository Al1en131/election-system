import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/app/lib/prisma";
import { verifySessionToken } from "@/app/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();
  const token = req.cookies.session;
  const p = await verifySessionToken(token);
  if (!p) return res.status(401).json({ error: "auth" });

  const { electionId, candidateId, encryptedVote } = req.body;
  if (!electionId || !candidateId || !encryptedVote)
    return res.status(400).json({ error: "missing" });

  // check election open & unique vote
  const election = await prisma.election.findUnique({
    where: { id: electionId },
  });
  if (!election) return res.status(404).json({ error: "not found" });
  const now = new Date();
  if (now < election.startDate || now > election.endDate)
    return res.status(403).json({ error: "closed" });

  // unique constraint enforced by DB; check first for friendly error
  const existing = await prisma.vote
    .findUnique({ where: { electionId_userId: { electionId, userId: p.id } } })
    .catch(() => null);
  if (existing) return res.status(409).json({ error: "already voted" });

  const v = await prisma.vote.create({
    data: { electionId, candidateId, userId: p.id, encryptedVote },
  });
  return res.json({ ok: true, voteId: v.id });
}
