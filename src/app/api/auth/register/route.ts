import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/app/lib/prisma";
import { hashPassword, createSessionToken } from "@/app/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nim, name, program, email, password } = body;

    if (!nim || !name || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { nim } });
    if (exists) {
      return NextResponse.json(
        { error: "NIM already registered" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { nim, name, program, email, passwordHash },
    });

    const token = await createSessionToken({ id: user.id, nim: user.nim });

    // ✅ Simpan token ke cookie
    cookies().set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return NextResponse.json({
      ok: true,
      user: { id: user.id, nim: user.nim, name: user.name },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
