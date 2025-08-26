// src/app/api/votes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getSession } from "@/app/lib/session";
import { getSessionFromRequest } from "@/app/lib/auth";


export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session?.id)
    return NextResponse.json(
      { ok: false, error: "Not authenticated" },
      { status: 401 }
    );

  const { electionId, candidateId } = await req.json();

  const vote = await prisma.vote.create({
    data: {
      electionId,
      candidateId,
      userId: session.id,
    },
  });

  return NextResponse.json({ ok: true, data: vote });
}

export async function GET(req: Request) {
  const session = await getSessionFromRequest(req); // ambil userId dari cookie
  if (!session) return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), { status: 401 });

  const votedElectionIds = await prisma.vote.findMany({
    where: { userId: session.id },
    select: { electionId: true },
  }).then(res => res.map(v => v.electionId));

  const elections = await prisma.election.findMany({
    where: { id: { notIn: votedElectionIds } },
    include: { organization: true, candidates: true },
  });

  return new Response(JSON.stringify({ ok: true, data: elections }));
}

