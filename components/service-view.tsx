"use client";

import { useLanguage } from "@/components/language-provider";
import { childServices, rootServices } from "@/lib/services";
import type { ServicePage } from "@/lib/types";

export function ServiceView({ page }: { page: ServicePage }) {
  const { t, name } = useLanguage();
  const roots = rootServices(page.items);

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
      <div className="max-w-2xl">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Tsotan Textile</p>
        <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">
          {name(page.title) || t("service.title")}
        </h1>
        {page.intro ? (
          <p className="mt-4 text-sm leading-7 text-muted">{name(page.intro)}</p>
        ) : (
          <p className="mt-4 text-sm leading-7 text-muted">{t("service.intro")}</p>
        )}
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {roots.map((item) => {
          const children = childServices(page.items, item.id);
          return (
            <article key={item.id || item.title}>
              <div className="aspect-[4/5] overflow-hidden bg-paper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={name(item.title)} className="h-full w-full object-cover" />
              </div>
              <h2 className="mt-4 text-center text-sm">{name(item.title)}</h2>
              {children.length ? (
                <ul className="mt-3 space-y-1.5 border-t border-line pt-3 text-center">
                  {children.map((child) => (
                    <li key={child.id} className="text-sm text-muted">
                      {name(child.title)}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
