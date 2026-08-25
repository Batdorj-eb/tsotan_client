"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { OrderStateBadge } from "@/components/order-state-badge";
import { adminFetch } from "@/lib/admin";
import { formatDateTime, formatMnt } from "@/lib/format";
import type { Order } from "@/lib/types";

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  async function load() {
    const data = await adminFetch<Order>(`/order/detail/${id}`);
    setOrder(data);
  }

  useEffect(() => {
    if (!id) return;
    load().catch((err) => setError(err instanceof Error ? err.message : "Ачааллаж чадсангүй"));
  }, [id]);

  async function setState(state: string) {
    if (!order) return;
    await adminFetch(
      `/order/update-state/${order.id}?state=${state}`,
      {},
      { success: "Төлөв шинэчлэгдлээ" },
    );
    await load();
  }

  async function checkPay() {
    if (!order) return;
    await adminFetch(`/order/check-payment/${order.id}`, {}, { success: "Төлбөр шалгалаа" });
    await load();
  }

  if (error) {
    return (
      <div>
        <Link href="/admin/orders" className="cursor-pointer text-sm text-brand hover:underline">
          ← Захиалга
        </Link>
        <p className="mt-6 text-sm text-accent">{error}</p>
      </div>
    );
  }

  if (!order) {
    return <p className="text-sm text-muted">Уншиж байна...</p>;
  }

  const items = order.items || [];
  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <div className="max-w-4xl">
      <Link href="/admin/orders" className="cursor-pointer text-sm text-brand hover:underline">
        ← Захиалга
      </Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Захиалга #{order.id}</h1>
          <p className="mt-2 text-sm text-muted">{formatDateTime(order.createdAt)}</p>
        </div>
        <OrderStateBadge state={order.orderState} />
      </div>

      {order.orderState === "CREATED" ? (
        <div className="mt-6 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={checkPay}
            className="cursor-pointer bg-brand px-5 py-2 text-xs uppercase tracking-[0.16em] text-cream"
          >
            Төлбөр шалгах
          </button>
          <button
            type="button"
            onClick={() => setState("CANCELLED")}
            className="cursor-pointer border border-line px-5 py-2 text-xs uppercase tracking-[0.16em] text-accent"
          >
            Цуцлах
          </button>
        </div>
      ) : null}

      <section className="mt-10 grid gap-8 sm:grid-cols-2">
        <div className="border border-line bg-cream p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold">Захиалагч</p>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-muted">Нэр</dt>
              <dd className="mt-1">{order.customerName || order.fb || "—"}</dd>
            </div>
            <div>
              <dt className="text-muted">Утас</dt>
              <dd className="mt-1">{order.phoneNumber || "—"}</dd>
            </div>
            <div>
              <dt className="text-muted">Имэйл</dt>
              <dd className="mt-1">{order.email || "—"}</dd>
            </div>
            <div>
              <dt className="text-muted">Хаяг</dt>
              <dd className="mt-1 whitespace-pre-wrap">{order.address || "—"}</dd>
            </div>
            {order.comment ? (
              <div>
                <dt className="text-muted">Тэмдэглэл</dt>
                <dd className="mt-1 whitespace-pre-wrap">{order.comment}</dd>
              </div>
            ) : null}
          </dl>
        </div>
        <div className="border border-line bg-cream p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold">Захиалга</p>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-muted">Барааны тоо</dt>
              <dd className="mt-1">{itemCount} ширхэг / {items.length} нэр төрөл</dd>
            </div>
            <div>
              <dt className="text-muted">Нийт дүн</dt>
              <dd className="mt-1">{formatMnt(order.price)}</dd>
            </div>
            <div>
              <dt className="text-muted">Төлөв</dt>
              <dd className="mt-1">
                <OrderStateBadge state={order.orderState} />
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Бараа</h2>
        <div className="mt-4 divide-y divide-line border border-line bg-cream">
          {items.length ? (
            items.map((item, index) => (
              <article key={`${item.id || item.name}-${index}`} className="flex gap-4 p-4">
                <div className="h-24 w-20 shrink-0 overflow-hidden bg-paper">
                  {item.img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.img} alt={item.name} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm">{item.name}</h3>
                  <p className="mt-1 text-sm text-muted">Тоо: {item.quantity}</p>
                  {item.price != null ? (
                    <p className="mt-1 text-sm text-muted">
                      {formatMnt(item.price)} × {item.quantity} = {formatMnt(item.price * item.quantity)}
                    </p>
                  ) : null}
                </div>
              </article>
            ))
          ) : (
            <p className="p-4 text-sm text-muted">{order.orderedProducts || "Бараа байхгүй"}</p>
          )}
        </div>
        <p className="mt-4 flex justify-between text-sm">
          <span>Нийт</span>
          <span>{formatMnt(order.price)}</span>
        </p>
      </section>
    </div>
  );
}
