"use client";
import { Poppins } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
export default function Register() {
  const [nim, setNim] = useState("");
  const [name, setName] = useState("");
  const [program, setProgram] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nim, name, program, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Register berhasil!");
        window.location.href = "/login";
      } else {
        alert(data.error || "Terjadi kesalahan");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`${poppins.className} flex min-h-screen bg-[#0B7077] relative items-center justify-center`}
    >
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
          <h1 className="text-2xl font-bold mb-8 text-center">Registrasi</h1>
          <div className="flex flex-col gap-4">
            <input
              className="border border-white rounded px-3 py-2 focus:outline-none focus:ring focus:ring-white"
              placeholder="NIM"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
            />
            <input
              className="border border-white rounded px-3 py-2 focus:outline-none focus:ring focus:ring-white"
              placeholder="Nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="border border-white rounded px-3 py-2 focus:outline-none focus:ring focus:ring-white"
              placeholder="Program"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
            />
            <input
              className="border border-white rounded px-3 py-2 focus:outline-none focus:ring focus:ring-white"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="border border-white rounded px-3 py-2 focus:outline-none focus:ring focus:ring-white"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className={` className="w-full bg-[#0B7077] text-white py-2 rounded-lg hover:bg-transparent hover:border hover:border-[#D2E6E4] transition-colors"${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={submit}
              disabled={loading}
            >
              {loading ? "Processing..." : "Register"}
            </button>
          </div>
          <p className="text-center mt-3 text-white">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-semibold underline hover:text-gray-200"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
