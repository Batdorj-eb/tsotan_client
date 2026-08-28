"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/admin";
import { childCategories, rootCategories } from "@/lib/categories";
import type { Category } from "@/lib/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [rootName, setRootName] = useState("");
  const [childName, setChildName] = useState("");
  const [parentId, setParentId] = useState("");
  const [savingRoot, setSavingRoot] = useState(false);
  const [savingChild, setSavingChild] = useState(false);
  const [error, setError] = useState("");

  const roots = useMemo(() => rootCategories(categories), [categories]);

  async function load() {
    setCategories(await adminFetch<Category[]>("/category/list"));
  }

  useEffect(() => {
    load().catch((err) => {
      setError(err instanceof Error ? err.message : "Ачааллаж чадсангүй");
    });
  }, []);

  async function addRoot(e: FormEvent) {
    e.preventDefault();
    setSavingRoot(true);
    setError("");
    try {
      await adminFetch("/category/create", {
        method: "POST",
        body: JSON.stringify({ name: rootName, parentId: 0 }),
      });
      setRootName("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Нэмж чадсангүй");
    } finally {
      setSavingRoot(false);
    }
  }

  async function addChild(e: FormEvent) {
    e.preventDefault();
    if (!parentId) {
      setError("Үндсэн ангилал сонгоно уу");
      return;
    }
    setSavingChild(true);
    setError("");
    try {
      await adminFetch("/category/create", {
        method: "POST",
        body: JSON.stringify({ name: childName, parentId: Number(parentId) }),
      });
      setChildName("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Нэмж чадсангүй");
    } finally {
      setSavingChild(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Устгах уу?")) return;
    setError("");
    try {
      await adminFetch(`/category/delete/${id}`, { method: "DELETE" });
      if (parentId === String(id)) setParentId("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Устгаж чадсангүй");
    }
  }

  return (
    <div>
      <h1 className="font-display text-4xl">Категори</h1>
      <p className="mt-2 text-sm text-muted">
        Үндсэн ангилал болон түүний доорх дэд ангилал бүртгэнэ.
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <form onSubmit={addRoot} className="border border-line bg-cream p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gold">Үндсэн ангилал</p>
          <input
            required
            value={rootName}
            onChange={(e) => setRootName(e.target.value)}
            placeholder="Жишээ: Даавуу"
            className="mt-4 w-full border border-line bg-paper px-3 py-2 text-sm"
          />
          <button
            disabled={savingRoot}
            className="mt-3 bg-brand px-4 py-2 text-xs uppercase tracking-[0.14em] text-cream disabled:opacity-60"
          >
            {savingRoot ? "Нэмэж байна…" : "Нэмэх"}
          </button>
        </form>

        <form onSubmit={addChild} className="border border-line bg-cream p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gold">Дэд ангилал</p>
          <select
            required
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="mt-4 w-full border border-line bg-paper px-3 py-2 text-sm"
          >
            <option value="">Үндсэн ангилал сонгох</option>
            {roots.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            required
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="Жишээ: Хөвөн"
            disabled={!roots.length}
            className="mt-3 w-full border border-line bg-paper px-3 py-2 text-sm disabled:opacity-60"
          />
          <button
            disabled={savingChild || !roots.length}
            className="mt-3 bg-brand px-4 py-2 text-xs uppercase tracking-[0.14em] text-cream disabled:opacity-60"
          >
            {savingChild ? "Нэмэж байна…" : "Дэд ангилал нэмэх"}
          </button>
          {!roots.length ? (
            <p className="mt-3 text-xs text-muted">Эхлээд үндсэн ангилал үүсгэнэ үү.</p>
          ) : null}
        </form>
      </div>

      {error ? <p className="mt-4 text-sm text-accent">{error}</p> : null}

      <ul className="mt-8 space-y-3">
        {roots.length === 0 ? (
          <li className="border border-line bg-cream px-4 py-8 text-center text-sm text-muted">
            Ангилал байхгүй.
          </li>
        ) : (
          roots.map((root) => {
            const children = childCategories(categories, root.id);
            return (
              <li key={root.id} className="border border-line bg-cream">
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="font-medium">{root.name}</span>
                  <button onClick={() => remove(root.id)} className="text-sm text-accent">
                    Устгах
                  </button>
                </div>
                <ul className="border-t border-line">
                  {children.length === 0 ? (
                    <li className="px-4 py-2.5 pl-8 text-sm text-muted">Дэд ангилал байхгүй</li>
                  ) : (
                    children.map((child) => (
                      <li
                        key={child.id}
                        className="flex items-center justify-between gap-3 border-t border-line/70 px-4 py-2.5 pl-8 text-sm first:border-t-0"
                      >
                        <span>{child.name}</span>
                        <button onClick={() => remove(child.id)} className="text-accent">
                          Устгах
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
