"use client";

import { FormEvent, useEffect, useState } from "react";
import { adminFetch, adminUpload } from "@/lib/admin";
import { toast } from "@/lib/toast";
import type { Banner } from "@/lib/types";
import { useAdminUser } from "@/components/admin-user";

type SlideForm = {
  url: string;
  preview: string;
  eyebrow: string;
  title: string;
  titleEn: string;
  description: string;
  cta: string;
  href: string;
};

const emptySlide: SlideForm = {
  url: "",
  preview: "",
  eyebrow: "Tsotan",
  title: "",
  titleEn: "",
  description: "",
  cta: "Худалдан авах",
  href: "/shop",
};

function storedPath(value: string) {
  const idx = value.indexOf("/uploads/");
  if (idx >= 0) return value.slice(idx);
  return value;
}

function toForm(banner: Banner): SlideForm {
  return {
    url: storedPath(banner.path || banner.url),
    preview: banner.url,
    eyebrow: banner.eyebrow || "",
    title: banner.title || "",
    titleEn: banner.titleEn || "",
    description: banner.description || "",
    cta: banner.cta || "Худалдан авах",
    href: banner.href || "/shop",
  };
}

export default function AdminBannersPage() {
  const { canDelete } = useAdminUser();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [creating, setCreating] = useState<SlideForm>(emptySlide);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<SlideForm>(emptySlide);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const sliders = banners.filter((b) => b.type === "slider");
  const monthly = banners.filter((b) => b.type === "monthly");
  const videos = banners.filter((b) => b.type === "video");

  async function load() {
    setBanners(await adminFetch<Banner[]>("/banner/list-all"));
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  async function pickImage(
    file: File,
    apply: (next: { url: string; preview: string }) => void,
  ) {
    const local = URL.createObjectURL(file);
    apply({ url: "", preview: local });
    const uploaded = await adminUpload(file);
    apply({ url: uploaded.path, preview: uploaded.url || local });
  }

  async function saveSlide(e: FormEvent, form: SlideForm, id?: number | null) {
    e.preventDefault();
    if (!form.url) {
      toast("Зураг оруулна уу", "error");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        url: form.url,
        type: "slider",
        eyebrow: form.eyebrow,
        title: form.title,
        titleEn: form.titleEn,
        description: form.description,
        cta: form.cta,
        href: form.href,
      };
      if (id) {
        await adminFetch(`/banner/update/${id}`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setEditingId(null);
      } else {
        await adminFetch("/banner/add", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setCreating(emptySlide);
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Хадгалж чадсангүй");
    } finally {
      setSaving(false);
    }
  }

  async function addMonthlyFile(file: File) {
    setError("");
    try {
      const uploaded = await adminUpload(file);
      await adminFetch("/banner/add", {
        method: "POST",
        body: JSON.stringify({ url: uploaded.path, type: "monthly" }),
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Баннер нэмж чадсангүй");
    }
  }

  async function addVideoFile(file: File) {
    setError("");
    try {
      const uploaded = await adminUpload(file);
      if (videos[0]?.id) {
        await adminFetch(
          `/banner/update/${videos[0].id}`,
          {
            method: "POST",
            body: JSON.stringify({ url: uploaded.path, type: "video" }),
          },
          { success: "Видео хадгаллаа" },
        );
      } else {
        await adminFetch(
          "/banner/add",
          {
            method: "POST",
            body: JSON.stringify({ url: uploaded.path, type: "video" }),
          },
          { success: "Видео хадгаллаа" },
        );
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Видео оруулж чадсангүй");
    }
  }

  async function remove(id?: number) {
    if (!id || !confirm("Устгах уу?")) return;
    await adminFetch(`/banner/delete/${id}`, { method: "DELETE" });
    await load();
  }

  async function move(banner: Banner, direction: -1 | 1) {
    const list = sliders;
    const index = list.findIndex((item) => item.id === banner.id);
    const swap = list[index + direction];
    if (!banner.id || !swap?.id) return;
    const a = banner.sortOrder ?? index + 1;
    const b = swap.sortOrder ?? index + direction + 1;
    await Promise.all([
      adminFetch(
        `/banner/update/${banner.id}`,
        {
          method: "POST",
          body: JSON.stringify({ sortOrder: b }),
        },
        { silent: true },
      ),
      adminFetch(
        `/banner/update/${swap.id}`,
        {
          method: "POST",
          body: JSON.stringify({ sortOrder: a }),
        },
        { silent: true },
      ),
    ]);
    toast("Дараалал шинэчлэгдлээ");
    await load();
  }

  return (
    <div className="max-w-4xl space-y-12">
      <div>
        <h1 className="font-display text-4xl">Нүүр хуудас</h1>
      </div>

      {error ? <p className="text-sm text-accent">{error}</p> : null}

      <section>
        <h2 className="font-display text-2xl">Hero слайд нэмэх</h2>
        <SlideFields
          form={creating}
          saving={saving}
          submitLabel="Слайд нэмэх"
          onChange={setCreating}
          onPick={(file) =>
            pickImage(file, (next) => setCreating((f) => ({ ...f, ...next }))).catch((err) =>
              setError(err instanceof Error ? err.message : "Зураг оруулж чадсангүй"),
            )
          }
          onSubmit={(e) => saveSlide(e, creating)}
        />
      </section>

      <section>
        <h2 className="font-display text-2xl">Одоогийн слайдууд</h2>
        {sliders.length ? (
          <div className="mt-6 space-y-4">
            {sliders.map((banner, index) => (
              <div key={banner.id} className="border border-line bg-cream p-4">
                {editingId === banner.id ? (
                  <SlideFields
                    form={editForm}
                    saving={saving}
                    submitLabel="Хадгалах"
                    onChange={setEditForm}
                    onPick={(file) =>
                      pickImage(file, (next) =>
                        setEditForm((f) => ({ ...f, ...next })),
                      ).catch((err) =>
                        setError(err instanceof Error ? err.message : "Зураг оруулж чадсангүй"),
                      )
                    }
                    onSubmit={(e) => saveSlide(e, editForm, banner.id)}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <div className="flex flex-col gap-4 sm:flex-row">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={banner.url}
                      alt={banner.title || ""}
                      className="h-40 w-full object-cover sm:w-36"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-gold">
                        {banner.eyebrow || "Слайд"} {index + 1}
                      </p>
                      <h3 className="mt-1 font-display text-2xl">
                        {banner.title || "Гарчиггүй"}
                      </h3>
                      {banner.titleEn ? (
                        <p className="mt-0.5 text-sm text-muted">{banner.titleEn}</p>
                      ) : null}
                      <p className="mt-1 truncate text-sm text-muted">
                        {banner.cta || "Худалдан авах"} → {banner.href || "/shop"}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs uppercase tracking-[0.12em]">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(banner.id || null);
                            setEditForm(toForm(banner));
                          }}
                          className="text-brand"
                        >
                          Засах
                        </button>
                        <button type="button" onClick={() => move(banner, -1)} className="text-muted">
                          Дээш
                        </button>
                        <button type="button" onClick={() => move(banner, 1)} className="text-muted">
                          Доош
                        </button>
                        {canDelete ? (
                          <button type="button" onClick={() => remove(banner.id)} className="text-accent">
                            Устгах
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted">
            Слайд нэмээгүй үед нүүр хуудсанд өмнөх fallback агуулга харагдана.
          </p>
        )}
      </section>

      <section>
        <h2 className="font-display text-2xl">Доод баннер</h2>
        <p className="mt-1 text-sm text-muted">
          Нүүр хуудсын hero-ийн доор харагдана. Нэг эсвэл олон зураг нэмж болно.
        </p>
        <label className="mt-4 inline-flex cursor-pointer border border-line bg-cream px-4 py-2 text-sm">
          Файл сонгоод нэмэх
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) addMonthlyFile(file);
              e.target.value = "";
            }}
          />
        </label>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {monthly.map((banner) => (
            <div key={banner.id} className="border border-line bg-cream p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={banner.url} alt="" className="h-40 w-full object-cover" />
              {canDelete ? (
                <button
                  type="button"
                  onClick={() => remove(banner.id)}
                  className="mt-2 text-xs uppercase tracking-[0.12em] text-accent"
                >
                  Устгах
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl">Видео шторк</h2>
        <p className="mt-1 text-sm text-muted">
          Нүүр хуудсан дээр сарын баннерын дараа, үйлчилгээний өмнө тоглоно. MP4, 50MB хүртэл.
        </p>
        <label className="mt-4 inline-flex cursor-pointer border border-line bg-cream px-4 py-2 text-sm">
          {videos.length ? "Видео солих" : "Видео оруулах"}
          <input
            type="file"
            accept="video/mp4,video/webm"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) addVideoFile(file);
              e.target.value = "";
            }}
          />
        </label>
        {videos[0] ? (
          <div className="mt-6 border border-line bg-cream p-3">
            <video src={videos[0].url} className="h-56 w-full object-cover" muted controls />
            {canDelete ? (
              <button
                type="button"
                onClick={() => remove(videos[0].id)}
                className="mt-2 text-xs uppercase tracking-[0.12em] text-accent"
              >
                Устгах
              </button>
            ) : null}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">Видео оруулаагүй үед энэ хэсэг нүүр хуудсанд харагдахгүй.</p>
        )}
      </section>
    </div>
  );
}

function SlideFields({
  form,
  saving,
  submitLabel,
  onChange,
  onPick,
  onSubmit,
  onCancel,
}: {
  form: SlideForm;
  saving: boolean;
  submitLabel: string;
  onChange: (form: SlideForm) => void;
  onPick: (file: File) => void;
  onSubmit: (e: FormEvent) => void;
  onCancel?: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
      <label className="sm:col-span-2 cursor-pointer border border-dashed border-line bg-cream px-4 py-8 text-center text-sm">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onPick(file);
            e.target.value = "";
          }}
        />
        {form.preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.preview} alt="" className="mx-auto h-48 object-cover" />
        ) : (
          <span>Зураг сонгох — шууд preview харагдана</span>
        )}
      </label>
      <input
        placeholder="Жижиг гарчиг (eyebrow)"
        value={form.eyebrow}
        onChange={(e) => onChange({ ...form, eyebrow: e.target.value })}
        className="sm:col-span-2 border border-line bg-cream px-3 py-3 text-sm"
      />
      <input
        placeholder="Том гарчиг (MN)"
        value={form.title}
        onChange={(e) => onChange({ ...form, title: e.target.value })}
        className="border border-line bg-cream px-3 py-3 text-sm"
      />
      <input
        placeholder="Headline (EN)"
        value={form.titleEn}
        onChange={(e) => onChange({ ...form, titleEn: e.target.value })}
        className="border border-line bg-cream px-3 py-3 text-sm"
      />
      <input
        placeholder="Товчны бичвэр"
        value={form.cta}
        onChange={(e) => onChange({ ...form, cta: e.target.value })}
        className="border border-line bg-cream px-3 py-3 text-sm"
      />
      <input
        placeholder="Холбоос, ж: /shop"
        value={form.href}
        onChange={(e) => onChange({ ...form, href: e.target.value })}
        className="sm:col-span-2 border border-line bg-cream px-3 py-3 text-sm"
      />
      <textarea
        placeholder="Тайлбар"
        value={form.description}
        onChange={(e) => onChange({ ...form, description: e.target.value })}
        className="h-20 sm:col-span-2 border border-line bg-cream px-3 py-3 text-sm"
      />
      <div className="sm:col-span-2 flex gap-3">
        <button
          disabled={saving}
          className="bg-brand px-6 py-3 text-xs uppercase tracking-[0.16em] text-cream disabled:opacity-60"
        >
          {saving ? "Хадгалж байна…" : submitLabel}
        </button>
        {onCancel ? (
          <button type="button" onClick={onCancel} className="px-4 py-3 text-xs uppercase tracking-[0.14em] text-muted">
            Болих
          </button>
        ) : null}
      </div>
    </form>
  );
}
