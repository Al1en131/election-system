// /app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Hapus cookie session / token
    const response = NextResponse.json({
      ok: true,
      message: "Logout berhasil",
    });

    // Misal cookie bernama "token"
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0, // Hapus cookie
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Logout gagal" },
      { status: 500 }
    );
  }
}
