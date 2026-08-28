"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { adminFetch, adminUpload } from "@/lib/admin";
import { toast } from "@/lib/toast";
import { childServices, rootServices } from "@/lib/services";
import type { ServiceItem, ServicePage } from "@/lib/types";
import { useAdminUser } from "@/components/admin-user";

const emptyPage: ServicePage = {
  title: "",
  intro: "",
  items: [],
};

export default function AdminServicesPage() {
  const { canDelete } = useAdminUser();
  const [page, setPage] = useState<ServicePage>(emptyPage);
  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [rootTitle, setRootTitle] = useState("");
  const [rootImage, setRootImage] = useState("");
  const [rootPreview, setRootPreview] = useState("");
  const [parentId, setParentId] = useState("");
  const [childTitle, setChildTitle] = useState("");
  const [childImage, setChildImage] = useState("");
  const [childPreview, setChildPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const roots = useMemo(() => rootServices(page.items), [page.items]);

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

  async function pickImage(file: File, kind: "root" | "child") {
    const local = URL.createObjectURL(file);
    if (kind === "root") setRootPreview(local);
    else setChildPreview(local);
    const uploaded = await adminUpload(file);
    if (kind === "root") {
      setRootImage(uploaded.path);
      setRootPreview(uploaded.url || local);
    } else {
      setChildImage(uploaded.path);
      setChildPreview(uploaded.url || local);
    }
  }

  async function addRoot(e: FormEvent) {
    e.preventDefault();
    if (!rootTitle.trim() || !rootImage) {
      toast("Нэр, зураг оруулна уу", "error");
      return;
    }
    setError("");
    try {
      await adminFetch("/mail/service/items", {
        method: "POST",
        body: JSON.stringify({ title: rootTitle.trim(), image: rootImage, parentId: 0 }),
      });
      setRootTitle("");
      setRootImage("");
      setRootPreview("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Нэмж чадсангүй");
    }
  }

  async function addChild(e: FormEvent) {
    e.preventDefault();
    if (!parentId) {
      setError("Үндсэн үйлчилгээ сонгоно уу");
      return;
    }
    if (!childTitle.trim()) {
      toast("Нэр оруулна уу", "error");
      return;
    }
    setError("");
    try {
      await adminFetch("/mail/service/items", {
        method: "POST",
        body: JSON.stringify({
          title: childTitle.trim(),
          image: childImage,
          parentId: Number(parentId),
        }),
      });
      setChildTitle("");
      setChildImage("");
      setChildPreview("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Нэмж чадсангүй");
    }
  }

  async function updateItem(
    id: number,
    payload: { title?: string; image?: string; sortOrder?: number },
    opts?: { silent?: boolean },
  ) {
    await adminFetch(
      `/mail/service/items/${id}`,
      { method: "POST", body: JSON.stringify(payload) },
      opts,
    );
    await load();
  }

  async function remove(id: number) {
    if (!confirm("Устгах уу?")) return;
    setError("");
    try {
      await adminFetch(`/mail/service/items/${id}`, { method: "DELETE" });
      if (parentId === String(id)) setParentId("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Устгаж чадсангүй");
    }
  }

  async function move(item: ServiceItem, direction: -1 | 1) {
    const siblings = item.parentId
      ? childServices(page.items, item.parentId)
      : roots;
    const index = siblings.findIndex((row) => row.id === item.id);
    const swap = siblings[index + direction];
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
      <p className="mt-2 text-sm text-muted">
        Үндсэн үйлчилгээ болон түүний доорх дэд үйлчилгээг ангилалтай адил бүртгэнэ.
      </p>

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

      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        <form onSubmit={addRoot} className="grid gap-4 border border-line bg-cream p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold">Үндсэн үйлчилгээ</p>
          <input
            required
            placeholder="Нэр"
            value={rootTitle}
            onChange={(e) => setRootTitle(e.target.value)}
            className="border border-line bg-paper px-3 py-3 text-sm"
          />
          <label className="cursor-pointer border border-dashed border-line px-3 py-6 text-center text-sm text-muted">
            {rootPreview ? "Зураг солих" : "Зураг сонгох"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (file) pickImage(file, "root");
              }}
            />
          </label>
          {rootPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={rootPreview} alt="" className="h-40 w-full object-cover" />
          ) : null}
          <button className="w-fit bg-brand px-8 py-3 text-xs uppercase tracking-[0.16em] text-cream">
            Нэмэх
          </button>
        </form>

        <form onSubmit={addChild} className="grid gap-4 border border-line bg-cream p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold">Дэд үйлчилгээ</p>
          <select
            required
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="border border-line bg-paper px-3 py-3 text-sm"
          >
            <option value="">Үндсэн үйлчилгээ сонгох</option>
            {roots.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
          <input
            required
            placeholder="Нэр"
            value={childTitle}
            onChange={(e) => setChildTitle(e.target.value)}
            disabled={!roots.length}
            className="border border-line bg-paper px-3 py-3 text-sm disabled:opacity-60"
          />
          <label className="cursor-pointer border border-dashed border-line px-3 py-6 text-center text-sm text-muted">
            {childPreview ? "Зураг солих" : "Зураг сонгох (заавал биш)"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (file) pickImage(file, "child");
              }}
            />
          </label>
          {childPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={childPreview} alt="" className="h-40 w-full object-cover" />
          ) : null}
          <button
            disabled={!roots.length}
            className="w-fit bg-brand px-8 py-3 text-xs uppercase tracking-[0.16em] text-cream disabled:opacity-60"
          >
            Дэд үйлчилгээ нэмэх
          </button>
          {!roots.length ? (
            <p className="text-xs text-muted">Эхлээд үндсэн үйлчилгээ үүсгэнэ үү.</p>
          ) : null}
        </form>
      </div>

      {error ? <p className="mt-6 text-sm text-accent">{error}</p> : null}

      <div className="mt-10 space-y-6">
        {roots.length === 0 ? (
          <p className="border border-line bg-cream px-4 py-8 text-center text-sm text-muted">
            Үйлчилгээ байхгүй.
          </p>
        ) : (
          roots.map((item, index) => {
            const children = childServices(page.items, item.id);
            return (
              <article key={item.id} className="border border-line bg-cream p-4">
                <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
                  <div className="aspect-[4/5] overflow-hidden bg-paper sm:aspect-auto sm:h-40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <input
                      defaultValue={item.title}
                      key={`${item.id}-${item.title}`}
                      className="w-full border border-line bg-paper px-3 py-2 text-sm"
                      onBlur={(e) => {
                        const next = e.target.value.trim();
                        if (next && next !== item.title) updateItem(item.id, { title: next });
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
                        disabled={index === roots.length - 1}
                        className="border border-line px-3 py-2 disabled:opacity-40"
                        onClick={() => move(item, 1)}
                      >
                        Доош
                      </button>
                      {canDelete ? (
                        <button
                          type="button"
                          className="border border-line px-3 py-2 text-accent"
                          onClick={() => remove(item.id)}
                        >
                          Устгах
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-line pt-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Дэд үйлчилгээ</p>
                  {children.length === 0 ? (
                    <p className="mt-2 text-sm text-muted">Дэд үйлчилгээ байхгүй</p>
                  ) : (
                    <ul className="mt-2 space-y-2">
                      {children.map((child, childIndex) => (
                        <li
                          key={child.id}
                          className="flex flex-wrap items-center gap-2 border border-line bg-paper px-3 py-2"
                        >
                          {child.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={child.image} alt="" className="h-10 w-10 object-cover" />
                          ) : null}
                          <input
                            defaultValue={child.title}
                            key={`${child.id}-${child.title}`}
                            className="min-w-[140px] flex-1 border border-line bg-cream px-2 py-1.5 text-sm"
                            onBlur={(e) => {
                              const next = e.target.value.trim();
                              if (next && next !== child.title) {
                                updateItem(child.id, { title: next });
                              }
                            }}
                          />
                          <label className="cursor-pointer text-xs text-brand">
                            Зураг
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                e.target.value = "";
                                if (file) replaceImage(child.id, file);
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            disabled={childIndex === 0}
                            className="text-xs text-muted disabled:opacity-40"
                            onClick={() => move(child, -1)}
                          >
                            Дээш
                          </button>
                          <button
                            type="button"
                            disabled={childIndex === children.length - 1}
                            className="text-xs text-muted disabled:opacity-40"
                            onClick={() => move(child, 1)}
                          >
                            Доош
                          </button>
                          {canDelete ? (
                            <button
                              type="button"
                              className="text-xs text-accent"
                              onClick={() => remove(child.id)}
                            >
                              Устгах
                            </button>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
