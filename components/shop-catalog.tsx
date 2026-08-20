"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { slugify } from "@/lib/format";
import type { Category, Product } from "@/lib/types";

type Props = {
  products: Product[];
  categories: Category[];
  title: string;
  parent?: string;
  child?: string;
  category?: string;
  onlyNew?: boolean;
};

const PAGE_SIZE = 12;

export function ShopCatalog({
  products,
  categories,
  title,
  parent,
  child,
  category,
  onlyNew,
}: Props) {
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = onlyNew ? products.filter((p) => p.isNew) : [...products];

    if (parent) {
      list = list.filter((p) => slugify(p.parentCategory) === slugify(parent) || p.parentCategory === parent);
    }
    if (child) {
      list = list.filter((p) => slugify(p.childCategory) === slugify(child) || p.childCategory === child);
    }
    if (category) {
      list = list.filter((p) => slugify(p.category) === slugify(category) || p.category === category);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (sort === "low2high") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high2low") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, parent, child, category, onlyNew, query, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (current - 1) * PAGE_SIZE + 1;
  const to = Math.min(current * PAGE_SIZE, filtered.length);

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[240px_1fr] lg:px-8">
      {!onlyNew ? (
        <aside>
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted">Хайлт</h2>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Бараа хайх..."
            className="mt-3 w-full border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-brand"
          />
          <h2 className="mt-10 text-xs uppercase tracking-[0.2em] text-muted">
            Үндсэн категори
          </h2>
          <ul className="mt-4 space-y-2">
            <li>
              <Link
                href="/shop"
                className={`text-sm ${!parent ? "text-brand" : "text-ink hover:text-brand"}`}
              >
                Бүгд
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/shop?parent=${encodeURIComponent(cat.name)}`}
                  className={`text-sm ${
                    parent === cat.name ? "text-brand" : "text-ink hover:text-brand"
                  }`}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      ) : (
        <div className="hidden lg:block" />
      )}

      <div>
        <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Дэлгүүр</p>
            <h1 className="mt-2 font-display text-4xl text-ink">{title}</h1>
            <p className="mt-2 text-sm text-muted">
              {from}–{to} / {filtered.length} бараа
            </p>
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-line bg-cream px-3 py-2 text-sm outline-none"
          >
            <option value="default">Үнээр эрэмблэх</option>
            <option value="low2high">Үнэ — Багаас их рүү</option>
            <option value="high2low">Үнэ — Ихээс бага руу</option>
          </select>
        </div>

        {visible.length === 0 ? (
          <p className="py-24 text-center text-muted">Бараа олдсонгүй.</p>
        ) : (
          <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((product) => (
              <ProductCard key={String(product.id)} product={product} />
            ))}
          </div>
        )}

        {pages > 1 ? (
          <div className="mt-12 flex justify-center gap-2">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`h-9 w-9 text-sm ${
                  n === current ? "bg-brand text-cream" : "border border-line"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
