import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import fs from "fs";

// GET candidate by id
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const candidate = await prisma.candidate.findUnique({
      where: { id },
    });
    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(candidate);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching candidate" },
      { status: 500 }
    );
  }
}

import path from "path";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const formData = await req.formData();

    const chairmanName = formData.get("chairmanName") as string;
    const viceChairmanName = formData.get("viceChairmanName") as string;
    const visionMission = formData.get("visionMission") as string;
    const orgId = formData.get("orgId") as string;
    const electionId = formData.get("electionId") as string;

    const photoChairMan = formData.get("photoChairMan") as File | null;
    const photoViceChairMan = formData.get("photoViceChairMan") as File | null;

    let photoChairManPath;
    let photoViceChairManPath;

    if (photoChairMan) {
      const buffer = Buffer.from(await photoChairMan.arrayBuffer());
      photoChairManPath = `/uploads/${photoChairMan.name}`;
      await fs.promises.writeFile(
        path.join("public", "uploads", photoChairMan.name),
        buffer
      );
    }

    if (photoViceChairMan) {
      const buffer = Buffer.from(await photoViceChairMan.arrayBuffer());
      photoViceChairManPath = `/uploads/${photoViceChairMan.name}`;
      await fs.promises.writeFile(
        path.join("public", "uploads", photoViceChairMan.name),
        buffer
      );
    }

    const updated = await prisma.candidate.update({
      where: { id },
      data: {
        chairmanName,
        viceChairmanName,
        visionMission,
        ...(orgId ? { orgId } : {}),
        ...(electionId ? { electionId } : {}),
        ...(photoChairManPath ? { photoChairMan: photoChairManPath } : {}),
        ...(photoViceChairManPath
          ? { photoViceChairMan: photoViceChairManPath }
          : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Update Candidate Error:", error);
    return NextResponse.json(
      { error: "Error updating candidate" },
      { status: 500 }
    );
  }
}

// DELETE candidate
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    await prisma.candidate.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting candidate" },
      { status: 500 }
    );
  }
}
