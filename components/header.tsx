"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { formatMnt } from "@/lib/format";
import { nav, site } from "@/lib/site";
import type { Category } from "@/lib/types";

export function Header({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const { count, items, total, open, setOpen, remove } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || !isHome || mobileOpen || open;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        solid
          ? "border-b border-line/80 bg-paper/90 text-ink shadow-[0_1px_0_rgba(28,22,20,0.04)] backdrop-blur-md"
          : "bg-transparent text-cream"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 lg:px-8">
        <Link href="/" className="shrink-0">
          {solid ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/logo.jpg" alt="Tsotan" className="h-8 w-auto object-contain sm:h-9" />
          ) : (
            <span className="font-display text-2xl tracking-wide text-cream sm:text-[1.7rem]">
              Tsotan
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
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
                  className={`text-[12px] uppercase tracking-[0.18em] transition ${
                    pathname.startsWith("/shop")
                      ? solid
                        ? "text-brand"
                        : "text-gold"
                      : solid
                        ? "text-ink/80 hover:text-brand"
                        : "text-cream/85 hover:text-cream"
                  }`}
                >
                  {item.label}
                </Link>
                {megaOpen && categories.length > 0 ? (
                  <div className="absolute left-1/2 top-full w-[560px] -translate-x-1/2 border border-line bg-cream p-8 text-ink shadow-[0_24px_80px_rgba(28,22,20,0.12)]">
                    <p className="mb-5 text-[11px] uppercase tracking-[0.22em] text-muted">
                      Ангилал
                    </p>
                    <div className="grid grid-cols-2 gap-x-10 gap-y-2">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/shop?parent=${encodeURIComponent(cat.name)}`}
                          className="py-1.5 text-sm transition hover:text-brand"
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
                className={`text-[12px] uppercase tracking-[0.18em] transition ${
                  pathname === item.href
                    ? solid
                      ? "text-brand"
                      : "text-gold"
                    : solid
                      ? "text-ink/80 hover:text-brand"
                      : "text-cream/85 hover:text-cream"
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={site.phoneHref}
            className={`hidden text-[11px] uppercase tracking-[0.16em] xl:block ${
              solid ? "text-muted hover:text-ink" : "text-cream/70 hover:text-cream"
            }`}
          >
            {site.phone}
          </a>
          <button
            onClick={() => setOpen(!open)}
            className={`relative text-[12px] uppercase tracking-[0.16em] ${
              solid ? "text-ink" : "text-cream"
            }`}
            aria-label="Сагс"
          >
            Сагс
            <span
              className={`ml-2 inline-flex h-5 min-w-5 items-center justify-center px-1 text-[10px] ${
                solid ? "bg-brand text-cream" : "bg-cream text-brand-dark"
              }`}
            >
              {count}
            </span>
          </button>
          <button
            className="flex flex-col gap-1.5 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Цэс"
          >
            <span className={`block h-px w-6 ${solid ? "bg-ink" : "bg-cream"}`} />
            <span className={`block h-px w-6 ${solid ? "bg-ink" : "bg-cream"}`} />
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-line bg-paper px-5 py-8 text-ink lg:hidden">
          <div className="flex flex-col gap-5">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm uppercase tracking-[0.16em]"
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-line pt-5">
              <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-muted">Ангилал</p>
              {categories.slice(0, 10).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?parent=${encodeURIComponent(cat.name)}`}
                  onClick={() => setMobileOpen(false)}
                  className="block py-1.5 text-sm text-muted"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {open ? (
        <div className="absolute right-0 top-full w-full max-w-md border border-line bg-cream p-6 text-ink shadow-[0_24px_80px_rgba(28,22,20,0.14)] sm:right-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-2xl">Сагс</h3>
            <button onClick={() => setOpen(false)} className="text-sm text-muted">
              Хаах
            </button>
          </div>
          {items.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">Сагсанд бараа байхгүй байна</p>
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
