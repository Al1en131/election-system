import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const votes = await prisma.vote.findMany({
      include: {
        candidate: true,
        election: true,
        user: true, // ⬅️ ambil data user
      },
    });

    return NextResponse.json({ ok: true, data: votes });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch votes" },
      { status: 500 }
    );
  }
}
