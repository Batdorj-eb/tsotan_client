"use client";

import { FormEvent, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin";
import type { Category } from "@/lib/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("0");

  async function load() {
    setCategories(await adminFetch<Category[]>("/category/list"));
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await adminFetch("/category/create", {
      method: "POST",
      body: JSON.stringify({ name, parentId: Number(parentId) }),
    });
    setName("");
    await load();
  }

  async function remove(id: number) {
    if (!confirm("Устгах уу?")) return;
    await adminFetch(`/category/delete/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-4xl">Категори</h1>
      <form onSubmit={onSubmit} className="mt-6 flex flex-wrap gap-3">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Нэр"
          className="border border-line bg-cream px-3 py-2 text-sm"
        />
        <select
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          className="border border-line bg-cream px-3 py-2 text-sm"
        >
          <option value="0">Үндсэн</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button className="bg-brand px-4 py-2 text-xs uppercase tracking-[0.14em] text-cream">Нэмэх</button>
      </form>
      <ul className="mt-8 space-y-2 text-sm">
        {categories.map((c) => (
          <li key={c.id} className="flex items-center justify-between border-b border-line py-2">
            <span>
              {c.name}
              {c.parentId ? <span className="ml-2 text-muted">#{c.parentId}</span> : null}
            </span>
            <button onClick={() => remove(c.id)} className="text-accent">Устгах</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
