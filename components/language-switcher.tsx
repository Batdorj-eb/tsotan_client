"use client";

import { useLanguage } from "@/components/language-provider";
import { LOCALES } from "@/lib/i18n";

export function LanguageSwitcher({ light = false }: { light?: boolean }) {
  const { locale, setLocale, t } = useLanguage();
  const inactive = light ? "text-cream/55 hover:text-cream" : "text-muted hover:text-ink";
  const active = light ? "text-cream" : "text-ink";

  return (
    <div
      className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em]"
      role="group"
      aria-label={t("header.language")}
    >
      {LOCALES.map((code, i) => (
        <span key={code} className="flex items-center gap-1.5">
          {i > 0 ? (
            <span className={light ? "text-cream/30" : "text-line"} aria-hidden>
              /
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={locale === code}
            className={locale === code ? active : inactive}
          >
            {code}
          </button>
        </span>
      ))}
    </div>
  );
}
