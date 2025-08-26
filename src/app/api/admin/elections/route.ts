import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import fs from "fs";
import path from "path";

export const config = { api: { bodyParser: false } };

export async function POST(req: Request) {
  try {
    const formData = await req.formData(); // Ambil FormData dari request

    // Ambil field dasar election
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const orgId = formData.get("orgId") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;

    // Folder upload
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    // Map file ke path
    const filesMap: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        const arrayBuffer = await value.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filename = `${Date.now()}-${value.name}`;
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, buffer);
        filesMap[key] = `/uploads/${filename}`;
      }
    }

    // Ambil semua kandidat
    const candidates: any[] = [];
    let idx = 0;
    while (formData.has(`candidates[${idx}][chairmanName]`)) {
      candidates.push({
        chairmanName: formData.get(
          `candidates[${idx}][chairmanName]`
        ) as string,
        viceChairmanName: formData.get(
          `candidates[${idx}][viceChairmanName]`
        ) as string,
        visionMission: formData.get(
          `candidates[${idx}][visionMission]`
        ) as string,
        photoChairMan: filesMap[`candidates[${idx}][photoChairMan]`] || null,
        photoViceChairMan:
          filesMap[`candidates[${idx}][photoViceChairMan]`] || null,
        orgId,
      });
      idx++;
    }

    // Simpan ke database
    const newElection = await prisma.election.create({
      data: {
        title,
        description,
        orgId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        candidates: {
          create: candidates,
        },
      },
      include: { candidates: true },
    });

    return NextResponse.json({ ok: true, data: newElection });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Failed to create election" },
      { status: 500 }
    );
  }
}

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
    return NextResponse.json(
      { ok: false, error: "Failed to fetch elections" },
      { status: 500 }
    );
  }
}
