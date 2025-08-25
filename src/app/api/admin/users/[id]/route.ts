import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET user by ID
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });
    if (!user)
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data user" },
      { status: 500 }
    );
  }
}

// PUT update user
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, nim, program, email, role } = body;

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { name, nim, program, email, role },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Gagal update user" }, { status: 500 });
  }
}

// DELETE hapus user
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "User berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal hapus user" }, { status: 500 });
  }
}
