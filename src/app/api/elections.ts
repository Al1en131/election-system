import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/app/lib/prisma";
import { verifySessionToken } from "@/app/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const list = await prisma.election.findMany({
      include: { organization: true },
    });
    return res.json(list);
  }
  if (req.method === "POST") {
    // only admin can create
    const token = req.cookies.session;
    const p = await verifySessionToken(token);
    if (!p) return res.status(401).json({ error: "auth" });
    const me = await prisma.user.findUnique({ where: { id: p.id } });
    if (!me || me.role !== "admin")
      return res.status(403).json({ error: "forbidden" });

    const { title, description, orgId, startDate, endDate, publicKeyB64 } =
      req.body;
    const e = await prisma.election.create({
      data: {
        title,
        description,
        orgId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        publicKeyB64,
      },
    });
    return res.json(e);
  }
  res.status(405).end();
}
