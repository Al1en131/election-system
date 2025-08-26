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

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const orgId = formData.get("orgId") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;

    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    // Simpan file baru
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

      // Dapatkan URL lama dari form
      const oldChairUrl = formData.get(
        `candidates[${idx}][photoChairManUrl]`
      ) as string;
      const oldViceUrl = formData.get(
        `candidates[${idx}][photoViceChairManUrl]`
      ) as string;

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
        orgId,
        photoChairMan:
          filesMap[`candidates[${idx}][photoChairMan]`] || oldChairUrl || null,
        photoViceChairMan:
          filesMap[`candidates[${idx}][photoViceChairMan]`] ||
          oldViceUrl ||
          null,
          
      };

      candidates.push({
        id: candidateId,
        updateData,
      });

      idx++;
    }

    const updatedElection = await prisma.election.update({
      where: { id: electionId },
      data: {
        title,
        description,
        orgId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        candidates: {
          deleteMany: {
            id: { notIn: candidates.filter((c) => c.id).map((c) => c.id) },
          },
          upsert: candidates.map((c) => ({
            where: { id: c.id || "" },
            update: c.updateData,
            create: { ...c.updateData, orgId },
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
