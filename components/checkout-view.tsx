"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { useLanguage } from "@/components/language-provider";
import { checkOrderPayment, createQpayInvoice } from "@/lib/api";
import { Price } from "@/components/price";
import { lineUsd } from "@/lib/format";

export function CheckoutView() {
  const { items, total, clear } = useCart();
  const { t, text } = useLanguage();
  const usdTotal = items.reduce(
    (sum, item) => sum + lineUsd(item.price, item.quantity, item.usdPrice),
    0,
  );
  const [status, setStatus] = useState<"idle" | "ok" | "paid" | "error">("idle");
  const [invoice, setInvoice] = useState<{ qpayUrl?: string; orderId?: number } | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fb: "",
    email: "",
    phoneNumber: "",
    address: "",
    comment: "",
  });

  useEffect(() => {
    if (status !== "ok" || !invoice?.orderId) return;
    let stopped = false;
    const tick = async () => {
      try {
        const order = await checkOrderPayment(invoice.orderId!);
        if (!stopped && order.orderState === "PAID") setStatus("paid");
      } catch {
        /* keep waiting */
      }
    };
    tick();
    const id = setInterval(tick, 4000);
    return () => {
      stopped = true;
      clearInterval(id);
    };
  }, [status, invoice?.orderId]);

  if (status === "paid") {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">QPay</p>
        <h1 className="mt-3 font-display text-4xl">{t("checkout.paidTitle")}</h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          {t("checkout.paidBody")}
        </p>
        <Link href="/shop" className="mt-8 inline-block bg-brand px-8 py-3 text-xs uppercase tracking-[0.18em] text-cream">
          {t("checkout.backToShop")}
        </Link>
      </div>
    );
  }

  if (status === "ok") {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">{t("checkout.order")}</p>
        <h1 className="mt-3 font-display text-4xl">{t("checkout.sentTitle")}</h1>
        {invoice?.qpayUrl ? (
          <div className="mx-auto mt-8 max-w-xs">
            <p className="mb-4 text-sm text-muted">{t("checkout.qpayHint")}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                invoice.qpayUrl.startsWith("data:")
                  ? invoice.qpayUrl
                  : `data:image/png;base64,${invoice.qpayUrl}`
              }
              alt="QPay QR"
              className="mx-auto w-56"
            />
          </div>
        ) : (
          <p className="mt-4 text-sm leading-7 text-muted">
            {t("checkout.received")}
          </p>
        )}
        <Link href="/shop" className="mt-8 inline-block bg-brand px-8 py-3 text-xs uppercase tracking-[0.18em] text-cream">
          {t("checkout.backToShop")}
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="font-display text-4xl">{t("cart.empty")}</h1>
        <Link href="/shop" className="mt-8 inline-block bg-brand px-8 py-3 text-xs uppercase tracking-[0.18em] text-cream">
          {t("cart.shop")}
        </Link>
      </div>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...form,
        items: items.map((p) => ({
          id: p.id,
          name: p.name,
          quantity: p.quantity,
          price: p.price,
          img: p.img || "",
        })),
        orderedProducts: items.map((p) => `${p.name}:${p.quantity}`).join(","),
        price: Number(total.toFixed(2)),
      };
      const qpay = await createQpayInvoice(payload);
      setInvoice(qpay);
      clear();
      setStatus("ok");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("checkout.error"));
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[1fr_360px] lg:px-8">
      <form onSubmit={onSubmit} className="space-y-5">
        <h1 className="font-display text-4xl">{t("checkout.title")}</h1>
        {(
          [
            { key: "fb", label: t("checkout.name"), required: true },
            { key: "email", label: t("checkout.email"), required: false },
            { key: "phoneNumber", label: t("checkout.phone"), required: true },
          ] as const
        ).map((field) => (
          <label key={field.key} className="block text-xs uppercase tracking-[0.16em] text-muted">
            {field.label}
            <input
              required={field.required}
              type={field.key === "email" ? "email" : "text"}
              value={form[field.key]}
              onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
              className="mt-2 w-full border border-line bg-cream px-3 py-3 text-sm outline-none focus:border-brand"
            />
          </label>
        ))}
        <label className="block text-xs uppercase tracking-[0.16em] text-muted">
          {t("checkout.address")}
          <textarea
            required
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            className="mt-2 h-24 w-full border border-line bg-cream px-3 py-3 text-sm outline-none focus:border-brand"
          />
        </label>
        <label className="block text-xs uppercase tracking-[0.16em] text-muted">
          {t("checkout.note")}
          <textarea
            value={form.comment}
            onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
            className="mt-2 h-24 w-full border border-line bg-cream px-3 py-3 text-sm outline-none focus:border-brand"
          />
        </label>
        <button className="bg-brand px-8 py-3 text-xs uppercase tracking-[0.18em] text-cream">
          {t("checkout.confirm")}
        </button>
        {error ? (
          <p className="text-sm text-accent">{error}</p>
        ) : null}
      </form>
      <aside className="h-fit bg-cream p-6">
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted">{t("checkout.summary")}</h2>
        <ul className="mt-5 space-y-3 text-sm">
          {items.map((item) => (
            <li key={String(item.id)} className="flex justify-between gap-4">
              <span>
                {text(item.name, item.nameEn)} × {item.quantity}
              </span>
              <span>
                <Price
                  mnt={item.price * item.quantity}
                  usd={lineUsd(item.price, item.quantity, item.usdPrice)}
                  usdClassName="text-xs text-muted"
                />
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-6 flex justify-between border-t border-line pt-4 font-medium">
          <span>{t("checkout.total")}</span>
          <span>
            <Price mnt={total} usd={usdTotal} usdClassName="text-sm text-muted" />
          </span>
        </p>
      </aside>
    </div>
  );
}
