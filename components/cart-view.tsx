"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatMnt } from "@/lib/format";

export function CartView() {
  const { items, total, setQuantity, remove } = useCart();

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

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
      <h1 className="font-display text-4xl">Таны сагс</h1>
      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line text-[11px] uppercase tracking-[0.16em] text-muted">
            <tr>
              <th className="py-3 font-medium">Бараа</th>
              <th className="py-3 font-medium">Үнэ</th>
              <th className="py-3 font-medium">Тоо</th>
              <th className="py-3 font-medium">Нийт</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={String(item.id)} className="border-b border-line">
                <td className="py-5">
                  <div className="flex items-center gap-4">
                    {item.img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.img} alt="" className="h-16 w-16 object-cover" />
                    ) : (
                      <div className="h-16 w-16 bg-line" />
                    )}
                    <Link href={`/product/${item.id}`}>{item.name}</Link>
                  </div>
                </td>
                <td>{formatMnt(item.price)}</td>
                <td>
                  <div className="inline-flex border border-line">
                    <button className="px-2 py-1" onClick={() => setQuantity(item.id, item.quantity - 1)}>−</button>
                    <span className="w-8 py-1 text-center">{item.quantity}</span>
                    <button className="px-2 py-1" onClick={() => setQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </td>
                <td>{formatMnt(item.price * item.quantity)}</td>
                <td>
                  <button onClick={() => remove(item.id)} className="text-muted hover:text-accent">×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-10 flex flex-col items-end gap-4">
        <p className="text-lg">Нийт: {formatMnt(total)}</p>
        <Link href="/checkout" className="bg-brand px-8 py-3 text-xs uppercase tracking-[0.18em] text-cream">
          Төлбөр төлөх
        </Link>
      </div>
    </div>
  );
}
