import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET semua user
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data user" },
      { status: 500 }
    );
  }
}

// POST tambah user (optional kalau kamu butuh create user manual)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nim, name, program, email, role } = body;

    const newUser = await prisma.user.create({
      data: { nim, name, program, email, role },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal membuat user" }, { status: 500 });
  }
}
