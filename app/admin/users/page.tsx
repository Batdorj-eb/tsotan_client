"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/admin";
import { useAdminUser } from "@/components/admin-user";

type StaffUser = {
  id: number;
  username: string;
  email?: string | null;
  role: "ADMIN" | "EDITOR";
  isActive: boolean;
  lastLogin?: string | null;
  createdAt?: string;
};

function formatWhen(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("mn-MN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { user: me, isAdmin } = useAdminUser();
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "EDITOR">("EDITOR");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [resetId, setResetId] = useState<number | null>(null);
  const [resetPassword, setResetPassword] = useState("");

  async function load() {
    setUsers(await adminFetch<StaffUser[]>("/auth/users"));
  }

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/admin");
      return;
    }
    load().catch((err) => setError(err instanceof Error ? err.message : "Ачааллаж чадсангүй"));
  }, [isAdmin, router]);

  if (!isAdmin) return null;

  async function createUser(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await adminFetch("/auth/users", {
        method: "POST",
        body: JSON.stringify({ username, password, role }),
      });
      setUsername("");
      setPassword("");
      setRole("EDITOR");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Бүртгэж чадсангүй");
    } finally {
      setSaving(false);
    }
  }

  async function changeRole(id: number, next: "ADMIN" | "EDITOR") {
    setError("");
    try {
      await adminFetch(`/auth/users/${id}`, {
        method: "POST",
        body: JSON.stringify({ role: next }),
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Эрх солиж чадсангүй");
    }
  }

  async function toggleActive(user: StaffUser) {
    setError("");
    try {
      await adminFetch(`/auth/users/${user.id}`, {
        method: "POST",
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Төлөв солиж чадсангүй");
    }
  }

  async function savePassword(id: number) {
    if (resetPassword.length < 6) {
      setError("Нууц үг хамгийн багадаа 6 тэмдэгт");
      return;
    }
    setError("");
    try {
      await adminFetch(`/auth/users/${id}`, {
        method: "POST",
        body: JSON.stringify({ password: resetPassword }),
      });
      setResetId(null);
      setResetPassword("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Нууц үг солиж чадсангүй");
    }
  }

  async function remove(id: number) {
    if (!confirm("Хэрэглэгчийг устгах уу?")) return;
    setError("");
    try {
      await adminFetch(`/auth/users/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Устгаж чадсангүй");
    }
  }

  return (
    <div>
      <h1 className="font-display text-4xl">Хэрэглэгч</h1>
      <p className="mt-2 text-sm text-muted">
        Админ бүх эрхтэй. Editor зөвхөн нэмж, засна — устгах эрхгүй.
      </p>

      <form onSubmit={createUser} className="mt-8 grid gap-3 border border-line bg-cream p-5 sm:grid-cols-2">
        <p className="sm:col-span-2 text-[11px] uppercase tracking-[0.18em] text-gold">Шинэ хэрэглэгч</p>
        <input
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Нэвтрэх нэр"
          className="border border-line bg-paper px-3 py-2 text-sm"
        />
        <input
          required
          type="password"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Нууц үг"
          className="border border-line bg-paper px-3 py-2 text-sm"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "ADMIN" | "EDITOR")}
          className="border border-line bg-paper px-3 py-2 text-sm"
        >
          <option value="EDITOR">Editor</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button
          disabled={saving}
          className="bg-brand px-4 py-2 text-xs uppercase tracking-[0.14em] text-cream disabled:opacity-60"
        >
          {saving ? "Бүртгэж байна…" : "Бүртгэх"}
        </button>
      </form>

      {error ? <p className="mt-4 text-sm text-accent">{error}</p> : null}

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-[11px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="py-3">Нэр</th>
              <th>Эрх</th>
              <th>Төлөв</th>
              <th>Сүүлд нэвтэрсэн</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const self = user.id === me?.id;
              return (
                <tr key={user.id} className="border-b border-line align-top">
                  <td className="py-3">
                    {user.username}
                    {self ? <span className="ml-2 text-xs text-muted">та</span> : null}
                  </td>
                  <td className="py-3">
                    <select
                      value={user.role}
                      disabled={self}
                      onChange={(e) => changeRole(user.id, e.target.value as "ADMIN" | "EDITOR")}
                      className="border border-line bg-paper px-2 py-1 text-sm disabled:opacity-60"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="EDITOR">Editor</option>
                    </select>
                  </td>
                  <td className="py-3">{user.isActive ? "Идэвхтэй" : "Идэвхгүй"}</td>
                  <td className="py-3 text-muted">{formatWhen(user.lastLogin)}</td>
                  <td className="py-3 text-right">
                    <div className="flex flex-wrap justify-end gap-3">
                      {!self ? (
                        <button type="button" onClick={() => toggleActive(user)} className="text-brand">
                          {user.isActive ? "Идэвхгүй болгох" : "Идэвхжүүлэх"}
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => {
                          setResetId(user.id);
                          setResetPassword("");
                        }}
                        className="text-brand"
                      >
                        Нууц үг
                      </button>
                      {!self ? (
                        <button type="button" onClick={() => remove(user.id)} className="text-accent">
                          Устгах
                        </button>
                      ) : null}
                    </div>
                    {resetId === user.id ? (
                      <div className="mt-2 flex justify-end gap-2">
                        <input
                          type="password"
                          minLength={6}
                          value={resetPassword}
                          onChange={(e) => setResetPassword(e.target.value)}
                          placeholder="Шинэ нууц үг"
                          className="border border-line bg-paper px-2 py-1 text-sm"
                        />
                        <button type="button" onClick={() => savePassword(user.id)} className="text-brand">
                          Хадгалах
                        </button>
                        <button
                          type="button"
                          onClick={() => setResetId(null)}
                          className="text-muted"
                        >
                          Болих
                        </button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
