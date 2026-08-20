"use client";

import { FormEvent, useState } from "react";
import { sendMail } from "@/lib/api";
import { site } from "@/lib/site";

export function ContactForm() {
  const [suggest, setSuggest] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

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
      <div className="overflow-hidden border border-line">
        <iframe
          title="Tsotan Textile map"
          src="https://maps.google.com/maps?q=ulaanbaatar%20tsotan%20textile&t=&z=16&ie=UTF8&iwloc=&output=embed"
          className="h-[420px] w-full"
        />
      </div>
      <div className="mt-12 grid gap-12 lg:grid-cols-[280px_1fr]">
        <div className="space-y-6 text-sm leading-7">
          <p>
            <span className="block text-[11px] uppercase tracking-[0.2em] text-muted">Утас</span>
            <a href={site.phoneHref}>{site.phone}</a>
          </p>
          <p>
            <span className="block text-[11px] uppercase tracking-[0.2em] text-muted">Имэйл</span>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
          <p>
            <span className="block text-[11px] uppercase tracking-[0.2em] text-muted">Хаяг</span>
            {site.address.join(", ")}
          </p>
        </div>
        <form onSubmit={onSubmit} className="bg-cream p-8 sm:p-12">
          <h2 className="font-display text-3xl">Санал хүсэлт</h2>
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
