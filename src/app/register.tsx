import { useState } from "react";
export default function Register() {
  const [nim, setNim] = useState("");
  const [name, setName] = useState("");
  const [program, setProgram] = useState("");
  const [password, setPassword] = useState("");
  async function submit() {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nim, name, program, password }),
    });
    const j = await res.json();
    if (res.ok) window.location.href = "/";
    else alert(j.error || "Error");
  }
  return (
    <div className="p-6">
      <h1>Register</h1>
      <input
        value={nim}
        onChange={(e) => setNim(e.target.value)}
        placeholder="NIM"
      />
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={program}
        onChange={(e) => setProgram(e.target.value)}
        placeholder="Program"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={submit}>Register</button>
    </div>
  );
}
