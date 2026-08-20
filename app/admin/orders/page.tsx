"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin";
import { formatMnt } from "@/lib/format";

type Order = {
  id: number;
  phoneNumber: string;
  orderedProducts: string;
  price: number;
  address: string;
  orderState: string;
  createdAt: string;
};

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
    await adminFetch(`/order/update-state/${id}?state=${state}`);
    await load();
  }

  async function checkPay(id: number) {
    await adminFetch(`/order/check-payment/${id}`);
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
                <td className="py-3">{o.id}</td>
                <td>{o.phoneNumber}</td>
                <td className="max-w-xs truncate">{o.orderedProducts}</td>
                <td>{formatMnt(o.price)}</td>
                <td>{o.orderState}</td>
                <td className="space-x-2 text-right">
                  <button onClick={() => checkPay(o.id)} className="text-brand">QPay</button>
                  <button onClick={() => setState(o.id, "PAID")} className="text-brand">Paid</button>
                  <button onClick={() => setState(o.id, "CANCELLED")} className="text-accent">Цуцлах</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
