"use client";

import { FormEvent, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin";
import type { ContactPage } from "@/lib/types";

const empty: ContactPage = {
  title: "",
  intro: "",
  phone: "",
  email: "",
  address: "",
  hours: "",
  mapEmbed: "",
  formTitle: "Санал хүсэлт",
};

export default function AdminContactPage() {
  const [form, setForm] = useState<ContactPage>(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch<ContactPage>("/mail/contact")
      .then(setForm)
      .catch((err) => setError(err instanceof Error ? err.message : "Ачааллаж чадсангүй"));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const saved = await adminFetch<ContactPage>("/mail/contact", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Хадгалж чадсангүй");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-4xl">Холбоо барих</h1>
      <form onSubmit={onSubmit} className="mt-8 grid gap-4">
        <input
          placeholder="Гарчиг"
          value={form.title || ""}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="border border-line bg-cream px-3 py-3 text-sm"
        />
        <textarea
          placeholder="Тайлбар"
          value={form.intro || ""}
          onChange={(e) => setForm((f) => ({ ...f, intro: e.target.value }))}
          className="h-20 border border-line bg-cream px-3 py-3 text-sm"
        />
        <input
          placeholder="Утас"
          value={form.phone || ""}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          className="border border-line bg-cream px-3 py-3 text-sm"
        />
        <input
          placeholder="Имэйл"
          value={form.email || ""}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="border border-line bg-cream px-3 py-3 text-sm"
        />
        <textarea
          placeholder="Хаяг — мөр бүрт нэг мөр"
          value={form.address || ""}
          onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
          className="h-24 border border-line bg-cream px-3 py-3 text-sm"
        />
        <textarea
          placeholder="Цагийн хуваарь"
          value={form.hours || ""}
          onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value }))}
          className="h-20 border border-line bg-cream px-3 py-3 text-sm"
        />
        <textarea
          placeholder="Google Maps embed холбоос (iframe-ийн src)"
          value={form.mapEmbed || ""}
          onChange={(e) => setForm((f) => ({ ...f, mapEmbed: e.target.value }))}
          className="h-24 border border-line bg-cream px-3 py-3 text-sm"
        />
        <input
          placeholder="Формын гарчиг"
          value={form.formTitle || ""}
          onChange={(e) => setForm((f) => ({ ...f, formTitle: e.target.value }))}
          className="border border-line bg-cream px-3 py-3 text-sm"
        />
        {error ? <p className="text-sm text-accent">{error}</p> : null}
        <button
          disabled={saving}
          className="w-fit bg-brand px-8 py-3 text-xs uppercase tracking-[0.16em] text-cream disabled:opacity-60"
        >
          {saving ? "Хадгалж байна…" : "Хадгалах"}
        </button>
      </form>
    </div>
  );
}
