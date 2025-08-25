// app/api/admin/organizations/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import path from "path";
import { promises as fs } from "fs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;
    const file = formData.get("logo") as File | null;

    let logoUrl: string | null = null;

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(process.cwd(), "public/uploads", fileName);

      await fs.writeFile(filePath, buffer);
      logoUrl = `/uploads/${fileName}`;
    }

    const org = await prisma.organization.create({
      data: {
        name,
        description,
        logo: logoUrl,
      },
    });

    return NextResponse.json({ ok: true, data: org });
  } catch (error) {
    console.error("Error upload:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal membuat organisasi" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const organizations = await prisma.organization.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ ok: true, data: organizations });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch organizations" },
      { status: 500 }
    );
  }
}
