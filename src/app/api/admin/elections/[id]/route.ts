import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import fs from "fs";
import path from "path";

export const config = { api: { bodyParser: false } };

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const electionId = params.id;

  try {
    const formData = await req.formData();

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
      const candidateId = formData.get(`candidates[${idx}][id]`) as
        | string
        | null;

      // Siapkan data update
      const updateData: any = {
        chairmanName: formData.get(
          `candidates[${idx}][chairmanName]`
        ) as string,
        viceChairmanName: formData.get(
          `candidates[${idx}][viceChairmanName]`
        ) as string,
        visionMission: formData.get(
          `candidates[${idx}][visionMission]`
        ) as string,
      };

      // Tambahkan foto hanya jika ada upload baru
      if (filesMap[`candidates[${idx}][photoChairMan]`]) {
        updateData.photoChairMan =
          filesMap[`candidates[${idx}][photoChairMan]`];
      }
      if (filesMap[`candidates[${idx}][photoViceChairMan]`]) {
        updateData.photoViceChairMan =
          filesMap[`candidates[${idx}][photoViceChairMan]`];
      }

      candidates.push({
        id: candidateId,
        updateData,
      });

      idx++;
    }

    // Update election + candidates
    const updatedElection = await prisma.election.update({
      where: { id: electionId },
      data: {
        title,
        description,
        orgId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        candidates: {
          // Hapus kandidat lama yang tidak ada di form
          deleteMany: {
            id: {
              notIn: candidates.filter((c) => c.id).map((c) => c.id),
            },
          },
          // Upsert kandidat
          upsert: candidates.map((c) => ({
            where: { id: c.id || "" }, // jika id kosong maka create baru
            update: c.updateData,
            create: {
              ...c.updateData,
              orgId: orgId || null,
            },
          })),
        },
      },
      include: { candidates: true },
    });

    return NextResponse.json({ ok: true, data: updatedElection });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Failed to update election" },
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


export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // delete election & cascade ke kandidat
    await prisma.election.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true, message: "Election deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Failed to delete election" },
      { status: 500 }
    );
  }
}
