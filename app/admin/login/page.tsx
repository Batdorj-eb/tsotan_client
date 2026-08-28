"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin, setAdminSession } from "@/lib/admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const data = await adminLogin(username, password);
      setAdminSession(data.token, data.user);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Алдаа");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-5">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-cream p-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Tsotan</p>
        <h1 className="mt-2 font-display text-3xl">Админ нэвтрэх</h1>
        <label className="mt-8 block text-xs uppercase tracking-[0.16em] text-muted">
          Нэвтрэх нэр
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-2 w-full border border-line bg-paper px-3 py-3 text-sm outline-none"
          />
        </label>
        <label className="mt-5 block text-xs uppercase tracking-[0.16em] text-muted">
          Нууц үг
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border border-line bg-paper px-3 py-3 text-sm outline-none"
          />
        </label>
        <button className="mt-8 w-full bg-brand py-3 text-xs uppercase tracking-[0.18em] text-cream">
          Нэвтрэх
        </button>
        {error ? <p className="mt-4 text-sm text-accent">{error}</p> : null}
      </form>
    </div>
  );
}
