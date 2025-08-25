"use client";

import { Poppins } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
export default function Login() {
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");

  async function submit() {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nim, password }),
    });

    if (res.ok) {
      window.location.href = "/home";
    } else {
      const data = await res.json();
      alert(data.error || "Login failed");
    }
  }

  return (
    <div className={`${poppins.className} flex min-h-screen bg-[#0B7077] relative items-center justify-center`}>
      {/* Background Decorations */}
      <Image
        src="/images/white-6.svg"
        alt="Logo Background"
        width={120}
        height={120}
        className="absolute left-0 top-0 w-3xl pointer-events-none"
        priority
      />
      <Image
        src="/images/white-5.svg"
        alt="Logo Background"
        width={120}
        height={120}
        className="absolute right-0 bottom-0 w-2xl pointer-events-none"
        priority
      />

      {/* Login Box */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center gap-10 bg-[#D2E6E4]/40 rounded-xl shadow-md p-10 z-10">
        <div className="flex justify-center mb-6 md:mb-0">
          <Image
            src="/images/auth.svg"
            alt="Illustration"
            width={200}
            height={200}
            priority
            className="w-[450px]"
          />
        </div>

        <div className="w-full md:w-1/2">
          <h1 className="text-2xl font-bold mb-10 text-center text-white">
            Login
          </h1>

          <label className="block mb-2 font-medium text-white">NIM</label>
          <input
            type="text"
            value={nim}
            onChange={(e) => setNim(e.target.value)}
            placeholder="Masukkan NIM"
            className="w-full mb-4 px-4 py-2 border border-white rounded-lg focus:outline-none focus:ring focus:ring-white text-white"
          />

          <label className="block mb-2 font-medium text-white">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
            className="w-full mb-6 px-4 py-2 border border-white rounded-lg focus:outline-none focus:ring focus:ring-white text-white"
          />

          <button
            type="button"
            onClick={submit}
            className="w-full bg-[#0B7077] text-white py-2 rounded-lg hover:bg-transparent hover:border hover:border-[#D2E6E4] transition-colors"
          >
            Login
          </button>
          <p className="text-center mt-3 text-white">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-semibold underline hover:text-gray-200"
            >
              Registrasi
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
