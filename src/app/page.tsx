"use client";

import { Poppins } from "next/font/google";
import Link from "next/link";
import Image from "next/image";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function LandingPage() {
  return (
    <div className={`${poppins.className} flex flex-col min-h-screen relative`}>
      <Image
        src="/images/white.svg"
        alt="Logo Background"
        width={120}
        height={120}
        className="absolute left-0 w-3xl top-0 z-50 pointer-events-none"
        priority
      />

      {/* Navbar */}
      <nav className="bg-[#D2E6E4] fixed w-full z-40">
        <div className="mx-auto px-4 sm:px-14 lg:px-14">
          <div className="flex justify-between h-16 items-center relative z-10">
            <div className="text-xl font-bold text-[#0B7077]">KlikVote</div>
            <div className="hidden md:flex space-x-6">
              <Link
                href="#features"
                className="text-gray-700 hover:text-[#0B7077]"
              >
                Fitur
              </Link>
              <Link
                href="#about"
                className="text-gray-700 hover:text-[#0B7077]"
              >
                Tentang Kami
              </Link>
              <Link
                href="#contact"
                className="text-gray-700 hover:text-[#0B7077]"
              >
                Kontak
              </Link>
              <Link
                href="/candidates-home"
                className="text-gray-700 hover:text-[#0B7077]"
              >
                Kandidat
              </Link>
            </div>
            <div>
              <Link
                href="/login"
                className="px-4 py-2 bg-[#0B7077] text-white rounded-lg transition"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex justify-between items-center px-14 pt-20 pb-4 bg-[#D2E6E4] text-[#0B7077]">
        <div className=" flex justify-between items-center z-10">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              KlikVote, Cara Baru untuk Memilih
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Sistem pemilihan modern yang aman, cepat, dan transparan.
              Memudahkan pencatatan suara secara digital dan penghitungan hasil
              secara real-time.
            </p>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="px-6 py-3 bg-[#0B7077] text-[#D2E6E4] font-semibold rounded-lg shadow hover:border hover:border-[#0B7077] hover:bg-transparent hover:text-[#0B7077] transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-6 py-3 bg-[#0B7077] text-[#D2E6E4] font-semibold rounded-lg shadow hover:border hover:border-[#0B7077] hover:bg-transparent hover:text-[#0B7077] transition"
              >
                Registrasi
              </Link>
            </div>{" "}
          </div>
          <div>
            <Image
              src="/images/candidates.svg"
              alt="People"
              width={120}
              height={120}
              className="z-50 w-7xl pointer-events-none"
              priority
            />
          </div>
          <Image
            src="/images/white-2.svg"
            alt="Logo Background"
            width={120}
            height={120}
            className="absolute right-0 w-2xl bottom-0 z-40 pointer-events-none"
            priority
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 bg-[#0B7077]">
        <div className="mx-auto px-14 text-center ">
          <h2 className="text-3xl font-bold mb-8">Kenapa Memilih E-Vote?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl text-[#0B7077] font-semibold mb-4">
                Aman
              </h3>
              <p className="text-gray-600">
                Menggunakan enkripsi modern untuk menjaga keamanan data pemilih.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-4 text-[#0B7077] ">
                Cepat
              </h3>
              <p className="text-gray-600">
                Proses pemilihan yang efisien dan real-time tanpa antrian
                panjang.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-4 text-[#0B7077] ">
                Transparan
              </h3>
              <p className="text-gray-600">
                Hasil pemilihan dapat dipantau secara langsung dan terbuka.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-10">
            {/* Image */}
            <div className="flex-shrink-0">
              <Image
                src="/images/peoples.svg"
                alt="People"
                width={420}
                height={420}
                className="object-contain pointer-events-none"
                priority
              />
            </div>

            {/* Text */}
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold mb-6 text-[#0B7077]">
                Tentang Kami
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                E-Vote adalah platform pemilihan digital yang dirancang untuk
                memberikan pengalaman pemilihan yang mudah, aman, dan
                terpercaya. Dengan teknologi modern, kami membantu organisasi,
                sekolah, dan komunitas menyelenggarakan pemilihan secara online.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 relative bg-[#D2E6E4]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#0B7077]">
            Hubungi Kami
          </h2>
          <p className="text-gray-700 mb-6">
            Jika ada pertanyaan atau butuh bantuan, silakan hubungi kami.
          </p>
          <a
            href="mailto:alifelsanurcahyani@gmail.com"
            className="px-6 py-3 bg-[#0B7077] text-white rounded-lg shadow transition"
          >
            Email Kami
          </a>
        </div>
        <Image
          src="/images/white-4.svg"
          alt="Logo Background"
          width={120}
          height={120}
          className="absolute left-0 w-2xl top-0 z-40 pointer-events-none"
          priority
        />
        <Image
          src="/images/white-3.svg"
          alt="Logo Background"
          width={120}
          height={120}
          className="absolute right-0 w-2xl bottom-0 z-40 pointer-events-none"
          priority
        />
      </section>

      {/* Footer */}
      <footer className="bg-[#0B7077] shadow-md py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-6 items-center text-center">
          <p className="text-white">
            &copy; {new Date().getFullYear()} KlikVote. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
