import { useState } from "react";
export default function Login() {
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  async function submit() {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nim, password }),
    });
    if (res.ok) window.location.href = "/orgs";
    else alert((await res.json()).error);
  }
  return (
    <div className="p-6">
      <h1>Login</h1>
      <input
        value={nim}
        onChange={(e) => setNim(e.target.value)}
        placeholder="NIM"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={submit}>Login</button>
    </div>
  );
}
