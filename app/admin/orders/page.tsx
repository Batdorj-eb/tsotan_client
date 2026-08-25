"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { OrderStateBadge } from "@/components/order-state-badge";
import { adminFetch } from "@/lib/admin";
import { formatMnt } from "@/lib/format";
import type { Order } from "@/lib/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  async function load() {
    const data = await adminFetch<{ content: Order[] }>("/order/search");
    setOrders(data.content || []);
  }

  useEffect(() => {
    load().catch(console.error);
    const id = setInterval(() => load().catch(console.error), 10000);
    return () => clearInterval(id);
  }, []);

  async function setState(id: number, state: string) {
    await adminFetch(
      `/order/update-state/${id}?state=${state}`,
      {},
      { success: "Төлөв шинэчлэгдлээ" },
    );
    await load();
  }

  async function checkPay(id: number) {
    await adminFetch(`/order/check-payment/${id}`, {}, { success: "Төлбөр шалгалаа" });
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-4xl">Захиалга</h1>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-[11px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="py-3">#</th>
              <th>Нэр</th>
              <th>Утас</th>
              <th>Бараа</th>
              <th>Үнэ</th>
              <th>Төлөв</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-line">
                <td className="py-3">
                  <Link href={`/admin/orders/${o.id}`} className="cursor-pointer text-brand hover:underline">
                    {o.id}
                  </Link>
                </td>
                <td>{o.customerName || o.fb || "—"}</td>
                <td>{o.phoneNumber}</td>
                <td className="max-w-xs truncate">
                  {o.items?.length
                    ? o.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")
                    : o.orderedProducts}
                </td>
                <td>{formatMnt(o.price)}</td>
                <td>
                  <OrderStateBadge state={o.orderState} />
                </td>
                <td className="space-x-2 text-right">
                  <Link href={`/admin/orders/${o.id}`} className="cursor-pointer text-brand hover:underline">
                    Дэлгэрэнгүй
                  </Link>
                  {o.orderState === "CREATED" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => checkPay(o.id)}
                        className="cursor-pointer text-brand hover:underline"
                        title="QPay-аас төлбөр орсон эсэхийг шалгана"
                      >
                        Төлбөр шалгах
                      </button>
                      <button
                        type="button"
                        onClick={() => setState(o.id, "CANCELLED")}
                        className="cursor-pointer text-accent hover:underline"
                      >
                        Цуцлах
                      </button>
                    </>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
