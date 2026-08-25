"use client";

import { FormEvent, useEffect, useState } from "react";
import { adminFetch, adminUpload } from "@/lib/admin";
import { toast } from "@/lib/toast";
import type { ServiceItem, ServicePage } from "@/lib/types";

const emptyPage: ServicePage = {
  title: "",
  intro: "",
  items: [],
};

export default function AdminServicesPage() {
  const [page, setPage] = useState<ServicePage>(emptyPage);
  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newPreview, setNewPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const data = await adminFetch<ServicePage>("/mail/service");
    setPage(data);
    setTitle(data.title || "");
    setIntro(data.intro || "");
  }

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : "Ачааллаж чадсангүй"));
  }, []);

  async function saveMeta(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const saved = await adminFetch<ServicePage>("/mail/service", {
        method: "POST",
        body: JSON.stringify({ title, intro }),
      });
      setPage(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Хадгалж чадсангүй");
    } finally {
      setSaving(false);
    }
  }

  async function addItem(e: FormEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !newImage) {
      toast("Нэр, зураг оруулна уу", "error");
      return;
    }
    setError("");
    try {
      await adminFetch("/mail/service/items", {
        method: "POST",
        body: JSON.stringify({ title: newTitle.trim(), image: newImage }),
      });
      setNewTitle("");
      setNewImage("");
      setNewPreview("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Нэмж чадсангүй");
    }
  }

  async function updateItem(id: number, payload: { title?: string; image?: string; sortOrder?: number }, opts?: { silent?: boolean }) {
    await adminFetch(`/mail/service/items/${id}`, {
      method: "POST",
      body: JSON.stringify(payload),
    }, opts);
    await load();
  }

  async function remove(id: number) {
    if (!confirm("Устгах уу?")) return;
    await adminFetch(`/mail/service/items/${id}`, { method: "DELETE" });
    await load();
  }

  async function move(item: ServiceItem, direction: -1 | 1) {
    const list = page.items;
    const index = list.findIndex((row) => row.id === item.id);
    const swap = list[index + direction];
    if (!item.id || !swap?.id) return;
    const a = item.sortOrder ?? index + 1;
    const b = swap.sortOrder ?? index + direction + 1;
    await Promise.all([
      adminFetch(
        `/mail/service/items/${item.id}`,
        { method: "POST", body: JSON.stringify({ sortOrder: b }) },
        { silent: true },
      ),
      adminFetch(
        `/mail/service/items/${swap.id}`,
        { method: "POST", body: JSON.stringify({ sortOrder: a }) },
        { silent: true },
      ),
    ]);
    toast("Дараалал солигдлоо");
    await load();
  }

  async function replaceImage(id: number, file: File) {
    const uploaded = await adminUpload(file);
    await updateItem(id, { image: uploaded.path });
  }

  return (
    <div className="max-w-5xl">
      <h1 className="font-display text-4xl">Үйлчилгээ</h1>
      <p className="mt-2 text-sm text-muted">/service хуудасны гарчиг, тайлбар, картууд.</p>

      <form onSubmit={saveMeta} className="mt-8 grid gap-4">
        <input
          placeholder="Гарчиг"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-line bg-cream px-3 py-3 text-sm"
        />
        <textarea
          placeholder="Тайлбар"
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          className="h-20 border border-line bg-cream px-3 py-3 text-sm"
        />
        <button
          disabled={saving}
          className="w-fit bg-brand px-8 py-3 text-xs uppercase tracking-[0.16em] text-cream disabled:opacity-60"
        >
          {saving ? "Хадгалж байна…" : "Гарчиг хадгалах"}
        </button>
      </form>

      <form onSubmit={addItem} className="mt-12 grid gap-4 border border-line bg-cream p-5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-gold">Шинэ үйлчилгээ</p>
        <input
          placeholder="Нэр"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="border border-line bg-paper px-3 py-3 text-sm"
        />
        <label className="cursor-pointer border border-dashed border-line px-3 py-6 text-center text-sm text-muted">
          {newPreview ? "Зураг солих" : "Зураг сонгох"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              const local = URL.createObjectURL(file);
              setNewPreview(local);
              const uploaded = await adminUpload(file);
              setNewImage(uploaded.path);
              setNewPreview(uploaded.url || local);
            }}
          />
        </label>
        {newPreview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={newPreview} alt="" className="h-40 w-full object-cover" />
        ) : null}
        <button className="w-fit bg-brand px-8 py-3 text-xs uppercase tracking-[0.16em] text-cream">
          Нэмэх
        </button>
      </form>

      {error ? <p className="mt-6 text-sm text-accent">{error}</p> : null}

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {page.items.map((item, index) => (
          <article key={item.id} className="border border-line bg-cream p-3">
            <div className="aspect-[4/5] overflow-hidden bg-paper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
            </div>
            <input
              defaultValue={item.title}
              key={`${item.id}-${item.title}`}
              className="mt-3 w-full border border-line bg-paper px-3 py-2 text-sm"
              onBlur={(e) => {
                const next = e.target.value.trim();
                if (next && next !== item.title) {
                  updateItem(item.id, { title: next });
                }
              }}
            />
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <label className="cursor-pointer border border-line px-3 py-2">
                Зураг солих
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (file) replaceImage(item.id, file);
                  }}
                />
              </label>
              <button
                type="button"
                disabled={index === 0}
                className="border border-line px-3 py-2 disabled:opacity-40"
                onClick={() => move(item, -1)}
              >
                Дээш
              </button>
              <button
                type="button"
                disabled={index === page.items.length - 1}
                className="border border-line px-3 py-2 disabled:opacity-40"
                onClick={() => move(item, 1)}
              >
                Доош
              </button>
              <button
                type="button"
                className="border border-line px-3 py-2 text-accent"
                onClick={() => remove(item.id)}
              >
                Устгах
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
