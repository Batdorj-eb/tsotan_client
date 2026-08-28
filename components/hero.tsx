"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { heroSlides } from "@/lib/site";
import type { Banner } from "@/lib/types";

type Slide = {
  eyebrow: string;
  title: string;
  titleEn: string;
  href: string;
  cta: string;
  image: string;
  description: string;
};

export function Hero({ banners }: { banners: Banner[] }) {
  const { t, name, text } = useLanguage();
  const [index, setIndex] = useState(0);
  const defaultDescription = t("home.heroDescription");
  const defaultCta = t("home.shopNow");

  const slides: Slide[] = banners.length
    ? banners.map((banner, i) => ({
        eyebrow: banner.eyebrow || heroSlides[i]?.eyebrow || "Tsotan",
        title: banner.title || heroSlides[i]?.title || "",
        titleEn: banner.titleEn || "",
        href: banner.href || heroSlides[i]?.href || "/shop",
        cta: name(banner.cta || heroSlides[i]?.cta) || defaultCta,
        image: banner.url,
        description: banner.description || defaultDescription,
      }))
    : heroSlides.map((slide) => ({
        eyebrow: slide.eyebrow,
        title: slide.title,
        titleEn: "",
        href: slide.href,
        cta: name(slide.cta) || defaultCta,
        image: slide.image,
        description: defaultDescription,
      }));

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(id);
  }, [index, slides.length]);

  if (!slides.length) return null;

  return (
    <section className="relative -mt-[65px] min-h-[78vh] overflow-hidden bg-brand-dark lg:min-h-[86vh]">
      {slides.map((slide, i) => {
        const active = i === index;
        return (
          <div
            key={`${slide.title}-${slide.image}-${i}`}
            aria-hidden={!active}
            className={`absolute inset-0 transition-opacity duration-[1400ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${
              active ? "z-10 opacity-100" : "z-0 opacity-0"
            }`}
          >
            <img src={slide.image} alt="" className="h-full w-full origin-center object-contain" />
            <div className="absolute inset-0 bg-brand-dark/45" />
          </div>
        );
      })}

      <div className="relative z-20 mx-auto flex min-h-[78vh] max-w-7xl items-end px-5 pb-16 pt-28 lg:min-h-[86vh] lg:px-8 lg:pb-20">
        {slides.map((slide, i) => {
          const active = i === index;
          const headline = text(slide.title, slide.titleEn);
          return (
            <div
              key={`copy-${i}`}
              className={`max-w-xl text-cream transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${
                active
                  ? "relative translate-y-0 opacity-100"
                  : "pointer-events-none absolute translate-y-3 opacity-0"
              }`}
            >
              {slide.eyebrow ? (
                <p className="text-[11px] uppercase tracking-[0.28em] text-gold">
                  {slide.eyebrow}
                </p>
              ) : null}
              <h1 className="mt-3 font-display text-4xl leading-tight sm:text-6xl">
                {headline || "Tsotan Textile"}
              </h1>
              {slide.description ? (
                <p className="mt-4 max-w-md text-sm leading-7 text-cream/75">
                  {name(slide.description) || slide.description}
                </p>
              ) : null}
              {slide.cta ? (
                <Link
                  href={slide.href}
                  tabIndex={active ? 0 : -1}
                  className="mt-8 inline-flex bg-cream px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-dark transition hover:bg-paper"
                >
                  {slide.cta}
                </Link>
              ) : null}
            </div>
          );
        })}
      </div>

      {slides.length > 1 ? (
        <div className="absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={t("home.slide", { n: i + 1 })}
              onClick={() => setIndex(i)}
              className={`h-1 rounded-full transition-all duration-500 ease-out ${
                i === index ? "w-8 bg-cream" : "w-2.5 bg-cream/40"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
