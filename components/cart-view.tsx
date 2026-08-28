"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { useLanguage } from "@/components/language-provider";
import { Price } from "@/components/price";
import { lineUsd } from "@/lib/format";

export function CartView() {
  const { items, total, setQuantity, remove } = useCart();
  const { t, text } = useLanguage();
  const usdTotal = items.reduce(
    (sum, item) => sum + lineUsd(item.price, item.quantity, item.usdPrice),
    0,
  );

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

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
      <h1 className="font-display text-4xl">{t("cart.title")}</h1>
      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line text-[11px] uppercase tracking-[0.16em] text-muted">
            <tr>
              <th className="py-3 font-medium">{t("cart.item")}</th>
              <th className="py-3 font-medium">{t("cart.price")}</th>
              <th className="py-3 font-medium">{t("cart.qty")}</th>
              <th className="py-3 font-medium">{t("cart.total")}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={String(item.id)} className="border-b border-line">
                <td className="py-5">
                  <div className="flex items-center gap-4">
                    {item.img ? (
                      <img src={item.img} alt="" className="h-16 w-16 object-cover" />
                    ) : (
                      <div className="h-16 w-16 bg-line" />
                    )}
                    <Link href={`/product/${item.id}`}>{text(item.name, item.nameEn)}</Link>
                  </div>
                </td>
                <td>
                  <Price mnt={item.price} usd={item.usdPrice} usdClassName="text-xs text-muted" />
                </td>
                <td>
                  <div className="inline-flex border border-line">
                    <button
                      className="px-2 py-1 disabled:opacity-40"
                      onClick={() => setQuantity(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="w-8 py-1 text-center">{item.quantity}</span>
                    <button
                      className="px-2 py-1 disabled:opacity-40"
                      disabled={item.stock != null && item.quantity >= item.stock}
                      onClick={() => setQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>
                  <Price
                    mnt={item.price * item.quantity}
                    usd={lineUsd(item.price, item.quantity, item.usdPrice)}
                    usdClassName="text-xs text-muted"
                  />
                </td>
                <td>
                  <button onClick={() => remove(item.id)} className="text-muted hover:text-accent">×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-10 flex flex-col items-end gap-4">
        <p className="text-lg">
          {t("cart.total")}: <Price mnt={total} usd={usdTotal} className="text-lg" usdClassName="text-sm text-muted" />
        </p>
        <Link href="/checkout" className="bg-brand px-8 py-3 text-xs uppercase tracking-[0.18em] text-cream">
          {t("cart.checkout")}
        </Link>
      </div>
    </div>
  );
}
