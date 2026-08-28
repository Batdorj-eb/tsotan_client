"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminFetch, getAdminToken } from "@/lib/admin";
import { API_URL } from "@/lib/api";
import { childCategories, rootCategories } from "@/lib/categories";
import { toast } from "@/lib/toast";
import type { Category, Product } from "@/lib/types";

type GalleryItem = {
  id: string;
  preview: string;
  path: string | null;
  uploading?: boolean;
};

function storedPath(value: string) {
  const idx = value.indexOf("/uploads/");
  if (idx >= 0) return value.slice(idx);
  return value;
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function ProductFormPage() {
  const params = useParams<{ id?: string }>();
  const router = useRouter();
  const id = params.id && params.id !== "new" ? params.id : null;
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    nameEn: "",
    price: "",
    categoryId: "",
    description: "",
    descriptionEn: "",
    size: "",
    sizeEn: "",
    material: "",
    materialEn: "",
    instruction: "",
    instructionEn: "",
    isNew: true,
    isSpecial: false,
    stock: "",
  });

  useEffect(() => {
    adminFetch<Category[]>("/category/list").then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    if (!id) return;
    adminFetch<Product>(`/product/detail/${id}`)
      .then((p) => {
        setForm({
          name: p.name || "",
          nameEn: p.nameEn || "",
          price: String(p.price || ""),
          categoryId: String(p.categoryId || ""),
          description: p.description || "",
          descriptionEn: p.descriptionEn || "",
          size: p.size || "",
          sizeEn: p.sizeEn || "",
          material: p.material || "",
          materialEn: p.materialEn || "",
          instruction: p.instruction || "",
          instructionEn: p.instructionEn || "",
          isNew: Boolean(p.isNew),
          isSpecial: Boolean(p.isSpecial),
          stock: p.stock == null ? "" : String(p.stock),
        });
        setImages(
          (p.image || []).filter(Boolean).map((url, index) => ({
            id: `existing-${index}-${url}`,
            preview: url,
            path: storedPath(url),
          })),
        );
      })
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.preview.startsWith("blob:")) URL.revokeObjectURL(img.preview);
      });
    };
    // Only revoke leftover blobs when leaving the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList).filter((file) => file.type.startsWith("image/"));
    if (!files.length) return;

    const pending = files.map((file) => ({
      id: `${file.name}-${file.size}-${uid()}`,
      preview: URL.createObjectURL(file),
      path: null as string | null,
      uploading: true,
    }));
    setImages((prev) => [...prev, ...pending]);
    setError("");

    try {
      const data = new FormData();
      files.forEach((file) => data.append("files", file));
      const res = await fetch(`${API_URL}/product/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getAdminToken()}` },
        body: data,
      });
      const json = (await res.json()) as {
        items?: { path?: string; url?: string }[];
        path?: string;
        url?: string;
        message?: string;
      };
      if (!res.ok) throw new Error(json.message || "Зураг оруулж чадсангүй");
      const uploaded = json.items?.length
        ? json.items
        : json.path
          ? [{ path: json.path, url: json.url }]
          : [];

      setImages((prev) =>
        prev.map((img) => {
          const index = pending.findIndex((item) => item.id === img.id);
          if (index === -1) return img;
          const result = uploaded[index];
          if (img.preview.startsWith("blob:")) URL.revokeObjectURL(img.preview);
          return {
            ...img,
            path: result?.path || storedPath(result?.url || "") || null,
            preview: result?.url || img.preview,
            uploading: false,
          };
        }),
      );
    } catch (err) {
      setImages((prev) => prev.filter((img) => !pending.some((item) => item.id === img.id)));
      pending.forEach((item) => URL.revokeObjectURL(item.preview));
      setError(err instanceof Error ? err.message : "Зураг оруулж чадсангүй");
      toast(err instanceof Error ? err.message : "Зураг оруулж чадсангүй", "error");
    }
  }

  function removeImage(itemId: string) {
    setImages((prev) => {
      const target = prev.find((img) => img.id === itemId);
      if (target?.preview.startsWith("blob:")) URL.revokeObjectURL(target.preview);
      return prev.filter((img) => img.id !== itemId);
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (images.some((img) => img.uploading)) {
      toast("Зураг хуулагдаж дуустал хүлээнэ үү", "error");
      setError("Зураг хуулагдаж дуустал хүлээнэ үү");
      return;
    }
    const paths = images.map((img) => img.path).filter(Boolean) as string[];
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        categoryId: Number(form.categoryId),
        stock: form.stock === "" ? null : Number(form.stock),
        images: paths,
      };
      if (id) {
        await adminFetch(`/product/update/${id}`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch("/product/create", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Хадгалж чадсангүй");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-4xl space-y-4">
      <h1 className="font-display text-4xl">{id ? "Бараа засах" : "Шинэ бараа"}</h1>
      <p className="text-sm text-muted">Нэр болон мэдээллийг монгол, англиар оруулна.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-xs uppercase tracking-[0.14em] text-muted">
          Нэр (MN)
          <input
            required
            placeholder="Монгол нэр"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="mt-2 w-full border border-line bg-cream px-3 py-3 text-sm normal-case tracking-normal text-ink"
          />
        </label>
        <label className="block text-xs uppercase tracking-[0.14em] text-muted">
          Name (EN)
          <input
            required
            placeholder="English name"
            value={form.nameEn}
            onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
            className="mt-2 w-full border border-line bg-cream px-3 py-3 text-sm normal-case tracking-normal text-ink"
          />
        </label>
      </div>
      <input
        required
        type="number"
        placeholder="Үнэ"
        value={form.price}
        onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
        className="w-full border border-line bg-cream px-3 py-3 text-sm"
      />
      <input
        required={!id}
        type="number"
        min={0}
        placeholder="Нөөц (ширхэг)"
        value={form.stock}
        onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
        className="w-full border border-line bg-cream px-3 py-3 text-sm"
      />
      <select
        required
        value={form.categoryId}
        onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
        className="w-full border border-line bg-cream px-3 py-3 text-sm"
      >
        <option value="">Категори</option>
        {rootCategories(categories).map((root) => {
          const children = childCategories(categories, root.id);
          if (!children.length) {
            return (
              <option key={root.id} value={root.id}>
                {root.name}
              </option>
            );
          }
          return (
            <optgroup key={root.id} label={root.name}>
              <option value={root.id}>{root.name}</option>
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </optgroup>
          );
        })}
      </select>

      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.14em] text-muted">Зураг</p>
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            addFiles(e.dataTransfer.files);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center border border-dashed px-4 py-10 text-center text-sm ${
            dragging ? "border-brand bg-paper" : "border-line bg-cream"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <span className="text-ink">Файл сонгох эсвэл энд чирж оруулна уу</span>
          <span className="mt-1 text-xs text-muted">Олон зураг зэрэг нэмж болно</span>
        </label>

        {images.length ? (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {images.map((img, index) => (
              <div key={img.id} className="relative border border-line bg-cream">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.preview} alt="" className="h-36 w-full object-cover" />
                {img.uploading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-ink/40 text-xs text-cream">
                    Хуулж байна…
                  </div>
                ) : null}
                {index === 0 ? (
                  <span className="absolute left-2 top-2 bg-brand px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-cream">
                    Үндсэн
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="absolute right-2 top-2 bg-ink/80 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-cream"
                >
                  Устгах
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-xs uppercase tracking-[0.14em] text-muted">
          Тайлбар (MN)
          <textarea
            placeholder="Тайлбар"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="mt-2 h-24 w-full border border-line bg-cream px-3 py-3 text-sm normal-case tracking-normal text-ink"
          />
        </label>
        <label className="block text-xs uppercase tracking-[0.14em] text-muted">
          Description (EN)
          <textarea
            placeholder="Description"
            value={form.descriptionEn}
            onChange={(e) => setForm((f) => ({ ...f, descriptionEn: e.target.value }))}
            className="mt-2 h-24 w-full border border-line bg-cream px-3 py-3 text-sm normal-case tracking-normal text-ink"
          />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-xs uppercase tracking-[0.14em] text-muted">
          Хэмжээ (MN)
          <input
            placeholder="Хэмжээ"
            value={form.size}
            onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
            className="mt-2 w-full border border-line bg-cream px-3 py-3 text-sm normal-case tracking-normal text-ink"
          />
        </label>
        <label className="block text-xs uppercase tracking-[0.14em] text-muted">
          Size (EN)
          <input
            placeholder="Size"
            value={form.sizeEn}
            onChange={(e) => setForm((f) => ({ ...f, sizeEn: e.target.value }))}
            className="mt-2 w-full border border-line bg-cream px-3 py-3 text-sm normal-case tracking-normal text-ink"
          />
        </label>
        <label className="block text-xs uppercase tracking-[0.14em] text-muted">
          Материал (MN)
          <input
            placeholder="Материал"
            value={form.material}
            onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))}
            className="mt-2 w-full border border-line bg-cream px-3 py-3 text-sm normal-case tracking-normal text-ink"
          />
        </label>
        <label className="block text-xs uppercase tracking-[0.14em] text-muted">
          Material (EN)
          <input
            placeholder="Material"
            value={form.materialEn}
            onChange={(e) => setForm((f) => ({ ...f, materialEn: e.target.value }))}
            className="mt-2 w-full border border-line bg-cream px-3 py-3 text-sm normal-case tracking-normal text-ink"
          />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-xs uppercase tracking-[0.14em] text-muted">
          Заавар (MN)
          <textarea
            placeholder="Угаах заавар"
            value={form.instruction}
            onChange={(e) => setForm((f) => ({ ...f, instruction: e.target.value }))}
            className="mt-2 h-20 w-full border border-line bg-cream px-3 py-3 text-sm normal-case tracking-normal text-ink"
          />
        </label>
        <label className="block text-xs uppercase tracking-[0.14em] text-muted">
          Care (EN)
          <textarea
            placeholder="Care instructions"
            value={form.instructionEn}
            onChange={(e) => setForm((f) => ({ ...f, instructionEn: e.target.value }))}
            className="mt-2 h-20 w-full border border-line bg-cream px-3 py-3 text-sm normal-case tracking-normal text-ink"
          />
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.isNew}
          onChange={(e) => setForm((f) => ({ ...f, isNew: e.target.checked }))}
        />
        Шинэ бараа
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.isSpecial}
          onChange={(e) => setForm((f) => ({ ...f, isSpecial: e.target.checked }))}
        />
        Онцгой бараа
      </label>
      {error ? <p className="text-sm text-accent">{error}</p> : null}
      <button
        disabled={saving}
        className="bg-brand px-8 py-3 text-xs uppercase tracking-[0.16em] text-cream disabled:opacity-60"
      >
        {saving ? "Хадгалж байна…" : "Хадгалах"}
      </button>
    </form>
  );
}
