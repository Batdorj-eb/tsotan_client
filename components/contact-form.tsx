"use client";

import { FormEvent, useState } from "react";
import { sendMail } from "@/lib/api";
import type { ContactPage } from "@/lib/types";

function phoneHref(phone?: string) {
  const digits = (phone || "").replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : undefined;
}

export function ContactForm({ page }: { page: ContactPage }) {
  const [suggest, setSuggest] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const addressLines = (page.address || "").split("\n").filter(Boolean);
  const map = page.mapEmbed?.trim();
  const tel = phoneHref(page.phone);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await sendMail({ suggest, phoneNumber });
      setSuggest("");
      setPhoneNumber("");
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Tsotan Textile</p>
        <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">
          {page.title || "Холбоо барих"}
        </h1>
        {page.intro ? (
          <p className="mt-4 text-sm leading-7 text-muted">{page.intro}</p>
        ) : null}
      </div>

      {map ? (
        <div className="mt-10 overflow-hidden border border-line">
          <iframe title="Tsotan Textile map" src={map} className="h-[420px] w-full" />
        </div>
      ) : null}

      <div className="mt-12 grid gap-12 lg:grid-cols-[280px_1fr]">
        <div className="space-y-6 text-sm leading-7">
          {page.phone ? (
            <p>
              <span className="block text-[11px] uppercase tracking-[0.2em] text-muted">Утас</span>
              <a href={tel}>{page.phone}</a>
            </p>
          ) : null}
          {page.email ? (
            <p>
              <span className="block text-[11px] uppercase tracking-[0.2em] text-muted">Имэйл</span>
              <a href={`mailto:${page.email}`}>{page.email}</a>
            </p>
          ) : null}
          {addressLines.length ? (
            <p>
              <span className="block text-[11px] uppercase tracking-[0.2em] text-muted">Хаяг</span>
              {addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          ) : null}
          {page.hours ? (
            <p>
              <span className="block text-[11px] uppercase tracking-[0.2em] text-muted">Цагийн хуваарь</span>
              {page.hours.split("\n").map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          ) : null}
        </div>
        <form onSubmit={onSubmit} className="bg-cream p-8 sm:p-12">
          <h2 className="font-display text-3xl">{page.formTitle || "Санал хүсэлт"}</h2>
          <label className="mt-8 block text-xs uppercase tracking-[0.16em] text-muted">
            Санал хүсэлт
            <input
              required
              value={suggest}
              onChange={(e) => setSuggest(e.target.value)}
              className="mt-2 w-full border border-line bg-paper px-3 py-3 text-sm outline-none focus:border-brand"
            />
          </label>
          <label className="mt-5 block text-xs uppercase tracking-[0.16em] text-muted">
            Утасны дугаар
            <input
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-2 w-full border border-line bg-paper px-3 py-3 text-sm outline-none focus:border-brand"
            />
          </label>
          <button className="mt-8 bg-brand px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-cream">
            Илгээх
          </button>
          {status === "ok" ? (
            <p className="mt-4 text-sm text-brand">Амжилттай илгээлээ.</p>
          ) : null}
          {status === "error" ? (
            <p className="mt-4 text-sm text-accent">Илгээхэд алдаа гарлаа.</p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
