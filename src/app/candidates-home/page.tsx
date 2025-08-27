"use client";

import { Poppins } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface Candidate {
  id: string;
  chairmanName: string;
  viceChairmanName: string;
  visionMission?: string;
  photoChairMan?: string;
  photoViceChairMan?: string;
  orgId?: string;
}

interface Vote {
  candidateId: string;
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
  votes: Vote[];
}

interface User {
  name: string;
  email: string;
  nim: string;
}

export default function LandingPage({
  sessionUser,
  onLogout,
}: {
  sessionUser: User | null;
  onLogout: () => void;
}) {
  const [elections, setElections] = useState<Election[]>([]);
  const [user, setUser] = useState<User | null>(sessionUser);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // State untuk modal kandidat
  const [modalCandidate, setModalCandidate] = useState<Candidate | null>(null);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const data = await res.json();

      if (data.ok) {
        setUser(null);
        alert("Logout berhasil");
        router.push("/");
      } else {
        alert(data.error || "Logout gagal");
      }
    } catch (err) {
      console.error(err);
      alert("Logout gagal");
    }
  };

  useEffect(() => {
    fetch("/api/admin/elections")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setElections(data.data);
        else setElections([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`${poppins.className} flex flex-col min-h-screen relative`}>
      {/* Logo Background */}
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
                href="/voting"
                className="text-gray-700 hover:text-[#0B7077]"
              >
                Voting
              </Link>
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

      {/* Hero Section */}
      <section className="relative px-14 pt-40 pb-28 bg-[#D2E6E4] text-[#0B7077] overflow-hidden">
        <div className="max-w-xl mx-auto z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Kandidat</h1>
          <p className="text-lg md:text-xl mb-8">
            Pilih pemimpin terbaik Anda dengan sistem e-voting yang jujur,
            transparan, dan akurat
          </p>
        </div>

        <Image
          src="/images/white-2.svg"
          alt="Logo Background"
          width={300}
          height={300}
          className="absolute right-0 w-2xl bottom-0 z-40 pointer-events-none"
          priority
        />
      </section>

      {/* Kandidat Section */}
      <section id="candidates" className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-14">
          {loading ? (
            <p className="text-center text-gray-500">Memuat data...</p>
          ) : elections.length === 0 ? (
            <p className="text-center text-gray-500">
              Belum ada pemungutan suara saat ini.
            </p>
          ) : (
            elections.map((election) => {
              const voteCounts = election.candidates.map(
                (c) =>
                  election.votes.filter((v) => v.candidateId === c.id).length
              );
              const labels = election.candidates.map(
                (c) => `${c.chairmanName} & ${c.viceChairmanName}`
              );

              return (
                <div key={election.id} className="mb-12">
                  <h2 className="text-3xl font-bold text-[#0B7077] mb-6">
                    {election.title}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {election.candidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="bg-white border border-[#0B7077] rounded-lg shadow-md p-4 flex flex-col items-center"
                      >
                        <div className="flex space-x-4 mb-4">
                          {candidate.photoChairMan && (
                            <Image
                              src={candidate.photoChairMan}
                              alt={candidate.chairmanName}
                              width={80}
                              height={80}
                              className="w-32 h-40 border border-[#0B7077] rounded-lg object-cover"
                            />
                          )}
                          {candidate.photoViceChairMan && (
                            <Image
                              src={candidate.photoViceChairMan}
                              alt={candidate.viceChairmanName}
                              width={80}
                              height={80}
                              className="w-32 h-40 rounded-lg object-cover border border-[#0B7077]"
                            />
                          )}
                        </div>

                        <h3 className="text-lg font-semibold text-center text-[#0B7077]">
                          {candidate.chairmanName} &{" "}
                          {candidate.viceChairmanName}
                        </h3>

                        <button
                          onClick={() => setModalCandidate(candidate)}
                          className="mt-3 px-4 py-2 bg-[#0B7077] text-white rounded hover:bg-[#09575f]"
                        >
                          Lihat Visi & Misi
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Chart votes per election */}
                  <div className="mt-6 bg-white p-4 rounded shadow-xl relative border-[#0B7077] border flex justify-center gap-16 items-center">
                    {/* Chart */}
                    <Image
                      src="/images/white-2.svg"
                      alt="Logo Background"
                      width={300}
                      height={300}
                      className="absolute right-0 w-xl bottom-0 z-20 pointer-events-none"
                      priority
                    />
                    <Image
                      src="/images/white.svg"
                      alt="Logo Background"
                      width={120}
                      height={120}
                      className="absolute left-0 w-3xl top-0 z-20 pointer-events-none"
                      priority
                    />
                    <div className="w-[300px] h-[300px] z-30">
                      <Pie
                        data={{
                          labels: election.candidates.map(
                            (c) => `${c.chairmanName} & ${c.viceChairmanName}`
                          ),
                          datasets: [
                            {
                              label: "Jumlah Vote",
                              data: election.candidates.map(
                                (c) =>
                                  election.votes.filter(
                                    (v) => v.candidateId === c.id
                                  ).length
                              ),
                              backgroundColor: [
                                "#0B7077", // teal gelap (utama)
                                "#16A085", // hijau emerald
                                "#1ABC9C", // turquoise
                                "#27AE60", // hijau tua segar
                                "#2980B9", // biru laut
                                "#8E44AD", // ungu kebiruan
                                "#F39C12", // oranye keemasan (kontras banget, biar jelas)
                              ],
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false, // ⬅️ legend bawaan dimatikan
                            },
                          },
                        }}
                      />
                    </div>

                    {/* Custom Legend */}
                    <div className="flex flex-col gap-3 border-[#0B7077] border rounded-lg p-4">
                      {election.candidates.map((c, idx) => (
                        <div key={c.id} className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full"
                            style={{
                              backgroundColor: [
                                "#0B7077", // teal gelap (utama)
                                "#16A085", // hijau emerald
                                "#1ABC9C", // turquoise
                                "#27AE60", // hijau tua segar
                                "#2980B9", // biru laut
                                "#8E44AD", // ungu kebiruan
                                "#F39C12", // oranye keemasan (kontras banget, biar jelas)
                              ][idx],
                            }}
                          />
                          <span className="text-gray-700 text-sm">
                            {c.chairmanName} & {c.viceChairmanName}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Modal Visi & Misi */}
      {modalCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white text-[#0B7077] rounded-lg p-6 max-w-md w-full relative">
            <button
              onClick={() => setModalCandidate(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              &times;
            </button>
            <h4 className="text-xl font-bold mb-4">Visi & Misi</h4>
            <p>{modalCandidate.visionMission || "Belum ada visi & misi"}</p>
          </div>
        </div>
      )}

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
