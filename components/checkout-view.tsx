"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { checkOrderPayment, createOrder, createQpayInvoice } from "@/lib/api";
import { formatMnt } from "@/lib/format";

export function CheckoutView() {
  const { items, total, clear } = useCart();
  const [status, setStatus] = useState<"idle" | "ok" | "paid" | "error">("idle");
  const [invoice, setInvoice] = useState<{ qpayUrl?: string; orderId?: number } | null>(null);
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
        <h1 className="mt-3 font-display text-4xl">Төлбөр амжилттай</h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          Таны захиалгыг хүлээн авлаа бүртгүүлсэн дугаараар холбогдох болно. Баярлалаа
        </p>
        <Link href="/shop" className="mt-8 inline-block bg-brand px-8 py-3 text-xs uppercase tracking-[0.18em] text-cream">
          Дэлгүүр рүү буцах
        </Link>
      </div>
    );
  }

  if (status === "ok") {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Захиалга</p>
        <h1 className="mt-3 font-display text-4xl">Амжилттай илгээлээ</h1>
        {invoice?.qpayUrl ? (
          <div className="mx-auto mt-8 max-w-xs">
            <p className="mb-4 text-sm text-muted">QPay-ээр төлнө үү. Төлсний дараа автоматаар баталгаажна.</p>
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
            Таны захиалгыг хүлээн авлаа. Бид тун удахгүй холбогдоно.
          </p>
        )}
        <Link href="/shop" className="mt-8 inline-block bg-brand px-8 py-3 text-xs uppercase tracking-[0.18em] text-cream">
          Дэлгүүр рүү буцах
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="font-display text-4xl">Сагс хоосон байна</h1>
        <Link href="/shop" className="mt-8 inline-block bg-brand px-8 py-3 text-xs uppercase tracking-[0.18em] text-cream">
          Дэлгүүр
        </Link>
      </div>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        orderedProducts: items.map((p) => `${p.name}:${p.quantity}`).join(","),
        price: Number(total.toFixed(2)),
      };
      try {
        const qpay = await createQpayInvoice(payload);
        setInvoice(qpay);
      } catch {
        await createOrder(payload);
      }
      clear();
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[1fr_360px] lg:px-8">
      <form onSubmit={onSubmit} className="space-y-5">
        <h1 className="font-display text-4xl">Төлбөр төлөх</h1>
        {[
          ["fb", "Facebook Name"],
          ["email", "Email"],
          ["phoneNumber", "Утас"],
        ].map(([key, label]) => (
          <label key={key} className="block text-xs uppercase tracking-[0.16em] text-muted">
            {label}
            <input
              required
              type={key === "email" ? "email" : "text"}
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              className="mt-2 w-full border border-line bg-cream px-3 py-3 text-sm outline-none focus:border-brand"
            />
          </label>
        ))}
        <label className="block text-xs uppercase tracking-[0.16em] text-muted">
          Хаяг
          <textarea
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            className="mt-2 h-24 w-full border border-line bg-cream px-3 py-3 text-sm outline-none focus:border-brand"
          />
        </label>
        <label className="block text-xs uppercase tracking-[0.16em] text-muted">
          Хүргэлтийн нөхцөл
          <textarea
            value={form.comment}
            onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
            className="mt-2 h-24 w-full border border-line bg-cream px-3 py-3 text-sm outline-none focus:border-brand"
          />
        </label>
        <button className="bg-brand px-8 py-3 text-xs uppercase tracking-[0.18em] text-cream">
          Баталгаажуулах
        </button>
        {status === "error" ? (
          <p className="text-sm text-accent">Захиалга илгээхэд алдаа гарлаа.</p>
        ) : null}
      </form>
      <aside className="h-fit bg-cream p-6">
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted">Таны захиалга</h2>
        <ul className="mt-5 space-y-3 text-sm">
          {items.map((item) => (
            <li key={String(item.id)} className="flex justify-between gap-4">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatMnt(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 flex justify-between border-t border-line pt-4 font-medium">
          <span>Нийт</span>
          <span>{formatMnt(total)}</span>
        </p>
      </aside>
    </div>
  );
}
