"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Organization {
  id: string;
  name: string;
  description?: string;
  logo?: string;
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
  });
  const [today, setToday] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Ambil tanggal & data user
  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setToday(now.toLocaleDateString("id-ID", options));
  }, []);
  const fetchOrganizations = async () => {
    const res = await fetch("/api/admin/organizations");
    const data = await res.json();
    if (data.ok) setOrganizations(data.data);
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    if (logoFile) form.append("logo", logoFile);

    const res = await fetch("/api/admin/organizations", {
      method: "POST",
      body: form, // Content-Type otomatis multipart/form-data
    });

    const data = await res.json();
    if (data.ok) {
      setOrganizations([data.data, ...organizations]);
      setFormData({ name: "", description: "", logo: "" });
      setLogoFile(null);
      setShowModal(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus organisasi ini?")) return;
    const res = await fetch(`/api/admin/organizations/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.ok) {
      setOrganizations(organizations.filter((org) => org.id !== id));
    }
  };

  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingOrg) return;

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    if (logoFile) form.append("logo", logoFile);

    const res = await fetch(`/api/admin/organizations/${editingOrg.id}`, {
      method: "PUT",
      body: form,
    });

    const data = await res.json();
    if (data.ok) {
      setOrganizations(
        organizations.map((org) => (org.id === editingOrg.id ? data.data : org))
      );
      setFormData({ name: "", description: "", logo: "" });
      setLogoFile(null);
      setEditingOrg(null);
      setShowModal(false);
    }
  };
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col py-6 px-6">
        <div className="text-xl font-bold text-[#0B7077] mb-8">KlikVote</div>
        <nav className="flex flex-col gap-8 text-gray-500 text-left">
          <Link
            href="/admin"
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
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
              />
            </svg>
            Dashboard
          </Link>
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
            className="bg-[#0B7077] text-white rounded-md p-2 cursor-pointer flex items-center gap-2 text-left"
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 flex flex-col gap-6">
        {/* Welcome Banner */}
        <div className="bg-[#0B7077] text-white rounded-lg px-6 flex gap-6 justify-between items-center">
          <div>
            <h2 className="font-bold text-xl">Selamat Datang, Admin!</h2>
            <p>
              Hari ini adalah <b>{today}</b>. sebuah kesempatan baru bagi Admin
              untuk memastikan jalannya proses pemilihan tetap transparan,
              teratur, dan mudah diakses oleh seluruh pengguna.
            </p>
          </div>
          <div>
            <Image
              src="/images/organizations.svg"
              alt="Illustration"
              width={350}
              height={350}
              className=""
            />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow border border-[#0B7077] p-6">
          <div className="p-8">
            {" "}
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-[#0B7077] mb-4">
                Organisasi
              </h1>

              {/* Form tambah */}
              <button
                onClick={() => setShowModal(true)}
                className="bg-[#0B7077] text-white px-4 py-2 rounded mb-4"
              >
                Tambah
              </button>
            </div>
            {showModal && (
              <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg p-6 w-96 relative text-[#0B7077]">
                  <h2 className="text-xl font-bold mb-4">Tambah Organisasi</h2>
                  <form onSubmit={handleSubmit} className="space-y-2">
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="border px-3 py-2 rounded w-full"
                      required
                    />
                    <input
                      type="text"
                      name="description"
                      placeholder="Description"
                      value={formData.description}
                      onChange={handleChange}
                      className="border px-3 py-2 rounded w-full"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                      className="border px-3 py-2 rounded w-full"
                    />
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 rounded border"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="bg-[#0B7077] text-white px-4 py-2 rounded"
                      >
                        Simpan
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {/* Modal untuk tambah/edit */}
            {showModal && (
              <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg p-6 w-96 relative text-[#0B7077]">
                  <h2 className="text-xl font-bold mb-4">
                    {editingOrg ? "Edit Organisasi" : "Tambah Organisasi"}
                  </h2>
                  <form
                    onSubmit={editingOrg ? handleEditSubmit : handleSubmit}
                    className="space-y-2"
                  >
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="border px-3 py-2 rounded w-full"
                      required
                    />
                    <input
                      type="text"
                      name="description"
                      placeholder="Description"
                      value={formData.description}
                      onChange={handleChange}
                      className="border px-3 py-2 rounded w-full"
                    />
                    {/* Preview logo lama kalau sedang edit */}
                    {editingOrg?.logo && !logoFile && (
                      <div className="mb-2">
                        <p className="text-sm text-gray-600 mb-1">
                          Logo saat ini:
                        </p>
                        <Image
                          src={editingOrg.logo}
                          alt={editingOrg.name}
                          width={80}
                          height={80}
                          className="rounded border"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                      className="border px-3 py-2 rounded w-full"
                    />
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowModal(false);
                          setEditingOrg(null);
                        }}
                        className="px-4 py-2 rounded border"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="bg-[#0B7077] text-white px-4 py-2 rounded"
                      >
                        Simpan
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {/* List organisasi */}
            <ul className="space-y-2">
              {organizations.map((org) => (
                <li
                  key={org.id}
                  className="flex justify-between items-center border border-[#0B7077] p-3 rounded"
                >
                  <div className="flex items-center gap-3">
                    {/* Logo */}
                    {org.logo && (
                      <Image
                        src={org.logo}
                        alt={org.name}
                        width={40}
                        height={40}
                        className=" object-cover"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-[#0B7077]">{org.name}</p>
                      <p className="text-gray-500">{org.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingOrg(org);
                        setFormData({
                          name: org.name,
                          description: org.description || "",
                          logo: org.logo || "",
                        });
                        setShowModal(true);
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(org.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
