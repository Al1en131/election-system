"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Entity {
  id: string;
  [key: string]: any;
}

interface Candidate {
  id: string;
  chairmanName: string;
  viceChairmanName: string;
}

interface Vote {
  candidateId: string;
}

interface Election {
  id: string;
  title: string;
  startDate: string;
  candidates: Candidate[];
  votes: Vote[];
}
export default function Dashboard() {
  const [today, setToday] = useState("");
  const [counts, setCounts] = useState({
    organizations: 0,
    users: 0,
    voters: 0,
    candidates: 0,
  });
  const router = useRouter();
  const [elections, setElections] = useState<Election[]>([]);
  useEffect(() => {
    async function fetchData() {
      // Ambil elections sekalian candidates + votes
      const res = await fetch("/api/admin/elections");
      const json = await res.json();

      if (json.ok) {
        const sorted = json.data.sort(
          (a: Election, b: Election) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        setElections(sorted.slice(0, 2)); // ambil 2 terakhir
      }
    }

    fetchData();
  }, []);
  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long", // <--- tambahin ini
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setToday(now.toLocaleDateString("id-ID", options));
  }, []);

  const [users, setUsers] = useState<Entity[]>([]);
  const [organizations, setOrganizations] = useState<Entity[]>([]);
  const [votes, setVotes] = useState<Entity[]>([]);
  const [candidates, setCandidates] = useState<Entity[]>([]);

  useEffect(() => {
    async function fetchData() {
      const orgRes = await fetch("/api/admin/organizations");
      const orgJson = await orgRes.json();
      setOrganizations(orgJson.data || []); // ambil array di dalam `data`

      const userRes = await fetch("/api/admin/users");
      const userJson = await userRes.json();
      setUsers(userJson.data || []);

      const voteRes = await fetch("/api/admin/votes");
      const voteJson = await voteRes.json();
      setVotes(voteJson.data || []);

      const candRes = await fetch("/api/admin/candidates");
      const candJson = await candRes.json();
      setCandidates(candJson.data || []);
    }

    const fetchCounts = async () => {
      try {
        const [orgRes, userRes, voterRes, candidateRes] = await Promise.all([
          fetch("/api/admin/organizations"),
          fetch("/api/admin/users"),
          fetch("/api/admin/votes"),
          fetch("/api/admin/candidates"),
        ]);

        const [orgData, userData, voterData, candidateData] = await Promise.all(
          [orgRes.json(), userRes.json(), voterRes.json(), candidateRes.json()]
        );

        setCounts({
          organizations: orgData.length || 0,
          users: userData.length || 0,
          voters: voterData.length || 0,
          candidates: candidateData.length || 0,
        });
      } catch (err) {
        console.error("Gagal fetch counts:", err);
      }
    };

    fetchCounts();
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const data = await res.json();
      if (data.ok) router.push("/");
    } catch (err) {
      console.error(err);
      alert("Logout gagal");
    }
  };

  // Tambah state untuk vote terbaru
  const [recentVotes, setRecentVotes] = useState<any[]>([]);

  useEffect(() => {
    async function fetchRecentVotes() {
      try {
        const res = await fetch("/api/admin/votes");
        const json = await res.json();
        if (json.ok) {
          // urutkan vote terbaru
          const sorted = json.data.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setRecentVotes(sorted.slice(0, 6)); // ambil 5 terakhir
        }
      } catch (err) {
        console.error("Gagal ambil vote terbaru:", err);
      }
    }

    fetchRecentVotes();
  }, []);
  const [time, setTime] = useState("");
  useEffect(() => {
    // Update jam real-time
    const interval = setInterval(() => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col py-6 px-6">
        <div className="text-xl font-bold text-[#0B7077] mb-8">KlikVote</div>
        <nav className="flex flex-col gap-8 text-gray-500 text-left">
          <span className="bg-[#0B7077] text-white rounded-md p-2 cursor-pointer flex items-center gap-2 text-left">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
              />
            </svg>
            Dashboard
          </span>
          <Link
            href="/admin/users"
            className="hover:bg-[#0B7077] p-2  hover:text-white rounded-md cursor-pointer flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            User
          </Link>
          <Link
            href="/admin/organizations"
            className="hover:bg-[#0B7077] p-2  hover:text-white rounded-md cursor-pointer flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
              />
            </svg>
            Organisasi
          </Link>
          <Link
            href="/admin/candidates"
            className="hover:bg-[#0B7077] p-2  hover:text-white rounded-md cursor-pointer flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
              />
            </svg>
            Kandidat
          </Link>
          <Link
            href="/admin/votes"
            className="hover:bg-[#0B7077] p-2  hover:text-white rounded-md cursor-pointer flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
              />
            </svg>
            Voting
          </Link>
          <Link
            href="/admin/elections"
            className="hover:bg-[#0B7077] p-2  hover:text-white rounded-md cursor-pointer flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
            Hasil
          </Link>
        </nav>
        <div className="flex-1"></div>
        <button
          onClick={handleLogout}
          className="mt-4 text-red-700 p-2 rounded-md flex items-center gap-2 "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
            />
          </svg>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 flex flex-col gap-6">
        {/* Welcome Banner */}
        <div className="bg-[#0B7077] text-white rounded-lg px-6 flex gap-6 justify-between items-center">
          <div>
            <h2 className="font-bold text-xl">Selamat Datang, Admin!</h2>
            <p>
              Sebuah kesempatan baru bagi Admin untuk memastikan jalannya proses
              pemilihan tetap transparan, teratur, dan mudah diakses oleh
              seluruh pengguna.
            </p>
          </div>
          <div>
            <Image
              src="/images/welcome.svg"
              alt="Illustration"
              width={400}
              height={400}
              className="w-2xl"
            />
          </div>
        </div>
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-4 flex flex-col items-center shadow-xl border border-[#0B7077]">
            <div className="text-4xl text-[#0B7077]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-9"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                />
              </svg>
            </div>
            <p className="mt-2 font-bold text-[#0B7077]  text-lg">
              {organizations.length}
            </p>
            <span className="text-gray-400 text-sm mt-1">Organisasi</span>
          </div>
          <div className="bg-white rounded-lg p-4 flex flex-col items-center shadow-xl border border-[#0B7077]">
            <div className="text-4xl text-[#0B7077]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-9"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>
            <p className="mt-2 font-bold text-[#0B7077] text-lg">
              {counts.users}
            </p>
            <span className="text-gray-400 text-sm mt-1">User</span>
          </div>
          <div className="bg-white rounded-lg p-4 flex flex-col items-center shadow-xl border border-[#0B7077]">
            <div className="text-4xl text-[#0B7077]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-9"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
                />
              </svg>
            </div>
            <p className="mt-2 text-[#0B7077] font-bold text-lg">
              {votes.length}
            </p>
            <span className="text-gray-400 text-sm mt-1">Voter</span>
          </div>
          <div className="bg-white rounded-lg p-4 flex flex-col items-center shadow-xl border border-[#0B7077]">
            <div className="text-4xl text-[#0B7077]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-9"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                />
              </svg>
            </div>
            <p className="mt-2 text-[#0B7077] font-bold text-lg">
              {candidates.length}
            </p>
            <span className="text-gray-400 text-sm mt-1">Kandidat</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0B7077] rounded-lg p-4 flex gap-3 justify-center items-center shadow-xl border">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z"
              />
            </svg>
            {today}
          </div>
          <div className="bg-[#0B7077] rounded-lg p-4 flex gap-3 justify-center items-center shadow-xl border text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z"
              />
            </svg>
            {time}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {elections.map((election) => {
            const labels = election.candidates.map(
              (c) => `${c.chairmanName} & ${c.viceChairmanName}`
            );
            const voteCounts = election.candidates.map(
              (c) => election.votes.filter((v) => v.candidateId === c.id).length
            );
            const colors = [
              "#0B7077",
              "#16A085",
              "#1ABC9C",
              "#27AE60",
              "#2980B9",
              "#8E44AD",
              "#F39C12",
            ];

            return (
              <div
                key={election.id}
                className="bg-white border border-[#0B7077] rounded-lg p-6 shadow-xl"
              >
                <h3 className="text-xl font-bold text-[#0B7077] mb-4">
                  {election.title}
                </h3>
                <div className="flex justify-center gap-3">
                  {/* Pie Chart */}
                  <div className="w-[150px] h-[150px]">
                    <Pie
                      data={{
                        labels,
                        datasets: [
                          {
                            data: voteCounts,
                            backgroundColor: colors,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                      }}
                    />
                  </div>

                  {/* Custom Legend */}
                  <div className="flex flex-col gap-2 justify-center">
                    {labels.map((label, i) => (
                      <div key={i} className="flex gap-1">
                        <span
                          className="w-3 h-3 mt-0.5 rounded-full shrink-0"
                          style={{ backgroundColor: colors[i] }}
                        />
                        <span className="text-xs text-gray-700">
                          {label} — <b>{voteCounts[i]} vote</b>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-64 flex flex-col gap-6 pr-6 py-8">
        {/* Profile */}
        <div className="bg-white shadow-xl border border-[#0B7077] rounded-lg p-4 flex flex-col items-center">
          <Image
            src="/images/alif.png"
            alt="Julia Grey"
            width={100}
            height={100}
            className="rounded-md mb-2"
          />
          <p className="font-semibold text-[#0B7077]">Alif Essa Nurcahyani</p>
          <span className="text-gray-400 text-sm">Admin</span>
          <div className="flex gap-4 mt-4">
            <div className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                className="w-8 h-8 text-[#0B7077]"
                fill="currentColor"
              >
                <path d="M196.3 512L103.4 512L103.4 212.9L196.3 212.9L196.3 512zM149.8 172.1C120.1 172.1 96 147.5 96 117.8C96 103.5 101.7 89.9 111.8 79.8C121.9 69.7 135.6 64 149.8 64C164 64 177.7 69.7 187.8 79.8C197.9 89.9 203.6 103.6 203.6 117.8C203.6 147.5 179.5 172.1 149.8 172.1zM543.9 512L451.2 512L451.2 366.4C451.2 331.7 450.5 287.2 402.9 287.2C354.6 287.2 347.2 324.9 347.2 363.9L347.2 512L254.4 512L254.4 212.9L343.5 212.9L343.5 253.7L344.8 253.7C357.2 230.2 387.5 205.4 432.7 205.4C526.7 205.4 544 267.3 544 347.7L544 512L543.9 512z" />
              </svg>
            </div>
            <div className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                className="w-8 h-8 text-[#0B7077]"
                fill="currentColor"
              >
                <path d="M266.1 392.7C266.1 413.6 255.2 447.8 229.4 447.8C203.6 447.8 192.7 413.6 192.7 392.7C192.7 371.8 203.6 337.6 229.4 337.6C255.2 337.6 266.1 371.8 266.1 392.7zM560 342.2C560 374.1 556.8 407.9 542.5 437.2C504.6 513.8 400.4 512 325.8 512C250 512 139.6 514.7 100.2 437.2C85.6 408.2 80 374.1 80 342.2C80 300.3 93.9 260.7 121.5 228.6C116.3 212.8 113.8 196.2 113.8 179.8C113.8 158.3 118.7 147.5 128.4 128C173.7 128 202.7 137 237.2 164C266.2 157.1 296 154 325.9 154C352.9 154 380.1 156.9 406.3 163.2C440.3 136.5 469.3 128 514.1 128C523.9 147.5 528.7 158.3 528.7 179.8C528.7 196.2 526.1 212.5 521 228C548.5 260.4 560 300.3 560 342.2zM495.7 392.7C495.7 348.8 469 310.1 422.2 310.1C403.3 310.1 385.2 313.5 366.2 316.1C351.3 318.4 336.4 319.3 321.1 319.3C305.9 319.3 291 318.4 276 316.1C257.3 313.5 239 310.1 220 310.1C173.2 310.1 146.5 348.8 146.5 392.7C146.5 480.5 226.9 494 296.9 494L345.1 494C415.4 494 495.7 480.6 495.7 392.7zM413.1 337.6C387.3 337.6 376.4 371.8 376.4 392.7C376.4 413.6 387.3 447.8 413.1 447.8C438.9 447.8 449.8 413.6 449.8 392.7C449.8 371.8 438.9 337.6 413.1 337.6z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Recent Votes */}
        <div className="bg-white shadow-xl border border-[#0B7077] rounded-lg p-4">
          <h3 className="font-semibold text-[#0B7077] mb-3 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Vote Terbaru
          </h3>
          <ul className="flex flex-col gap-3">
            {recentVotes.length === 0 ? (
              <li className="text-gray-400 text-sm">Belum ada vote</li>
            ) : (
              recentVotes.map((v, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 border-b border-[#0B7077]/15 pb-2"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#0B7077]">
                      {v.user?.name || "Pengguna"}
                    </span>
                    <span className="text-xs text-gray-500">
                      Vote ke{" "}
                      <b>
                        {v.candidate?.chairmanName} &{" "}
                        {v.candidate?.viceChairmanName}
                      </b>
                    </span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </aside>
    </div>
  );
}
