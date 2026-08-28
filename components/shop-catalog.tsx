"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { ProductCard } from "@/components/product-card";
import { childCategories, rootCategories } from "@/lib/categories";
import { slugify } from "@/lib/format";
import type { Category, Product } from "@/lib/types";

type Props = {
  products: Product[];
  categories: Category[];
  title?: string;
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
  const { t, text } = useLanguage();
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
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || (p.nameEn || "").toLowerCase().includes(q),
      );
    }
    if (sort === "low2high") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "high2low") list = [...list].sort((a, b) => b.price - a.price);
    else list = [...list].sort((a, b) => Number(Boolean(b.isSpecial)) - Number(Boolean(a.isSpecial)));
    return list;
  }, [products, parent, child, category, onlyNew, query, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (current - 1) * PAGE_SIZE + 1;
  const to = Math.min(current * PAGE_SIZE, filtered.length);
  const headingCat = child
    ? categories.find((c) => c.name === child)
    : parent
      ? categories.find((c) => c.name === parent)
      : undefined;
  const heading = headingCat
    ? text(headingCat.name, headingCat.nameEn)
    : title
      ? text(title)
      : onlyNew
        ? t("nav.new")
        : t("nav.shop");

  return (
    <div
      className={`mx-auto max-w-7xl gap-12 px-5 py-16 lg:px-8 lg:py-20 ${
        onlyNew ? "" : "grid lg:grid-cols-[220px_1fr]"
      }`}
    >
      {!onlyNew ? (
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-[11px] uppercase tracking-[0.22em] text-muted">{t("shop.search")}</h2>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={t("shop.searchPlaceholder")}
            className="mt-3 w-full border-0 border-b border-line bg-transparent px-0 py-2.5 text-sm outline-none focus:border-brand"
          />
          <h2 className="mt-12 text-[11px] uppercase tracking-[0.22em] text-muted">
            {t("shop.categories")}
          </h2>
          <ul className="mt-5 space-y-2.5">
            <li>
              <Link
                href="/shop"
                className={`text-sm ${!parent ? "text-brand" : "text-ink/70 hover:text-brand"}`}
              >
                {t("shop.all")}
              </Link>
            </li>
            {rootCategories(categories).map((cat) => {
              const children = childCategories(categories, cat.id);
              const parentActive = parent === cat.name;
              return (
                <li key={cat.id}>
                  <Link
                    href={`/shop?parent=${encodeURIComponent(cat.name)}`}
                    className={`text-sm ${
                      parentActive && !child ? "text-brand" : "text-ink/70 hover:text-brand"
                    }`}
                  >
                    {text(cat.name, cat.nameEn)}
                  </Link>
                  {children.length ? (
                    <ul className="mt-1.5 space-y-1.5 border-l border-line pl-3">
                      {children.map((kid) => (
                        <li key={kid.id}>
                          <Link
                            href={`/shop?parent=${encodeURIComponent(cat.name)}&child=${encodeURIComponent(kid.name)}`}
                            className={`text-sm ${
                              parentActive && child === kid.name
                                ? "text-brand"
                                : "text-ink/60 hover:text-brand"
                            }`}
                          >
                            {text(kid.name, kid.nameEn)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </aside>
      ) : null}

      <div>
        <div className="flex flex-col gap-4 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold">{t("shop.eyebrow")}</p>
            <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">{heading}</h1>
            <p className="mt-3 text-sm text-muted">
              {t("shop.count", { from, to, count: filtered.length })}
            </p>
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border-0 border-b border-line bg-transparent px-0 py-2 text-sm outline-none"
          >
            <option value="default">{t("shop.sortFeatured")}</option>
            <option value="low2high">{t("shop.sortLow")}</option>
            <option value="high2low">{t("shop.sortHigh")}</option>
          </select>
        </div>

        {visible.length === 0 ? (
          <p className="py-24 text-center text-muted">{t("shop.empty")}</p>
        ) : (
          <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
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
