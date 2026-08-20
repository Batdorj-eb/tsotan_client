"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { formatMnt } from "@/lib/format";
import { nav, site } from "@/lib/site";
import type { Category } from "@/lib/types";

export function Header({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const { count, items, total, open, setOpen, remove } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="hidden border-b border-line bg-cream lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          <Link href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="Tsotan" className="h-9 w-auto" />
          </Link>
          <a href={site.phoneHref} className="text-sm tracking-wide text-ink">
            Call: <span className="font-medium">{site.phone}</span>
          </a>
        </div>
      </div>

      <div className="bg-brand text-cream">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
          <Link href="/" className="lg:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="Tsotan" className="h-8 w-auto bg-cream p-0.5" />
          </Link>
          <nav className="hidden items-center gap-8 lg:flex">
            {nav.map((item) =>
              item.mega ? (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                >
                  <Link
                    href={item.href}
                    className={`text-[13px] tracking-[0.14em] transition hover:text-gold ${
                      pathname.startsWith("/shop") ? "text-gold" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                  {megaOpen && categories.length > 0 ? (
                    <div className="absolute left-0 top-full w-[560px] border border-line bg-cream p-6 text-ink shadow-xl">
                      <p className="mb-4 text-[11px] uppercase tracking-[0.2em] text-muted">
                        Ангилал
                      </p>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/shop?parent=${encodeURIComponent(cat.name)}`}
                            className="py-1.5 text-sm hover:text-brand"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[13px] tracking-[0.14em] transition hover:text-gold ${
                    pathname === item.href ? "text-gold" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(!open)}
              className="relative px-2 py-1 text-sm tracking-wide"
              aria-label="Сагс"
            >
              Сагс
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] text-brand-dark">
                {count}
              </span>
            </button>
            <button
              className="lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Цэс"
            >
              <span className="block h-px w-6 bg-cream" />
              <span className="mt-1.5 block h-px w-6 bg-cream" />
            </button>
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-b border-line bg-cream px-5 py-6 lg:hidden">
          <div className="flex flex-col gap-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm tracking-wide text-ink"
              >
                {item.label}
              </Link>
            ))}
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?parent=${encodeURIComponent(cat.name)}`}
                onClick={() => setMobileOpen(false)}
                className="pl-3 text-sm text-muted"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {open ? (
        <div className="absolute right-0 top-full w-full max-w-md border border-line bg-cream p-6 shadow-2xl sm:right-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-2xl">Сагс</h3>
            <button onClick={() => setOpen(false)} className="text-sm text-muted">
              Хаах
            </button>
          </div>
          {items.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              Сагсанд бараа байхгүй байна
            </p>
          ) : (
            <>
              <ul className="max-h-72 space-y-4 overflow-auto">
                {items.map((item) => (
                  <li key={String(item.id)} className="flex gap-3">
                    {item.img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.img} alt="" className="h-16 w-16 object-cover" />
                    ) : (
                      <div className="h-16 w-16 bg-line" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm">{item.name}</p>
                      <p className="mt-1 text-xs text-muted">
                        {item.quantity} × {formatMnt(item.price)}
                      </p>
                    </div>
                    <button
                      onClick={() => remove(item.id)}
                      className="text-xs text-muted hover:text-accent"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-5 flex justify-between border-t border-line pt-4 text-sm">
                <span>Нийт</span>
                <span>{formatMnt(total)}</span>
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className="border border-ink py-2.5 text-center text-xs uppercase tracking-[0.16em]"
                >
                  Сагсыг харах
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="bg-brand py-2.5 text-center text-xs uppercase tracking-[0.16em] text-cream"
                >
                  Төлбөр
                </Link>
              </div>
            </>
          )}
        </div>
      ) : null}
    </header>
  );
}
