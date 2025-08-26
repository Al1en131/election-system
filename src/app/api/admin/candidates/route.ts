import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
// GET all candidates
export async function GET() {
  try {
    const candidates = await prisma.candidate.findMany({
      include: {
        election: true,
        votes: true,
        organization: true,
      },
    });
    return NextResponse.json({ ok: true, data: candidates });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch candidates" },
      { status: 500 }
    );
  }
}


// CREATE new candidate
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      chairmanName,
      viceChairmanName,
      orgId,
      electionId,
      photoChairMan,
      photoViceChairMan,
      visionMission,
    } = body;

    if (!electionId) {
      return NextResponse.json(
        { error: "electionId is required" },
        { status: 400 }
      );
    }

    const newCandidate = await prisma.candidate.create({
      data: {
        chairmanName,
        viceChairmanName,
        orgId,
        electionId,
        photoChairMan,
        photoViceChairMan,
        visionMission,
      },
    });

    return NextResponse.json({ ok: true, data: newCandidate });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create candidate" },
      { status: 500 }
    );
  }
}
