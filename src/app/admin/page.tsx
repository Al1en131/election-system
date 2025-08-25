"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const activities = [
  {
    name: "Amanda Lock",
    time: "October 2, 2023 - 10:42 PM",
    avatar: "/images/avatar1.jpg",
  },
  {
    name: "Selina Fye",
    time: "October 2, 2023 - 09:16 PM",
    avatar: "/images/avatar2.jpg",
  },
  {
    name: "Rin Vulcan",
    time: "October 2, 2023 - 05:23 PM",
    avatar: "/images/avatar3.jpg",
  },
];

const reviews = [
  { name: "Calipso Sensations", score: 7.2 },
  { name: "V Tech Mattee", score: 9.1 },
  { name: "Emerald V6", score: 7.9 },
];

const alerts = [
  {
    title: "Upcoming Elections...",
    date: "3 October, 2023 - 07:26 AM",
    img: "/images/alert1.jpg",
  },
  {
    title: "New Releases ...",
    date: "3 October, 2023 - 05:17 AM",
    img: "/images/alert2.jpg",
  },
  {
    title: "Forest Inferno Cont...",
    date: "2 October, 2023 - 10:29 PM",
    img: "/images/alert3.jpg",
  },
  {
    title: "Flood Damage in...",
    date: "2 October, 2023 - 07:16 PM",
    img: "/images/alert4.jpg",
  },
];

export default function Dashboard() {
  const [draft, setDraft] = useState("");
  const [today, setToday] = useState("");

  useEffect(() => {
    const now = new Date();
    // Format tanggal: 25 Oktober 2025
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setToday(now.toLocaleDateString("id-ID", options));
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
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 flex flex-col gap-6">
        {/* Welcome Banner */}
        <div className="bg-[#0B7077] text-white rounded-lg p-6 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-xl">Selamat Datang, Admin!</h2>
            <p>
              Hari ini adalah <b>{today}</b>. Terdapat <b>126</b> berita dan
              notifikasi, serta <b>3</b> pesan yang menunggu tanggapan.
            </p>
          </div>
          <div>
            <Image
              src="/images/welcome.svg"
              alt="Illustration"
              width={300}
              height={300}
            />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Weather */}
          <div className="bg-white rounded-lg p-4 flex flex-col items-center">
            <div className="text-4xl">🌧️</div>
            <p className="mt-2 font-bold text-lg">16° (Rain)</p>
            <span className="text-gray-400 text-sm mt-1">Austin, TX (USA)</span>
          </div>

          {/* Colleagues Activity */}
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold mb-3">Colleagues' Activity</h3>
            <ul className="flex flex-col gap-3">
              {activities.map((act) => (
                <li key={act.name} className="flex items-center gap-3">
                  <Image
                    src={act.avatar}
                    alt={act.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium">{act.name}</p>
                    <p className="text-gray-400 text-sm">{act.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Draft */}
          <div className="bg-white rounded-lg p-4 flex flex-col">
            <h3 className="font-semibold mb-2">Quick Draft</h3>
            <textarea
              placeholder="Write something..."
              className="border border-gray-300 rounded p-2 mb-2 flex-1 resize-none"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <button className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
              Continue
            </button>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold mb-4">Your Latest Reviews</h3>
          <ul className="flex flex-col gap-3">
            {reviews.map((rev) => (
              <li key={rev.name} className="flex justify-between items-center">
                <span>{rev.name}</span>
                <span className="bg-purple-600 text-white px-3 py-1 rounded">
                  {rev.score}
                </span>
                <button className="bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200">
                  Full Review
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-64 flex flex-col gap-6 p-6">
        {/* Profile */}
        <div className="bg-white rounded-lg p-4 flex flex-col items-center">
          <Image
            src="/images/alif.png"
            alt="Julia Grey"
            width={100}
            height={100}
            className="rounded-full mb-2"
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

        {/* Latest Alerts */}
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold mb-2">Latest Alerts</h3>
          <ul className="flex flex-col gap-2">
            {alerts.map((a) => (
              <li key={a.title} className="flex items-center gap-2">
                <Image
                  src={a.img}
                  alt={a.title}
                  width={40}
                  height={40}
                  className="rounded"
                />
                <div>
                  <p className="text-sm font-medium">{a.title}</p>
                  <span className="text-gray-400 text-xs">{a.date}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
