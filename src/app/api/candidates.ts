import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/app/lib/prisma";
import { verifySessionToken } from "@/app/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { electionId } = req.query;
    if (!electionId)
      return res.status(400).json({ error: "electionId required" });
    const list = await prisma.candidate.findMany({
      where: { electionId: String(electionId) },
    });
    return res.json(list);
  }
  if (req.method === "POST") {
    const token = req.cookies.session;
    const p = await verifySessionToken(token);
    const me = p ? await prisma.user.findUnique({ where: { id: p.id } }) : null;
    if (!me || me.role !== "admin")
      return res.status(403).json({ error: "forbidden" });

    const { electionId, leaderName, deputyName, photo, visionMission } =
      req.body;
    const c = await prisma.candidate.create({
      data: { electionId, leaderName, deputyName, photo, visionMission },
    });
    return res.json(c);
  }
  res.status(405).end();
}
