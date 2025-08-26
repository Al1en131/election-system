import { prisma } from "@/app/lib/prisma";
import { verifyPassword, createSessionToken } from "@/app/lib/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json();
  const { nim, password } = body;
  if (!nim || !password)
    return NextResponse.json({ error: "Missing" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { nim } });
  if (!user || !user.passwordHash)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const ok = await verifyPassword(user.passwordHash, password);
  if (!ok)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  // 🔑 harus di-await
  const token = await createSessionToken({ id: user.id, nim: user.nim });

  cookies().set("session", token, { httpOnly: true, path: "/" });

  return NextResponse.json({ ok: true, role: user.role });
}
