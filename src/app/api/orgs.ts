import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/app/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const orgs = await prisma.organization.findMany();
    return res.json(orgs);
  }
  if (req.method === "POST") {
    const { name, description } = req.body;
    const o = await prisma.organization.create({ data: { name, description } });
    return res.json(o);
  }
  res.status(405).end();
}
