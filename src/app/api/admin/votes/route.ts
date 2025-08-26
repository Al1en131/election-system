import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const elections = await prisma.election.findMany({
      include: {
        organization: true,
        candidates: true,
      },
    });
    return NextResponse.json({ ok: true, data: elections });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "Failed to fetch elections" }, { status: 500 });
  }
}
