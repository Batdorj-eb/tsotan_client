"use client";

import Link from "next/link";
import { Hero } from "@/components/hero";
import { useLanguage } from "@/components/language-provider";
import { ProductCard } from "@/components/product-card";
import { VideoStory } from "@/components/video-story";
import type { Banner, Product } from "@/lib/types";

export function HomeView({
  slider,
  monthly,
  videos,
  products,
}: {
  slider: Banner[];
  monthly: Banner[];
  videos: Banner[];
  products: Product[];
}) {
  const { t } = useLanguage();
  const featured = products.filter((p) => p.isNew).slice(0, 8);
  const showcase = featured.length ? featured : products.slice(0, 8);
  const monthlySlots = [monthly[0] || null, monthly[1] || null];
  const fallbackBanners = [
    { href: "/shop-new", label: t("home.monthlyNew"), text: t("home.monthlyNewText") },
    { href: "/service", label: t("home.monthlyService"), text: t("home.monthlyServiceText") },
  ];

  return (
    <>
      <Hero banners={slider} />

      {showcase.length > 0 ? (
        <section className="py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-gold">
                  {t("home.collection")}
                </p>
                <h2 className="mt-2 font-display text-4xl">{t("home.newArrivals")}</h2>
              </div>
              <Link
                href="/shop-new"
                className="shrink-0 text-xs uppercase tracking-[0.16em] text-brand hover:text-brand-dark"
              >
                {t("home.viewAll")}
              </Link>
            </div>
            <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {showcase.map((product) => (
                <ProductCard key={String(product.id)} product={product} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto grid max-w-7xl gap-4 px-5 pb-16 sm:grid-cols-2 lg:px-8">
        {monthlySlots.map((banner, i) => {
          if (banner) {
            return (
              <Link
                key={banner.id || banner.url}
                href={banner.href || "/shop"}
                className="group overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={banner.url}
                  alt="Tsotan banner"
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-[1.02] sm:h-80"
                />
              </Link>
            );
          }

          if (monthly.length > 0) {
            return (
              <div
                key={`skeleton-${i}`}
                className="h-64 animate-pulse bg-line sm:h-80"
                aria-hidden
              />
            );
          }

          const item = fallbackBanners[i];
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-56 flex-col justify-end border border-line bg-cream p-8 transition hover:border-brand sm:min-h-80"
            >
              <p className="text-[11px] uppercase tracking-[0.2em] text-gold">{item.label}</p>
              <h3 className="mt-2 font-display text-3xl">{item.text}</h3>
            </Link>
          );
        })}
      </section>

      <VideoStory src={videos[0]?.url} />

      <section className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/aravch.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-dark/55" />
        <div className="relative mx-auto max-w-7xl px-5 py-24 text-center text-cream lg:px-8">
          <p className="text-[11px] uppercase tracking-[0.24em] text-gold">Tsotan Textile</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">{t("home.visitTitle")}</h2>
          <Link
            href="/shop"
            className="mt-8 inline-flex bg-cream px-10 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-dark hover:bg-paper"
          >
            {t("home.visitCta")}
          </Link>
        </div>
      </section>
    </>
  );
}
