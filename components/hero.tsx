"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { heroSlides } from "@/lib/site";
import type { Banner } from "@/lib/types";

const defaultDescription =
  "Монголын нэхмэл, хэвлэл, хатгамал болон захиалгат бүтээгдэхүүнийг нэг дороос.";

type Slide = {
  eyebrow: string;
  title: string;
  subtitle: string;
  href: string;
  cta: string;
  image: string;
  description: string;
};

function toSlides(banners: Banner[]): Slide[] {
  if (banners.length) {
    return banners.map((banner, i) => ({
      eyebrow: banner.eyebrow || heroSlides[i]?.eyebrow || "Tsotan",
      title: banner.title || heroSlides[i]?.title || "",
      subtitle: banner.subtitle || heroSlides[i]?.subtitle || "",
      href: banner.href || heroSlides[i]?.href || "/shop",
      cta: banner.cta || heroSlides[i]?.cta || "Худалдан авах",
      image: banner.url,
      description: banner.description || defaultDescription,
    }));
  }
  return heroSlides.map((slide) => ({
    ...slide,
    description: defaultDescription,
  }));
}

export function Hero({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  const slides = toSlides(banners);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(id);
  }, [index, slides.length]);

  if (!slides.length) return null;

  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="relative mx-auto min-h-[72vh] max-w-7xl">
        {slides.map((slide, i) => {
          const active = i === index;
          return (
            <div
              key={`${slide.title}-${slide.image}-${i}`}
              aria-hidden={!active}
              className={`grid min-h-[72vh] items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:px-8 ${
                active ? "relative z-10" : "pointer-events-none absolute inset-0 z-0"
              }`}
            >
              <div
                className={`max-w-xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  active ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              >
                {slide.eyebrow ? (
                  <p className="text-xs uppercase tracking-[0.32em] text-gold">
                    {slide.eyebrow}
                  </p>
                ) : null}
                {slide.title || slide.subtitle ? (
                  <h1 className="mt-4 font-display text-5xl leading-[0.95] text-ink sm:text-7xl">
                    {slide.title}
                    {slide.subtitle ? (
                      <span className="mt-2 block text-brand">{slide.subtitle}</span>
                    ) : null}
                  </h1>
                ) : null}
                {slide.description ? (
                  <p className="mt-6 max-w-md text-sm leading-7 text-muted">
                    {slide.description}
                  </p>
                ) : null}
                {slide.cta ? (
                  <Link
                    href={slide.href}
                    tabIndex={active ? 0 : -1}
                    className="mt-8 inline-flex items-center bg-brand px-8 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-cream transition hover:bg-brand-dark"
                  >
                    {slide.cta}
                  </Link>
                ) : null}
              </div>
              <div className="relative">
                <div className="absolute -left-6 top-8 hidden h-40 w-40 rounded-full bg-gold/20 blur-3xl lg:block" />
                <div
                  className={`relative aspect-[4/5] overflow-hidden bg-paper shadow-[0_30px_80px_rgba(28,22,20,0.12)] sm:aspect-[5/6] transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.image}
                    alt={slide.title || "Tsotan"}
                    className={`h-full w-full object-cover transition-transform duration-[6500ms] ease-linear ${
                      active ? "scale-110" : "scale-100"
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {slides.length > 1 ? (
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Слайд ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === index ? "w-8 bg-brand" : "w-3 bg-line hover:bg-gold"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
