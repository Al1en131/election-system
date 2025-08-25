import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import path from "path";
import { promises as fs } from "fs";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Parse form data (karena ada file upload)
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const file = formData.get("logo") as File | null;

    let logoUrl: string | undefined = undefined;

    // Kalau ada file logo baru → simpan
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public", "uploads");

      // Pastikan folder uploads ada
      await fs.mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);

      await fs.writeFile(filePath, buffer);

      logoUrl = `/uploads/${fileName}`;
    }

    const org = await prisma.organization.update({
      where: { id },
      data: {
        name,
        description,
        ...(logoUrl && { logo: logoUrl }), // hanya update logo kalau ada upload baru
      },
    });

    return NextResponse.json({ ok: true, data: org });
  } catch (err) {
    console.error("Update Error:", err);
    return NextResponse.json(
      { error: "Failed to update organization" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.organization.delete({ where: { id } });

    return NextResponse.json({ ok: true, message: "Organization deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete organization" },
      { status: 500 }
    );
  }
}
