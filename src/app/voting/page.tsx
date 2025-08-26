"use client";

import { Poppins } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
interface Candidate {
  id: string;
  chairmanName: string;
  viceChairmanName: string;
  visionMission?: string;
  photoChairMan?: string;
  photoViceChairMan?: string;
  orgId?: string;
}

interface Election {
  id: string;
  title: string;
  description?: string;
  orgId: string;
  startDate: string;
  endDate: string;
  organization?: { name: string; logo: string };
  candidates: Candidate[];
}

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface User {
  name: string;
  email: string;
  nim: string;
}

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

export default function LandingPage({
  sessionUser,
  onLogout,
}: {
  sessionUser: User | null;
  onLogout: () => void;
}) {
  const [user, setUser] = useState<User | null>(sessionUser);
  const [showDropdown, setShowDropdown] = useState(false);
  const getInitial = (name: string) => name.charAt(0).toUpperCase();
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedElection, setSelectedElection] = useState<Election | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const openModal = (election: Election) => {
    setSelectedElection(election);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedElection(null);
    setShowModal(false);
  };
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const data = await res.json();

      if (data.ok) {
        setUser(null); // hilangkan user dari state
        setShowDropdown(false);
        alert("Logout berhasil"); // bisa diganti dengan toast atau modal
        router.push("/"); // redirect ke homepage
      } else {
        alert(data.error || "Logout gagal");
      }
    } catch (err) {
      console.error(err);
      alert("Logout gagal");
    }
  };
  useEffect(() => {
    fetch("/api/elections")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setElections(data.data);
        else setElections([]);
      })
      .finally(() => setLoading(false));
  }, []);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [message, setMessage] = useState("");

  // Tambahkan state untuk modal sukses
  const [showSuccess, setShowSuccess] = useState(false);

  const handleVote = async () => {
    if (!selectedCandidate || !selectedElection)
      return setMessage("Pilih kandidat dulu!");
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/elections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        electionId: selectedElection.id,
        candidateId: selectedCandidate,
      }),
      credentials: "include", // pastikan cookie terkirim
    });

    const data = await res.json();
    setMessage(data.ok ? "Vote berhasil ✅" : data.error || "Gagal vote ❌");
    setLoading(false);

    if (data.ok) {
      closeModal(); // tutup modal vote
      setShowSuccess(true); // tampilkan pop-up sukses
    }
  };

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
      {showSuccess && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-1/3 text-[#0B7077] text-center">
            <Image
              alt="success"
              src="/images/success.svg"
              width={230}
              height={230}
              className="mx-auto" // center image
            />
            <h2 className="text-xl font-bold mb-2">Vote Berhasil!</h2>
            <p>Suara kamu sudah dicatat.</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="mt-4 bg-[#0B7077] text-white py-2 px-4 rounded hover:bg-[#094f54]"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
      <nav className="bg-[#D2E6E4] fixed w-full z-40">
        <div className="mx-auto px-4 sm:px-14 lg:px-14">
          <div className="flex justify-between h-16 items-center relative z-10">
            <div className="text-xl font-bold text-[#0B7077]">KlikVote</div>
            <div className="hidden md:flex space-x-6 items-center">
              <Link href="/home" className="text-gray-700 hover:text-[#0B7077]">
                Beranda
              </Link>
              <Link
                href="/candidates"
                className="text-gray-700 hover:text-[#0B7077]"
              >
                Kandidat
              </Link>
              <Link
                href="/votes"
                className="text-gray-700 hover:text-[#0B7077]"
              >
                Voting
              </Link>

              {user && (
                <div className="relative">
                  {/* Avatar dengan huruf depan */}
                  <button
                    className="w-10 h-10 rounded-full bg-[#0B7077] text-white flex items-center justify-center font-bold"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    {getInitial(user.name)}
                  </button>

                  {/* Dropdown */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg py-2 text-[#0B7077]">
                      <p className="px-4 py-1 font-semibold">{user.name}</p>
                      <p className="px-4 py-1 text-sm">NIM: {user.nim}</p>
                      <p className="px-4 py-1 text-sm">Email: {user.email}</p>
                      <hr className="my-1 border-gray-200" />
                      <button
                        onClick={onLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="text-left px-4 py-2 text-white bg-[#0B7077] rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <section className="relative px-14 pt-40 pb-28 bg-[#D2E6E4] text-[#0B7077] overflow-hidden">
        <div className=" mx-auto z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Pemungutan Suara
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-xl text-center mx-auto">
            Ikuti proses pemungutan suara dengan mudah, tanpa ribet, dan hasil
            langsung tercatat secara real-time
          </p>
        </div>

        <Image
          src="/images/white-2.svg"
          alt="Logo Background"
          width={300} // sesuaikan ukuran
          height={300} // sesuaikan ukuran
          className="absolute right-0 w-2xl bottom-0 z-40 pointer-events-none"
          priority
        />
      </section>
      <section id="features" className="py-20 bg-white">
        <div className="mx-auto px-14 grid grid-cols-1 md:grid-cols-3 gap-6 text-[#0B7077]">
          {loading ? (
            <p className="col-span-full text-center text-gray-500">
              Memuat data...
            </p>
          ) : elections.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center text-center text-gray-500 ">
              <Image
                src="/images/empty.svg"
                alt="Logo Background"
                width={300}
                height={300}
                className=""
                priority
              />
              <span>Belum ada pemungutan suara saat ini.</span>
            </div>
          ) : (
            elections.map((e) => (
              <div
                key={e.id}
                className="flex flex-col items-center border p-4 rounded shadow-md"
              >
                {e.organization?.logo && (
                  <Image
                    src={e.organization.logo}
                    alt={e.organization.name || "Organization Logo"}
                    width={100}
                    height={100}
                    className="rounded mb-2 w-32 h-32"
                  />
                )}
                <h4 className="font-semibold text-lg">{e.title}</h4>
                {e.description && (
                  <p className="text-center">{e.description}</p>
                )}
                <p>
                  Mulai: {new Date(e.startDate).toLocaleDateString("id-ID")}
                </p>
                <p>
                  Selesai: {new Date(e.endDate).toLocaleDateString("id-ID")}
                </p>
                <button
                  onClick={() => openModal(e)}
                  className="mt-4 bg-[#0B7077] text-white px-4 py-2 rounded hover:bg-[#094f54]"
                >
                  Vote
                </button>
              </div>
            ))
          )}
        </div>
        {showModal && selectedElection && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white text-[#0B7077] p-6 rounded shadow-md w-1/2 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
                onClick={closeModal}
              >
                ✖
              </button>
              <h2 className="text-xl font-bold mb-4">
                {selectedElection.title}
              </h2>
              <div className="flex flex-col gap-2 mb-4">
                {selectedElection.candidates.map((c) => (
                  <label key={c.id} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="candidate"
                      value={c.id}
                      onChange={(e) => setSelectedCandidate(e.target.value)}
                    />
                    {c.chairmanName} & {c.viceChairmanName}
                  </label>
                ))}
              </div>
              <button
                className="bg-[#0B7077] text-white py-2 px-4 rounded hover:bg-[#094f54]"
                onClick={handleVote}
                disabled={loading}
              >
                {loading ? "Mengirim..." : "Kirim Vote"}
              </button>
              {message && <p className="mt-2 text-center">{message}</p>}
            </div>
          </div>
        )}
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
