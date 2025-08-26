// src/app/api/elections/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const election = await prisma.election.findUnique({
    where: { id },
    include: { candidates: true },
  });

  if (!election)
    return NextResponse.json(
      { ok: false, error: "Election not found" },
      { status: 404 }
    );

  return NextResponse.json({ ok: true, data: election });
}
